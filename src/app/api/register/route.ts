import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isAdminEmail } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(120).transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "register"), 5, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts, try later" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "That email is already registered" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: isAdminEmail(email) ? "admin" : "student",
    },
  });

  return NextResponse.json({ ok: true });
}
