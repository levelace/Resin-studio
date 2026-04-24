import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paystack";

export const runtime = "nodejs";

type PaystackEvent = {
  event: string;
  data: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer?: { email: string };
    metadata?: Record<string, unknown>;
  };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature");
  if (!verifyWebhookSignature(raw, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(raw) as PaystackEvent;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data.status === "success") {
    const ref = event.data.reference;
    const order = await prisma.order.findUnique({
      where: { paystackRef: ref },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ ok: true });

    if (order.status !== "paid") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });

      // Activate any course enrollments
      for (const it of order.items) {
        if (it.kind === "course" && it.courseId && order.userId) {
          await prisma.enrollment.upsert({
            where: { userId_courseId: { userId: order.userId, courseId: it.courseId } },
            update: { status: "active", source: "purchase" },
            create: { userId: order.userId, courseId: it.courseId, status: "active", source: "purchase" },
          });
        }
        // Decrement stock for physical products
        if (it.kind === "product" && it.productId) {
          await prisma.product.update({
            where: { id: it.productId },
            data: { stock: { decrement: it.quantity } },
          });
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
