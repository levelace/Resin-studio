import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initTransaction } from "@/lib/paystack";
import { siteConfig } from "@/lib/utils";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99),
  customization: z.string().max(500).optional(),
});

const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("cart"),
    email: z.string().email(),
    phone: z.string().max(30).optional().default(""),
    shippingAddress: z.string().min(4).max(500),
    items: z.array(cartItemSchema).min(1),
    callbackPath: z.string().startsWith("/"),
  }),
  z.object({
    kind: z.literal("course"),
    courseId: z.string().cuid(),
    callbackPath: z.string().startsWith("/"),
  }),
]);

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "checkout"), 20, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many checkout attempts" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const session = await getServerSession(authOptions);
  const callbackUrl = `${siteConfig.url}${parsed.data.callbackPath}`;
  const reference = `rs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (parsed.data.kind === "course") {
    if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });
    const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
    if (!course || !course.published) return NextResponse.json({ error: "Course not available" }, { status: 404 });

    // Free course: enrol immediately, no Paystack.
    if (course.priceMinor === 0) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        update: { status: "active", source: "free" },
        create: { userId: session.user.id, courseId: course.id, source: "free" },
      });
      return NextResponse.json({ free: true });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        email: session.user.email ?? "",
        totalMinor: course.priceMinor,
        currency: course.currency,
        paystackRef: reference,
        items: {
          create: {
            kind: "course",
            courseId: course.id,
            title: course.title,
            priceMinor: course.priceMinor,
          },
        },
      },
    });

    const init = await initTransaction({
      email: session.user.email ?? "",
      amountMinor: course.priceMinor,
      currency: course.currency,
      reference,
      callbackUrl,
      metadata: { orderId: order.id, kind: "course", courseId: course.id, userId: session.user.id },
    });

    if (!init.status || !init.data) {
      return NextResponse.json({ error: init.message ?? "Paystack init failed" }, { status: 502 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paystackAuthUrl: init.data.authorization_url },
    });
    return NextResponse.json({ authorizationUrl: init.data.authorization_url });
  }

  // Cart checkout (physical goods). Dedupe productIds first — the cart groups
  // by (productId, customization), so the same productId can legitimately
  // appear multiple times in items with different customization text.
  const productIds = Array.from(new Set(parsed.data.items.map((i) => i.productId)));
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, published: true } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more items are no longer available" }, { status: 409 });
  }

  const itemsData = parsed.data.items.map((i) => {
    const p = products.find((pp) => pp.id === i.productId);
    if (!p) throw new Error("product missing");
    return {
      kind: "product" as const,
      productId: p.id,
      title: p.title,
      priceMinor: p.priceMinor,
      quantity: i.quantity,
      customization: i.customization,
    };
  });

  const totalMinor = itemsData.reduce((sum, it) => sum + it.priceMinor * it.quantity, 0);
  const currency = products[0]?.currency ?? "GHS";

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      shippingAddress: JSON.stringify({ line1: parsed.data.shippingAddress }),
      totalMinor,
      currency,
      paystackRef: reference,
      items: { create: itemsData },
    },
  });

  const init = await initTransaction({
    email: parsed.data.email.toLowerCase(),
    amountMinor: totalMinor,
    currency,
    reference,
    callbackUrl,
    metadata: { orderId: order.id, kind: "cart" },
  });

  if (!init.status || !init.data) {
    return NextResponse.json({ error: init.message ?? "Paystack init failed" }, { status: 502 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paystackAuthUrl: init.data.authorization_url },
  });
  return NextResponse.json({ authorizationUrl: init.data.authorization_url });
}
