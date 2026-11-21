> Contexto TFD · 681 palavras · 1210 tokens (o200k_base)

# Specs de página e componente — MT-A02r1

Contrato visual/interação normativo: [UX spec](../ui-ux/ux-spec.md) e [matriz U01–09/V01–15](../ui-ux/screen-matrix.md), congelados no source-manifest. Fontes/design tokens/assets r38/r39 permanecem os existentes. Nada foi renderizado ou implementado nesta síntese; contraste, teclado nativo, temas, zoom e mobile exigem execução futura por Frontend e QA UI independente.

## Resolução vinculante da divergência da prévia

**DEC-UX01, alvo proposto nesta spec:** Prévia de oportunidade e ficha contextual do Atendimento usam o mesmo componente modeless. O `modeless:false` observado em `opportunity-client-panel.js` é estado da fonte/protótipo a adaptar na implementação, não requisito do alvo. Essa adaptação não altera a fonte agora nem converte automaticamente Contatos ou navegação mobile em modeless. Contatos mantém contexto próprio que pode usar backdrop segundo regra específica; navegação móvel é superfície separada, pode conter foco. Compartilhar dados/tabs não exige compartilhar modalidade. Precedência: fluxo específico spec23/COM027 + decisão visual delegada acima da regra genérica de Drawer/Sheet do guia.

| Componente proposto / estado | Entrada/saída e interação | Aceite / permissão |
| --- | --- | --- |
| ContextPreview (U04/U05) | Origem tipada conversation/opportunity e vínculo autorizado; GET contexto por origem. Abre região nomeada com título/Fechar, sem aria-modal/inert/backdrop/focus trap. Tab/ShiftTab alcançam composer; Escape fecha superfície interna, restaura foco ao gatilho ou próximo item lógico | V04/V13: preservar cliente/pedido/tab/scroll/draft; A→B invalida request antigo; sem pedido não inventa um. Autorizar no servidor a cada leitura/ação |
| Ficha navigation | Prévia abre painel; Abrir ficha navega registro/aba ERP exatos com retorno à vista/contexto originais | Não duplicar cadastro/aba por seleção arbitrária; edição não salva protegida; 403/404 sem informação de outro cliente |
| ConversationList/Composer (U02) | Rascunho por ator/conversa; seleção por epoch; enviar cria uma operation_id por intenção, pending/unknown referencia mesma tentativa | V02/V11: não enviar novamente por timeout; retry exato após mudança de versão não altera expected_version original; IDEMPOTENCY_CONFLICT não exibe sucesso anterior |
| Queue/Collaboration (U03/U09) | Oferta/assumido/capacidade/pausa/prioridade e clocks autoritativos; invite pending com Aceitar/Recusar só ao destinatário | V03/V09: pending sem ACL/vaga, recusa sem transferência; somente resultado confirmado altera principal; nenhum TTL60s herdado |
| OpportunityBoard (U05) | Seis etapas e Ganho/Perdido; clique navega ficha, Prévia separada; menu Mover equivale ao drag | V05: destino permitido pelo servidor;409 restaura posição/contexto e explica causa segura; D03 não resolvida bloqueia ação, não muda dinheiro/gates |
| ProductionBoard (U07) | Sete colunas KP01, uma encomenda/card; detalhe peça/OP; Aguardando até início confirmado | V07: aprovações dentro colunas; sem número financeiro na projeção; KP03/05 não viram política implementada sem D05 |
| PrintQueueTable (U08) | Default tabela+detalhe: pedido/peça/OP/revisão/material/unidade/recurso/quantidade/prioridade/bloqueio/instante e fonte da disponibilidade | V08: sort é apresentação, não despacho; sem dado “Não informado”; mesma seleção/vínculo do domínio, sem scheduler/cadastro paralelo |
| StateFeedback | loading/empty/filter-empty/unavailable/forbidden/conflict/unknown distintos; skeleton/aria-busy, motivo inline permitido e anúncio curto | V10/V12: ausência não zero; limpar projeção revogada; campos sensíveis não vazam em tooltips/IA/eventos/download/export |

Tokens/tipo/raios/fontes: consumir os nomes semânticos congelados da UX spec e arquivos do manifesto, sem dependência nova autorizada por mera citação. Componente não cria segunda linguagem visual. Resize tem Diminuir/Ampliar/Restaurar por teclado; arraste opcional. Tabs usam setas/Home/End; link é link. Abertura explícita pode focar título; atualização de dados não rouba foco. Escape nunca apaga rascunho.

Estados de erro mapeiam OpenAPI:401 pede autenticação no produto,403 ação negada sem dados,404 contexto indisponível,409 VERSION_CONFLICT recarrega mantendo draft e não reenvia,409 IDEMPOTENCY_CONFLICT exige resolver operação original,409 POLICY_UNRESOLVED/GATE_NOT_SATISFIED mostra bloqueio seguro,202 acompanha tentativa existente,503 indisponibilidade real. Sucesso só após confirmação; “entregue/lido” depende evidência do canal, não persistence local.

Validação futura: percorrer U01–09 com teclado/leitor/toque, V10–15 e nomes pt-BR longos; containers320/360/480 e limites de viewport da UX spec, zoom200%, temas/forced-colors/reduced-motion. Medir pares de contraste, foco sem recorte, alvo44px toque e visibilidade do compositor/Fechar com teclado virtual. Esses são aceites propostos da fonte local, não resultados obtidos. Nenhuma captura de mock é evidência funcional.
