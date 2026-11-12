# Checklist de entrega e segurança

**Estado: verificação parcial em 2026-11-12.** `[x]` representa verificação automatizada ou confirmação expressa do usuário; as observações distinguem a origem da evidência. O Anexo B integral da apostila não foi fornecido; confrontar este checklist com o Anexo B antes de entregar.

## Infraestrutura

- [ ] Repositório criado no GitHub e acessível ao professor
- [x] Histórico de commits representa etapas reais de geração, envio e correção (não comprova revisão humana)
- [x] Banco Neon criado e conectado; tabelas aplicadas e verificadas via SQL (migração Prisma ainda precisa ser baselinada)
- [x] Variáveis `DATABASE_URL` e `AUTH_SECRET` definidas como criptografadas no ambiente Vercel
- [x] Build de produção com estado READY na Vercel e domínio HTTPS configurado (acesso anônimo ainda não conferido)
- [x] URL do repositório: https://github.com/yLukeNx/TarefaF-cil (privado; falta liberar ao professor)
- [x] URL da aplicação: https://tarefafacil-ylukenxs-projects.vercel.app

## Fluxo de aceite

- [ ] CA01: criar conta (cadastro real confirmado pelo usuário); validação de dados incorretos e e-mail duplicado ainda sem teste completo documentado
- [ ] CA02: login válido e logout confirmados pelo usuário; login inválido e acesso negado após logout ainda não verificados integralmente
- [ ] CA03: criação de tarefa confirmada pelo usuário; testes de rejeição de título vazio ou >100 caracteres ainda pendentes
- [ ] CA04: visualização da tarefa criada confirmada pelo usuário; ordenação por data e estado vazio ainda sem verificação documentada
- [x] CA05: editar tarefa e confirmar persistência após sair e entrar novamente (teste manual informado pelo usuário em 2026-11-12)
- [x] CA06: concluir e reabrir tarefa (teste manual informado pelo usuário em 2026-11-12)
- [ ] CA07: exclusão confirmada pelo usuário; teste de cancelar a confirmação ainda pendente
- [ ] Dois usuários separados: isolamento visual entre contas confirmado manualmente pelo usuário em 2026-11-12; tentativa de acesso direto por URL/API a tarefas da outra conta ainda não testada
- [ ] Inserir payloads inválidos diretamente na API, sem gravar dados
- [ ] Testar em tela de 360 px e desktop
- [ ] Testar em aba anônima, sem instalação

## Segurança

- [ ] Nenhum segredo, token, senha, `.env` ou credencial com valor real foi versionado
- [ ] Verificar `git grep -nE '(postgresql://|sk_|AUTH_SECRET=)'` e analisar achados
- [x] Senhas persistidas como hash Argon2id; três registros confirmados por consulta agregada (sem ler hashes nem senhas)
- [ ] Operações de tarefa exigem sessão e conferência do ID do dono no servidor
- [ ] Campos validados no servidor (inclusive adulteração direta de payload)
- [ ] SQL sem concatenação de entradas de usuários
- [ ] Mensagens não revelam stack trace ou existência de e-mail no login
- [ ] HTTPS ativo na aplicação publicada
- [ ] Conferir política de senhas e checklist completo do Anexo B da apostila
- [ ] Avaliar proteção adicional contra abuso de cadastros e tentativas de login antes de expor a público

## Qualidade e medição

- [x] `npm run typecheck` sem erros (GitHub Actions, commit 736dc8d)
- [x] `npm test` sem falhas (8 testes de validação, GitHub Actions, commit 736dc8d)
- [x] `npm run lint` sem erros (GitHub Actions, execução bem-sucedida no commit ecf5143b)
- [x] `npm run build` bem-sucedido (Vercel, implantação READY de 2026-11-12)
- [ ] RNF07: ao menos 95% de consultas concluídas em até 3 s com 10 usuários simultâneos; registrar método e resultados
- [ ] Revisão humana de código, correções e decisões registradas com evidências no changelog
## Execução manual relatada pelo usuário em 2026-11-12

- [x] Entrou com conta existente após correção do login.
- [x] Criou tarefa com título e descrição.
- [x] Visualizou a tarefa na lista.
- [x] Editou o título.
- [x] Marcou como concluída.
- [x] Reabriu como pendente.
- [x] Saiu e entrou novamente; a tarefa continuou salva.
- [x] Excluiu a tarefa e confirmou que desapareceu.

**Fonte da evidência:** confirmação expressa do usuário na conversa; não foram coletadas capturas de tela, gravações nem resultados de um executor E2E. Este relato não substitui os cenários adicionais de segurança, validação negativa e isolamento entre usuários.

## Teste de isolamento visual entre contas — 2026-11-12

- [x] Usuário confirmou que duas contas distintas não exibem as tarefas uma da outra no painel, após criar tarefas em ambas e alternar as sessões.
- [ ] Teste de autorização contra acesso direto a tarefas de outro usuário por URL e API continua pendente.

**Evidência:** confirmação relatada pelo usuário nesta conversa; não houve execução independente de teste E2E nem coleta de capturas de tela.
