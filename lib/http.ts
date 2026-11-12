import { NextResponse } from "next/server";
import { ZodError } from "zod";
export function failure(message: string, status: number) { return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } }); }
export function invalid(error: unknown) {
  if (error instanceof ZodError) return failure(error.issues[0]?.message ?? "Dados inválidos.", 400);
  return failure("Não foi possível processar a solicitação.", 500);
}
export async function readJson(req: Request): Promise<unknown> {
  const raw = await req.text();
  if (raw.length > 8192) throw new Error("Corpo muito grande");
  return JSON.parse(raw);
}