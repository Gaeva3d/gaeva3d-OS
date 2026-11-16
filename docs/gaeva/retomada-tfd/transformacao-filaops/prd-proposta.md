# PRD proposto de reconciliação — GAEVA OS

Revisão 3, 10/11/2026. DRAFT para Discovery/Arquitetura e QA independente. Briefing: `briefing.md`. Fontes S1–S11: `escopo-aprovacoes.md`, além dos mandatos literais em `preparacao-autorizada.md`. IDs abaixo são locais desta proposta, sem renumerar COM/MF/FC/KP existentes.

## Problema

Adaptar a operação FilaOps ao negócio GAEVA de peças 3D personalizadas, com continuidade da captação à entrega e controle por cliente; aparência parcial não comprova integração [S1, S5].

## Objetivos

| Objetivo | Verificação futura |
| --- | --- |
| Preservar jornadas B2B/B2C integradas | Executar ambos os cenários aprovados, com os mesmos registros da ficha às visões globais [S1] |
| Evitar avanço operacional indevido | Demonstrar bloqueios financeiros, técnicos, cliente e Qualidade no recorte [S1, S4] |
| Transformar por reuso rastreável | Relacionar capacidade existente, mudança, contrato e teste por módulo [S6] |

## Usuários

Admin administra plataforma/permissões; Gerente opera alçadas concedidas; Produção executa operação autorizada; Designer realiza trabalho técnico autorizado; cliente consulta/decide no portal isolado. Vendedor e responsável técnico são responsabilidades permissionadas. Não inferir permissão por cargo ou acesso à conversa [S1, S2, S4].

## Escopo

Transformação funcional e visual incremental, ficha central e registros únicos, atendimento integrado, jornada comercial/produtiva brasileira, compatibilidade e preservação dos dados existentes. Fundação e plataforma precedem o piloto Comercial; dependências da jornada são contratos compartilhados, sem novos módulos por aba [S1, S6, mandato].

Escopo corrigido pelo proprietário: o mesmo produto atende Gaeva3D e DryMaia desde a preparação, com operações/dados separados. Não adiar automaticamente DryMaia, separar produtos ou atrelar materiais/processos à marca. Baseline declarado: FilaOps já abrange ambas; Discovery valida cobertura, lacunas e reuso concreto antes de propor adaptação. Variantes de configuração/workflow dependem de requisito real distinto, não de marketing.

## Fora do escopo desta entrega

Implementação e operação; reconstrução integral da base; stack legada automaticamente reativada; microserviço/container por módulo; instalação de três CRMs; marketplaces imediatos; recriação automática de MOD-012; nova loja/temas; homologação fiscal ou promessa de produção. Site/API/Generative UI permanece atualização futura do produto final conforme S2, sem excluir o restante.

## Requisitos

| ID | Requisito e aceite observável futuro | Fonte | Prioridade |
| --- | --- | --- | --- |
| REQ-01 | Ficha e agregadores referenciam os mesmos clientes, propostas, pedidos e histórico; cenário não cria duplicatas ao retomar | S1, S4 | MUST |
| REQ-02 | Preservar versão aceita, referências e identidade do pedido; retrabalho cria execução filha, sem nova venda | S1 | MUST |
| REQ-03 | Publicação comercial exige vendedor; rascunho IA não publica nem confirma pedido | S2 | MUST |
| REQ-04 | Humano assumido suspende mensagens públicas do bot; somente responsável autorizado devolve | S2 COM-014 | MUST |
| REQ-05 | Aplicar fila/modos/capacidade/reservas e auditoria conforme COM-015–026; não inventar políticas pendentes | S2 | MUST |
| REQ-06 | Abrir ficha com cliente/oportunidade/pedido correto; preservar conversa e edição; prévia é ação distinta | S2 COM-007/027 | MUST |
| REQ-07 | Isolar cliente, arquivos e audiência de Threads; autorização de servidor impede acesso direto indevido | S1, S4 r8 | MUST |
| REQ-08 | Preservar entrada de 50% Pix na condição parcial, aprovação 2D, confirmação antes da modelagem, dupla aprovação 3D e gates finais | S4 r10 | MUST |
| REQ-09 | Postagem exige aprovação final do cliente, Qualidade interna liberada e integral confirmado; testar cada bloqueio separado | S4 | MUST |
| REQ-10 | Aplicar guia/shell GAEVA e acesso por permissão às superfícies migradas; demonstrar estados de falha e dados indisponíveis | S1, S2 COM-028, S5 | MUST |
| REQ-11 | Plano técnico preserva identidade/histórico por mapeamento reconciliável; não transplanta identificadores legados por suposição | S6 | MUST |
| REQ-12 | Substituir o módulo Mensagens FilaOps por Comercial; spec contém mapa de rotas, permissões, eventos e links, preservação de histórico/anexos e desativação gradual, sem módulo Mensagens permanente paralelo | Adição literal do mandato; S5 | MUST |
| REQ-13 | Inventariar e reaproveitar guia e telas prontas de Atendimento por caminho/revisão/hash; comparar com PRD42/spec23 e adaptar lacunas comprovadas sem redesenho do zero | Adição literal; S3, S7, S10 | MUST |
| REQ-14 | Preparação técnica entrega evidência de fonte/repositório canônicos e separação desenvolvimento/testes/produção, builds Docker/Compose versionados e modelos de configuração sem segredos, estratégia de migração/backup/restauração/retorno, requisitos VPS justificados e plano de CI | Adição literal do mandato | MUST |
| REQ-15 | Preservar pipeline/Kanban Comercial no Atendimento, workflow produtivo KP-01 e fila de impressão distinta. UI/UX recomenda interação por fluxo com justificativa, reaproveitando telas/guia, teclado e alternativa sem arraste; impressão pode usar lista/tabela/híbrido ou Kanban conforme evidência | Mandato adicional atual; S2, S4, S11 | MUST |
| REQ-16 | Contratos de domínio e plano de validação contemplam Gaeva3D e DryMaia no mesmo produto, com isolamento de dados/operações e capacidades de materiais/processos independentes de empresa | Correção literal atual no mandato | MUST |

Aceite REQ-16 na preparação: matriz empresa→jornada→capacidade da base→reuso/lacuna→isolamento, sem preencher desconhecidos com suposição. Topologia decidida pelo usuário: mesma base de código em dois servidores/instalações independentes, com banco/dados, arquivos, credenciais, canais, marca, configurações e backups próprios. Plano de teste futuro cobre ambas e impede acesso cruzado indevido. Templates de desenvolvimento/build/Docker/implantação reutilizáveis permitem parametrizar cada instância sem segredos versionados ou fork por empresa. Material/processo é configurável por instalação, nunca hardcoded pela marca; verificar capacidade já existente no FilaOps. Arquitetura detalha essa topologia, sem reabrir servidor compartilhado/multi-tenancy como decisão de negócio. Nenhum deploy ou provedor está autorizado por este aceite documental.

Aceite REQ-15: matriz UI/UX distingue atores, ordem/prioridade, dependências, estados, permissões e transições por domínio; não converte estado da conversa em etapa comercial ou aprovação. Sete colunas KP-01 preservadas; seis etapas comerciais herdadas não aprovam saltos/transições por inferência; impressão não herda essas colunas. Apresentar carregamento, vazio, bloqueio e falha de transição e controles sem arraste. Escolha visual é responsabilidade delegada da equipe, sem pedir que o usuário desenhe a interface.

Aceite de REQ-12: distinguir Mensagens (entrada legada), notificações (eventos/avisos), Atendimento (superfície comercial) e Comercial (domínio); migrar vínculos e demonstrar plano de continuidade sem excluir notificações necessárias. Remover módulo não autoriza apagar dados. Aceite de REQ-14: Arquitetura/DevOps apresentam caminhos, comandos e resultados reais dos checks possíveis; o que não for verificado fica pendente, sem afirmar pronto para desenvolvimento. Nenhum build, template operacional ou configuração foi criado por Product; estes são entregáveis dos próximos donos dentro do escopo que o principal atribuir. Deploy, publicação e compra ficam fora desta preparação.

## Regras de negócio

| ID | Regra | Fonte |
| --- | --- | --- |
| RULE-01 | Lead, proposta e pedido operacional são distintos; mover card não libera fabricação | S1, S2 |
| RULE-02 | Configuração financeira global pertence ao Admin; aprovação operacional é permissionada e auditável | S1 |
| RULE-03 | Aceite, comprovante e recebimento confirmado são distintos; entrada é abatida do saldo | S1, S4 |
| RULE-04 | Aprovação é vinculada ao conteúdo/revisão; alteração não herda aceite; silêncio não aprova | S1, S4 |
| RULE-05 | Threads, conversa, aprovação e notificação não são intercambiáveis; menção não concede acesso | S4 |
| RULE-06 | Não deixar a plataforma sem último administrador ativo, nem apagar autoria ao desativar usuário | S1 |

## Riscos

Matriz r11 precede PRD r42: reconciliar delta antes da spec. Banco lógico único não prova compatibilidade nem sincronização: Discovery deve propor limites transacionais e contratos. Mudança de dados pode perder vínculos: especificar reconciliação, cenários de compatibilidade e retorno, sem executar migração. Mocks podem aparentar operação real: exigir evidência de integração por fase. Referência de fornecedor não comprova licença/edição instalada: verificar apenas componentes candidatos antes de adoção [S2, S3, S6].

## Métricas de sucesso

Aceite funcional conforme objetivos e REQ acima, após implementação autorizada. Receita, SLA, produtividade e redução de retrabalho: baseline e metas não definidos nas fontes; não inventados. Tempo histórico de entrega não é estimativa atual.

## Referências

Ver catálogo S1–S9 e revisões em `escopo-aprovacoes.md`; proposta não substitui essas fontes.

## Melhorias candidatas para o Brasil — não são requisitos confirmados

A autorização atual permite melhorar a base FilaOps e adaptar fluxos ao negócio brasileiro, sem conservar limitações da base por padrão. As propostas abaixo são hipóteses de produto, não alegações de mercado ou compromisso de integração. Prioridade é de investigação, não autorização de implementação; nenhuma proposta amplia automaticamente o piloto.

| Candidato | Prioridade proposta / recorte | Razão e comparação necessária | Aceite para decidir adoção |
| --- | --- | --- | --- |
| BR-P01 Localização pt-BR, moeda BRL e apresentação de datas/horários | Alta investigação; piloto nas superfícies já previstas | Comparar convenções do PRD/guia com base real, sem alterar unidade de estoque/custo silenciosamente | Inventário por tela/campo, exemplos esperados, precisão/conversão e fuso explicitados; testes propostos e lacunas rastreáveis |
| BR-P02 Pagamento, fiscal e privacidade aplicáveis | Alta investigação; contratos do piloto, execução conforme fase aprovada | Reusar decisões Pix/cartão e Fiscal do PRD; descobrir requisitos aplicáveis com fontes primárias atuais | Matriz de aplicabilidade e fonte/data; distinguir obrigação, escolha de produto e limitação técnica; sem promessa de compliance, gateway ou homologação |
| BR-P03 Visibilidade de carga/capacidade/material da fazenda | Média investigação; complemento operacional ou roadmap conforme lacuna | Comparar recursos FilaOps com a fila e produção GAEVA, evitando segundo cadastro/programador | Cenário de decisão do operador, origem dos dados e bloqueios demonstrados; ganho esperado descrito sem números inventados |
| BR-P04 Custeio, perdas/reimpressão, qualidade e expedição | Média investigação; roadmap para melhorias além das regras já fechadas | Preservar identidade e rastreabilidade existentes; comparar lacunas de custo e execução sem inventar fórmula ou prioridade | Exemplo reconciliável por peça/pedido, unidades e origem dos custos; distinção refugo/retrabalho/venda e impactos sobre gates |
| BR-P05 Eficiência das jornadas B2B/B2C | Média investigação; roadmap além do piloto aprovado | Verificar redigitação e contexto real com ficha/portal; não excluir público nem copiar benchmark por aparência | Cenário antes/depois baseado em fontes do projeto, permissões e continuidade dos mesmos registros; proposta priorizada pelo principal |

Discovery deve usar primeiro os PRDs originais, comparar reuso versus mudança e limitar pesquisa à decisão afetada. Afirmações sobre concorrentes, mercado e regras legais/pagamento permanecem NÃO VERIFICADAS nesta rodada; exigem fonte primária atual antes de sustentar recomendação. Não se fez pesquisa externa neste adendo. A equipe propõe alternativas; principal conduz aprovação de escopo quando necessária.

## Perguntas abertas

| Questão | Dono / prazo | Impacto |
| --- | --- | --- |
| Conduta IA aguardando humano; precedência de escalas/conflitos; limites híbrido; reservas durante tolerância; empate residual | Principal consolida decisão humana, antes do G1 dependente | Impede fechar apenas políticas afetadas; manter pendente conforme S2 |
| Transições/saltos/retornos/perda/reabertura, dados por etapa e critérios observáveis do fechamento | Principal/proprietário, antes do recorte correspondente | Não preencher com comportamento padrão de fornecedor |
| Demais alçadas e fórmulas ainda marcadas em debate no PRD r42 | Product/principal, antes da spec dependente | Inventário completo da seção S2 deve acompanhar Discovery; não significa nova aprovação necessária de COM já fechado |

Layout detalhado, mecanismo de integração, esquema e testes técnicos ficam com os setores seguintes. Nenhuma pergunta foi enviada diretamente ao usuário.
