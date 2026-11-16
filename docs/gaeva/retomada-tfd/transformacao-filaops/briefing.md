# Briefing — transformação FilaOps em GAEVA OS

Revisão documental 3, 10/11/2026. Consolidação solicitada na rota MT-P01/revision2 ([host-correlation-id-omitted]); mantém o histórico das duas adições já processadas. Preparação documental; revisão independente pendente. Fontes e precedência em `escopo-aprovacoes.md`; mandato em `preparacao-autorizada.md`.

Adição atual: preparar fundação de desenvolvimento para repositório, Docker e futura VPS; reaproveitar guia e telas prontas de Atendimento; aposentar Mensagens FilaOps em favor do Comercial. Preservar dados/anexos e mapear rotas, permissões, eventos e links; não excluir notificações por equivalência de nome. Inventário S10 e entregáveis dos próximos donos em `escopo-aprovacoes.md`; aceites REQ-12–14 no PRD proposto. Sem deploy autorizado ou prontidão técnica verificada.

Pipeline/Kanban Comercial no Atendimento e sete colunas produtivas KP-01 estão preservados; fila de impressão pode usar lista/tabela/híbrido ou Kanban conforme avaliação delegada à equipe. REQ-15 e matriz UI/UX S11 diferenciam os quatro fluxos, atores, dependências e estados. Não perguntar ao usuário como desenhar; pesquisar a política de ordenação da fila antes de presumir regra. Pendências comerciais/produção realmente abertas permanecem explícitas.

## Problema e valor

O PRD geral r3 define operação B2B e B2C de peças 3D personalizadas, da captação até entrega. A base FilaOps é funcional/transacional; a transformação exige adaptar jornada brasileira, ficha central, aprovações, atendimento, autorização e experiência GAEVA. Trocar nome e cores não satisfaz essa intenção. O mapa de páginas de 29/10 distingue conteúdo FilaOps existente, adaptação parcial e esboço; nenhum desses estados comprova operação integrada. Sem transformação, permanece o risco de redigitação, histórico fragmentado e avanço indevido de produção/expedição. Não há custo financeiro ou baseline de retrabalho medido nas fontes consultadas.

## Usuários e fluxo

PRD geral, seção Usuários: Admin, Gerente, Produção e Designer; cliente externo no portal. Comercial/vendedor e responsável técnico são funções permissionadas, não novos perfis presumidos. Jornada: WhatsApp → atendimento/briefing único → validação técnica e proposta → vendedor publica → aceite e pagamento confirmado → modelagem e aprovações → fabricação → Qualidade e fotos finais → quitação → postagem/rastreio. Catálogo e personalizado preservam diferenças; B2B não elimina B2C. Fonte: PRD geral; Comercial r42, Jornada final; MOD-003 r10, condição financeira.

## Escopo e restrições

Topologia fechada pelo usuário: mesma base de código em dois servidores independentes, cada um com banco/dados, arquivos, credenciais, canais, marca, configurações e backups próprios. Templates de desenvolvimento/Docker/VPS devem ser reutilizáveis entre as duas instalações. Materiais/processos são opções por instalação, não capacidades fixadas por marca; verificar reuso FilaOps antes de propor mudança. Não há questão aberta de tenancy compartilhada nem requisito de fork/deploy nesta fase.

Correção vigente do proprietário: um único produto atende Gaeva3D e DryMaia neste escopo de preparação, com operações/dados isolados; nenhuma empresa fica adiada automaticamente. Materiais e processos são capacidades independentes da empresa. FilaOps já abrange ambas segundo o usuário; Discovery verifica a cobertura real para reuso. Não derivar exclusividade FDM/resina ou regras diferentes de páginas comerciais. Configurações específicas só se justificam por requisitos distintos documentados; não é nova autorização de execução ou deploy.

Preservar 11 módulos e sequência recebida pelo principal: MOD-001 Fundação → MOD-002 Plataforma → piloto MOD-004 Comercial, com contratos dependentes de MOD-003/006/008/011 explicitados. Fasear organiza o trabalho, sem reduzir silenciosamente o sistema final a MVP. Prazo de 28/10 no PRD é histórico e não constitui compromisso atual. Budget, capacidade e novo prazo não estão definidos; nenhuma estimativa de horas é produzida por Product.

## Requisitos e regras

Ficha e visões globais operam os mesmos registros. Proposta, pedido e execução não são a mesma entidade de negócio; revisão aceita e histórico devem permanecer. Acesso é contextual, inclusive no servidor. IA auxilia briefing/rascunho, vendedor fecha publicação; humano assumido pausa bot. Pagamento, aprovação do cliente, decisão técnica e Qualidade são gates distintos. Falha ou falta de dados deve ser mostrada como tal, sem falso zero, sucesso ou autorização. Requisitos verificáveis na proposta anexa.

## Referências

FilaOps: base real a confrontar tecnicamente, versão executada não verificada por Product. ChatbotX: base escolhida para estudo/adaptação Comercial; Chatwoot e Twenty: referências funcionais. 3DTag: referência brasileira de comparação. Este setor reutilizou os registros locais, sem nova validação externa nem adoção automática de edição/licença. Guia GAEVA é referência visual; equivalência das revisões e telas pertence à verificação posterior.

## Sucesso e riscos

Critério geral do PRD: jornada autorizada B2B e B2C sem duplicação, com proposta/revisões/aprovações preservadas, fabricação bloqueada quando faltar condição, postagem bloqueada sem quitação e isolamento do cliente. São critérios de aceitação futuros, não testes executados. Dados reais, compatibilidade de migração, reuso licenciado e integração continuam dependentes de Discovery e das fases autorizadas. Não há metas quantitativas de receita ou produtividade aprovadas.

## Lacunas materiais para consolidação pelo principal

Não repetir briefing já decidido. Comercial r42, seção Pendências antes da especificação técnica, mantém decisões de negócio de atendimento/calendários, transições do funil e alçadas. Consolidar somente essas políticas ainda abertas antes do G1 do recorte dependente; não bloqueiam a documentação dos trechos fechados. Sem prazo humano definido: tratar antes da submissão correspondente. As escolhas técnicas de integração, filas, IDs, migração, licença, frontend/runtime e banco devem ser pesquisadas por seus donos, sem questionário técnico ao usuário.
