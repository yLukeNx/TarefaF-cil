import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function Home() {
 const session = await auth();
 if (session?.user) redirect("/tarefas");
 return <section className="hero"><div className="eyebrow">SEU ESPAÇO PARA PRODUZIR MAIS</div><h1>Menos bagunça.<br/><em>Mais conquistas.</em></h1><p>Reúna suas tarefas, acompanhe o progresso e mantenha o foco no que precisa ser feito. Simples, seguro e gratuito.</p><div className="hero-actions"><Link className="btn primary" href="/cadastro">Começar gratuitamente <span>→</span></Link><Link className="btn secondary" href="/login">Já tenho conta</Link></div><div className="feature-row"><span>✓ Tarefas organizadas</span><span>✓ Acesso seguro</span><span>✓ Dados salvos na nuvem</span></div></section>;
}