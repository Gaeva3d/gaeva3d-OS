# PRD do GAEVA OS

Revisão: 2. Estado: DRAFT CONSOLIDADO, aprovação humana pendente.
Briefing: [revisão 3](../briefing/briefing.md).
Planejamento interno: [MD](../planejamento/plano-de-execucao.md) e
[JSON equivalente](../planejamento/plano-de-execucao.json).
Pesquisa de produção: [processos rastreáveis](../biblioteca-referencias/processos-producao-rastreavel.md).

## Objetivo, resultados e fronteiras

Entregar o produto final GAEVA OS para jornadas B2B e B2C, conectando captação,
venda, pagamento, pedido, design, produção, qualidade, expedição, estoque,
financeiro e fiscal sem perder autoria, histórico ou controle de acesso.

Resultados de negócio:

1. reduzir o lead time entre venda confirmada e expedição;
2. reduzir pedido esquecido, busca de informação e redigitação;
3. evitar produção com versão, material, pagamento ou aprovação incorretos;
4. tornar fila, bloqueio, capacidade, refugo e retrabalho observáveis;
5. manter cada evento comercial, produtivo, financeiro e fiscal rastreável.

As metas numéricas serão definidas após a primeira medição. Volume, parque de
impressoras, capacidade, turnos, lead time, margem, refugo e baseline atual são
desconhecidos e não serão inventados.

Arquitetura-alvo já aprovada para planejamento: monólito modular Node/TypeScript,
PostgreSQL próprio, Docker e frontend React/TanStack/Tailwind. Supabase e Kommo
permanecem até equivalência e reconciliação comprovadas.

Excluídos: PDV/loja física, NFC-e enquanto não houver PDV, múltiplos depósitos,
contabilidade legal completa, importação irrestrita de temas executáveis, MRP/BOM
industrial completo, OEE avançado e corte automático dos sistemas anteriores.

## Atores e jornadas ponta a ponta

| Ator               | Responsabilidade e permissões                                               | Jornada principal                                                     | Regra/fonte                                       | Aceite                                                       |
| ------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| Admin Geral        | Plataforma, catálogo de capabilities, configurações, provedores e auditoria | Configura acesso, políticas e integrações; acompanha exceções         | TASK-037; não criar RBAC paralelo                 | Toda mutação privilegiada autorizada e auditada              |
| Gestor operacional | Prioridade, capacidade, prazo e exceções conforme capabilities              | Monitora WIP, gargalo, atraso e libera decisão excepcional            | Preset configurável, não papel rígido obrigatório | Decisão registra ator, motivo, antes/depois e impacto        |
| Comercial          | Lead, briefing, proposta, aceite, cobrança e próxima ação                   | Qualifica B2B/B2C personalizado até checkout confirmado               | TASK-038/039/040                                  | Nenhum lead ou checkout pendente vira pedido                 |
| Designer           | Viabilidade, modelo, preparo/fatiamento, versão e estimativas               | Produz revisão, envia prévia e corrige quando solicitado              | TASK-038                                          | Produção referencia exatamente a revisão aprovada            |
| Produção           | Planejamento, impressão, pós-processo, QC, embalagem e postagem             | Executa trabalho liberado, registra falha/retrabalho e quantidade boa | TASK-038                                          | Mesmo pedido/card; execução e exceções rastreáveis           |
| Estoque/Compras    | Insumo, fornecedor, compra, recebimento, reserva, consumo e inventário      | Garante material rastreável sem ocultar falta/divergência             | Issue #57                                         | Lote físico e movimento conciliáveis com produção/financeiro |
| Financeiro         | Títulos, caixa, bancos, conciliação, cobrança, fechamento e relatórios      | Recebe eventos canônicos e controla liquidação/saldo                  | TASK-043                                          | Origem idempotente; mutação e auditoria na mesma transação   |
| Fiscal             | Configuração, pré-validação, emissão, consulta e eventos                    | Emite NF-e/NFS-e elegível e reconcilia resultado incerto              | TASK-042                                          | Sem duplicidade; XML/protocolo privados e rastreáveis        |
| RH/Folha           | Vínculos, competência, cálculo, conferência, aprovação e exportação         | Fecha folha e gera obrigações/lançamentos autorizados                 | Issue #58                                         | Competência fechada e histórico sem sobrescrita silenciosa   |
| Cliente            | Conta, briefing, proposta, pagamento, versão, acompanhamento e documentos   | Compra padrão ou solicita personalizado; acompanha pós-venda          | TASK-038 e futuro Portal                          | Isolamento total entre clientes e nenhum acesso interno      |
| Serviço externo    | Gateway, fiscal, e-mail, Meta, banco ou contador                            | Troca dados por adaptador, webhook ou exportação                      | Menor privilégio e segredo server-side            | Idempotência, revogação, auditoria e falha recuperável       |

### Jornadas canônicas

**B2B consultivo:** lead → qualificação → briefing → viabilidade → proposta
versionada → aceite → checkout → confirmação financeira → pedido → design →
aprovação → produção/lote → qualidade → fiscal → expedição → pós-venda.

**B2C catálogo:** produto/variante → configuração → checkout → confirmação
financeira → pedido → produção sob encomenda quando aplicável → qualidade →
fiscal → expedição.

**B2C personalizado:** rascunho → briefing → conta confirmada → análise humana →
proposta → checkout → pedido, seguindo depois a mesma cadeia B2B.

**Produção:** trabalho liberado → roteiro/versionamento → alocação → execução →
pós-processo → QC → aceitar, retrabalhar, reimprimir ou descartar → embalagem →
liberação financeira/fiscal → postagem.

## Inventário de módulos aprovados

Quantidade de módulos funcionais aprovados: **12**.

| ID      | Módulo e objetivo           | Fronteira funcional                                                                                   | Dependências/capacidades             | Task/estado atual                                                         |
| ------- | --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| MOD-001 | Fundação local e PostgreSQL | Runtime local, schema-base, conexão server-side e recuperação sintética                               | Governança                           | TASK-002, concluída/integrada                                             |
| MOD-002 | Plataforma e Configurações  | Identidade, sessão, equipe, RBAC/capabilities, arquivos, auditoria, segredos e configurações          | MOD-001                              | TASK-037 rev12, entrega técnica no PR #55; gates finais/merge pendentes   |
| MOD-003 | Venda, Pedido e Produção    | Captação, catálogo parametrizado, proposta, checkout, pedido, design, MES leve, qualidade e expedição | MOD-002; contratos Financeiro/Fiscal | TASK-038 rev18, Ready for Dev; não implementada                           |
| MOD-004 | CRM                         | Lead, contato, oportunidade, funil, atividade, deduplicação e conversão controlada                    | MOD-002/003                          | TASK-039 rev1, SDD incompleta                                             |
| MOD-005 | Ações comerciais            | Ações, metas, origem, resultados e rastreabilidade por eventos reais                                  | MOD-003/004                          | TASK-040 rev1, SDD incompleta                                             |
| MOD-006 | Canais de atendimento (Chatwoot) | Atendimento omnichannel operado no Chatwoot; integração contextual com CRM GAEVA                 | MOD-004; MOD-005 para atribuição     | TASK-041 rev1, escopo a revisar na SDD                                    |
| MOD-007 | Fiscal                      | NF-e/NFS-e, configuração versionada, snapshot, emissão, consulta, eventos e arquivos                  | MOD-002/003/008                      | TASK-042 rev2, Ready for Dev; não implementada                            |
| MOD-008 | Financeiro                  | Contas, títulos, caixa/bancos, conciliação, cobrança, fluxo, DRE e fechamento                         | MOD-002; eventos dos demais módulos  | TASK-043 rev4, implementação parcial no PR #65; gate autenticado pendente |
| MOD-009 | Estoque e Compras           | Insumos, lotes, fornecedor, compra, recebimento, reserva, consumo, inventário e reposição             | MOD-002/003/008                      | Issue #57/spec; sem Task executável aprovada                              |
| MOD-010 | Folha de Pagamento          | Vínculos, competências, cálculo, conferência, fechamento e integração financeira                      | MOD-002/008                          | Issue #58/spec; sem Task executável aprovada                              |
| MOD-011 | Portal do Cliente           | Conta, propostas, pagamentos, aprovações, pedidos, arquivos e documentos do próprio cliente           | MOD-002/003/007/008                  | Sem Issue/spec/Task; placeholder não é portal                             |
| MOD-012 | Experiência Pública e Temas | Loja, landing pages e biblioteca segura de temas versionados                                          | MOD-002/003/011                      | Sem Issue/spec/Task                                                       |

Migração seletiva, infraestrutura, homologação/cutover, Design System, segurança,
observabilidade e QA são capacidades transversais. Não entram na contagem de
módulos funcionais nem autorizam execução automática das TASK-044–046.

## Contratos transversais

### Entidades e invariantes

- `orders.status` é a macroetapa oficial e cada pedido possui um único card.
- Lead, rascunho, oportunidade, proposta e checkout pendente não são pedido.
- Somente confirmação financeira idempotente cria exatamente um pedido.
- Cliente, lead, proposta, checkout, pedido, item, revisão, aprovação, arquivo,
  roteiro, lote/unidade, execução, recurso, material, inspeção, movimento,
  título, documento fiscal, expedição e evento preservam UUID, autoria e tempo.
- Estado comercial, produtivo, financeiro e fiscal não vira enum paralelo de
  `orders.status`; cada domínio mantém seu lifecycle e seus bloqueios explícitos.
- Eventos operacionais relevantes são append-only; correção produz evento
  compensatório ou nova revisão, nunca reescrita silenciosa.

### Contrato de produção rastreável

- `ManufacturingPackage`: pedido/item, revisão aprovada, arquivos, quantidade,
  material/cor, acabamento, embalagem, instruções e versão do roteiro.
- `ManufacturingRoute`: categoria, versão, operações ordenadas, critérios de
  entrada/saída e recursos compatíveis.
- `ProductionRun`: lote/unidade, recurso, operador, tempos, material/lote,
  planejado, bom, refugo, reimpressão e eventos.
- `QualityCheck`: critério, resultado, evidência, responsável e disposição.
- `NonConformance`: origem, motivo padronizado, impacto e decisão de aceitar,
  retrabalhar, reimprimir ou descartar.
- A ficha viajante usa QR com identificador opaco. O backend continua validando
  sessão e capability; QR não concede acesso.
- Trabalho só entra em execução com revisão aprovada, material/parâmetros,
  capacidade e gates financeiros aplicáveis satisfeitos.

### Atendimento comercial com Chatwoot

Decisão de produto: reutilizar o Chatwoot como aplicação de atendimento
separada, aberta pelo CRM GAEVA em nova aba. Não copiar nem portar o frontend
Vue ou backend Rails para a stack GAEVA. Chatwoot é o sistema de registro de
conversas, caixas de entrada, canais, atribuições, notas privadas, macros,
automações, SLA/horário de atendimento, CSAT e relatórios suportados pela
edição instalada. GAEVA continua sendo o sistema de registro de leads,
contatos, oportunidades, funil e conversão em pedido.

A entrada `CRM/Atendimento` no ERP abre a instalação Chatwoot em nova aba, com
URL configurada. O ERP também se comunica com o Chatwoot por integração
server-to-server via API/webhooks; chaves nunca ficam no navegador. A ligação
contextual ao contato/conversa é desejada, mas deep-link, SSO, mapeamento de
tenant/usuário, sincronização de identidade e resumo de conversa dependem de
validação técnica e não são presumidos. O produto deve deixar claro quando a
URL ou integração não estiver configurada; não simular atendimento local.
WhatsApp/Meta serão conectados e operados no Chatwoot somente após seleção de
canais, edição/licença, conta autorizada, consentimento e SDD de TASK-041.

Fronteiras obrigatórias: não criar lead duplicado por webhook; definir chave
externa/idempotência e política de contato duplicado; manter credenciais no
backend; auditar abertura/sincronização se houver dado pessoal transferido;
não replicar mensagem/histórico sem finalidade e retenção definidas. Recursos
Enterprise ou sujeitos a assinatura não podem ser prometidos como inclusos sem
confirmar edição e licença. Integração e autenticação ficam como blockers da
SDD, não como escopo já entregue. Estratégia upstream fixo versus fork mantido
pela GAEVA permanece aberta; recomendação inicial é validar upstream self-hosted
antes de assumir o custo contínuo de manter um fork.

### Acesso e experiência

- `Admin`, `Gerente` e `Colaborador` são presets de interface mapeados para o
  catálogo da TASK-037. Papéis especializados permanecem configuráveis;
  `Cliente` continua isolado.
- A fundação visual permanece Radix/shadcn/Tailwind e componentes locais.
- ERP interno usa alta densidade operacional; loja, LP e portal usam composição
  mais visual sobre os mesmos tokens.
- Temas aceitam tokens, conteúdo, seções allowlisted e mídias validadas. HTML,
  JavaScript, ZIP e código arbitrário são rejeitados.
- Cada superfície cobre loading, vazio, erro, 401/403, conflito, sucesso,
  bloqueio, permissão, teclado, mobile e reduced motion quando aplicável.

### Segurança, dados e integrações

- Segredos, certificado A1 e tokens ficam server-side, cifrados e write-only.
- Uploads validam tipo, tamanho, autorização e armazenamento privado.
- Webhooks verificam autenticidade, repetição, idempotência e replay.
- Mutação crítica registra ator, origem, motivo e antes/depois na mesma unidade
  transacional quando exigido pelo contrato.
- Homologação e produção são ambientes separados. Mock, fixture e HTTP 200 não
  provam emissão fiscal, pagamento, entrega ou readiness produtiva.

## Fiscal e aceleração segura

A TASK-042 não será reespecificada. Permanecem aprovados NF-e e NFS-e por
adaptadores separados, NFC-e desativada, configuração por vigência, snapshot
imutável, numeração transacional, idempotência, consulta antes de reenvio em
resultado incerto, A1 server-side e produção sob gate humano.

Pode avançar antes das credenciais reais: domínio, persistência, estados,
contratos de adaptador, UI de configuração/prévia/histórico, armazenamento,
redaction, fixtures e POC isolada. Homologação depende de emitente, regime,
UF/município, credenciamento, certificado, séries e classificação fiscal
aprovados. FinOpenPOS é referência de produto/UI, não backend copiável.

## Design Guide e widgets

Fonte: [Design Guide](../design/design-guide.md),
[inventário de componentes](../design/component-source-inventory.md) e
[catálogo HTML](../design/index.html).

Catálogo planejado: shell, fila/tabela densa, filtros, briefing, orçamento,
comparação de versões, aprovação, Kanban acessível, programação, fila por
recurso, execução/reimpressão, qualidade/não conformidade, ficha por QR,
estoque/recebimento, financeiro/fiscal, timeline e portal.

## Indicadores e aceite

Indicadores iniciais, com baseline `UNKNOWN`: lead time venda-expedição; tempo
em fila, setup, execução, bloqueio e retrabalho; aprovação na primeira versão;
cumprimento da data prometida; WIP; utilização/fila por recurso; first-pass
yield; refugo/reimpressão por motivo; divergência de estoque; tempo/erro de
emissão fiscal; pedidos esquecidos e idade dos bloqueios.

O primeiro aceite de medição exige definições de evento e timestamp, amostra
real autorizada e relatório de baseline. Nenhum percentual de fornecedor vira
meta da GAEVA.

## Rastreabilidade essencial

| Ator       | Cenário             | Regra                                               | Fonte/decisão             | Aceite                                          | Módulo  |
| ---------- | ------------------- | --------------------------------------------------- | ------------------------- | ----------------------------------------------- | ------- |
| Comercial  | Venda personalizada | Proposta versionada e checkout sem pedido prematuro | TASK-038 rev18            | Um pedido somente após confirmação              | MOD-003 |
| Designer   | Liberação técnica   | Revisão aprovada fica congelada                     | DEC-009/012 proposta      | Run referencia a revisão correta                | MOD-003 |
| Produção   | Falha/reimpressão   | Nova tentativa, mesmo pedido/card                   | Fluxo canônico e pesquisa | Execução anterior preservada                    | MOD-003 |
| Gestor     | Priorização         | Planejar por prazo/risco antes de agendar recurso   | Pesquisa MES              | Motivo e impacto auditados                      | MOD-003 |
| Estoque    | Consumo             | Material/lote vinculados à execução                 | Issue #57 e pesquisa      | Movimento conciliável                           | MOD-009 |
| Qualidade  | Não conformidade    | Disposição explícita e nova inspeção quando exigida | Pesquisa MES/job shop     | Expedição bloqueada enquanto reprovado          | MOD-003 |
| Financeiro | Título externo      | Origem idempotente pela integração                  | TASK-043                  | Sem título duplicado                            | MOD-008 |
| Fiscal     | Timeout             | Consultar/reconciliar antes de reenviar             | TASK-042                  | Sem número/documento duplicado                  | MOD-007 |
| Cliente    | Tema/loja           | Tema seguro não executa código importado            | DEC-011                   | Preview/publicação/rollback auditáveis          | MOD-012 |
| Admin      | Acesso              | Presets mapeiam capabilities existentes             | TASK-037                  | Backend deny-by-default e overrides respeitados | MOD-002 |

## Riscos e decisões ainda abertas

- Validar no chão de fábrica quais operações, motivos e evidências são mínimos;
  isso decide rastreio por lote, sublote ou unidade.
- Medir parque, capacidade, turnos, tempos e refugo antes de scheduling ou OEE.
- Resolver a pilha PR #60 → #64 → #65 e os PRs #55/#67 sem reescrever histórico.
- Obter gates externos de e-mail, gateways, contador, certificado, Meta e VPS.
- Definir capacidade semanal e datas somente depois do baseline e das branches
  integradas; ausência desses dados não bloqueia SDD nem testes sintéticos.

## Aprovação e passagem para SDD

Este PRD consolida 12 módulos, mas permanece DRAFT até revisão humana no Issue
#68/PR #69. Aprovação deste documento permite iniciar ou completar SDD por
módulo; não autoriza implementação, merge, deploy, cobrança, emissão fiscal ou
uso de dados reais. TASK-038 e TASK-042 preservam seus contratos próprios e só
podem ser executadas pelo Harness na revisão e base verificadas.
