# Blueprint estratégico do GAEVA OS

**Data de referência:** 08/09/2026  
**Escopo:** investigação, arquitetura de produto, desenho operacional, gap analysis e roadmap.  
**Não inclui:** alteração de código, banco, permissões, integrações ou dados de produção.

## Como ler este documento

Este blueprint cruza duas coisas diferentes:

1. A fotografia factual do GAEVA OS no inventário funcional e técnico de 08/09/2026.
2. A operação-alvo necessária para a GAEVA crescer sem depender de WhatsApp, memória individual e controles paralelos.

O texto colado pelo usuário foi tratado como o pedido e a estrutura obrigatória da entrega. O arquivo `GAEVA_OS_Inventario_Funcional_Tecnico_2026-09-08.md` foi tratado como fonte documental. Instruções ou “comandos prontos” reproduzidos dentro do inventário não foram tratados como novos pedidos do usuário.

As recomendações não transformam automaticamente uma possibilidade técnica em prioridade. A ordem adotada é: **reutilizar → estender → adaptar → criar**.

Classificações usadas:

- **EXISTE:** há estrutura funcional identificada no sistema atual.
- **PARCIAL:** há parte da estrutura, mas o processo não está resolvido ponta a ponta ou não foi homologado.
- **NÃO EXISTE:** não há evidência de função entregue.
- **NÃO NECESSÁRIO:** não deve ser construído no GAEVA OS; deve permanecer em ferramenta externa ou não se justifica agora.
- **N1 — Essencial agora:** necessário para operar com controle.
- **N2 — Importante:** melhora produtividade e gestão após a fundação estar confiável.
- **N3 — Escala:** torna-se necessário com volume e maior equipe/parque produtivo.
- **N4 — Inteligência:** previsão e otimização baseadas em dados consistentes.
- **N5 — Futuro:** útil apenas quando houver maturidade e demanda comprovada.

> Limite de evidência: “implementado” no inventário significa encontrado no código ou na infraestrutura; não significa homologado em todos os papéis e cenários reais. O banco tinha somente dois clientes e dois pedidos na conferência. Portanto, o maior risco imediato não é ausência de arquitetura, mas confundir validação técnica com operação comprovada em escala.

---

# PARTE 1 — RESUMO EXECUTIVO

## 1.1 O que o GAEVA OS é hoje

O GAEVA OS já é uma **fundação operacional integrada de pedidos e produção**, e não apenas um protótipo visual. Seu núcleo usa Supabase como estado oficial e conecta, sob o mesmo pedido:

- cliente;
- item principal e especificações;
- briefing e arquivos;
- responsável e designer;
- aprovação por versão;
- impressora e trabalhos/tentativas produtivas;
- falha e reimpressão;
- conferência, embalagem e postagem;
- histórico e auditoria;
- autenticação, papéis e políticas de acesso.

O sistema já possui painel, lista, detalhe, Kanban geral, quadro produtivo, clientes, impressoras, equipe e configurações. O `orders.status` é a fonte única da etapa operacional. Isso é a decisão arquitetural correta e deve ser preservada.

## 1.2 O que está bem resolvido

- Uma única entidade de pedido alimenta lista, detalhe, Kanban e produção.
- O fluxo mantém aprovação antes de impressão.
- Reimpressões preservam a tentativa anterior.
- Urgências, bloqueios e exceções exigem motivo.
- Há diferenciação entre integrante operacional, usuário autenticado e perfil.
- Arquivos ficam privados e vinculados ao contexto do pedido.
- Papéis, RLS e funções de servidor protegem operações relevantes.
- O histórico reúne transições, aprovações, atribuições e eventos produtivos.
- O Kanban mostra prazo, prioridade, responsável, designer e tempo na etapa.
- O cadastro comercial foi simplificado e evita exigir decisões produtivas cedo demais.

## 1.3 O que está parcialmente resolvido

- O painel mostra sinais de atenção, mas ainda não é uma central diária de decisão e execução.
- O tempo na etapa existe, mas SLA configurável, dono do atraso e pausa de relógio não estão completos.
- O briefing existe em texto e anexos, mas não possui templates estruturados por produto nem gate de completude persistido.
- A aprovação tem versão, decisão e histórico, mas depende de atualização interna; não há confirmação externa pelo cliente.
- Impressoras, fila e tentativas existem, mas planejamento de capacidade continua manual e sem calendário produtivo confiável.
- Custos previsto/real aparecem como estrutura preparada, sem composição verificável de custo e margem.
- Os checklists atuais não formam um controle de qualidade persistente por item/lote.
- Cliente possui visão básica 360º, mas deduplicação e vínculo estável com o CRM precisam ser definidos.
- `gaeva_leads` e `gaeva_conversion_events` existem, e o motor comercial está em shadow, mas o handoff Kommo → pedido não está comprovado em produção.
- Há dois quadros produtivos sobre o mesmo estado; isso é reaproveitável, mas precisa ter papéis e linguagem inequívocos.

## 1.4 O que falta

Faltam principalmente seis capacidades:

1. **Homologação operacional real:** provar a jornada ponta a ponta com Comercial, Produção, Designer, Administração e consulta.
2. **Disciplina de entrada:** impedir que pedido avance com briefing, prazo, pagamento ou referência incompatíveis com a etapa.
3. **Gestão por exceção:** transformar atraso, falta de informação, falha, ausência de responsável e risco de prazo em filas acionáveis.
4. **Granularidade produtiva correta:** manter um card por pedido, mas planejar itens, lotes e tentativas de impressão separadamente.
5. **Dados econômicos e de capacidade:** registrar estimado versus real para material, máquina, design, acabamento, falhas e postagem.
6. **Integrações com fronteiras claras:** Kommo vende; GAEVA OS executa; n8n transporta eventos; provedores especializados continuam donos de pagamento, mídia, etiqueta e contabilidade.

## 1.5 Papel definitivo do sistema

O GAEVA OS deve ser o **sistema de registro e comando da execução pós-venda da GAEVA**, com uma ponte controlada para o pré-venda.

Ele deve ser dono de:

- pedido confirmado ou em validação operacional;
- promessa de entrega e prazo interno;
- briefing operacional e suas pendências;
- arquivos e versões ligados ao pedido;
- responsáveis e próxima ação;
- aprovação válida da versão vigente;
- plano e execução de produção;
- tentativas, falhas, reimpressões e qualidade;
- expedição e situação operacional da entrega;
- custos operacionais atribuíveis e margem do pedido;
- timeline e auditoria;
- exceções, SLAs e capacidade comprometida.

Ele não deve tentar ser caixa de WhatsApp, CRM conversacional completo, sistema contábil, editor 3D, fatiador ou software de telemetria industrial.

## 1.6 Tese central

Se a GAEVA multiplicasse hoje a operação por dez, a arquitetura básica sobreviveria, mas a rotina ainda tenderia ao caos por cinco motivos: entrada incompleta, atualizações humanas fora do sistema, falta de custos reais, planejamento manual de capacidade e ausência de homologação em volume.

Portanto, a prioridade não é reconstruir. É **transformar a fundação existente em contrato operacional obrigatório**, fazer o sistema orientar o próximo passo e começar a capturar os dados que permitem prometer prazo, medir margem e decidir contratação ou compra de máquina.

---

# PARTE 2 — MAPA DO SISTEMA ATUAL

## 2.1 Arquitetura atual

| Camada | Tecnologia/serviço | Papel observado |
|---|---|---|
| Interface | React, TypeScript, Vite, TanStack Start/Router/Query, Tailwind, Radix/shadcn | Aplicação web operacional responsiva |
| Código | GitHub, repositório privado `Trafegantes-Digital/gaeva-flow`, branch `main` | Fonte do código e migrations do núcleo |
| Publicação | Lovable | Aplicação publicada e conectada ao repositório |
| Estado oficial | Supabase/PostgreSQL 17 | Pedidos, clientes, produção, auditoria e dados comerciais auxiliares |
| Identidade | Supabase Auth + `profiles` + `team_members` | Login, papel e vínculo operacional |
| Arquivos | Supabase Storage privado | Arquivos de pedido e avatares |
| Realtime | Supabase Realtime | Atualizações observadas em pedidos e trabalhos de produção |
| Acesso administrativo | Edge Function `team-access` | Criar/vincular acesso e gerir senha temporária |
| Automação externa | n8n, ainda sem go-live GAEVA comprovado | Orquestração futura/atual em shadow para eventos comerciais |
| CRM | Kommo | Conversa, pipeline e pré-venda; integração completa com pedido não comprovada |

## 2.2 Telas existentes e maturidade

| Tela | Rota | Função atual | Maturidade |
|---|---|---|---|
| Painel | `/` | Indicadores, atenção, prazos, etapas e atividades | PARCIAL como central operacional |
| Pedidos | `/pedidos` | Busca, filtros, colunas, ordenação, paginação e ações rápidas | EXISTE |
| Novo pedido | `/pedidos/novo` | Cliente, dados comerciais, briefing textual e anexos | EXISTE; transação total e duplicidade precisam validação |
| Detalhe | `/pedidos/:id` | Resumo, arquivos, produção, aprovação, financeiro e histórico | EXISTE; contém diferenças legadas |
| Kanban | `/pedidos/kanban` | Fluxo integrado e ações contextuais | EXISTE; escala real não homologada |
| Produção | `/producao` | Quadro detalhado de impressão a expedição | EXISTE; sobreposição com Kanban precisa contrato claro |
| Clientes | `/clientes` | Cadastro e busca | EXISTE |
| Cliente | `/clientes/:id` | Dados, pedidos, valor acumulado e última compra | EXISTE/PARCIAL |
| Impressoras | `/impressoras` | Cadastro, situação, fila e ocupação registrada | PARCIAL; sem telemetria/capacidade avançada |
| Equipe | `/equipe` | Integrantes, acessos, papéis, capacidade e carga | EXISTE/PARCIAL |
| Configurações | `/configuracoes` | Permissões, sincronização e auditoria | EXISTE em escopo atual |

## 2.3 Módulos e funções atuais

### Pedidos

- Cadastro comercial em três partes.
- Código gerado no banco.
- Um item principal pela interface, embora o banco suporte vários itens.
- Categorias atuais: Corporativo, Chaveiro, Pet personalizado, Estatueta e Outros.
- Quantidade, dimensões, acabamento, finalidade, prazo, evento corporativo, valores, entrada, pagamento e observações.
- Alterações rápidas e consulta por múltiplos filtros.

### Fluxo/Kanban

- Um card por pedido.
- Colunas agregadas sobre os status existentes.
- Ordenação por atraso, urgência, proximidade, prioridade e idade na etapa.
- Drag-and-drop no desktop e “Mover para” para clique/mobile.
- Justificativa para saltos e exceções.
- Drawer com dados e ações sem sair do quadro.

### Briefing e arquivos

- Descrição/referências unificadas.
- Upload privado por pedido.
- Categorias de arquivos mais detalhadas no banco que em algumas interfaces.
- Consulta e remoção controladas.
- Sem template dinâmico, versionamento CAD ou validação estruturada de completude.

### Design e aprovação

- Designer como papel e atribuição específica.
- Início de modelagem e envio de versão para aprovação.
- Aprovação, solicitação de alteração, comentário e revisão.
- Proteção para que versão antiga aprovada não libere impressão de versão nova.
- Sem portal/link externo comprovado.

### Produção

- Fila, execução, pausa/estado, falha, conclusão e cancelamento de trabalho.
- Impressora obrigatória para execução/conclusão.
- Reimpressão ligada à tentativa anterior.
- Registro manual de horas, material, falha e observações no quadro de produção.
- Sem integração física com impressora ou fatiador.

### Qualidade, embalagem e expedição

- Etapas existentes e confirmações agrupadas.
- Transportadora, rastreio e postagem no pedido.
- Checklist visual legado não persiste cada marcação.
- Sem etiqueta ou rastreamento automático comprovado.

### Clientes

- Dados de contato, cidade/UF, observações, pedidos, ativos, valor acumulado e última compra.
- Link para WhatsApp, sem caixa de conversa integrada.
- Sem agenda de múltiplos endereços ou deduplicação comprovada.

### Pessoas, acesso e permissões

- Papéis: Administrador, Comercial, Produção, Designer e Visualização.
- Integrante pode existir sem login.
- Criação/reaproveitamento de conta e senha temporária.
- RLS e operações de servidor; não apenas ocultação visual.
- Campo financeiro pode continuar visível a papéis com leitura ampla; isso exige decisão explícita.

### Painel e indicadores

- Ativos, urgentes, atrasados, aguardando aprovação, em impressão e concluídos.
- Períodos diário, mensal e anual; comparação com período anterior.
- Atenção, prazos próximos, etapas e atividades.
- O recorte por criação do pedido com situação atual não é BI histórico.

## 2.4 Entidades atuais

| Entidade | Responsabilidade atual | Reutilização recomendada |
|---|---|---|
| `profiles` | Papel e situação do usuário autenticado | Manter |
| `team_members` | Pessoa operacional, capacidade e vínculo opcional de login | Manter e melhorar capacidade |
| `customers` | Cliente operacional | Manter e ligar a IDs externos |
| `orders` | Cabeçalho, estado, prioridade, prazos, valores, briefing, envio e autoria | Manter como agregado central |
| `order_items` | Item e especificações | Tornar unidade explícita de entregável |
| `order_files` | Arquivos e categorias | Estender com versão/contexto quando necessário |
| `order_assignments` | Responsabilidades por função | Manter; evitar novos cadastros de designer/responsável |
| `approvals` | Versão e decisão | Manter e estender para prova/canal externo |
| `printers` | Máquina e estado operacional | Manter; adicionar calendário só quando necessário |
| `production_jobs` | Trabalho/tentativa produtiva | Manter como unidade de planejamento e execução |
| `production_events` | Eventos da produção | Manter; usar para checkpoints auditáveis no início |
| `audit_logs` | Histórico imutável para papéis normais | Manter como trilha transversal |

Estruturas auxiliares que devem ser preservadas: `order_operational_summary`, `generate_order_code`, `operate_order`, `order_history`, `prepare_team_access`, `link_team_access` e Edge Function `team-access`.

Estruturas comerciais no mesmo Supabase: `gaeva_leads` e `gaeva_conversion_events`. Elas não substituem `orders` e não provam handoff em produção. Estruturas `dry_*` e `pet_projects` ficam fora do escopo operacional do GAEVA OS.

## 2.5 Máquina atual, sem reinterpretar o banco

```text
received
  → briefing_pending
  → modeling
  → internal_review
  → awaiting_customer_approval
  → approved_for_production
  → print_queue
  → printing
  → finishing
  → quality_control
  → packaging
  → shipping
  → completed
```

`cancelled` encerra o fluxo. `blocked` é legado e já pode ser apresentado associado à etapa anterior; a recomendação é tratá-lo como condição transversal, não como uma nova linha de produção.

## 2.6 O que não está entregue

- Financeiro/contabilidade completos.
- Custos e margem confiáveis.
- Estoque e compras completos.
- Catálogo/SKU avançado.
- Portal do cliente.
- Integração física com máquinas.
- Editor, fatiador ou renderizador 3D.
- Automação comprovada de mensagens, convite, etiqueta ou rastreio.
- SLA configurável completo.
- BI histórico por estado passado.
- Operação offline.
- Sincronização Kommo → pedido comprovada em produção.
- Teste de carga com centenas de pedidos.

## 2.7 Snapshot factual de 08/09/2026

| Item | Evidência do inventário |
|---|---|
| Publicação | Aplicação publicada pelo Lovable e associada ao commit de referência; jornada autenticada completa não repetida na conferência |
| Identidade | 2 contas Auth, 2 perfis e 2 integrantes ativos vinculados; 1 Admin e 1 Comercial |
| Primeiro acesso | 1 conta com login registrado; 1 ainda marcada para trocar senha temporária |
| Dados operacionais | 2 clientes e 2 pedidos; volume insuficiente para validar escala |
| Impressoras | Snapmaker U1 FDM, Bambu Lab A1 FDM e Elegoo Saturn 4 Ultra 12K resina, registradas como disponíveis |
| Storage | `order-files` privado, limite 50 MiB; `avatars` privado, limite 5 MiB; acesso por URL assinada |
| Segurança do núcleo | As 12 tabelas centrais foram conferidas com RLS habilitada; isso não equivale a auditoria completa de todo o projeto compartilhado |
| Testes registrados | 23 automatizados: 7 de Kanban, 6 de cadastro/painel e 10 do serviço de contas, além de TypeScript, build, lint e SQL transacional em entregas anteriores |
| Realtime | Pedidos e trabalhos acompanhados pelo cliente do Kanban; publicação também inclui impressoras e eventos produtivos; demais relações exigem verificação |
| Performance | Ativos buscados em lotes de 250, render inicial de 30 cards por coluna, detalhes lazy, histórico em páginas de 100; não há prova de carga com centenas reais |

## 2.8 Filtros, alertas e automações já observados

- Lista de pedidos: status, prioridade, produto, responsável, impressora, cliente, prazo, período e focos do painel.
- Kanban: busca por pedido/cliente/telefone, responsável, designer, vendedor, produto, prazo, prioridade, etapa, período e atalhos pessoais/urgentes/atrasados.
- Produção: hoje, urgentes, atrasados, sem responsável, sem impressora e bloqueados.
- Painel: atraso, urgência, bloqueio, proximidade de prazo, aprovação, impressão, concluídos, prazos próximos e atividade recente.
- Automação interna comprovada: geração de código; operações centralizadas; proteção de aprovação; vínculo de reimpressão; preparação/vínculo de acesso; criação e reset de senha temporária pela Edge Function.
- Automação externa não comprovada como entregue no OS: envio de WhatsApp/e-mail, aprovação pelo cliente, pagamento, etiqueta, tracking e handoff de lead para pedido.

## 2.9 Limites de consistência atuais

- Cadastro de cliente, pedido, item e arquivos não forma uma única transação.
- A paginação da lista opera sobre registros já carregados em algumas rotas.
- O detalhe exibe campos legados retirados do cadastro novo.
- O cálculo de capacidade da equipe pode não refletir todas as atribuições de designer.
- A comparação do painel usa convenção de 100% quando o período anterior é zero.
- “Pago” não comprova conciliação.
- O primeiro acesso, mobile real, carga, backup/restore e integrações externas continuam pendentes de validação.

---

# PARTE 3 — MAPA DA OPERAÇÃO GAEVA

## 3.1 Fluxo do lead à entrega

| Macroetapa | Sistema principal | Responsável | Saída obrigatória |
|---|---|---|---|
| Aquisição | Meta/Google/site | Marketing | Origem/campanha identificável |
| Conversa e qualificação | WhatsApp + Kommo | Comercial | Necessidade, produto, quantidade, prazo e contexto |
| Orçamento/negociação | Kommo | Comercial | Oferta, valor, frete/condição e validade |
| Compromisso comercial | Kommo + pagamento | Comercial | Negócio ganho ou faturado, condição financeira e promessa preliminar |
| Handoff | Integração/GAEVA OS | Comercial + Operação | Pedido recebido com pendências explícitas |
| Confirmação operacional | GAEVA OS | Produção/Operação | Briefing validado e prazo interno aceito |
| Modelagem | GAEVA OS + ferramentas 3D | Designer | Versão revisada internamente |
| Aprovação | GAEVA OS + canal do cliente | Comercial/Designer | Versão vigente aprovada ou alteração registrada |
| Planejamento produtivo | GAEVA OS + fatiador externo | Produção | Jobs/lotes, impressora, material e estimativas |
| Impressão | GAEVA OS + impressora/ferramentas externas | Produção | Tentativa concluída ou falha tipificada |
| Pós-produção e qualidade | GAEVA OS | Produção | Item conforme, retrabalho ou reimpressão |
| Embalagem | GAEVA OS | Produção/Expedição | Quantidade, acessórios, proteção e endereço conferidos |
| Postagem | GAEVA OS + transportadora | Expedição | Etiqueta/rastreio e data de postagem |
| Entrega | Transportadora → GAEVA OS | Expedição/Atendimento | Entregue, exceção logística ou retorno |
| Encerramento | GAEVA OS | Operação/Comercial | Pedido finalizado, custo consolidado e aprendizado registrado |

## 3.2 Três unidades que não podem ser confundidas

1. **Pedido:** compromisso comercial e visão do cliente. É o card do Kanban geral.
2. **Item/entregável:** produto, variante e quantidade dentro do pedido. Um pedido corporativo pode ter mais de um item.
3. **Job/lote/tentativa:** unidade executada em uma impressora. Um item de 100 chaveiros pode gerar lotes em máquinas diferentes e reimpressões.

O pedido só avança de macroetapa quando seus itens obrigatórios cumprem o gate. Jobs podem avançar independentemente dentro da etapa produtiva. Isso preserva simplicidade no Kanban sem perder controle de fábrica.

## 3.3 Operação por escala

| Volume | Controle necessário | Risco dominante |
|---|---|---|
| 10 simultâneos | Kanban único, dono e próximo passo | Informação ficar no WhatsApp |
| 50 simultâneos | Filas por departamento, SLA e exceções | Pedidos parados e responsáveis sobrecarregados |
| 100 simultâneos | Itens/jobs, capacidade semanal e WIP | Prometer mais do que a operação entrega |
| 300 simultâneos | Planejamento por lote/máquina, ações em massa e custo real | Gargalos invisíveis e margem corroída |
| 1.000/mês | Previsão, integração forte, governança de dados e papéis especializados | Sistema lento, automação frágil e decisão baseada em médias enganosas |

## 3.4 Regras operacionais estruturantes

- Nenhum pedido ativo fica sem **responsável atual**, **próxima ação**, **prazo dessa ação** e **motivo de espera**, quando aplicável.
- Prazo prometido e prazo interno são diferentes. O interno deve reservar embalagem, expedição e contingência.
- Tempo trabalhando e tempo aguardando cliente devem ser medidos separadamente.
- Aprovação sempre aponta para uma versão; mudança posterior invalida a aprovação anterior.
- Falha não deve apenas “voltar coluna”: gera tentativa, causa, perda, ação corretiva e custo.
- Urgência não muda capacidade física. Ela exige motivo, impacto e decisão sobre o que será reordenado.
- Pedido em lote não é uma única impressão. A unidade programável é o job/lote.
- Alteração de escopo após aprovação exige revisão de prazo, custo e nova aprovação.
- “Pago” no OS é estado operacional sincronizado ou conferido; não é conciliação contábil.
- Concluído, postado e entregue são eventos diferentes e devem manter definições estáveis.

## 3.5 Exceções que o fluxo precisa absorver

| Exceção | Tratamento recomendado |
|---|---|
| Cliente muda pedido | Criar mudança de escopo; reestimar custo/prazo; invalidar aprovações afetadas |
| Cliente desaparece | Pausar SLA interno, registrar “aguardando cliente”, data do próximo contato e limite de encerramento |
| Pagamento parcial | Manter `payment_status=partial`; bloquear apenas etapas definidas pela política comercial |
| Pedido urgente | Motivo obrigatório, aprovação de responsável e replanejamento visível da fila |
| Cancelamento/reembolso | Estado terminal + motivo + impacto financeiro; preservar histórico e arquivos |
| Pedido duplicado | Sinalizar possível duplicidade antes de criar; nunca mesclar automaticamente |
| Arquivo corrompido/errado | Bloqueio de arquivo, solicitante, substituição e vínculo entre versões |
| Impressão falha | Encerrar tentativa como falha; tipificar causa; registrar perda e decidir reimpressão |
| Impressora quebra | Indisponibilidade/maintenance, jobs impactados e replanejamento |
| Insumo acaba | Bloqueio de material, data prevista de reposição e pedidos afetados |
| Endereço errado | Nova confirmação; reemitir etiqueta; registrar custo e responsabilidade |
| Transportadora atrasa | Exceção logística sem reabrir produção; dono de acompanhamento e comunicação |
| Pedido retorna | Evento de retorno; triagem entre reenvio, correção, reprodução ou reembolso |
| Produto chega com problema | Não conformidade ligada a pedido/item/job; causa, resolução e custo de garantia |

---

# PARTE 4 — ARQUITETURA OPERACIONAL IDEAL

## 4.1 Fronteira do GAEVA OS

### Deve morar no GAEVA OS

- Pedido, item e promessa operacional.
- Briefing operacional e validade/completude.
- Arquivos, versões e contexto.
- Responsáveis, filas e próxima ação.
- Aprovação e revisão.
- Jobs, máquinas, material, tempos e tentativas.
- Checkpoints de qualidade e embalagem.
- Expedição operacional e rastreio associado.
- Custo operacional do pedido e margem gerencial.
- Exceções, SLAs, capacidade e auditoria.

### Deve ser integrado

- Kommo/WhatsApp: lead, origem, vendedor, negócio ganho, valor e motivo de perda.
- Pagamento: confirmação, estorno e referência da transação.
- Transportadora: cotação/etiqueta quando útil, postagem e tracking.
- Meta/Google: IDs de origem e sinais de conversão/margem.
- n8n: transporte, validação, retry e observabilidade de eventos.
- Sistema financeiro/contábil: títulos, caixa, DRE legal e conciliação.

### Deve permanecer externo

- Caixa de entrada e automação conversacional completa.
- Gestão de campanhas e mídia.
- Emissão fiscal e escrituração.
- CAD/modelagem, fatiamento e controle técnico da impressora.
- Operação nativa de transportadora.
- Folha, RH e compras complexas.

## 4.2 Modelo de controle

```text
CRM/WhatsApp ── evento de handoff ──► PEDIDO
                                         │
                  ┌──────────────────────┼──────────────────────┐
                  ▼                      ▼                      ▼
              ITENS/BRIEFING       APROVAÇÕES              RESPONSÁVEIS
                  │                      │                      │
                  └──────────── gate de produção ─────────────┘
                                         │
                                         ▼
                              JOBS / LOTES / TENTATIVAS
                                         │
                       ┌─────────────────┼─────────────────┐
                       ▼                 ▼                 ▼
                    MÁQUINA          MATERIAL          QUALIDADE
                       └─────────────────┼─────────────────┘
                                         ▼
                                 EMBALAGEM / ENVIO
                                         │
                                         ▼
                                  CUSTO + HISTÓRICO
```

## 4.3 Princípios arquiteturais

1. **Uma fonte por estado:** `orders.status` continua sendo a macroetapa oficial.
2. **Estados especializados nas entidades certas:** pagamento em pagamento; aprovação em aprovação; impressão em job; tracking em envio.
3. **Bloqueio é condição transversal:** não criar uma coluna para cada problema.
4. **Evento auditável:** toda transição relevante registra quem, quando, anterior, novo e motivo.
5. **Idempotência em integrações:** o mesmo evento externo não cria dois pedidos nem duas transições.
6. **Snapshot operacional:** preço, briefing, endereço, versão e custo usados no pedido não podem depender apenas do cadastro atual.
7. **Permissão no servidor:** dados financeiros e arquivos sensíveis não são protegidos apenas por interface.
8. **Progressive enhancement:** começar com registro manual confiável; automatizar quando o evento e a exceção estiverem comprovados.

## 4.4 Fonte única de verdade por domínio

| Informação | Fonte autoritativa | Cópia útil no GAEVA OS | Regra de conflito |
|---|---|---|---|
| Lead, conversa e etapa pré-venda | Kommo | ID, origem, vendedor, produto, resumo e resultado | Kommo vence antes do handoff |
| Contato pré-venda | Kommo | Cliente vinculado/snapshot | Vincular por ID externo; não casar só por nome |
| Cliente operacional | GAEVA OS | Registro canônico pós-venda | Alterações de entrega ficam no pedido; contato pode sincronizar ao CRM |
| Pedido | GAEVA OS | — | Nunca manter status operacional paralelo no CRM |
| Pagamento liquidado | Provedor/financeiro | Estado, valor, data e referência | Provedor vence; ajuste manual exige auditoria |
| Briefing e arquivos do pedido | GAEVA OS/Storage | — | WhatsApp é canal de entrada, não arquivo mestre |
| Aprovação | GAEVA OS | Evidência de canal externo | Só versão vigente aprovada libera produção |
| Produção e qualidade | GAEVA OS | — | Máquina/fatiador executam, OS registra compromisso e resultado |
| Etiqueta e eventos de trânsito | Transportadora | Shipment, tracking e marcos | Transportadora vence nos eventos; OS mantém contexto e exceção |
| Custos gerenciais | GAEVA OS | Exportação ao financeiro | Ajuste preserva versão e autoria |
| Contabilidade, caixa e fiscal | Sistema externo | Totais/referências úteis | Sistema financeiro/contábil vence |
| Mídia e spend | Meta/Google | IDs e custo importado/agregado | Plataforma de mídia vence; OS relaciona a margem |
| Orquestração | n8n | Logs/referências | n8n nunca é fonte do estado de negócio |

## 4.5 Dados essenciais do pedido

| Domínio | Dados | Situação/recomendação |
|---|---|---|
| Identidade | ID, código, cliente, IDs externos, autoria | Reutilizar `orders`/`customers` |
| Origem | canal, campanha, UTM, criativo, vendedor, lead Kommo | Estender por vínculo, sem replicar CRM inteiro |
| Comercial | itens, quantidade, preço, desconto, frete, condição, comissão | Parte existe; estruturar múltiplos itens e descontos |
| Financeiro operacional | total, entrada, saldo, status, data/referência de confirmação | Parte existe; não chamar de conciliação |
| Compromisso | venda, evento, prazo prometido, prazo interno, prioridade e motivo | Parte existe; prazo interno/risco precisam disciplina |
| Briefing | template/version, respostas, pendências, validador e data | Estruturar sem criar form builder genérico |
| Arquivos | categoria, item, versão, etapa, autor, hash/metadado e vigente | Estender `order_files` só no necessário |
| Design | designer, início/fim, revisões, versão final | Reutilizar atribuições/aprovações/histórico |
| Produção | jobs/lotes, máquina, material/cor, peso/tempo estimado e real | Reutilizar `production_jobs`; completar dados |
| Qualidade | gate, resultado, não conformidade, evidência e responsável | Persistir via eventos primeiro; entidade própria só com volume |
| Expedição | endereço-snapshot, serviço, etiqueta, rastreio, postagem, entrega | Parte existe; eventos e integração depois |
| Economia | componentes previstos/reais, perdas, margem e contribuição | Criar modelo mínimo quando coleta estiver definida |
| Governança | próximo responsável, bloqueio, SLA, timeline e audit log | Muito já existe; centralizar exceções e regras |

## 4.6 Kanban geral e filas departamentais

Manter o **Kanban geral atual** como visão de fluxo e handoff. Não criar Kanbans com estados independentes.

Usar filas especializadas sobre os mesmos dados:

- Design: trabalhos aguardando designer, em modelagem, revisão e alteração.
- Aprovação: versões enviadas, tempo aguardando cliente e revisões.
- Produção: jobs/lotes por máquina, prioridade, material e janela.
- Qualidade/Expedição: itens prontos, conferência, embalagem e postagem.

Em baixo volume, essas filas podem ser filtros salvos e modos da tela existente. Só devem virar telas próprias quando a densidade de ações justificar.

---

# PARTE 5 — GAP ANALYSIS

| Módulo | Recurso | Hoje | Como funciona atualmente | Como deveria funcionar | Problema resolvido | Impacto | Prioridade | Complexidade | Dependências |
|---|---|---|---|---|---|---|---|---|---|
| Adoção | Jornada real por papel | PARCIAL | Testes técnicos; somente dois pedidos no snapshot | Homologação E2E com cenários normais e exceções | Evita confiar em fluxo não usado | Muito alto | N1 | Média | Usuários reais, roteiro e ambiente |
| Pedido | Fonte única da macroetapa | EXISTE | `orders.status` alimenta as visões | Preservar e documentar contrato | Evita divergência entre telas | Muito alto | N1 | Baixa | Nenhuma mudança estrutural |
| Pedido | Próxima ação e dono | PARCIAL | Responsáveis e ações contextuais existem | Todo ativo tem ação, dono e vencimento | Evita pedido parado | Muito alto | N1 | Média | Regras por etapa |
| Handoff | Kommo → pedido | NÃO EXISTE | Persistência comercial/shadow sem pedido automático comprovado | Evento idempotente cria rascunho/recebido com pendências | Evita redigitação e pedido incompleto | Muito alto | N1/N2 | Alta | Credenciais, contrato e go-live controlado |
| Cadastro | Atomicidade/recuperação | PARCIAL | Cliente, pedido, item e arquivo em múltiplas requisições | Retomada segura, idempotência e aviso de pendência | Evita duplicidade/órfãos | Alto | N1 | Média | Chave idempotente e testes |
| Briefing | Template por produto | NÃO EXISTE | Texto unificado e anexos | Campos mínimos por categoria e snapshot de versão | Evita briefing insuficiente | Muito alto | N1 | Média | Definição por 4–5 categorias |
| Briefing | Gate de completude | PARCIAL | Confirmação agrupada, sem estrutura persistida completa | Lista objetiva de faltas bloqueia avanço necessário | Reduz retrabalho | Muito alto | N1 | Média | Template e operação |
| Arquivos | Contexto e versão | PARCIAL | Arquivos privados ligados ao pedido | Ligar a item, etapa, versão e vigência | Evita arquivo errado | Alto | N1/N2 | Média | Convenção de categorias |
| Design | Fila e carga real | PARCIAL | Atribuição, “meus pedidos” e carga simplificada | Fila por categoria, prazo, estimativa e WIP | Evita sobrecarga invisível | Alto | N2 | Média | Estimativas e capacidade |
| Aprovação | Versão e decisão | EXISTE | Versão atual protege impressão | Preservar e melhorar evidência | Evita produzir versão errada | Muito alto | N1 | Baixa | Homologação |
| Aprovação | Confirmação externa | NÃO EXISTE | Pessoa interna registra a decisão | Link simples/token ou captura integrada com evidência | Evita aprovação perdida no WhatsApp | Alto | N2 | Média/Alta | Segurança, UX e canal |
| Produção | Job/tentativa | EXISTE | Jobs, estados, falhas e reimpressões | Tornar job/lote unidade explícita do planejamento | Suporta lotes e múltiplas máquinas | Muito alto | N1/N2 | Média | UX de produção |
| Produção | Estimado versus real | PARCIAL | Horas/material podem ser registrados | Campos mínimos obrigatórios por job concluído/falhado | Base para prazo, custo e capacidade | Muito alto | N1 | Média | Política de coleta |
| Impressoras | Cadastro e estado | EXISTE | Estado manual e vínculos | Manter manual no início | Dá visão básica sem telemetria cara | Alto | N1 | Baixa | Disciplina operacional |
| Capacidade | Agenda/horas disponíveis | NÃO EXISTE | Sem algoritmo de previsão | Calendário, horas comprometidas e buffer por falha | Evita promessas inviáveis | Muito alto | N3 | Alta | Estimativas confiáveis |
| Qualidade | Checkpoint persistido | PARCIAL | Confirmações agrupadas; checklist visual legado não persiste | Resultado, responsável, data, evidência e não conformidade | Reduz erro e retrabalho | Muito alto | N1 | Média | Definição de gates |
| Expedição | Postagem/rastreio | PARCIAL | Campos manuais no pedido | Fila acionável e eventos de rastreamento | Evita pedido pronto parado | Alto | N1/N2 | Média | Transportadora/canal |
| Clientes | Visão 360º | PARCIAL | Contatos, pedidos, valor e última compra | Origem, aprovações, arquivos úteis e LTV/margem | Melhora atendimento e retenção | Médio | N2 | Média | Identidade e métricas |
| Clientes | Deduplicação | NÃO EXISTE | Não comprovada | Normalizar telefone/e-mail, sugerir possível duplicata | Evita histórico fragmentado | Alto | N1/N2 | Média | IDs externos e regras humanas |
| Produto | Catálogo operacional mínimo | NÃO EXISTE | Categoria + item atendem hoje | Template de briefing, estimativas, materiais e instruções | Padroniza execução | Alto | N2 | Média | Produtos repetidos comprovados |
| Estoque | Insumos críticos | NÃO EXISTE | Sem estoque completo | Saldo simples e movimentos para filamentos/embalagens críticos | Evita parar por falta | Médio/alto | N3 | Média | Processo físico de entrada/saída |
| Custos | Componentes previstos/reais | NÃO EXISTE | Placeholders sem cálculo completo | Componentes auditáveis por pedido/job | Revela margem e perda | Muito alto | N2 | Alta | Estimativas, taxas e materiais |
| Financeiro | Estado operacional | PARCIAL | Total, entrada, saldo e status | Sincronizar/conferir, separar de contabilidade | Evita liberação indevida | Alto | N1/N2 | Média | Provedor/rotina financeira |
| Financeiro | DRE/caixa/contabilidade | NÃO NECESSÁRIO | Não existe | Integrar sistema externo; importar só referência/totais úteis | Evita criar ERP contábil | — | N5 | Alta | Sistema financeiro externo |
| Alertas | Exceções acionáveis | PARCIAL | Atenção e atalhos por condição | Severidade, dono, ação, prazo e supressão de ruído | Gestão encontra problema cedo | Muito alto | N1 | Média | Regras e SLA |
| SLA | Tempo na etapa | PARCIAL | Cálculo por timestamp/histórico | Meta por etapa/categoria e relógio ativo versus espera | Encontra gargalo real | Alto | N2 | Média | Calendário e motivos de espera |
| Dashboard | Central em 60 segundos | PARCIAL | Indicadores e listas limitadas | Priorizar exceções, trabalho de hoje e decisões | Orienta execução | Muito alto | N1 | Média | Próxima ação e SLA |
| Dashboard | Executivo | PARCIAL | Cohort por criação + estado atual | Métricas por evento, prazo, margem, WIP e qualidade | Melhora decisão | Alto | N2/N3 | Média | Definições e histórico |
| Auditoria | Timeline integrada | EXISTE | `order_history`, logs, aprovação e eventos | Preservar e melhorar filtros/eventos críticos | Responsabiliza sem depender de memória | Alto | N1 | Baixa | Homologação |
| Permissões | Papel e RLS | EXISTE | Cinco papéis e proteção no backend | Validar por cenário real | Reduz risco de acesso/alteração | Muito alto | N1 | Média | Matriz aprovada |
| Permissões | Sigilo de campos financeiros | PARCIAL | Leitura ampla pode expor valores | Views/RPC/policies por necessidade | Evita exposição indevida | Alto | N1/N2 | Média | Decisão organizacional |
| Performance | Centenas de pedidos | NÃO EXISTE | Lotes de 250 e renderização limitada; sem carga real | Teste, paginação server-side onde necessário e observabilidade | Evita colapso com escala | Alto | N3 | Alta | Massa segura e metas |
| Mobile | Ações de chão | PARCIAL | Navegação e “Mover para” existem | Homologar câmera, upload, falha, QC e postagem em aparelho real | Aumenta adesão | Alto | N1 | Média | Teste de campo |
| Busca | Global | NÃO EXISTE | Buscas por tela | Cliente, telefone, pedido, rastreio e arquivo | Reduz tempo de localização | Médio | N2 | Média | Índices e permissão |
| Integração | Pagamento | NÃO EXISTE | Estado manual | Webhook idempotente ou conferência assistida | Evita falso “pago” | Alto | N2 | Média | Provedor escolhido |
| Integração | Transportadora | NÃO EXISTE | Dados manuais | Criar/receber tracking e atualizar marcos | Reduz digitação e atraso | Médio/alto | N3 | Média | Transportadora predominante |
| Marketing | Receita e margem por origem | PARCIAL | Dados comerciais/eventos preparados | Vínculo lead → pedido → margem | Otimiza verba por lucro | Alto | N3/N4 | Alta | Handoff e custos |
| Resiliência | Backup/restore/runbook | NÃO EXISTE | Não há evidência de política validada no inventário | Política testada e procedimento de incidente | Evita perda/paralisação | Muito alto | N1 | Média | Infraestrutura e responsáveis |

---

# PARTE 6 — MÓDULOS NECESSÁRIOS

## 6.1 Central operacional

| Aspecto | Definição |
|---|---|
| Objetivo | Permitir que a operação identifique em menos de 60 segundos o que exige ação, decisão ou replanejamento |
| Usuários | Administração, Gerência/Operação, Produção; visões pessoais para Comercial e Designer |
| Dados | Pedido, etapa, dono, próxima ação, prazo, tempo na etapa, bloqueio, aprovação, job, máquina e postagem |
| Ações | Assumir, atribuir, cobrar informação, replanejar, abrir pedido, registrar decisão, resolver/justificar exceção |
| Regras | Exceção deve ter severidade, responsável, causa, prazo e ação; não mostrar alerta sem caminho de resolução |
| Integrações | Somente eventos já consolidados no OS; notificações externas são canal secundário |
| Indicadores | Atrasados, em risco, sem dono, sem próxima ação, aguardando cliente, falhas, prontos não postados e WIP por etapa |
| Nível | N1 — refatorar o painel atual, não criar dashboard decorativo paralelo |

Layout recomendado:

1. **Faixa crítica:** prazo vencido, falha, item bloqueado e pedido sem responsável.
2. **Hoje:** ações que vencem hoje, impressões a iniciar/concluir e postagens.
3. **Esperas externas:** cliente, pagamento, arquivo e transportadora, cada uma com idade e próximo contato.
4. **Carga:** WIP por etapa, designer e impressora, com excesso destacado.
5. **Decisões:** urgências, mudança de prazo, margem abaixo do mínimo e reimpressões que precisam autorização.

## 6.2 Pedidos e workflow

| Aspecto | Definição |
|---|---|
| Objetivo | Ser o registro único do compromisso com o cliente e do andamento macro |
| Usuários | Todos, com ações diferentes por papel |
| Dados | Cliente, itens, valores, pagamento, datas, promessa, prioridade, etapa, responsável, bloqueio e vínculos externos |
| Ações | Criar, validar, assumir, atribuir, avançar, retroceder justificadamente, alterar escopo, cancelar e concluir |
| Regras | Uma macroetapa; transições por `operate_order`; campos sensíveis protegidos; alteração de escopo reabre gates afetados |
| Integrações | Entrada do Kommo, pagamento, transportadora e eventos de atribuição |
| Indicadores | WIP, idade, lead time, aderência ao prazo, retrabalho, throughput e pedidos por categoria |
| Nível | N1 |

O card geral continua representando um pedido. Itens e jobs aparecem dentro do pedido; não viram cards concorrentes no Kanban geral.

## 6.3 Briefing e arquivos

| Aspecto | Definição |
|---|---|
| Objetivo | Garantir que design e produção recebam informação suficiente, válida e rastreável |
| Usuários | Comercial coleta; Operação valida; Designer e Produção consomem; cliente pode contribuir por canal externo |
| Dados | Categoria, versão do template, respostas, faltas, validador, data, arquivos, item, categoria de arquivo e versão |
| Ações | Preencher, anexar, classificar, solicitar complemento, validar, substituir e marcar versão vigente |
| Regras | Campos mínimos variam por categoria; arquivo obrigatório tem categoria; completude libera somente a etapa aplicável |
| Integrações | WhatsApp/Kommo pode encaminhar dados; Storage permanece a fonte dos arquivos do pedido |
| Indicadores | Tempo até briefing completo, taxa de devolução, campos ausentes e retrabalho causado por briefing |
| Nível | N1 |

Primeiros templates, sem construtor genérico:

| Categoria | Mínimo recomendado |
|---|---|
| Pet personalizado | Fotos adequadas, nome, estilo/acabamento, pose/acessórios relevantes, tamanho/variante, quantidade e prazo |
| Mascote/corporativo | Logo/manual, referências, aplicação/finalidade, pose, cores, dimensões, quantidade, evento e aprovador |
| Chaveiro | Logo/arte, quantidade, medida, frente/verso, cores, ferragem/embalagem, evento e prazo |
| Estatueta/busto | Referências, estilo, pose, dimensão, acabamento, base/acessórios, quantidade e prazo |
| Outros | Descrição, referências, dimensão, quantidade, material/acabamento desejado, uso e prazo; validação humana obrigatória |

O template usado deve ser copiado como snapshot para o pedido. Atualizar o template do catálogo não pode alterar retrospectivamente um briefing aprovado.

## 6.4 Design 3D e revisão interna

| Aspecto | Definição |
|---|---|
| Objetivo | Controlar fila, capacidade, versão, tempo ativo e retrabalho dos designers |
| Usuários | Designer, Operação/Gerência e Administração |
| Dados | Atribuição, categoria, estimativa, início/fim, prioridade, revisões, motivo de retorno, arquivos e versão |
| Ações | Atribuir, iniciar, pausar com motivo, enviar para revisão, corrigir e preparar aprovação |
| Regras | Designer vê prioritariamente atribuídos; limite de WIP; retorno deve apontar requisito/versão; revisão interna antes do cliente quando necessária |
| Integrações | Ferramentas 3D continuam externas; apenas arquivos finais/renders e metadados entram no OS |
| Indicadores | Fila, WIP, tempo ativo, tempo de espera, first-pass yield, revisões e prazo por categoria/designer |
| Nível | N1 para fila/versão; N2 para capacidade refinada |

Produtividade não deve ser medida apenas por quantidade de pedidos, porque complexidade varia. Começar comparando tempo previsto versus real por categoria/faixa de complexidade.

## 6.5 Aprovação

| Aspecto | Definição |
|---|---|
| Objetivo | Provar qual versão foi enviada, o que o cliente decidiu e qual versão está liberada |
| Usuários | Comercial/Atendimento, Designer, Operação; cliente via link futuro |
| Dados | Versão, arquivo/render, envio, canal, destinatário, decisão, comentário, data e ator |
| Ações | Enviar, lembrar, aprovar, solicitar alteração, rejeitar, reenviar e encerrar versão |
| Regras | Só versão vigente aprovada libera impressão; alteração cria revisão; aprovação verbal exige registro e evidência de quem confirmou |
| Integrações | WhatsApp/e-mail para envio; link externo simples posteriormente |
| Indicadores | Tempo aguardando cliente, revisões por pedido, taxa de aprovação na primeira versão e atrasos causados por aprovação |
| Nível | N1 para homologar registro interno; N2 para link externo |

O primeiro avanço não precisa ser um portal com login. Um link de uso único, escopo restrito e validade controlada pode resolver aprovação/reprovação com muito menos complexidade.

## 6.6 Produção e trabalhos de impressão

| Aspecto | Definição |
|---|---|
| Objetivo | Planejar e registrar cada lote/tentativa que transforma um item aprovado em unidade física |
| Usuários | Produção, Gerência e Administração |
| Dados | Pedido/item, lote, quantidade, arquivo de impressão, máquina, material/cor, estimativas, início/fim, operador, estado, resultado e tentativa anterior |
| Ações | Preparar, enfileirar, atribuir máquina, iniciar, pausar, concluir, falhar, reimprimir, dividir ou juntar lote |
| Regras | Aprovação vigente; máquina disponível; arquivo/material corretos; falha encerra tentativa; reimpressão cria nova tentativa ligada |
| Integrações | Fatiador e máquinas permanecem externos; importação de estimativas pode vir depois |
| Indicadores | Horas previstas/reais, ocupação, falhas, rendimento, fila, conclusão no prazo e utilização por máquina |
| Nível | N1 para disciplina de jobs; N3 para planejamento avançado |

## 6.7 Impressoras e capacidade

| Aspecto | Definição |
|---|---|
| Objetivo | Mostrar disponibilidade, compromissos e impacto de indisponibilidade sem virar MES industrial |
| Usuários | Produção, Gerência e Administração |
| Dados | Máquina, tecnologia, compatibilidades, estado, calendário, manutenção, jobs, horas e buffer |
| Ações | Reservar, reordenar fila, marcar indisponibilidade, iniciar/finalizar manutenção e transferir job |
| Regras | Estado manual confiável primeiro; reserva não equivale a impressão iniciada; manutenção reduz capacidade disponível |
| Integrações | Telemetria apenas se uma API estável provar benefício |
| Indicadores | Horas disponíveis, comprometidas e ociosas; utilização; falha; atraso por máquina; data mais cedo de início |
| Nível | N1 cadastro/estado já existente; N3 calendário e previsão |

Cálculo inicial de capacidade por período:

```text
horas_disponíveis = horas_de_calendário
                    − manutenção planejada
                    − indisponibilidade
                    − buffer operacional

horas_comprometidas = soma do tempo restante estimado dos jobs válidos

ocupação = horas_comprometidas / horas_disponíveis

folga = horas_disponíveis − horas_comprometidas
```

Aplicar fatores separados por tecnologia/material/categoria somente depois de existir histórico real. Não mascarar baixa qualidade dos dados com um algoritmo sofisticado.

## 6.8 Pós-produção, qualidade e embalagem

| Aspecto | Definição |
|---|---|
| Objetivo | Evitar enviar peça, quantidade, acabamento, acessório ou embalagem incorretos |
| Usuários | Produção, Qualidade/Expedição e Gerência |
| Dados | Gate, item/lote, critérios, resultado, evidência, não conformidade, causa, responsável e resolução |
| Ações | Conferir, aprovar, rejeitar, encaminhar a retrabalho/reimpressão e liberar embalagem/postagem |
| Regras | Checkpoints poucos e específicos por produto; falha abre ação corretiva; conclusão preserva snapshot do checklist |
| Integrações | Câmera do celular para evidência quando necessário |
| Indicadores | First-pass yield, não conformidades, retrabalho, reimpressão, custo da não qualidade e causa |
| Nível | N1 |

Checkpoints mínimos:

1. Antes de enviar render ao cliente: versão, identidade e requisitos críticos.
2. Antes de imprimir: arquivo aprovado, escala, quantidade, material/cor e orientação/configuração conferidos.
3. Antes de embalar: peça, quantidade, acabamento, acessórios e integridade.
4. Antes de postar: destinatário, endereço, serviço, conteúdo e rastreio.

## 6.9 Expedição e entrega

| Aspecto | Definição |
|---|---|
| Objetivo | Fazer produto pronto virar postagem e entrega sem fila invisível |
| Usuários | Expedição/Produção, Comercial/Atendimento e Gerência |
| Dados | Endereço-snapshot, CEP, serviço, transportadora, etiqueta, tracking, postagem, previsão, eventos e exceções |
| Ações | Conferir endereço, embalar, gerar/registrar etiqueta, postar, acompanhar, tratar atraso/retorno e confirmar entrega |
| Regras | Pedido pronto tem prazo de postagem; tracking ausente é pendência; exceção logística não volta para impressão |
| Integrações | Transportadora/agregador e comunicação ao cliente |
| Indicadores | Tempo pronto→postado, postagens atrasadas, entregas no prazo, retorno e custo de frete/reenvio |
| Nível | N1 para fila manual; N3 para integração |

## 6.10 Clientes

| Aspecto | Definição |
|---|---|
| Objetivo | Reunir contexto operacional pós-venda sem copiar a caixa de entrada do CRM |
| Usuários | Comercial, Operação, Administração e atendimento autorizado |
| Dados | Identidade, IDs externos, contatos, pedidos, endereços usados, arquivos reutilizáveis autorizados, aprovações e valor/margem agregados |
| Ações | Criar, editar, vincular possível duplicata, consultar histórico e iniciar contato externo |
| Regras | Telefone normalizado e ID externo; merge somente humano e auditado; endereço do pedido é snapshot |
| Integrações | Kommo para identidade/vínculo e WhatsApp por link |
| Indicadores | Pedidos, recorrência, ticket, margem, última compra, LTV e problemas pós-venda |
| Nível | N2, com deduplicação básica em N1/N2 |

## 6.11 Catálogo operacional de produtos

| Aspecto | Definição |
|---|---|
| Objetivo | Padronizar briefings, estimativas, instruções e metas para ofertas recorrentes |
| Usuários | Comercial, Operação, Design e Administração |
| Dados | Categoria, nome/SKU opcional, variante, preço de referência, briefing, etapas, estimativas, materiais, SLA e margem mínima |
| Ações | Ativar/desativar, versionar template e atualizar referências |
| Regras | Só criar produto estruturado quando houver repetição; pedido preserva snapshot; “Outros” continua possível com revisão |
| Integrações | CRM pode usar chave comum de produto; financeiro recebe agrupamento |
| Indicadores | Volume, prazo, custo, margem, falha e revisão por produto |
| Nível | N2 |

Não começar com hierarquia complexa de SKU, BOM e variações combinatórias. Um catálogo mínimo das ofertas recorrentes já resolve a maior parte do problema.

## 6.12 Custos, margem e financeiro operacional

| Aspecto | Definição |
|---|---|
| Objetivo | Medir rentabilidade do pedido e tornar perdas/reimpressões economicamente visíveis |
| Usuários | Administração e Gerência; Comercial vê apenas o necessário |
| Dados | Receita, desconto, taxas, comissão, material, máquina, design, acabamento, embalagem, frete subsidiado, perdas, reembolso e CPA atribuído |
| Ações | Estimar, importar, lançar ajuste, fechar custo e comparar previsto/real |
| Regras | Componentes e fonte auditáveis; custo real não sobrescreve estimativa; DRE legal continua externa |
| Integrações | Pagamento, mídia e sistema financeiro/contábil |
| Indicadores | Custo, margem bruta, contribuição, desvio, custo de falha e margem por produto/origem |
| Nível | N2 |

Definições recomendadas:

```text
receita_líquida_operacional = valor_do_pedido
                              − descontos
                              − reembolsos
                              − impostos/taxas definidos

custo_direto = material + máquina + design + acabamento
               + embalagem + comissão + perdas/reimpressão
               + frete_subsidiado + taxa_de_pagamento

margem_bruta_gerencial = receita_líquida_operacional − custo_direto

margem_de_contribuição = margem_bruta_gerencial − CPA atribuível
                         − demais custos variáveis definidos
```

O custo de máquina deve ser política gerencial versionada, não “número mágico”: depreciação/vida útil, energia, manutenção e disponibilidade planejada podem compor uma taxa por hora.

## 6.13 Estoque mínimo

| Aspecto | Definição |
|---|---|
| Objetivo | Evitar paralisação por falta de filamento, resina, caixa ou insumo crítico |
| Usuários | Produção, Compras/Administrativo e Gerência |
| Dados | Material, unidade, cor/tipo, lote opcional, saldo, mínimo, custo médio, movimento e motivo |
| Ações | Entrada, consumo, ajuste, perda e reserva simples |
| Regras | Começar pelos poucos insumos críticos; movimento gera saldo; ajuste exige motivo |
| Integrações | Compras/financeiro apenas no futuro |
| Indicadores | Cobertura, itens abaixo do mínimo, consumo por categoria e perda |
| Nível | N3 |

Sem disciplina de apontamento físico, estoque sistêmico vira ficção. Antes do módulo, definir quem registra entrada, consumo, perda e inventário de conferência.

## 6.14 Comercial, atribuição e inteligência

| Aspecto | Definição |
|---|---|
| Objetivo | Preservar no pedido a origem e o contexto econômico do lead sem replicar o Kommo |
| Usuários | Comercial, Marketing e Administração |
| Dados | IDs Kommo, origem, campanha, criativo, UTM, vendedor, produto, orçamento, resultado e motivo de perda |
| Ações | Handoff, consultar contexto, reconciliar vínculo e devolver marcos de qualidade/venda |
| Regras | IA pode classificar/sugerir; não confirma pagamento nem marca ganho/perdido sozinha; handoff idempotente |
| Integrações | Kommo → n8n → Supabase/GAEVA OS; Meta/Google recebem eventos autorizados |
| Indicadores | Conversão, ticket, receita e margem por origem/produto/vendedor; tempo até orçamento/fechamento |
| Nível | N2 para handoff; N3/N4 para margem por campanha e copiloto |

## 6.15 Equipe, responsabilidade e administração

| Aspecto | Definição |
|---|---|
| Objetivo | Garantir acesso mínimo, carga visível e responsabilidade inequívoca |
| Usuários | Administração, Gerência e cada integrante para seu perfil |
| Dados | Perfil, papel, vínculo, especialidade, capacidade, calendário, atribuições, sessões relevantes e auditoria |
| Ações | Criar/vincular/desativar acesso, atribuir, redistribuir e revisar carga |
| Regras | Desativação efetiva; acesso de terceiro só por admin; alterações de papel auditadas; financeiro por necessidade |
| Integrações | Supabase Auth |
| Indicadores | WIP, atrasos, carga/capacidade, tempo por categoria e distribuição |
| Nível | N1 para homologar; N3 para planejamento detalhado |

---

# PARTE 7 — FLUXO COMPLETO DO PEDIDO

| Passo | Ação | Tipo | Dono | Registro/gate |
|---|---|---|---|---|
| 1 | Lead entra e recebe origem/campanha | Automático | CRM/n8n | ID externo e atribuição |
| 2 | Comercial qualifica produto, quantidade e prazo | Humano assistido | Comercial | Contexto no Kommo |
| 3 | Orçamento e condição são negociados | Humano | Comercial | Valor, frete, validade e status |
| 4 | Pagamento/condição de faturamento é confirmado | Semiautomático | Comercial/Financeiro | Referência e estado; sem inferência da IA |
| 5 | Handoff cria pedido `received` uma única vez | Automático ou manual seguro | Comercial | Chave idempotente e pendências explícitas |
| 6 | Operação assume e revisa prazo/escopo | Humano | Produção/Operação | Responsável atual e prazo interno |
| 7 | Briefing é completado e validado | Humano assistido | Comercial + Operação | Snapshot do template e lista sem pendências críticas |
| 8 | Pedido entra em modelagem | Humano | Operação/Designer | Designer atribuído, estimativa e início |
| 9 | Designer produz versão | Humano, ferramenta externa | Designer | Arquivo/render versionado |
| 10 | Revisão interna verifica aderência | Humano | Designer/Operação | Aprovar internamente ou devolver com motivo |
| 11 | Versão é enviada ao cliente | Semiautomático | Comercial/Designer | Data, canal e versão |
| 12 | Cliente aprova ou pede alteração | Humano | Cliente; registro pelo time/link | Decisão vinculada à versão |
| 13 | Alteração retorna ao design | Semiautomático | Sistema + Designer | Revisão, motivo e impacto de prazo/escopo |
| 14 | Aprovação válida libera preparação | Automático como gate | GAEVA OS | Nunca escolhe máquina sozinho na fase inicial |
| 15 | Produção cria/divide jobs e estima | Humano assistido | Produção | Item, lote, arquivo, material, peso e horas |
| 16 | Job é enfileirado e atribuído a máquina | Humano | Produção | Ordem, máquina e previsão |
| 17 | Impressão inicia e termina/falha | Humano com timestamps | Produção | Tempo real, consumo, operador e resultado |
| 18 | Falha gera causa e decisão de reimpressão | Humano | Produção/Gerência | Tentativa encerrada e custo de perda |
| 19 | Pós-produção/acabamento é executado | Humano | Produção | Tempo, observação e item concluído |
| 20 | Qualidade libera ou abre não conformidade | Humano | Produção/Qualidade | Gate persistido e evidência quando útil |
| 21 | Embalagem e endereço são conferidos | Humano | Expedição | Snapshot de checklist |
| 22 | Etiqueta/rastreio é registrado | Semiautomático | Expedição | Shipment e data de postagem |
| 23 | Tracking atualiza marcos e exceções | Automático quando integrado | Transportadora/n8n | Eventos idempotentes |
| 24 | Entrega é confirmada | Automático ou manual | Expedição | Data e situação de entrega |
| 25 | Pedido é encerrado | Humano assistido | Operação | Custos mínimos, exceções e pendências fechadas |

## Gates obrigatórios

- **Entrada na modelagem:** briefing mínimo, referências utilizáveis, item/quantidade e prazo aceitos.
- **Envio ao cliente:** versão identificada e revisão interna requerida concluída.
- **Entrada em produção:** versão vigente aprovada, item/quantidade definidos e condição financeira autorizada.
- **Início de job:** máquina, arquivo, material/cor e estimativa preenchidos.
- **Saída da impressão:** resultado e tempo real; se falha, causa e destino.
- **Liberação para postagem:** todos os itens/quantidades conformes, embalagem e endereço conferidos.
- **Finalização:** postagem registrada; política decide se encerra em postado ou entregue, mas a definição não pode variar por usuário.

---

# PARTE 8 — MÁQUINA DE STATUS

## 8.1 Estados recomendados

A máquina atual já possui granularidade suficiente. Não criar todos os estados citados no briefing como novos valores. Preservar os estados abaixo e tornar gates/condições explícitos.

| Status | Significado | Responsável padrão | Entrada | Saída | SLA inicial a definir | Bloqueios/alertas típicos | Próxima ação |
|---|---|---|---|---|---|---|---|
| `received` | Handoff comercial recebido | Comercial/Operação | Pedido criado | Operação assume | Curto | Sem dono, duplicidade, prazo ausente | Assumir e validar |
| `briefing_pending` | Confirmação e briefing | Operação + Comercial | Pedido assumido | Briefing válido | Por categoria | Cliente/arquivo/pagamento/prazo | Completar ou declarar espera |
| `modeling` | Trabalho ativo ou fila do designer | Designer | Gate de briefing | Versão pronta | Por categoria/complexidade | Sem designer, WIP, arquivo ruim | Modelar |
| `internal_review` | Revisão antes do cliente | Designer/Operação | Versão criada | Aprovar ou devolver | Curto | Requisito não atendido | Revisar |
| `awaiting_customer_approval` | Cliente decide sobre versão | Comercial | Versão enviada | Aprovar ou solicitar mudança | Calendário de follow-up | Cliente sem resposta | Acompanhar |
| `approved_for_production` | Aprovação válida, preparação | Produção | Versão vigente aprovada | Jobs prontos para fila | Curto | Arquivo/material/condição financeira | Preparar jobs |
| `print_queue` | Jobs aguardam execução | Produção | Job planejado | Iniciar job | Conforme promessa | Máquina/material indisponível | Priorizar/iniciar |
| `printing` | Há job em execução | Produção | Máquina e arquivo confirmados | Concluir ou falhar | Tempo estimado + tolerância | Execução excedida, pausa/falha | Monitorar/registrar |
| `finishing` | Acabamento/pós-processo | Produção | Impressões necessárias concluídas | Encaminhar a QC | Por produto | Material/pessoa pendente | Finalizar acabamento |
| `quality_control` | Verificação de conformidade | Produção/Qualidade | Item pronto | Aprovar ou corrigir | Curto | Não conformidade | Conferir/decidir |
| `packaging` | Preparação final | Produção/Expedição | QC aprovado | Liberar postagem | Curto | Endereço/item/acessório | Embalar/conferir |
| `shipping` | Pronto para postar/postado em acompanhamento | Expedição | Embalado | Concluir conforme política | Postagem no mesmo/próximo ciclo | Sem tracking, atraso, retorno | Postar/acompanhar |
| `completed` | Compromisso operacional encerrado | Operação | Critério de conclusão satisfeito | Terminal | — | Pendência/custo não consolidado | Nenhuma |
| `cancelled` | Encerrado sem entrega integral | Comercial/Admin | Decisão autorizada | Terminal | — | Reembolso/insumo já consumido | Resolver financeiro/preservar histórico |

## 8.2 Dimensões paralelas — não virar colunas

| Dimensão | Valores exemplificativos | Entidade correta |
|---|---|---|
| Pagamento | pendente, parcial, pago, faturado, vencido, reembolsado, cancelado | Pedido/pagamento |
| Bloqueio | aguardando cliente, arquivo, pagamento, decisão, material, máquina, terceiro | Pedido ou item, com motivo/dono/data |
| Aprovação | pendente, aprovada, alteração solicitada, rejeitada | `approvals` por versão |
| Job | fila, executando, pausado, falhou, concluído, cancelado | `production_jobs` |
| Prioridade | normal, prioridade, urgente; crítico legado | Pedido, com motivo |
| Risco de prazo | regular, atenção, risco, vencido | Derivado de prazo/capacidade, não editado manualmente |
| Entrega | pronto, etiqueta, postado, em trânsito, entregue, exceção, retornado | Shipment/eventos de envio |

## 8.3 Transições excepcionais

- Retrocesso exige motivo e identifica o gate invalidado.
- Mudança de briefing após aprovação invalida apenas as aprovações afetadas e reestima o pedido.
- Falha de job não move automaticamente todo o pedido para trás se outro lote continua válido.
- Administrador pode executar exceções, mas não ignorar aprovação vigente, auditoria ou integridade financeira definida.
- Bloquear pausa o relógio de execução somente para motivos externos aprovados; não apaga o atraso nem o tempo total.
- Cancelamento preserva pedido, arquivos, jobs, custos e motivo; nunca apaga o histórico.

## 8.4 SLA

Cada etapa precisa de três medidas diferentes:

1. **Tempo decorrido:** relógio total desde a entrada.
2. **Tempo ativo:** tempo sob controle da equipe GAEVA.
3. **Tempo de espera externa:** cliente, pagamento, transportadora ou fornecedor.

Metas devem começar por categoria e etapa, com poucos valores administrados centralmente. Um editor genérico de SLA não é necessário no N1; uma configuração controlada e auditável é suficiente.

---

# PARTE 9 — TELAS

| Tela | Situação | Objetivo | Informações | Ações | Filtros | Indicadores | Usuários |
|---|---|---|---|---|---|---|---|
| Central operacional | Evoluir `/` | Decidir o trabalho do dia | Exceções, hoje, esperas, carga e decisões | Assumir, atribuir, resolver, replanejar | Dono, gravidade, etapa, prazo | Atrasados, em risco, sem dono, falhas, prontos sem postagem | Operação/Admin |
| Meu trabalho | Modo/filtro, não necessariamente rota nova | Fila pessoal acionável | Ações, vencimento, contexto e bloqueio | Concluir ação, pedir ajuda, reatribuir autorizado | Hoje, atrasado, tipo, prioridade | Pendentes e vencidas por pessoa | Todos operacionais |
| Pedidos | Existe | Consultar e operar em lote leve | Cabeçalho, prazo, dono, risco e etapa | Abrir e executar ações rápidas permitidas | Os filtros atuais + risco/bloqueio | Ativos, filtrados e valor/horas quando permitido | Todos conforme acesso |
| Novo pedido/handoff | Existe; evoluir | Criar sem duplicidade e mostrar pendências | Cliente, itens, comercial, prazo e briefing | Salvar/retomar, verificar duplicata, anexar | Busca de cliente/lead existente | Completude e possíveis duplicatas | Comercial |
| Detalhe do pedido | Existe; consolidar | Fonte completa do caso | Resumo, itens, briefing, arquivos, design, produção, custos, envio e timeline | Ações contextuais e alteração auditada | Timeline por evento/área | Prazo, completude, custo e progresso | Conforme papel |
| Kanban geral | Existe | Visão ponta a ponta | Um card por pedido e macroetapa | Arrastar/mover, abrir drawer e agir | Responsável, designer, vendedor, produto, prazo, prioridade, etapa e período | Contagem, atraso, idade e gargalo simples | Operação/Admin; demais limitados |
| Fila de design | Pode ser modo do Kanban | Gerir WIP e prazos do design | Estimativa, idade, revisões, prioridade e arquivos | Atribuir, iniciar, pausar, enviar revisão | Designer, categoria, SLA, revisão | Fila em horas, WIP, atraso e first-pass | Designer/Operação |
| Aprovações | Modo/fila | Controlar espera do cliente | Versão, envio, tempo, follow-up e decisão | Enviar, lembrar, registrar decisão | Cliente, vendedor, idade, resultado | Pendentes, tempo de espera e revisões | Comercial/Designer |
| Portal/link de aprovação | Novo N2 | Capturar decisão externa | Render, versão, resumo e comentário | Aprovar ou pedir alteração | Não aplicável ao cliente | Decisão/tempo registrados internamente | Cliente |
| Produção | Existe; definir papel | Planejar jobs/lotes e execução | Fila, máquina, material, horas, arquivo e estado | Dividir, atribuir, iniciar, pausar, falhar, concluir | Máquina, material, estado, prazo, prioridade | Fila em horas, execução, falha e utilização | Produção |
| Agenda de máquinas | Novo N3 | Ver capacidade por janela | Máquina, calendário, jobs, manutenção e folga | Reordenar, reservar e indisponibilizar | Máquina, tecnologia, período | Disponível, comprometido, folga e atraso | Produção/Gerência |
| Qualidade | Modo do pedido/produção N1 | Executar gates e tratar não conformidade | Critérios, item, lote, evidência e causa | Aprovar, rejeitar, retrabalhar/reimprimir | Gate, produto, causa, responsável | First-pass, não conformidade e retrabalho | Produção/Qualidade |
| Expedição | Fila/modo N1 | Evitar pronto sem postagem | Endereço, embalagem, serviço, tracking e prazo | Conferir, registrar etiqueta/postagem, tratar exceção | Hoje, atrasado, transportadora, tracking | Prontos, postados no prazo e exceções | Expedição |
| Clientes | Existe | Buscar cliente | Identidade, contato, cidade, pedidos | Buscar, criar e editar | Nome, empresa, cidade, telefone | Clientes, recorrentes e duplicatas prováveis | Comercial/Admin |
| Cliente 360º | Existe; evoluir | Contexto pós-venda | Pedidos, arquivos relevantes, aprovações, ticket, margem e origem | Editar, vincular duplicata e contatar | Período, produto, situação | Ticket, recorrência, LTV, margem e problemas | Comercial/Admin |
| Impressoras | Existe | Estado básico e manutenção | Situação, job atual, fila e horas | Alterar estado, abrir fila/manutenção | Estado, tecnologia, período | Utilização, fila, falha e indisponibilidade | Produção |
| Produtos/templates | Novo N2 | Padronizar ofertas recorrentes | Briefing, estimativas, instruções, preço/margem | Versionar, ativar/desativar | Categoria, ativo, margem | Volume, prazo, falha e margem por produto | Admin/Operação |
| Custos do pedido | Evoluir detalhe N2 | Explicar margem | Componentes previstos/reais e desvios | Lançar, importar, justificar e fechar | Componente, fonte, previsto/real | Custo, desvio, margem e completude | Admin/Gerência |
| Estoque mínimo | Novo N3 | Controlar insumos críticos | Saldo, mínimo, custo, movimentos e reservas | Entrada, consumo, perda e ajuste | Material, cor, abaixo do mínimo | Cobertura, ruptura, consumo e perda | Produção/Admin |
| Equipe | Existe; evoluir | Acesso, carga e capacidade | Papel, vínculo, WIP, atraso, capacidade | Criar/desativar acesso, redistribuir | Papel, ativo, especialidade, carga | WIP, atraso, carga/capacidade | Admin/Gerência |
| Dashboard executivo | Novo modo N2/N3 | Decidir sobre margem, prazo e capacidade | Receita, margem, throughput, qualidade, capacidade e origem | Abrir drill-down e comparar | Período, categoria, canal, responsável | KPIs executivos definidos na Parte 13 | Owner/Admin |
| Busca global | Novo N2 | Encontrar qualquer contexto autorizado | Pedido, cliente, telefone, tracking e arquivo | Abrir resultado no contexto | Tipo e estado do objeto | Tempo/resultado de busca, opcional | Conforme permissão |
| Configurações operacionais | Evoluir | Regras simples e auditáveis | SLAs, motivos, templates, margens mínimas e integrações | Editar e versionar | Tipo, vigência, ativo | Regras ativas e alterações recentes | Admin |
| Auditoria | Evoluir histórico/configuração | Investigar mudança sensível | Ator, objeto, antes/depois, data e motivo | Exportar conforme autorização | Ator, objeto, ação, período | Alterações críticas e exceções | Admin/Auditoria |

### Requisitos de UX operacional

- A ação principal de cada etapa deve aparecer no card/drawer sem caça ao botão.
- Status precisa vir acompanhado da próxima ação, não apenas cor.
- Mostrar idade na etapa e prazo em data/hora legível.
- No celular, priorizar assumir, anexar foto, iniciar/concluir/falhar job, conferir e postar.
- Ações em lote só para operações reversíveis ou de baixo risco; nunca aprovação, pagamento ou conclusão cega.
- Filtros frequentes devem poder ser salvos por função.
- Tabelas densas no desktop; cartões de ação no mobile.

---

# PARTE 10 — BANCO DE DADOS

## 10.1 Entidades atuais: manter

Todas as 12 tabelas centrais devem ser reaproveitadas. Não criar `kanban_orders`, `designers`, `kanban_users`, `kanban_files`, `order_history_v2` ou cadastros equivalentes.

| Tabela atual | Direção |
|---|---|
| `profiles` | Manter identidade/papel; avaliar claims e desativação real |
| `team_members` | Manter pessoa/capacidade; ajustar modelo de capacidade quando houver dados |
| `customers` | Manter cliente operacional; adicionar IDs externos e normalização apenas se ausentes |
| `orders` | Manter agregado e macrostatus; não acumular cada estado especializado em novas colunas |
| `order_items` | Usar para múltiplos entregáveis e lotes relacionados |
| `order_files` | Estender metadados de item/versão/vigência se a lacuna for confirmada |
| `order_assignments` | Manter atribuições por função e vigência |
| `approvals` | Manter decisões por versão; estender canal/evidência/token externo posteriormente |
| `printers` | Manter cadastro e estado manual |
| `production_jobs` | Consolidar como job/lote/tentativa, não criar tabela paralela de impressão |
| `production_events` | Usar para eventos e snapshot inicial de checkpoints |
| `audit_logs` | Manter imutável para papéis da aplicação e cobrir alterações críticas |

## 10.2 Modificações candidatas — somente após confirmar schema real

Estas são necessidades lógicas, não migrations aprovadas:

| Estrutura | Lacuna | Mudança mínima preferida |
|---|---|---|
| `orders` | Próxima ação, prazo interno, espera/bloqueio e vínculo externo podem não estar completos | Reusar campos existentes; adicionar somente atributos sem equivalente |
| `order_items` | Interface trabalha com item principal e pode faltar snapshot operacional | Expor múltiplos itens gradualmente e guardar especificação vendida |
| `order_files` | Pode faltar vínculo explícito a item/versão | Acrescentar FKs/metadados mínimos, sem sistema CAD |
| `approvals` | Falta prova de envio/decisão externa | Acrescentar canal, destinatário, enviado em, ator externo e evidência/token quando necessário |
| `production_jobs` | Precisa representar lote/quantidade/estimado versus real | Completar quantidade, arquivo vigente, peso/tempo previstos e reais se ausentes |
| `production_events` | Checkpoint atual não persiste granularidade suficiente | Registrar payload estruturado versionado do gate e não conformidade |
| `printers` | Capacidade futura | Adicionar calendário/manutenção apenas na Fase 5/necessidade de escala |
| `customers` | Duplicidade e CRM | Guardar IDs externos normalizados, sem sincronização bidirecional livre |

## 10.3 Novas entidades eventualmente justificáveis

| Entidade candidata | Quando criar | Por que uma tabela própria pode valer a pena | Nível |
|---|---|---|---|
| `product_templates` / `products` | Ofertas recorrentes e templates aprovados | Padronizar briefing, estimativas e instruções com versionamento | N2 |
| `briefing_snapshots` ou resposta estruturada equivalente | Quando JSON no pedido/item não oferecer histórico/consulta suficiente | Separar template vigente das respostas congeladas do pedido | N1/N2 |
| `shipments` e `shipment_events` | Múltiplos volumes, reenvios ou tracking integrado | Um pedido pode ter mais de um envio e exceções próprias | N3 |
| `order_cost_components` | Política de coleta e donos estiverem definidos | Componentes previstos/reais auditáveis e calculáveis | N2 |
| `materials` e `stock_movements` | Consumo físico disciplinado e escassez real | Saldo derivado de movimentos, custo médio e perdas | N3 |
| `printer_unavailability` / calendário | Várias máquinas e agendamento relevante | Manutenção e capacidade por janela | N3 |
| `operational_exceptions` | Quando exceções precisarem de ack, escalonamento e histórico próprio | Separar condição derivada de ocorrência gerenciada | N2/N3 |
| `external_event_receipts` | Handoff/pagamento/tracking em produção | Idempotência, retry, rastreabilidade e dead-letter | N2 |

## 10.4 O que não modelar agora

- BOM/MRP completo.
- Contas contábeis, plano de contas e lançamentos de DRE.
- Mensagens completas do WhatsApp duplicadas no núcleo operacional.
- Telemetria por sensor/camada/temperatura sem caso comprovado.
- Editor de workflows genérico.
- Vector database/embeddings para operação.
- Multiempresa apenas porque o projeto Supabase tem nome compartilhado.

## 10.5 Relacionamentos-alvo

```text
customer 1 ── N orders
order 1 ── N order_items
order 1 ── N files
order_item 0/1 ── N files
order 1 ── N assignments
order 1 ── N approvals (por versão)
order_item 1 ── N production_jobs
printer 1 ── N production_jobs
production_job 1 ── N production_events
production_job 0/1 ── N reprints (auto-relação já existente)
order 1 ── N audit_logs
order 1 ── N cost_components (futuro)
order 1 ── N shipments (futuro quando houver múltiplos envios)
product_template 1 ── N order_item snapshots (futuro)
```

## 10.6 Regras de dados

- Chaves externas do Kommo, pagamento e tracking devem ser únicas no escopo correto.
- Eventos externos precisam de `event_id`, origem, recebido em, processado em, versão e resultado.
- Valores monetários usam tipo decimal, moeda e fonte; nunca float.
- Datas operacionais usam timezone explícito e política única para “vence hoje”.
- Motivos de falha, bloqueio, atraso, cancelamento e perda devem vir de taxonomia curta + observação livre.
- Exclusão de pedido operacional deve ser evitada; usar cancelamento/arquivamento com retenção.
- Métricas históricas derivam de eventos/transições, não do estado atual aplicado a um cohort antigo.

---

# PARTE 11 — AUTOMAÇÕES

## 11.1 Matriz de automações

| Automação | Gatilho | Ação | Benefício | Risco/controle | Nível |
|---|---|---|---|---|---|
| Criar pedido de handoff | Negócio elegível no Kommo | Validar payload e criar `received` idempotente | Elimina redigitação | Duplicidade/incompletude; chave externa e fila de erro | N2 |
| Atualizar origem comercial | Lead/campanha recebido | Vincular IDs e snapshot de atribuição | Mede margem por origem | Sobrescrever origem; congelar atribuição definida | N2 |
| Sinalizar briefing incompleto | Pedido criado/alterado | Calcular campos/arquivos faltantes | Evita avanço prematuro | Regras rígidas demais; template por categoria e override auditado | N1 |
| Liberar modelagem | Gate de briefing concluído | Habilitar ação/colocar na fila, sem escolher designer à força | Reduz espera | Autoatribuição ruim; começar sem autoassign | N1 |
| Criar pendência de aprovação | Versão enviada | Registrar envio, responsável e vencimento | Evita versão esquecida | Mensagem não entregue; mostrar estado de envio | N1/N2 |
| Lembrar aprovação | Tempo de espera excedido | Criar ação para Comercial ou enviar lembrete controlado | Reduz lead time | Spam; cadência limitada e quiet hours | N2 |
| Invalidar aprovação | Nova versão/escopo afetado | Marcar aprovação anterior como não vigente | Evita imprimir arquivo errado | Regra ampla demais; vínculo explícito de versão | N1 |
| Preparar produção | Aprovação vigente | Habilitar criação de jobs | Reduz handoff manual | Não selecionar material/máquina automaticamente sem regra | N1 |
| Alertar job excedido | Duração real > estimativa+tolerância | Abrir exceção para operador | Detecta falha cedo | Falso positivo; tolerância por tecnologia | N2 |
| Encaminhar conclusão | Todos os jobs obrigatórios concluídos | Sugerir/permitir acabamento | Evita pedido parado | Jobs incompletos; gate por item/quantidade | N1/N2 |
| Abrir reimpressão | Falha + decisão de reimprimir | Criar nova tentativa relacionada e copiar dados aprovados | Preserva histórico e agiliza | Copiar parâmetro causador da falha; revisão humana | N1 |
| Liberar embalagem | Qualidade aprovada | Criar pendência/fila de embalagem | Reduz espera | QC falso; confirmação humana permanece | N1 |
| Alertar pronto sem postagem | Pedido embalado sem postagem no prazo | Exceção para Expedição | Evita atraso silencioso | Definir calendário operacional | N1 |
| Atualizar tracking | Evento da transportadora | Registrar marco e exceção | Reduz consulta manual | Evento fora de ordem; idempotência e timestamp | N3 |
| Comunicar postagem | Tracking válido | Enviar mensagem transacional | Melhora experiência | Número errado/duplicidade; template e opt-out | N3 |
| Atualizar pagamento | Webhook do provedor | Registrar valor/status/referência | Reduz falso status manual | Webhook fraudável; assinatura e reconciliação | N2 |
| Recalcular risco de prazo | Mudança de estimativa, fila ou indisponibilidade | Atualizar risco derivado | Antecipação de atraso | Confiança baixa; explicar causa | N3 |
| Recalcular custo | Job/custo/evento concluído | Atualizar custo real agregado | Margem corrente | Dado incompleto; mostrar nível de completude | N2 |
| Escalonar sem dono | Pedido/ação sem responsável após limite | Notificar gerente | Fecha buraco de responsabilidade | Alert fatigue; severidade e janela | N1 |
| Marcar conclusão | Critérios finais atendidos | Habilitar, não necessariamente executar, conclusão | Consistência | Encerrar antes de entrega/custo; política clara | N2 |

## 11.2 Automático, semiautomático e humano

### Automático

- Validar payload, deduplicar evento e vincular IDs.
- Calcular prazo, idade, risco, saldo, custo agregado e indicadores.
- Criar pendência derivada de um evento inequívoco.
- Invalidar aprovação quando uma nova versão substitui a anterior.
- Registrar tracking recebido e detectar exceção objetiva.

### Semiautomático

- Criar pedido a partir do CRM: automático se todos os gates estiverem presentes; caso contrário, fila de revisão.
- Sugerir designer, máquina e ordem de produção, com confirmação humana.
- Enviar lembretes e mensagens transacionais com regras e limite.
- Fechar custo do pedido depois de verificar componentes ausentes.

### Humano

- Confirmar se referência/briefing é utilizável.
- Julgar qualidade estética/técnica do modelo.
- Aceitar alteração de escopo e renegociar prazo/valor.
- Aprovar urgência e trade-off da fila.
- Confirmar material/cor/arquivo antes da impressão.
- Classificar causa física de falha e qualidade final.
- Autorizar reembolso, exceção e encerramento atípico.

## 11.3 Padrão de segurança das integrações

Todo fluxo externo deve implementar:

- assinatura/autenticação;
- ID idempotente;
- validação de conta/ambiente;
- ordenação por timestamp/versão quando aplicável;
- retry com limite;
- dead-letter/fila de revisão;
- registro de recebimento e resultado sem armazenar segredos;
- modo shadow antes de escrita real;
- smoke test controlado e rollback operacional.

---

# PARTE 12 — INTEGRAÇÕES

| Integração | Por que existe | Origem → destino | Evento principal | Fonte de verdade | Recomendação |
|---|---|---|---|---|---|
| WhatsApp | Conversa com lead/cliente | Canal ↔ Kommo | Mensagem, anexo, resposta | Kommo/canal | Não criar inbox no OS |
| Kommo | Pipeline de pré-venda | Kommo → OS | Handoff, vendedor, origem, ganho/perda | Kommo pré-venda; OS pós-venda | Prioridade de integração após homologação do OS |
| n8n | Orquestração | Sistemas ↔ sistemas | Webhooks, transformação e retry | Nunca fonte de negócio | Manter separado por credenciais GAEVA e ambiente |
| OpenAI | Classificação/sugestão comercial | n8n → modelo → Supabase/Kommo | Resumo, produto, próxima ação sugerida | Dado original + revisão humana | Shadow/copiloto; nunca confirmar pagamento/ganho sozinho |
| Supabase | Estado do OS | App/n8n → PostgreSQL/Storage/Auth | Operação, arquivos, identidade | GAEVA OS | Preservar RLS e fronteiras com Dry/Pet |
| Provedor de pagamento | Liquidação | Provedor → OS | Pago, parcial, estorno | Provedor/financeiro | Integrar quando canal principal estiver definido |
| Transportadora/agregador | Etiqueta e tracking | OS ↔ transportadora | Etiqueta, postagem, trânsito, entrega, exceção | Transportadora nos marcos | Só após fila manual estar estabilizada |
| Meta Ads/CAPI | Aquisição e sinais de qualidade | Kommo/OS → Meta | QualifiedLead/Purchase autorizados | OS para venda/margem; Meta para mídia | Manter em TEST até governança/credencial/go-live |
| Google Ads/Analytics | Origem e conversão | Site/CRM/OS → Google | Click IDs e conversão | Google para mídia; OS para pedido | N3, após atribuição básica confiável |
| E-mail | Aprovação/notificação | OS → cliente/equipe | Link, lembrete, confirmação | OS para evento; provedor para entrega | Canal opcional, não workflow paralelo |
| Sistema financeiro | Caixa/DRE/fiscal | OS ↔ financeiro | Recebível, custo, NF/reembolso | Financeiro/contábil | Não construir dentro do OS |
| Fatiador | Estimativa técnica | Fatiador → OS, se viável | Peso e duração estimada | Arquivo/fatiador | Importar manualmente/CSV/API só se reduzir trabalho |
| Impressoras | Telemetria eventual | Máquina → OS | Estado/início/fim/falha | Máquina para telemetria; OS para compromisso | N5, não bloquear evolução atual |

## 12.1 Contrato de handoff Kommo → GAEVA OS

Campos mínimos para criar um pedido recebido:

- `kommo_lead_id` e, quando disponível, `contact_id`;
- cliente identificado e meio de contato;
- produto/categoria e quantidade;
- valor/condição comercial;
- status de pagamento ou faturamento permitido;
- prazo desejado/prometido preliminar;
- vendedor;
- origem/campanha quando disponível;
- resumo/referências ou lista explícita do que falta.

O handoff pode criar `received` mesmo com briefing incompleto, desde que a pendência fique visível e bloqueie modelagem. Isso é melhor do que manter venda confirmada fora do OS até o briefing perfeito.

## 12.2 Fluxo de integração recomendado

```text
Kommo
  → webhook assinado
  → n8n valida conta, ambiente e evento
  → registra receipt/idempotência
  → busca/completa dados necessários
  → chama endpoint/RPC de handoff do GAEVA OS
  → recebe order_id ou lista de pendências
  → grava referência no Kommo
  → em caso de erro: fila de revisão, nunca duplicação silenciosa
```

---

# PARTE 13 — INDICADORES

## 13.1 Executivos

| Indicador | Definição útil | Decisão suportada |
|---|---|---|
| Receita confirmada | Valor de pedidos confirmados no período, com regra estável | Ritmo comercial |
| Receita postada/entregue | Valor associado ao marco operacional escolhido | Entrega real versus venda |
| Margem de contribuição | Receita líquida menos custos variáveis e CPA definido | Produto/canal que gera caixa |
| Backlog em valor e horas | Pedidos ativos e esforço restante estimado | Risco e necessidade de capacidade |
| On-time delivery | Pedidos entregues/postados até promessa / elegíveis | Qualidade da promessa |
| Lead time P50/P85 | Mediana e percentil 85, não só média | Previsibilidade de prazo |
| First-pass yield | Itens aprovados sem retrabalho/reimpressão / concluídos | Qualidade do processo |
| Custo da não qualidade | Material, máquina, mão de obra e frete de falhas | Prioridade de melhoria |
| Capacidade comprometida | Horas restantes / horas disponíveis | Aceitar pedido/comprar máquina |
| Margem por produto/origem | Contribuição agregada por oferta/campanha | Mix e verba |

## 13.2 Comerciais

- Leads e oportunidades por produto/origem.
- Tempo até primeira resposta humana e até orçamento.
- Orçamentos enviados e conversão para venda.
- Ticket e margem, não apenas receita, por vendedor.
- Motivos de perda com taxonomia curta.
- Handoffs rejeitados/incompletos e motivo.
- Desconto, frete subsidiado e comissão por venda.

## 13.3 Operacionais

- WIP total e por etapa.
- Pedidos sem dono/próxima ação.
- Idade na etapa e tempo de espera externa.
- Pedidos em risco, vencidos e replanejados.
- Throughput semanal por categoria.
- Tempo pronto→postado.
- Ações vencidas por responsável.

## 13.4 Design

- Fila e WIP por designer.
- Tempo previsto versus ativo real por categoria.
- Aprovação na primeira versão.
- Número de revisões, separando mudança de cliente, briefing e erro interno.
- Tempo aguardando cliente versus trabalhando.
- Entregas dentro do SLA e carga futura.

## 13.5 Produção

- Horas previstas versus reais por job/produto/máquina.
- Utilização e folga por máquina.
- Taxa de falha por causa, material, arquivo e máquina.
- Reimpressões e horas perdidas.
- Fila em horas, não apenas quantidade de pedidos.
- Tempo de acabamento e qualidade.
- Quantidade produzida boa / quantidade iniciada.

## 13.6 Financeiros gerenciais

- Recebido, pendente, faturado e reembolsado.
- Custo estimado versus real.
- Margem bruta e contribuição por pedido/produto/origem.
- Desvio de material, máquina, design, frete e taxa.
- Custo de urgência, retrabalho, reimpressão e garantia.
- Percentual de pedidos com custo completo.

## 13.7 Qualidade

- First-pass yield.
- Não conformidade por checkpoint e causa.
- Revisões de design por origem da mudança.
- Falhas de impressão e reimpressões.
- Retorno/reclamação/garantia por produto.
- Custo da não qualidade sobre receita.

## 13.8 Definições temporais obrigatórias

O dashboard atual seleciona pedidos pela criação e exibe sua situação atual. Isso é válido para uma visão de cohort, mas não responde “quantos estavam em impressão naquele mês”.

Cada indicador deve declarar:

- data de entrada: venda, criação, confirmação, postagem ou entrega;
- numerador e denominador;
- inclusão de cancelados/reembolsados;
- timezone e calendário;
- se mede estado atual, evento no período ou cohort;
- completude/confiabilidade dos dados.

Para escala, preferir P50/P85 e distribuição a uma média isolada. Um único pedido corporativo grande pode distorcer quantidade, horas e margem.

---

# PARTE 14 — ALERTAS E EXCEÇÕES

## 14.1 Conceitos

- **Pendência:** trabalho conhecido que alguém deve executar.
- **Bloqueio:** condição que impede uma transição segura.
- **Alerta:** condição de risco que merece atenção, mas não impede necessariamente o trabalho.
- **Notificação:** canal usado para entregar uma pendência/alerta; não é o problema em si.

## 14.2 Catálogo inicial

| Condição | Tipo | Severidade | Dono padrão | Ação esperada |
|---|---|---|---|---|
| Pedido recebido sem responsável | Pendência/alerta | Alta após limite | Operação | Assumir/atribuir |
| Pedido sem próxima ação | Pendência | Alta | Responsável atual | Definir ação/prazo |
| Prazo prometido vencido | Alerta | Crítica | Gerência + responsável | Replanejar e comunicar |
| Risco de prazo pela fila | Alerta | Alta | Gerência | Redistribuir/priorizar/renegociar |
| Urgência sem motivo | Bloqueio | Alta | Solicitante | Justificar |
| Briefing incompleto | Bloqueio | Alta | Comercial/Operação | Obter/validar dado |
| Arquivo obrigatório ausente/corrompido | Bloqueio | Alta | Solicitante | Substituir arquivo |
| Pedido duplicado provável | Alerta | Média/alta | Comercial | Confirmar vínculo |
| Pagamento/condição incompatível com avanço | Bloqueio | Alta | Comercial/Financeiro | Confirmar/autorização |
| Designer não atribuído | Pendência | Alta | Operação | Atribuir |
| WIP do designer acima do limite | Alerta | Média/alta | Gerência | Redistribuir |
| Modelagem acima do SLA ativo | Alerta | Alta | Designer/Gerência | Atualizar/replanejar |
| Aprovação aguardando além da cadência | Pendência | Média | Comercial | Follow-up |
| Nova versão com aprovação antiga | Bloqueio | Crítica | Sistema | Exigir nova aprovação |
| Job sem arquivo/material/máquina | Bloqueio | Alta | Produção | Completar preparação |
| Job em execução acima da tolerância | Alerta | Alta | Operador | Verificar máquina |
| Impressão falhou | Exceção | Alta | Produção | Causa e decisão |
| Reimpressão sem causa da falha anterior | Bloqueio | Média/alta | Produção | Classificar/corrigir |
| Impressora indisponível com jobs comprometidos | Exceção | Alta | Gerência | Replanejar |
| Estoque abaixo do mínimo | Alerta | Média/alta | Compras/Produção | Repor/replanejar |
| Margem prevista abaixo do mínimo | Decisão | Alta | Admin/Comercial | Aprovar, corrigir preço ou recusar |
| QC reprovado | Exceção | Alta | Produção/Qualidade | Retrabalho/reimpressão |
| Pedido embalado sem postagem | Pendência/alerta | Alta após SLA | Expedição | Postar |
| Postado sem rastreio | Pendência | Alta | Expedição | Obter/corrigir tracking |
| Evento de rastreio parado/atrasado | Alerta | Média/alta | Expedição | Acionar transportadora/cliente |
| Pedido retornado | Exceção | Alta | Atendimento/Expedição | Triar e resolver |
| Integração falhou/retry esgotado | Exceção técnica | Alta | Admin técnico | Reprocessar com idempotência |
| Custo final incompleto | Pendência | Média | Admin/Operação | Completar/justificar |

## 14.3 Controle de ruído

- Uma ocorrência por causa/objeto, atualizada em vez de duplicada.
- Escalonamento só quando muda severidade ou vence ação.
- Acknowledgment com dono e prazo; “lido” não equivale a resolvido.
- Quiet hours para notificações não críticas.
- Alertas derivados desaparecem quando a condição acaba; o histórico permanece.
- Toda notificação deve abrir o contexto e a ação correspondente.
- Revisão mensal de alertas sem ação/baixo valor.

---

# PARTE 15 — PERMISSÕES

## 15.1 Papéis recomendados agora

Preservar os cinco papéis atuais. “Owner”, “Gerente”, “Assistente” e “Expedição” devem começar como responsabilidades/processos dentro deles. Criar novos papéis somente quando houver pessoas reais e diferenças de permissão estáveis.

| Objeto/ação | Admin | Comercial | Produção | Designer | Visualização |
|---|---:|---:|---:|---:|---:|
| Ver todos os pedidos | Sim | Escopo autorizado | Sim operacional | Somente atribuídos/contexto | Sim conforme política |
| Criar cliente/pedido | Sim | Sim | Não por padrão | Não | Não |
| Alterar valor/desconto/frete | Sim | Próprios/autorizados | Não | Não | Não |
| Confirmar pagamento manual | Sim/autorizado | Conforme política | Não | Não | Não |
| Alterar prazo prometido | Sim com auditoria | Solicitar/permitido antes do handoff | Não livremente | Não | Não |
| Definir prazo interno | Sim | Consultar | Sim | Consultar | Consultar |
| Assumir/atribuir operação | Sim | Limitado | Sim | Somente atribuição própria se permitido | Não |
| Editar briefing | Sim | Sim | Validar/complementar | Comentar/usar | Não |
| Ver arquivos do pedido | Sim | Escopo | Sim | Atribuídos e necessários | Conforme política |
| Criar versão de design | Sim | Não | Revisão autorizada | Sim, atribuídos | Não |
| Registrar aprovação do cliente | Sim | Sim | Opcional autorizado | Não autoaprovar | Não |
| Criar/operar jobs | Sim | Consultar | Sim | Consultar o necessário | Consultar |
| Registrar QC/embalagem/postagem | Sim | Consultar | Sim | Não | Consultar |
| Ver custo/margem | Sim | Margem/preço conforme necessidade | Não por padrão | Não | Não por padrão |
| Ver endereço/contato | Sim | Sim | Somente necessário | Mínimo necessário | Conforme política |
| Exceção/retrocesso fora do fluxo | Sim com motivo | Não por padrão | Limitado por regra | Não | Não |
| Gerir equipe/acesso | Sim | Não | Não | Não | Não |
| Alterar templates/SLA/taxonomias | Sim | Não | Sugerir | Sugerir | Não |
| Ver auditoria completa | Sim | Do próprio escopo | Operacional | Do próprio escopo | Leitura autorizada |

## 15.2 Evolução futura

Quando equipe e segregação justificarem, migrar de papéis rígidos para **papel + capacidades**:

- `manage_commercial_terms`;
- `confirm_payment`;
- `manage_operations`;
- `approve_internal_design`;
- `operate_production`;
- `perform_quality_check`;
- `manage_shipping`;
- `view_costs`;
- `manage_access`.

Não fazer essa generalização antes de a matriz real estabilizar.

## 15.3 Pontos obrigatórios de validação

- Comercial não altera campos produtivos via chamada direta.
- Produção não altera valor/pagamento por payload forjado.
- Designer só acessa pedidos/arquivos atribuídos e não aprova a própria versão como cliente.
- Viewer não escreve por nenhuma rota/RPC.
- Perfil/integrante desativado perde acesso efetivo.
- Nova senha temporária, troca obrigatória e sessões antigas seguem política aprovada.
- Valores/margens deixam de ser expostos a quem não precisa, também no servidor.
- URLs assinadas de arquivos respeitam vínculo e expiração.

---

# PARTE 16 — TOP 20 GAPS

## 1. Homologação operacional real

**Gap:** a base foi tecnicamente testada, mas ainda não há evidência de uso ponta a ponta por todos os papéis e em volume.  
**Risco:** descobrir inconsistências somente quando houver pedidos reais em andamento.  
**Intervenção mínima:** roteiro E2E com pedidos controlados, usuários de cada papel e exceções; corrigir antes de ampliar escopo.

## 2. Contrato único entre Kanban e Produção

**Gap:** as duas telas usam os mesmos pedidos, mas podem induzir linguagens e ações diferentes.  
**Risco:** usuários aprenderem “atalhos” contraditórios e perderem confiança no estado.  
**Intervenção mínima:** declarar Kanban como visão macro e Produção como detalhe de jobs; mesma função de transição, mesmos rótulos e mesmos gates.

## 3. Próxima ação, dono e vencimento em todo pedido ativo

**Gap:** responsáveis e ações existem, porém o contrato universal não está comprovado.  
**Risco:** pedido aparentemente “em andamento” sem ninguém agindo.  
**Intervenção mínima:** derivar/registrar a próxima ação por etapa e destacar ausências na Central.

## 4. Handoff comercial → operação

**Gap:** Kommo, tabelas comerciais e fluxo shadow existem, mas lead ganho não vira pedido de modo comprovado e idempotente.  
**Risco:** digitação duplicada, omissão e venda esquecida no CRM.  
**Intervenção mínima:** contrato de payload, chave `kommo_lead_id`, fila de revisão e criação de `received`; ativar só após smoke test.

## 5. Briefing estruturado por categoria

**Gap:** briefing é texto/anexo e a confirmação é agrupada.  
**Risco:** modelagem começa com referência insuficiente e gera retrabalho.  
**Intervenção mínima:** quatro templates simples e versionados, com mínimos e faltas visíveis; sem form builder genérico.

## 6. Contexto e versão dos arquivos

**Gap:** arquivo está ligado ao pedido, mas item, versão, vigência e etapa podem não estar explícitos em todos os casos.  
**Risco:** enviar ou imprimir arquivo errado.  
**Intervenção mínima:** taxonomia curta, vínculo à versão/item onde necessário e marcador de vigente.

## 7. Registro externo de aprovação

**Gap:** a decisão pode acontecer no WhatsApp e depender de transcrição interna.  
**Risco:** aprovação perdida, ambígua ou associada à versão errada.  
**Intervenção mínima:** primeiro reforçar registro interno com versão/canal/evidência; depois link único sem portal completo.

## 8. Item/lote/job explícitos na rotina

**Gap:** o banco suporta itens e jobs, mas a experiência principal privilegia um item e um card por pedido.  
**Risco:** lote corporativo/múltiplas máquinas virarem observações soltas.  
**Intervenção mínima:** manter card por pedido e oferecer gestão de lotes/tentativas dentro de Produção.

## 9. Estimado versus real obrigatório no ponto certo

**Gap:** dados de horas/material são possíveis, mas a completude não está assegurada.  
**Risco:** capacidade, custo e prazo sem base empírica.  
**Intervenção mínima:** exigir poucos campos ao iniciar/concluir/falhar job e medir taxa de preenchimento.

## 10. Controle de qualidade persistente

**Gap:** há confirmação agrupada e checklist visual sem persistência individual.  
**Risco:** erro físico sem prova de verificação nem causa analisável.  
**Intervenção mínima:** snapshots de quatro gates via eventos estruturados; entidade configurável somente depois.

## 11. Central operacional acionável

**Gap:** o painel informa, mas não concentra todas as decisões críticas e próximos passos.  
**Risco:** gestor percorre telas ou volta ao WhatsApp para descobrir problemas.  
**Intervenção mínima:** reorganizar o painel atual por exceção, hoje, espera, carga e decisão, com ação direta.

## 12. SLA com relógio ativo e espera externa

**Gap:** tempo na etapa existe, SLA configurável e pausas não.  
**Risco:** culpar equipe por demora do cliente e não enxergar tempo produtivo real.  
**Intervenção mínima:** metas simples por categoria/etapa e taxonomia de espera; medir total, ativo e externo.

## 13. Custo e margem por componente

**Gap:** placeholders não calculam custo real.  
**Risco:** aumentar faturamento e perder dinheiro, sobretudo em reimpressões/lotes.  
**Intervenção mínima:** definir política e coletar material, máquina, design, acabamento, embalagem, taxa, comissão e frete subsidiado.

## 14. Promessa baseada em capacidade

**Gap:** não há calendário/forecast de máquinas e setores.  
**Risco:** venda acima da capacidade e urgências em cascata.  
**Intervenção mínima:** primeiro backlog em horas e folga semanal; agenda otimizada somente quando estimativas forem confiáveis.

## 15. Fila de expedição e entrega

**Gap:** campos existem, mas alerta/fila e atualização externa não estão completos.  
**Risco:** produto pronto ficar parado ou tracking ausente.  
**Intervenção mínima:** fila “pronto para postar”, SLA, tracking obrigatório quando aplicável e exceção manual.

## 16. Deduplicação e identidade entre CRM e OS

**Gap:** cliente operacional existe, sem reconciliação comprovada por telefone/e-mail/ID Kommo.  
**Risco:** visão 360º fragmentada e pedidos em clientes duplicados.  
**Intervenção mínima:** normalização e alerta de possível duplicata; merge humano e auditado.

## 17. Proteção de campos financeiros

**Gap:** RLS de linha não garante ocultação de valores para papéis de leitura ampla.  
**Risco:** exposição interna desnecessária.  
**Intervenção mínima:** decidir quem vê o quê e aplicar servidor/views/RPC, além da UI.

## 18. Métricas históricas semanticamente corretas

**Gap:** o painel pode combinar cohort por criação com estado atual.  
**Risco:** interpretar comparação como fotografia histórica.  
**Intervenção mínima:** dicionário de métricas e cálculo por eventos para fluxo, prazo e tempo.

## 19. Integridade das gravações em etapas

**Gap:** cliente, pedido, item e arquivos atravessam requisições não atômicas.  
**Risco:** órfãos, upload faltante e repetição duplicada.  
**Intervenção mínima:** chave de idempotência, retomada visível e testes de falha parcial.

## 20. Resiliência operacional e escala

**Gap:** backup/restore, carga, mobile real, observabilidade e runbook não foram confirmados.  
**Risco:** indisponibilidade ou degradação justamente na expansão.  
**Intervenção mínima:** validar restauração, metas de performance, teste em aparelhos, incidentes e paginação server-side antes de centenas de pedidos.

---

# PARTE 17 — QUICK WINS

## Quick wins de maior retorno

1. **Homologar a jornada inteira** com um pedido controlado que inclua alteração, falha e reimpressão; repetir por papel.
2. **Publicar o contrato operacional de status** em uma página curta: significado, dono, gate e próxima ação.
3. **Definir Kanban geral versus Produção** e remover rótulos/ações contraditórios, sem apagar nenhuma estrutura antes de uso real.
4. **Transformar o painel atual em fila acionável**, começando por atrasado, hoje, sem dono, aguardando cliente, falha e pronto sem postagem.
5. **Criar filtros salvos por função:** meus pedidos, sem responsável, briefing pendente, aprovação parada, jobs sem máquina e prontos para postar.
6. **Padronizar quatro templates de briefing** em configuração simples, mesmo que a primeira versão use estrutura fixa.
7. **Mostrar uma lista explícita do que falta** no pedido antes de modelagem/produção.
8. **Remover/rotular campos legados inconsistentes** no detalhe e esclarecer “pagamento registrado, não conciliado”.
9. **Exigir peso/tempo previsto e tempo/resultado real** no momento natural do job.
10. **Persistir snapshot dos gates de qualidade** nos eventos existentes antes de criar módulo genérico.
11. **Adicionar motivo curto padronizado** para falha, revisão, atraso, bloqueio, cancelamento e retorno.
12. **Definir prazo interno** com buffer de acabamento/postagem separado do prazo prometido.
13. **Alertar possível cliente duplicado** por telefone normalizado/e-mail antes da criação.
14. **Criar dicionário de indicadores** para impedir leituras erradas do painel.
15. **Revisar visibilidade financeira por papel** e validar chamadas diretas.
16. **Testar mobile em campo** para upload de foto, job, falha, qualidade e postagem.
17. **Criar checklist de go-live de integração**, preservando o modo shadow atual até credenciais, smoke test e aprovação explícita.

Quick win não significa ausência de cuidado técnico. Cada mudança deve passar por testes de papel, histórico, erro e consistência entre lista, detalhe, Kanban e Produção.

---

# PARTE 18 — ROADMAP

O roadmap é uma sequência de maturidade, não um compromisso de calendário. Nenhuma fase deve avançar porque “a tela ficou pronta”; ela avança quando o critério operacional é comprovado.

## FASE 1 — Fundação operacional

**Objetivo:** colocar o núcleo atual em uso confiável.

Escopo:

- homologar primeiro acesso, papéis e jornada E2E;
- consolidar contrato de status e papéis de Kanban/Produção;
- próxima ação, dono, prazo interno e espera explícitos;
- templates mínimos de briefing e gate de completude;
- coerência de pagamento, detalhe legado, datas e timezone;
- Central operacional com exceções essenciais;
- idempotência/retomada do cadastro e uploads;
- checkpoints persistidos com estruturas atuais;
- política de backup/restauração e runbook.

Critério de saída:

- cada papel completa suas ações sem acesso indevido;
- um pedido com revisão, falha/reimpressão e postagem preserva histórico correto em todas as telas;
- nenhum pedido ativo fica invisível, sem dono ou sem próxima ação;
- equipe usa o OS como referência durante um ciclo operacional real.

## FASE 2 — Controle da produção

**Objetivo:** medir e controlar design, jobs, qualidade e expedição.

Escopo:

- itens múltiplos e lotes quando necessários;
- fila de design, limites de WIP e estimativas;
- arquivos/versionamento operacional;
- aprovação com evidência e, depois, link externo simples;
- job/lote/tentativa com previsto versus real;
- causas de falha, não conformidade e custo de reimpressão;
- fila de qualidade/embalagem/postagem;
- catálogo mínimo de produtos recorrentes.

Critério de saída:

- pelo menos 90% dos jobs concluídos têm tempo e resultado válidos;
- revisões/falhas possuem causa;
- lotes corporativos podem ser distribuídos sem perder vínculo com o pedido;
- pedido pronto não fica parado sem alerta e dono.

## FASE 3 — Gestão e indicadores

**Objetivo:** transformar execução em decisão gerencial.

Escopo:

- dicionário e dashboard por eventos;
- SLA total, ativo e espera externa;
- componentes de custo previsto/real;
- margem por pedido/produto;
- produtividade normalizada por categoria/complexidade;
- backlog em horas e capacidade semanal básica;
- dashboard executivo separado da Central operacional.

Critério de saída:

- direção explica o desvio de margem e prazo dos principais pedidos;
- métricas possuem fonte, fórmula e completude;
- capacidade comprometida pode ser estimada para a próxima janela sem planilha paralela.

## FASE 4 — Automação e integrações

**Objetivo:** eliminar redigitação e atualizar estados externos com segurança.

Escopo:

- handoff Kommo → pedido idempotente;
- vínculo estável lead/cliente/pedido;
- confirmação de pagamento do provedor escolhido;
- tracking/transportadora predominante;
- mensagens transacionais limitadas;
- eventos autorizados para Meta/Google;
- observabilidade, retry, dead-letter e reprocessamento.

Critério de saída:

- eventos repetidos não duplicam pedido/pagamento/postagem;
- falha de integração aparece em fila e pode ser reprocessada;
- cada sistema mantém sua autoridade sem estados conflitantes;
- go-live ocorre após shadow, TEST, smoke controlado e aprovação explícita.

## FASE 5 — Escala e inteligência

**Objetivo:** prever capacidade, risco e necessidade de investimento.

Escopo:

- calendário de máquinas/equipe e manutenção;
- previsão de data viável por categoria e carga;
- estoque mínimo de insumos críticos;
- cenários de nova máquina/designer/operador;
- margem por campanha/criativo;
- recomendação de fila e prazo explicável;
- IA copiloto baseada em dados estruturados, sem decisões irreversíveis autônomas;
- performance/paginação para o volume real.

Critério de saída:

- previsão é comparada ao realizado e possui faixa de confiança;
- contratação/compra é defendida por demanda, ocupação, SLA, margem e gargalo;
- recomendações mostram dados e permitem override auditado.

## 18.1 Plano de validação por papel

| Papel | Cenário mínimo |
|---|---|
| Admin | Criar/desativar acesso, mudar papel, executar exceção, auditar antes/depois e validar sessões |
| Comercial | Criar/vincular cliente, pedido parcial/faturado, completar briefing, tentar alterar campo proibido e acompanhar aprovação |
| Produção | Assumir, confirmar, preparar job, falhar, reimprimir, concluir, QC, embalar e postar |
| Designer | Ver só atribuído, abrir referências, criar versão, receber alteração e não conseguir autoaprovar/alterar financeiro |
| Viewer | Localizar e consultar sem conseguir escrever por UI nem chamada direta |
| Integração | Repetir, atrasar, inverter ordem e corromper payload sem duplicar ou avançar indevidamente |
| Mobile | Executar upload, mover, iniciar/concluir/falhar, fotografar evidência e registrar postagem em aparelhos reais |
| Carga | Simular ativos e histórico em 50, 100, 300 e volume mensal relevante; medir consulta, atualização e conflito |

## 18.2 Critérios transversais

- Dados consistentes entre painel, lista, detalhe, Kanban e Produção.
- Autorização verificada no backend.
- Auditoria legível e imutável para papéis normais.
- Erros recuperáveis sem duplicidade.
- Sem dados fictícios confundidos com operação.
- Sem alterações em estruturas Dry/Pet fora do escopo.

## 18.3 Mapa MVP × evolução

| Nível | Capacidades |
|---|---|
| N1 — Essencial agora | Homologação por papel, contrato de status, próxima ação/dono, Central operacional, briefing mínimo, aprovação vigente, jobs/tentativas, apontamento previsto/real, QC persistido, fila de postagem, permissões e resiliência |
| N2 — Importante | Handoff Kommo controlado, catálogo mínimo, link simples de aprovação, custo/margem, cliente 360º, busca global, SLA configurado, deduplicação e proteção refinada de campos |
| N3 — Escala | Capacidade/calendário, estoque mínimo, tracking/pagamento integrados, múltiplos envios, performance server-side e atribuição completa de marketing |
| N4 — Inteligência | Previsão de prazo/ocupação, margem por campanha, recomendação de fila, cenários de contratação/máquina e copiloto explicável |
| N5 — Futuro | Telemetria física quando houver API/caso, integrações adicionais comprovadas e recursos especializados que só o volume justificar; continuam fora do OS CRM/ERP/CAD próprios |

---

# PARTE 19 — NÃO CONSTRUIR AGORA

1. **CRM/inbox de WhatsApp dentro do OS.** Kommo já é o especialista.
2. **ERP contábil, contas a pagar/receber e emissão fiscal completos.** Integrar solução financeira.
3. **CAD, editor 3D, renderizador ou fatiador próprio.** Não é vantagem operacional atual.
4. **Controle em tempo real de impressoras/sensores.** Estado manual confiável gera mais valor agora.
5. **WMS/MRP/BOM completo.** Estoque mínimo e jobs resolvem o estágio atual.
6. **Construtor genérico de formulários/briefings.** Quatro templates versionados são suficientes para começar.
7. **Editor visual de workflow/status.** O fluxo precisa estabilizar antes de ser configurável.
8. **App nativo iOS/Android.** Web responsiva homologada primeiro.
9. **Portal completo do cliente com conta e histórico.** Link de aprovação simples antes.
10. **BI/data warehouse separado.** Usar eventos e consultas no núcleo até volume justificar.
11. **IA autônoma decidindo preço, prazo, ganho, pagamento, aprovação ou reimpressão.** Copiloto explicável apenas.
12. **Vector database/embeddings da operação.** Dados relacionais e resumo estruturado primeiro.
13. **Otimização matemática de scheduling.** Backlog em horas e regras simples antes.
14. **Multiempresa/workspaces.** Não há requisito operacional comprovado do GAEVA OS.
15. **Sistema próprio de transportadora.** Integrar o parceiro dominante.
16. **RH, folha, ponto ou gestão completa de pessoas.** Fora do núcleo.
17. **Compras e fornecedores completos.** Criar só quando estoque mínimo provar o gargalo.
18. **Gamificação e rankings individuais.** Incentivam comportamento errado sem normalizar complexidade/qualidade.
19. **Notificação para cada mudança.** Gestão por exceção, com ruído controlado.
20. **Status para cada microevento.** Usar entidades especializadas, pendências, bloqueios e eventos.

---

# PARTE 20 — VISÃO FINAL

Renân abre o GAEVA OS pela manhã e, em menos de 60 segundos, vê três pedidos em risco, uma aprovação parada, uma impressão que excedeu a estimativa, dois pedidos prontos para postagem e a carga da semana em horas. Cada sinal já mostra causa, responsável e ação. Ele não precisa perguntar em grupos nem reconstruir o dia pela memória.

O Comercial trabalha no Kommo para conversar e vender. Quando a venda cumpre o mínimo, o pedido entra uma única vez no GAEVA OS com cliente, produto, quantidade, valor, condição, origem e referências. Se algo falta, a pendência aparece antes da modelagem — não como uma observação esquecida. O Comercial acompanha aprovações e informações que dependem do cliente, sem controlar etapas físicas que pertencem à Produção.

A Operação aceita a promessa, define o prazo interno e garante que cada pedido tenha dono e próximo passo. O Kanban mostra o fluxo total; filas específicas mostram o trabalho do setor. Um lote corporativo continua sendo um pedido para o cliente, mas pode ser dividido em jobs por máquina sem perder quantidade, custo ou rastreabilidade.

O Designer abre sua fila e encontra apenas o que pode começar: briefing validado, referências corretas, prazo e prioridade. Cada render e arquivo possui versão. Se o cliente pede alteração, o sistema registra o motivo, reabre a versão correta e separa tempo de trabalho do tempo aguardando resposta.

Na Produção, cada job indica arquivo aprovado, material, cor, quantidade, máquina e duração prevista. O operador inicia, conclui ou registra falha em poucos toques. Falha não apaga história: gera causa, perda e tentativa vinculada. A fila em horas revela o gargalo antes que ele vire atraso.

No acabamento e qualidade, poucos checkpoints impedem os erros caros: versão, escala, cor, quantidade, integridade, acessórios, embalagem e endereço. Se houver não conformidade, a correção tem dono e custo. A Expedição vê tudo o que está pronto, o que precisa postar hoje e qualquer tracking parado.

Ao final do dia, a gestão não olha somente faturamento. Vê pedidos entregues no prazo, horas comprometidas, revisões, falhas, custo de reimpressão e margem por produto/origem. Quando uma categoria cresce, o sistema mostra se o gargalo é comercial, briefing, designer, máquina, acabamento ou expedição.

O GAEVA OS maduro não tenta executar todas as ferramentas. Ele coordena a empresa. Kommo conversa, o provedor liquida, o fatiador prepara, a impressora produz, a transportadora entrega — e o GAEVA OS mantém o compromisso, o contexto, a responsabilidade, o custo e a verdade operacional.

---

# CAMADA ESTRATÉGICA FINAL

## 1. O que estamos deixando de enxergar?

O maior ponto cego é que “pedido” não basta como unidade de capacidade. A operação precisa enxergar item, lote e tentativa. Também pode estar deixando de distinguir:

- tempo trabalhando versus aguardando cliente;
- mudança de escopo versus erro interno;
- receita versus margem e consumo de gargalo;
- prazo desejado versus prazo viável;
- quantidade de pedidos versus horas de design/máquina/acabamento;
- produto entregue versus pedido postado;
- falha isolada versus causa sistêmica recorrente.

Outro ponto cego é a adoção: uma arquitetura correta não vira sistema operacional se as decisões continuarem sendo tomadas e registradas fora dela.

## 2. Maiores riscos operacionais ao escalar

1. Vender prazos sem consultar capacidade.
2. Começar design com briefing inconsistente.
3. Aprovação ocorrer fora do sistema e sobre versão ambígua.
4. Lotes e reimpressões perderem rastreabilidade.
5. Urgências constantes destruírem a fila planejada.
6. Faturamento crescer com margem negativa invisível.
7. Conhecimento crítico permanecer em uma pessoa.
8. Excesso de WIP aumentar o lead time em todos os setores.
9. Integrações duplicarem ou inverterem eventos.
10. Permissões amplas exporem ou permitirem alterar dados sensíveis.

## 3. Gargalos que o software pode eliminar

- Redigitação CRM → pedido.
- Pedido sem responsável/próxima ação.
- Briefing incompleto avançando.
- Arquivo/aprovação sem versão.
- Fila e prazo invisíveis.
- Falha/reimpressão sem histórico e custo.
- Produto pronto sem postagem.
- Duplicidade de cliente/pedido.
- Métrica inconsistente e busca demorada.
- Planejamento sem visão de carga.

## 4. Gargalos que não são problema de software

- Falta de padrão físico de acabamento/qualidade.
- Treinamento insuficiente de designer/operador.
- Máquina lenta, inadequada ou mal mantida.
- Foto/referência ruim do cliente.
- Oferta mal definida ou prazo comercial irreal.
- Falta de disciplina para apontar dados.
- Papéis organizacionais ambíguos e ausência de responsável real.
- Fornecedor/transportadora com desempenho ruim.
- Decisão estratégica de mix, preço e posicionamento.

O sistema pode tornar esses problemas visíveis; não os resolve sozinho.

## 5. O que deveria estar automatizado?

- Ingestão e deduplicação de eventos.
- Cálculos, risco, SLA, saldo, custo agregado e capacidade comprometida.
- Criação de pendências após eventos inequívocos.
- Atualização de tracking e pagamento validado.
- Lembretes limitados e comunicação transacional.
- Vinculação de origem/campanha/pedido.
- Alertas de exceção e falha de integração.

## 6. O que deveria continuar humano?

- Qualidade de briefing e referência.
- Julgamento estético e revisão de modelo.
- Negociação, mudança de escopo e exceção de prazo.
- Priorização quando duas promessas competem.
- Validação física, causa de falha e liberação de qualidade.
- Reembolso, garantia e decisões de relacionamento.
- Contratação, compra de máquina e mudança de mix.

## 7. Módulo com maior impacto financeiro

**Custos e margem por pedido/produto**, alimentado por jobs, material, design, falhas, taxas, comissão, embalagem e frete. Sem ele, crescimento pode esconder perda. Porém, ele só será confiável se o apontamento produtivo vier antes.

## 8. Módulo com maior impacto em prazo

**Central operacional + gestão de próxima ação/SLA**, seguida de briefing e aprovação. Hoje o ganho mais rápido não vem de scheduling avançado, mas de impedir espera invisível e handoff incompleto.

## 9. Módulo com maior impacto em produtividade

**Gestão de jobs/lotes e filas por departamento**, com estimado versus real. Ele reduz troca de contexto, organiza máquina/design e permite balancear carga.

## 10. Módulo tentador cedo demais

**Planejamento preditivo/otimizador automático de produção e telemetria das impressoras.** Parece estratégico, mas sem estimativas e histórico confiáveis apenas automatizaria premissas ruins. O segundo candidato é um portal completo do cliente; um link de aprovação simples resolve primeiro.

## 11. Dados que precisam começar a ser armazenados hoje

### Em todo pedido

- origem, campanha/criativo e vendedor quando conhecidos;
- data de venda, criação, confirmação, promessa e prazo interno;
- responsável e próxima ação;
- motivo e duração de cada espera/bloqueio;
- categoria, quantidade e versão do briefing;
- alterações de escopo e quem as causou.

### Em design/aprovação

- estimativa e tempo ativo;
- designer;
- versão, envio e decisão;
- quantidade e motivo das revisões;
- tempo aguardando cliente.

### Em cada job

- item/lote/quantidade;
- máquina, material e cor;
- peso/tempo estimados;
- início/fim e peso/tempo reais;
- resultado, causa da falha e reimpressão;
- operador.

### Em qualidade/expedição

- gate, resultado e não conformidade;
- embalagem e custo;
- postagem, tracking, entrega, atraso, retorno e reenvio.

### Em economia

- preço, desconto, taxas, comissão e frete subsidiado;
- custos previstos e reais por componente;
- perda/retrabalho/reimpressão;
- reembolso/garantia;
- completude do custo.

## 12. Estrutura para decidir contratação ou compra

Usar uma árvore de decisão baseada em demanda sustentável, não em uma semana ruim:

```text
demanda futura confirmada/ponderada
  → converter em horas por recurso e categoria
  → comparar com capacidade líquida e WIP
  → medir utilização, fila P85, atraso e horas extras
  → localizar gargalo real
  → simular alternativa:
       redistribuição / processo / preço / terceirização
       versus novo designer / operador / máquina
  → comparar impacto em throughput, prazo e margem
  → investir quando o gargalo for persistente e a capacidade adicional se pagar
```

Sinais para novo designer:

- fila e tempo ativo de design crescentes por várias janelas;
- WIP consistentemente acima do limite;
- aprovação/revisão não explica o atraso;
- demanda/margem da categoria sustentam o custo.

Sinais para novo operador:

- máquinas disponíveis, mas jobs não iniciam/finalizam por falta de mão de obra;
- acabamento/QC/embalagem viram o gargalo;
- horas extras e atrasos permanecem após padronização.

Sinais para nova impressora:

- utilização líquida alta e persistente na tecnologia necessária;
- fila em horas gera perda de prazo/venda;
- gargalo não está em design, material, operador ou acabamento;
- margem incremental paga máquina, manutenção e risco de ociosidade.

## 13. Como tornar o GAEVA OS uma vantagem difícil de copiar

A vantagem não será a quantidade de telas. Será o ciclo acumulado de dados e melhoria:

```text
briefing melhor
  → menos revisão
  → estimativas melhores
  → promessas mais confiáveis
  → menos urgência e falha
  → custo real por produto
  → preço/mix melhores
  → margem e capacidade para crescer
```

Concorrentes podem copiar um Kanban. É difícil copiar anos de dados limpos que relacionam categoria, briefing, complexidade, designer, versão, máquina, material, falha, prazo, custo, origem e satisfação. Para criar essa vantagem, a GAEVA deve:

- manter definições estáveis;
- capturar dados no ponto natural do trabalho;
- usar o sistema diariamente;
- fechar o ciclo entre erro e melhoria do template/processo;
- transformar histórico em padrões de prazo, preço e capacidade;
- automatizar somente depois de compreender a exceção;
- preservar simplicidade para que a equipe continue alimentando a base.

---

# CONCLUSÃO

O GAEVA OS não precisa se tornar um ERP universal. Ele precisa se tornar um **sistema de promessa e execução**: toda venda operacionalmente aceita entra; toda etapa tem gate, dono e próxima ação; toda versão aprovada é inequívoca; todo lote e falha deixam rastro; todo envio é acompanhado; e toda decisão de preço/capacidade usa custo e tempo reais.

A base atual é adequada para essa evolução. O caminho de maior retorno é consolidar o que já existe, homologar a operação real e capturar os dados essenciais. Só depois entram integrações de escrita, capacidade avançada e inteligência preditiva.
