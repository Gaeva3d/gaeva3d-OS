# Discovery GAEVA — MT-D01 revision2

Rota: GAEVA-TRANSFORM-001 / preparation/discovery revision2 / MT-D01.
Responsável: TFD-discovery [host-agent-id-omitted].
Delegação: [host-correlation-id-omitted]; data: 10/11/2026.
Estado: preparação documental concluída no recorte; revisão independente pendente. Nenhum QA PASS, gate humano, prontidão para desenvolvimento ou autorização operacional produzidos.

## Pergunta, orçamento e limite

Pergunta: quais fronteiras da base podem sustentar Fundação → Plataforma → piloto Comercial, preservando regras, telas e dados, e quais lacunas precisam entrar na spec?
Parada: evidências suficientes para contratos e checks da arquitetura, sem esgotar biblioteca/mercado ou reproduzir diagnóstico operacional.
Graphify retornou INDEX_STALE; usado fallback lexical canônico, sem rebuild. Skill Discovery, evidence-format, technical-decision-procedure e resources.json consultados. Context7 não estava disponível no catálogo; usadas fontes oficiais diretamente. context_budget com Python padrão executou mas sem tiktoken; repetição com Python TFD mediu PRD Comercial 34.863 tokens e main.py 6.209. Leitura seletiva por seções/símbolos, não carga integral do PRD. O orçamento não foi medido antes das primeiras leituras do pacote Product: desvio de procedimento registrado, sem alegar conformidade retroativa.

Mandato atual autoriza somente documentos no diretório desta entrega. Política do projeto prevê branch/PR, mas mandato veda .git, commits/push e mudanças operacionais: entrega documental local para integração pelo main; nenhum PR alegado. Ownership foi atribuído exclusivamente neste diretório pela delegação. Não existem hooks acionados por esta escrita documental; registro Aeonyx não estava disponível entre ferramentas usadas. Nenhuma edição em Product ou fontes.

## Entradas e precedência

sources.json P01–P05 registra hashes reais integrais. Foram consumidos os documentos com adendo Brasil, revisão documental 3: os hashes P01/P03/P04/P05 mudaram em relação à primeira delegação; P02 permaneceu igual na primeira captura, mas mudou na conferência final junto com os demais. Isso não é erro nem aprovação adicional. Adendo Brasil foi incorporado como proposta. Identificador MT-P01 revision2 do roteamento não substitui revisão 3 do documento. Os 11 módulos e a sequência informados pelo principal são preservados; não é uma nova arquitetura aprovada.

## Base e limites observados

E01–E02: FastAPI com router /api/v1 e loader opcional register(app), tier/features em memória. Recomendação LOCAL DECISION para discussão: manter aplicação e banco lógico alvo, com contratos entre domínios e donos de tabelas; não criar microserviços ou container por módulo. Alternativa: extrair serviços aumentaria migração/operação sem necessidade demonstrada. Remover variável do plugin não demonstra desinstalação segura de dados nem modularidade hot-plug do Core. Features não substituem RBAC.

A03 declara FastAPI 0.142.2, SQLAlchemy 2.1.3, Alembic 1.20.0 e psycopg>=3.3.6; A04 declara Node>=24, React ^19.3.0, Vite ^8.3.2, Vitest 4.1.11. São valores dos manifests, sem validação de disponibilidade ou versões instaladas. Existem frontend/package-lock.json e package-lock.json raiz; não resolvidos nesta rodada. Backend contém ranges: não há baseline reprodutível demonstrado somente por requirements. Nenhuma dependência adicionada/instalada.

E03–E05: código local atual já usa /admin/messages como Atendimento; App.jsx mantém AdminNotifications, navConfig/breadcrumbs dizem Atendimento. useAtendimento consome notificações e preserva rascunhos por thread/Época de seleção. API distingue staff no inbox de admin no contexto. A projeção de contexto percorre thread → pedido → User cliente e rejeita vínculos contraditórios. Isso é reuso candidato e continuidade real de código, não prova do fluxo WhatsApp ou UI pronta em runtime. Separar identidade User cliente de Customer organizacional. Não converter Notification.id, thread_id ou oportunidade em IDs intercambiáveis.

E06: produção possui pedidos/linhas/OP pai-filha, quantidades, refugo, QC, agendamento e recursos por operação. São candidatos para fila de impressão e rastreabilidade; status internos da OP não equivalem às sete colunas KP-01. Não substituir aprovação final do cliente por QC passed/waived da base. E07: pagamentos decimais e referência externa não constituem Pix confirmado, idempotência global ou política de entrada. E08: custo por KG e estoque em G exigem reconciliação explícita; E09: upload de imagem de produto não é política suficiente para artes privadas/STL/3MF.

## Reconciliação PRD42 / spec23 / matriz11 — substituição da evidência ausente

E10–E12 sustentam uma nova análise, sem fingir recuperação do relatório de 29/10. Spec23 já aponta PRD42; matriz11 declara harmonização 41/22. Manter MF-01–44 e COM-001–029, sem renumerar. Abaixo são deltas do adendo42 sobre essa declaração histórica, não diff Git entre arquivos antigos não disponíveis:

| Delta PRD42 (linhas 690–701) | Contrato/check necessário na spec | Reuso versus limite |
| --- | --- | --- |
| Encerrar distinto de arquivar/venda/bot | Encerrar conserva vínculos/autoria, libera ocupação/reserva, não conclui pedido nem devolve IA | Reusar histórico; desenvolver transição autorizada no domínio Comercial |
| Convite Ler/Editar e responder/Transferir exige aceite | Pendente/recusa não concedem acesso nem reserva; aceite revalida; duas decisões concorrentes produzem um Único efeito/principal | RBAC genérico staff/admin não prova concessão por conversa |
| Sem prazo de convite decidido | Configuração/expiração/cancelamento/reenvio/deduplicação com política explícita | Não herdar 60s da fila/reconexão; falta de política é negócio, não falta de endpoint |
| Digitação transitória | Evento autorizado expira/termina e não vaza entre conversas | Epoch local ajuda evitar resposta tardia; não prova evento do canal |
| Cabeçalho/compositor/densidade/Ícones | Guia vigente, resize por teclado, conservar filtro/contexto/rascunho, estados claros | Preservar HTML/assets r38/r39 e adaptar controles; Ícone de vídeo não prova Calling |

As pendências restantes de C01 seção consolidada foram inventariadas: IA entre pedir humano/assumir; precedência empresa/equipe/pessoa, feriados/plantões; limites híbrido e reservas na tolerância; desempate residual; transições/saltos/retornos/perda/reabertura e dados por etapa; alçadas consulta/edição/transferência/prioridade/publicação, escopo empresa/equipe e financeiro; capacidade de colaboradores, duração/concessões após transferência; opt-in de respostas pessoais para IA; agenda/tipos/resultados/lembretes/convites/tarefa; adoção e cancelamento de IA/Fluxos/Campanhas/Sequências/Ferramentas/WhatsApp Flows; coortes/cancelamentos/estornos, atribuição, metas, marcos de tempo e agregação de peças. PRD42 acrescenta ciclo de vida dos convites. Main deve fechar apenas políticas afetadas antes de especificar comportamento dependente. Não reabrir principal Único, bot pausado ao assumir, 50% parcial ou sete colunas.

## Matriz requisito → reuso/adaptação/lacuna

| Requisito | Reuso comprovado candidato | Adaptação/lacuna e aceite futuro | Momento / evidência |
| --- | --- | --- | --- |
| REQ-01 ficha Única | Projeção thread/pedido/User | Contratos cliente/oportunidade/proposta/pedido; retomada sem duplicatas | Plataforma/piloto E05 |
| REQ-02 revisão e retrabalho | Pai/filha e linha de venda | Imutabilidade da versão aceita; refação filha conserva venda | Contrato MOD-003 E06 |
| REQ-03 publicação humana | Identidade staff/admin | Permissão específica vendedor; IA rascunha sem publicar | Piloto E04, P03 |
| REQ-04 pausa bot | Nenhum motor integrado validado | Autoridade e exclusão concorrente humano/bot; só principal devolve | Piloto Q03 |
| REQ-05 fila/reservas | Nenhuma equivalência comprovada | Estado persistente e aceites concorrentes; separar reserva/convite | Piloto E10 |
| REQ-06 contexto exato | Serviço contexto + epoch/r draft | Drawer compartilhado e seleção correta; erro/403 sem dados alheios | Piloto E03–05 |
| REQ-07 isolamento | Admin/staff, projeção restrita | RBAC registro/campo, audiências e anexos privados; negativos por acesso direto | Plataforma E04,09 |
| REQ-08 entrada e aprovações | Payment/OP | 50% parcial, aceite 2D/3D por revisão; recebimento confirmado distinto de comprovante | Contratos MOD-003/008 E06–07 |
| REQ-09 postagem | QC candidato | Gate conjuntivo financeiro+cliente+qualidade; falhar cada condição separada | Contratos produção E06–07 |
| REQ-10 shell/guia | HTML e guia existentes | Reusar componentes/estados, permissão e erro real | Plataforma/piloto U01–03 |
| REQ-11 preservação | Chaves venda/linha/pai | Mapa legado→canônico, órfãos/conflitos e reconciliação auditável | Fundação E05–06 |
| REQ-12 Mensagens→Comercial | Rota/nav/hook/API legados | Adaptador/redirect gradual; manter mensagens/anexos e badges genéricos | Piloto E03–05 |
| REQ-13 telas prontas | Hashes U01–03 | Inventário de assets e comparação PRD42/spec23; não redesenhar do zero | UIUX E14 |
| REQ-14 base dev | Manifests e testes localizados | Proveniência fonte/imagem, isolamento, restore e CI demonstráveis | Fundação Q02,Q04 |
| REQ-15 quadros distintos | OP agendada e recurso | Comercial Kanban; produção sete colunas; impressão lista/híbrido proposta | UIUX/produção E06 |

## Contratos transversais para Arquitetura

Propostas técnicas, não DDL nem APIs implementadas:

- Identidade/RBAC: tabela de correspondência explícita de usuários/cliente organizacional/contato externo/workspace, com autoria preservada. Permissões por ação, registro e campo; telefone, menção e convite pendente não concedem acesso. Testar Último Admin e desativação sem apagar autoria.
- Comercial/Canais: separar conversation_id, opportunity_id, legacy thread_id e event_id; manter mapa externo Único por origem. Reentrega não duplica cliente/mensagem/convite; confirmar transição com versão esperada. Convite colaborativo e convite Portal têm ciclo e audiência próprios.
- Arquivos: objeto vinculado a pedido/peça/revisão/origem/autor, classificação de audiência e autorização de download. Migração conserva referências e anexos; imagens públicas de produto e artes privadas não compartilham política automaticamente. Sem acessar uploads nesta pesquisa.
- Transações/eventos: dono Único de cada agregado; mesma transação para estado e registro de evento/efeito local. Propor outbox/inbox somente se entrega assíncrona exigir; comparar com chamada interna simples. Consumidor idempotente e evento versionado; não afirmar que outbox já existe. Não permitir escrita cruzada irrestrita só por compartilhar PostgreSQL.
- Financeiro: referência externa Única no escopo PSP/conta, deduplicação de callback e reconciliação; comprovante não é liquidação. Testes candidatos T03 convergem invoice/payment e eventos; não testam homologação Pix. Nenhum PSP escolhido.
- Produção: venda/peça/revisão aprovada → execução/OP filha → recurso/material → QC → expedição. Separar status OP, atividade, quadro do pedido e aprovação. Gate de impressão valida revisão/material/capacidade; gate de postagem exige os três aceites. Política de agregação parcial permanece negócio.

## Brasil: shortlist de propostas, não escopo aprovado

| Proposta | Problema/usuário e fonte | Melhoria mínima e alternativa | Dependências/risco/custo | Aceite e fase proposta |
| --- | --- | --- | --- | --- |
| BR-P01 | Operação brasileira precisa ler preço/data sem alterar material; P03, E08 | pt-BR/BRL por apresentação e moeda explícita; UTC para instante e fuso IANA na vista. Alternativa configuração por empresa | Inventariar valores legados e timezone de calendário; risco alto de reinterpretar custos; esforço transversal | Fixture R$ 1.234,56, roundtrip decimal, data perto da meia-noite America/Sao_Paulo; piloto |
| BR-P02 pagamentos | Receber entrada/saldo com confirmação; E07, E19 | Adaptar ledger existente e integrar PSP por contrato verificado; alternativa confirmação manual autorizada auditável enquanto integração não homologada | Segurança, contrato real do PSP e reconciliação; não usar DICT como API comercial | Callback repetido/fora de ordem não duplica nem libera gate indevido; contratos piloto, automação conforme fase |
| BR-P02 fiscal/privacidade | Cliente e operador precisam documento correto e dados restritos; E17–18 | Levantar enquadramento/UF/município/operação com dono fiscal e política de dados/retenção. Alternativa adapter fiscal posterior com referência externa | Invoice não comprova NF-e/NFS-e; nenhuma classificação tributária presumida. Exigência de segurança não some por pequeno porte | Matriz de aplicabilidade aprovada pelo responsável, download negado fora da audiência, retenção definida; Plataforma/contrato fiscal, emissão posterior |
| BR-P03 capacidade/material | Operador decide o que cabe por recurso; E06,E08 | Lista ordenada da fila com recurso, duração estimada/origem, material requerido/disponível e bloqueio. Alternativa Kanban por estado/recurso | Reusar operações/recursos/BOM; evitar segundo cadastro; duração é estimativa, prioridade/dispatch não inventados | Mesma execução em todas as vistas; material insuficiente/recurso indisponível explícitos; roadmap produtivo |
| BR-P04 custo/perdas/QC | Gestão precisa reconciliar refugo sem nova venda; E06–08 | Execução filha para reimpressão, material previsto/real e motivo de perda. Alternativa registro manual vinculado antes de automação | Separar custo real/orçado, energia/mão de obra somente com fonte e fórmula aprovada; esforço médio/alto | Quantidade/material/custo reconciliáveis sem duplicar receita; preservar QC e cliente; roadmap |
| BR-P05 jornadas | Atendimento evita redigitar ao consultar cliente/pedido; E03–05 | Drawer compartilhado abre registro exato e preserva conversa. Alternativa navegação ERP contextual com retorno | Permissões e revisão de dados; baixo custo visual relativo, integração não demonstrada | Troca rápida A/B não mostra dados atrasados; 403/erro/vazio e teclado; piloto |

Fontes oficiais consultadas estão em sources.json W03–05. W03 arts.12–13 sustentam segurança proporcional, não parecer de conformidade. W04 trata prestação de serviços, não resolve enquadramento GAEVA. W05 informa OpenAPI e remissão a segurança; README mostra 2.11.0-rc1, sem impor release candidata ao projeto. Não há dados pesquisados que quantifiquem ganho/mercado. Não foi necessário adicionar benchmark 3DTag para justificar essas lacunas locais; nenhuma capacidade de concorrente é atribuída sem pesquisa.

## Licença, edição e opções

E13: FilaOps local é BSL 1.1 com restrição para SaaS concorrente; conservar avisos e revisar aplicação ao uso/distribuição pretendidos antes de publicação. E15–16: ChatbotX no SHA fixado tem MIT e subárvores comerciais, inclusive schema Enterprise. Integração candidata deve selecionar arquivos/contratos e todas as licenças transitivas; não adotar esquema Enterprise por achar que só frontend é restrito. Edição instalada, recursos/licenças e capacidade de compartilhar banco lógico não estão demonstrados.

Alternativas para arquitetura: adaptar componente elegível com fronteira local, ou adapter de serviço/API elegível preservando banco lógico aprovado e ownership. Comparar compatibilidade real antes de recomendar uma. Não escolher dois bancos por conveniência contra decisão registrada. Não copiar Kanban Twenty ou introduzir serviço adicional com base em dependência dnd-kit. W06 é anúncio do fornecedor, sustenta somente candidatura de canal, sem promessa de runtime GAEVA.

MatthewKerns no commit indicado não abriu (restrição retornada por web); nenhum conselho foi usado como fundamento. Pesquisa decisiva veio de código local e fontes primárias. Sem cópia/indexação do guia. Falhas públicas iniciais: BCB depende de JS, ANPD URL inicial 404, NF-e redirect loop e FAQ NFS-e leva a login. Usadas páginas primárias públicas alternativas, sem login/contorno de segurança. Quaisquer detalhes adicionais de fiscal/Pix exigem contrato/fonte aplicável na fase própria.

## Handoff e checks futuros

Arquitetura: fechar mapa de agregados/tabelas, identidade, revisão/eventos/arquivos, transações e migração compatível. Consumir E01–19 e Q01–04 com PRD42/spec23; não declarar o relatório antigo recuperado. Spec nova referencia esta revisão e os hashes.

UIUX: preservar guia/Atendimento r38/r39 e hash dos assets realmente usados; inspecionar proposta visual contra implementação local simplificada. Manter Kanban Comercial, KP-01 de sete colunas, propor lista/híbrido para impressão com seleção/ação por teclado e alternativa sem drag. Carregando/vazio/sem permissão/bloqueio/conflito e rascunho preservado são aceites. Estado de conversa não é etapa comercial nem produção.

DevOps: reutilizar relatos ENV04/05/08 do main sem repetir infraestrutura. Provar repositório canônico com responsável autorizado (sem nova tentativa de .git B), manifest fonte/hash→imagem digest, lock/versões Python/Node, config de exemplos sem segredo, dev/test/prod separados com dados sintéticos. Ensaiar migrations e rollback compatível; restore em destino isolado autorizado com hashes, contagens e vínculos. Fonte/imagem divergentes e restore não testado impedem afirmar pronto para desenvolvimento. Nenhuma leitura de .env, segredos, uploads, dados ou .git nesta rodada.

QA independente: validar equivalência de entradas/hashes e os deltas; estrutura JSON não atesta fatos. Testes localizados/lidos: T01 contexto com fixtures, T02 inbox troca/rascunho/negação, T03 convergência de pagamentos. Não executados porque a tarefa é documental sem ambiente/DB de teste autorizado. Futuras suítes devem incluir tentativa direta de acesso a cliente alheio, callback duplicado, aceite concorrente, reexecução filha, cada gate isolado e migração/retorno.

As lacunas Q01–04 não bloqueiam esta pesquisa documental: bloqueiam decisões ou execução dependentes. Main pode entregar spec/Task com pendências delimitadas e obter revisão independente; não converter essas pendências em requisitos aprovados. Nenhuma pergunta enviada diretamente ao usuário.

Tokens OpenBot: indisponíveis; recibo deste host não exposto. Reader Codex não mede esta execução.

## Adendo final consumido — REQ-16 / duas instalações

Readback detectou drift P01–P05, check exit1. Foram relidos os adendos Product e o REQ-16; fontes atualizadas preservam previous_consumed_revision para rastrear as duas fotografias. Mesmo pacote revisão3 inclui correções 23c5240a, d16e9826 e topologia final 1243dd4d. Não se trata de mudar o roteamento de MT-D01 ou aprovar execução.

FATO DOCUMENTAL P01/P03: mesmo código atende Gaeva3D e DryMaia desde preparação, em dois servidores/instalações independentes. Cada uma tem banco, arquivos, credenciais, canais, marca, configurações e backups próprios. O banco lógico compartilhado entre Comercial e ERP descrito acima vale dentro de cada instalação, nunca entre empresas. Não exigir tenancy compartilhada nem criar fork por marca. Nome/site não determina FDM/resina/material.

| Empresa → jornada | Capacidade observada da base | Reuso/lacuna | Isolamento / check futuro |
| --- | --- | --- | --- |
| Gaeva3D → atendimento/venda/produção | Mesmos candidatos E03–09; projeção cliente/pedido, Payment, OP, unidades configuráveis | Jornada particular segue PRDs existentes; integração/gates pendentes | Instância A com DB/arquivos/canais próprios; credencial A não alcança B |
| DryMaia → atendimento/venda/produção | Mesmos modelos da base; capacidade de unidade configurável descrita em D03 para materiais além de filamento | Não há nesta pesquisa requisito distinto de workflow/material comprovado para DryMaia; verificar configurações com amostras sintéticas na fase correspondente, sem inventar diferença | Instância B independente; restore/configuração não usa recursos de A; canais/branding separados |
| Ambas → material/processo | D03 admite perfis UOM além de filamento; D01 relaciona BOM/routing/recurso | Candidato parametrizável, não cobertura runtime de todos os materiais; sem hardcode por empresa | Mesmo artefato versionado, configurações separadas; cenário por instalação e perfil material |

REQ-16: REUSAR modelos parametrizáveis e ADAPTAR templates por instalação; lacuna é demonstração de cobertura, ausência de configurações cruzadas e jornada sintética em ambas. Fundação/Plataforma devem preparar um build rastreável reutilizável e dois conjuntos de parâmetros/recursos sem segredos. Validar também que exclusão/backup/restore/configuração de uma instância não atua na outra. Nenhum deploy realizado. Esta proposta não afirma que as duas instalações já existem ou estão isoladas hoje. Site DryMaia não acessado: não era necessário inferir política ou material por marketing.

## Fonte primaria adicional da empresa - E20 / W08

Contexto recebido em [host-correlation-id-omitted]; pagina aberta diretamente em 10/11/2026: [GAEVA3D](https://www.gaeva3d.com/).
A homepage apresenta pecas corporativas FDM e envio nacional. Publica briefing/analise, desenvolvimento, previa digital aprovada antes da producao, impressao e acabamento/envio. Intake solicita peca, aplicacao, quantidade aproximada, data necessaria e logo/referencia; contato encaminha a WhatsApp. FAQ retornou perguntas sem respostas.

INFERENCIA delimitada: reforca a pertinencia dos contratos de briefing, revisao/aceite e rastreio produtivo ja mapeados (REQ-01/02/06/08/09, BR-P03/05); nao cria requisito ou comprova execucao interna. B2B/FDM e posicionamento publicado, sem excluir B2C do PRD nem parametrizacao de materiais em ambas as instalacoes. Prevalecem as regras detalhadas aprovadas de pagamento, 2D/3D e qualidade; o site nao as substitui. Nao inferir minimo, prazo, preco, tributacao, pagamento ou direitos de arquivo. Nenhuma navegacao na marca irma/social/WhatsApp, formulario ou envio. Sem novos consumidores/runtime alterados.

## REWORK revision2 — F-01 e F-02 (tentativa 1)

Correlação [host-correlation-id-omitted]; revisão independente r1 preservada em reviews/mt-d01-r1. Foco atual: somente GAEVA OS, um produto/spec. O adendo histórico de empresas permanece como rastreabilidade; não é uma segunda frente nem condição de aceite de duas soluções. Instalação independente é parametrização de infraestrutura. Nenhuma reabertura de requisitos adequados.

F-01: a perda de caracteres U+003F era real, causada pela codificação do transporte PowerShell→Python na escrita anterior. Não foi tratada como defeito de exibição. Corrigidos tokens de prosa por vocabulário das fontes canônicas e revisão contextual das ambiguidades; intervalos por IDs/linhas e setas pelas relações observadas. Cada excerto numerado foi recuperado da mesma linha do arquivo canônico, e conferido literalmente. O locator E10 voltou a “Solicitação com aceite”, existente no PRD42:695. Pontuação de pergunta, query strings e optional chaining legítimos preservados. Verificações em recibo; nenhuma substituição global de todo `?`.

### F-02 — inventário factual delimitado de Mensagens→Comercial

Fonte nova M01–M16; fontes já existentes N01–03, R01–03 e T02. Caminhos completos/hashes em sources.json, linhas exatas no evidence.json. Pesquisa restrita a backend/app e frontend/src e testes selecionados; sem acesso a plugin PRO externo, dados ou anexos. As verificações na última coluna são propostas para fases futuras, não testes executados.

| ID / produtor → consumidor e fonte | Contrato, papel e identidade atuais | Preservação / destino proposto | Aceite futuro |
| --- | --- | --- | --- |
| DEP-01 App.jsx:235–242 → AdminNotifications; navConfig.js:73; breadcrumbs.utils.js:29 | `/admin/messages` mantém componente legado, rótulo Atendimento. Não há prova de permissão por conversa pela rota visual | ADAPTER de entrada/redirect gradual para Comercial; manter links antigos enquanto consumidores existirem | Deep link legado abre superfície correta sem perda de seleção; acesso negado no servidor independe do menu |
| DEP-02 AtendimentoCompose.jsx:16 → admin/customers.py:44–64 e admin/__init__.py:21–27 | GET `/api/v1/admin/customers?limit=200`; subrota exige admin sobre gate staff; destinatário usa e-mail de User cliente. Falha permite digitação manual na UI | REUSAR busca autorizada via contrato Comercial; não ampliar permissão por mostrar datalist. Redirect com barra final não verificado em runtime | Admin recebe apenas projeção permitida; operator/403 não revela lista; falha mantém destinatário/rascunho |
| DEP-03 AdminNotifications.jsx:23 → AtendimentoCompose.jsx:29 | `isPro` habilita botão; POST `/api/v1/pro/portal/admin/messages/new`, recipient_email/subject/body, retry:0. Gate frontend não comprova autorização, envio, transporte ou vínculo do plugin | ADAPTER de composição elegível; preservar campos e impedir reenvio automático. UNKNOWN: implementação PRO desta rota não encontrada no escopo backend/app consultado; não leu código externo | Sem PRO/sem autorização apresenta indisponibilidade real. Com implementação autorizada, demonstrar autor, destinatário, entrega e vínculo sem duplicata; falha não descarta campos |
| DEP-04 notifications.py:37–69 → notification_service.list_threads/get_thread → useAtendimento.js | GET `/api/v1/notifications/` e `/{thread_id}` exigem staff; resumo agrupa por thread, conta todas as linhas e usa primeira mensagem para assunto/pedido; corpo da última gera prévia | REUSAR histórico/identidades por adapter; não equiparar thread de notificação a oportunidade ou thread interna GAEVA | Fixture com N mensagens conserva thread_id/id, autoria/source, assunto, pedido, corpo, timestamps e ordenação definida. Conferir empates de created_at antes de prometer ordem estável |
| DEP-05 useAtendimento.reply → notifications.py:72–84 → notification_service.reply_to_thread | POST `/{thread_id}/reply`, body 1–5000 no schema; staff; serviço herda assunto/pedido da primeira mensagem, grava sender_type/source admin, sender_name, commit | ADAPTAR autoria real/permissões GAEVA sem reescrever histórico. Nome legível não é chave imutável de usuário nem evidência de envio remoto | Após adapter, resposta não muda principal/cliente; falha/repetição não duplica mensagem; confirmar transporte externo separadamente |
| DEP-06 useAtendimento.load → notifications.py:87–105 / service:167–190 | POST `/{thread_id}/read` e `/{notification_id}/mark-read`; staff; atualizam `read_at` na mensagem, sem user_id de leitor no modelo | REUSAR sem converter leitura global em recibo individual/WhatsApp. Nova semântica por pessoa exige contrato próprio | Marcar leitura conserva histórico e atualiza contagem do escopo definido; leitura de um usuário não é alegada como leitura do cliente |
| DEP-07 notifications.py:27–34 → get_unread_count; dashboard.py:588–590 → AdminDashboard.jsx:57 | GET `/api/v1/notifications/unread-count` staff; summary staff retorna notifications.unread pelo mesmo serviço. Frontend AdminDashboard busca summary, mas uso visual desse campo não demonstrado na busca seletiva | MANTER contador/contrato fora da aposentadoria da entrada Mensagens. UI lista possui badges de thread; não afirmar sino integrado | Contador, summary e filtros reconciliam fixture antes/depois de read; teste de autorização e nenhum alerta perdido por redirect |
| DEP-08 GaevaTopbar.jsx:58–59 | Sino mostra texto explícito “A central de notificações ainda não está integrada.”; não é consumidor comprovado de unread-count | PRESERVAR aviso genérico e estado honesto; integrar depois por contrato, não retirar sino como se fosse módulo Mensagens | Sem API, não exibir número inventado; integração futura não confunde evento de sistema com conversa |
| DEP-09 sales_order_service.py:1815,1831–1855 → create_notification | Confirmação de pedido externo grava OrderEvent status_change, commit de pedido e depois notification com source system/sender_type admin. create_notification pode gerar UUID e faz commit próprio | REUSAR produtor de aviso operacional. ADAPTAR entrega confiável/idempotente se exigida: transações separadas permitem risco de pedido confirmado sem aviso se criação falhar; não falha observada | Fixture/falha controlada futura preserva pedido e evento e permite reconciliar aviso ausente/repetido; não bloquear ou apagar histórico comercial |
| DEP-10 CustomerContextDrawer.jsx:19,35–39 → N02/N03 e links `/admin/orders/{id}` | Contexto exige admin, percorre thread→pedido→User cliente; UI também conserva link por orderId legado quando contexto indisponível. Link não concede acesso ao pedido | ADAPTER de contexto exato e compatibilidade de links, sem fallback por nome/e-mail. REUSAR negativa 403/404 e teste T02 | Troca A/B não vaza ficha; link direto exige permissão no destino; preservar rascunho e registro selecionado |
| DEP-11 notification.py:16–37 / schemas/notification.py | Tabela notifications tem id, thread_id, sales_order_id nullable FK `ondelete=CASCADE`, corpo/origem/autoria legível/leitura/datas. Modelo não contém relacionamento/coluna de anexo; response e reply também não | NÃO apagar tabela nem pedido para aposentar menu. Planejar preservação/reconciliação antes de qualquer delete/migração; CASCADE é risco declarado de esquema, não perda observada | Em ensaio isolado autorizado, exclusão/migração não remove mensagens contratadas: contar IDs, comparar hashes/campos e órfãos. Verificar constraint real na fase própria; não presumir banco aplica exatamente este metadata |
| DEP-12 anexos e documentos (D05 + M01/M02/M03) | Composer/reply Core selecionados enviam texto, sem campo de arquivo. Upload de produto público não prova anexos privados. UNKNOWN: armazenamento, vínculos, retenção e permissões de anexos PRO/canal/legado não demonstrados | Arquitetura deve obter inventário autorizado do dono PRO e mapa de objeto→mensagem/pedido/revisão/audiência antes da migração. Adapter conserva IDs/URLs autorizadas e conteúdo, sem publicar arquivo privado | Fixture sintética com anexos, hash/tamanho/tipo/autoria/revisão e ACL; URLs antigas continuam seguras ou redirecionam autorizado; nenhum órfão. Não acessar uploads reais nesta tarefa |
| DEP-13 apiClient.js:128 → events.js → ApiErrorToaster.jsx:57,69 | `api:error` informa erro local; toaster pode emitir `tier:limit-reached`. Bus é em memória da UI, distinto de Notification e OrderEvent persistidos | MANTER avisos técnicos genéricos durante aposentadoria do módulo. Não migrar toast para conversa nem tratá-lo como evento de domínio durável | Erro da API permanece visível; nenhum toast cria mensagem pública ou concede tier/permissão |

### Limites e sequência de desativação proposta

1. Congelar inventário de IDs/vínculos/consumidores com o responsável técnico, incluindo PRO e anexos ainda UNKNOWN; não declarar cobertura total a partir da busca Core. Preservar fonte/tabela/migrations históricas enquanto dependências persistirem.
2. Criar contratos/adapters da superfície Comercial na fase autorizada, mantendo produtores operacionais, leitura/contadores, acesso ao pedido e histórico. As rotas acima são fatos locais ou chamadas do frontend; não são propostas de novos endpoints implementados.
3. Comparar fixtures sintéticas/reconciliação e política de autoria/leitura/ordem; testar negativos de permissão e reentrega. Somente então mudar entrada/nav e desativar gradualmente endpoints realmente substituídos. Não desativar avisos/badges genéricos junto da entrada de Mensagens.
4. Desativação física de tabelas/cascatas não está autorizada nem especificada como automática: retenção, preservação de anexos e retorno devem ter plano e aceite próprios. Plugin não encontrado nesta seleção não prova ausência de instalação; seus handlers, schema, migrações e transporte permanecem UNKNOWN.

Testes de cobertura lidos (não executados): T02 linhas 96–113 retém destinatário/campos na falha PRO; M10 test_notifications.py cobre lista, reply, 404, unread e marcação; T01 contexto cobre fixture e negação. Não cobrem preservação de anexo/PRO ou cascade real. F-02 entrega mapa suficiente para a Arquitetura definir tais verificações, sem afirmar aprovação independente.
