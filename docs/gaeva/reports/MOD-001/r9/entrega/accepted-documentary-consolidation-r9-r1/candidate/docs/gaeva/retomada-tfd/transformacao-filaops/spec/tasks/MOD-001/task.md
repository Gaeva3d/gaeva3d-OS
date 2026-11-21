# GAEVA-MOD-001 · DRAFT - MOD-001 Fundacao r6 / contrato integrado para revisao

Revisão 9 · draft

Coordenação: o agente principal usa a skill `TFD-harness` para coordenar e delegar as MTs conforme dependências, escopo e gates.
No Codex, o subagente `tfd_harness` é apenas de consulta/status; a delegação cabe ao agente principal.

Loop de implementação: execução e autotestes → QA independente → correções e nova revisão → PASS → aprovação humana.

Agentes: abra o [JSON canônico](task.json) e execute somente sua rota e seus checklists.

## Problema

Recorte especificado para revisao; execucao condicionada aos stops e gates humanos. Resultado alvo: DF01-03 origem S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional/contexto/locks/digest; DF04 guard antes de imports com tupla efetiva e identidade; DF05-07 migrador unico/roles, API sem DDL/download e recovery isolado.

## Solução

Preparar e revisar Fundacao no unico GAEVA OS conforme spec integrada, com maturidade e bloqueios explicitamente preservados. Integrar HA, operações protegidas, arquivos, recuperação, backups/limpeza e autorização com contratos revisados de pesquisa; implementação continua não autorizada.

## Cobertura técnica

| Área | Estado | Resumo / justificativa | Evidências e aceite |
|---|---|---|---|
| Negócio | COVERED | Cobertura DOCUMENTAL proposta business: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-01, MT-03, MT-09, MT-04, MT-11, MT-02, MT-10, MT-05, MT-06, MT-07, MT-08, MT-12, MT-13, MT-14, MT-15, MT-16, MT-17, MT-18, MT-19, MT-20, MT-21, MT-22, MT-23, MT-24 · AC-01, AC-101, AC-102, AC-103, AC-104, AC-105, AC-106, AC-107, AC-108, AC-109, AC-110, AC-111, AC-112, AC-113, AC-114, AC-115, AC-116, AC-117, AC-118, AC-119, AC-120, AC-121, AC-122, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-153, AC-154, AC-155, AC-156, AC-157, AC-158, AC-159, AC-160, AC-161, AC-162, AC-163, AC-164, AC-165, AC-166, AC-167, AC-168, AC-169, AC-170, AC-171, AC-172, AC-173, AC-174, AC-175, AC-176, AC-177, AC-178, AC-179, AC-180, AC-181, AC-182, AC-183, AC-184, AC-185, AC-186, AC-187, AC-188, AC-250 · RULE-01, RULE-02, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-205, RULE-206, RULE-207, RULE-208, RULE-209, RULE-210, RULE-211, RULE-212, RULE-213, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230 |
| UI/UX | COVERED | Cobertura DOCUMENTAL proposta ui_ux: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-12, MT-13, MT-21 · AC-161, AC-162, AC-163, AC-164, AC-169, AC-170, AC-171, AC-172, AC-177, AC-178, AC-179, AC-180, AC-185, AC-186, AC-187, AC-188 |
| Frontend | COVERED | Cobertura DOCUMENTAL proposta frontend: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-13, MT-21 · AC-161, AC-162, AC-163, AC-164, AC-169, AC-170, AC-171, AC-172, AC-177, AC-178, AC-179, AC-180, AC-185, AC-186, AC-187, AC-188 |
| Backend | COVERED | Cobertura DOCUMENTAL proposta backend: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-03, MT-16, MT-18 · AC-01, AC-101, AC-102, AC-103, AC-104, AC-105, AC-106, AC-107, AC-108, AC-109, AC-110, AC-111, AC-112, AC-113, AC-114, AC-115, AC-116, AC-117, AC-118, AC-119, AC-120, AC-121, AC-122, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-153, AC-154, AC-155, AC-156, AC-157, AC-158, AC-159, AC-160, AC-161, AC-162, AC-163, AC-164, AC-165, AC-166, AC-167, AC-168, AC-169, AC-170, AC-171, AC-172, AC-173, AC-174, AC-175, AC-176, AC-177, AC-178, AC-179, AC-180 |
| Dados | COVERED | Cobertura DOCUMENTAL proposta data: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-02, MT-09, MT-14, MT-17 · AC-01, AC-101, AC-102, AC-103, AC-104, AC-105, AC-106, AC-107, AC-108, AC-109, AC-110, AC-111, AC-112, AC-113, AC-114, AC-115, AC-116, AC-117, AC-118, AC-119, AC-120, AC-121, AC-122, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-153, AC-154, AC-155, AC-156, AC-165, AC-166, AC-167, AC-168, AC-173, AC-174, AC-175, AC-176, AC-181, AC-182, AC-183, AC-184 |
| Segurança | COVERED | Cobertura DOCUMENTAL proposta security: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-07, MT-11, MT-22 · AC-01, AC-101, AC-102, AC-103, AC-104, AC-105, AC-106, AC-107, AC-108, AC-109, AC-110, AC-111, AC-112, AC-113, AC-114, AC-115, AC-116, AC-117, AC-118, AC-119, AC-120, AC-121, AC-122, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-157, AC-158, AC-159, AC-160, AC-165, AC-166, AC-167, AC-168, AC-173, AC-174, AC-175, AC-176, AC-181, AC-182, AC-183, AC-184, AC-185, AC-186, AC-187, AC-188 |
| Qualidade | COVERED | Cobertura DOCUMENTAL proposta quality: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-06, MT-20, MT-21 · AC-01, AC-101, AC-102, AC-103, AC-104, AC-105, AC-106, AC-107, AC-108, AC-109, AC-110, AC-111, AC-112, AC-113, AC-114, AC-115, AC-116, AC-117, AC-118, AC-119, AC-120, AC-121, AC-122, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-153, AC-154, AC-155, AC-156, AC-157, AC-158, AC-159, AC-160, AC-161, AC-162, AC-163, AC-164, AC-165, AC-166, AC-167, AC-168, AC-169, AC-170, AC-171, AC-172, AC-173, AC-174, AC-175, AC-176, AC-177, AC-178, AC-179, AC-180, AC-181, AC-182, AC-183, AC-184, AC-185, AC-186, AC-187, AC-188 |
| Operações | COVERED | Cobertura DOCUMENTAL proposta operations: fases/contratos e critérios rastreados; não execução nem QA PASS. | REF-12, REF-13, REF-14, REF-15 · MT-01, MT-04, MT-10, MT-15, MT-19, MT-23, MT-24 · AC-01, AC-101, AC-102, AC-103, AC-104, AC-105, AC-106, AC-107, AC-108, AC-109, AC-110, AC-111, AC-112, AC-113, AC-114, AC-115, AC-116, AC-117, AC-118, AC-119, AC-120, AC-121, AC-122, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-165, AC-166, AC-167, AC-168, AC-181, AC-182, AC-183, AC-184, AC-185, AC-186, AC-187, AC-188, AC-250 |

<a id="limites-globais"></a>
## Limites globais

Fora do escopo: Implementacao no mandato MT-A02; draft nao autoriza codigo.; Outra empresa/produto, microservico por modulo, novo CRM/chat do zero.; Publicar/Issue/branch/commit/PR/merge/deploy/restore sem autorizacao.; Codigo de roadmap sem PRD/contrato/maturidade suficientes.; Implementar telas de #2 ou abrir Tasks #2-11; somente definir dependências e contratos nesta Fundação.; Nenhum código/DB/infra/Drive/restore/migração/failover/publicação autorizado pela Task draft; futuros allowed_paths exigem fase/QA/aceite e autorização específica.
Caminhos protegidos: `.git/**`, `.env*`, `uploads/**`, `docs/discovery/**`, `docs/gaeva/retomada-tfd/transformacao-filaops/**/reviews/**`, `docs/gaeva/modulos/comercial/workflow.json`, `C:/Users/teste/Documents/Gaeva OS/**`, `C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/knowledge/**`

## Fases

- **P1-CONTRACT · F1-P1 — Proveniência e configuração** · devops. DF01–03 e contrato de configuração precedem a prova offline de DF04.
- **P2-EXECUTION · F1-P2 — Prova offline do guard DF04** · backend, database, observability, security. Backend, Database e DevOps/observabilidade produzem evidência offline com QA Backend. Security revisa os três recibos e emite parecer sobre a mesma revisão/configuração. Os quatro resultados e o gate humano precedem qualquer conexão real.
- **P3-REVIEW · F1-P3 — Migração, recuperação e revisão** · database, devops, documentation, qa, security, harness. Operações dependem da evidência DF04 e dos gates humanos. Identidade em leitura antecede efeitos. Recuperação depende de autorização operacional separada.
- **P4-CONTROLS · Controles duráveis e proteção HA/externa** · ui_ux, frontend, database, devops, backend. P3 comprovada/aceita e nova aprovação específica; não liberada
- **P5-BACKUPS · Backups e retenção com executor fiscalizado** · database, backend, devops. P4 integrada e aprovada; Drive real/recuperação só com autorização específica
- **P6-ASSURANCE · Provas integradas e dependências documentadas** · qa, QA UI documental/integrada, security, documentation, harness. P5 + todos contratos; alvo novo isolado/guard antes de efeitos

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
| [devops](#devops) | `TFD-devops` | REQUIRED |
| [observability](#observability) | `TFD-devops` | REQUIRED |
| [documentation](#documentation) | `TFD-documentation` | REQUIRED |
| [QA UI documental/integrada](#qa_ui) | `TFD-qa_ui` | REQUIRED |

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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-24 · P6-ASSURANCE** Revisão final e entrega para aceite · depende de MT-23
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-harness` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Vincular todos PASS atuais aplicáveis à revisão entregue e decisão humana real; não inventar ledger/gates/publicação.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Vincular todos PASS atuais aplicáveis à revisão entregue e decisão humana real; não inventar ledger/gates/publicação. Evidência sanitizada por cenário e limite.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-250: Docs e entrega preservam comportamento comprovado/limites e quatro pareceres atuais aplicáveis antes de aceite, sem autorização operacional presumida. · REQ-14, REQ-130, RULE-230, TEST-250

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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-14 · P4-CONTROLS** Modelo durável e prova por história · depende de MT-08
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-database` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Detalhar migrações futuras LOGGED/op/journal/outbox/barreira/pins e CAS AEP, concorrência por agregado e policy, AP1-AP6; nenhuma DDL agora.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Detalhar migrações futuras LOGGED/op/journal/outbox/barreira/pins e CAS AEP, concorrência por agregado e policy, AP1-AP6; nenhuma DDL agora. Evidência sanitizada por cenário e limite.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-145: FLOW-HA/positive: confirmados sobrevivem perda de um servidor Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-145
  - Aceite AC-146: FLOW-HA/negative: cancelamento/local nonce sem ack não publica Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-146
  - Aceite AC-147: FLOW-HA/concurrent: mudança de membros drena/fence e conserva prefixo Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-147
  - Aceite AC-148: FLOW-HA/recovery: retomar jornadas e nova gravação protegida<=300s Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-148
  - Aceite AC-149: FLOW-FILES/positive: todos anexos com bytes e pin antes do vínculo Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-149
  - Aceite AC-150: FLOW-FILES/negative: objeto ausente/GC não pode receber sucesso Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-150
  - Aceite AC-151: FLOW-FILES/concurrent: pause após pin, hold versus delete irrevogável Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-151
  - Aceite AC-152: FLOW-FILES/recovery: pin sem TTL sobrevive promoção/reconciliação Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-152
  - Aceite AC-153: FLOW-OPS/positive: mesmo ID/digest retorna resultado protegido Contrato C1/AP2/AP3. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-153
  - Aceite AC-154: FLOW-OPS/negative: outro digest conflita; nenhum falso salvo Contrato C1/AP2/AP3. Exibir Falha 1106 e o campo autorizado para dados inválidos, sem retry automático. Código público tem significado estável e independe de HTTP, reason_code seguro e operation_id. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-154
  - Aceite AC-155: FLOW-OPS/concurrent: CAS/versão impede overwrite silencioso Contrato C1/AP2/AP3. Rascunho: concorrência exige reaplicação explícita. Confirmar v1 remove só v1 e preserva v2. Conflito de versão exibe Falha 1104, preserva rascunho e só permite reaplicação explícita. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-155
  - Aceite AC-156: FLOW-OPS/recovery: timeout mantém pendente e reconcilia mesmo ID Contrato C1/AP2/AP3. Versão local cifrada no IndexedDB durante a digitação sem submeter antes de Salvar. Retomar apenas operação solicitada após revalidar acesso e consultar o ID original. Se ausente na autoridade corrente e elegível para retry, reenviar versão e conteúdo originais. Se já confirmado, reapresentar o resultado protegido. Toda ação Salvar do ERP passa pelo contrato da fila comum. Falha 1101 exige cópia durável e elegibilidade, 1102 identifica resultado incerto, inclusive em ações sem fila por contrato, e autoriza consulta se suportada. 1103 informa falha ou perda da proteção local esperada. Nenhuma ação insegura entra em retry automático. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-156
  - Aceite AC-173: FLOW-PERMS/positive: herdado/allow/deny/efetivo e deny prevalece Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-173
  - Aceite AC-174: FLOW-PERMS/negative: acesso não concede alçada; invariantes/admin-only Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-174
  - Aceite AC-175: FLOW-PERMS/concurrent: duas remoções preservam último admin e vedam autoescalada Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-175
  - Aceite AC-176: FLOW-PERMS/recovery: revoga sessões/conexões; restore sem restaurar grant obsoleto Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-176
  - Aceite AC-181: FLOW-DR/positive: cut completo precede cada sucesso enquanto custódia sobrevive Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-181
  - Aceite AC-182: FLOW-DR/negative: allhistories+keys destruídas é impossível; sem janela aprovada Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-182
  - Aceite AC-183: FLOW-DR/concurrent: cauda externa/gerações/policy CAS coerentes Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-183
  - Aceite AC-184: FLOW-DR/recovery: corrupção exige journal causal; história sem poda automática Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-184
- **MT-17 · P5-BACKUPS** Retenção e reservas concorrentes · depende de MT-16
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-database` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Definir fechamento de dependências/keys, classes30/12, reserva S e CAS de RP2/RP3, dois cleaners, holds e UNKNOWN sem TTL.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Definir fechamento de dependências/keys, classes30/12, reserva S e CAS de RP2/RP3, dois cleaners, holds e UNKNOWN sem TTL. Evidência sanitizada por cenário e limite.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-165: FLOW-BACKUPS/positive: NORMAL: ponto dispensado por AMBAS classes, válido e sem hold; reserva último válido+closure+keys; AEP admite fileId exato; DDE recebe sucesso oficial; RecordResult durável por componente; CLEANUP_SUCCEEDED somente todos comprovados. Safe-off é fallback. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-165
  - Aceite AC-166: FLOW-BACKUPS/negative: Backup/verify/auth/fence falhos ou UNKNOWN relevante suspendem NOVAS admissões; sem pasta/raiz, sem GC da história externa/keys/objetos. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-166
  - Aceite AC-167: FLOW-BACKUPS/concurrent: Hold confirmado ANTES de DELETE_ADMITTED impede envio; pedido POSTERIOR fecha novas admissões e retorna HOLD_REQUESTED/PRESERVATION_NOT_GUARANTEED, nunca preservação retroativa. Dois cleaners competem CAS/reservas de sobreviventes sem TTL. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-167
  - Aceite AC-168: FLOW-BACKUPS/recovery: Ack AEP perdido após sucesso repete somente RecordResult/consulta MESMO attempt; resultado perdido mantém UNKNOWN sem TTL. 403/404/GETpresente não provam terminalidade; parcial mantém reservas; alternativa recuperável tem NOVO point/fileId e escopo próprio, original continua não garantido. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-168

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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-16 · P4-CONTROLS** Contratos de operações e receptores · depende de MT-13, MT-14, MT-15
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-backend` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Contratos documentais ChangePolicy/GetOutcome/AP3/AP5 definidos em typed-actions-v1/action-contracts.md ACAT e action-fields.md ACT, schemas e catálogo. FUTURA implementação das variantes definidas e seus oracles somente após autorização própria/paths/gates/QA; sem código autorizado hoje.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Contratos documentais ChangePolicy/GetOutcome/AP3/AP5 definidos em typed-actions-v1/action-contracts.md ACAT e action-fields.md ACT, schemas e catálogo. FUTURA implementação das variantes definidas e seus oracles somente após autorização própria/paths/gates/QA; sem código autorizado hoje. Preservar imutabilidade da operação solicitada, consulta/retry do mesmo ID e validação de acesso atual. Vincular AC-155/156 sem alterar as ações tipadas. Relacionar adoção por módulo, elegibilidade, reconciliação e classificação segura de resultado, sem alterar o envelope C1.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20, REF-21
  - Aceite AC-145: FLOW-HA/positive: confirmados sobrevivem perda de um servidor Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-145
  - Aceite AC-146: FLOW-HA/negative: cancelamento/local nonce sem ack não publica Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-146
  - Aceite AC-147: FLOW-HA/concurrent: mudança de membros drena/fence e conserva prefixo Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-147
  - Aceite AC-148: FLOW-HA/recovery: retomar jornadas e nova gravação protegida<=300s Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-148
  - Aceite AC-149: FLOW-FILES/positive: todos anexos com bytes e pin antes do vínculo Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-149
  - Aceite AC-150: FLOW-FILES/negative: objeto ausente/GC não pode receber sucesso Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-150
  - Aceite AC-151: FLOW-FILES/concurrent: pause após pin, hold versus delete irrevogável Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-151
  - Aceite AC-152: FLOW-FILES/recovery: pin sem TTL sobrevive promoção/reconciliação Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-152
  - Aceite AC-153: FLOW-OPS/positive: mesmo ID/digest retorna resultado protegido Contrato C1/AP2/AP3. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-153
  - Aceite AC-154: FLOW-OPS/negative: outro digest conflita; nenhum falso salvo Contrato C1/AP2/AP3. Exibir Falha 1106 e o campo autorizado para dados inválidos, sem retry automático. Código público tem significado estável e independe de HTTP, reason_code seguro e operation_id. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-154
  - Aceite AC-155: FLOW-OPS/concurrent: CAS/versão impede overwrite silencioso Contrato C1/AP2/AP3. Rascunho: concorrência exige reaplicação explícita. Confirmar v1 remove só v1 e preserva v2. Conflito de versão exibe Falha 1104, preserva rascunho e só permite reaplicação explícita. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-155
  - Aceite AC-156: FLOW-OPS/recovery: timeout mantém pendente e reconcilia mesmo ID Contrato C1/AP2/AP3. Versão local cifrada no IndexedDB durante a digitação sem submeter antes de Salvar. Retomar apenas operação solicitada após revalidar acesso e consultar o ID original. Se ausente na autoridade corrente e elegível para retry, reenviar versão e conteúdo originais. Se já confirmado, reapresentar o resultado protegido. Toda ação Salvar do ERP passa pelo contrato da fila comum. Falha 1101 exige cópia durável e elegibilidade, 1102 identifica resultado incerto, inclusive em ações sem fila por contrato, e autoriza consulta se suportada. 1103 informa falha ou perda da proteção local esperada. Nenhuma ação insegura entra em retry automático. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-156
  - Aceite AC-157: FLOW-JOBS/positive: accepted/completed distintos e obrigação persistida Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-157
  - Aceite AC-158: FLOW-JOBS/negative: cache perdido não apaga job confirmado Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-158
  - Aceite AC-159: FLOW-JOBS/concurrent: workers disputam lease sem duplicar efeito elegível Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-159
  - Aceite AC-160: FLOW-JOBS/recovery: erro/backoff limitado ou suspensão de efeito ambíguo Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-160
  - Aceite AC-161: FLOW-CHAT/positive: mensagem+obrigação atômica, salvo/entregue/lido Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-161
  - Aceite AC-162: FLOW-CHAT/negative: falha entrega visível; sem retry ambíguo inelegível Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-162
  - Aceite AC-163: FLOW-CHAT/concurrent: cursor e dedupe mantêm ordem no reconnect Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-163
  - Aceite AC-164: FLOW-CHAT/recovery: replay autorizado atual, anexos com pins Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-164
  - Aceite AC-173: FLOW-PERMS/positive: herdado/allow/deny/efetivo e deny prevalece Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-173
  - Aceite AC-174: FLOW-PERMS/negative: acesso não concede alçada; invariantes/admin-only Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-174
  - Aceite AC-175: FLOW-PERMS/concurrent: duas remoções preservam último admin e vedam autoescalada Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-175
  - Aceite AC-176: FLOW-PERMS/recovery: revoga sessões/conexões; restore sem restaurar grant obsoleto Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-176
  - Aceite AC-177: FLOW-UIPERMS/positive: catálogo módulo/ação, perfil/setor, herdado/override/efetivo Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-177
  - Aceite AC-178: FLOW-UIPERMS/negative: ação negada/sem alçada/indisponível explícita Contrato C7/AP5. Outra conta ou empresa não pode abrir, obter chave nem enviar o rascunho cifrado. Dados e chaves em claro não ficam persistidos. A rotação preserva a recuperação autorizada das cópias elegíveis ou informa bloqueio quando a chave está indisponível. Falta de permissão atual apresenta Falha 1105, sem enfileirar ou expor dados alheios. A fila cifrada é isolada por conta e empresa. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-178
  - Aceite AC-179: FLOW-UIPERMS/concurrent: versão concorrente não sobrescreve; audit ator/alvo/data/policy Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-179
  - Aceite AC-180: FLOW-UIPERMS/recovery: revoke pendente distinto de confirmado; reconectar com política atual Contrato C7/AP5. Logout, expiração e revogação bloqueiam leitura e envio conforme o contrato de rascunho. Retomar exige validação da política atual pelo servidor. Na retomada revalidar sessão, autorização e alçada. Falha 1105 bloqueia acesso e reenvio até revalidação autorizada. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-180
- **MT-18 · P5-BACKUPS** Adaptador backup e limpeza fiscalizada · depende de MT-17
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-backend` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Contratos documentais BackupCommand/provider/schedule/RP/DDE definidos em typed-actions-v1/action-contracts.md ACAT e action-fields.md ACT, schemas e catálogo. FUTURA implementação das variantes definidas e seus oracles somente após autorização própria/paths/gates/QA; sem código autorizado hoje.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Contratos documentais BackupCommand/provider/schedule/RP/DDE definidos em typed-actions-v1/action-contracts.md ACAT e action-fields.md ACT, schemas e catálogo. FUTURA implementação das variantes definidas e seus oracles somente após autorização própria/paths/gates/QA; sem código autorizado hoje.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-165: FLOW-BACKUPS/positive: NORMAL: ponto dispensado por AMBAS classes, válido e sem hold; reserva último válido+closure+keys; AEP admite fileId exato; DDE recebe sucesso oficial; RecordResult durável por componente; CLEANUP_SUCCEEDED somente todos comprovados. Safe-off é fallback. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-165
  - Aceite AC-166: FLOW-BACKUPS/negative: Backup/verify/auth/fence falhos ou UNKNOWN relevante suspendem NOVAS admissões; sem pasta/raiz, sem GC da história externa/keys/objetos. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-166
  - Aceite AC-167: FLOW-BACKUPS/concurrent: Hold confirmado ANTES de DELETE_ADMITTED impede envio; pedido POSTERIOR fecha novas admissões e retorna HOLD_REQUESTED/PRESERVATION_NOT_GUARANTEED, nunca preservação retroativa. Dois cleaners competem CAS/reservas de sobreviventes sem TTL. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-167
  - Aceite AC-168: FLOW-BACKUPS/recovery: Ack AEP perdido após sucesso repete somente RecordResult/consulta MESMO attempt; resultado perdido mantém UNKNOWN sem TTL. 403/404/GETpresente não provam terminalidade; parcial mantém reservas; alternativa recuperável tem NOVO point/fileId e escopo próprio, original continua não garantido. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-168
  - Aceite AC-169: FLOW-UIBACKUP/positive: Mostrar PREVIEW_ELIGIBLE sem excluir; REQUESTED/PREPARED e progresso distintos; CLEANUP_SUCCEEDED apenas com todos recibos. HOLD_ACTIVE_CONFIRMED apenas escopo íntegro sem obrigação antiga. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-169
  - Aceite AC-170: FLOW-UIBACKUP/negative: Loading/vazio/negado/conflito/indisponível/authrequired distintos. HOLD_REQUESTED/PENDING não é ativo; PRESERVATION_NOT_GUARANTEED e PARTIAL explícitos; limpeza suspensa não recebe badge preservado;403/404 não viram sucesso. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-170
  - Aceite AC-171: FLOW-UIBACKUP/concurrent: Versão atual no servidor em cada ação; cancelar somente pré-admissão CAS. Hold depois da admissão mostra alvos/ordem e bloqueadores, sem desfazer garantido. Conflito conserva formulário. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-171
  - Aceite AC-172: FLOW-UIBACKUP/recovery: Consultar/reconciliar mesmo task/hold/attempt ID com permissão; sem DELETE implícito ou retry destrutivo. Alternativa NEW ID após verificação mostra cópia alternativa preservada, original permanece unknown/notguaranteed. Anunciar estado/erro sem depender de cor, teclado acessível e foco/contexto preservados. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-172

[JSON](task.json) · `--sector backend`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="frontend"></a>
### frontend

- **MT-13 · P4-CONTROLS** Contrato FE e consumo de estados Fundação · depende de MT-12
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-frontend` · Validador independente: `@TFD-qa_ui`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Mapear campos/erros/idempotência/reconexão/history da dependência #2 e clientes C1/C2/C7; demonstrar contrato documental sem abrir outra Task.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Mapear campos/erros/idempotência/reconexão/history da dependência #2 e clientes C1/C2/C7; demonstrar contrato documental sem abrir outra Task. Evidência sanitizada por cenário e limite. Definir rascunho IndexedDB cifrado, versão, confirmação, fronteira de chave e perda de armazenamento pelos critérios AC-155/156/178/180 em phase-spec. Usar o contrato comum em todas as ações Salvar do ERP e apresentar Falha com código conforme o catálogo técnico REF-21.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20, REF-21
  - Aceite AC-161: FLOW-CHAT/positive: mensagem+obrigação atômica, salvo/entregue/lido Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-161
  - Aceite AC-162: FLOW-CHAT/negative: falha entrega visível; sem retry ambíguo inelegível Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-162
  - Aceite AC-163: FLOW-CHAT/concurrent: cursor e dedupe mantêm ordem no reconnect Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-163
  - Aceite AC-164: FLOW-CHAT/recovery: replay autorizado atual, anexos com pins Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-164
  - Aceite AC-169: FLOW-UIBACKUP/positive: Mostrar PREVIEW_ELIGIBLE sem excluir; REQUESTED/PREPARED e progresso distintos; CLEANUP_SUCCEEDED apenas com todos recibos. HOLD_ACTIVE_CONFIRMED apenas escopo íntegro sem obrigação antiga. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-169
  - Aceite AC-170: FLOW-UIBACKUP/negative: Loading/vazio/negado/conflito/indisponível/authrequired distintos. HOLD_REQUESTED/PENDING não é ativo; PRESERVATION_NOT_GUARANTEED e PARTIAL explícitos; limpeza suspensa não recebe badge preservado;403/404 não viram sucesso. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-170
  - Aceite AC-171: FLOW-UIBACKUP/concurrent: Versão atual no servidor em cada ação; cancelar somente pré-admissão CAS. Hold depois da admissão mostra alvos/ordem e bloqueadores, sem desfazer garantido. Conflito conserva formulário. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-171
  - Aceite AC-172: FLOW-UIBACKUP/recovery: Consultar/reconciliar mesmo task/hold/attempt ID com permissão; sem DELETE implícito ou retry destrutivo. Alternativa NEW ID após verificação mostra cópia alternativa preservada, original permanece unknown/notguaranteed. Anunciar estado/erro sem depender de cor, teclado acessível e foco/contexto preservados. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-172
  - Aceite AC-177: FLOW-UIPERMS/positive: catálogo módulo/ação, perfil/setor, herdado/override/efetivo Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-177
  - Aceite AC-178: FLOW-UIPERMS/negative: ação negada/sem alçada/indisponível explícita Contrato C7/AP5. Outra conta ou empresa não pode abrir, obter chave nem enviar o rascunho cifrado. Dados e chaves em claro não ficam persistidos. A rotação preserva a recuperação autorizada das cópias elegíveis ou informa bloqueio quando a chave está indisponível. Falta de permissão atual apresenta Falha 1105, sem enfileirar ou expor dados alheios. A fila cifrada é isolada por conta e empresa. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-178
  - Aceite AC-179: FLOW-UIPERMS/concurrent: versão concorrente não sobrescreve; audit ator/alvo/data/policy Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-179
  - Aceite AC-180: FLOW-UIPERMS/recovery: revoke pendente distinto de confirmado; reconectar com política atual Contrato C7/AP5. Logout, expiração e revogação bloqueiam leitura e envio conforme o contrato de rascunho. Retomar exige validação da política atual pelo servidor. Na retomada revalidar sessão, autorização e alçada. Falha 1105 bloqueia acesso e reenvio até revalidação autorizada. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-180

[JSON](task.json) · `--sector frontend`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="ui_ux"></a>
### ui_ux

- **MT-12 · P4-CONTROLS** Dependência documental UX Backups e Usuários · depende de MT-08
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-ui_ux` · Validador independente: `@TFD-qa_ui`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Especificar ações/estados RP5/C7 e fluxo permissionado da Plataforma #2, loading/erro/partial/notguaranteed e foco/anúncios, sem implementar UI #2.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Especificar ações/estados RP5/C7 e fluxo permissionado da Plataforma #2, loading/erro/partial/notguaranteed e foco/anúncios, sem implementar UI #2. Evidência sanitizada por cenário e limite.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-169: FLOW-UIBACKUP/positive: Mostrar PREVIEW_ELIGIBLE sem excluir; REQUESTED/PREPARED e progresso distintos; CLEANUP_SUCCEEDED apenas com todos recibos. HOLD_ACTIVE_CONFIRMED apenas escopo íntegro sem obrigação antiga. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-169
  - Aceite AC-170: FLOW-UIBACKUP/negative: Loading/vazio/negado/conflito/indisponível/authrequired distintos. HOLD_REQUESTED/PENDING não é ativo; PRESERVATION_NOT_GUARANTEED e PARTIAL explícitos; limpeza suspensa não recebe badge preservado;403/404 não viram sucesso. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-170
  - Aceite AC-171: FLOW-UIBACKUP/concurrent: Versão atual no servidor em cada ação; cancelar somente pré-admissão CAS. Hold depois da admissão mostra alvos/ordem e bloqueadores, sem desfazer garantido. Conflito conserva formulário. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-171
  - Aceite AC-172: FLOW-UIBACKUP/recovery: Consultar/reconciliar mesmo task/hold/attempt ID com permissão; sem DELETE implícito ou retry destrutivo. Alternativa NEW ID após verificação mostra cópia alternativa preservada, original permanece unknown/notguaranteed. Anunciar estado/erro sem depender de cor, teclado acessível e foco/contexto preservados. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-172
  - Aceite AC-177: FLOW-UIPERMS/positive: catálogo módulo/ação, perfil/setor, herdado/override/efetivo Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-177
  - Aceite AC-178: FLOW-UIPERMS/negative: ação negada/sem alçada/indisponível explícita Contrato C7/AP5. Outra conta ou empresa não pode abrir, obter chave nem enviar o rascunho cifrado. Dados e chaves em claro não ficam persistidos. A rotação preserva a recuperação autorizada das cópias elegíveis ou informa bloqueio quando a chave está indisponível. Falta de permissão atual apresenta Falha 1105, sem enfileirar ou expor dados alheios. A fila cifrada é isolada por conta e empresa. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-178
  - Aceite AC-179: FLOW-UIPERMS/concurrent: versão concorrente não sobrescreve; audit ator/alvo/data/policy Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-179
  - Aceite AC-180: FLOW-UIPERMS/recovery: revoke pendente distinto de confirmado; reconectar com política atual Contrato C7/AP5. Logout, expiração e revogação bloqueiam leitura e envio conforme o contrato de rascunho. Retomar exige validação da política atual pelo servidor. Na retomada revalidar sessão, autorização e alçada. Falha 1105 bloqueia acesso e reenvio até revalidação autorizada. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-180

[JSON](task.json) · `--sector ui_ux`
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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-20 · P6-ASSURANCE** Verificação independente dados e recovery · depende de MT-19
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-qa_backend` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Verificar cenários C/AP/RP, positivo DELETE futuro e concorrência/unknown/recovery por oracle externo, separar RPO/RTO não medidos.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Verificar cenários C/AP/RP, positivo DELETE futuro e concorrência/unknown/recovery por oracle externo, separar RPO/RTO não medidos. Evidência sanitizada por cenário e limite. Após implementação, comprovar TEST-155/156 no alvo autorizado, incluindo reconciliação, conflito e limpeza da revisão confirmada. Depois do código, verificar as seis classificações, precedência, recuperação e ausência de efeito duplicado em módulos distintos e abas concorrentes.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20, REF-21
  - Aceite AC-145: FLOW-HA/positive: confirmados sobrevivem perda de um servidor Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-145
  - Aceite AC-146: FLOW-HA/negative: cancelamento/local nonce sem ack não publica Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-146
  - Aceite AC-147: FLOW-HA/concurrent: mudança de membros drena/fence e conserva prefixo Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-147
  - Aceite AC-148: FLOW-HA/recovery: retomar jornadas e nova gravação protegida<=300s Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-148
  - Aceite AC-149: FLOW-FILES/positive: todos anexos com bytes e pin antes do vínculo Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-149
  - Aceite AC-150: FLOW-FILES/negative: objeto ausente/GC não pode receber sucesso Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-150
  - Aceite AC-151: FLOW-FILES/concurrent: pause após pin, hold versus delete irrevogável Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-151
  - Aceite AC-152: FLOW-FILES/recovery: pin sem TTL sobrevive promoção/reconciliação Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-152
  - Aceite AC-153: FLOW-OPS/positive: mesmo ID/digest retorna resultado protegido Contrato C1/AP2/AP3. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-153
  - Aceite AC-154: FLOW-OPS/negative: outro digest conflita; nenhum falso salvo Contrato C1/AP2/AP3. Exibir Falha 1106 e o campo autorizado para dados inválidos, sem retry automático. Código público tem significado estável e independe de HTTP, reason_code seguro e operation_id. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-154
  - Aceite AC-155: FLOW-OPS/concurrent: CAS/versão impede overwrite silencioso Contrato C1/AP2/AP3. Rascunho: concorrência exige reaplicação explícita. Confirmar v1 remove só v1 e preserva v2. Conflito de versão exibe Falha 1104, preserva rascunho e só permite reaplicação explícita. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-155
  - Aceite AC-156: FLOW-OPS/recovery: timeout mantém pendente e reconcilia mesmo ID Contrato C1/AP2/AP3. Versão local cifrada no IndexedDB durante a digitação sem submeter antes de Salvar. Retomar apenas operação solicitada após revalidar acesso e consultar o ID original. Se ausente na autoridade corrente e elegível para retry, reenviar versão e conteúdo originais. Se já confirmado, reapresentar o resultado protegido. Toda ação Salvar do ERP passa pelo contrato da fila comum. Falha 1101 exige cópia durável e elegibilidade, 1102 identifica resultado incerto, inclusive em ações sem fila por contrato, e autoriza consulta se suportada. 1103 informa falha ou perda da proteção local esperada. Nenhuma ação insegura entra em retry automático. · REQ-107, REQ-108, REQ-109, REQ-110, RULE-207, RULE-208, RULE-209, RULE-210, TEST-156
  - Aceite AC-157: FLOW-JOBS/positive: accepted/completed distintos e obrigação persistida Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-157
  - Aceite AC-158: FLOW-JOBS/negative: cache perdido não apaga job confirmado Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-158
  - Aceite AC-159: FLOW-JOBS/concurrent: workers disputam lease sem duplicar efeito elegível Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-159
  - Aceite AC-160: FLOW-JOBS/recovery: erro/backoff limitado ou suspensão de efeito ambíguo Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-160
  - Aceite AC-161: FLOW-CHAT/positive: mensagem+obrigação atômica, salvo/entregue/lido Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-161
  - Aceite AC-162: FLOW-CHAT/negative: falha entrega visível; sem retry ambíguo inelegível Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-162
  - Aceite AC-163: FLOW-CHAT/concurrent: cursor e dedupe mantêm ordem no reconnect Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-163
  - Aceite AC-164: FLOW-CHAT/recovery: replay autorizado atual, anexos com pins Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-164
  - Aceite AC-165: FLOW-BACKUPS/positive: NORMAL: ponto dispensado por AMBAS classes, válido e sem hold; reserva último válido+closure+keys; AEP admite fileId exato; DDE recebe sucesso oficial; RecordResult durável por componente; CLEANUP_SUCCEEDED somente todos comprovados. Safe-off é fallback. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-165
  - Aceite AC-166: FLOW-BACKUPS/negative: Backup/verify/auth/fence falhos ou UNKNOWN relevante suspendem NOVAS admissões; sem pasta/raiz, sem GC da história externa/keys/objetos. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-166
  - Aceite AC-167: FLOW-BACKUPS/concurrent: Hold confirmado ANTES de DELETE_ADMITTED impede envio; pedido POSTERIOR fecha novas admissões e retorna HOLD_REQUESTED/PRESERVATION_NOT_GUARANTEED, nunca preservação retroativa. Dois cleaners competem CAS/reservas de sobreviventes sem TTL. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-167
  - Aceite AC-168: FLOW-BACKUPS/recovery: Ack AEP perdido após sucesso repete somente RecordResult/consulta MESMO attempt; resultado perdido mantém UNKNOWN sem TTL. 403/404/GETpresente não provam terminalidade; parcial mantém reservas; alternativa recuperável tem NOVO point/fileId e escopo próprio, original continua não garantido. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-168
  - Aceite AC-173: FLOW-PERMS/positive: herdado/allow/deny/efetivo e deny prevalece Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-173
  - Aceite AC-174: FLOW-PERMS/negative: acesso não concede alçada; invariantes/admin-only Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-174
  - Aceite AC-175: FLOW-PERMS/concurrent: duas remoções preservam último admin e vedam autoescalada Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-175
  - Aceite AC-176: FLOW-PERMS/recovery: revoga sessões/conexões; restore sem restaurar grant obsoleto Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-176
  - Aceite AC-181: FLOW-DR/positive: cut completo precede cada sucesso enquanto custódia sobrevive Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-181
  - Aceite AC-182: FLOW-DR/negative: allhistories+keys destruídas é impossível; sem janela aprovada Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-182
  - Aceite AC-183: FLOW-DR/concurrent: cauda externa/gerações/policy CAS coerentes Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-183
  - Aceite AC-184: FLOW-DR/recovery: corrupção exige journal causal; história sem poda automática Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-184
  - Aceite AC-185: FLOW-FAILTEST/positive: oracle externo com conjunto completo de confirmados+bytes Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-185
  - Aceite AC-186: FLOW-FAILTEST/negative: zero sucesso sem conjunção/zero release velho Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-186
  - Aceite AC-187: FLOW-FAILTEST/concurrent: interleavings de cancel/pause/revoke/GC/hold/restore Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-187
  - Aceite AC-188: FLOW-FAILTEST/recovery: medir da interrupção à jornada completa<=300s Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-188

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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-22 · P6-ASSURANCE** Assurance independente da fronteira · depende de MT-20
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-security` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Revisar confiança/segredos/autoridades/fence/revoke/keys/hold; revisor deve ser distinto dos autores das contribuições, main designa sem simular PASS.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Revisar confiança/segredos/autoridades/fence/revoke/keys/hold; revisor deve ser distinto dos autores das contribuições, main designa sem simular PASS. Evidência sanitizada por cenário e limite. Após implementação, comprovar em TEST-178/180 os vínculos de cifra e chave, isolamento entre contas, logout e revogação. Depois do código, verificar isolamento da fila, divergência de conta/empresa, revogação e impossibilidade de reenvio não autorizado.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20, REF-21
  - Aceite AC-145: FLOW-HA/positive: confirmados sobrevivem perda de um servidor Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-145
  - Aceite AC-146: FLOW-HA/negative: cancelamento/local nonce sem ack não publica Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-146
  - Aceite AC-147: FLOW-HA/concurrent: mudança de membros drena/fence e conserva prefixo Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-147
  - Aceite AC-148: FLOW-HA/recovery: retomar jornadas e nova gravação protegida<=300s Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-148
  - Aceite AC-149: FLOW-FILES/positive: todos anexos com bytes e pin antes do vínculo Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-149
  - Aceite AC-150: FLOW-FILES/negative: objeto ausente/GC não pode receber sucesso Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-150
  - Aceite AC-151: FLOW-FILES/concurrent: pause após pin, hold versus delete irrevogável Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-151
  - Aceite AC-152: FLOW-FILES/recovery: pin sem TTL sobrevive promoção/reconciliação Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-152
  - Aceite AC-157: FLOW-JOBS/positive: accepted/completed distintos e obrigação persistida Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-157
  - Aceite AC-158: FLOW-JOBS/negative: cache perdido não apaga job confirmado Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-158
  - Aceite AC-159: FLOW-JOBS/concurrent: workers disputam lease sem duplicar efeito elegível Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-159
  - Aceite AC-160: FLOW-JOBS/recovery: erro/backoff limitado ou suspensão de efeito ambíguo Contrato C2/AP3/AP5. · REQ-111, RULE-211, TEST-160
  - Aceite AC-165: FLOW-BACKUPS/positive: NORMAL: ponto dispensado por AMBAS classes, válido e sem hold; reserva último válido+closure+keys; AEP admite fileId exato; DDE recebe sucesso oficial; RecordResult durável por componente; CLEANUP_SUCCEEDED somente todos comprovados. Safe-off é fallback. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-165
  - Aceite AC-166: FLOW-BACKUPS/negative: Backup/verify/auth/fence falhos ou UNKNOWN relevante suspendem NOVAS admissões; sem pasta/raiz, sem GC da história externa/keys/objetos. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-166
  - Aceite AC-167: FLOW-BACKUPS/concurrent: Hold confirmado ANTES de DELETE_ADMITTED impede envio; pedido POSTERIOR fecha novas admissões e retorna HOLD_REQUESTED/PRESERVATION_NOT_GUARANTEED, nunca preservação retroativa. Dois cleaners competem CAS/reservas de sobreviventes sem TTL. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-167
  - Aceite AC-168: FLOW-BACKUPS/recovery: Ack AEP perdido após sucesso repete somente RecordResult/consulta MESMO attempt; resultado perdido mantém UNKNOWN sem TTL. 403/404/GETpresente não provam terminalidade; parcial mantém reservas; alternativa recuperável tem NOVO point/fileId e escopo próprio, original continua não garantido. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-168
  - Aceite AC-173: FLOW-PERMS/positive: herdado/allow/deny/efetivo e deny prevalece Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-173
  - Aceite AC-174: FLOW-PERMS/negative: acesso não concede alçada; invariantes/admin-only Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-174
  - Aceite AC-175: FLOW-PERMS/concurrent: duas remoções preservam último admin e vedam autoescalada Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-175
  - Aceite AC-176: FLOW-PERMS/recovery: revoga sessões/conexões; restore sem restaurar grant obsoleto Contrato C7/AP5/AP6. · REQ-122, REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-222, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-176
  - Aceite AC-181: FLOW-DR/positive: cut completo precede cada sucesso enquanto custódia sobrevive Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-181
  - Aceite AC-182: FLOW-DR/negative: allhistories+keys destruídas é impossível; sem janela aprovada Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-182
  - Aceite AC-183: FLOW-DR/concurrent: cauda externa/gerações/policy CAS coerentes Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-183
  - Aceite AC-184: FLOW-DR/recovery: corrupção exige journal causal; história sem poda automática Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-184
  - Aceite AC-185: FLOW-FAILTEST/positive: oracle externo com conjunto completo de confirmados+bytes Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-185
  - Aceite AC-186: FLOW-FAILTEST/negative: zero sucesso sem conjunção/zero release velho Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-186
  - Aceite AC-187: FLOW-FAILTEST/concurrent: interleavings de cancel/pause/revoke/GC/hold/restore Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-187
  - Aceite AC-188: FLOW-FAILTEST/recovery: medir da interrupção à jornada completa<=300s Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-188

[JSON](task.json) · `--sector security`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="devops"></a>
### devops

- **MT-01 · P1-CONTRACT** F1-P1 — Proveniência e contrato de configuração · depende de livre
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `backend/scripts/**`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/.dockerignore`, `backend/.dockerignore`, `docker-compose*.yml`, `.github/workflows/**`, `backend/requirements*.txt`, `docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/evidence/**`, `C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/gaeva-foundation-prospective-baseline-r1/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Rota preservada: plugin the-factory-developer; capability devops-scoped-delivery; preferred_tool repository-native-tooling-after-authorization. Somente apos gates, sem ampliar escopo.
    - Fixar DF01-03 da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional; contexto integral/ignore/locks transitivos/bases/plataforma/digests e contratos de configuração. A intenção anterior B e P1-QAB-01/02/03 permanecem históricas/UNKNOWN; nova prova não reconstrói a origem passada. A rota B e seus três suportes ficam preservados, não incorporados.
    - Preparar a evidência prospectiva DF01-03 com contexto integral limpo, locks transitivos exatos por plataforma/hashes, bases por digest/plataforma verificados, toolchain, configuração sanitizada e atestação de build→artefato. Resolução, download, pull, instalação e build não são implicitamente liberados pela edição desta Task: exigem autorização operacional específica para destino novo e recursos de builder, sem startup, imports da aplicação backend/settings/drivers, testes da aplicação, serviços, conexão, fixtures, migração, restauração ou substituição de recursos atuais. Não apresentar um build novo como prova da origem histórica. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. A escolha S1 e esta emenda documental não autorizam resolução/download/pull/install/build, testes de produto, startup, import app/settings/driver/pytest, conexão DB, fixture, migração, restore/rollback, deploy, publicação ou alteração dos seis contêineres/imagens/volumes/backups. Receitas/locks/contextos futuros e operações concretas exigem escopo/autorização próprios e nova revisão independente. P1 não aceita; P2/P3 não liberadas.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Duas seções de evidência distintas: relatório histórico com UNKNOWN preservados e cadeia completa da baseline prospectiva selecionada, incluindo source/context/ignore/lock/bases/toolchain/dependency inventories/build/artifact/config com hashes e comandos/exits.; Dois builds controlados com mesmas entradas e comparação de arquivos/resolução/artefatos, ou declarar reprodução ainda não demonstrada e manter aceite correspondente pendente.; P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit.
  - Concluído quando: DF01-03 demonstrados e revisados para a baseline prospectiva explicitamente escolhida pelo humano, com toda a cadeia source/context/deps/base/plataforma/build/artefato/config conferida independentemente; ausência/divergência bloqueia aceite. A origem integral da imagem histórica permanece UNKNOWN se os registros genuínos faltarem e não recebe PASS por essa entrega. Não autoriza promover/substituir runtime nem P2 sem decisão humana aplicável. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. A escolha S1 e esta emenda documental não autorizam resolução/download/pull/install/build, testes de produto, startup, import app/settings/driver/pytest, conexão DB, fixture, migração, restore/rollback, deploy, publicação ou alteração dos seis contêineres/imagens/volumes/backups. Receitas/locks/contextos futuros e operações concretas exigem escopo/autorização próprios e nova revisão independente. P1 não aceita; P2/P3 não liberadas.
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-15 · P4-CONTROLS** Plano de enforcement HA e preservação · depende de MT-14
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Detalhar topologia independente/flush/Admission/fence por caminho/PSC/cuts/bootstrap, capability e prova futura; sem instalar/provisionar.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Detalhar topologia independente/flush/Admission/fence por caminho/PSC/cuts/bootstrap, capability e prova futura; sem instalar/provisionar. Evidência sanitizada por cenário e limite.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-145: FLOW-HA/positive: confirmados sobrevivem perda de um servidor Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-145
  - Aceite AC-146: FLOW-HA/negative: cancelamento/local nonce sem ack não publica Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-146
  - Aceite AC-147: FLOW-HA/concurrent: mudança de membros drena/fence e conserva prefixo Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-147
  - Aceite AC-148: FLOW-HA/recovery: retomar jornadas e nova gravação protegida<=300s Contrato C4/AP2/AP3. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, REQ-122, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, RULE-222, TEST-148
  - Aceite AC-149: FLOW-FILES/positive: todos anexos com bytes e pin antes do vínculo Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-149
  - Aceite AC-150: FLOW-FILES/negative: objeto ausente/GC não pode receber sucesso Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-150
  - Aceite AC-151: FLOW-FILES/concurrent: pause após pin, hold versus delete irrevogável Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-151
  - Aceite AC-152: FLOW-FILES/recovery: pin sem TTL sobrevive promoção/reconciliação Contrato C3/AP3/AP4. · REQ-101, REQ-102, REQ-103, REQ-104, REQ-106, RULE-201, RULE-202, RULE-203, RULE-204, RULE-206, TEST-152
  - Aceite AC-181: FLOW-DR/positive: cut completo precede cada sucesso enquanto custódia sobrevive Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-181
  - Aceite AC-182: FLOW-DR/negative: allhistories+keys destruídas é impossível; sem janela aprovada Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-182
  - Aceite AC-183: FLOW-DR/concurrent: cauda externa/gerações/policy CAS coerentes Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-183
  - Aceite AC-184: FLOW-DR/recovery: corrupção exige journal causal; história sem poda automática Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-184
- **MT-19 · P5-BACKUPS** Plano isolado de backup e recuperação · depende de MT-18
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-devops` · Validador independente: `@TFD-qa_backend`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Planejar custódia/DDE/fence/egress/readiness e rollback compatível; execução real só futura autorização, sem operação neste mandato.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Planejar custódia/DDE/fence/egress/readiness e rollback compatível; execução real só futura autorização, sem operação neste mandato. Evidência sanitizada por cenário e limite.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20
  - Aceite AC-165: FLOW-BACKUPS/positive: NORMAL: ponto dispensado por AMBAS classes, válido e sem hold; reserva último válido+closure+keys; AEP admite fileId exato; DDE recebe sucesso oficial; RecordResult durável por componente; CLEANUP_SUCCEEDED somente todos comprovados. Safe-off é fallback. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-165
  - Aceite AC-166: FLOW-BACKUPS/negative: Backup/verify/auth/fence falhos ou UNKNOWN relevante suspendem NOVAS admissões; sem pasta/raiz, sem GC da história externa/keys/objetos. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-166
  - Aceite AC-167: FLOW-BACKUPS/concurrent: Hold confirmado ANTES de DELETE_ADMITTED impede envio; pedido POSTERIOR fecha novas admissões e retorna HOLD_REQUESTED/PRESERVATION_NOT_GUARANTEED, nunca preservação retroativa. Dois cleaners competem CAS/reservas de sobreviventes sem TTL. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-167
  - Aceite AC-168: FLOW-BACKUPS/recovery: Ack AEP perdido após sucesso repete somente RecordResult/consulta MESMO attempt; resultado perdido mantém UNKNOWN sem TTL. 403/404/GETpresente não provam terminalidade; parcial mantém reservas; alternativa recuperável tem NOVO point/fileId e escopo próprio, original continua não garantido. Contrato C5/RP1-RP6. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-168
  - Aceite AC-181: FLOW-DR/positive: cut completo precede cada sucesso enquanto custódia sobrevive Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-181
  - Aceite AC-182: FLOW-DR/negative: allhistories+keys destruídas é impossível; sem janela aprovada Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-182
  - Aceite AC-183: FLOW-DR/concurrent: cauda externa/gerações/policy CAS coerentes Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-183
  - Aceite AC-184: FLOW-DR/recovery: corrupção exige journal causal; história sem poda automática Contrato C6/AP1/AP3/AP6. · REQ-105, RULE-205, TEST-184
  - Aceite AC-185: FLOW-FAILTEST/positive: oracle externo com conjunto completo de confirmados+bytes Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-185
  - Aceite AC-186: FLOW-FAILTEST/negative: zero sucesso sem conjunção/zero release velho Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-186
  - Aceite AC-187: FLOW-FAILTEST/concurrent: interleavings de cancel/pause/revoke/GC/hold/restore Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-187
  - Aceite AC-188: FLOW-FAILTEST/recovery: medir da interrupção à jornada completa<=300s Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-188

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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144

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
  - Referências obrigatórias: REF-01, REF-02, REF-03, REF-04, REF-05, REF-06, REF-07, REF-08, REF-09, REF-10, REF-11
  - Aceite AC-01: Cada setor REQUIRED entrega evidência própria de REF-01 e TEST-01. F1-P1 deve demonstrar cadeia prospectiva completa da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional e configuração PLANNED/RENDERED, sem atestar origem histórica UNKNOWN. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. F1-P2 comprova DF04 offline com negativos sem efeito, PASS de QA Backend e PASS independente de Security na mesma revisão/configuração. F1-P3 depende dessa evidência e dos gates humanos. Aplica DF04 antes de conexão e verifica identidade DB/role/instância antes de fixture, migração ou restauração. · REQ-14, TEST-01
  - Aceite AC-101: FLOW-DF1/positive: Task, fonte e manifesto identificados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-101
  - Aceite AC-102: FLOW-DF1/negative: hash/tupla divergente rejeitados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-102
  - Aceite AC-103: FLOW-DF1/concurrent: duas revisões concorrentes não trocam binding Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-103
  - Aceite AC-104: FLOW-DF1/recovery: gate desconhecido permanece desconhecido Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-01, TEST-104
  - Aceite AC-105: FLOW-DF2/positive: instalação/contexto isolados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-105
  - Aceite AC-106: FLOW-DF2/negative: credencial/recurso de outro ambiente negado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-106
  - Aceite AC-107: FLOW-DF2/concurrent: transição de membro conserva prefixo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-107
  - Aceite AC-108: FLOW-DF2/recovery: rejoin quarantined Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-108
  - Aceite AC-109: FLOW-DF3/positive: identidades e bases vinculadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-109
  - Aceite AC-110: FLOW-DF3/negative: system_identifier/timeline incompatíveis recusados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-110
  - Aceite AC-111: FLOW-DF3/concurrent: rotação de contexto não abre escritor antigo Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-111
  - Aceite AC-112: FLOW-DF3/recovery: bootstrap independente sem reset gen0 Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-112
  - Aceite AC-113: FLOW-DF4/positive: guard precede import/efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-113
  - Aceite AC-114: FLOW-DF4/negative: tupla ausente não importa nem executa Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-114
  - Aceite AC-115: FLOW-DF4/concurrent: pool/socket antigo não contorna fence Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-115
  - Aceite AC-116: FLOW-DF4/recovery: ack perdido mantém fechado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-116
  - Aceite AC-117: FLOW-DF5/positive: migração futura isolada com dono único Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-117
  - Aceite AC-118: FLOW-DF5/negative: API não adquire DDL Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-118
  - Aceite AC-119: FLOW-DF5/concurrent: migração concorrente rejeitada/serializada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-119
  - Aceite AC-120: FLOW-DF5/recovery: recovery fechado antes de listeners Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-120
  - Aceite AC-121: FLOW-DF6/positive: inicia API isolada sem efeito de instalação Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-121
  - Aceite AC-122: FLOW-DF6/negative: PRO indisponível explicitamente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-122
  - Aceite AC-123: FLOW-DF6/concurrent: reentrada não abre listeners sem autorização Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-123
  - Aceite AC-124: FLOW-DF6/recovery: restaurar configuração sem segredos expostos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-124
  - Aceite AC-125: FLOW-DF7/positive: confirmados/dados/arquivos/autoridade recuperáveis Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-125
  - Aceite AC-126: FLOW-DF7/negative: dump/head antigo ou key ausente fecha Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-126
  - Aceite AC-127: FLOW-DF7/concurrent: múltiplos cortes CAS sem auto-hash Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-127
  - Aceite AC-128: FLOW-DF7/recovery: base limpa/journal causal sem repetir dano Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-101, RULE-102, RULE-103, RULE-104, RULE-105, RULE-106, RULE-01, RULE-02, TEST-128
  - Aceite AC-129: FLOW-ENV/positive: domínios/contas/volumes separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-129
  - Aceite AC-130: FLOW-ENV/negative: produção sem custódia root/delete Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-130
  - Aceite AC-131: FLOW-ENV/concurrent: escritores antigos fenced na troca Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-131
  - Aceite AC-132: FLOW-ENV/recovery: restauração isolada antes de liberar Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-132
  - Aceite AC-133: FLOW-CFG/positive: manifesto identifica config/schema/keys por IDs Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-133
  - Aceite AC-134: FLOW-CFG/negative: segredos/dump não são raiz de confiança Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-134
  - Aceite AC-135: FLOW-CFG/concurrent: rotação preserva intermediárias necessárias Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-135
  - Aceite AC-136: FLOW-CFG/recovery: head atual e chave recuperável separados Contrato DF01-07 / TEST-01 / C6. · REQ-14, RULE-102, RULE-106, TEST-136
  - Aceite AC-137: FLOW-VPS/positive: observações carga/WAL/bytes/picos/jornadas Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-137
  - Aceite AC-138: FLOW-VPS/negative: quorum ou domínio único não é HA suficiente Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-138
  - Aceite AC-139: FLOW-VPS/concurrent: picos com backup/failover medidos juntos Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-139
  - Aceite AC-140: FLOW-VPS/recovery: falha individual de cada servidor inclui AEP/PSC/entrada Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-140
  - Aceite AC-141: FLOW-CI/positive: recibos/identidade/guard precedem efeito Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-141
  - Aceite AC-142: FLOW-CI/negative: fixture não comprova produção Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-142
  - Aceite AC-143: FLOW-CI/concurrent: jobs concorrentes sem migrador duplicado Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-143
  - Aceite AC-144: FLOW-CI/recovery: artefato e rollback vinculados; sem operação nesta entrega Contrato DF01-07 / TEST-01 / C6. · REQ-14, TEST-144
- **MT-23 · P6-ASSURANCE** Documentação e contratos de dependência · depende de MT-21, MT-22
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-documentation` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Consolidar comportamento efetivamente comprovado e limites, dependências#2-11 e ajuda sem prometer UI/infra prontas.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Consolidar comportamento efetivamente comprovado e limites, dependências#2-11 e ajuda sem prometer UI/infra prontas. Evidência sanitizada por cenário e limite. Manter o catálogo técnico REF-21 com contexto, condição, significado, texto e recuperação por código. Atualizar documentação de uso somente com comportamento comprovado.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20, REF-21
  - Aceite AC-250: Docs e entrega preservam comportamento comprovado/limites e quatro pareceres atuais aplicáveis antes de aceite, sem autorização operacional presumida. · REQ-14, REQ-130, RULE-230, TEST-250

[JSON](task.json) · `--sector documentation`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

<a id="qa_ui"></a>
### QA UI documental/integrada

- **MT-21 · P6-ASSURANCE** Revisão independente de estados e acesso · depende de MT-20
  - ☐ Aprovado · ☐ Reprovado · Aguardando QA
  - Responsável: `@TFD-qa_ui` · Validador independente: `@TFD-qa_spec`
  - Caminhos permitidos: `docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/**`
  - Pode: executar o checklist abaixo nos caminhos permitidos, respeitando os limites globais e o gate atual.
    - Mandato atual DOCUMENTAL; autorização operacional/código inexistente. Qualquer execução futura requer recorte/paths de implementação explicitamente revistos, gates e QA independentes.
    - Conferir pedido/ativo/nãogarantido/partial/reconciled, role/tenant/directfile/chat e requisitos acessíveis; visual/runtime só quando existir alvo autorizado.
    - Vincular revisão/configuração/contrato, comandos/exits reais aos cenários; não alegar testes não executados.
  - Não pode: editar fora desses caminhos ou em caminhos protegidos, ampliar escopo ou contornar gates; respeite os [limites globais](#limites-globais).
  - Resultado esperado: Conferir pedido/ativo/nãogarantido/partial/reconciled, role/tenant/directfile/chat e requisitos acessíveis; visual/runtime só quando existir alvo autorizado. Evidência sanitizada por cenário e limite. Após implementação, verificar sinais distintos de rascunho/pendente/salvo, troca de conta, indisponibilidade local e conflito nos TEST-155/156/178/180 aplicáveis. Depois do código, verificar texto acessível Falha, orientação de ação, os seis estados e as diferenças entre pendência, incerteza, bloqueio e confirmação.
  - Concluído quando: Contrato/entrega do escopo da fase demonstrado e revisto independentemente na revisão corrente; autorização específica antes de qualquer execução.
  - Referências obrigatórias: REF-12, REF-13, REF-14, REF-15, REF-16, REF-17, REF-18, REF-19, REF-20, REF-21
  - Aceite AC-161: FLOW-CHAT/positive: mensagem+obrigação atômica, salvo/entregue/lido Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-161
  - Aceite AC-162: FLOW-CHAT/negative: falha entrega visível; sem retry ambíguo inelegível Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-162
  - Aceite AC-163: FLOW-CHAT/concurrent: cursor e dedupe mantêm ordem no reconnect Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-163
  - Aceite AC-164: FLOW-CHAT/recovery: replay autorizado atual, anexos com pins Contrato C2/AP3/AP5. · REQ-112, RULE-212, TEST-164
  - Aceite AC-169: FLOW-UIBACKUP/positive: Mostrar PREVIEW_ELIGIBLE sem excluir; REQUESTED/PREPARED e progresso distintos; CLEANUP_SUCCEEDED apenas com todos recibos. HOLD_ACTIVE_CONFIRMED apenas escopo íntegro sem obrigação antiga. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-169
  - Aceite AC-170: FLOW-UIBACKUP/negative: Loading/vazio/negado/conflito/indisponível/authrequired distintos. HOLD_REQUESTED/PENDING não é ativo; PRESERVATION_NOT_GUARANTEED e PARTIAL explícitos; limpeza suspensa não recebe badge preservado;403/404 não viram sucesso. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-170
  - Aceite AC-171: FLOW-UIBACKUP/concurrent: Versão atual no servidor em cada ação; cancelar somente pré-admissão CAS. Hold depois da admissão mostra alvos/ordem e bloqueadores, sem desfazer garantido. Conflito conserva formulário. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-171
  - Aceite AC-172: FLOW-UIBACKUP/recovery: Consultar/reconciliar mesmo task/hold/attempt ID com permissão; sem DELETE implícito ou retry destrutivo. Alternativa NEW ID após verificação mostra cópia alternativa preservada, original permanece unknown/notguaranteed. Anunciar estado/erro sem depender de cor, teclado acessível e foco/contexto preservados. Contrato C5/C7/RP5. · REQ-114, REQ-115, REQ-116, REQ-117, REQ-118, REQ-119, REQ-120, REQ-121, RULE-214, RULE-215, RULE-216, RULE-217, RULE-218, RULE-219, RULE-220, RULE-221, TEST-172
  - Aceite AC-177: FLOW-UIPERMS/positive: catálogo módulo/ação, perfil/setor, herdado/override/efetivo Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-177
  - Aceite AC-178: FLOW-UIPERMS/negative: ação negada/sem alçada/indisponível explícita Contrato C7/AP5. Outra conta ou empresa não pode abrir, obter chave nem enviar o rascunho cifrado. Dados e chaves em claro não ficam persistidos. A rotação preserva a recuperação autorizada das cópias elegíveis ou informa bloqueio quando a chave está indisponível. Falta de permissão atual apresenta Falha 1105, sem enfileirar ou expor dados alheios. A fila cifrada é isolada por conta e empresa. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-178
  - Aceite AC-179: FLOW-UIPERMS/concurrent: versão concorrente não sobrescreve; audit ator/alvo/data/policy Contrato C7/AP5. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-179
  - Aceite AC-180: FLOW-UIPERMS/recovery: revoke pendente distinto de confirmado; reconectar com política atual Contrato C7/AP5. Logout, expiração e revogação bloqueiam leitura e envio conforme o contrato de rascunho. Retomar exige validação da política atual pelo servidor. Na retomada revalidar sessão, autorização e alçada. Falha 1105 bloqueia acesso e reenvio até revalidação autorizada. · REQ-123, REQ-124, REQ-125, REQ-126, REQ-127, REQ-128, REQ-129, REQ-130, RULE-223, RULE-224, RULE-225, RULE-226, RULE-227, RULE-228, RULE-229, RULE-230, TEST-180
  - Aceite AC-185: FLOW-FAILTEST/positive: oracle externo com conjunto completo de confirmados+bytes Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-185
  - Aceite AC-186: FLOW-FAILTEST/negative: zero sucesso sem conjunção/zero release velho Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-186
  - Aceite AC-187: FLOW-FAILTEST/concurrent: interleavings de cancel/pause/revoke/GC/hold/restore Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-187
  - Aceite AC-188: FLOW-FAILTEST/recovery: medir da interrupção à jornada completa<=300s Contrato C4/T-SLO. · REQ-113, RULE-213, TEST-188

[JSON](task.json) · `--sector qa_ui`
Feito: pendente · Bloqueios: a verificar · Tokens reais: indisponíveis

Escopo, aceite e testes no contrato JSON desta task.
