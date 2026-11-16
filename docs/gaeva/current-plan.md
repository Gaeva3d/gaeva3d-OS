# Plano atual — nova aplicação GAEVA OS sobre FilaOps

Direção humana r10: substituir o conteúdo rastreado do mesmo Gaeva3d/gaeva3d-OS pela aplicação sobre FilaOps, preservando histórico e Issues. Esta árvore está preparada para revisão antes de commit/push; não declara publicação remota concluída. Exclusão/recriação, force-push e remoção Company estão fora desta operação.

## Composição selecionada e desenvolvimento

Base FilaOps `bdcabe5c3b8d5f0744ac5fd91620985a43922536`, distinta do main histórico ERP. Frontend congelado: 500 entradas, 50 vínculos efetivos, fingerprint `ac3c79e9d7fadf55c20e71b595bcab10d95a0e402af5ccc64f8e98304a5a9911`. DevOps é responsável por compor/aplicar a fonte exata e registrar build/publicação; este documento não certifica uma árvore remota.

O trabalho inclui baseline UI e 17 fatias funcionais limitadas. QA do layout checkpoint1-v2 encerrou FL1-01/02 com PASS limitado e 77 testes, em render sintético do shell. Isso não comprova integração autenticada/ACL. Zoom200, matriz integral de modais/estados e auditoria WCAG completa continuam sem comprovação nesta evidência. Os módulos não estão todos concluídos; contratos e stops permanecem DRAFT onde indicados. Templates existentes não são prova de ambiente seguro, guard/migração/recovery executados ou licença PRO.

## Documentos e ordem

Ler [PRD](retomada-tfd/transformacao-filaops/prd-proposta.md), [escopo e aprovações históricas](retomada-tfd/transformacao-filaops/escopo-aprovacoes.md), [Discovery](../discovery/gaeva-transformacao/findings.md), [spec integrada](retomada-tfd/transformacao-filaops/spec/integrated-spec.md), [plano por fase](retomada-tfd/transformacao-filaops/spec/phase-plan.md) e [decisões pendentes](retomada-tfd/transformacao-filaops/spec/approval-decisions.md).

Fundação → Plataforma → contratos necessários ao piloto Comercial. Um produto para Gaeva3D e DryMaia, em instalações independentes. Comercial substituirá a entrada Mensagens, preservando dados, histórico e notificações necessárias. Reutilizar Atendimento/guia existentes. Contratos C01/C02, canal/ChatbotX, KP01 agregado, PSP/gates, PRO e políticas pendentes mantêm suas condições; não criar comportamentos para fechar lacunas.

| Módulo | Revisão canônica | Contrato |
|---|---|---|
| [GAEVA-MOD-001](retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/task.md) | 4 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/task.json) |
| [GAEVA-MOD-002](retomada-tfd/transformacao-filaops/spec/tasks/MOD-002/task.md) | 2 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-002/task.json) |
| [GAEVA-MOD-003](retomada-tfd/transformacao-filaops/spec/tasks/MOD-003/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-003/task.json) |
| [GAEVA-MOD-004](retomada-tfd/transformacao-filaops/spec/tasks/MOD-004/task.md) | 2 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-004/task.json) |
| [GAEVA-MOD-005](retomada-tfd/transformacao-filaops/spec/tasks/MOD-005/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-005/task.json) |
| [GAEVA-MOD-006](retomada-tfd/transformacao-filaops/spec/tasks/MOD-006/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-006/task.json) |
| [GAEVA-MOD-007](retomada-tfd/transformacao-filaops/spec/tasks/MOD-007/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-007/task.json) |
| [GAEVA-MOD-008](retomada-tfd/transformacao-filaops/spec/tasks/MOD-008/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-008/task.json) |
| [GAEVA-MOD-009](retomada-tfd/transformacao-filaops/spec/tasks/MOD-009/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-009/task.json) |
| [GAEVA-MOD-010](retomada-tfd/transformacao-filaops/spec/tasks/MOD-010/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-010/task.json) |
| [GAEVA-MOD-011](retomada-tfd/transformacao-filaops/spec/tasks/MOD-011/task.md) | 3 | [JSON](retomada-tfd/transformacao-filaops/spec/tasks/MOD-011/task.json) |

MOD005/007/010 permanecem preparação, com stops explícitos. Nenhum dos 11 módulos é descartado pelas oito Issues ERP históricas. Correspondência histórica de Issues OS→ERP: 1→83, 2→84, 3→85, 4→86, 6→87, 8→88, 9→89, 11→90; corpos diferentes não comprovam migração sem perda. OS5/7/10 não tinham equivalente ERP; a correspondência não altera nem remove as Issues existentes no OS.


## Proveniência preservada e limites

O sistema OS anterior tinha snapshot `0faf49d0c9705b62a490a0ab81602975d930fcba`; seu histórico Git e Issues1–11 são preservados no mesmo repositório, além dos backups offline independentes. Não copiar o histórico privado ERP nem backups para esta árvore.

[Fontes e registros externos](external-references.md) distinguem registros históricos de documentos disponíveis. Aliases `${DOCUMENTATION_SOURCE}`, `${LEGACY_APPLICATION_SOURCE}` e `${TFD_KNOWLEDGE_SOURCE}` em cópias técnicas identificam fontes históricas externas, não permissões de escrita ou caminhos do novo repositório.

Os documentos/Tasks técnicos reaproveitados preservam suas revisões, regras, datas e gates históricos. Sua revisão pública independente e a verificação da composição devem preceder aplicação/publicação conforme encaminhamento do principal. A autorização r10 de atualização de conteúdo não certifica implementação integral, dados migrados ou remoção Company.

Referência upstream: [README FilaOps](../../README.FilaOps.md) e [licença](upstream/FilaOps-LICENSE.txt); seus comandos não foram executados nesta entrega.


## Estado operacional verificado

Correções de widgets shell/Contatos: QA independente limitada a 81 testes e amostras visuais; não é aprovação integral de módulos ou WCAG/ACL. Frontend500 foi aplicado ao serviço existente `gaevaos/frontend` na porta 80, imagem `sha256:452f827066c9b6b7954951cdff8da7650a274d8e4b251f54cf71121d1a82f813`. Artefatos HTML/JS/CSS conferidos; health/version200 e auth401 protegida. Backend, DB e migração preservados. A prévia5173 foi encerrada e não é destino de entrega. A publicação Git desta árvore permanece pendente da revisão.


Verificação independente pós-deploy limitada: login público na porta 80, assets e configuração conferidos; amostra estreita sem overflow e navegação Tab básica. Contatos autenticado não foi verificado; sem credenciais disponíveis. Resposta company401 e logo404 permanecem observadas. Não é certificação ACL, WCAG integral ou sistema completo.
