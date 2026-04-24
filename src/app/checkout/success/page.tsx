import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";
import { Button } from "@/components/ui/button";
import { fulfillOrder } from "@/lib/fulfill-order";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Thanks for your order!",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: { reference?: string; trxref?: string };
}) {
  const reference = searchParams?.reference ?? searchParams?.trxref;
  let confirmed = false;
  let orderTitle = "Your order";

  if (reference && process.env.PAYSTACK_SECRET_KEY) {
    try {
      const verify = await verifyTransaction(reference);
      if (verify?.data?.status === "success") {
        confirmed = true;
        // Shared idempotent fulfilment: marks paid, enrols, decrements stock.
        // If the webhook already ran, this is a no-op.
        await fulfillOrder(reference);
        const order = await prisma.order.findUnique({
          where: { paystackRef: reference },
          select: { id: true },
        });
        if (order) orderTitle = `Order #${order.id.slice(-6).toUpperCase()}`;
      }
    } catch {
      // fallthrough — we'll still thank them; webhook will reconcile.
    }
  }

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <CheckCircle2 className="mb-4 h-14 w-14 text-primary" />
      <h1 className="text-3xl font-bold md:text-4xl">Thank you!</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        {confirmed
          ? `${orderTitle} is confirmed. We'll email you the details shortly.`
          : "We've received your request. If you paid, we'll confirm by email within a few minutes."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild><Link href="/dashboard">Go to my area</Link></Button>
        <Button asChild variant="outline"><Link href="/shop">Keep shopping</Link></Button>
      </div>
    </div>
  );
}
