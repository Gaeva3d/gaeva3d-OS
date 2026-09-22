# Roadmap conservador

## Prioridade técnica identificada em 2026-09-08

Antes de novas funcionalidades, concluir a contenção dos dois P0 revalidados em [segurança e contenção](08-revalidacao-tecnica.md). O usuário aprovou a contenção A/B/C. A exigência de vínculo ativo com a equipe foi aplicada e verificada, impedindo que a criação de conta, sozinha, dê acesso ao OS. Restam desligar cadastro público no painel Auth e confirmar consumidores n8n antes de fechar as tabelas Dry. Não há nova permissão para executar todo o roadmap da auditoria recebida. A restrição financeira de um viewer legitimamente convidado continua sendo decisão separada.

| Estágio | Objetivo | Situação e condição |
| --- | --- | --- |
| 0 | Mapear código, schema e fluxo; confrontar blueprint | Diagnóstico concluído antes das edições da interface |
| 1 | Clareza de labels, responsável, ações e filtros existentes | Implementado; TypeScript, build e 26 testes aprovados; integração acompanhada no PR #11 |
| 2 | Pequenas melhorias operacionais no fluxo/painel atual | Propor e aprovar primeiro; não executar automaticamente |
| 3 | Briefings simples por produto | Propor templates pequenos; sem construtor complexo |
| 4 | Produção estruturada | Analisar uso real de jobs/eventos/impressoras antes de ampliar |
| 5 | Dados e gestão | Custos, margem, capacidade, produtividade e estoque somente com dados reais |
| 6 | Integrações | Kommo, WhatsApp, pagamentos, transportadoras e automações mediante aprovação |
| 7 | Escala e inteligência | Apenas após estabilidade do core, dados e necessidade comprovada |

## Próxima proposta, sem execução autorizada

Em 2026-09-09, o usuário autorizou a remoção da caixa automática de bloqueios/briefing incompleto no detalhe exibido após criar o pedido. Ajuste realizado apenas na apresentação, preservando o motivo de bloqueios reais no resumo e as regras operacionais. Avaliação: valor 9/10, complexidade para usuário 0/10, complexidade técnica 1/10, prioridade 9/10.

Depois de validar alguns pedidos reais com cada papel, discutir os dois ajustes restantes. Notas são estimativas (0–10).

| Proposta | Valor | Complexidade usuário | Complexidade técnica | Prioridade agora |
| --- | ---: | ---: | ---: | ---: |
| Decidir quem confirma o pedido e quem registra aprovação, mantendo responsabilidade explícita | 9 | 2 | 7 | 7 |
| Avaliar se cidade/UF precisam ser obrigatórias já no cadastro rápido | 7 | 1 | 3 | 6 |

A primeira proposta pode exigir guardas/RLS/fluxo e não deve ser tratada como alteração de botão. A segunda pode exigir só frontend, mas modifica a regra de preenchimento e merece decisão de produto. Indicadores novos, filtros salvos novos e mudanças no painel permanecem no estágio 2.

## Critério de encerramento do estágio 1

Build e tipos válidos; testes dos filtros preservando permissões; revisão do diff sem alterações de banco/autenticação; decisões e limitações registradas. Validação humana em uso real continua necessária para medir redução de cliques e dúvidas.
