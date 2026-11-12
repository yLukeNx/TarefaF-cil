import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { taskSchema } from "@/lib/validation";
import { failure, invalid, readJson } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return failure("Faça login para continuar.", 401);
  try {
    const tasks = await prisma.tarefa.findMany({ where: { usuarioId: session.user.id }, orderBy: [{ criadoEm: "desc" }, { id: "desc" }] });
    return Response.json(tasks, { headers: { "Cache-Control": "no-store" } });
  } catch { return failure("Não foi possível consultar as tarefas.", 500); }
}
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return failure("Faça login para continuar.", 401);
  try {
    const parsed = taskSchema.safeParse(await readJson(request));
    if (!parsed.success) return invalid(parsed.error);
    const task = await prisma.tarefa.create({ data: { ...parsed.data, descricao: parsed.data.descricao || null, usuarioId: session.user.id } });
    return Response.json(task, { status: 201 });
  } catch { return failure("Não foi possível salvar a tarefa.", 400); }
}