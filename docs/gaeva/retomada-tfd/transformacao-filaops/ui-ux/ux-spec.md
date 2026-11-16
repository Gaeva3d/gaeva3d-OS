# UX SPEC / MT-U01 — revisão 1

GAEVA-TRANSFORM-001 · preparation/UIUX revision1 · 10/11/2026. Dono TFD-ui_ux. Handoff para MT-A02, Frontend e QA UI; proposta documental, sem implementação ou aprovação de gate. Rota recebida [host-correlation-id-omitted]. Escopo atual: um GAEVA OS sobre FilaOps + base ChatbotX escolhida. Contexto histórico de outra empresa não orienta estas telas.

## Fontes e precedência

`source-manifest.json` congela caminhos, bytes e SHA256; revisões declaradas não equivalem a versão Git. Arquitetura: cinco hashes recebidos conferidos integralmente. PRD Comercial42, spec23, KP01/02/04 e C00–06 orientam comportamento; D01–08 continuam propostas. Guia `docs/design/design-guide.md`, catálogo `docs/design/index.html` e mockup `docs/design/mockups/comercial/index.html` são a referência existente, não um sistema de design novo. Catálogo e mockup são demonstrações, sem comprovação de integração. R38 CSS e R39 JS são referências de recurso, não revisão homogênea do produto.

Conflitos documentados, sem correção da fonte: guia §6 contém regra genérica de contenção de foco para Drawer/Sheet, mas spec23 §3 e C02 exigem drawer modeless no Atendimento. Aplicar a regra específica do fluxo. `opportunity-client-panel.js` chama `showGlobalClient(...modeless:false)` na prévia de oportunidade: não reutilizar esse comportamento literalmente como garantia de modeless. Preservar desenho e contexto; MT-A02 deve resolver essa divergência antes da implementação dependente. A regra específica permite backdrop em Contatos; proposta deste recorte é manter a prévia compartilhada modeless também na oportunidade para continuidade, sujeita à revisão final. Navegação mobile é superfície separada e pode conter foco; não transformar a ficha em modal por usar o mesmo nome drawer.

## COMPONENT_SOURCE_INVENTORY / direção visual

Selecionados: fontes nativas do projeto, caminhos no manifesto. `index.html` do guia continua sendo catálogo acumulado; este pacote não cria catálogo concorrente. Estender apenas estados faltantes no catálogo existente na futura Task autorizada. Componentes reutilizáveis: shell/nav do mockup; conversa/lista/composer; global client drawer, tabs e histórico; quadro `.twenty-board`; contexto de oportunidade de `opportunity-client-panel.js/css`; tipos e tokens de `fluid-typography.css` e snapshot HIG. IDs locais de handoff U01–U09 estão na matriz, não são novos módulos ou widgets implementados.

Referências externas novas: N/A; reuso local suficiente. Apple-Hig-Designer snapshot `ff17b91ff2903ecd52940afabf97de5a73c9cd1b` é declarado no guia, commit não revalidado na origem. shadcn/Radix/TanStack/Lucide citados no guia são candidatos, não dependências aprovadas/instaladas por este MT. Licenças e edição do pacote FilaOps/ChatbotX continuam na evidência Discovery/C06; não copiar subárvores comerciais ou exemplos JSX comunitários como componentes acessíveis prontos. Nenhum asset novo ou biblioteca instalada. Alternativa descartada: template novo/reconstrução do chat, pois perde direção pronta e amplia validação sem necessidade.

Hierarquia proposta: título/contexto → filtros e ação primária → trabalho real → detalhes sob demanda. Evitar painel de métricas decorativas. Reusar pilha system font, `--text-title`, `--text-heading`, `--text-body`, `--text-label`, `--text-control`, `--text-caption` fluidos. Campos ≥1rem; não encolher texto para caber. Títulos completos, dados localizados pt-BR, moeda/unidade explícitas; financeiro legado não vira BRL por formatação.

Superfícies sólidas `--bg-primary/secondary/tertiary`, texto `--label-primary/secondary`, separadores `--separator`. `--system-blue` identifica ação/foco conforme adaptação já existente; verde/laranja/vermelho acompanhados de rótulo, nunca decisão apenas por cor. Guia menciona petróleo em princípio histórico: não criar outro token concorrente sem conciliação. Contraste de cada par deve ser medido; token de sistema por si não garante AA. Espaços 8/12/16/24px derivados da escala; formulário com largura controlada, quadro/tabela fluidos. Densidade confortável padrão; 36/32px desktop e 16/12px padding são prévia do catálogo, ainda não propagação autorizada. Toque mantém alvo44px. Cápsula `--guide-button-radius` preservada onde aplicável; não arredondar cada grupo como card novo.

## Jornadas e ownership

Atendimento: lista + conversa, sem terceiro painel permanente. Selecionar conversa carrega seu histórico, vínculo e rascunho por ator/conversa. Nome/Ver cliente abre ficha compartilhada na mesma seleção. Troca rápida invalida resposta antiga por ID/versão; nunca pintar cliente A sobre B. Assumir só após confirmação autoritativa, sem converter oferta em posse; bot público suspenso pelo contrato. Sair/fechar/trocar vista não devolve à automação. Canal sem capacidade mantém histórico autorizado e rascunho, com ação indisponível explicada.

Prévia abre drawer contextual; Abrir ficha navega registro/aba ERP exatos, sem selecionar primeiro pedido arbitrário ou criar pedido. Sem vínculo: “Sem pedido vinculado”, oferecer consulta autorizada dos pedidos do cliente. Aba ERP indisponível oferece recuperação sem multiplicar abas; edição não salva é protegida. Guardar seleção, filtros, scroll, tab, pedido selecionado e rascunho; fechar retorna ao gatilho existente, ou próximo item lógico visível se ele saiu da lista.

Drawer modeless: região nomeada com título/fechar visível, sem aria-modal, backdrop bloqueante, inert no fundo ou focus trap. Abertura explícita pode focar título; Tab e Shift+Tab alcançam conversa e painel. Escape fecha apenas superfície contextual mais interna; nunca apagar draft. Redimensionar por arraste é opcional: controles Diminuir/Ampliar/Restaurar com teclado, limites pelo container e largura textual preservada. Mobile ocupa área útil, mantém Voltar/Fechar e contexto; não oculta ação sob teclado virtual. Tabs irmãs seguem setas/Home/End e controles reais; links continuam links. Threads são internas e permissionadas, não mensagens externas nem notificações técnicas.

Comercial: seis etapas Novo contato, Qualificação, Diagnóstico, Proposta, Negociação, Aguardando confirmação financeira; Ganho/Perdido separados. Clique principal navega ficha, Prévia é controle separado. Menu Mover solicita apenas destinos definidos e permitidos pelo servidor; arraste é equivalente opcional. Sem regra D03, ação explica política pendente. Movimentar não confirma dinheiro, pedido, aprovação ou automação.

Produção: Caixa de entrada, Modelagem 3D, Impressão, Montagem, Qualidade, Expedição, Enviado. Uma encomenda/card; OPs/peças/partes no detalhe. KP02 Aguardando até início autorizado; entrar/abrir card não inicia cronômetro. KP03/05 e agregação multi-peça permanecem propostas D05. Dupla aprovação da mesma revisão antes de impressão; QC e aceite final cliente independentes dentro Qualidade. Entrada elegível permite fabricar até QC; saldo bloqueia postagem. Sem timestamps: “Não medido”, sem somar horas paralelas como prazo.

## Fila de impressão — escolha proposta

Default: tabela operacional com detalhe de recurso no mesmo drawer. Mostra vínculo pedido/peça/OP, revisão, material/unidade, recurso, quantidade, prioridade recebida do domínio, bloqueio seguro e capacidade com origem/instante. Ausência é “Não informado”, não zero. Prioridade visual não cria algoritmo de despacho. Ordenação escolhida pelo usuário é só apresentação, claramente rotulada; comando de prioridade exige contrato/permissão/motivo. Sem fonte de disponibilidade, não anunciar recurso livre.

| Alternativa | Densidade e comparação entre recursos | Relação espacial por etapa | Default recomendado |
| --- | --- | --- | --- |
| Tabela + detalhe | ✓ | — | ✓ |
| Kanban puro | — | ✓ | — |
| Híbrido quadro + tabela simultâneos | ✓ | ✓ | — |

Tabela permite comparar capacidade/material/bloqueio sem espalhar OPs em colunas que já pertencem à Produção. Kanban alternativo não é necessário neste recorte; só propor depois de pesquisa com dados reais se melhorar agrupamento por recurso. Híbrido simultâneo duplica seleção e ocupa espaço; detalhe contextual já resolve profundidade. Não inventar status da fila, scheduler ou ordenação automática.

## Estados transversais e segurança

Loading preserva geometria com skeleton/aria-busy; atualização conserva último dado autorizado rotulado com instante. Vazio distingue primeiro uso, filtro sem resultado e dado ainda não integrado. 403 informa ação negada sem campos do objeto; 404 contexto indisponível sem confirmar existência. 503/canal não integrado mantém rascunho e histórico permitido; retry somente após falha inequívoca sem efeito.

Enviar: texto digitado → tentativa pendente → resultado confirmado. Sem confirmação, “Resultado do envio em verificação”; não mostrar entregue nem botão de reenviar com nova operação. C01/C05 reconciliam a tentativa original. 202 acompanha mesma operação. 409 VERSION_CONFLICT recarrega projeção e conserva draft; 409 IDEMPOTENCY_CONFLICT informa conflito de operação sem exibir resultado anterior; nova chave só depois de resolver tentativa original. 409 POLICY_UNRESOLVED/GATE_NOT_SATISFIED mostra bloqueio seguro, não avanço. Rejeição de movimento restaura posição/seleção/scroll e draft; mensagem inline persistente com motivo autorizado e anúncio leitor, sem toast de sucesso. Não reenviar automaticamente edição após reload.

Convite colaborativo pending não concede leitura/resposta/posse/capacidade. Destinatário pode aceitar ou recusar; após accepted revalidar concessão∩RBAC e refletir apenas resultado confirmado; declined preserva histórico sem concessão. Recusa não é cancelamento de venda. Portal pending/accepted é outro domínio C02 e não compartilha ACL/TTL com colaboração. Sem prazos inventados. Nenhum custo/margem/audiência restrita em tooltip, busca, evento, export, nome de arquivo ou resposta IA: projeção filtrada pelo servidor, não apenas ocultação visual. Produção recebe liberação/bloqueio seguro sem valores sensíveis.

## Responsividade e aceite visual futuro

Guia §9/10 + COMPONENT-001: até639px uma coluna;640–1023 painéis adaptativos;1024–1439 confortável;≥1440 duplo painel e compacto opcional. Além viewport, testar containers320/360/480px. Mobile mantém colunas essenciais e detalhe, não transforma toda linha em card gigante. Kanban pode rolar localmente com cabeçalhos identificados; alternativa de lista mantém acesso às ações. Zoom200%/fonte ampliada não remove controles nem exige duas direções para leitura comum.

Foco visível sem recorte, texto4.5:1/gráficos e texto grande3:1 conforme guia. Todos controles nomeados, erro associado e anúncio curto por região live sem narrar histórico inteiro ou expor dados restritos. Movimento360/280ms é refinamento local do guia, não regra Apple universal; reduced-motion e fallback sem APIs encerram decoração sem atrasar estado/foco. Temas claro/escuro e cores forçadas precisam checks reais. Overflow, toque, contraste medido, foco nativo, iframe e qualidade visual permanecem NÃO VALIDADOS neste MT estático. Testes futuros na matriz; nenhuma suíte de produto executada.

## SKILL_RECEIPT / limites de encaminhamento

Skill TFD-ui_ux e router lidos; ui-ux-standard, live-design-guide, anti-ai-design e procedimento de decisão consultados. Referências HIG locais e trechos de tokens/padrões foram consultados seletivamente; não se alega leitura integral dos grandes exemplos ou consulta factual HIG externa. Graphify INDEX_STALE → fontes canônicas/rg sem rebuild. Este pacote satisfaz preparação de design para revisão, não contrato executável v2, normative-equivalence, QA independente ou Ready for Dev. Main deve reconciliar a divergência modeless e políticas D01–08 na MT-A02 e anexar a revisão à futura Task única por módulo, com QA antes da aprovação humana.
