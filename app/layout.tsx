import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TarefaFácil | Organize seu dia", description: "Gerenciador pessoal de tarefas" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR"><body><div className="app-shell"><header className="topbar"><a className="brand" href="/">✳ Tarefa<span>Fácil</span></a><div className="top-hint">Organize o que importa.</div></header><main>{children}</main><footer className="footer">TarefaFácil · Projeto acadêmico</footer></div></body></html>;
}