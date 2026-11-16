# GAEVA OS sobre FilaOps

Aplicação GAEVA OS em desenvolvimento sobre FilaOps: base de gestão operacional, frontend React/Vite e backend FastAPI com PostgreSQL. O [plano atual](docs/gaeva/current-plan.md) reúne escopo, 11 módulos e limites. Leia também o [contexto do projeto](CONTEXT.md).

## Fonte desta aplicação

Composição preparada para publicação: base FilaOps `bdcabe5c3b8d5f0744ac5fd91620985a43922536` e frontend revisado de 500 entradas/50 vínculos, identificado pelo fingerprint `ac3c79e9d7fadf55c20e71b595bcab10d95a0e402af5ccc64f8e98304a5a9911`. A publicação dessa árvore de código é uma operação separada de sua preparação; ela não comprova migração de dados, integração completa ou prontidão de produção.

O escopo mantém Gaeva3D e DryMaia no mesmo produto, com instalações e dados independentes. As entregas locais são parciais: não representam os 11 módulos concluídos. Contratos DRAFT, políticas pendentes e gates dos recortes continuam explícitos no plano.

## Estrutura e uso técnico

`frontend/` contém a interface; `backend/` contém API e domínio da base; `docs/` reúne as referências técnicas e o plano. O frontend selecionado declara Node `>=24`; consulte os manifests e lockfiles da árvore antes de preparar o ambiente. Essas declarações não são prova das versões instaladas.

As [instruções originais FilaOps](README.FilaOps.md) são referência upstream preservada. Elas incluem startup, migração e dados de exemplo: não são instruções já executadas para GAEVA nem autorização para executar contra banco ou ambiente existente. A preparação de ambientes, guard de testes, migração e recuperação exige o recorte e a autorização correspondentes.

## Histórico e atribuição

Esta atualização substitui o conteúdo rastreado por uma nova revisão normal no mesmo repositório Gaeva3d/gaeva3d-OS. URL, histórico Git e Issues são preservados; não há exclusão ou recriação do repositório. A aplicação anterior TypeScript/Supabase permanece consultável no histórico, incluindo a revisão `0faf49d0c9705b62a490a0ab81602975d930fcba`. Backups independentes continuam preservados fora desta árvore.

FilaOps é desenvolvido por [BLB3DPrinting](https://github.com/BLB3DPrinting/filaops). Preservamos o [README original](README.FilaOps.md) e a [licença BSL 1.1](docs/gaeva/upstream/FilaOps-LICENSE.txt). Esta adaptação não concede licença PRO nem altera obrigações upstream. Autenticação, canais, PSP, aprovações produtivas e Portal continuam limitados às evidências de cada recorte.


O frontend desta fonte foi aplicado ao serviço FilaOps existente na porta 80 em 16/11/2026, com bytes HTML/JS/CSS conferidos. Backend e banco não foram atualizados nessa operação. Isso não certifica fluxos autenticados ou o sistema completo. Consulte a [proveniência da fonte](docs/gaeva/source-provenance.json).


Verificação independente pós-deploy limitada: login público na porta 80, assets e configuração conferidos; amostra estreita sem overflow e navegação Tab básica. Contatos autenticado não foi verificado; sem credenciais disponíveis. Resposta company401 e logo404 permanecem observadas. Não é certificação ACL, WCAG integral ou sistema completo.
