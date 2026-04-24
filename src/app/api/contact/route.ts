import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(120),
  subject: z.string().max(160).optional().default(""),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "contact"), 3, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many messages, try later" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
