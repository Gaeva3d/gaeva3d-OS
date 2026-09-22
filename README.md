# GAEVA OS

Sistema operacional pós-venda da GAEVA. Antes de implementar, leia a [documentação atual e as decisões de produto](docs/gaeva-os/00-visao-geral.md). O blueprint é visão de longo prazo; o estágio atual permite apenas simplificações do core operacional.

## Especificação original do projeto

O conteúdo abaixo preserva a especificação inicial. Para o estado atual e limites de implementação, prevalece a documentação acima.

# GAEVA Flow

Crie um novo aplicativo web interno chamado **GAEVA OS**.

OBJETIVO DA PRIMEIRA VERSÃO
Construir a base operacional da GAEVA para substituir controles dispersos. O comercial cadastra o pedido completo e a produção acompanha, prioriza, atribui responsáveis e impressoras e altera o andamento até a entrega. Esta é uma base funcional e enxuta, preparada para evoluir depois. Não criar e-commerce, CRM genérico, portal do cliente, integrações externas, IA, estoque completo ou financeiro contábil nesta fase.

CONTEXTO E FRONTEIRAS
1. O GAEVA OS deve ser um produto separado do Trafegantes OS e ter arquitetura/banco próprios.
2. Nesta versão, trabalhar somente com a marca GAEVA. Não misturar interface, clientes nem operação da Dry Maia.
3. A aplicação será vinculada ao GitHub posteriormente. Organize componentes, tipos e serviços de modo limpo para essa migração.
4. O Supabase será a fonte oficial de dados, autenticação, arquivos, permissões e auditoria. Se o banco ainda não estiver ativo no projeto, deixe o front funcional com dados demonstrativos e estrutura claramente pronta para a integração, sem hardcode espalhado.
5. Aplicação em português do Brasil, desktop-first e responsiva para celular.

PERFIS DE ACESSO
Estruture a base para quatro papéis:
1. Direção/Admin: acesso total.
2. Comercial: cadastrar e editar clientes e pedidos; acompanhar andamento.
3. Produção: atualizar status, prioridade, prazo, responsável, impressora, apontamentos e arquivos.
4. Visualização: somente leitura.
Deixe um seletor temporário de papel/usuário apenas para demonstração, caso a autenticação real ainda não esteja habilitada.

NAVEGAÇÃO PRINCIPAL
Sidebar fixa/retrátil com:
1. Visão geral
2. Pedidos
3. Produção
4. Clientes
5. Impressoras
6. Equipe
7. Configurações

VISÃO GERAL / DASHBOARD
Criar um cockpit orientado à ação, sem gráficos decorativos:
1. Cards: pedidos ativos, pedidos urgentes, pedidos atrasados, aguardando aprovação, em impressão e concluídos no mês.
2. Bloco “Exigem atenção hoje”, ordenado por atraso, urgência, bloqueio e prazo próximo.
3. Fila de produção de hoje com pedido, produto, etapa, prioridade, prazo, responsável e impressora.
4. Capacidade das impressoras: disponíveis, imprimindo, manutenção e offline.
5. Resumo por etapa do fluxo.
6. Atividades recentes.
7. CTAs claros: “Novo pedido” e “Ver fila de produção”.
Todo card deve abrir a lista já filtrada correspondente.

PEDIDOS
Tela com alternância entre Tabela e Kanban.
Filtros combináveis: busca, status, prioridade, prazo, responsável, impressora, produto e cliente.
Colunas da tabela: código, cliente, produto, quantidade, status, prioridade, prazo, responsável, impressora e última atualização.
Ações rápidas por linha: abrir, alterar status, alterar prioridade e atribuir.
Destacar visualmente atrasados, urgentes, bloqueados e aguardando aprovação.
Estados vazios e feedbacks de sucesso/erro bem resolvidos.

NOVO PEDIDO
Criar formulário em etapas ou seções, com validação:
A. Cliente
1. Selecionar cliente existente ou cadastrar novo sem sair do formulário.
2. Nome.
3. Empresa, opcional.
4. Telefone/WhatsApp obrigatório com máscara brasileira.
5. E-mail, opcional.
6. Cidade e UF.
7. Observações do cliente.

B. Pedido
1. Código automático no padrão GAE-AAAA-0001.
2. Categoria/produto: mascote corporativo, troféu, chaveiro corporativo, pet personalizado, peça personalizada ou outro.
3. Nome curto do projeto.
4. Quantidade.
5. Tamanho/dimensões.
6. Tecnologia/material.
7. Cores.
8. Acabamento.
9. Finalidade/evento.
10. Data fixa do evento, quando existir.
11. Prazo prometido.
12. Valor do pedido, entrada, saldo e status de pagamento.
13. Observações comerciais.

C. Briefing e arquivos
1. Descrição detalhada.
2. Referências e requisitos obrigatórios.
3. Upload múltiplo de imagens e documentos com preview, nome, tamanho e remoção.
4. Campo para registrar direitos/autorização de uso de marca/personagem.
5. Checklist de briefing completo.

D. Produção
1. Prioridade: normal, alta, urgente ou crítica.
2. Responsável atual.
3. Impressora inicial, opcional.
4. Tempo estimado.
5. Material estimado.
6. Observações internas.
7. Motivo da urgência, obrigatório quando urgente ou crítica.

FLUXO DE STATUS
Usar estes estágios:
1. Recebido
2. Briefing pendente
3. Em modelagem
4. Revisão interna
5. Aguardando aprovação do cliente
6. Aprovado para produzir
7. Na fila de impressão
8. Imprimindo
9. Acabamento
10. Controle de qualidade
11. Embalagem
12. Expedição
13. Concluído
14. Bloqueado
15. Cancelado

REGRAS IMPORTANTES
1. Nenhum pedido pode entrar em “Na fila de impressão” ou “Imprimindo” sem aprovação do cliente registrada.
2. Pedidos atrasados são calculados pelo prazo, não marcados manualmente.
3. Urgência exige motivo.
4. Toda alteração relevante registra usuário, data, valor anterior, valor novo e comentário opcional.
5. Pedido deve ter etapa, responsável e prazo.
6. “Bloqueado” exige motivo.
7. Data fixa de evento deve aparecer com destaque e gerar alerta de risco quando próxima.

DETALHE DO PEDIDO
Criar página/drawer completo com cabeçalho mostrando código, cliente, status, prioridade, prazo e ações rápidas.
Abas:
1. Resumo: dados principais, briefing e próximo passo.
2. Arquivos: galeria/lista de uploads por categoria.
3. Produção: responsável, impressora, fila, tempos, materiais, falha/reimpressão e apontamentos.
4. Aprovação: status, data, versão e observação.
5. Financeiro básico: valor, entrada, saldo, pagamento e custos previsto/real em estrutura preparada.
6. Histórico: timeline imutável de alterações.
Incluir checklist contextual da etapa atual e bloco “O que está bloqueando este pedido?”.

PRODUÇÃO
Criar quadro operacional separado do cadastro comercial:
1. Kanban por etapa produtiva.
2. Lista “Hoje”, “Urgentes”, “Atrasados”, “Sem responsável”, “Sem impressora” e “Bloqueados”.
3. Cards densos com código, miniatura, cliente, produto, quantidade, prazo, prioridade, responsável e impressora.
4. Drag and drop entre etapas, respeitando a regra de aprovação.
5. Painel lateral para atualização rápida sem sair do quadro.
6. Campo de apontamento: início/fim, tempo real, material real, falhou?, motivo da falha, reimpressão e observação.
7. Sinalização de risco por prazo: saudável, atenção, risco e atrasado.

IMPRESSORAS
Cadastrar inicialmente:
1. Snapmaker U1
2. Bambu Lab A1
3. Elegoo Saturn 4 Ultra 12K
Estrutura que aceite novas máquinas sem depender do modelo.
Por impressora mostrar: status (disponível, imprimindo, manutenção, offline), pedido atual, fila, tecnologia, material atual, horas previstas, última atualização e observações.
Permitir atribuir/reordenar a fila e colocar máquina em manutenção.
Não criar controle técnico avançado de perfil de impressão nesta fase.

CLIENTES
Lista pesquisável com nome, empresa, WhatsApp, cidade/UF, pedidos totais, pedidos ativos, valor acumulado e última compra.
Perfil do cliente com contatos, observações, histórico de pedidos, arquivos relacionados e timeline.
Botão de WhatsApp apenas deve abrir wa.me com mensagem opcional; não enviar automaticamente.

EQUIPE
Base para cadastrar pessoas do operacional:
1. Nome.
2. Foto/avatar.
3. Função.
4. Papel de acesso.
5. Telefone.
6. E-mail.
7. Status ativo/inativo.
8. Capacidade/limite de pedidos.
9. Especialidades.
10. Pedidos atuais.
11. Observações.
Tela deve funcionar agora mesmo com equipe pequena e escalar depois.

MODELO DE DADOS PREPARADO
Estruture tipos e camada de dados para:
profiles, customers, orders, order_items, order_files, order_assignments, approvals, printers, production_jobs, production_events, team_members e audit_logs.
Relacionamentos devem permitir vários itens e vários trabalhos de produção/impressoras dentro do mesmo pedido, mesmo que a interface inicial seja simples.
Usar IDs UUID, created_at, updated_at e soft delete quando fizer sentido.

DADOS DEMONSTRATIVOS
Criar dados fictícios, claramente identificáveis e fáceis de remover, suficientes para testar filtros, dashboard, atrasos, urgência, impressoras e Kanban. Não usar nomes de clientes reais.

IDENTIDADE VISUAL
Visual premium, operacional e tecnológico.
1. Fundo geral off-white muito claro.
2. Sidebar e áreas de alto contraste em preto/grafite.
3. Azul elétrico como cor principal de ação.
4. Verde somente para sucesso, âmbar para atenção e vermelho para risco/atraso.
5. Tipografia limpa, excelente legibilidade, bastante espaço negativo.
6. Interface com densidade profissional, sem excesso de gradientes, glassmorphism, ilustrações genéricas ou aparência de template SaaS infantil.
7. Usar shadcn/ui, ícones Lucide, tabelas, badges, tooltips, skeletons, toasts e diálogos consistentes.
8. Inserir “GAEVA OS” no topo da sidebar e um pequeno “Operação 3D” como subtítulo. Não usar “impressão 3D” como promessa comercial; aqui é apenas software interno.

QUALIDADE
1. TypeScript estrito.
2. Componentes reutilizáveis.
3. Sem erros de console.
4. Rotas funcionais.
5. Estados loading, empty e error.
6. Acessibilidade básica.
7. Não publicar o projeto ainda.
8. Entregue a primeira versão navegável e funcional com dados demonstrativos, priorizando o fluxo Novo Pedido → Produção → Impressora → Conclusão.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/abfae9bd-4be9-4661-9d40-05544573586e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
