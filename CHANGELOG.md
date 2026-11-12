# Changelog — TarefaFácil

## 2026-11-12 — Preparação do projeto (gerado com auxílio de IA)

### Implementado no código
- Estrutura Next.js App Router, React/TypeScript e interface em português responsiva.
- Cadastro com validação Zod, normalização do e-mail, hash Argon2id e tratamento de duplicidade.
- Login/logout Auth.js com estratégia JWT, além de proteção server-side das páginas privadas.
- API para criar, listar, editar, concluir/reabrir e excluir tarefas com verificação do dono no servidor.
- Esquema Prisma e migração SQL para PostgreSQL, com chave estrangeira e índice de listagem.
- Testes unitários de validação, CI, README e roteiro de verificação de segurança.

### Decisões registradas
- Preservada a stack da spec (Next.js/Prisma/Neon/Auth.js) e o escopo de usuário único.
- Exclusão protegida por confirmação no navegador, e por autenticação/autorização no servidor.
- A API retorna 404 genérico para tarefas inexistentes ou pertencentes a outros usuários.
- `situacao` usa `concluida` no banco e “Concluída” na interface.
- Migração adiciona restrição CHECK no banco para valores permitidos de situação.

### Estado original antes da publicação
- Na geração do pacote inicial, não havia repositório, banco ou deploy; as etapas posteriores constam abaixo.
- Revisão humana e testes ponta a ponta ainda precisam ser documentados.
## 2026-11-12 — Integração GitHub, Neon e Vercel (execução assistida)

### Entregas confirmadas
- Arquivos do projeto enviados ao repositório `https://github.com/yLukeNx/TarefaF-cil`; commits verdadeiros gerados durante esta sessão. Repositório permanece privado, exigindo liberação ao professor ou alteração de visibilidade.
- Banco Neon criado no Brasil (São Paulo), projeto `tarefafacil`, com tabelas `usuarios` e `tarefas` confirmadas via consulta em `information_schema`.
- Projeto `tarefafacil` criado na Vercel e integrado ao GitHub; `DATABASE_URL` e `AUTH_SECRET` configurados como variáveis criptografadas, sem inclusão no repositório.
- Primeira compilação de produção bem-sucedida na Vercel após as correções abaixo, com rotas de cadastro, login e tarefas.
- Pipeline do GitHub comprovou 8 testes unitários passando e checagem TypeScript aprovada no commit `736dc8d`; sua etapa de lint apontou duas falhas corrigidas em commits posteriores, ainda sujeitas a nova verificação.

### Correções após revisão dos erros reais
- `5f6bc265`: corrigida sintaxe dos blocos `generator` e `datasource` do Prisma após falha de build.
- `736dc8d5`: removida importação de `const enum` Argon2id incompatível com `isolatedModules`; o hash mantém o algoritmo padrão Argon2id de `@node-rs/argon2`.
- `d8df78b1`: usado `Link` do Next.js em vez de `<a>` para navegação interna após indicação do lint.
- `b3639d56`: adiada a carga inicial de tarefas no efeito React para evitar disparo síncrono de atualização de estado apontado pelo lint.

### Verificações ainda necessárias
- Teste real ponta a ponta de cadastro → login → tarefas → logout com duas contas e persistência no Neon (não executado nesta sessão).
- Conferência externa do acesso em aba anônima, desempenho com dez usuários e checklist integral do Anexo B da apostila (não fornecida).
- Revisão humana do código e registro da aprovação pelo estudante/professor. A revisão e execução por IA não substituem revisão humana.

## 2026-11-12 — Correção de autenticação após relato de usuário

- Sintoma observado pelo usuário: cadastro concluído, mas login seguinte rejeitado; o endereço de e-mail permanece indisponível para novo cadastro porque a conta foi efetivamente criada.
- Verificação no banco: três registros de usuário existentes, todos com campo de senha em formato Argon2id; nenhum hash ou senha foi exposto no relatório.
- Diagnóstico de código: `loginSchema.strict()` rejeitava campos extras enviados pelo Auth.js Credentials, como `callbackUrl` e `csrfToken`, fazendo o login falhar antes da verificação do hash.
- Correção `3e65407`: valida email/senha e descarta campos extras, preservando os limites e a normalização de e-mail.
- Teste de regressão `b4ad189`: cobre login com campos internos adicionais e confere que eles são removidos do resultado validado.
- Pendente: validação ponta a ponta do login com a conta real no navegador após deploy; não foi necessário apagar nenhuma conta.
