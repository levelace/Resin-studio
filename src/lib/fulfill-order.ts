import { prisma } from "@/lib/prisma";

/**
 * Idempotently fulfils an order: marks it paid, activates course enrolments,
 * and decrements product stock. Safe to call from both the Paystack webhook
 * and the checkout success page — whichever fires first wins, the second
 * becomes a no-op.
 *
 * The atomicity comes from a conditional `updateMany` (WHERE status != "paid"):
 * exactly one concurrent caller gets `count === 1` and runs the fulfilment,
 * everyone else sees `count === 0` and exits.
 */
export async function fulfillOrder(paystackRef: string): Promise<{
  fulfilled: boolean;
  orderId: string | null;
}> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { paystackRef },
      include: { items: true },
    });
    if (!order) return { fulfilled: false, orderId: null };

    // Compare-and-swap: only one caller wins this update.
    const flip = await tx.order.updateMany({
      where: { id: order.id, status: { not: "paid" } },
      data: { status: "paid" },
    });
    if (flip.count === 0) return { fulfilled: false, orderId: order.id };

    for (const it of order.items) {
      if (it.kind === "course" && it.courseId && order.userId) {
        await tx.enrollment.upsert({
          where: { userId_courseId: { userId: order.userId, courseId: it.courseId } },
          update: { status: "active", source: "purchase" },
          create: {
            userId: order.userId,
            courseId: it.courseId,
            status: "active",
            source: "purchase",
          },
        });
      }
      if (it.kind === "product" && it.productId) {
        // Conditional decrement: only if we still have at least `quantity`
        // in stock. If stock has drifted (oversell race), we clamp to zero
        // rather than letting it go negative — the order is already paid,
        // so we honour it and flag for manual review via `needsReview`.
        const dec = await tx.product.updateMany({
          where: { id: it.productId, stock: { gte: it.quantity } },
          data: { stock: { decrement: it.quantity } },
        });
        if (dec.count === 0) {
          await tx.product.updateMany({
            where: { id: it.productId },
            data: { stock: 0 },
          });
          await tx.order.update({
            where: { id: order.id },
            data: { needsReview: true },
          });
        }
      }
    }

    return { fulfilled: true, orderId: order.id };
  });
}
