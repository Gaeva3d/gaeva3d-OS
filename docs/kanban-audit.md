> Contexto de produto atualizado em 2026-09-08: [decisões e roadmap conservador](gaeva-os/00-visao-geral.md). Esta auditoria técnica permanece como referência da implementação existente.

# Kanban integrado de pedidos

Auditoria em 07/09/2026, sobre a main cd0a5d8 e o schema ativo da GAEVA.

## Reaproveitamento

| Necessidade | Estrutura existente / adaptação |
| --- | --- |
| Pedido, cliente, produto, valor, prazo | orders, customers, order_items; quantidade soma todos os itens |
| Coluna | Agrupamento do único orders.status, sem status Kanban persistido |
| Novos / Confirmação | received / briefing_pending |
| Designer / Aprovação | modeling + internal_review / awaiting_customer_approval |
| Impressão | approved_for_production + print_queue + printing |
| Pedido pronto | finishing + quality_control + packaging |
| Postagem / Finalizados | shipping / completed |
| Bloqueados | Permanecem na última etapa conhecida pela auditoria, com indicador |
| Cancelados | Permanecem disponíveis na tabela de pedidos; fora do fluxo operacional |
| Responsável / designer | orders.assigned_to / order_assignments e team_members |
| Vendedor | orders.created_by e profiles; sem campo duplicado de vendedor |
| Aprovação, versão, revisão | approvals; revisão derivada das solicitações registradas |
| Impressão, falha, reimpressão | production_jobs e production_events |
| Confirmação | briefing_complete; notas de pendência em block_reason e eventos |
| Conferência e embalagem | status quality_control e packaging + atestação nos eventos existentes |
| Tempo por etapa e marcos | audit_logs; não usar updated_at como entrada na etapa |
| Referências / renders | order_files + bucket privado order-files |
| Permissões | profiles.role, RLS, equipe existente e Supabase Auth |
| Interface | Sheet, Tabs, Select, badges, botões e design system existentes |

## Lacunas reais e alterações mínimas

O schema não tinha role de designer, função da atribuição nem dados estruturados de postagem.
Adicionado designer ao enum existente; role_in_order em order_assignments; shipping_address,
shipping_method, carrier, tracking_code e shipped_at em orders. Campos opcionais, sem preencher
dados antigos por suposição. Nenhuma tabela nova, nenhum enum de status novo, nenhum workspace novo.

Uma view security_invoker projeta os pedidos existentes e timestamps da auditoria. Uma RPC
security_invoker agrupa cada ação operacional em transação, respeita RLS, usa bloqueio da linha
e versão updated_at para rejeitar alterações concorrentes. Todos os registros continuam nas tabelas
originais. Permissões também são validadas no banco, incluindo restrições de campo/etapa por role.

## Limites deliberados

Não há cadastro de workspaces no GAEVA atual. As tabelas Dry não são parte do aplicativo e não são alteradas.
Não há SLA contratado/configurado: exibir idade e volume da etapa, sem inventar vencimento de SLA.
O helper de SLA aceita limites opcionais para evolução futura. Atraso usa o prazo prometido e o dia
operacional de São Paulo. Finalizados são carregados sob demanda. Histórico e arquivos são buscados
por pedido ao abrir o painel. As outras telas preservam suas funcionalidades e usam as mesmas tabelas.
