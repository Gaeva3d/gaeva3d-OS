# Arquitetura atual

Auditoria inicial: 2026-09-08, `main` em `fcb2141b9b665c394050f2185e7cc5a0338b9b9c`. Os 129 arquivos do snapshot conferem com os blobs remotos. A versão inicial do Lovable descrita no README não representa todas as funcionalidades atuais.

## Aplicação

React 19, TypeScript, TanStack Start/Router, Vite, Tailwind e componentes Radix/shadcn existentes. Rotas relevantes: `/pedidos/novo`, `/pedidos`, `/pedidos/kanban`, `/pedidos/$id`, `/producao` e equipe. Reutilizar o shell e o design system atual.

| Necessidade | Estrutura existente | Regra |
| --- | --- | --- |
| Pedido e macroetapa | `orders.status`; tipos e adaptadores PT/EN | Uma fonte de verdade |
| Produto, quantidade, variações | `orders.category`, `order_items` | Sem catálogo ou pedidos paralelos |
| Cliente e contato | `customers` | Reutilizar cadastro existente |
| Usuário, papel, equipe | `profiles`, `team_members` | Sem cadastro independente de designers |
| Responsável atual | `orders.assigned_to` | Exibir o responsável real |
| Designer e atribuições | `order_assignments` com `role_in_order`, `is_current` | Reaproveitar atribuições |
| Aprovação e revisões | `approvals` e RPC `operate_order` | Versões e decisões existentes |
| Arquivos e referências | `order_files`, Storage privado, `OrderFiles` | Não copiar anexos para o Kanban |
| Impressão e falhas | `printers`, `production_jobs`, `production_events` | Detalhes internos sem multiplicar cards |
| Histórico | `audit_logs`, RPC `order_history`, eventos existentes | Sem nova timeline persistida |
| Resumo operacional | view `order_operational_summary` | Derivação das mesmas entidades |
| Operações concorrentes | `operate_order` com `updated_at` esperado | Preservar guardas e rejeição de conflito |

As 12 tabelas operacionais possuem RLS. Buckets existentes: `order-files` e `avatars`, privados. Papéis atuais: Admin, Comercial, Produção, Visualização e Designer. Esta etapa não altera nenhum desses mecanismos.

O projeto Supabase conectado se chama `Gaeva e Dry Operação`, referência `wohkhxculmrfavnbykkk`, região `us-east-2`. A auditoria confirmou tabelas de outras operações no mesmo projeto. Não renomear, migrar ou alterar essas tabelas nesta tarefa. O nome compartilhado não autoriza misturar dados ou fluxos.

## Código a reutilizar

1. `src/lib/gaeva/store.tsx`: fonte de dados da aplicação, autorização de apresentação, criação e mutações.
2. `src/lib/gaeva/new-order.ts`: validação da entrada e construção do pedido.
3. `src/lib/gaeva/kanban.ts`: agrupamento de status, resumo, filtros, ordenação e destinos permitidos.
4. Hooks e serviços operacionais já usados por `orders-kanban.tsx`: consultas, cache, atualizações e Realtime.
5. `src/components/gaeva/order-drawer.tsx`: ações contextuais e detalhe rápido.
6. `src/components/gaeva/order-shared.tsx`, `badges.tsx` e `linear-filters.tsx`: arquivos, badges, filtros e apresentação compartilhada.
7. `src/integrations/supabase/`: cliente, configuração pública e tipos gerados existentes.

O Kanban e a Produção alteram o mesmo pedido. O Kanban usa resumo operacional; a tela Produção usa o store compartilhado e oferece apontamentos em jobs. A aplicação invalida consultas e recebe eventos existentes; não criar sincronização paralela.

## Verificação do banco

O corpo de `operate_order` no banco coincide byte a byte com a migration `20260907232314_integrate_order_operations.sql`: 13.132 caracteres, MD5 `cabd0c11eb4314fe072e70e4ff01f68b`. `order_history`: 353 caracteres, MD5 `101b7fc0a645888525f1587bce6d0860`. Hashes são evidência de comparação, não controles de segurança.

`orders.status` tem default `received`. Cliente, categoria e prazo são obrigatórios no banco; responsável aceita nulo. Cidade e UF aceitam nulo no banco, embora o formulário atual de novo cliente as exija. Não houve alteração de schema ou de dados durante esta auditoria.

Não existe estrutura adequada de settings ou memória de produto. Manter decisões no repositório/Obsidian, sem migration para documentação.

## Limites conhecidos

A criação de cliente, pedido, item e anexos usa operações sequenciais, não uma transação única. Falhas intermediárias merecem futura análise antes de alterar esse contrato. O deploy/domínio Vercel não foi validado nesta auditoria de fluxo. Build local não prova login, entrega de e-mail nem comportamento completo em produção.
