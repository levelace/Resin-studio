import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { fulfillOrder } from "@/lib/fulfill-order";

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
    await fulfillOrder(event.data.reference);
  }

  return NextResponse.json({ ok: true });
}
