# Diagnóstico do estágio 0

Data: 2026-09-08. Entregue antes de alterações na aplicação. Base auditada: `fcb2141b9b665c394050f2185e7cc5a0338b9b9c`, blueprint integral e metadados/funções do Supabase. Não é um teste de ponta a ponta com contas reais.

## Conclusão

O core já existe: cadastro, Kanban, designer, aprovação, jobs, expedição e histórico compartilham os pedidos reais. O ganho imediato vem de clareza e menos informação irrelevante. O principal desvio em relação ao fluxo desejado é de responsabilidade: Produção/Admin confirma antes do Design; Comercial/Admin registra a aprovação e envia automaticamente para a fila. Resolver isso estruturalmente não está autorizado nesta etapa.

## As 16 perguntas da auditoria

| Pergunta | Funcionamento observado |
| --- | --- |
| 1. Como Comercial cria? | `/pedidos/novo`, três passos: Cliente, Pedido, Briefing e arquivos. Seleciona cliente ou cadastra inline; cria pedido e item existentes. |
| 2. Campos obrigatórios? | Cliente selecionado; para cliente novo: nome, telefone com pelo menos 10 dígitos, cidade e UF. Produto entre cinco categorias, quantidade inteira positiva, prazo válido, pagamento Pago/Entrada paga/Faturado. Valor e entrada vazios viram zero; não aceita negativo nem entrada acima do total. Briefing, arquivos, dimensões, acabamento, finalidade e evento corporativo são opcionais. |
| 3. O que acontece ao salvar? | Cria cliente se necessário, pedido, item e depois anexos; atualiza consultas e abre o detalhe completo. Upload com falha pode deixar pedido criado e mostrar aviso. Não é transação única. |
| 4. Em qual status nasce? | `received` (`recebido` na adaptação), prioridade normal, `briefing_complete=false`; responsável inicial é o membro do criador quando encontrado. |
| 5. Como chega ao Designer? | Produção/Admin assume, confirma informações e atribui membro existente como designer. A confirmação leva a `modeling`. É possível chegar ali ainda sem designer atribuído. |
| 6. Como vê os próprios pedidos? | Existe filtro Meus pedidos, mas inicialmente é preciso selecioná-lo. Para Designer ele mostra somente etapa de Design; pedidos dele aguardando aprovação ficam fora desse filtro. |
| 7. Como começa? | No drawer do Kanban, Iniciar modelagem. Exige atribuição existente; registra evento sem criar outra entidade. |
| 8. Como finaliza o design? | Enviar para aprovação cria versão pendente e move o status. O drawer permite essa ação sem exigir o clique anterior de início. |
| 9. Aprovação é obrigatória? | No fluxo normal existente, sim: a última versão aprovada libera impressão e há guardas no banco. Não existe nesta entrega uma decisão configurável de aprovação por produto. |
| 10. Como envia à Produção? | Hoje quem aprova é Comercial do pedido/Admin. A aprovação já move para `print_queue` e retoma a atribuição de produção; não há segundo envio obrigatório. Designer não tem essa permissão. |
| 11. O que Produção preenche? | Seleciona/configura impressora para iniciar a impressão pelo drawer. Pode atribuir responsável e fazer apontamentos de tempo/material/falha na tela Produção. Horas e peso não são campos obrigatórios na entrada comercial. Falha exige motivo; urgência e exceções têm guardas próprios. |
| 12. Como avança até postagem? | Inicia/conclui impressão, vai a acabamento, conferência/embalagem e libera postagem com confirmação. Registra data de postagem, rastreamento quando houver, depois finaliza. |
| 13. Há ações duplicadas? | Kanban/drawer e Produção permitem transições e atribuições do mesmo pedido. Detalhe completo também oferece aprovação e atribuições. Não são bases duplicadas, mas caminhos sobrepostos. |
| 14. Campos antigos confundem? | Detalhe mostra material, cores, direitos de uso e máquina mesmo vazios; Financeiro mostra custos como “Estrutura preparada”. Checklist de etapa no detalhe usa checkboxes sem persistência. |
| 15. Trabalho desnecessário? | Designer precisa selecionar filtro toda vez e ir à aba Produção para localizar atribuição. Cadastro rápido exige cidade/UF, embora opcionais no banco. O checklist sem persistência induz marcação inútil. Confirmação inicial e aprovação por outro papel são trabalho real do fluxo atual, não bugs de label. |
| 16. Linguagem pouco clara? | “Briefing pendente” significa confirmação pela produção; “Concluído”/“Finalizados”, “Expedição”/“Postagem” variam entre telas. Aprovação não explicita sempre que já envia para produção. Dois botões de destaque competem em Design. |

## Complexidade e simplificação

**Comercial:** o formulário já não exige impressora, job, lote, configuração técnica, tempo ou material avançado. Não é preciso reescrevê-lo. Dimensões, acabamento e finalidade podem ficar recolhidos; manter os valores preenchidos. Cidade/UF obrigatórias e valor zero são decisões para revisão, não mudanças silenciosas.

**Designer:** priorizar o filtro existente, incluir acompanhamento da aprovação, dar acesso ao briefing e tornar a atribuição visível. Não criar rota ou cadastro de designers. Não prometer envio direto à Produção antes de decidir a autorização necessária.

**Kanban versus Produção:** explicitar a finalidade de cada tela. O filtro existente “Sem impressora” hoje considera pedidos ainda em Design/entrada; restringi-lo às etapas de impressão evita falsa pendência de máquina. Não substituir nenhuma fonte de dados.

**Campos e telas:** recolher os detalhes opcionais da entrada; ocultar campos legados vazios no detalhe; manter informações históricas preenchidas; retirar checkboxes que não salvam e placeholders de custos. Mover o seletor de designer existente para o resumo do drawer. Não remover funcionalidades persistidas.

## Oito quick wins autorizados

Notas estimadas de 0–10. Todas as linhas são de apresentação/filtro e **não exigem migration**.

| ID | Mudança | Valor operacional | Complexidade usuário | Complexidade técnica | Prioridade agora |
| --- | --- | ---: | ---: | ---: | ---: |
| Q1 | Labels humanos consistentes, mantendo valores internos | 8 | 0 | 1 | 9 |
| Q2 | Recolher detalhes opcionais da entrada; esclarecer mensagem de acesso | 8 | 1 | 2 | 9 |
| Q3 | Designer começa em Meus pedidos e acompanha os seus em aprovação | 9 | 1 | 3 | 10 |
| Q4 | Responsável/designer claros no card; seletor existente visível no resumo | 9 | 1 | 3 | 9 |
| Q5 | Uma ação principal destacada por momento; aprovação explicita envio à produção | 9 | 1 | 3 | 10 |
| Q6 | Ocultar checklist sem persistência, campos antigos vazios e custos fictícios | 9 | 0 | 2 | 9 |
| Q7 | Corrigir escopo do filtro Sem impressora; explicar recorte da Produção | 8 | 0 | 2 | 8 |
| Q8 | Empty state de Meus pedidos e briefing inicial no drawer do Designer | 8 | 0 | 2 | 8 |

Q3 muda o conjunto mostrado por um filtro, sem ampliar RLS ou permitir aprovar. Q5 altera hierarquia visual/texto, mantendo ações secundárias, confirmação e guardas. Q6 não apaga coluna ou informação histórica.

## O que fica fora

| Necessidade | Motivo para não executar |
| --- | --- |
| Comercial → Design sem confirmação intermediária | Muda fluxo central e guardas; exige decisão e possível alteração estrutural |
| Designer aprova ou envia diretamente à impressão | Muda responsabilidades/permissões e RPC; aprovação necessária |
| Aprovação opcional por categoria | Lacuna real de regra/configuração; não improvisar campo ou bypass |
| Unificar entrada em operação transacional | Requer análise de endpoint/RPC e tratamento de uploads; não é ajuste de UX |
| Regras novas de SLA, briefings, capacidade, custos ou indicadores | Estágios posteriores; preservar ideia no backlog |
| Remover cidade/UF obrigatórias na entrada | Pode ser só frontend, mas muda regra comercial; propor primeiro |
| Novas tabelas de contexto/configuração | Não há estrutura adequada existente, mas documentação não justifica migration |
| Domínio/deploy ou tabelas de Dry | Fora do escopo desta entrega |

## Fluxo após os quick wins

Comercial cria com o essencial → Produção/Admin assume, confirma e atribui → Designer vê Meus pedidos, inicia e envia versão → Comercial/Admin aprova e envia à fila em uma ação → Produção imprime, confere, embala, posta e finaliza.

A experiência fica mais clara; a sequência operacional permanece. Para chegar literalmente ao handoff direto desejado, primeiro aprovar a mudança de responsabilidades. Próximo passo recomendado depois de validar os quick wins: estágio 2, proposta curta baseada nos pedidos reais.
