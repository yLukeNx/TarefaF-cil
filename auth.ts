import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [Credentials({ credentials: { email: {}, senha: {} }, async authorize(credentials) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;
    const user = await prisma.usuario.findUnique({ where: { email: parsed.data.email } });
    if (!user) return null;
    if (!(await verify(user.senhaHash, parsed.data.senha))) return null;
    return { id: user.id, name: user.nome, email: user.email };
  } })],
  callbacks: {
    async jwt({ token, user }) { if (user) token.uid = user.id; return token; },
    async session({ session, token }) { if (session.user && typeof token.uid === "string") session.user.id = token.uid; return session; }
  }
});