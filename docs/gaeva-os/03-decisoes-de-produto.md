# Decisões de produto

Data: 2026-09-08. Origem: devolutiva do responsável pelo produto após o blueprint. Diretrizes permanentes, modificáveis apenas por decisão explícita posterior.

## Decisão 001: simplicidade

GAEVA OS continuará simples. Prioridade: Comercial → Designer → Produção → Expedição. O software não será antecipadamente um ERP para uma operação de mil pedidos mensais.

## Decisão 002: um pedido, um card

Preservar `orders.status`. Não criar outro Kanban, tabela de pedidos, status paralelo, cards por item/design/impressão, cadastro de designers ou histórico duplicado.

## Decisão 003: produção interna

Jobs e eventos podem representar detalhes internos da produção. Não transferir apontamento técnico, máquina, material avançado ou configuração de impressão para a entrada comercial ou o trabalho do designer.

## Decisão 004: blueprint como visão

O blueprint integral é referência estratégica, não lista de implementação autorizada. Custos, estoque, capacidade, integrações e inteligência ficam no backlog. Não apagar ideias, nem implementar sofisticadas oportunidades encontradas durante a auditoria.

## Decisão 005: reaproveitamento

Antes de módulo/componente/tabela novo, pesquisar campos, filtros, ações contextuais, drawer, modos existentes e pequenas extensões. Ordem: reutilizar → estender → adaptar → criar.

## Decisão 006: autorização por estágio

Estágio 1 permite textos, labels, organização, filtros, ordenação, apresentação de dados existentes, ocultação segura de legados, CTA, empty states, bugs pequenos inequívocos, testes relacionados e documentação.

Exigem aprovação prévia: migrations, nova tabela, remoção de coluna, mudança de enum, RLS relevante, autenticação, Edge Functions, integrações/webhooks, fluxo central, módulos/rotas grandes, entidades e permissões. Inclui Kommo, WhatsApp, pagamentos, transportadoras, automação de escrita e IA operacional. Estágios 2 em diante não são automáticos.

## Decisão 007: handoff preservado

A função atual permite aprovação pelo Comercial/Admin, que já move para a fila de impressão. Não dar ao Designer um botão com permissão inexistente. Nesta entrega, explicitar a ação atual e facilitar o acompanhamento; propor qualquer redistribuição de responsabilidade separadamente.

## Decisão 008: contexto permanente

Documentação canônica versionada em `docs/gaeva-os`, com links às auditorias existentes. Markdown compatível com Obsidian; não alegar sincronização com vault sem evidência. Não criar tabela no Supabase apenas para memória, nem usar tabelas de Dry/Pet/marketing para isso.

## Decisão 009: critérios de valor

Toda proposta recebe valor operacional, complexidade para usuário, complexidade técnica e prioridade agora, de 0 a 10. São estimativas, não métricas de uso. Executar agora apenas alto valor com baixa complexidade, dentro do limite de autorização. Medir depois com uso real.

## Decisão 010: conservação de dados e histórico

Ocultar campos vazios ou controles sem persistência não autoriza apagar dados. Preservar histórico Git publicado, schema, aprovações e auditoria. Não misturar alterações de infraestrutura/domínio com esta simplificação operacional.

## Decisão 011: admissão ao sistema pela equipe existente

Em 2026-09-08, após a revalidação da auditoria, o usuário autorizou a contenção A/B/C do PR #12. Foi implementada a exigência de perfil ativo e integrante ativo/não excluído vinculado ao usuário, reutilizando `app_private.has_role` e `team_members.user_id`. Uma conta Auth ou perfil isolado não concede acesso ao OS. O provisionamento administrativo continua em `prepare_team_access` e `link_team_access`.

A autorização inclui desligar cadastro público e fechar Dry após verificar os consumidores n8n. Esses dois itens continuam pendentes por falta de acesso à configuração Auth e aos workflows. Não ampliar essa autorização para novos módulos, alteração de escopo financeiro dos papéis, unicidade de telefone, migração completa de projeto ou funcionalidades futuras. Não solicitar novamente aprovação da contenção já autorizada; solicitar somente o acesso ou informação que faltar.

## Decisão 012: lançamento sem alertas automáticos de bloqueio

Em 2026-09-09, o usuário pediu a retirada da caixa “O que está bloqueando este pedido?” e do aviso “Briefing incompleto” exibidos assim que um pedido é lançado. A imagem mostra um pedido já salvo como “Pedido recebido”, com descrição preenchida; a caixa era calculada a partir de flags de etapas posteriores e não representava um bloqueio real do cadastro.

Remover essa caixa agregada do detalhe do pedido, incluindo a cobrança prematura de aprovação. O motivo de um bloqueio explicitamente registrado continua consultável nos dados principais quando o status é “Bloqueado”. Não marcar briefing ou aprovação como concluídos artificialmente, não modificar pedidos existentes e não alterar as regras de aprovação/produção no banco. Esta decisão autoriza essa simplificação visual específica, sem liberar mudanças gerais do estágio 2.
