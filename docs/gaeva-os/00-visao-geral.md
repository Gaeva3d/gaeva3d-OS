# GAEVA OS: visão geral

Atualizado em 2026-09-08. Fonte de decisões para pessoas e agentes.

**Segurança, atualização de 2026-09-08:** o acesso ao GAEVA agora exige perfil ativo e vínculo com integrante ativo e não excluído. A migration de contenção foi aplicada e testada. Ainda permanecem cadastro público habilitado no Auth e acesso anônimo às tabelas comerciais Dry do projeto compartilhado. A [revalidação técnica e execução](08-revalidacao-tecnica.md) registra evidências e dependências pendentes. Publicação e persistência não constituem aprovação geral de segurança.

O GAEVA OS é o sistema operacional pós-venda da GAEVA. O Kommo pode continuar cuidando do comercial conversacional. O OS começa principalmente quando uma venda vira pedido operacional.

O objetivo atual é operar pedidos da entrada comercial até produção e expedição com mínima complexidade. A prioridade de produto é **Comercial → Designer → Produção → Expedição**. Isso representa responsabilidades, não autorização para eliminar etapas ou permissões existentes.

## Contrato de implementação

1. Reutilizar → estender → adaptar → criar.
2. Um pedido é um card. `orders.status` determina a macroetapa oficial; não manter status paralelo para o Kanban.
3. Menos campos, cliques e telas. Ação principal visível, responsável e próxima etapa claros.
4. Implementar agora somente o que deixa Comercial, Designer ou Produção mais rápidos e com menos chance de erro.
5. A direção do blueprint foi aprovada; sua implementação integral **não** foi aprovada. A devolutiva conservadora de 2026-09-08 prevalece sobre seu roadmap original.
6. Estágio atual: **core operacional**. Estágio 0 concluído; ajustes simples do estágio 1 implementados em branch. Build e TypeScript validados; consultar o changelog e PR #11 para o estado da integração. Estágios posteriores continuam sem autorização de execução.

## Documentação canônica

1. [Arquitetura atual](01-arquitetura-atual.md)
2. [Fluxo operacional](02-fluxo-operacional.md)
3. [Decisões e limites de autorização](03-decisoes-de-produto.md)
4. [Roadmap por estágios](04-roadmap.md)
5. [Changelog e verificações](05-changelog.md)
6. [Backlog futuro](06-backlog-futuro.md)
7. [Diagnóstico inicial e quick wins](07-diagnostico-estagio-0.md)
8. [Blueprint estratégico integral](references/Blueprint_Estrategico_GAEVA_OS_2026-09-08.md)
9. [Revalidação da auditoria e proposta mínima de contenção](08-revalidacao-tecnica.md)

As auditorias técnicas existentes continuam em [Kanban](../kanban-audit.md) e [acesso da equipe](../team-access.md). Não reconstruir suas funcionalidades com base em documentos históricos.

## Persistência do contexto

**O Supabase operacional está ativo e já salva os dados do sistema.** A ausência de uma tabela de memória estratégica não significa ausência de banco ou perda dos pedidos. Em 2026-09-08, a consulta confirmou usuários vinculados, clientes, pedidos, aprovação, arquivo no Storage e auditoria persistidos. Os detalhes estão no changelog.

Estas notas Markdown são compatíveis com Obsidian e ficam versionadas junto do código. Não foi localizado acesso ao vault nem caminho de sincronização do Obsidian nesta execução; **não foi realizada gravação direta no vault**.

O Supabase foi consultado: não há tabela adequada de configurações, documentação ou memória de agentes. Não foi criada tabela, nem usados dados de usuários, auditoria ou tabelas de outras operações para guardar estratégia. O contexto canônico permanece aqui.

### Para disponibilizar a documentação também no Supabase e Obsidian

Proposta de configuração, ainda não executada:

1. Manter estes arquivos no GitHub como fonte canônica, identificados pelo commit. Obsidian e Supabase devem ler a mesma versão, sem documentos independentes concorrentes.
2. No Supabase, usar um bucket privado separado, por exemplo `project-docs`, para cópias dos Markdown e de um manifesto com commit de origem, versão e caminhos. Não é necessária uma tabela de memória. Os buckets existentes são específicos para pedidos e avatares; a política de `order-files` exige vínculo com pedido, por isso não é apropriado depositar documentação de produto ali.
3. Definir acesso administrativo ao bucket e um mecanismo autorizado de envio dos arquivos. Uma cópia inicial não cria sincronização automática. A automação de atualização deve ser aprovada separadamente; não expor credenciais de servidor no frontend.
4. No Obsidian, disponibilizar a pasta versionada `docs` dentro de um vault acessível, preservando `gaeva-os`, `kanban-audit.md` e `team-access.md` para os links funcionarem. Confirmar o vault real e como essa pasta chega ao computador do usuário. Não confundir arquivos no ambiente remoto com arquivos já gravados no Mac.
5. Configurar atualização dessa pasta a partir do GitHub e verificar que a versão no vault corresponde ao commit esperado. Acesso ao vault/sincronização ainda não disponível nesta conversa.

Dependências mínimas: bucket privado e regras de acesso aprovados, canal de envio autenticado, pasta/vault acessível e método de atualização. Não adicionar tela operacional, tabelas de pedidos ou autenticação para isso. Pela devolutiva conservadora, nova configuração de acesso e integração/automação não será implementada silenciosamente.

Avaliação estimada (0–10): espelho privado no Storage, valor 5, complexidade para usuário 0, complexidade técnica 4, prioridade 3; documentação no vault com atualização, valor 8, complexidade para usuário 1, complexidade técnica 3, prioridade 7. A persistência no GitHub já está concluída e não depende dessas extensões.

Referências oficiais: [arquivos e vaults do Obsidian](https://help.obsidian.md/Files+and+folders/How+Obsidian+stores+data) e [buckets privados do Supabase](https://supabase.com/docs/guides/storage/buckets/fundamentals).

## Contexto no Lovable

As diretrizes conservadoras também foram salvas e verificadas no campo de conhecimento do projeto Lovable. Esse resumo aponta para estas notas canônicas e mantém explícitos os limites do blueprint. Isso não representa sincronização com Supabase Storage ou Obsidian. Valor operacional estimado 8/10, complexidade para usuário 0/10, complexidade técnica 1/10, prioridade 8/10.

## Medidas de sucesso

Menos WhatsApp interno, dúvida, pedidos esquecidos, retrabalho, cliques e informação duplicada. Mais pedidos concluídos corretamente e facilidade para treinar pessoas. Recursos sofisticados só passam a fazer sentido com uso e dados reais.
