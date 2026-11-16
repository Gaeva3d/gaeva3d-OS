# GAEVA-MOD-010 · DRAFT - MOD-010 Folha

Revisão 3 · draft

Coordenação: o agente principal usa a skill `TFD-harness` para coordenar e delegar as MTs conforme dependências, escopo e gates.
No Codex, o subagente `tfd_harness` é apenas de consulta/status; a delegação cabe ao agente principal.

Loop de implementação: execução e autotestes → QA independente → correções e nova revisão → PASS → aprovação humana.

Agentes: abra o [JSON canônico](task.json) e execute somente sua rota e seus checklists.

## Problema

ROADMAP: somente PRD/spec; nenhuma implementacao pronta. Resultado alvo: Preparar PRD/cobertura/aplicabilidade/prioridade de Folha; sem inferir funcionalidades, formulas legais ou uso de dados reais.

## Solução

Preparar e revisar Folha no unico GAEVA OS conforme spec integrada, com maturidade e bloqueios explicitamente preservados.

<a id="limites-globais"></a>
## Limites globais

Fora do escopo: Implementacao no mandato MT-A02; draft nao autoriza codigo.; Outra empresa/produto, microservico por modulo, novo CRM/chat do zero.; Publicar/Issue/branch/commit/PR/merge/deploy/restore sem autorizacao.; Codigo de roadmap sem PRD/contrato/maturidade suficientes.
Caminhos protegidos: `.git/**`, `.env*`, `uploads/**`, `docs/discovery/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/**/reviews/**`, `docs/gaeva/modulos/comercial/workflow.json`, `${LEGACY_APPLICATION_SOURCE}/**`, `${TFD_KNOWLEDGE_SOURCE}/**`

## Fases

- **P1-PREPARATION · P1 PREPARATION** · documentation, qa, harness. Agrupamento interno preservado do draft r1. Fases macro e O/M/P vinculantes em spec/phase-plan.md; nao e gate aprovado. Estimativa por fase em spec/estimates/; julgamento de planejamento r5, sem autorizar execucao.

## Matriz por setor

| Setor | Dono | Aplicabilidade |
|---|---|---|
| [harness](#harness) | `TFD-harness` | REQUIRED |
| database | `TFD-database` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| backend | `TFD-backend` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| frontend | `TFD-frontend` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| ui_ux | `TFD-ui_ux` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| [qa](#qa) | `TFD-qa_backend` | REQUIRED |
| security | `TFD-security` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| devops | `TFD-devops` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| observability | `TFD-devops` | N/A · Sem implementacao deste setor no recorte; modulo roadmap permanece preparacao |
| [documentation](#documentation) | `TFD-documentation` | REQUIRED |

<a id="harness"></a>
### harness

- **MT-03 · P1-PREPARATION** harness - MOD-010 recorte verificavel · depende de MT-02
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-harness` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-010/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability harness-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Conferir todos REQUIRED, dependencias/stops e revisoes/evidencias atuais.
    - Main coordena e registra gates humanos reais; nao delega ou completa gate por mencao.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: harness - MOD-010 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector harness`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="qa"></a>
### qa

- **MT-02 · P1-PREPARATION** qa - MOD-010 recorte verificavel · depende de MT-01
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-qa_backend` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-010/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability qa-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Inspecionar revisao independentemente e executar TEST01 aplicavel apos ambiente/gates seguros.
    - Emitir achados rastreaveis e recheck, sem autoaprovar implementacao de outro owner.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: qa - MOD-010 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector qa`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="documentation"></a>
### documentation

- **MT-01 · P1-PREPARATION** documentation - MOD-010 recorte verificavel · depende de livre
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-documentation` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-010/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability documentation-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Registrar comportamento/fonte verificados e limites no modulo sem alegar implementacao ausente.
    - Sincronizar spec/Task/evidencia do recorte; roadmap entrega PRD/spec antes de qualquer codigo.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: documentation - MOD-010 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector documentation`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

Escopo, aceite e testes no contrato JSON desta task.
