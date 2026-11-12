# Checklist de entrega e segurança

**Estado inicial: NÃO EXECUTADO.** Preencha `[x]` somente depois de realizar cada teste de verdade. O Anexo B integral da apostila não foi fornecido; confrontar este checklist com o Anexo B antes de entregar.

## Infraestrutura

- [ ] Repositório criado no GitHub e acessível ao professor
- [ ] Histórico de commits representa etapas reais de revisão e desenvolvimento
- [ ] Banco Neon criado, conectado e migrado
- [ ] Variáveis `DATABASE_URL` e `AUTH_SECRET` definidas no ambiente Vercel
- [ ] Sistema publicado na Vercel via HTTPS
- [ ] URL do repositório: ___________________
- [ ] URL da aplicação: ___________________

## Fluxo de aceite

- [ ] CA01: criar conta, validar dados incorretos e e-mail duplicado
- [ ] CA02: login válido, inválido, logout e acesso negado após logout
- [ ] CA03: criar tarefa e rejeitar título vazio/maior que 100 caracteres
- [ ] CA04: listar tarefas por data e exibir estado vazio
- [ ] CA05: editar e persistir depois de atualizar e refazer login
- [ ] CA06: concluir e reabrir tarefa
- [ ] CA07: excluir com confirmação; cancelar mantém tarefa
- [ ] Dois usuários separados: um não vê nem altera tarefas do outro via URL/API
- [ ] Inserir payloads inválidos diretamente na API, sem gravar dados
- [ ] Testar em tela de 360 px e desktop
- [ ] Testar em aba anônima, sem instalação

## Segurança

- [ ] Nenhum segredo, token, senha, `.env` ou credencial com valor real foi versionado
- [ ] Verificar `git grep -nE '(postgresql://|sk_|AUTH_SECRET=)'` e analisar achados
- [ ] Senhas persistidas como hash Argon2id; nunca recuperar ou exibir senha
- [ ] Operações de tarefa exigem sessão e conferência do ID do dono no servidor
- [ ] Campos validados no servidor (inclusive adulteração direta de payload)
- [ ] SQL sem concatenação de entradas de usuários
- [ ] Mensagens não revelam stack trace ou existência de e-mail no login
- [ ] HTTPS ativo na aplicação publicada
- [ ] Conferir política de senhas e checklist completo do Anexo B da apostila
- [ ] Avaliar proteção adicional contra abuso de cadastros e tentativas de login antes de expor a público

## Qualidade e medição

- [ ] `npm run typecheck` sem erros
- [ ] `npm test` sem falhas
- [ ] `npm run lint` sem erros
- [ ] `npm run build` bem-sucedido
- [ ] RNF07: ao menos 95% de consultas concluídas em até 3 s com 10 usuários simultâneos; registrar método e resultados
- [ ] Revisão humana de código, correções e decisões registradas com evidências no changelog