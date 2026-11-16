# Fontes, escopo e aprovações — revisão 3

Data: 10/11/2026. Caminhos relativos à raiz B `${DOCUMENTATION_SOURCE}`.

Restrição atual corrigida pelo proprietário: o mesmo produto suporta Gaeva3D e DryMaia já neste escopo de preparação, com operações/dados separados e capacidades de materiais/processos independentes de empresa. Substitui a interpretação anterior de Gaeva primeiro/DryMaia depois e qualquer divisão FDM/resina por marca. Não compartilhar automaticamente clientes/dados, usuários/permissões, canais/credenciais, finanças ou branding. O usuário afirma que FilaOps já abrange ambas: baseline de intenção/reuso a verificar por Discovery, sem afirmar cobertura executada completa. Conteúdo dos sites não limita domínio nem determina materiais permitidos. Diferenças de configuração/workflow exigem requisito de fonte, não dedução de marketing. Arquitetura comparará isolamento sem presumir multi-tenancy ou infraestrutura nova. Não há deploy/implementação autorizado para nenhuma empresa.

## Fontes consultadas

Decisão de topologia encerrada pelo literal final do mandato: mesma base de código, dois servidores independentes. Substitui a alternativa ainda exploratória de isolamento/tenancy citada anteriormente. Arquitetura/DevOps devem preparar templates reutilizáveis para duas instâncias VPS/Docker, cada uma com banco, arquivos, credenciais, canais, marca, configurações e backups próprios; parametrização de materiais/processos por instalação. Sem requisito de compartilhamento, fork de código ou reescrita multi-tenant. Sites não acrescentam requisitos contrários à decisão. Verificar suporte FilaOps existente antes de mudar; implantação continua fora da autorização atual.

| ID | Caminho e revisão observada | Uso / limite |
| --- | --- | --- |
| S1 | docs/gaeva/PRD.md, r3 com adendos | Diretrizes gerais; estado atual difere do snapshot aprovado |
| S2 | docs/gaeva/modulos/comercial/PRD.md, r42, 30/10 | Decisões COM-001–029; DRAFT em debate; leitura seletiva de jornada, decisões e pendências |
| S3 | docs/gaeva/modulos/comercial/especificacao-funcional.md r23; matriz-funcional.md r11 | Base funcional e candidatos de reuso; r11 ainda harmoniza PRD41/spec22; não há teste runtime nesta pesquisa |
| S4 | docs/gaeva/modulos/venda-pedido-producao/PRD.md r10 | Decisões financeiras, qualidade, Threads; DRAFT, não módulo integral aprovado |
| S5 | docs/gaeva/mapa-paginas.md, atualizado 29/10 | Inventário estático e estados; 38 destinos/9 grupos segundo documento, sem recontagem de runtime |
| S6 | docs/gaeva/sdd/geral/README.md r1 e docs/planejamento/fases-e-handoffs.md r1, 23/10 | SDD parcial, decisões e plano histórico; três REWORK anteriores relatados, não revisão atual |
| S7 | docs/gaeva/README.md | Índice e guia visual indicado: docs/design/index.html e design-guide.md; revisão exata do guia não homologada aqui |
| S8 | docs/gaeva/aprovacoes/PRD-geral-rev3-aprovacao-2026-10-22.json e snapshot MD irmão | Registro explícito e conteúdo aprovado preservado |
| S9 | docs/gaeva/modulos/comercial/workflow.json | Apenas submit G0 g0-constituicao-2026-11-05-r1; phases vazio |
| S10 | docs/design/mockups/comercial/index.html | Arquivo existente; referências internas commercial-refinements.css?v=r38-refinements e commercial-refinements.js?v=r39-owner-label; navegação contém Atendimento. Inspeção estática, não QA visual ou runtime |
| S11 | docs/gaeva/sdd/ficha-cliente/kanban-producao-colunas-e-tempos.md r1, 26/10 | KP-01/02/04 decididos; KP-03 hipótese e KP-05 proposto; agregação/tempos/transições ainda têm pendências |

## Matriz delimitada para UI/UX — decisão visual delegada

Recomendações abaixo são propostas da equipe, não regras de negócio novas. O próximo dono UI/UX deve comparar alternativas com telas prontas S10 e tokens/componentes do guia; não redesenhar do zero nem perguntar ao usuário o que o PRD já resolveu.

| Fluxo e fonte | Atores, ordem e dependências preservadas | Proposta visual / questão técnica para UI/UX | Estados, erro e permissão |
| --- | --- | --- | --- |
| Pipeline comercial, S2 Etapa 2/COM-007 | Vendedor/responsável autorizado; seis etapas herdadas: Novo contato, Qualificação, Diagnóstico, Proposta, Negociação, Aguardando confirmação financeira. Ganho/Perdido separado; pagamento não deriva de arraste | Manter Kanban existente com consulta tabular complementar se necessária à densidade; definir ação de transição sem arraste e abertura contextual | Matriz de saltos/retornos ainda pendente; recusar avanço não autorizado sem mover definitivamente o card, preservar revisão e explicar causa permitida |
| Atendimento e fila humana, S2 COM-014–026 | Principal atual e colaboradores permissionados; atribuir não é assumir; automático padrão, capacidade inclui reservas; prioridade manual exige permissão/motivo; bot pausa ao assumir | Manter conversa + lista/fila operacional das telas prontas; pipeline pertence à oportunidade, sem substituir estado de atendimento por etapa comercial | Sem elegível, espera, reserva, reconexão e pausa distinguíveis; preservar rascunho; não simular presença nem reativar bot por trocar vista |
| Produção, S4/S11 | Produção/Designer/técnico autorizados; gerente de produção libera QC interno, cliente dá aceite independente. KP-01: Caixa de entrada→Modelagem 3D→Impressão→Montagem→Qualidade→Expedição→Enviado | Manter quadro de sete colunas e detalhe por pedido/peça; KP-02 Aguardando antes do início. Não criar colunas extras de aprovação | Uma encomenda/card, partes/OPs filhas. Material/recurso/capacidade e revisão aprovada condicionam impressão. Recusa de transição restaura posição; não supor avanço parcial/todas peças nem aprovar KP-05 por layout |
| Fila de impressão, mandato/S11 seção Impressão | Operador autorizado e recurso; partes/quantidades/OPs vinculadas à encomenda, revisão aprovada, material/capacidade e refugo/reimpressão preservados | Recomendar lista/tabela ordenada com detalhe de recurso como ponto inicial; comparar Kanban opcional quando facilitar visualizar bloqueios. Não copiar colunas do funil ou da produção | Ordem/prioridade específica e comandos da fila ainda não verificados em fonte dedicada; Discovery deve localizar base e contratos, sem inventar prioridade, despacho automático ou nova política |

Checks a especificar por UI/UX em todas as vistas: foco e teclado, seleção e ação explícita equivalente ao arraste, retorno ao contexto, carregamento/vazio/erro/sem permissão, operação concorrente e atualização rejeitada. Respeitar causa de bloqueio sem revelar dados restritos. Não usar placeholder como dado real. Decisões visuais são propostas técnicas delegadas; políticas de negócio explicitamente pendentes continuam identificadas para o principal, sem novo questionário genérico.

## Adição de desenvolvimento e substituição de Mensagens

Correção atual do proprietário em `preparacao-autorizada.md` prevalece: guia e telas de Atendimento já estão prontos como direção de design. Caminhos existentes confirmados: `docs/design/index.html`, `docs/design/design-guide.md`, `docs/design/mockups/comercial/index.html`. A funcional spec23 aponta `index.html?rev=r38-refinements`; o HTML contém recursos r38/r39. Não reduzir essa disponibilidade a telas inexistentes nem redesenhar por padrão. Discovery/UI devem fixar hashes e reconciliar esse conjunto com PRD42; parâmetro de URL não prova revisão homogênea de todos os recursos.

S5 mapeia **Mensagens** em `/admin/messages` para componente **AdminNotifications** e adverte que não é o Comercial desenhado. S2 usa **Atendimento** como superfície de conversas e **Comercial** para o conjunto de jornada/fila/oportunidades/ficha. Esses nomes não provam equivalência de entidades: notificações podem ter consumidores fora do atendimento. A intenção agora fechada é aposentar o módulo Mensagens em favor do Comercial, sem entrada permanente paralela. Discovery deve inventariar consumidores de rota/permissão/evento/link, dados/anexos e notificações; Arquitetura propor redirecionamento, compatibilidade e desativação gradual com preservação. Não interpretar isso como exclusão geral de avisos ou dados.

Fundação para desenvolvimento (REQ-14) vai a Arquitetura/DevOps: evidência canônica fonte/repositório sem reparar ACL de .git; ambientes local/teste/produção separados; Docker build/Compose e configurações versionáveis sem segredos; estratégia de migração e reconciliação de dados; backup/restauração/rollback; requisitos e opções de recursos VPS sustentados por medição/fontes; plano de CI. Propor arquivos e checks concretos ao principal antes da execução por dono. Não selecionar/comprar provedor, criar/publicar repositório, acessar VPS ou fazer deploy agora. Baseline de imagens/fontes e isolamento permanece não comprovado por este setor. Backup existente não prova restauração testada.

Precedência: mandato atual preservado; adendos humanos posteriores e decisões específicas vigentes prevalecem sobre resumo histórico. ChatbotX substitui Chatwoot como base de estudo Comercial; referências a Chatwoot em tabelas antigas não autorizam novo serviço. MOD-003 r10 fecha 50% na condição parcial, superando percentual indefinido do geral. Regras fechadas não voltam a votação. HTML original anexado permanece não localizado/verificado; mapa e corpus local sustentam esta preparação. Checklist HTML não é aprovação.

## Reuso versus mudança e sequência proposta

| Módulo preservado | Reuso candidato | Transformação / saída para spec |
| --- | --- | --- |
| MOD-001 Fundação | Base local/PostgreSQL | Fonte→runtime, compatibilidade, recuperação e limites; usar evidência operacional existente do principal, sem reoperar |
| MOD-002 Plataforma | Identidade, RBAC, arquivos, configuração | Alçadas GAEVA, último Admin, privacidade/auditoria e shell; precede piloto |
| MOD-004 Comercial, piloto | Transações FilaOps e componentes candidatos ChatbotX | Atendimento/WhatsApp, fila, oportunidades, ficha vinculada e vendedor; preservar escopo final |
| MOD-003 Venda/Pedido/Produção | Propostas, pedidos e execução | Briefing/revisões, aprovações, entrada/saldo, Qualidade e postagem; contratos necessários ao piloto |
| MOD-006 Canais | Integração elegível do atendimento | Canal real, contexto, privacidade, falhas e vínculo; sem serviço Chatwoot obrigatório |
| MOD-008 Financeiro | Pagamentos/contas existentes | Pix/cartão/saldo/conciliação e confirmação idempotente; sem gateway inventado |
| MOD-011 Portal | Dados e fluxo existentes a verificar | Mesma ficha filtrada, proposta e aprovações por versão; contratos ao piloto |
| MOD-009 Estoque/Compras | Estoque/MRP/compras | Compatibilidade com itens, materiais e execução GAEVA |
| MOD-007 Fiscal | Documentos ERP a comparar | Fiscal brasileiro; invoice não equivale a NF-e/NFS-e |
| MOD-005 Ações comerciais | Indicadores/eventos candidatos | Atribuição de resultados sem criar CRM paralelo |
| MOD-010 Folha | Cobertura não comprovada | PRD e prioridade pendentes; não adotar folha por inferência |

A sequência Fundação → Plataforma → piloto foi transmitida pelo principal como hierarquia do mapa; não equivale a fases aprovadas de execução. Ordem posterior e cortes de entrega ficam para plano técnico e decisão humana. Contratos MOD-003/006/008/011 necessários ao piloto não podem ser adiados por tratar o piloto como tela isolada.

## Mapa real de aprovações

| Registro | O que sustenta | O que permanece pendente |
| --- | --- | --- |
| S8, r3, 22/10 | Diretrizes e índice; fonte contém aprovação literal e autorização para aprofundar MOD-003 | Não aprova adendos inteiros, PRDs de módulo, arquitetura, implementação ou runtime |
| Snapshot S8 | SHA256 calculado DAE305E1996F3988BB06F6297EC2EAE51A88F8D16D09A83BC96E53BDF58ECE50, igual ao JSON | Não é hash do PRD atual com adendos |
| Base visual 21/10 relatada em S1/S8 | Intenção visual preservada | Sem recibo específico de hash por tela verificado nesta rodada |
| S2/S4 decisões específicas | Decisões humanas registradas por revisão, sem reabrir regras fechadas | Não há aprovação integral dos módulos presumida |
| S9 | Submissão de constituição G0 | G0 humano, G0.5 ambiente, G1 do recorte e demais gates ainda sem aprovação nesse ledger |
| Mandato atual | Preparar até spec/Task revisáveis | G6 humano e implementação continuam pendentes |

Preparação documental independente pode prosseguir. Transição formal segue pré-requisitos; este setor não cria eventos nem atesta prontidão. Backup e saúde relatados pelo principal não provam restauração testada ou imagem equivalente à fonte.

## Inventário e handoff

Adição Brasil: investigar BR-P01–05 do PRD proposto como hipóteses priorizadas, preservando requisitos fechados. Para cada candidato, Discovery registra problema/usuário, fonte PRD, capacidade real da base, melhoria mínima e alternativa, dependências, custo/risco qualitativo, critério de aceite e indicação piloto versus roadmap. Aprofundar só quando a evidência demonstrar lacuna útil; não inflar escopo por disponibilidade de recurso. Legal, pagamentos e alegações de mercado/concorrentes exigem fontes primárias atuais; até lá, NÃO VERIFICADO. Arquitetura/UIUX avaliam viabilidade/interação dos candidatos que o principal selecionar. FilaOps pode ser adaptado, não é autoridade sobre regras GAEVA.

Encontrado workflow único `docs/gaeva/modulos/comercial/workflow.json`; nenhuma Task canônica moderna de módulo foi identificada na busca por nomes task/workflow em docs. Existem pares históricos `docs/execution/TASK-*.json` e `docs/tasks/TASK-*.md` para shell/guia/navegação/painel; `docs legado/TASK-037-plataforma-identidade-equipe-arquivos.md`; planos `docs/planejamento/plano-de-execucao.{md,json}`. São candidatos históricos, não aprovação automática ou Tasks de módulo confirmadas. Não foram duplicados ou alterados.

Discovery deve: confrontar S2 r42 com S3 r11/spec23; recuperar ou substituir com evidência nova `revisao-pre-spec-tecnica-2026-10-29.md` (Test-Path=False); verificar componentes/licenças e capacidade real sem inferir backend por mock; mapear cada requisito para reuso/adaptação/lacuna e fonte. Arquitetura deve: propor contratos transversais, identidade e compatibilidade de dados, limites do monólito modular e migração faseada/retorno. Baseline técnico do principal é entrada relatada, não rediagnosticada por Product; não presumir microserviços ou módulos Core removíveis a quente.

Principal/harness deve resolver os caminhos canônicos existentes antes de gerar uma Task JSON e visão por módulo, manter revisões/QA independentes, aplicar validador antes de transições e apresentar spec/Task/Discovery correspondentes para aprovação humana. Product encerra aqui; não inicia outro setor.
