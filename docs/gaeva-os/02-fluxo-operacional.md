# Fluxo operacional

Esta nota descreve o fluxo auditado em 2026-09-08. Os quick wins de apresentação não alteram esta sequência nem seus responsáveis.

| Momento | Quem age | Ação atual | Resultado real |
| --- | --- | --- | --- |
| Entrada | Comercial/Admin | Criar pedido | `received`, prioridade normal, um item e anexos associados |
| Recepção | Produção/Admin | Assumir pedido | `briefing_pending`, responsável e atribuição de produção registrados |
| Confirmação | Produção/Admin | Confirmar informações | `modeling`, briefing confirmado; mantém responsável ou usa designer já atribuído |
| Atribuição | Produção/Admin | Selecionar designer existente | Atualiza `order_assignments`; não cria usuário novo |
| Design | Designer atribuído, Produção/Admin | Iniciar modelagem | Registra evento; continua em `modeling` |
| Envio da versão | Designer atribuído, Produção/Admin | Enviar para aprovação | Cria versão pendente em `approvals`; `awaiting_customer_approval` |
| Alteração | Comercial do pedido/Admin | Solicitar alteração com motivo | Decisão na versão, histórico preservado; volta para `modeling` |
| Aprovação | Comercial do pedido/Admin | Aprovar e enviar para Produção | Aprova a versão e move automaticamente para `print_queue` |
| Impressão | Produção/Admin | Selecionar impressora e iniciar | Job em execução e pedido em `printing` |
| Falha | Produção/Admin | Registrar falha e motivo | Job falho; pedido retorna à fila; pode iniciar nova tentativa |
| Fim da impressão | Produção/Admin | Concluir impressão | Finaliza job em execução; pedido em `finishing` |
| Conferência | Produção/Admin | Conferir qualidade, preparar embalagem | `quality_control` / `packaging`, no mesmo agrupamento “Pedido pronto” |
| Expedição | Produção/Admin | Liberar para postagem com confirmação | `shipping` |
| Postagem | Produção/Admin | Marcar como postado | Salva `shipped_at`; rastreamento quando informado |
| Encerramento | Produção/Admin | Finalizar pedido | `completed`; finalizados ocultos por padrão no Kanban |

O fluxo normal mantém aprovação válida antes da impressão. O Designer não tem hoje permissão para registrar a aprovação do cliente ou mover livremente à produção. Eliminar a confirmação inicial, dispensar aprovação por categoria ou ampliar essas responsabilidades exige proposta e aprovação específicas.

## Uso rápido após ajustes de apresentação

1. Comercial abre Novo Pedido, seleciona/cria cliente, preenche o essencial, anexa referências e cria. Detalhes adicionais ficam recolhidos e opcionais.
2. Produção/Admin assume, confirma e atribui o designer no próprio drawer.
3. Designer abre o Kanban em “Meus pedidos”, acompanha trabalho e aprovação, abre o briefing, inicia e envia a versão para aprovação.
4. Comercial/Admin registra o retorno do cliente. A aprovação já envia o pedido para a fila de produção, sem uma segunda ação de envio.
5. Produção escolhe o necessário na sua fila, inicia/conclui impressão, confere, embala e registra postagem/finalização.

“Meus pedidos” é visualização, não concessão de acesso. Pedidos aguardando aprovação podem estar visíveis ao designer sem ação de aprovação disponível. As restrições reais permanecem no banco.

## Kanban e Produção

Kanban é a leitura ponta a ponta: um pedido por card, responsável, prazo, arquivos, histórico e ações rápidas. Produção é o recorte de impressão até expedição com atribuições técnicas e apontamentos opcionais. Ambas já permitem transições produtivas. Não remover uma tela nem criar outra nesta etapa; tornar essa diferença explícita na linguagem.
