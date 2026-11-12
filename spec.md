# TarefaFácil — Gerenciador de Tarefas Pessoais

> **Especificação inicial — Fase 1 (planejamento)**  
> **Versão:** 1.0 | **Situação:** proposta para apresentação e aprovação do professor antes do desenvolvimento.  
> **Escopo:** aplicação web educacional, sem pagamentos, notificações, equipes ou painel administrativo.

## 1. Objetivo

O **TarefaFácil** é um sistema web que ajuda estudantes e outras pessoas a organizarem suas tarefas pessoais em um único lugar. Após criar uma conta e fazer login, cada usuário pode cadastrar, consultar, editar, marcar como concluídas e excluir suas próprias tarefas. As informações ficam salvas em um banco de dados para continuar disponíveis em acessos posteriores.

## 2. Usuários

- **Visitante (não autenticado):** pode abrir as páginas de cadastro e login, criar uma conta e entrar com e-mail e senha; não pode consultar ou alterar tarefas.
- **Usuário cadastrado (autenticado):** pode encerrar sua sessão, criar tarefas, visualizar somente as próprias tarefas, editar seus dados, alterar sua situação e excluí-las; não pode acessar tarefas de outras pessoas.

**Limite de escopo:** não haverá perfil de administrador. Todos os cadastros feitos pela página pública terão o mesmo papel de usuário comum.

## 3. Casos de uso principais

- **UC01 — Cadastrar conta:** um visitante informa nome, e-mail e senha e cria uma conta.
- **UC02 — Entrar e sair do sistema:** um usuário cadastrado entra com e-mail e senha e pode encerrar a sessão.
- **UC03 — Criar tarefa:** um usuário autenticado informa título e descrição opcional e salva a tarefa.
- **UC04 — Consultar tarefas:** um usuário autenticado visualiza a lista das tarefas que cadastrou, incluindo situação e data de criação.
- **UC05 — Editar tarefa:** um usuário autenticado altera o título e/ou a descrição de uma tarefa sua.
- **UC06 — Alterar situação da tarefa:** um usuário autenticado muda uma tarefa própria de “pendente” para “concluída”, ou de volta para “pendente”.
- **UC07 — Excluir tarefa:** um usuário autenticado remove uma tarefa sua após confirmação.

**Fluxo de negócio principal:** cadastrar conta → fazer login → criar tarefa → consultar a tarefa persistida no banco → editar e/ou concluir → consultar o estado atualizado → excluir, se desejar. O usuário continua vendo suas tarefas salvas mesmo após sair e entrar novamente.

## 4. Requisitos funcionais (RF)

- **RF01 (UC01) — Cadastro:** o sistema deve permitir que um visitante cadastre uma conta com **nome obrigatório de 2 a 100 caracteres**, **e-mail válido e único** (sem diferenciar maiúsculas e minúsculas) e **senha de 8 a 128 caracteres**. Se algum dado for inválido ou o e-mail já estiver cadastrado, o cadastro deve ser recusado e uma mensagem compreensível deve ser exibida.
- **RF02 (UC02) — Login e logout:** o sistema deve autenticar o usuário com e-mail e senha, recusar credenciais incorretas e permitir logout. Após o logout, páginas e operações de tarefas devem exigir novo login.
- **RF03 (UC03) — Criar tarefa:** o usuário autenticado deve conseguir salvar uma tarefa com **título obrigatório de 1 a 100 caracteres**, **descrição opcional de até 500 caracteres**, situação inicial **“pendente”** e vínculo com sua conta. O sistema deve confirmar a criação somente depois da gravação no banco.
- **RF04 (UC04) — Consultar tarefas:** o sistema deve listar somente as tarefas do usuário autenticado, exibindo **título, descrição (quando houver), situação e data de criação**, ordenadas da mais recente para a mais antiga. Se não houver tarefas, deve mostrar a mensagem **“Nenhuma tarefa cadastrada”**.
- **RF05 (UC05) — Editar tarefa:** o sistema deve permitir que o dono de uma tarefa altere seu título e sua descrição, respeitando os mesmos limites de RF03, e deve persistir as alterações no banco. Solicitações para editar tarefas de outras contas devem ser negadas.
- **RF06 (UC06) — Alterar situação:** o sistema deve permitir que o dono altere a situação de uma tarefa somente entre **“pendente”** e **“concluída”** e salve a nova situação no banco. Alterações em tarefas de outras contas devem ser negadas.
- **RF07 (UC07) — Excluir tarefa:** o sistema deve permitir que o dono exclua uma tarefa **depois de confirmar a ação**. A tarefa excluída não deve aparecer em novas consultas; tentativas de excluir tarefas de outras contas devem ser negadas.

**Regras gerais para RF03 a RF07:** exigir sessão autenticada; consultar e alterar tarefas sempre pelo **ID da tarefa + ID do usuário autenticado**, verificados no servidor. A edição, alteração de situação e exclusão de tarefa inexistente devem retornar mensagem clara, sem expor detalhes internos.

## 5. Requisitos não funcionais (RNF)

- **RNF01 — Proteção das senhas:** armazenar senhas **somente como hash seguro com Argon2id**, nunca como texto puro; no login, conferir a senha informada contra o hash armazenado, sem tentar recuperar a senha original.
- **RNF02 — Validação no servidor:** validar **todos os campos de todos os formulários e ações** no servidor, inclusive cadastro, login, criação, edição e mudança de situação; a validação no navegador pode complementar, mas não substituir, a do servidor.
- **RNF03 — Consultas seguras:** usar Prisma ORM com consultas parametrizadas; **nunca** montar SQL concatenando dados fornecidos pelo usuário, para reduzir o risco de SQL injection.
- **RNF04 — Autenticação e autorização:** proteger páginas e operações privadas no servidor; um usuário não pode consultar, editar, concluir ou excluir tarefa de outra pessoa, mesmo alterando manualmente a URL ou o ID enviado.
- **RNF05 — Segredos e HTTPS:** usar **HTTPS** em produção; manter `DATABASE_URL` e `AUTH_SECRET` em variáveis de ambiente, fora do código versionado; configurar `.gitignore` para ignorar arquivos locais como `.env` e `.env.local`.
- **RNF06 — Erros seguros:** exibir mensagens úteis ao usuário, mas não revelar senhas, hash, consultas SQL, detalhes de conexão ou rastros de erro do servidor; falhas de login não devem indicar se um e-mail específico existe.
- **RNF07 — Desempenho:** com banco disponível e até **10 usuários simultâneos** em teste, pelo menos **95%** das operações de consulta de tarefas devem concluir em até **3 segundos**, medidos do envio da requisição até a resposta do servidor.
- **RNF08 — Usabilidade:** interface em português, responsiva para celular (a partir de **360 px** de largura) e computador; campos com rótulos e mensagens de erro legíveis; exclusão sempre exige confirmação.

## 6. Modelo de dados (DER simples)

O banco relacional terá **duas tabelas**, suficientes para todos os requisitos funcionais.

### Tabela `usuarios`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID | Chave primária |
| `nome` | VARCHAR(100) | Obrigatório |
| `email` | VARCHAR(255) | Obrigatório, único, normalizado para letras minúsculas |
| `senha_hash` | TEXT | Obrigatório; hash Argon2id, nunca senha original |
| `criado_em` | TIMESTAMPTZ | Obrigatório; preenchido automaticamente |

### Tabela `tarefas`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID | Chave primária |
| `usuario_id` | UUID | Obrigatório; chave estrangeira para `usuarios.id` |
| `titulo` | VARCHAR(100) | Obrigatório, 1 a 100 caracteres |
| `descricao` | VARCHAR(500) | Opcional, no máximo 500 caracteres |
| `situacao` | VARCHAR(20) | Obrigatória; somente `pendente` ou `concluida`; padrão `pendente` |
| `criado_em` | TIMESTAMPTZ | Obrigatório; preenchido automaticamente |
| `atualizado_em` | TIMESTAMPTZ | Obrigatório; atualizado em cada modificação |

**Relacionamento (DER textual):**

```text
USUARIOS                              TAREFAS
+---------------------+               +------------------------+
| id (PK)             | 1           N | id (PK)                |
| nome                |---------------| usuario_id (FK)        |
| email (UNIQUE)      |               | titulo                 |
| senha_hash          |               | descricao              |
| criado_em           |               | situacao               |
+---------------------+               | criado_em              |
                                      | atualizado_em          |
                                      +------------------------+
```

- **Cardinalidade:** um usuário pode possuir **zero ou muitas** tarefas; cada tarefa pertence a **exatamente um** usuário.
- **Integridade:** `tarefas.usuario_id` referencia `usuarios.id` por chave estrangeira; é criado índice em `(usuario_id, criado_em)` para apoiar a listagem das tarefas de cada usuário.
- **Persistência:** cadastro e login utilizam `usuarios`; criação, listagem, edição, conclusão e exclusão utilizam `tarefas`. O logout encerra a sessão de autenticação e não exige tabela adicional.
- **Valores exibidos:** `pendente` aparece como “Pendente”, e `concluida` aparece como “Concluída”.

## 7. Critérios de aceite

- **CA01 (RF01 / UC01):** **Dado que** um visitante preenche nome, e-mail ainda não registrado e senha dentro dos limites, **quando** envia o cadastro, **então** o sistema salva uma conta em `usuarios` com senha protegida por hash; **dado que** o e-mail já existe ou os dados estão inválidos, **quando** tenta cadastrar, **então** a conta não é criada e o erro é informado.
- **CA02 (RF02 / UC02):** **Dado que** a conta existe, **quando** o usuário informa e-mail e senha corretos, **então** consegue acessar a área de tarefas; **dado que** a senha está incorreta, **quando** tenta entrar, **então** o login é recusado; **dado que** está autenticado, **quando** faz logout e tenta acessar uma página privada, **então** precisa entrar novamente.
- **CA03 (RF03 / UC03):** **Dado que** um usuário está autenticado, **quando** envia uma tarefa com título válido e descrição opcional, **então** o registro é salvo em `tarefas` com seu `usuario_id` e situação `pendente`; **quando** envia um título vazio ou maior que 100 caracteres, **então** nada é gravado.
- **CA04 (RF04 / UC04):** **Dado que** há tarefas pertencentes a dois usuários, **quando** um deles abre a lista, **então** vê apenas as próprias tarefas, ordenadas da mais recente para a mais antiga; **dado que** não possui tarefas, **quando** abre a lista, **então** vê “Nenhuma tarefa cadastrada”.
- **CA05 (RF05 / UC05):** **Dado que** o usuário possui uma tarefa, **quando** altera seu título e salva, **então** a mudança aparece após atualizar a página e após fazer novo login; **dado que** tenta editar tarefa de outro usuário, **quando** envia a solicitação, **então** a alteração é negada e nenhum dado é modificado.
- **CA06 (RF06 / UC06):** **Dado que** uma tarefa própria está pendente, **quando** o usuário a marca como concluída, **então** o banco passa a registrar `concluida` e a lista mostra “Concluída”; **quando** volta a marcar como pendente, **então** a situação retorna a `pendente`; a operação é negada para tarefas de outros usuários.
- **CA07 (RF07 / UC07):** **Dado que** o usuário possui uma tarefa, **quando** solicita a exclusão e confirma, **então** a tarefa é removida do banco e não aparece mais na lista; **quando** cancela a confirmação, **então** ela permanece; uma tentativa de excluir tarefa de outra conta é negada.

**Verificações transversais:** para cada formulário, enviar dados inválidos diretamente ao servidor e confirmar que a validação impede gravações; acessar rota privada sem login e tentar manipular o ID de uma tarefa de outra conta, confirmando que o servidor nega o acesso.

## 8. Decisão de stack e deploy

| Camada | Escolha | Motivo |
|---|---|---|
| Interface e servidor | **Next.js (React) + TypeScript**, usando rotas e ações no servidor Node.js | Permite construir páginas e operações de banco no mesmo projeto; é compatível com a Vercel. |
| Banco de dados | **PostgreSQL no Neon** | Guarda permanentemente usuários e tarefas na nuvem e permite relacionamento por chave estrangeira. |
| Acesso aos dados | **Prisma ORM** | Facilita o mapeamento das duas tabelas e usa consultas parametrizadas. |
| Login e sessão | **Auth.js (Credentials) + Argon2id**, com sessão protegida por cookie | Evita implementar gerenciamento de sessão do zero; verifica hash de senha no servidor. Usaremos estratégia JWT para a sessão, sem tabela extra. |
| Desenvolvimento com IA | **Google Antigravity**, no modo **Agent-Assisted**; **Review-Driven** para autenticação e dados pessoais | Segue a orientação de revisão humana da apostila. |
| Versionamento | **Git + GitHub** | Mantém histórico de mudanças e permite integrar o projeto ao deploy. |
| Publicação | **Vercel** para Next.js e **Neon** para PostgreSQL | A Vercel executa a aplicação Next.js e acessa o banco externo pela `DATABASE_URL`; não exige servidor PHP. |

**Como será publicado:** criar o repositório no GitHub, importar o projeto na Vercel, criar o banco no Neon, configurar as variáveis `DATABASE_URL` e `AUTH_SECRET` na Vercel, aplicar as migrações do banco e testar o endereço HTTPS publicado. Arquivos `.env` locais não serão enviados ao repositório. Cada alteração enviada à branch principal poderá gerar novo deploy; as configurações de conexão deverão existir também no ambiente de produção.

**Por que essa escolha é viável:** são apenas **duas tabelas**, **um papel de usuário** e **sete requisitos funcionais**, sem calendário de horários, pagamentos ou múltiplos perfis. A stack Next.js + Neon é compatível com a hospedagem sugerida pela apostila. O tema e esta especificação serão apresentados ao professor para aprovação **antes de iniciar o desenvolvimento**, conforme a Fase 1 da apostila.

**Processo de implementação e verificação:** desenvolver um requisito por vez referenciando esta spec; revisar o plano e o diff propostos pelo agente; executar os critérios de aceite manualmente; verificar o checklist de segurança do Anexo B; registrar decisões e correções no `CHANGELOG.md`; executar commits e pushes manualmente após revisão; antes do deploy, conferir variáveis de ambiente, `.gitignore`, README, testes e ausência de credenciais no GitHub. Alterações relevantes futuras serão registradas no changelog, sem apagar silenciosamente as decisões iniciais.


---

## 9. Estado da implementação (atualização de 12/11/2026)

O código entregue neste pacote implementa os sete requisitos funcionais e as proteções previstas em seções anteriores, sujeito a testes com banco real. A interface usa uma API REST interna com as rotas `POST /api/register`, `GET/POST /api/tasks` e `PUT/PATCH/DELETE /api/tasks/:id`. O armazenamento usa os modelos `Usuario` e `Tarefa` mapeados para `usuarios` e `tarefas`.

**Diferença em relação ao plano:** a confirmação de exclusão é feita por caixa de diálogo nativa do navegador. O esquema SQL contém também uma restrição `CHECK` para a situação.

**Validação pendente:** não houve publicação pública, testes com credenciais reais, prova de RNF07, checklist completo do Anexo B ou revisão humana documentada. `CHECKLIST.md` contém a lista de verificação necessária. O texto inicial desta spec permanece como histórico do planejamento, e não como afirmação de que o professor já aprovou o projeto.

## 10. Acompanhamento pós-publicação — 12/11/2026

Esta seção atualiza o registro histórico da seção 9, que descrevia a fase inicial de geração do código, **antes** da conexão com as contas do usuário.

- Código versionado em `https://github.com/yLukeNx/TarefaF-cil` (privado na última verificação; é necessário conceder acesso ao professor ou tornar público, com autorização do proprietário).
- Produção na Vercel em `https://tarefafacil-ylukenxs-projects.vercel.app`, último estado de deploy `READY` observado em 12/11/2026.
- Neon PostgreSQL criado em São Paulo com tabelas `usuarios` e `tarefas`; credenciais de conexão configuradas como variáveis criptografadas na Vercel.
- Após falha inicial de autenticação, o login foi corrigido e confirmado pelo usuário. O pipeline automatizado do GitHub chegou a `success`, incluindo verificação TypeScript, testes unitários e lint.
- O usuário confirmou sete verificações manuais no navegador: criar, listar, editar, concluir, reabrir, reentrar e verificar persistência, excluir uma tarefa. O registro detalhado está em `CHECKLIST.md` e `CHANGELOG.md`.
- **Ainda pendentes:** subcasos negativos de validação, avaliação por dois usuários separados, análise de desempenho RNF07, confirmação do checklist Anexo B não disponibilizado e revisão humana documentada.

Nenhum passo pendente deve ser tratado como teste aprovado sem realização e registro de evidências.
