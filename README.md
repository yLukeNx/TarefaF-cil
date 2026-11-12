# TarefaFácil

Gerenciador de tarefas pessoais com interface em português. **Next.js + TypeScript + Auth.js + Prisma + PostgreSQL (Neon)**.

## Projeto publicado (2026-11-12)

- Aplicação: https://tarefafacil.vercel.app
- Código e histórico: https://github.com/yLukeNx/TarefaF-cil (repositório público, verificado em 12/11/2026)
- Banco de produção: Neon PostgreSQL, projeto `tarefafacil`, tabelas `usuarios` e `tarefas` criadas em 12/11/2026.
- Variáveis sensíveis configuradas como criptografadas na Vercel.
- Compilação da aplicação na Vercel confirmada. Os sete fluxos principais e o isolamento visual entre duas contas foram confirmados pelo usuário em navegador; verificações adicionais de segurança, entradas negativas, carga RNF07 e Anexo B permanecem pendentes.

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

`npm run typecheck`, `npm test` e `npm run lint` para verificações de desenvolvimento. Testes de aceitação manual dos fluxos principais e isolamento visual foram relatados pelo usuário. Testes automatizados de validação e checagens de build/lint/typecheck passaram em GitHub Actions. Testes diretos de API com usuários diferentes, casos negativos e avaliação de desempenho continuam necessários; veja `CHECKLIST.md`.

## Publicação gratuita: GitHub + Neon + Vercel

1. Para nova instalação, crie um banco gratuito em https://neon.tech e copie a URL de conexão PostgreSQL com SSL. O ambiente de produção deste projeto já está configurado.
2. Para nova instalação, crie um repositório GitHub e registre commits reais. O projeto entregue está em um repositório público com histórico real de correções.
3. Execute localmente `npm install`, `npm run typecheck`, `npm test` e `npm run build` após configurar o banco. Gere e envie `package-lock.json` por meio do commit de instalação, para CI reproduzível.
4. No terminal: `git init`, `git add .`, `git commit -m "feat: estrutura inicial e spec"`, `git branch -M main`, `git remote add origin URL_DO_REPOSITORIO`, `git push -u origin main`.
5. Na Vercel, clique em **Add New → Project**, importe o repositório e configure `DATABASE_URL`, `AUTH_SECRET` e, se necessário, `AUTH_TRUST_HOST=true` no ambiente Production. O ambiente publicado já possui as duas variáveis essenciais configuradas.
6. Configure `DATABASE_URL` no terminal local e execute `npx prisma migrate deploy` **contra o banco de produção**, uma vez. Use com cuidado: confirme a URL antes de migrar.
7. Abra https://tarefafacil.vercel.app numa janela anônima. O usuário confirmou manualmente os fluxos principais e o isolamento visual; revise os cenários ainda pendentes no `CHECKLIST.md`.
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
## Entrega no AVA

- [Resumo de entrega e evidências](ENTREGA_AVA.md)
- [Especificação](spec.md)
- [Histórico de desenvolvimento](CHANGELOG.md)
- [Checklist de testes e segurança](CHECKLIST.md)

**Nota de transparência:** o planejamento inicial cita o Google Antigravity como ferramenta proposta; a implementação e as correções desta entrega foram conduzidas com auxílio do ChatGPT e revisão pelo usuário de funcionalidades no navegador. A aprovação prévia do professor e a verificação do Anexo B não estão documentadas e não devem ser presumidas.
