import { describe, it, expect } from "vitest";
import { registerSchema, taskSchema, statusSchema, loginSchema } from "../lib/validation";
describe("cadastro", () => {
 it("normaliza e-mail", () => expect(registerSchema.parse({nome:"Maria",email:"MARIA@EXEMPLO.COM",senha:"12345678"}).email).toBe("maria@exemplo.com"));
 it("rejeita senha curta", () => expect(registerSchema.safeParse({nome:"Maria",email:"maria@exemplo.com",senha:"123"}).success).toBe(false));
 it("rejeita nome curto", () => expect(registerSchema.safeParse({nome:"M",email:"maria@exemplo.com",senha:"12345678"}).success).toBe(false));
 it("aceita campos internos do Auth.js sem aceitar valores inválidos de email/senha", () => {
   const result = loginSchema.safeParse({ email:"  MARIA@EXEMPLO.COM ", senha:"senha-segura", callbackUrl:"/tarefas", csrfToken:"token-interno" });
   expect(result.success).toBe(true);
   if (result.success) expect(result.data).toEqual({ email:"maria@exemplo.com", senha:"senha-segura" });
 });
 it("rejeita email inválido", () => expect(loginSchema.safeParse({email:"nao-email",senha:"12345678"}).success).toBe(false));
});
describe("tarefas", () => {
 it("aceita título válido", () => expect(taskSchema.safeParse({titulo:"Estudar"}).success).toBe(true));
 it("rejeita título vazio", () => expect(taskSchema.safeParse({titulo:" "}).success).toBe(false));
 it("rejeita descrição longa", () => expect(taskSchema.safeParse({titulo:"Oi",descricao:"a".repeat(501)}).success).toBe(false));
 it("rejeita situação desconhecida", () => expect(statusSchema.safeParse({situacao:"arquivada"}).success).toBe(false));
});