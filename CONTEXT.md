---
owner: "Renân"
operational_owner: "Rayane Falconeres"
outcome: "Operar pedidos GAEVA da venda confirmada até produção e expedição, com menos cliques, erros e retrabalho."
status: "core_operacional"
next_action: "Validar pedidos reais por papel e decidir quem confirma o pedido e registra a aprovação."
review_date: "2026-09-16"
source_of_truth: "GitHub: código, migrations e docs/gaeva-os; Supabase: dados operacionais."
---

# Contexto curto — GAEVA OS

## O que é

Sistema operacional pós-venda da GAEVA. O fluxo prioritário é Comercial → Designer → Produção → Expedição. O Kommo continua responsável pelo comercial conversacional.

## O que não é

Não é CRM, e-commerce, ERP financeiro, portal do cliente nem sistema da Dry Maia. Não criar integrações, IA ou módulos futuros sem decisão explícita.

## Stack e ambiente

React 19, TypeScript, TanStack Start/Router, Supabase, Tailwind e Lovable. Repositório conectado ao Lovable; não reescrever histórico publicado.

## Contrato atual

1. Reutilizar → estender → adaptar → criar.
2. Um pedido é um card; `orders.status` é a macroetapa oficial.
3. Preservar autenticação, RLS, equipe, dados e histórico.
4. Priorizar velocidade operacional e clareza da próxima ação.
5. Estágio atual: core operacional. Não executar o roadmap inteiro.

## Recuperação seletiva

Leia somente quando a tarefa exigir:

1. Escopo/estado: `docs/gaeva-os/00-visao-geral.md`
2. Arquitetura/schema: `01-arquitetura-atual.md`
3. Fluxo: `02-fluxo-operacional.md`
4. Decisão ou limite: `03-decisoes-de-produto.md`
5. Prioridade futura: `04-roadmap.md`
6. Evidência de mudança: trecho recente de `05-changelog.md`
7. Segurança: `08-revalidacao-tecnica.md`

Não carregue a pasta inteira. GitHub é a verdade técnica; o Obsidian deve apenas indexar e apontar para esta fonte quando estiver acessível.
