import { z } from "zod";
export const emailSchema = z.string().trim().email().max(255).transform(v => v.toLowerCase());
export const registerSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres.").max(100),
  email: emailSchema,
  senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres.").max(128)
}).strict();
// Auth.js Credentials adiciona campos internos (por exemplo, callbackUrl e csrfToken).
// Zod remove campos desconhecidos por padrão, mantendo a validação de email e senha.
export const loginSchema = z.object({ email: emailSchema, senha: z.string().min(1).max(128) });
export const taskSchema = z.object({
  titulo: z.string().trim().min(1, "Informe o título.").max(100, "Máximo de 100 caracteres."),
  descricao: z.string().trim().max(500, "Máximo de 500 caracteres.").optional().default("")
}).strict();
export const statusSchema = z.object({ situacao: z.enum(["pendente", "concluida"]) }).strict();
export const taskIdSchema = z.string().uuid();