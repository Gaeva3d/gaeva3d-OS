# Plano de provas e revisores — r2

Todos schedules abaixo PLANNED/NOT_EXECUTED. Asserts sobre texto/hashes não são ensaios funcionais. Oracle independente registra causalmente op/request/digest, Admission/history/membership, PIN_RESERVED, COMMIT/BARRIER_ACK do executor, U, OBJECT_ACK/PREFIX/CUT_ACK, head/policy/session epochs, RELEASE por chunk, REVOKING, DRAINED/FENCED e confirmação ao cliente. Relógios diferentes não provam ordem; comparar sequências da autoridade e eventos de enforcement, mantendo incerteza.

| ID | Schedule e oracle exigido |
|---|---|
| T-U5 | Commit local visível/cancelado, nonce visível com ack perdido; trocar membro entre leitura/ack; lista/total/preview/export/worker não publica. Mesma chave/hash reconcilia, divergência conflita. Novo executor obtém prova própria e cut completo; dois agregados independentes continuam concorrentes. |
| T-FENCE | Antigo writer pausa com DB socket/mount/fd/admin/direct e request em voo; promover somente após isolamento mantido ou destino rejeitando epoch ATOMICAMENTE. Ack perdido consulta action_id e não promove; rejoin/quorum/diskful inválidos não ficam READY. |
| T-PIN | Pin->bytes protegidos->pause->GC->resume link; todos anexos continuam retidos, ZERO deletes safe-off. Commit/link ack incerto conserva pin; transferência referência antes de liberar pin; DELETE_UNKNOWN rejeita novo vínculo naquela versão. |
| T-EXT | ANY local responde, AEP cai/falta objeto/base/WAL/journal/key ou cut CAS conflita: nunca sucesso. Seal durável com ack perdido reconcilia mesmo ID. Cut contém cada commit/objeto e journal reconstruível, sem pular cadeia; nova história preserva ancestralidade. |
| T-HEAD | Catálogo/grant antigo assinado, nonce replay, watermark do dump, incarnation nova sem continuidade e policy muda depois do ReadCurrent: nenhum reopen/release com prova obsoleta; autoridade atual online e bootstrap independente. |
| T-REVOKE | Autoriza->worker pausa->REVOKING->TODOS gates drained/fenced->final externo/projeção->ack->retoma chunk: PSC nega epoch velha. PSC pausada na seção de send mantém revoke pendente; membership não ignora ausente. Byte liberado antes pode chegar depois e não é contado como novo release. |
| T-HOLD | RP3/RP5: hold anterior impede delete e confirma; posterior à admissão é REQUESTED/NOT_GUARANTEED; T-RP01 exige DELETE elegível futuro com sucesso e sobreviventes preservados, T-RP02–09 cobrem concorrência/UNKNOWN/UI. Ver retention-validation.md. |
| T-RESTORE | Restore de grants/sessões antigas e cut físico com timeline/objeto/keys incompatíveis mantém fechado. Head atual/policy completa/session_floor novo e all-enforcers acknowledgements antes de listeners/egress; reconstrução seletiva não repete dano/efeito. |
| T-EFFECT | Crash depois envio SMTP/IA/receptor sem query/dedupe não faz retry ambíguo; receptor elegível atomiza chave/digest/efeito e rejeita obsoleto. Replay/chat usa cursores/dedupe e salva/entregue/lida distintos. |
| T-ADMIN-UI | Duas remoções/rebaixamentos concorrentes, override próprio/tenant alheio/revoke em export; >=1admin, deny/invariantes/alçada e audit AEP corretos. FE preserva entrada, erro/conflito/pendente/reconectar/limpeza suspensa; sem falso salvo/restore validado. Teclado/foco/anúncios futuros. |
| T-SLO | Perder individualmente cada servidor incluindo AEP/PSC/entrada; conjunto externo completo de confirmados DB+anexos sobrevive íntegro e sem efeitos duplicados; todas jornadas essenciais retomam<=300s desde interrupção, inclusive nova escrita protegida. Sem benchmark executado. |

QA Spec: inventário/aliases/contratos/cobertura atual; QA Backend: viabilidade de AP0–AP6/dados/ops/recovery; QA UI: C1/C2/C5/C7 e estados dependentes #2, documental, visual/runtime N/A; assurance independente: confiança/fencing/egress/keys/restore, pessoa distinta dos autores Security e dos demais revisores obrigatórios. Main designa e envia tuple atual. Authors nunca PASS própria contribuição. UI r1 PASS é histórico restrito, precisa re-review do tuple r2+nova Discovery.

Main primeiro encaminha r2 e correções exatas a Discovery para revisão nova de sources/evidence/coverage/response, depois QA G3 corrente, ANTES de spec/G4. Pode compor manifesto externo referenciando hashes r2+novaDiscovery sem alterar r2 e sem circularidade. Só todos PASS atuais aplicáveis permitem apresentação para aceite humano; parar sem implementar. Histórico gateUNKNOWN/A0FAILED/P1OPEN/P2P3unreleased intacto.

R3 segunda substituição2/3; nova Discovery e tuple composto correntes são obrigatórios. T-PIN/GC off refere-se a objetos/publicações externas, não elimina limpeza Drive RP.

## Acréscimos humanos r8/r9 — P4/P6

A matriz save-acceptance-r9.json especifica cenários LC/SQ ligados a AC/TEST/MT existentes. Validar após o código com inventário de todos os Salvar por módulo, isolamento entre contas/empresas/registros, dois domínios distintos, múltiplas abas e perda de conexão nos três pontos descritos. Verificar cifra/chaves, recuperação online, rotação, quota, ACK exato, preservação de edições novas, conflito, ausência de fila por contrato, precedência 1103/1102 e limpeza após confirmação. Inspecionar efeitos reais e ausência de escrita indevida. Produto NOT_EXECUTED; checks desta entrega só verificam documentos/fixtures. QA nova deve revisar sem herdar o PASS anterior.
