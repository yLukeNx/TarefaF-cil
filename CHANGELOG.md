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

### Revisão, testes e publicação — PENDENTES
- O código foi gerado automaticamente e ainda precisa de revisão humana documentada.
- Não foi executado teste ponta a ponta com banco Neon nem verificação do Anexo B (apostila não fornecida).
- Nenhum repositório GitHub, histórico remoto ou deploy Vercel foi criado nesta etapa.
- Atualizar esta seção com datas, evidências, decisões e correções reais após executar verificações.