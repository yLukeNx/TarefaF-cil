"use client";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { signOut } from "next-auth/react";
type Task = { id: string; titulo: string; descricao: string | null; situacao: "pendente" | "concluida"; criadoEm: string };
export default function TaskDashboard({ name }: { name: string }) {
 const [tasks,setTasks] = useState<Task[]>([]); const [loading,setLoading] = useState(true); const [busy,setBusy] = useState(false);
 const [error,setError] = useState(""); const [notice,setNotice] = useState("");
 const [filter,setFilter] = useState<"todas"|"pendente"|"concluida">("todas");
 const [title,setTitle] = useState(""); const [description,setDescription] = useState(""); const [editing,setEditing] = useState<string|null>(null);
 const load = useCallback(async () => {
  try { const res = await fetch("/api/tasks", { cache: "no-store" }); if (!res.ok) throw new Error(); setTasks(await res.json()); setError(""); }
  catch { setError("Não foi possível carregar suas tarefas."); } finally { setLoading(false); }
 }, []);
 useEffect(() => { void load(); }, [load]);
 const filtered = useMemo(() => tasks.filter(t => filter === "todas" || t.situacao === filter), [tasks, filter]);
 const done = tasks.filter(t => t.situacao === "concluida").length;
 async function change(url: string, method: string, data?: object) {
  const res = await fetch(url, { method, headers: data ? { "Content-Type": "application/json" } : undefined, body: data ? JSON.stringify(data) : undefined });
  if (!res.ok) { const result = await res.json().catch(() => ({})); throw new Error(result.error ?? "Operação não realizada."); }
 }
 async function submit(e: FormEvent) {
  e.preventDefault(); setError(""); setNotice(""); setBusy(true);
  try {
   await change(editing ? `/api/tasks/${editing}` : "/api/tasks", editing ? "PUT" : "POST", { titulo: title, descricao: description });
   setNotice(editing ? "Tarefa atualizada com sucesso." : "Tarefa criada com sucesso."); setTitle(""); setDescription(""); setEditing(null); await load();
  } catch(err) { setError(err instanceof Error ? err.message : "Erro ao salvar."); } finally { setBusy(false); }
 }
 function edit(task: Task) { setEditing(task.id); setTitle(task.titulo); setDescription(task.descricao ?? ""); window.scrollTo({ top: 0, behavior: "smooth" }); }
 function cancel() { setEditing(null); setTitle(""); setDescription(""); }
 async function toggle(task: Task) {
  setError(""); setNotice(""); setBusy(true);
  try { await change(`/api/tasks/${task.id}`, "PATCH", { situacao: task.situacao === "pendente" ? "concluida" : "pendente" }); await load(); }
  catch(err) { setError(err instanceof Error ? err.message : "Erro ao alterar."); } finally { setBusy(false); }
 }
 async function remove(task: Task) {
  if (!window.confirm(`Excluir a tarefa “${task.titulo}”? Esta ação não pode ser desfeita.`)) return;
  setError(""); setBusy(true);
  try { await change(`/api/tasks/${task.id}`, "DELETE"); if (editing === task.id) cancel(); setNotice("Tarefa excluída."); await load(); }
  catch(err) { setError(err instanceof Error ? err.message : "Erro ao excluir."); } finally { setBusy(false); }
 }
 return <div className="dashboard"><div className="dash-heading"><div><div className="eyebrow">SEU PAINEL PESSOAL</div><h1>Olá, {name.split(" ")[0]} <span className="wave">✳</span></h1><p className="muted">Um passo de cada vez. Você está no caminho certo.</p></div><button className="btn secondary small" onClick={() => void signOut({ callbackUrl: "/login" })}>Sair da conta</button></div>
 <div className="stats"><div className="stat"><span>Total de tarefas</span><strong>{tasks.length}</strong><small>Todas as atividades</small></div><div className="stat"><span>Em andamento</span><strong>{tasks.length-done}</strong><small>Próximos passos</small></div><div className="stat"><span>Concluídas</span><strong>{done}</strong><small>Suas conquistas</small></div></div>
 <div className="dashboard-grid"><section className="panel creator"><div className="section-caption">{editing ? "EDITANDO TAREFA" : "NOVA TAREFA"}</div><h2>{editing ? "Atualizar tarefa" : "O que vamos fazer?"}</h2><p className="muted">Registre sua próxima atividade.</p><form className="form" onSubmit={submit}><label>Título da tarefa<input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex.: Estudar para a prova" /></label><label>Descrição (opcional)<textarea rows={5} maxLength={500} value={description} onChange={e => setDescription(e.target.value)} placeholder="Adicione detalhes para lembrar depois..." /><small>{description.length}/500 caracteres</small></label><button disabled={busy} className="btn primary full">{editing ? "Salvar alterações" : "+ Adicionar tarefa"}</button>{editing && <button type="button" className="btn secondary full" onClick={cancel}>Cancelar edição</button>}</form></section>
 <section className="panel task-panel"><div className="list-title"><div><div className="section-caption">MINHA ORGANIZAÇÃO</div><h2>Suas tarefas</h2></div><span className="count">{tasks.length} no total</span></div><div className="tabs" role="group" aria-label="Filtrar tarefas"><button aria-pressed={filter === "todas"} className={filter === "todas" ? "active" : ""} onClick={() => setFilter("todas")}>Todas</button><button aria-pressed={filter === "pendente"} className={filter === "pendente" ? "active" : ""} onClick={() => setFilter("pendente")}>Pendentes</button><button aria-pressed={filter === "concluida"} className={filter === "concluida" ? "active" : ""} onClick={() => setFilter("concluida")}>Concluídas</button></div>
 {error && <div className="alert" role="alert">{error}</div>}{notice && <div className="success" role="status">{notice}</div>}
 {loading ? <div className="empty">Carregando tarefas...</div> : filtered.length === 0 ? <div className="empty"><div className="empty-icon">☑</div><strong>{tasks.length === 0 ? "Nenhuma tarefa cadastrada" : "Nenhuma tarefa neste filtro"}</strong><p>Que tal adicionar uma nova atividade?</p></div> : <div className="task-list">{filtered.map(task => <article className={`task ${task.situacao === "concluida" ? "completed" : ""}`} key={task.id}><button disabled={busy} className="check" aria-label={task.situacao === "pendente" ? "Marcar como concluída" : "Marcar como pendente"} title="Alterar situação" onClick={() => void toggle(task)}>{task.situacao === "concluida" ? "✓" : ""}</button><div className="task-content"><div className="task-header"><h3>{task.titulo}</h3><span className={`status ${task.situacao}`}>{task.situacao === "pendente" ? "Pendente" : "Concluída"}</span></div>{task.descricao && <p>{task.descricao}</p>}<div className="task-bottom"><small>Criada em {new Date(task.criadoEm).toLocaleDateString("pt-BR")}</small><div className="task-actions"><button disabled={busy} onClick={() => edit(task)}>Editar</button><button disabled={busy} className="danger" onClick={() => void remove(task)}>Excluir</button></div></div></div></article>)}</div>}</section></div></div>;
}