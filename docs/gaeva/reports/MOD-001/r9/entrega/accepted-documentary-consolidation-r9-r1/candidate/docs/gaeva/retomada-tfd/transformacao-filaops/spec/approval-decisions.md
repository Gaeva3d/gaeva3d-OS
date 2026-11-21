> Contexto TFD · 508 palavras · 874 tokens (o200k_base)

# Folha de decisões e aprovação por recorte — MT-A02r1

As recomendações D01–08 da [folha revisada de arquitetura](../arquitetura/decisions.md) integram esta spec por referência. **Continuam propostas para decisão humana, não aprovações obtidas.** Não se reabre50% parcial, dupla aprovação3D, gates finais, principal único, clocks/configuração COM ou sete colunas. A equipe decidiu a apresentação delegada: tabela+detalhe na impressão e prévia compartilhada modeless (DEC-UX01), preservando modalidades de Contatos/mobile; não há pergunta de desenho ao usuário.

| Decisão | Recomendação para aprovação final / limitação | Fase afetada até resposta registrada |
| --- | --- | --- |
| D01 IA aguardando humano | Suspender resposta pública após pedido humano, mantendo aviso factual de fila e assistência privada autorizada | Não habilitar bot público nesse estado; demais registro/fila preservados |
| D02 agenda/híbrido/tolerância/empate residual | Calendário específico só sobrepõe geral com regra explícita; conflito nega nova oferta. Híbrido conserva automático até intervenção autorizada; expiração não renova pela queda. Empate residual por ID estável após critérios COM | Algoritmo dependente bloqueado; não inventar expediente ou mínimo. Locks/capacidade e modos já fechados podem ser especificados/testados separadamente |
| D03 transições de funil, perda, reabertura e dados obrigatórios | Exigir tabela origem→destino→ator→campos→efeitos; enquanto ausente, bloquear transição, não assumir funil linear nem livre | Consulta/criação de rascunho independentes; movimentação e fechamento dependentes não implementation-ready |
| D04 ciclo de convite colaborativo | Invalidar pending ao encerrar/substituir principal, reenvio idêntico reutiliza solicitação; sem TTL numérico até aprovado, nunca60s inferido | Ler/aceitar/recusar closed r42 preservados; expiração/reenvio/cancelamento dependentes bloqueados |
| D05 início, vários trabalhos, acabamento e tempos | Propor Iniciar etapa por trabalho/peça; registrar passagens/pausas; card mostra progresso sem avanço automático não decidido; acabamento aplicável em Montagem | Não habilitar agregação/cronômetro oficial como aprovado; fatos de operação, gates e sete colunas independentes preservados |
| D06 alçadas registro/campo/equipe | Matriz explícita por ação e concessão; sensível negado, Produção só gate sem valores, vendedor autorizado publica | Habilitação de cada comando depende linha aprovada; nenhuma promoção de operator/admin por UI |
| D07 portal/retention/reembolso | Convite uso único com confirmação de identidade; retenção/prazo e provedor com dono; manter autoria e sem estorno automático por recusa de foto | Envio de convite e exclusão/retention só com contrato/política; sem alegar direito legal ou TTL universal |
| D08 fórmulas/metas/agenda/IA/campanhas | Registrar origem dos fatos, pessoal/operacional distintos, ausência não zero; adoção/capacidade e opt-in por aprovação do recorte | Dashboard/fórmula e automações avançadas não implementation-ready por exemplo do fornecedor |

BR-P01 pt-BR/moeda explícita sem converter legado integra interfaces do piloto como proposta técnica; BR-P02 contrato de confirmação/fiscal/privacidade tem limites reais, sem provedor/homologação; BR-P03 capacidade/material informa tabela; BR-P04 perdas/custos e BR-P05 continuidade seguem roadmap/priorização Product. Fiscal/folha não recebem regra de negócio inventada.

A aprovação futura deve registrar hash/revisão da spec/Task/Discovery e decisões aceitas/adiadas, recorte autorizado e exclusões. Decisão parcial não libera comandos com política pendente. Aprovação de spec não é autorização de publish/build/deploy/restore ou acesso a segredos. Main mantém ledger e humanos; este documento não grava eventos nem preenche G0/G0.5/G1/G6.
