## 2026-09-17 — Prévia visual de Ações comerciais

- Implementadas as rotas navegáveis `/comercial/acoes` e `/comercial/acoes/$id` sobre o shell existente, visíveis apenas para os perfis Comercial e Admin já existentes.
- A prévia usa somente fixtures fictícias locais e estado em memória, com identificação explícita de integração CRM pendente; não grava vendas, banco ou `localStorage`.
- Incluídos placar em marinho, filtros, quatro gráficos, tabela demonstrativa, formulário de rascunho em memória e estados vazio, carregando, erro e sem acesso.
- Nenhuma migration, tabela, RLS, autenticação, permissão, pedido, produção, integração ou publicação foi alterada.

# Changelog

## 2026-09-17: correções da prévia visual de Ações comerciais

1. Legendas e tooltips dos gráficos agora apresentam nomes em português, incluindo “Realizado acumulado”, “Meta acumulada”, “GAEVA” e “Dry Maia — Nova Operação”.
2. A demonstração usa referência explícita em 24/09/2026. O período de 17/09 a 01/10 contém 15 dias, 8 dias restantes de forma inclusiva, esperado de R$ 16.000,00 e ritmo necessário de R$ 738,75.
3. A série demonstrativa segue até 01/10: realizado futuro permanece sem valor e a meta acumulada continua até o fim. Somente “Sprint comercial — 15 dias” possui dados de exemplo; ações sem fixture própria exibem estado vazio, sem reaproveitar dados de outro período.
4. Alteração restrita à prévia visual e fixtures locais. Nenhum banco, migration, autenticação, RLS, permissão, integração ou publicação foi alterado.
5. IDs desconhecidos agora exibem “Ação não encontrada”, sem fallback para a primeira ação. O filtro de operação passou a recortar acumulado, vendas diárias, operações e ranking; a meta conjunta permanece exclusiva da visão geral.
6. O formulário temporário valida meta positiva e finita, fim igual ou posterior ao início e duração entre 1 e 366 dias.

## 2026-09-09: detalhe sem alertas automáticos após lançamento

1. Conferida a imagem enviada pelo usuário: pedido salvo como “Pedido recebido”, descrição preenchida e caixa automática cobrando briefing/aprovação antes da etapa correspondente.
2. Snapshot local comparado aos 141 blobs de main `90f86ad1158cc11eaf81e8edc7a46ff3f8300ff9`: nenhuma divergência antes da alteração.
3. Removidos o cálculo de bloqueios presumidos e a caixa “O que está bloqueando este pedido?” em `src/routes/pedidos/$id.tsx`. Deixam de aparecer “Briefing incompleto”, aprovação não registrada e os demais avisos agregados dessa caixa.
4. Motivo de bloqueio explicitamente registrado mantido nos dados principais apenas quando o pedido está no status “Bloqueado”. Nenhum campo foi marcado como concluído para ocultar o aviso. Cadastro, status, confirmação, aprovação, produção, permissões e dados existentes preservados.
5. TypeScript e ESLint do arquivo alterado passaram sem erros. Não foram adicionados testes que apenas espelham a retirada de markup. Build local interrompido pelo ambiente: “network approval was cancelled before a decision was returned”. O build remoto da Vercel para o código `5289cd2121c0a0a4270562b7524b136d029a60b3` concluiu com **Ready**, confirmado pelo status do commit e comentário do bot no [PR #13](https://github.com/Trafegantes-Digital/gaeva-flow/pull/13). A validação não incluiu login ou alteração de pedidos reais.
6. Alteração limitada a um arquivo de aplicação e documentação. Nenhuma migration, mudança em Supabase, autenticação, dependências, nova tela ou módulo. Decisão 012 e roadmap atualizados; demais propostas continuam dependentes de aprovação própria.

## 2026-09-08, 22:24 UTC: contenção de acesso aplicada

1. Usuário autorizou explicitamente a contenção proposta no PR #12. Implementada somente a etapa executável com os acessos presentes: `app_private.has_role` exige perfil ativo e vínculo com integrante ativo, não excluído. Assinatura, proprietário `postgres`, SECURITY DEFINER, search_path vazio e ACL existentes preservados; nenhuma tabela, coluna, enum ou papel criado.
2. CLI Supabase 2.117.0 gerou o arquivo inicial de migration. O SQL foi versionado na branch antes da aplicação. Após `apply_migration`, o arquivo foi renomeado para a versão efetivamente registrada pelo Supabase: `20260908222405_require_active_team_membership.sql`. Não houve alteração manual da tabela de histórico de migrations.
3. Preview já existente `skmzhgpviojiuzligtvh`, inicialmente sem usuários/dados operacionais, alinhado com as migrations GAEVA já presentes em main. Nenhum ambiente adicional contratado. Funções e policies comparadas com produção: somente `has_role` difere intencionalmente.
4. Três suítes SQL aprovadas no preview: `active-team-membership.sql`, `team-access-database.sql` e `kanban-database.sql`. Cobrem cinco papéis sem vínculo, RLS nas 12 tabelas e view, histórico, metadados de Storage, provisionamento/retry, perfil/membro inativo ou excluído, papel por atribuição e fluxo de pedido até postagem/finalização. Fixtures integralmente revertidas; nenhum teste de escrita ou fixture executado em produção. Os testes antigos receberam apenas vínculos da equipe nas fixtures que representam usuários legítimos.
5. **26 testes Node aprovados.** Sem alteração de frontend, dependências, scripts de build, RPC operacional ou Edge Function.
6. Verificação de produção em transação somente leitura: Admin e Comercial continuam autorizados. Admin vê 2 pedidos; Comercial vê 0, conforme o escopo existente de criação/atribuição. Contagens preservadas: 2 usuários, 2 perfis, 2 integrantes, 2 clientes, 2 pedidos, 22 logs de auditoria e 1 objeto de arquivo.
7. Cadastro público continua habilitado: `config.toml` já tinha `enable_signup=false`, mas isso não representa a configuração remota. Nenhuma credencial administrativa de Auth nem ferramenta de alteração desse setting está disponível. Fechar no painel e verificar `/auth/v1/settings` é pendência real.
8. Dry continua com exposição anônima; nenhuma alteração em suas tabelas/grants/dados. Sem acesso ao n8n, não foi possível confirmar as credenciais dos consumidores, pré-condição aprovada para o fechamento. Security Advisor ainda acusa as duas tabelas sem RLS e proteção de senha vazada desabilitada. Não declarar o projeto inteiro seguro nem ambos os P0 encerrados.
9. Documentação e decisão atualizadas no GitHub. Nenhuma gravação no Obsidian ou cópia documental no Supabase Storage foi realizada.

## 2026-09-08: revalidação técnica de segurança

1. Main confirmado em `271413156e81d4744f87f1bf284163fc23673468`, com PR #11 integrado. Todos os 138 arquivos do snapshot local conferidos contra os blobs do tree remoto.
2. Publicação no domínio próprio `https://os.gaeva3d.com/` confirmada na verificação precedente: DNS correto, HTTPS 200, título `Visão geral — GAEVA OS`, servidor Vercel. Isso não confirma o login nem as URLs do painel Auth.
3. Confirmados P0 atuais: `dry_leads` e `dry_conversion_events` sem RLS e com grants para anon/authenticated; HEAD anônimo retornou contagens 402/106. Cadastro público retornou `disable_signup=false`; viewer continua com leitura ampla. Nenhuma linha de dado pessoal foi baixada no teste HTTP.
4. Security Advisor atual aponta as duas tabelas Dry sem RLS e proteção de senhas vazadas desabilitada. Verificações anteriores do core/persistência não devem ser interpretadas como aprovação de segurança de todo o projeto compartilhado.
5. Confirmado um grupo de telefone duplicado nos dois clientes ativos; não foi feita deduplicação nem criado índice. Zero pedidos ativos sem item no snapshot, sem concluir que a criação sequencial seja atômica.
6. Reexecutados **26 testes locais, todos aprovados**. Ausência de scripts npm/CI permanece. Corrigidas generalizações do documento recebido sobre o modo leve do Kanban, auditoria de viewer e remoção de assinaturas de arquivos.
7. Registradas propostas mínimas, exemplos SQL não executados, dependência n8n e critérios de teste em [Revalidação técnica](08-revalidacao-tecnica.md). Nenhuma alteração de aplicação, banco, autenticação, RLS ou integração executada nesta revisão.
8. Documentação preparada no repositório. Sem acesso direto ao Obsidian ou gravação documental no Supabase. Próximo passo: aprovar a contenção de segurança e confirmar consumidores da Dry antes de modificar seus acessos.

## 2026-09-08: estágio 0

1. Blueprint integral lido: 1.924 linhas, confrontado com a implementação e com a devolutiva conservadora.
2. Snapshot do GitHub `fcb2141b9b665c394050f2185e7cc5a0338b9b9c` conferido contra 129 blobs, isolado de arquivos antigos não commitados.
3. Auditados formulário, validações, tipos/adaptadores, store, consultas, Kanban, drawer, detalhe, Produção, acesso da equipe, uploads, migrations, funções e histórico.
4. Consultado o Supabase em modo de leitura. Corpos das RPCs operacionais comparados com as migrations; nenhuma tabela adequada para contexto encontrada.
5. Diagnóstico das 16 perguntas e matriz de oito quick wins registrados antes de alterar a aplicação.
6. Notas canônicas criadas no repositório, preservando auditorias anteriores. Blueprint mantido como referência integral. Nenhum acesso ao vault do Obsidian foi localizado.

Deliberadamente não alterados: schema, dados reais, autenticação, permissões, fluxo central, tabelas de outras operações e infraestrutura. Risco conhecido: o fluxo desejado ainda exige confirmação por Produção/Admin e aprovação por Comercial/Admin. Próxima etapa: somente quick wins do estágio 1.

## 2026-09-08: estágio 1, implementado em branch para revisão

### Alterações

1. Q1: labels compartilhados passam a Pedido recebido, Confirmação do pedido, Aguardando aprovação, Pronto para produção, Fila de impressão, Conferência, Postagem e Finalizado. Chaves e enums mantidos.
2. Q2: dimensões, acabamento e finalidade recolhidos em “Detalhes adicionais (opcional)” no Novo Pedido. Campos mantêm estado e persistência; nenhuma validação obrigatória foi alterada. Mensagem de acesso orienta procurar Comercial/Admin, sem sugerir troca do próprio papel.
3. Q3: Kanban inicia em Meus pedidos para Designer, respeitando filtros iniciais explícitos. O filtro inclui pedidos atribuídos em Design e aguardando aprovação; não inclui produção, finalizados, cancelados ou pedidos de outro designer. Aguardar aprovação não passa a ser ação permitida.
4. Q4: card mostra responsável atual e designer; impressora aparece apenas nos agrupamentos de impressão/pedido pronto. Seletor existente de designer movido da aba Produção para o resumo do drawer, com a mesma permissão. Perfis sem poder de atribuição veem texto, sem controle desabilitado de máquina vazia.
5. Q5: um botão de destaque por momento em Design e conferência/embalagem; outras ações permanecem disponíveis como secundárias. “Aprovar e enviar para Produção” explicita a transição existente no drawer e detalhe. “Concluir impressão” e “Marcar como postado” descrevem ações. O diálogo repete o nome da ação, mantendo confirmações existentes.
6. Q6: removido somente o checklist visual do detalhe que não persistia marcações. Os checklists operacionais reais de confirmação/liberação continuam. Campos antigos vazios e placeholders de custo não aparecem; direitos de uso preenchidos continuam consultáveis em informações complementares. Nenhuma coluna ou dado removido.
7. Q7: filtro existente Sem impressora restrito a aprovado para produção, fila e impressão. Descrição da tela Produção explica seu recorte e aponta para o Kanban existente.
8. Q8: Meus pedidos vazio explica filtros/atribuição; drawer do Designer abre no briefing em Design/aprovação. Nenhuma nova tela ou rota.

### Validação e limites

1. `node --experimental-strip-types --test tests/*.test.mjs`: **26 testes aprovados**. Inclui escopo de Meus pedidos, aprovação sem permissão extra, retorno de revisão, exclusão de outros designers/finalizados e filtro de máquina somente na produção, além das regressões existentes de entrada, painel e acesso.
2. ESLint nos oito arquivos de aplicação alterados: **zero erros**, três avisos já presentes nos componentes (constantes exportadas com Fast Refresh e dependência de memo). Sem refatoração adicional para perseguir avisos fora da necessidade operacional.
3. TypeScript completo bloqueado por `TS2307` em `linear-filters.tsx`: falta `motion/react` no node_modules local. `motion` já consta no package.json/lockfile de main e esses arquivos não foram alterados. Nenhum outro erro foi reportado nessa execução, mas isso não equivale a checagem completa aprovada.
4. Build iniciado e interrompido pelo ambiente: “network approval was cancelled before a decision was returned”. Tentativa isolada de obter dependência também foi interrompida; nenhuma instalação foi considerada concluída. **Build de produção pendente.**
5. Nenhuma validação visual autenticada ou fluxo ponta a ponta com contas reais foi executada. Nenhum usuário, cliente, pedido ou e-mail foi criado nos testes desta etapa.
6. Diff revisado: sem migrations, banco, autenticação, APIs/RPC, RLS, dependências, rotas novas ou mudanças de destino das ações. Apenas UI, filtros, testes e documentação.

### Publicação e próximo passo

Código preparado em branch `feature/core-operacional-simples` e PR de revisão no GitHub. **Não integrar main enquanto o build completo não estiver validado.** O estado do PR/GitHub é a referência de integração; este registro não afirma publicação do app nem atualização de domínio.

Obsidian: notas versionadas e compatíveis, sem escrita direta no vault por falta de acesso. Supabase: nenhuma estrutura adequada de memória e nenhuma escrita de contexto.

Riscos remanescentes: confirmação intermediária e aprovação por Comercial/Admin continuam; o filtro não amplia permissão; a criação sequencial pode sofrer falha parcial; indicadores antigos de impedimento podem ser prematuros. Esses pontos não foram resolvidos por mudanças de fluxo silenciosas.

Próximo passo técnico: instalar as dependências do lockfile em ambiente com acesso, executar TypeScript e build, verificar o drawer/formulário com os papéis reais e então integrar o PR. Próximo estágio de produto: apresentar proposta curta do estágio 2 baseada na validação real, sem executar automaticamente.

## 2026-09-08, 18:18 UTC: confirmação de persistência e publicação

1. Supabase `wohkhxculmrfavnbykkk` respondeu `ACTIVE_HEALTHY`. Foram encontrados 2 usuários, 2 perfis ativos vinculados à equipe (Admin e Comercial), 2 clientes, 2 pedidos, 2 itens, 1 arquivo, 1 aprovação e 22 registros de auditoria. Há 1 objeto real no bucket `order-files`; nenhuma execução de produção registrada. Contagens são um retrato desta consulta, não metas ou fixtures criadas nesta execução.
2. RLS habilitado nas 12 tabelas operacionais; buckets `order-files` e `avatars` privados. As políticas de arquivos de pedido exigem relação com um pedido acessível. Nenhuma escrita ou teste com credenciais reais foi realizado nesta verificação.
3. Ausência de settings/memória estratégica confirmada novamente. Isso não afeta a persistência operacional. Proposta mínima de documentação via Storage privado e vault foi registrada na visão geral, sem criação de infraestrutura.
4. Lovable confirmou `is_published=true`, URL `https://gaeva-flow-engine.lovable.app` e versão atual do projeto `fcb2141b9b665c394050f2185e7cc5a0338b9b9c`. A checagem HTTP pública não foi concluída pelo ambiente; não confundir esse metadado com teste de disponibilidade/login ponta a ponta.
5. [PR #11](https://github.com/Trafegantes-Digital/gaeva-flow/pull/11) continua aberto, em rascunho, sem merge. Os oito quick wins ainda não fazem parte da versão publicada.
6. Vercel passou a expor ferramentas, porém a conexão retornou zero equipes e falhou ao listar projetos. O domínio próprio e um deploy Vercel do OS permanecem **não confirmados**. Não houve nova publicação nem alteração de DNS.
7. Nenhum conector Obsidian ou vault acessível foi encontrado. Documentação salva no GitHub, sem sincronização comprovada no Obsidian.

## 2026-09-08: retomada autônoma da publicação

1. Projeto Vercel localizado pelo status e comentário do bot no GitHub: [trafegantes-digital/gaeva-flow](https://vercel.com/trafegantes-digital/gaeva-flow), projeto `prj_dVACuu6s8hQpmm7kqXSIUrFsnweM`, equipe `team_XnKfhV0AWH60cvpzgE3UQbsc`.
2. A prévia do commit `05f9440cde564587f83ba6c56ffc92e100beeb66` consta como READY: `https://gaeva-flow-git-feature-core-operacio-2458ba-trafegantes-digital.vercel.app`. A integração GitHub → Vercel está ativa. Consultas administrativas pela conexão Vercel retornam 403 mesmo com os IDs corretos; os domínios customizados ainda não foram confirmados.
3. Acesso ao registro de dependências restabelecido. Dependências faltantes instaladas apenas no ambiente de validação: motion/framer-motion/motion-dom 13.2.0 e motion-utils 13.0.0, conforme o lockfile existente. Nenhum package.json ou lockfile do projeto foi alterado.
4. **TypeScript completo passou**, **build de produção local passou** e **26 testes passaram**. O bloqueio local registrado anteriormente está resolvido. ESLint anterior continua com zero erros e três avisos preexistentes.
5. Nenhum teste autenticado de ponta a ponta foi realizado. Tentativa HTTP de leitura da prévia não foi concluída; acesso HTTP ao domínio Lovable retornou 403 neste ambiente. Não declarar disponibilidade de runtime com base apenas no build/status.
6. Campo de conhecimento do Lovable, anteriormente vazio, recebeu o resumo das decisões conservadoras e links para a documentação canônica. Gravação verificada por leitura. Nenhuma tela, tabela, autenticação ou fluxo operacional novo foi criado.
7. O usuário autorizou prosseguir autonomamente com as pendências. PR #11 pode sair de rascunho após registro dos resultados, mantendo merge normal e histórico publicado.
8. Supabase Storage documental e Obsidian: continuam dependentes de canal autenticado de upload e vault acessível. Não há token/CLI autenticada para esses uploads nem conector Obsidian nesta sessão. Não criar bucket vazio, improvisar tabela de memória ou alegar sincronização. O contexto já está durável no GitHub e resumido no Lovable.

## 2026-09-17: design de "Ações comerciais" aprovado (documental)

1. Entrega documental aprovada e registrada em [09-acoes-comerciais-design.md](09-acoes-comerciais-design.md): hierarquia, layout desktop/tablet/mobile, estados, regras de cálculo e contrato TypeScript do módulo "Ações comerciais".
2. Nenhum código de produto, migration, tabela, RLS, rota ou publicação nesta rodada. Nada foi executado no banco.
3. Verificação limitada aos arquivos do repositório. Os tipos gerados em `src/integrations/supabase/types.ts` não listam tabelas de CRM, o que **não comprova** o estado do banco remoto. O CRM local (`gaeva-flow-comercial`, `codex/crm-fundacao`) não foi inspecionado; a existência de um conceito de operação lá é lacuna aberta.
4. Decisões registradas: identidade comercial canônica única com o pedido como referência; operação Dry nomeada "Dry Maia — Nova Operação"; data comercial explícita separada de `closed_at`; elegibilidade derivada sem exigir tabela de vínculos; pedidos legados sem oportunidade ficam pendentes de revisão, sem backfill cego; métricas de meta só existem na visão geral global, nunca em recorte por filtro ou acesso parcial; acesso negado não devolve dado algum.
5. Tema: shell e tema claro do OS preservados; marinho escuro restrito à área do placar.
6. Pendências bloqueantes antes de qualquer integração: estado real do banco remoto, inspeção do CRM local, semântica de `closed_at`, política de pedidos legados e política de permissão por operação.
