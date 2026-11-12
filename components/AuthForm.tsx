"use client";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Props = { mode: "login" | "register" };
export default function AuthForm({ mode }: Props) {
 const router = useRouter();
 const [nome, setNome] = useState(""); const [email, setEmail] = useState(""); const [senha, setSenha] = useState("");
 const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
 async function submit(e: FormEvent) {
  e.preventDefault(); setError(""); setBusy(true);
  try {
   if (mode === "register") {
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, email, senha }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Não foi possível criar a conta."); return; }
   }
   const result = await signIn("credentials", { email, senha, redirect: false });
   if (result?.error) { setError(mode === "register" ? "Conta criada. Entre usando seus dados." : "E-mail ou senha incorretos."); if (mode === "register") router.push("/login"); return; }
   router.push("/tarefas"); router.refresh();
  } catch { setError("Falha de conexão. Tente novamente."); }
  finally { setBusy(false); }
 }
 return <div className="auth-card"><div className="eyebrow">{mode === "register" ? "CRIE SUA CONTA" : "BEM-VINDO DE VOLTA"}</div><h1>{mode === "register" ? "Comece agora." : "Bom te ver!"}</h1><p className="muted">{mode === "register" ? "Tudo que você precisa para colocar seus planos em ordem." : "Entre para continuar de onde parou."}</p><form onSubmit={submit} className="form">
 {mode === "register" && <label>Seu nome<input required minLength={2} maxLength={100} autoComplete="name" value={nome} onChange={e => setNome(e.target.value)} placeholder="Como podemos chamar você?" /></label>}
 <label>E-mail<input required type="email" maxLength={255} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@exemplo.com" /></label>
 <label>Senha<input required minLength={mode === "register" ? 8 : 1} maxLength={128} type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={senha} onChange={e => setSenha(e.target.value)} placeholder={mode === "register" ? "Mínimo 8 caracteres" : "Sua senha"} /></label>
 {error && <div className="alert" role="alert">{error}</div>}
 <button className="btn primary full" disabled={busy}>{busy ? "Aguarde..." : mode === "register" ? "Criar minha conta →" : "Entrar →"}</button></form>
 <p className="auth-switch">{mode === "register" ? "Já tem uma conta?" : "Ainda não tem conta?"} <Link href={mode === "register" ? "/login" : "/cadastro"}>{mode === "register" ? "Entrar" : "Cadastre-se"}</Link></p></div>;
}