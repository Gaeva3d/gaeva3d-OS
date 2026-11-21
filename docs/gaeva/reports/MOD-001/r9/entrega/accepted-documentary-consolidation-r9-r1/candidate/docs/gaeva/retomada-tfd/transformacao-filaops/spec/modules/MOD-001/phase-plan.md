# Plano Fundação r9 — proposto, sem liberação

P1→P2→P3 existentes preservados literalmente no Task; A0FAILED/P1OPEN/P2P3unreleased. Novas fases só após P3 e aceite específico, sem implementar #2. Todas MT12-24 documentais, fabricação posterior requer rota autorizada própria.

| Fase | Donos/MT | Dependências/entrega | O/M/P h |
|---|---|---|---|
| P1-CONTRACT | DevOps MT01 | Fonte/locks/bases/config PLANNED e dois builds MESMOS inputs futuros autorizados |18/36/72 históricos|
| P2-EXECUTION | Backend03→Database09→DevOps04→Security11 | Guard offline três QA Backend PASS mesma revisão/config+Security/QA Spec antes conexão |12/24/48 históricos|
| P3-REVIEW | MT02/10/05/06/07/08 | Identidade READ antes efeitos, migrador único/startup/restore isolados e gates próprios |12/24/48 históricos|
| P4-CONTROLS | ui_ux MT-12, frontend MT-13, database MT-14, devops MT-15, backend MT-16 | P3 comprovada/aceita e nova aprovação específica; não liberada; Controles duráveis e proteção HA/externa |48/96/192|
| P5-BACKUPS | database MT-17, backend MT-18, devops MT-19 | P4 integrada e aprovada; Drive real/recuperação só com autorização específica; Backups e retenção com executor fiscalizado |32/64/128|
| P6-ASSURANCE | qa MT-20, qa_ui MT-21, security MT-22, documentation MT-23, harness MT-24 | P5 + todos contratos; alvo novo isolado/guard antes de efeitos; Provas integradas e dependências documentadas |32/64/128|

Julgamento de engenharia de baixa confiança, sem tempos observados; base por grupos de contrato/complexidade/interleavings, fator O/M/P1:2:4. Não calendário, orçamento ou capacidade medida; exclui espera por fornecedor e pesquisa de tecnologia indisponível. Nenhuma estimativa autoriza operação. Total154/308/616h, não somar novamente macro F1 antigo. NFRs dimensionados e rota de implementação exigem revisão antes da fase.
