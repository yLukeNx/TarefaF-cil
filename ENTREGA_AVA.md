# TarefaFácil — Entrega acadêmica (12/11/2026)

## Identificação
**Projeto:** TarefaFácil — Gerenciador Web de Tarefas Pessoais  
**Aplicação publicada:** https://tarefafacil.vercel.app  
**Repositório público (código e commits):** https://github.com/yLukeNx/TarefaF-cil  
**Aprovação automática de CI (exemplo verificado):** https://github.com/yLukeNx/TarefaF-cil/actions/runs/43262511265

## Descrição
O TarefaFácil é um gerenciador pessoal de tarefas em português. Oferece cadastro, login e logout, criação, consulta, edição, conclusão/reabertura e exclusão de tarefas; cada usuário possui seu painel privado. O aplicativo utiliza Next.js, React, TypeScript, Auth.js Credentials, Argon2id para hash das senhas, Prisma ORM e PostgreSQL hospedado no Neon. A aplicação está hospedada na Vercel com HTTPS.

## Evidências verificadas
- Repositório GitHub com visibilidade **pública**, verificada pelo conector GitHub em 12/11/2026.
- Vercel: última implantação de produção consultada com estado **READY**; domínio `tarefafacil.vercel.app` associado ao projeto.
- Neon: esquema de produção com tabelas `usuarios` (5 colunas) e `tarefas` (7 colunas), incluindo vínculo por chave estrangeira, restrição de situação e unicidade de e-mail.
- GitHub Actions: execução de CI com resultado **success**, incluindo verificação TypeScript, testes automatizados de validação e lint.
- Fluxos manuais: o usuário confirmou cadastro, acesso após correção do login, criar/consultar/editar/concluir/reabrir/excluir tarefa, persistência após logout e login, e separação visual de tarefas entre duas contas diferentes. Esses itens são **relatos de teste manual do usuário**, não testes E2E automatizados.

## Segurança — revisão estática de código
- As rotas `/api/tasks` exigem `auth()` e retornam 401 sem sessão.
- A listagem filtra por `usuarioId` da sessão e as atualizações/exclusões filtram por `id` da tarefa e `usuarioId`.
- A rota privada `/tarefas` redireciona usuários sem sessão ao login.
- Dados são validados no servidor via Zod; as consultas usam Prisma.
- A conexão ao banco e a chave de autenticação são fornecidas à Vercel via variáveis de ambiente criptografadas, e não há arquivo real `.env` na árvore do GitHub. Arquivos `.env.example` e CI contêm somente valores de exemplo.
- Essa revisão **não substitui** o teste negativo de acesso direto à API por outro usuário.

## Itens ainda não comprovados
1. Testes manuais de valores inválidos em todos os formulários e confirmação de exclusão cancelada.
2. Testes diretos de autorização em API tentando manipular o ID de tarefa de outra conta.
3. Medição do RNF07: 10 usuários simultâneos, com pelo menos 95% das consultas abaixo de 3 segundos.
4. Inspeção da interface de 360 px e verificação integral do Anexo B da apostila.
5. Aprovação prévia da proposta pelo professor, caso seja exigida no enunciado.

## Arquivos incluídos no repositório
- `spec.md` — especificação, modelo de dados e critérios de aceite.
- `README.md` — recursos, tecnologias, instruções de execução e links.
- `CHANGELOG.md` — alterações e correções efetivamente realizadas.
- `CHECKLIST.md` — evidências e verificações pendentes.
- `prisma/schema.prisma` e `prisma/migrations/` — modelo e migração SQL.
- `tests/` e `.github/workflows/ci.yml` — testes unitários e verificações automatizadas.

## Nota técnica
A estrutura inicial do banco em produção foi criada via SQL; ainda não foi conciliado o histórico `_prisma_migrations` do Prisma no banco em uso. A replicação em banco vazio segue as migrações existentes. Evite executar `prisma migrate deploy` no banco de produção existente até registrar a migração inicial no histórico.

## Transparência do processo
A aplicação foi implementada e corrigida com auxílio de IA (ChatGPT), com testes funcionais manuais relatados pelo usuário. A referência ao Google Antigravity na especificação inicial descreve a intenção de planejamento, não comprova seu uso efetivo. Os resultados apresentados como pendentes não foram simulados nem considerados aprovados.

**Importante:** o enunciado literal do AVA e o Anexo B completo não foram disponibilizados nesta conversa. Este documento reúne o conjunto de entregáveis verificáveis do projeto, mas pode precisar de adequação às exigências específicas do professor.
