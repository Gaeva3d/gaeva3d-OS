# GAEVA-MOD-001 · DRAFT - MOD-001 Fundacao

Revisão 4 · draft

Coordenação: o agente principal usa a skill `TFD-harness` para coordenar e delegar as MTs conforme dependências, escopo e gates.
No Codex, o subagente `tfd_harness` é apenas de consulta/status; a delegação cabe ao agente principal.

Loop de implementação: execução e autotestes → QA independente → correções e nova revisão → PASS → aprovação humana.

Agentes: abra o [JSON canônico](task.json) e execute somente sua rota e seus checklists.

## Problema

Recorte especificado para revisao; execucao condicionada aos stops e gates humanos. Resultado alvo: DF01-03 origem B/contexto/locks/digest; DF04 guard antes de imports com tupla efetiva e identidade; DF05-07 migrador unico/roles, API sem DDL/download e recovery isolado.

## Solução

Preparar e revisar Fundacao no unico GAEVA OS conforme spec integrada, com maturidade e bloqueios explicitamente preservados.

<a id="limites-globais"></a>
## Limites globais

Fora do escopo: Implementacao no mandato MT-A02; draft nao autoriza codigo.; Outra empresa/produto, microservico por modulo, novo CRM/chat do zero.; Publicar/Issue/branch/commit/PR/merge/deploy/restore sem autorizacao.; Codigo de roadmap sem PRD/contrato/maturidade suficientes.
Caminhos protegidos: `.git/**`, `.env*`, `uploads/**`, `docs/discovery/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/**/reviews/**`, `docs/gaeva/modulos/comercial/workflow.json`, `${LEGACY_APPLICATION_SOURCE}/**`, `${TFD_KNOWLEDGE_SOURCE}/**`

## Fases

- **P1-CONTRACT · F1-P1 — Proveniência e configuração** · devops. DF01–03 e contrato de configuração precedem a prova offline de DF04.
- **P2-EXECUTION · F1-P2 — Prova offline do guard DF04** · backend, database, observability, security. Backend, Database e DevOps/observabilidade produzem evidência offline com QA Backend. Security revisa os três recibos e emite parecer sobre a mesma revisão/configuração. Os quatro resultados e o gate humano precedem qualquer conexão real.
- **P3-REVIEW · F1-P3 — Migração, recuperação e revisão** · database, devops, documentation, qa, security, harness. Operações dependem da evidência DF04 e dos gates humanos. Identidade em leitura antecede efeitos. Recuperação depende de autorização operacional separada.

## Matriz por setor

| Setor | Dono | Aplicabilidade |
|---|---|---|
| [harness](#harness) | `TFD-harness` | REQUIRED |
| [database](#database) | `TFD-database` | REQUIRED |
| [backend](#backend) | `TFD-backend` | REQUIRED |
| frontend | `TFD-frontend` | N/A · Sem alteracao desta superficie no recorte atual |
| ui_ux | `TFD-ui_ux` | N/A · Sem alteracao desta superficie no recorte atual |
| [qa](#qa) | `TFD-qa_backend` | REQUIRED |
| [security](#security) | `TFD-security` | REQUIRED |
| [devops](#devops) | `TFD-devops` | REQUIRED |
| [observability](#observability) | `TFD-devops` | REQUIRED |
| [documentation](#documentation) | `TFD-documentation` | REQUIRED |

<a id="harness"></a>
### harness

- **MT-08 · P3-REVIEW** harness - MOD-001 recorte verificavel · depende de MT-07
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-harness` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability harness-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Conferir todos REQUIRED, dependencias/stops e revisoes/evidencias atuais.
    - Main coordena e registra gates humanos reais; nao delega ou completa gate por mencao.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: harness - MOD-001 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector harness`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="database"></a>
### database

- **MT-09 · P2-EXECUTION** F1-P2 — Verificar allowlist e fixtures offline · depende de MT-03
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-database` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/tests/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability database-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Definir a tupla allowlisted de banco/role/instância e conferir offline que a configuração conflitante bloqueia o conector.
    - Preparar fixtures sintéticas e o procedimento de identidade de F1-P3. Conferir offline os asserts de REF-08 de zero import de pytest, conftest, app, settings, SQLAlchemy ou outro driver de banco, zero tentativa de conexão e zero mkdir nos negativos. Nenhuma carga de fixture, DDL ou restauração.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Recibo offline evidence/df04-database.json de TEST-01/T07-P4, com negativos, expectativa de identidade e comandos/exits.
  - Concluído quando: Allowlist, negativos e contrato de fixtures conferidos offline e revisados por TFD-qa_backend.
- **MT-02 · P3-REVIEW** F1-P3 — Confirmar identidade e aplicar migração isolada · depende de MT-03, MT-09, MT-04, MT-11
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-database` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/tests/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`, `backend/app/core/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability database-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Exigir os três recibos DF04 (MT-03, MT-09, MT-04) com PASS independente de TFD-qa_backend e o parecer PASS de TFD-security de MT-11 (evidence/df04-security.json), todos da mesma revisão e configuração efetiva e os gates humanos antes de qualquer tentativa de conexão real ou operação.
    - Reaplicar DF04 antes de cada tentativa de conexão. Em alvo novo e isolado, a primeira conexão somente lê DB, role e instância. Se a identidade divergir, parar antes de qualquer efeito.
    - Só após confirmar identidade, aplicar migração e constraints autorizadas por um único job/lock/role, carregar as fixtures sintéticas permitidas e conferir reconciliação. Demonstrar T07-P4 pós-conexão e T07-P5/P6 aplicáveis.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Recibo de identidade, precedência DF04, comandos/exits, migrador único, fixtures e reconciliação autorizadas.
  - Concluído quando: Guard e identidade confirmados antes de efeitos; concorrência e reconciliação de TEST-01 comprovadas e revisadas independentemente.

[JSON](task.json) · `--sector database`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="backend"></a>
### backend

- **MT-03 · P2-EXECUTION** F1-P2 — Implementar e provar offline o guard DF04 · depende de MT-01
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-backend` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/tests/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`, `backend/app/core/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability backend-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Implementar DF04 em ponto de entrada somente stdlib, antes de importar pytest, conftest, app, settings, SQLAlchemy ou outro driver de banco ou abrir rede, sem carregar .env. Validar a tupla efetiva com allowlist e rejeitar ENV ausente/incorreto, URL de produção com DB_NAME de teste, tupla divergente, alias e opções redirecionadoras.
    - Testar offline a tupla permitida e os negativos com mocks de conector e efeitos. Nos negativos, afirmar zero import de pytest, conftest, app, settings, SQLAlchemy ou outro driver de banco, zero tentativa de conexão e zero mkdir. Nenhuma carga de fixture, migração ou restauração.
    - Vincular casos, comandos, exits e zero efeitos nos negativos à revisão e à configuração efetiva, sem segredos.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Recibo offline evidence/df04-backend.json de TEST-01/T07-P4, vinculado à revisão e configuração efetiva.
  - Concluído quando: Guard implementado e prova offline aprovada por TFD-qa_backend na revisão corrente.

[JSON](task.json) · `--sector backend`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="qa"></a>
### qa

- **MT-06 · P3-REVIEW** qa - MOD-001 recorte verificavel · depende de MT-05
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-qa_backend` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability qa-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Inspecionar a evidência de TEST-01 independentemente. Se houver repetição operacional autorizada, exigir os três recibos DF04 (MT-03, MT-09, MT-04) com PASS independente de TFD-qa_backend e o parecer PASS de TFD-security de MT-11 (evidence/df04-security.json), todos da mesma revisão e configuração efetiva e os gates humanos antes de qualquer tentativa de conexão. Reaplicar guard e confirmar identidade em leitura antes de efeitos.
    - Emitir achados rastreaveis e recheck, sem autoaprovar implementacao de outro owner.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: qa - MOD-001 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector qa`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="security"></a>
### security

- **MT-11 · P2-EXECUTION** F1-P2 — Revisar independentemente a prova offline do guard · depende de MT-03, MT-09, MT-04
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-security` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability security-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Conferir os três recibos DF04 de MT-03, MT-09 e MT-04 e os respectivos PASS independentes de TFD-qa_backend, todos vinculados à mesma revisão do guard e configuração efetiva.
    - Inspecionar T07-P4/REF-08, ponto de entrada somente stdlib e asserts de zero import de pytest, conftest, app, settings, SQLAlchemy ou outro driver de banco, zero tentativa de conexão e zero mkdir nos negativos. Confirmar allowlist, rejeição de redirecionamento e ausência de segredos. Trabalho offline, sem alterar guard/fixtures, importar a aplicação ou drivers, conectar, migrar ou restaurar.
    - Emitir parecer de Security com comandos/exits referenciados, identidade da revisão e da configuração efetiva sanitizada. Se faltar prova ou houver divergência, bloquear F1-P3 sem tentativa de conexão.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Parecer independente de TFD-security em evidence/df04-security.json, com verdict e vínculos aos três recibos DF04 da mesma revisão/configuração.
  - Concluído quando: Security registra PASS da prova offline atual e TFD-qa_spec valida a evidência. Ausência de PASS bloqueia qualquer tentativa de conexão real.
- **MT-07 · P3-REVIEW** security - MOD-001 recorte verificavel · depende de MT-06
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-security` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability security-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Verificar negativos de identidade/registro/campo/evento/arquivo/segredo do TEST01 aplicavel.
    - Registrar limites e achados da revisao entregue, sem alterar implementacao nesta rota.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: security - MOD-001 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector security`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="devops"></a>
### devops

- **MT-01 · P1-CONTRACT** F1-P1 — Proveniência e contrato de configuração · depende de livre
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/.dockerignore`, `backend/.dockerignore`, `docker-compose*.yml`, `.github/workflows/**`, `backend/requirements*.txt`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability devops-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Fixar DF01–03: fonte B, contexto, locks, bases/digest e contratos de configuração dev/test/prod/restore sem segredos.
    - Limitar T07-P1–P3 ao recorte de proveniência e configuração. Preparar registro e modelos sem provisionar, importar a aplicação, conectar, carregar fixtures, migrar ou restaurar.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Evidência sanitizada de proveniência, configuração e limites dos alvos em evidence/.
  - Concluído quando: Entregas DF01–03 de F1-P1 demonstradas e revisadas, sem etapa operacional do TEST-01.
- **MT-10 · P3-REVIEW** F1-P3 — Verificar startup e ensaiar recuperação autorizada · depende de MT-03, MT-09, MT-04, MT-02, MT-11
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/tests/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`, `backend/app/core/**`, `backend/app/main.py`, `docker-compose*.yml`, `.github/workflows/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability devops-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Exigir os três recibos DF04 (MT-03, MT-09, MT-04) com PASS independente de TFD-qa_backend e o parecer PASS de TFD-security de MT-11 (evidence/df04-security.json), todos da mesma revisão e configuração efetiva, a evidência de MT-02 e os gates humanos antes de qualquer tentativa de conexão real ou teste com serviços.
    - Reaplicar DF04 antes de cada tentativa de conexão. Em alvo novo e isolado, a primeira conexão somente lê DB, role e instância. Se a identidade divergir, parar antes de qualquer efeito.
    - Demonstrar startup da API sem DDL/download/seed e sinalizar indisponibilidade PRO sem download no startup.
    - Com autorização operacional separada e após comprovar identidade do alvo, ensaiar restauração e rollback somente em recurso novo isolado. Reconciliar banco, objetos, configuração e jornada sintética conforme T07-P7.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Recibos de startup e recuperação/rollback de TEST-01/T07-P5–P7, com comandos/exits, identidade e reconciliação.
  - Concluído quando: Startup sem efeitos proibidos e recuperação reconciliada em alvo novo, com evidência independente. Sem prova, base não pronta.

[JSON](task.json) · `--sector devops`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="observability"></a>
### observability

- **MT-04 · P2-EXECUTION** F1-P2 — Isolar e instrumentar a prova do guard · depende de MT-03, MT-09
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/tests/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`, `.github/workflows/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability observability-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Preparar isolamento e CI de DF04 para rodar a prova offline pelo ponto de entrada somente stdlib, sem provisionar serviços ou abrir conexão real. Conferir ausência de import de pytest, conftest, app, settings, SQLAlchemy ou outro driver de banco antes do guard.
    - Demonstrar que falha no guard, falta de PASS de QA Backend ou ausência do parecer atual de Security impede a operação. Exigir os asserts de zero import de app/driver, zero tentativa de conexão e zero mkdir nos negativos. Registrar sinais sanitizados sem ativar fixture, migração ou recuperação.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Recibo offline evidence/df04-ci.json de TEST-01/T07-P4 com comando/exits, isolamento e propagação da falha.
  - Concluído quando: Isolamento e falha bloqueante demonstrados offline e revisados por TFD-qa_backend.

[JSON](task.json) · `--sector observability`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="documentation"></a>
### documentation

- **MT-05 · P3-REVIEW** documentation - MOD-001 recorte verificavel · depende de MT-10
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-documentation` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability documentation-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Registrar comportamento/fonte verificados e limites no modulo sem alegar implementacao ausente.
    - Sincronizar spec/Task/evidencia do recorte; roadmap entrega PRD/spec antes de qualquer codigo.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: documentation - MOD-001 recorte verificavel: resultado e evidencia propria da fase, conforme REF01/03.
  - Concluído quando: Escopo REF01 e TEST01 aplicaveis demonstrados; stops/gates respeitados, revisao independente atual.

[JSON](task.json) · `--sector documentation`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

Escopo, aceite e testes no contrato JSON desta task.
