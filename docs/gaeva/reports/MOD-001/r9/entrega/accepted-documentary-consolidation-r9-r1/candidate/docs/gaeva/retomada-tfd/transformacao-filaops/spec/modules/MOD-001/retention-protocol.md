# RP — limpeza de pontos DB Drive e preservação honesta

GAEVA-MOD-001 architecture-consolidation-r3, segunda substituição consolidada2/3. Delta F-06/QAUI-R2-01; decisões setoriais próprias preservadas. DECISÃO LOCAL integrada, não execução/capacidade instalada. AP0–AP3/AP5–AP6 suficientes permanecem. RP especifica a limpeza requerida em NORMAL; safe-off é fallback por condições falhas. Não cria atomicidade AEP+Drive ou CAS/hold no Google. Histórico externo/journal/WAL/base/objetos ERP/dedupe/pins/keys necessários continuam sem poda automática, sem H inventado.

## RP1 — autoridade e escopo

AEP continua autoridade canônica linearizável comum de policy/pins/holds/referências/cuts/backup_health e reservas. **DDE** é o nome único do emissor de exclusão, equivalente à PUE Security e ao papel delete-PSC Backend. **PSC** sem qualificador continua exclusivamente a porta de liberação de bytes AP5; não confundir suas credenciais/estados com DELETE. DDE pode compartilhar infraestrutura física fiscalizada, mas tem identidade, membership, registro de tentativas e interface de método/alvo próprios.

Só DDE/fronteira credenciada detém OAuth e canal autenticado Drive; nenhum planner/API/scheduler/worker recebe token, socket ou licença portátil. drive.file também permite delete: uploader deve usar fronteira credenciada com allowlist de operações, não reter bearer fora dela. Não é proxy HTTP arbitrário: método/path/IDs/tenant/conta/Drive e digest são derivados do catálogo e confrontados com AEP. Egress/credenciais/fence controlados fora do host antigo. Token roubado usado fora da fronteira ou proprietário Drive comprometido não é contido por CAS AEP; manter controles/cópia independente e limite explícito.

Alvo é lista FECHADA de arquivos conhecidos por ponto (conta OAuth/app/drive namespace, point_id, immutable_fileId, tipo ciphertext ou manifesto, digest/tamanho). Nunca pasta/raiz/nome/listagem dinâmica. Opção integrada: limpar ciphertext e manifesto Drive como componentes distintos com recibos; manter tombstone/manifesto de evidência AEP sem segredos. Contrato Database permite manifesto retido; isto não contradiz sua unidade de exclusão por arquivo. Pastas vazias podem permanecer. Arquivo novo/substituto sempre tem NOVO fileId/point_id; não reaproveitar identidade tombstonada.

## RP2 — seleção, elegibilidade e sobreviventes

Preview não concede licença. NORMAL só com implementação/enforcement verificados e gates/autorização operacional futuros; esta entrega apenas define o caminho. AEP avalia por instalação/empresa/recovery_family e revisões dos recursos compartilhados: últimos30 pontos daily válidos e12 representantes monthly distintos por mês local, configuráveis; dupla etiqueta conta em ambas e só libera quando dispensado por AMBAS. Desempate UTC de conclusão verificada+point_id; ausência de mês é lacuna explícita. Ocorrência/fuso/classes do ponto imutáveis, política/fuso novos em nova geração; manual tem classificação explícita, não satisfaz slot automaticamente.

Válido exige upload/integridade/conjunto compatível/chave recuperável e evidência C5, sem confundir upload com restore validado. AEP valida ator/alçada, policy_generation, family/resource/ref/hold/health revisions e membership DDE atuais. Sem hold legal/operacional/pin/ref/cut que exija aquela cópia; sem backup/upload/verify/credencial falhos ou UNKNOWN relevante. Último válido e closure de TODOS sobreviventes (base/WAL/config/objetos/keys/cuts/holds/pins) devem permanecer recuperáveis. Retenção operacional não revoga guarda legal.

Txn CAS comum reserva S+closure por reservation_id/hash sem TTL, marca intenção PREPARED e impede candidatos de outros cleaners de usar S como algo removível. ADMITTED/INFLIGHT/UNKNOWN contam como já potencialmente ausentes, nunca sobreviventes. Preferir uma admissão pendente por família; recursos compartilhados têm revisão/guarda própria. Dois cleaners competem na revisão e relêem; não podem cada um excluir o último remanescente do outro. Nova referência/hold/backupfailure atualiza revisão e invalida preparação. Reserva não é licença duradoura: admissão de cada arquivo revalida tudo. Backup novo pode continuar, sem serializar salvamentos ERP globalmente.

## RP3 — admissão irrevogável, envio e hold

Comando RequestCleanup(op_id/digest, ocorrência manual/agendada, policy_generation, plano) cria task_id estável ACCEPTED_PENDING; Submit repetido consulta o mesmo ID. PreviewRetention/GetCleanup/GetHold retornam head atual, estado por arquivo/ponto, reasons e ações autorizadas; tenant/ator derivados no servidor. IDs de tentativa separados da tarefa.

PREPARED é reversível. AEP **AdmitDelete** compara revisões/saúde/holds/reserva/epoch+boot DDE e registra **DELETE_ADMITTED** durável ligado a admission_id/attempt_id/fileId exatos ANTES do envio. Esse é o limite CONSERVADOR irrevogável para hold: não prova que Google recebeu. DDE registra DISPATCH_INTENT/MAY_HAVE_SENT antes de transporte; ack AEP perdido impede enviar até lookup fresco do MESMO registro. Nenhuma permissão é exportada a outro worker. Um attempt faz no máximo uma chamada, sem retries ocultos SDK/HTTP/proxy.

HOLD_REQUESTED fecha imediatamente NOVAS admissões de toda closure/escopo. Se RequestHold vence CAS antes de DELETE_ADMITTED e não existe outra tentativa capaz de atingir a versão, verifica bytes/closure, grava HOLD_ACTIVE e confirma. Preparação antiga é invalidada. Ordem é revisão AEP, não instante do clique. Se admissão venceu antes, inclusive DDE pausado antes do send, retornar HOLD_REQUESTED/PRESERVATION_NOT_GUARANTEED para os alvos ameaçados; nenhuma promessa de cancelamento. Operação antiga pode concluir, mas hold nunca foi falsamente confirmado. Hold de itens seguros é resultado parcial com ESCOPO explícito, não garantia do ponto inteiro.

Pausa planner antes da admissão: não tem credencial, retorno pede admissão atual e é negado sob hold. Pausa DDE após admissão/antes de HTTP: registro bloqueia confirmação de hold durante toda pausa. Pausa após dispatch: remoto pode concluir. Substituir DDE fecha admissões, exige isolamento MANTIDO de todos processos/canais/conexões antigos, ack externo por host/boot/epoch e só então novo grant. Lease, rotação OAuth, route removal ou morte local não cancelam processamento Google já em voo. Sem fence não há sucessor enviando; sem prova confiável de que NENHUM pedido entrou no transporte, NOT_DISPATCHED_PROVEN é proibido. Ausência de log de envio após crash não é prova. UNKNOWN sem TTL preserva risco/reservas e suspende a família; novo nome/família não contorna isso.

## RP4 — sucesso normal, falha e reconciliação

Caminho positivo habilitável: backup válido -> ponto expirado nas duas classes -> reserva sobrevivente -> admissão AEP atual -> DDE envia files.delete para ID exato -> observa resposta oficial de sucesso ligada à tentativa -> RecordResult idempotente durável AEP -> **DELETE_SUCCEEDED por arquivo** -> todos componentes previstos provados -> **CLEANUP_SUCCEEDED por ponto/tarefa** com tombstones/auditoria -> CAS reavalia fechamento e libera só reservas transitórias sem dependências. Último válido/keys e classes permanecem. Ponto fica indisponível para restore desde primeiro componente admitido; parcial não é ponto válido. CleanupSuccess não significa restore validado.

Sucesso remoto recebido com ack AEP perdido: repetir SOMENTE RecordResult/consulta da tentativa, não HTTP. Timeout/reset/5xx/crash com resultado perdido => DELETE_UNKNOWN; interromper novas admissões relevantes e reconciliação inicialmente SÓ LEITURA. 401/403 reason distingue autenticação/quota/permissão, suspende conforme saúde aplicável; não prova ausência. 404 get/delete pode ser falta de acesso, não DELETE_SUCCEEDED nem ausência provada. GET200/hash correto só prova presença naquele instante, NÃO fim de request antigo; não ativa hold enquanto houver obrigação pendente. Falha terminal de uma tentativa não encerra outras UNKNOWN. Não habilitar retry destrutivo para descobrir estado. Nova tentativa só depois de terminalidade de todas anteriores, sem hold/suspensão e com nova admissão/attempt+política atuais.

Partial/unknown lista componentes removidos comprovados e pendentes/falhos. Não apagar pasta nem última outra cópia para finalizar batch. Ausência independentemente comprovada sem recibo do delete é ABSENT_RECONCILED, não sucesso dessa tentativa; incidente/origem documentados. Reconciliação autorizada verifica head/conta/capabilities/fileIds, cerca emissor antigo, obtém evidência terminal e verifica sobreviventes. GET presente ou fence local sozinho não dá terminalidade remota. Sem prova, original continua UNKNOWN indefinidamente; não inventar timeout máximo do fornecedor.

Alternativa de recuperação útil: fonte protegida íntegra permite NOVO ponto/fileId, verificado/cifrado/conjunto+keys selados e hold específico próprio. Exibir “cópia alternativa preservada” com novo escopo; original permanece não garantido/ausente/unknown até sua própria reconciliação. Não é cancelamento retroativo nem restore executado. Ação tem autorização aplicável própria futura, não botão de retry da limpeza.

## RP5 — UI/fluxos e acessibilidade

Preservation_status separado de cleanup_status, progress100 não converte UNKNOWN em sucesso. Expor só metadados autorizados por empresa/registro/ação, sem tokens. Manter configuração/manual/agendamento/frequência/horário/fuso/30+12, histórico por ponto/arquivo/tentativa paginado/filtrado, entrada preservada em erro/conflito; consultar head atual, histórico rotulado desatualizado quando offline.

| Estado | Mensagem/verdade e ação válida |
|---|---|
| REQUESTED/PREPARED | Limpeza recebida, não executada; consultar; cancelar só pré-admissão com CAS |
| PREVIEW_ELIGIBLE | Elegível segundo consulta, ainda não excluído; solicitar conforme permissão/versão |
| DELETE_ADMITTED/MAY_HAVE_SENT/INFLIGHT | Exclusão anterior pode efetivar; acompanhar/suspender NOVAS admissões, sem desfazer garantido |
| HOLD_REQUESTED/PENDING | Preservação solicitada, ainda não confirmada; mostrar blockers e consultar mesmo hold_id |
| HOLD_ACTIVE_CONFIRMED | Ativa SOMENTE para escopo sem obrigação antiga e cópia íntegra; mostrar itens/geração |
| PRESERVATION_NOT_GUARANTEED | Exclusão já havia sido admitida ou resultado desconhecido; novas exclusões suspensas NÃO significam este ponto preservado; reconciliação autorizada/hold sobreviventes |
| PARTIAL_UNKNOWN/PARTIAL_FAILED | Componentes removidos e pendentes separados; ponto não válido; não concluir batch |
| DELETE_FAILED/AUTH_REQUIRED | Motivo seguro; reconectar mesma identidade autorizada/reavaliar, sem ampliar escopo ou apagar incerteza |
| CLEANUP_SUCCEEDED | Todos arquivos planejados com recibo terminal; lista explícita, sem inferir restore dos sobreviventes |
| RECONCILED/ALTERNATE_PRESERVED | Resultado exato da reconciliação; substituto novo tem escopo próprio, não hold original cumprido |

Loading/vazio/sem resultados/negado/conflito/indisponível continuam distintos. Ações consultam/reconciliam mesmo ID, nunca DELETE implícito. Anunciar transições e erro com rótulos sem depender de cor, foco preservado/movido à ação pertinente de modo explícito, teclado acessível. Texto normativo FLOW-BACKUPS.concurrent: hold confirmado ANTES de admissão impede delete; pedido posterior fecha novas admissões e informa preservação NÃO garantida até terminalidade. FLOW-UIBACKUP.negative/recovery usa estados acima; nenhuma mensagem genérica de limpeza suspensa serve como badge de preservação.

## RP6 — fatos, alternativa e limites

[Drivev3 files.delete](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/delete) fornece exclusão permanente por ID e resposta de sucesso, não CAS AEP/hold/cancelamento remoto; pasta pode atingir descendentes. [Drive errors](https://developers.google.com/workspace/drive/api/guides/handle-errors) distingue reasons e404 de acesso/ausência. Consulta oficial própria nesta revisão; nenhum pedido autenticado feito. etcd3.6 Txn/linearizabilidade reusados por hash sustentam metadados comuns, não atomicidade HTTP/Drive/fence físico. RP é engenharia local sob AEP/DDE/fence honestos e sem bypass a comprovar futuramente.

Preferir DDE exclusivo+admissão conservadora; worker com token+lease é rejeitado por pausa/check/hold/send. Destino com hold atômico seria alternativa diferente, não presumida do Drive aprovado. Safe-off permanece FALLBACK por autoridade/credencial/fence/health/UNKNOWN, não adiamento universal da feature. História externa necessária e keys permanecem sem poda, ameaça/horizonte AP6 intactos. RPO0/300s requisitos não medidos; gateUNKNOWN/A0FAILED/P1OPEN/P2P3 não liberadas. Nenhuma operação executada ou aceite solicitado.
