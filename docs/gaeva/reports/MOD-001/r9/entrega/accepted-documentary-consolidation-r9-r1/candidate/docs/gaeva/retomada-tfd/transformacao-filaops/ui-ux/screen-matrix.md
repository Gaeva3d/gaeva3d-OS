# Matriz tela → fonte → comportamento → teste — r1

Rota MT-U01 revision1. Caminhos completos/hashes em source-manifest.json. IDs U e V são locators desta spec, não Tasks nem testes executados. Contratos C são propostas MT-A01r2, não endpoints implementados. Todas verificações abaixo: PLANEJADAS, owner Frontend executa/self-test; qa_ui inspeciona revisão independentemente, QA Backend cobre transação/ACL.

| ID / tela | Reuso concreto / token | Ação, estado e permissão | Contrato / fonte | Aceite planejado |
| --- | --- | --- | --- | --- |
| U01 Shell/nav | mockup index sidebar/topbar; guia NAV003; label/bg | Ir Atendimento, busca permitida, sino separado; rota velha preserva contexto, não chat novo | C00/02, REQ12, T01/06 | V01 abrir link legado com thread/pedido exatos; aviso operacional não vira conversa; ativo texto+ícone |
| U02 Atendimento | comercial/premium-chat/minimal-composer + refinements r38/r39; text-body/control | Assumir, aguardar, devolver explicitamente; canal não integrado e envio unknown; principal ou concessão responder∩RBAC | C01/03/06, COM014–026, AC03 | V02 duas pessoas assumem: um confirmado, outra409 preserva draft; queda/fechar não liga bot; mesma tentativa desconhecida não duplica |
| U03 Fila humana | queue-list-flat r38; separator/label | Oferta≠posse, disponibilidade/pausa e reserva; prioridade permissionada com motivo, capacidade do domínio | C03/D01/02, COM015–026 | V03 pausar mantém ativos/libera reserva conforme contrato; limite0 não recebe; oferta e reconexão não compartilham clock |
| U04 Prévia/ficha/Threads | client-workspace, opportunity-client-panel, histórico COMPONENT001; bg/text | Mesmo drawer contextual; Prévia≠Abrir ficha; modeless; leitura/edição por registro/campo/audiência | C02/06, spec23§3/4, AC01/02 | V04 A→B rápido descarta resposta A; fechar restaura seleção/scroll/draft; sem pedido não seleciona arbitrário; Tab alcança composer; thread interna não publica |
| U05 Oportunidades | twenty-board e prévia compartilhada; StatusBadge/text-label |6 etapas e Ganho/Perdido distintos; mover só regra permitida; clique navega ficha | C01/04/D03, COM007, REQ15 | V05 menu e drag pedem mesma transição;409 restaura card e seleção; sem regra permanece bloqueado; dinheiro não muda por arraste |
| U06 Pedido/proposta/Portal | tabs Especificação/Pedidos existentes + campos/alert guia | Catálogo antes personalizar, revisão/publicação explícitas; IA rascunho; cliente só audiência publicada | C02/04/05/06, AC04/05 | V06 revisão nova invalida aceite afetado; cliente+técnico mesma3D; comprovante não confirma entrada; arquivo privado negado; portal invite não é colaboração |
| U07 Produção | quadro existente como anatomia, KP01 sete colunas; text-body/label | Aguardando antes início; peças/OP detalhe; gate seguro sem custo; KP03/05 não habilitados como política fechada | C04/D05/06, KP01/02/04 | V07 sete colunas exatas; ausência início não zero/execução; QC+cliente+saldo antes postagem; duas máquinas não somam prazo |
| U08 Impressão | tabela e detalhe guia§6, mesmo drawer; separator/bg | Consulta recurso/material/capacidade/prioridade/bloqueio; permissão operar distinta de financeiro; sem scheduler novo | C04/ADR08, BR-P03, D05 | V08 comparar recursos sem perder seleção; dado ausente “Não informado”; ordenar vista não despacha OP; arquivo/revisão vinculados |
| U09 Convite/acesso | popover acesso chat + alert/status guia | Pending/accepted/declined; destinatário aceita/recusa, sem ACL antecipada; concessão não supera RBAC | C01/03/D04/06 | V09 pending não lê/responde; aceitar concorrente com transferência revalida; recusar não muda principal; nenhum TTL60s inferido |

## Casos reutilizáveis de estado (V10–V15)

| ID | Fixture sintética / procedimento futuro | Resultado a observar |
| --- | --- | --- |
| V10 | Lista com dado carregando, conjunto autorizado vazio, filtro sem resultados, API não integrada e403 |5 mensagens distintas; nenhum zero/resultado simulado; foco de retry alcançável; motivo seguro |
| V11 | Comando aceito com resposta perdida; retry exato após versão agregada mudar; mesma chave com outro alvo | Reconciliação original; replay autorizado do original;409 divergente sem resultado antigo; UI não gera nova operação para contornar unknown |
| V12 | Revogar permissão com drawer aberto, tooltip/busca/export/IA/evento disponíveis | Remover projeção sensível e impedir ação; nenhum custo/margem/audiência em canais laterais; servidor decide |
| V13 | Percorrer U01–U09 com teclado, leitor, mouse/toque; mover/resize sem gesto | Foco e retorno previsíveis; labels, live announcement curto; sem trap na ficha; controle equivalente ao arraste e resize |
| V14 | Container320/360/480, viewports639/1023/1439/1440, zoom200%, nomes longos PTBR, tema claro/escuro/forced-colors | Sem corte de ação, rascunho ou texto essencial; scroll local navegável; contraste medido conforme guia; alvo44 toque; cabeçalhos identificados |
| V15 | Reduced-motion, sem APIs progressivas, interrupção de animação, teclado virtual móvel | Estado/foco imediatos, fallback sólido/estático; fechar não aguarda animação; composer e Fechar visíveis |

Exemplo de conteúdo autorizado: oportunidade sintética “Modelo de catálogo A”, sem pedido → prévia oferece consultar pedidos, não cria venda. Exemplo produtivo sintético: duas peças em máquinas paralelas, três horas cada → seis horas-máquina não viram seis horas de prazo. Exemplo envio: timeout após despacho → “Resultado do envio em verificação”, sem sucesso/reenviar cego. Todos são fixtures futuras, não dados da empresa.

Revisão independente deve primeiro comparar hashes, C01r2 e divergência de modeless; depois avaliar completude de estados e aceites. Renderização real e teste funcional só em ambiente futuramente autorizado; esta matriz não os substitui.
