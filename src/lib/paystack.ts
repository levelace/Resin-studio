// Thin Paystack REST client. Paystack supports GHS/NGN/USD/ZAR and Mobile Money
// (MTN, Telecel, AirtelTigo) in Ghana automatically when currency=GHS.
// Docs: https://paystack.com/docs/api

import crypto from "node:crypto";

const API = "https://api.paystack.co";

function secret() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

type InitPayload = {
  email: string;
  amountMinor: number; // pesewas
  currency?: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

type InitResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export async function initTransaction(p: InitPayload): Promise<InitResponse> {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: p.email,
      amount: p.amountMinor,
      currency: p.currency ?? "GHS",
      reference: p.reference,
      callback_url: p.callbackUrl,
      metadata: p.metadata ?? {},
    }),
    cache: "no-store",
  });
  return (await res.json()) as InitResponse;
}

type VerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
    metadata?: Record<string, unknown>;
  };
};

export async function verifyTransaction(reference: string): Promise<VerifyResponse> {
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
    cache: "no-store",
  });
  return (await res.json()) as VerifyResponse;
}

/** Verifies `x-paystack-signature` header against raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const hmac = crypto
    .createHmac("sha512", secret())
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
  } catch {
    return false;
  }
}
