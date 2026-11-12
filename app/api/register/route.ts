import { hash } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { failure, invalid, readJson } from "@/lib/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await readJson(request));
    if (!parsed.success) return invalid(parsed.error);
    const { nome, email, senha } = parsed.data;
    const senhaHash = await hash(senha, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
    await prisma.usuario.create({ data: { nome, email, senhaHash } });
    return Response.json({ message: "Conta criada. Entre para continuar." }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") return failure("Este e-mail já está cadastrado.", 409);
    return failure("Não foi possível criar a conta.", 400);
  }
}