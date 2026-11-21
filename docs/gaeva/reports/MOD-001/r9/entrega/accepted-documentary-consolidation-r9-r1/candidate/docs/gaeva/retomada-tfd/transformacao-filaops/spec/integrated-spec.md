> Contexto TFD · 1519 palavras · 2697 tokens (o200k_base)

# Spec integrada — GAEVA OS / MT-A02r1

Estado: proposta final para revisão independente. Esta spec, módulos, dados, OpenAPI e páginas constituem um pacote único versionado. Owner/limites em [README](README.md). Insumos e hashes em source-manifest; nenhuma versão Git presumida. Aprovações específicas dos PRDs prevalecem sobre resumos; D01–08 ainda não são políticas aprovadas.

## Fronteira e identidade

Manter arquitetura e ownership de [MT-A01 architecture](../arquitetura/architecture.md), ADR01–08 de [decisions](../arquitetura/decisions.md), contratos C00–06 de [contracts r2](../arquitetura/contracts.md). Esses documentos são normativos por referência no escopo desta síntese; divergência deve virar achado, nunca escolha silenciosa do implementador. PostgreSQL lógico único por instalação, monólito modular e uma autoridade de escrita por agregado. ChatbotX permanece base selecionada; Q03/Q05 exigem contrato/fixtures/subárvore elegível antes de incorporar artefatos, sem transplantar runtime/schema completo por suposição.

Identidades são tipadas: staff User, portal User cliente, Customer organização, contato do canal, notification thread legado, conversation, opportunity, quote revision, sales order e execution/OP. Igualdade de inteiro/string/nome não é vínculo. `notification_context_service` atual percorre thread→SalesOrder.customer_id→User; conservar negativa de vínculo inconsistente e proibir fallback por e-mail/telefone/user_id da venda. Mapa proposto único por origem/conta/tipo/ID, com reconciliação explícita de conflitos. Ficha e agregadores leem os mesmos registros por projeções permissionadas.

## Atores e matriz de capacidades proposta

| Ação | Autoridade exigida no servidor | Audiência/negação |
| --- | --- | --- |
| Consultar/assumir conversa | staff ativo + conversation.read/assume + participação/elegibilidade | Sem permissão403; objeto fora de audiência404; oferta não é posse |
| Responder público | principal ou concessão responder vigente ∩ RBAC + canal elegível | Permissão de edição interna não presume envio externo; unknown reconcilia |
| Convidar/transferir/encerrar | conversation.manage no registro + política vigente; destinatário decide aceite | Pending não dá leitura/posse/vaga; revalidar capacidade no aceite de transferência |
| Devolver automação | principal atual + conversation.return_automation | Outro usuário/ex-principal proibido; fechar/offline não devolve |
| Publicar proposta | capacidade sales.publish atribuída a vendedor autorizado | IA rascunha; Designer/cliente não recebem publicação por cargo |
| Aprovar2D/3D/foto final | cliente autenticado vinculado e revisão publicada; técnico só sua decisão interna | Decisões independentes, silencioso/comentário/like não aprova |
| Confirmar recebimento | Financeiro autorizado ou adapter autenticado, vínculo/valor/conta válidos | Comprovante não liquida; Produção só gate, sem saldo/custo/margem |
| Liberar QC/postagem | qualidade interna/expedição com capacidade no registro | Gates conjuntivos do domínio; etiqueta não é postagem |
| Arquivo/export/evento/IA | ACL atual de objeto e vínculo + allowlist de campos | Negar custo/margem/privado também em URLs, eventos, busca e prompts |

Nomes de capacidades são **proposta de contrato**, não novas roles existentes. Admin não perde regra do último Admin ativo; usuário desativado conserva autoria e perde sessões/novas ações. Matriz D06 e demais alçadas precisam aprovação do recorte. Defaults negam ação sensível indefinida, sem alargar staff/admin legados por UI.

## Máquinas de estado e sequências

C03 define lifecycle da conversa, automação, fila/posse e archival separadamente. COM014–026 fechados são preservados integralmente: principal único; assumir suspende bot público; limite ativos+reservas; clocks de oferta e reconexão distintos; manual sem autoassign; preferência não fura espera/prioridade; pausa mantém atuais/libera reservas; reconectar consulta servidor. Nenhum passo de pipeline/oportunidade deriva do estado de conversa. D01/02/04 delimitam políticas ainda abertas.

Sequência atendimento: evento autenticado do canal→dedup por conta/evento→mapa de contato/conversa→mensagem persistida→distribuição autorizada→oferta/reserva→Assume transacional→bot fence revogado→projeção UI. Executor de envio verifica versão de automação imediatamente antes de despacho. Efeito já aceito externamente antes do Assume não é retirado ficticiamente: persistir instante e reconciliar.

Sequência comercial/produtiva fechada: modelo de catálogo quando aplicável→briefing/referências/conceito2D→publicação por vendedor e aceite cliente da revisão/proposta→confirmação integral ou entrada Pix50% na parcial, ou cartão integral parcelado conforme captura real→modelagem3D→cliente E técnico aprovam mesma revisão3D→impressão/material/recurso/capacidade→montagem/acabamento aplicáveis→QC interno e fotos reais para aceite final cliente→quitação integral e requisitos de expedição→postagem. Pagamento parcial elegível permite fabricar até QC; saldo bloqueia postagem, não conclusão física. Aceite e confirmação financeira são comandos distintos.

KP01 mantém sete colunas: Caixa de entrada, Modelagem3D, Impressão, Montagem, Qualidade, Expedição, Enviado. KP02 Aguardando antes de início confirmado. Enum da OP existente não é enum do card. KP03/05/agregação entre peças/tempos ainda D05: registrar fatos sem avançar card por inferência. Retrabalho preserva peça/venda/revisão original e cria execução filha. Revisão nova invalida aceites afetados, sem apagar os antigos.

Comercial mantém seis etapas e Ganho/Perdido separados; D03 exige matriz origem/destino/ator/dados/efeito antes de habilitar cada movimento. Comando sem política→409 POLICY_UNRESOLVED; nenhum drag confirma pagamento, produção ou bot. Fila impressão usa tabela+detalhe como default visual, mesmo conjunto de OP/operação/recurso; sort da vista não altera despacho/prioridade.

## Interfaces e persistência normativas

[openapi.json](openapi.json) especifica **novas interfaces propostas** para contexto, comandos e acompanhamento de operação. Não descreve handler PRO inexistente. [data-contracts](data-contracts.md) define registros/constraints/transações, tipos e fixtures. C01r2 de MT-A01 é a autoridade de idempotência: chave instalação/ator/ação/operation_id, identidade completa com alvo tipado e expected_version, igualdade exata/replay terminal autorizado antes de novo CAS, divergência409, concorrente202 mesma operação, unknown reconcilia. Retenção não pode fazer chave velha virar efeito novo.

Estado de envio distingue local persistido, aceito externamente, entregue e lido conforme evidência real do provider. Callback fora de ordem/duplicado não regrede estado por arrival time; mapeamento de estados depende contrato real Q03/05/PSP. `Payment.completed` atual não prova Pix/captura homologados. Tentativas externas não recebem nova chave para contornar timeout.

Compatibilidade: manter C00/DEP01–13, rotas antigas/contexto, contadores/read_at global, avisos system após confirmação, dashboard e bus técnico. Substituir entrada Mensagens sem apagar notifications, pedidos ou anexos. CASCADE declarado é risco a ensaiar, não perda observada. PRO composer fica unavailable com rascunho/histórico autorizado preservados até contrato/fixture, sem inventar envio alternativo.

## Migração e recuperação

Emenda documental S1 aprovada: S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional. A intenção anterior B e P1-QAB-01/02/03 permanecem históricas/UNKNOWN; nova prova não reconstrói a origem passada. A rota B e seus três suportes ficam preservados, não incorporados. P1-CONFIG-PLANNED: configuração prospectiva somente PLANNED/RENDERED, vinculada ao artefato não iniciado; não ACTIVE nem identidade DB. Gerar fingerprint novo do modelo/ordem/inputs aprovados, sem reutilizar 7c3441f9cb2f2027eb33c703ccded81428685161248b8d6994d138dea9f28253. Prova ativa exige operação posterior autorizada após guard/gates; se exigida no aceite, essa parte permanece pendente. P1-REPRO-FROZEN: dois builds independentes consomem o MESMO conjunto previamente resolvido e selado de snapshot/receitas/ignore, locks transitivos exatos com hashes, plataforma/ABI, wheels e apt/sistema, bases por digest/plataforma, ferramentas e flags. Instalações e destinos limpos separados, com inventários antes/depois; não reutilizar a árvore instalada do primeiro nem resolver ranges entre execuções. Falta de segunda prova, fallback silencioso ou divergência não explicada mantém o aceite correspondente pendente; não prometer imagem bit a bit. A escolha S1 e esta emenda documental não autorizam resolução/download/pull/install/build, testes de produto, startup, import app/settings/driver/pytest, conexão DB, fixture, migração, restore/rollback, deploy, publicação ou alteração dos seis contêineres/imagens/volumes/backups. Receitas/locks/contextos futuros e operações concretas exigem escopo/autorização próprios e nova revisão independente. P1 não aceita; P2/P3 não liberadas. Menções anteriores ao protótipo notification_context_service de B não atestam sua presença na fonte S1 e não autorizam incorporá-lo.

Expandir schema/mapas/adapters; inventariar anexo/ID/origem/ACL e consumidores; dry-run sintético com relatório de colisão/órfão; reconciliar IDs/campos/hashes/contagens e leitura global; habilitar superfície autorizada com fallback; retirar endpoint só após ausência de consumidor comprovada e aceite específico. Uma escrita canônica, projeção legada adaptada, sem dual-write autônomo não reconciliável. Sem delete físico ou downgrade destrutivo no rollout inicial.

DF01–07 e matriz DevOps são contrato obrigatório da F1: manifesto da fonte S1 Gaeva3d/gaeva3d-OS@a32e81b13e6d1fe5a4008ceeea253aaec10461ff, sem overlay local adicional→contexto/locks→digest, ambientes explicitamente separados, guard stdlib antes de app/pytest/conftest/driver, tupla efetiva allowlisted+identidade pós-conexão, um migrador/role distinta, API sem DDL/download, PRO elegível pinado. Restore em recursos novos e reconciliação são provas futuras, não realizadas. Backup ENV08 íntegro/TOC não prova recovery. Aplicação antiga só retorna se schema/escritas compatíveis; senão conter/reparar forward ou decidir restore/janela própria, nunca automático sobre produção.

## Observabilidade e qualidades

Registrar operation/correlation/event IDs, ator tipado, revisão, domínio, resultado/motivo seguro, release digest; sem corpo de conversa/arquivo/token/DSN autenticada. Auditoria durável difere de toast/log. Testar zero vazamento, uma aplicação por identidade, capacidade não excedida, gates negados individualmente e zero perda contratada na reconciliação. Dados ausentes não são0; tempo paralelo não vira soma de prazo; locale não converte unidade/moeda. Latência/SLO/RPO/RTO/recursos VPS sem baseline ficam a medir na F1, não metas inventadas.

## Prontidão e bloqueios por recorte

F1 está especificada para futura implementação e prova T07-P1–7; não provisionada. Plataforma depende de F1 e matriz de autorização; canal/PRO/ChatbotX dependem contratos/artefatos reais; produção agregada depende D05; fiscal/folha avançados dependem PRD/aplicabilidade. A spec permite aprovar recortes independentes mantendo stops; não declara todo módulo final executável apesar de UNKNOWN. [Plano](phase-plan.md) e specs dos módulos explicitam alcance e exclusões. Nenhum gate humano é completado por estes documentos.

## Adendo proposto Fundação r6 — prevalência delimitada

Somente MOD001: [contrato r6](modules/MOD-001/phase-spec.md) com C/AP/RP prevalece na ampliação18/11. RPO0/300s são metas aprovadas NÃO MEDIDAS, substituem a antiga ausência de meta para este escopo. Chave idempotente Fundação é instalação/tenant/tipo/op, ator auditado sem escapar dedupe; política AEP canônica, PG projeção. Autoridades/réplicas HA não são microserviços de negócio/segundo produto. Deny/invariantes/alçada e admin-only extras aprovados preservados; D06 antigo não reabre essa decisão. Texto de outros módulos e decisões não afetadas intacto.
