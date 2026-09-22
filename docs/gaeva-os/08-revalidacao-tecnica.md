# Revalidação da auditoria técnica

Data: 2026-09-08. Base de código da revalidação inicial: `271413156e81d4744f87f1bf284163fc23673468`, posterior ao `fcb2141` citado no documento recebido. Projeto Supabase: `wohkhxculmrfavnbykkk`.

**Atualização após autorização, 22:24 UTC:** a contenção B foi aplicada pela migration `20260908222405_require_active_team_membership.sql`. Conta sem integrante ativo vinculado não acessa os dados do GAEVA, mesmo com perfil ativo. A e C permanecem pendentes: configuração remota de cadastro público e acesso aos consumidores n8n. O diagnóstico e rascunhos abaixo descrevem a revisão original; a seção final registra a execução posterior. Não considerar todos os P0 encerrados.

## Resultado prioritário

Na revalidação inicial, os dois P0 estavam presentes. A publicação e a persistência do GAEVA OS foram verificadas, mas isso não equivalia a uma validação da segurança de todo o projeto Supabase compartilhado. As afirmações anteriores de ausência de alertas não devem ser usadas como aprovação atual de segurança.

### P0-01: tabelas comerciais da Dry

1. `public.dry_leads` e `public.dry_conversion_events` estão com RLS desabilitado.
2. O catálogo confirma SELECT, INSERT, UPDATE e DELETE concedidos a `anon` e `authenticated`, além de outros privilégios de tabela. Não foram executados testes de escrita. Privilégio no catálogo não comprova que toda modalidade de escrita passaria por constraints/triggers nem que todo privilégio é exposto por HTTP.
3. Consultas HTTP anônimas HEAD, com a chave publicável já usada pelo aplicativo, `limit=0` e contagem exata, retornaram HTTP 206 e `content-range: */402` / `*/106`. Nenhum registro pessoal foi baixado. `orders` retornou 401 no mesmo teste.
4. O Security Advisor atual também aponta `rls_disabled_in_public` nas duas tabelas. [Referência](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public).
5. Não foram encontradas views dependentes dessas tabelas no catálogo consultado nem funções cujo código armazenado mencione esses nomes. Isso não substitui análise de SQL dinâmico, serviços externos ou workflows.
6. Não há conector n8n disponível nesta sessão; a busca pelos nomes das tabelas nos repositórios conectados não retornou definições de workflows. Não foi possível confirmar a credencial usada pela operação da Dry. Não inferir `service_role` a partir do nome de uma credencial.

A exposição de leitura está demonstrada. Não foi investigado quem acessou os dados no passado, nem comprovada exfiltração por terceiros. O documento recebido não basta para concluir obrigações jurídicas específicas ou alcance histórico de um incidente.

### P0-02: cadastro público e acesso por papel padrão

1. GET `/auth/v1/settings` retornou HTTP 200, `disable_signup=false`, `mailer_autoconfirm=false` e provedor de e-mail habilitado.
2. `app_private.handle_new_user()` cria o perfil com papel padrão `viewer`. O default de `profiles.is_active` é `true`.
3. `app_private.has_role()` verifica usuário, perfil ativo e papel; não exige vínculo com a equipe.
4. `orders_read`, `customers_read` e `audit_logs_read` admitem `viewer` amplamente; `order-files` herda a visibilidade de `orders`. A view operacional tem `security_invoker=true`, portanto o problema está na permissão concedida, não em bypass de RLS pela view.
5. A combinação de configurações permite o caminho descrito na auditoria. Não foi criada conta de teste nem executado cadastro/confirmacão de e-mail em produção nesta revalidação.
6. Há somente dois perfis: um Admin e um Comercial, ambos ativos e vinculados a integrantes ativos. Não há `viewer` existente no snapshot consultado.

## O que precisa ser corrigido no documento recebido

| Afirmação ou proposta | Revalidação |
| --- | --- |
| Sem publicação Vercel encontrada | Desatualizada. `os.gaeva3d.com` respondeu HTTPS 200 com título `Visão geral — GAEVA OS`, servidor Vercel. DNS aponta para o CNAME indicado pelo projeto. Login e URLs atuais do Auth não foram verificados por esse teste. |
| Toda mutação do Kanban recarrega a camada antiga | Generalização incorreta. O provider usa `lightweight` em `/pedidos/kanban` e `/pedidos?view=kanban`; nesse modo carrega perfil próprio, equipe e impressoras. `runOrderAction` só chama `loadData()` se `!lightweight`. O problema persiste nas telas que usam o caminho completo. |
| 5.000 arquivos causariam 5.000 assinaturas na implementação atual | O padrão N+1 existe, mas a própria ausência de paginação limita o conjunto retornado pelo PostgREST. Com teto de 1.000 linhas, seriam até 1.000 assinaturas daquela consulta e arquivos omitidos. Não tratar projeções como benchmark medido. |
| Remover assinaturas do store não muda o comportamento visível | Exige adaptação: o detalhe legado usa `files` do store e `OrderFileGrid` depende de `file.url`. Remover sem adaptar a leitura por pedido quebraria imagens/downloads nesse caminho. |
| Não há testes executáveis | Faltam scripts npm e CI, mas há testes executáveis diretamente. Foram executados agora **26 testes, todos aprovados**, via `node --experimental-strip-types --test tests/*.test.mjs`. Eles não provam fechamento dos P0. |
| Testes são todos de funções puras | Há também testes do handler de `team-access` com clientes simulados, incluindo autorização e falha parcial. Testes SQL transacionais já existem e precisam ser estendidos/integrados ao processo. |
| Tirar `viewer` da primeira lista em `audit_logs_read` resolve a leitura | Insuficiente: há outro ramo com `OR EXISTS` sobre pedidos acessíveis. Enquanto `viewer` lê os pedidos, esse ramo ainda revela auditoria de pedidos. A política inteira precisa ser considerada. |
| Índice único parcial de telefone é um quick win de baixo risco | Existem **dois clientes ativos com o mesmo telefone**, tanto na comparação literal quanto normalizada. O índice proposto falharia hoje. Telefone compartilhado pode ser legítimo; decidir identidade/deduplicação antes de impor unicidade ou fundir cadastros. |
| Pedidos cancelados desaparecem de toda tela | Confirmada exclusão do Kanban e Produção. A tabela legada consulta pedidos sem exclusão global de cancelados; `applyFocus` depende do filtro. Não afirmar desaparecimento universal sem teste de todas as visões. Falta uma ação/consulta clara de cancelamento. |
| Comercial só vê os próprios clientes | `customers_read` permite todos os clientes ao Comercial. O escopo de pedidos é diferente. Não confundir as duas políticas. |
| RLS pode esconder só valores financeiros | RLS filtra linhas. Esconder valores de uma linha que continua legível exige também controle de colunas/projeções e acesso consistente, não apenas ocultação na interface. |
| CORS por origem corrige uso indevido de token | Pode reduzir chamadas por navegadores, mas não substitui autorização ou reautenticação. Um cliente fora do navegador ignora CORS. |
| Tornar novos perfis inativos basta | Não isoladamente: `link_team_access` rejeita perfil inativo. Essa solução exigiria adaptar o provisionamento; não alterar o default sem ajustar/testar o vínculo. |

## Achados operacionais ainda presentes

1. `store.tsx` ainda tem consultas amplas sem paginação em telas fora do Kanban leve e assinatura individual dos arquivos retornados. A auditoria global é limitada a 250 registros nesse caminho.
2. Criar pedido continua sendo INSERT de `orders`, INSERT de `order_items` e UPDATE de `orders`, em requisições separadas; cliente novo é criado antes. Não há atomicidade entre essas etapas. No snapshot não havia pedido ativo sem item, o que não elimina a falha possível.
3. `updateOrder`, `updateCustomer`, `upsertJob` e `updatePrinter` continuam com escritas diretas sem comparação da versão anterior. Manter a concorrência otimista existente no fluxo operacional.
4. `team-access.change_password` continua usando a API administrativa para trocar a senha do próprio chamador sem pedir senha atual. Testar separadamente primeiro acesso, recuperação e troca normal; não aplicar exigência que inviabilize recuperação legítima.
5. `package.json` continua sem scripts `test` e `typecheck`; não há workflow de CI no tree atual. Os testes foram executados manualmente nesta revisão.
6. O fallback publicável de produção permanece. Removê-lo indiscriminadamente pode interromper builds que dependem dele; exigir configuração explícita por ambiente e validar produção/preview antes da mudança.

Os demais itens do documento recebido permanecem candidatos de revisão. Não rotular toda a lista como revalidada nem assumir que os tempos e limites de escala estimados foram medidos.

## Proposta mínima de contenção, para aprovação

Esta proposta respeita `orders.status`, tabelas, equipe, histórico e fluxo atuais. Não cria módulo, tabela, enum, dashboard ou nova integração.

### A. Cadastro público

No Supabase, `Authentication → Sign In / Providers`, desabilitar **Allow new users to sign up**. Verificar depois que `/auth/v1/settings` retorna `disable_signup=true`. Preservar o login das contas existentes e testar o provisionamento administrativo por `team-access`. [Documentação oficial](https://supabase.com/docs/guides/auth/general-configuration).

Não existe ação de alteração dessa configuração nas ferramentas Supabase disponíveis nesta sessão. A proposta não afirma que o cadastro foi fechado.

### B. Admissão ao GAEVA pela equipe existente

O que existe: `profiles.is_active`, `team_members.user_id/is_active/deleted_at`, `app_private.has_role()` e `link_team_access()`.

O que reaproveitar: a própria função central de autorização e o vínculo já feito pelo provisionamento administrativo.

Lacuna: um perfil ativo recebe permissões antes de ter vínculo com a equipe. Isso inclui autocadastro e conta criada cujo vínculo falhou.

Alteração mínima proposta: exigir também um integrante ativo e não excluído vinculado ao usuário em `app_private.has_role()`. Preservar proprietário, assinatura e permissões da função. Os dois usuários atuais cumprem essa condição. Não tornar `profiles.is_active` falso isoladamente, pois o RPC de vínculo atual o rejeitaria.

```sql
-- RASCUNHO PARA REVISÃO. Não executado; não é uma migration aplicada.
create or replace function app_private.has_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.profiles p
      join public.team_members t on t.user_id = p.id
      where p.id = (select auth.uid())
        and p.is_active
        and p.role = any(allowed_roles)
        and t.is_active
        and t.deleted_at is null
    );
$$;
```

Esta contenção impede que a mera criação da conta dê acesso ao OS. **Não define um novo escopo financeiro para um viewer legitimamente convidado.** A revisão desse papel e do ramo `OR EXISTS` da auditoria deve ser aprovada/testada separadamente, considerando quais informações a visualização deve receber.

Antes de aplicar: revisar todos os usos de `has_role`, guards e bootstrap; testar administrador/comercial atuais, cadastro administrativo, conta sem vínculo, membro inativo e integrante excluído. Ajustar fixtures antigas que simulam operadores legítimos sem vínculo, mantendo casos negativos explícitos. Testes SQL devem rodar em ambiente isolado ou com rollback aprovado, sem consumo de sequências de produção.

### C. Tabelas Dry

O que existe: duas tabelas sem RLS, grants amplos para `anon/authenticated`, e `service_role` com grants e bypass de RLS. Não há necessidade de outra tabela.

Lacuna: API pública tem acesso direto a dados internos. A correção mínima é revogar acesso dos clientes públicos e habilitar RLS nas duas tabelas, preservando o acesso de servidor.

**Pré-condição pendente:** mapear workflows n8n e demais consumidores, operação utilizada e papel da credencial. Se algum consumidor depende de `anon/authenticated`, migrá-lo para acesso de servidor autorizado antes do fechamento; ou obter decisão explícita sobre eventual interrupção de integração para contenção imediata. Não deixar o vazamento indefinidamente à espera de uma refatoração.

```sql
-- RASCUNHO PARA REVISÃO. Executar somente após aprovação e checagem dos consumidores.
begin;
revoke all privileges on table
  public.dry_leads,
  public.dry_conversion_events
from public, anon, authenticated;

alter table public.dry_leads enable row level security;
alter table public.dry_leads force row level security;
alter table public.dry_conversion_events enable row level security;
alter table public.dry_conversion_events force row level security;
-- Preservar os grants existentes de service_role; não criar policy permissiva.
commit;
```

Verificar grants de coluna, views, funções com SQL dinâmico e execução concedida a PUBLIC antes de finalizar a migration. Repetir HEAD anônimo: acesso deve ser negado. Verificar `authenticated` não autorizado, role de servidor e uma execução controlada da integração. Confirmar que as contagens e os dados foram preservados. Não testar INSERT/DELETE anônimo em produção.

## Ordem e critérios de aprovação

| Proposta | Valor operacional | Complexidade para usuário | Complexidade técnica | Prioridade agora |
| --- | ---: | ---: | ---: | ---: |
| Desabilitar cadastro público | 10 | 0 | 1 | 10 |
| Vincular autorização ao integrante ativo existente | 10 | 0 | 4 | 10 |
| Fechar acesso público às tabelas Dry após confirmar consumidores | 10 | 0 | 4 | 10 |
| Revisar escopo do viewer, inclusive auditoria e financeiro | 9 | 1 | 6 | 9 |
| Reautenticação na troca de senha e recuperação correta | 9 | 2 | 5 | 9 |
| Scripts de teste/typecheck e execução em PR | 8 | 0 | 3 | 8 |
| Criação transacional e idempotência do pedido | 9 | 0 | 6 | 8 |
| Arquivos sob demanda e paginação das telas legadas | 8 | 0 | 5 | 8 |

Notas são estimativas. A regra de aprovação da devolutiva continua vigente: migrations, autenticação e permissões não foram autorizadas automaticamente pela entrega de uma auditoria de terceiros. Aprovar primeiro a contenção A/B/C e suas condições; não aprovar por consequência uma reconstrução do sistema ou todo o roadmap do documento.

Não aplicar índice único de telefone, eliminar clientes, migrar o projeto Supabase, materializar timestamps, remover o store inteiro nem definir retenção destrutiva de auditoria nesta contenção. Avaliar esses itens depois, com evidência e escopo próprio.

## Verificação realizada e limites

1. As 138 entradas de arquivos do snapshot local foram comparadas pelo hash de blob Git com o tree de main `e2e6b9ca902862b8210c5b15d3fd853c2e9ea107`: nenhuma divergência.
2. Consultados grants, policies, RLS, funções de perfil/permissão/vínculo, defaults, contagens e integridade agregada no Supabase. Nenhum dado pessoal foi incluído nesta documentação.
3. Requisições públicas somente de leitura: Auth settings e HEAD de Dry/Orders sem retornar linhas pessoais.
4. Security Advisor consultado: duas tabelas Dry sem RLS; também há aviso de proteção contra senhas vazadas desabilitada. As três tabelas GAEVA/Pet com RLS sem policy não devem ganhar policies abertas para eliminar aviso: são fechadas aos clientes por desenho.
5. **26 testes locais aprovados**. Não foram executados load tests, testes autenticados ponta a ponta ou testes SQL que criam fixtures em produção.
6. Nenhuma migration, mudança de Auth, grant, RLS, dado operacional, usuário, senha, workflow, DNS ou deploy foi aplicado por esta revisão. A proposta SQL acima não foi executada.
7. Documentação canônica em GitHub. Não afirmar que foi gravada no Obsidian local ou no Supabase Storage: esses acessos continuam indisponíveis.

Referências: [RLS e grants](https://supabase.com/docs/guides/database/postgres/row-level-security), [configuração de cadastro](https://supabase.com/docs/guides/auth/general-configuration), [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Execução após autorização

O usuário respondeu **“autorizo”** à contenção A/B/C proposta no PR #12. Essa autorização permanece válida; não solicitar outra aprovação para concluir o mesmo escopo quando os acessos pendentes estiverem disponíveis.

### B aplicada e verificada

1. `app_private.has_role` agora exige `profiles.is_active` e `team_members.user_id = profiles.id`, com integrante ativo e `deleted_at is null`. Todos os papéis continuam vindo do perfil existente, sem confiar em metadata editável pelo usuário.
2. Migration aplicada em produção e registrada com a versão `20260908222405`. O arquivo Git foi alinhado ao timestamp retornado pelo Supabase. A alteração é somente na função existente; não cria tabela, papel, campo, autenticação paralela ou fluxo operacional.
3. Preview existente e sem usuários recebeu apenas as migrations GAEVA existentes para reproduzir o core atual e validar a contenção. Comparação por hash confirmou policies idênticas e somente a diferença intencional de `has_role` entre preview e produção antes da aplicação.
4. Três suítes SQL passaram no preview. `tests/active-team-membership.sql` testa todos os cinco papéis sem vínculo, leitura das tabelas/view/histórico e metadados de Storage, rejeição de escrita, vínculo administrativo com retry, permissões dos convidados legítimos e revogação por inativação/exclusão do integrante. As regressões de provisionamento e fluxo operacional completo também passaram. Os fixtures foram revertidos. Não houve upload, download ou envio de e-mail nesses testes.
5. Após aplicação, verificação somente leitura na produção confirmou autorização dos dois usuários atuais e contagens inalteradas de usuários, integrantes, clientes, pedidos, auditoria e arquivos. Hash da função coincide com o validado no preview. Nenhum dado real foi alterado para testar a correção.

**Limite:** a cadeia “autocadastro → acesso aos dados do OS” foi interrompida pela admissão via equipe. O cadastro no Auth ainda pode ocorrer, e um viewer legitimamente convidado conserva o escopo anterior. Revisão de financeiro/auditoria desse papel não está incluída nesta migration.

### A e C ainda pendentes

1. **A, configuração do Auth:** não há ferramenta de alteração dessa configuração nem credencial de Management API disponível. `supabase/config.toml` já contém `enable_signup=false`; isso não foi aplicado automaticamente ao projeto remoto. Desligar **Allow new users to sign up** no painel e verificar `disable_signup=true` continua necessário.
2. **C, Dry:** não há conector n8n, export dos workflows nem credenciais autorizadas dessa integração neste ambiente. Não foi inferido uso de `service_role` nem aplicado o rascunho de REVOKE/RLS. É necessário identificar os consumidores de `dry_leads`/`dry_conversion_events` e o papel usado, sem publicar tokens. Um export do workflow sem segredos permite localizar os nós; a credencial precisa ser conferida no ambiente n8n. Se depender de acesso anônimo, ajustar o consumidor antes do fechamento, conforme a condição aprovada.
3. A falta desses acessos não é falta de autorização para a contenção. Não repetir pedidos de aprovação do mesmo escopo e não abrir novamente o acesso ao OS como forma de contornar falha de integração.

Próximo passo: concluir A/C com os acessos necessários; depois propor a revisão de viewer e troca de senha, mantendo os demais itens do roadmap separados. A disponibilidade de `os.gaeva3d.com` permanece independente dessas pendências de segurança.
