import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { taskIdSchema, taskSchema, statusSchema } from "@/lib/validation";
import { failure, invalid, readJson } from "@/lib/http";
export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };
async function owner(context: Ctx) {
  const session = await auth();
  const { id } = await context.params;
  return { userId: session?.user?.id, id, valid: taskIdSchema.safeParse(id).success };
}
export async function PUT(request: Request, context: Ctx) {
  const { userId, id, valid } = await owner(context);
  if (!userId) return failure("Faça login para continuar.", 401);
  if (!valid) return failure("Tarefa não encontrada.", 404);
  try {
    const parsed = taskSchema.safeParse(await readJson(request));
    if (!parsed.success) return invalid(parsed.error);
    const result = await prisma.tarefa.updateMany({ where: { id, usuarioId: userId }, data: { ...parsed.data, descricao: parsed.data.descricao || null } });
    if (!result.count) return failure("Tarefa não encontrada.", 404);
    return Response.json({ message: "Tarefa atualizada." });
  } catch { return failure("Não foi possível editar a tarefa.", 400); }
}
export async function PATCH(request: Request, context: Ctx) {
  const { userId, id, valid } = await owner(context);
  if (!userId) return failure("Faça login para continuar.", 401);
  if (!valid) return failure("Tarefa não encontrada.", 404);
  try {
    const parsed = statusSchema.safeParse(await readJson(request));
    if (!parsed.success) return invalid(parsed.error);
    const result = await prisma.tarefa.updateMany({ where: { id, usuarioId: userId }, data: parsed.data });
    if (!result.count) return failure("Tarefa não encontrada.", 404);
    return Response.json({ message: "Situação atualizada." });
  } catch { return failure("Não foi possível atualizar a situação.", 400); }
}
export async function DELETE(_request: Request, context: Ctx) {
  const { userId, id, valid } = await owner(context);
  if (!userId) return failure("Faça login para continuar.", 401);
  if (!valid) return failure("Tarefa não encontrada.", 404);
  try {
    const result = await prisma.tarefa.deleteMany({ where: { id, usuarioId: userId } });
    if (!result.count) return failure("Tarefa não encontrada.", 404);
    return Response.json({ message: "Tarefa excluída." });
  } catch { return failure("Não foi possível excluir a tarefa.", 500); }
}