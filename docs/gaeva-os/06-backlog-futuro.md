# Backlog futuro

Atualizado em 2026-09-08. Ideias preservadas, **não autorizadas para implementação automática**. Os itens do blueprint ficam subordinados ao roadmap conservador. Notas são estimativas de 0–10, não medições: valor operacional / complexidade do usuário / complexidade técnica / prioridade agora.

## B01: Impedimentos por etapa e filtros salvos

1. **Ideia:** Impedimentos por etapa e filtros salvos.
2. **Problema que resolve:** Identificar falta de briefing, aprovação, designer e motivo de bloqueio sem alarmes prematuros.
3. **Quando passa a fazer sentido:** Estágio 2, após validar pedidos reais.
4. **Dados necessários:** Status, atribuições, aprovação, bloqueios existentes.
5. **Dependências:** Decisão de UX e revisão dos sinais já exibidos.
6. **Complexidade técnica:** 4/10.
7. **Avaliação:** valor 9/10; complexidade para usuário 1/10; complexidade técnica 4/10; prioridade agora 8/10.

## B02: Painel operacional existente

1. **Ideia:** Painel operacional existente.
2. **Problema que resolve:** Destacar atrasados, urgentes, aprovação, fila, impressão e postagem.
3. **Quando passa a fazer sentido:** Estágio 2, se o painel atual não responder às dúvidas reais.
4. **Dados necessários:** Pedidos, prazos, status e prioridades.
5. **Dependências:** Reaproveitar painel e consultas; sem dashboard novo.
6. **Complexidade técnica:** 4/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 1/10; complexidade técnica 4/10; prioridade agora 6/10.

## B03: Handoff e aprovação por responsabilidade

1. **Ideia:** Handoff e aprovação por responsabilidade.
2. **Problema que resolve:** Reduzir espera entre Comercial, Designer e Produção.
3. **Quando passa a fazer sentido:** Após definir quem responde pela conferência e autorização do cliente.
4. **Dados necessários:** Atribuições, versões, decisões e erros observados.
5. **Dependências:** Aprovação explícita antes de alterar fluxo/RPC/RLS.
6. **Complexidade técnica:** 7/10.
7. **Avaliação:** valor 9/10; complexidade para usuário 2/10; complexidade técnica 7/10; prioridade agora 7/10.

## B04: Templates simples de briefing

1. **Ideia:** Templates simples de briefing.
2. **Problema que resolve:** Evitar falta de informação em Pet, Mascote/Corporativo, Chaveiro, Estatueta/Busto e Outros.
3. **Quando passa a fazer sentido:** Estágio 3, quando erros recorrentes justificarem campos.
4. **Dados necessários:** Briefings existentes e causas de retrabalho.
5. **Dependências:** Templates pequenos; nenhum construtor de formulários.
6. **Complexidade técnica:** 5/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 3/10; complexidade técnica 5/10; prioridade agora 4/10.

## B05: Apontamento de produção e reimpressão

1. **Ideia:** Apontamento de produção e reimpressão.
2. **Problema que resolve:** Entender tempo previsto/real, peso/material, máquina e falhas.
3. **Quando passa a fazer sentido:** Estágio 4, após observar uso dos jobs atuais.
4. **Dados necessários:** order_items, production_jobs, production_events, printers.
5. **Dependências:** Reutilizar tabelas e evitar burocracia industrial.
6. **Complexidade técnica:** 5/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 4/10; complexidade técnica 5/10; prioridade agora 3/10.

## B06: Entrada transacional e recuperação de falhas

1. **Ideia:** Entrada transacional e recuperação de falhas.
2. **Problema que resolve:** Evitar pedido parcial ou duplicado se item/upload falhar.
3. **Quando passa a fazer sentido:** Quando testes e ocorrências reais definirem o problema.
4. **Dados necessários:** Erros de criação, itens e uploads.
5. **Dependências:** Análise de RPC/endpoint e idempotência; aprovação estrutural.
6. **Complexidade técnica:** 7/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 0/10; complexidade técnica 7/10; prioridade agora 5/10.

## B07: Custos, margem, financeiro e DRE

1. **Ideia:** Custos, margem, financeiro e DRE.
2. **Problema que resolve:** Entender resultado por pedido, produto e campanha.
3. **Quando passa a fazer sentido:** Estágio 5, com custos e apontamentos confiáveis.
4. **Dados necessários:** Custos diretos, tempo, perdas, despesas e receita.
5. **Dependências:** Sem sistema completo de custos/financeiro agora.
6. **Complexidade técnica:** 8/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 6/10; complexidade técnica 8/10; prioridade agora 1/10.

## B08: Estoque, compras, catálogo/SKU, BOM e MRP

1. **Ideia:** Estoque, compras, catálogo/SKU, BOM e MRP.
2. **Problema que resolve:** Planejar materiais e reposição.
3. **Quando passa a fazer sentido:** Quando faltas/variações reais superarem controle simples.
4. **Dados necessários:** Consumo, saldos, produtos e composição.
5. **Dependências:** Produção disciplinada e escopo aprovado.
6. **Complexidade técnica:** 9/10.
7. **Avaliação:** valor 7/10; complexidade para usuário 7/10; complexidade técnica 9/10; prioridade agora 1/10.

## B09: Calendário de máquinas, capacidade, forecast e scheduling

1. **Ideia:** Calendário de máquinas, capacidade, forecast e scheduling.
2. **Problema que resolve:** Prever carga, contratação e compra de máquinas.
3. **Quando passa a fazer sentido:** Após dados confiáveis e gargalos repetidos.
4. **Dados necessários:** Tempos reais, disponibilidade, perdas e prazos.
5. **Dependências:** Estágio 4 validado; não automatizar prazo/máquina/prioridade.
6. **Complexidade técnica:** 9/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 6/10; complexidade técnica 9/10; prioridade agora 1/10.

## B10: SLA, produtividade, previsibilidade, BI e dashboard executivo

1. **Ideia:** SLA, produtividade, previsibilidade, BI e dashboard executivo.
2. **Problema que resolve:** Medir fluxo e orientar gestão.
3. **Quando passa a fazer sentido:** Estágios 5/7, após volume de dados representativo.
4. **Dados necessários:** Histórico de etapas, responsáveis, prazos e conclusões.
5. **Dependências:** Definições de métricas; reutilizar painel antes de novo.
6. **Complexidade técnica:** 8/10.
7. **Avaliação:** valor 7/10; complexidade para usuário 5/10; complexidade técnica 8/10; prioridade agora 1/10.

## B11: Origem de marketing e margem por campanha

1. **Ideia:** Origem de marketing e margem por campanha.
2. **Problema que resolve:** Relacionar aquisição com resultados operacionais.
3. **Quando passa a fazer sentido:** Quando o core estiver estável e atribuição for confiável.
4. **Dados necessários:** Origem, venda, receita e custos.
5. **Dependências:** Decisão de integração comercial e qualidade de dados.
6. **Complexidade técnica:** 7/10.
7. **Avaliação:** valor 6/10; complexidade para usuário 3/10; complexidade técnica 7/10; prioridade agora 1/10.

## B12: Kommo, WhatsApp e automações de escrita/n8n

1. **Ideia:** Kommo, WhatsApp e automações de escrita/n8n.
2. **Problema que resolve:** Reduzir retransmissão manual entre canais.
3. **Quando passa a fazer sentido:** Estágio 6, depois de validar manualmente contrato de entrada.
4. **Dados necessários:** IDs externos, cliente, pedido, origem e falhas.
5. **Dependências:** Integração/webhook aprovado; idempotência e responsável.
6. **Complexidade técnica:** 8/10.
7. **Avaliação:** valor 8/10; complexidade para usuário 3/10; complexidade técnica 8/10; prioridade agora 2/10.

## B13: Portal do cliente e pagamentos integrados

1. **Ideia:** Portal do cliente e pagamentos integrados.
2. **Problema que resolve:** Facilitar aprovação, consulta e cobrança.
3. **Quando passa a fazer sentido:** Estágio 6, se volume justificar atendimento externo.
4. **Dados necessários:** Pedido, aprovação, acesso, pagamento e comprovantes.
5. **Dependências:** Nova superfície pública/autenticação e integração aprovadas.
6. **Complexidade técnica:** 9/10.
7. **Avaliação:** valor 7/10; complexidade para usuário 5/10; complexidade técnica 9/10; prioridade agora 1/10.

## B14: Transportadoras e tracking automático

1. **Ideia:** Transportadoras e tracking automático.
2. **Problema que resolve:** Reduzir atualização manual de postagem.
3. **Quando passa a fazer sentido:** Estágio 6, quando volume e erros justificarem.
4. **Dados necessários:** Endereço, método, transportadora, rastreamento.
5. **Dependências:** Integração externa aprovada e tratamento de falhas.
6. **Complexidade técnica:** 7/10.
7. **Avaliação:** valor 6/10; complexidade para usuário 3/10; complexidade técnica 7/10; prioridade agora 1/10.

## B15: Integração física de impressoras e telemetria

1. **Ideia:** Integração física de impressoras e telemetria.
2. **Problema que resolve:** Acompanhar execução automática.
3. **Quando passa a fazer sentido:** Estágio 7, apenas com necessidade e compatibilidade comprovadas.
4. **Dados necessários:** Jobs, máquinas, telemetria e eventos.
5. **Dependências:** Infraestrutura e integração; nenhuma conexão física agora.
6. **Complexidade técnica:** 9/10.
7. **Avaliação:** valor 6/10; complexidade para usuário 6/10; complexidade técnica 9/10; prioridade agora 0/10.

## B16: Busca global

1. **Ideia:** Busca global.
2. **Problema que resolve:** Acelerar consulta quando filtros existentes não bastarem.
3. **Quando passa a fazer sentido:** Com evidência de dificuldade recorrente de localização.
4. **Dados necessários:** Pedidos/clientes/arquivos e permissões.
5. **Dependências:** Primeiro melhorar busca e filtros da tela existente.
6. **Complexidade técnica:** 6/10.
7. **Avaliação:** valor 5/10; complexidade para usuário 2/10; complexidade técnica 6/10; prioridade agora 1/10.

## B17: Editor de workflows, novos papéis e novos módulos

1. **Ideia:** Editor de workflows, novos papéis e novos módulos.
2. **Problema que resolve:** Suportar variações operacionais comprovadas.
3. **Quando passa a fazer sentido:** Somente quando fluxo simples e papéis atuais forem insuficientes.
4. **Dados necessários:** Uso real, exceções e matriz de responsabilidade.
5. **Dependências:** Revisão arquitetural explícita; nenhum estado paralelo.
6. **Complexidade técnica:** 9/10.
7. **Avaliação:** valor 4/10; complexidade para usuário 8/10; complexidade técnica 9/10; prioridade agora 0/10.

## B18: IA de apoio, planejamento e produção

1. **Ideia:** IA de apoio, planejamento e produção.
2. **Problema que resolve:** Auxiliar leitura de dados e sugestões com revisão humana.
3. **Quando passa a fazer sentido:** Estágio 7, após qualidade de dados e métricas confiáveis.
4. **Dados necessários:** Histórico, causas, capacidade e critérios aprovados.
5. **Dependências:** Governança explícita; IA não decide prazo/máquina/prioridade agora.
6. **Complexidade técnica:** 9/10.
7. **Avaliação:** valor 5/10; complexidade para usuário 6/10; complexidade técnica 9/10; prioridade agora 0/10.
