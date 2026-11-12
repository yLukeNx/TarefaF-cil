# TarefaFácil

Gerenciador de tarefas pessoais com interface em português. **Next.js + TypeScript + Auth.js + Prisma + PostgreSQL (Neon)**.

## Projeto publicado (2026-11-12)

- Aplicação: https://tarefafacil-ylukenxs-projects.vercel.app
- Código e histórico: https://github.com/yLukeNx/TarefaF-cil (repositório privado; liberar acesso ao professor ou tornar público)
- Banco de produção: Neon PostgreSQL, projeto `tarefafacil`, tabelas `usuarios` e `tarefas` criadas em 12/11/2026.
- Variáveis sensíveis configuradas como criptografadas na Vercel.
- Compilação da aplicação na Vercel confirmada. A execução completa dos sete fluxos pelo navegador e o checklist integral de segurança ainda precisam de conferência humana antes da entrega.

**Nota sobre o banco existente:** a estrutura inicial de produção foi aplicada diretamente no Neon usando a SQL da migração. O histórico `_prisma_migrations` não foi inicializado pelo Prisma CLI; antes de executar `prisma migrate deploy` nesse banco, é preciso conciliar/baselinar a migração inicial para evitar erro de tabelas já existentes. Em bancos novos e vazios, o comando de migração do passo 4 continua apropriado.

## Funcionalidades

Cadastro com validação e hash Argon2id; login/logout; criação, consulta, edição, conclusão/reabertura e exclusão confirmada de tarefas. Todas as operações privadas conferem o usuário autenticado no servidor.

## Como executar

1. Instale **Node.js 22** e tenha um banco PostgreSQL (recomendado: Neon).
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local` e preencha `DATABASE_URL` e `AUTH_SECRET` (gere com `npx auth secret` ou `openssl rand -base64 32`). **Nunca envie credenciais ao GitHub.**
4. Execute `npx prisma migrate deploy` (garanta que o `DATABASE_URL` esteja disponível ao Prisma; Prisma CLI lê `.env`, não `.env.local` automaticamente: crie `.env` local ignorado no Git, ou exporte a variável no terminal).
5. Execute `npm run dev` e abra http://localhost:3000.

## Testes

`npm run typecheck`, `npm test` e `npm run lint` para verificações de desenvolvimento. Testes de integração e aceite com banco real, contas distintas e navegador são **obrigatórios antes da entrega**, veja `CHECKLIST.md`.

## Publicação gratuita: GitHub + Neon + Vercel

1. Crie um banco gratuito em https://neon.tech e copie a URL de conexão PostgreSQL com SSL.
2. Crie um repositório no GitHub. Faça commits **reais à medida que revisar e modificar o projeto**; não invente histórico.
3. Execute localmente `npm install`, `npm run typecheck`, `npm test` e `npm run build` após configurar o banco. Gere e envie `package-lock.json` por meio do commit de instalação, para CI reproduzível.
4. No terminal: `git init`, `git add .`, `git commit -m "feat: estrutura inicial e spec"`, `git branch -M main`, `git remote add origin URL_DO_REPOSITORIO`, `git push -u origin main`.
5. Na Vercel, clique em **Add New → Project**, importe o repositório e configure `DATABASE_URL`, `AUTH_SECRET` e `AUTH_TRUST_HOST=true` no ambiente Production. Deploy utilizando framework Next.js.
6. Configure `DATABASE_URL` no terminal local e execute `npx prisma migrate deploy` **contra o banco de produção**, uma vez. Use com cuidado: confirme a URL antes de migrar.
7. Abra o endereço `https://...vercel.app` numa janela anônima, cadastre dois usuários diferentes e execute os testes do `CHECKLIST.md`.
8. Registre os resultados verificáveis em `CHANGELOG.md`. Inclua as URLs reais no formulário de entrega.

**Importante:** este projeto já está hospedado, mas hospedar não substitui testar. Execute o checklist em navegador anônimo e documente os resultados.

## API

`POST /api/register` cria conta; `GET, POST /api/tasks` listam/criam; `PUT, PATCH, DELETE /api/tasks/:id` editam, trocam status, excluem. Rotas de tarefas exigem sessão e restringem alterações a `id + usuarioId`. Os dados devem ser usados pelo frontend, não por um cliente sem autenticação.

## Segurança

Hash Argon2id; cookies de sessão gerenciados pelo Auth.js; validação Zod server-side; checagem de propriedade em toda operação; consultas Prisma; variáveis de ambiente e `.gitignore`. Endpoints com erro não expõem SQL nem segredos. **Antes da produção:** conferir também o Anexo B da apostila e o checklist local.

## Documentos

- `spec.md`: planejamento original e acompanhamento de implementação.
- `CHANGELOG.md`: decisões e pendências, sem alegar validação humana inexistente.
- `CHECKLIST.md`: roteiro de testes/segurança/deploy para preenchimento real.