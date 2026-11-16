# GAEVA-MOD-003 · DRAFT - MOD-003 Venda Pedido Producao

Revisão 3 · draft

Coordenação: o agente principal usa a skill `TFD-harness` para coordenar e delegar as MTs conforme dependências, escopo e gates.
No Codex, o subagente `tfd_harness` é apenas de consulta/status; a delegação cabe ao agente principal.

Loop de implementação: execução e autotestes → QA independente → correções e nova revisão → PASS → aprovação humana.

Agentes: abra o [JSON canônico](task.json) e execute somente sua rota e seus checklists.

## Problema

Recorte especificado para revisao; execucao condicionada aos stops e gates humanos. Resultado alvo: Catalogo antes personalizacao; revisao aceita imutavel; publicacao vendedor;2D/proposta/recebimento elegivel;50% parcial;3D cliente E tecnico; material/capacidade/QC/foto final/saldo/postagem; OP filha sem nova venda.

## Solução

Preparar e revisar Venda Pedido Producao no unico GAEVA OS conforme spec integrada, com maturidade e bloqueios explicitamente preservados.

<a id="limites-globais"></a>
## Limites globais

Fora do escopo: Implementacao no mandato MT-A02; draft nao autoriza codigo.; Outra empresa/produto, microservico por modulo, novo CRM/chat do zero.; Publicar/Issue/branch/commit/PR/merge/deploy/restore sem autorizacao.; Codigo de roadmap sem PRD/contrato/maturidade suficientes.
Caminhos protegidos: `.git/**`, `.env*`, `uploads/**`, `docs/discovery/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/**/reviews/**`, `docs/gaeva/modulos/comercial/workflow.json`, `${LEGACY_APPLICATION_SOURCE}/**`, `${TFD_KNOWLEDGE_SOURCE}/**`

## Fases

- **P1-CONTRACT · P1 CONTRACT** · database. Agrupamento interno preservado do draft r1. Fases macro e O/M/P vinculantes em spec/phase-plan.md; nao e gate aprovado. Estimativa por fase em spec/estimates/; julgamento de planejamento r5, sem autorizar execucao.
- **P2-EXECUTION · P2 EXECUTION** · backend, ui_ux, frontend, observability. Agrupamento interno preservado do draft r1. Fases macro e O/M/P vinculantes em spec/phase-plan.md; nao e gate aprovado. Estimativa por fase em spec/estimates/; julgamento de planejamento r5, sem autorizar execucao.
- **P3-REVIEW · P3 REVIEW** · documentation, qa, security, harness. Agrupamento interno preservado do draft r1. Fases macro e O/M/P vinculantes em spec/phase-plan.md; nao e gate aprovado. Estimativa por fase em spec/estimates/; julgamento de planejamento r5, sem autorizar execucao.

## Matriz por setor

| Setor | Dono | Aplicabilidade |
|---|---|---|
| [harness](#harness) | `TFD-harness` | REQUIRED |
| [database](#database) | `TFD-database` | REQUIRED |
| [backend](#backend) | `TFD-backend` | REQUIRED |
| [frontend](#frontend) | `TFD-frontend` | REQUIRED |
| [ui_ux](#ui_ux) | `TFD-ui_ux` | REQUIRED |
| [qa](#qa) | `TFD-qa_backend` | REQUIRED |
| [security](#security) | `TFD-security` | REQUIRED |
| devops | `TFD-devops` | N/A · Sem alteracao desta superficie no recorte atual |
| [observability](#observability) | `TFD-devops` | REQUIRED |
| [documentation](#documentation) | `TFD-documentation` | REQUIRED |

<a id="harness"></a>
### harness

- **MT-09 · P3-REVIEW** harness - MOD-003 recorte verificavel · depende de MT-08
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-harness` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-003/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability harness-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Conferir todos REQUIRED, dependencias/stops e revisoes/evidencias atuais.
    - Main coordena e registra gates humanos reais; nao delega ou completa gate por mencao.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: harness - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector harness`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="database"></a>
### database

- **MT-01 · P1-CONTRACT** database - MOD-003 recorte verificavel · depende de livre
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-database` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/app/**`, `backend/tests/**`, `backend/alembic/**`, `frontend/src/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability database-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Detalhar/aplicar apenas migration e constraints do agregado dono apos gates; fixtures guardadas e sem DDL incidental.
    - Demonstrar identidade, concorrencia, reconciliacao e retorno do recorte.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: database - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector database`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="backend"></a>
### backend

- **MT-02 · P2-EXECUTION** backend - MOD-003 recorte verificavel · depende de MT-01
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-backend` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/app/**`, `backend/tests/**`, `backend/alembic/**`, `frontend/src/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability backend-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Implementar so contrato autorizado C00-06 do recorte, RBAC e identidade idempotente C01r2.
    - Demonstrar estados/negativos do TEST01 sem mocks apresentados como provider homologado.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: backend - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector backend`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="frontend"></a>
### frontend

- **MT-04 · P2-EXECUTION** frontend - MOD-003 recorte verificavel · depende de MT-03
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-frontend` · Validador independente: `@TFD-qa_ui`
  - Caminhos permitidos: `backend/app/**`, `backend/tests/**`, `backend/alembic/**`, `frontend/src/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability frontend-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Reusar U/V e contratos da spec, conservar selecao/rascunho e autorizacao do servidor.
    - Executar estados/teclado/contraste/movel aplicaveis e registrar resultado real.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: frontend - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector frontend`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="ui_ux"></a>
### ui_ux

- **MT-03 · P2-EXECUTION** ui_ux - MOD-003 recorte verificavel · depende de MT-02
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-ui_ux` · Validador independente: `@TFD-qa_ui`
  - Caminhos permitidos: `backend/app/**`, `backend/tests/**`, `backend/alembic/**`, `frontend/src/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability ui_ux-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Aplicar U/V e DEC-UX01 no recorte, preservando guia/modeless e impressao tabela.
    - Revisar estados/teclado/erro/audiencia, sem fechar politica de negocio por layout.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: ui_ux - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector ui_ux`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="qa"></a>
### qa

- **MT-07 · P3-REVIEW** qa - MOD-003 recorte verificavel · depende de MT-06
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-qa_backend` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-003/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability qa-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Inspecionar revisao independentemente e executar TEST01 aplicavel apos ambiente/gates seguros.
    - Emitir achados rastreaveis e recheck, sem autoaprovar implementacao de outro owner.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: qa - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector qa`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="security"></a>
### security

- **MT-08 · P3-REVIEW** security - MOD-003 recorte verificavel · depende de MT-07
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-security` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-003/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability security-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Verificar negativos de identidade/registro/campo/evento/arquivo/segredo do TEST01 aplicavel.
    - Registrar limites e achados da revisao entregue, sem alterar implementacao nesta rota.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: security - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector security`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="observability"></a>
### observability

- **MT-05 · P2-EXECUTION** observability - MOD-003 recorte verificavel · depende de MT-04
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/app/**`, `backend/tests/**`, `backend/alembic/**`, `frontend/src/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability observability-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Aplicar DF01-07 do recorte: origem/locks/contexto/digest ou instrumentacao, sem operar antes de autorizacao.
    - Entregar config/recovery/evidencia segura da fase; nao declarar prontidao sem T07 executado.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: observability - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector observability`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="documentation"></a>
### documentation

- **MT-06 · P3-REVIEW** documentation - MOD-003 recorte verificavel · depende de MT-05
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-documentation` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-003/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability documentation-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Registrar comportamento/fonte verificados e limites no modulo sem alegar implementacao ausente.
    - Sincronizar spec/Task/evidencia do recorte; roadmap entrega PRD/spec antes de qualquer codigo.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: documentation - MOD-003 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector documentation`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

Escopo, aceite e testes no contrato JSON desta task.
