# Consolidação candidata — GAEVA-MOD-001 architecture-consolidation-r3

Autor @architecture agent-65a76b70-79bc-4539-b8b9-840998b76a10. Correlação 265fcf7f-322f-4712-a0f2-3391eace50d6. Fonte r5/S1 a32e81b13e6d1fe5a4008ceeea253aaec10461ff; Discovery r4 e contribuições U5/U6 e quatro correções setoriais são entradas, não aprovações. Gate/MT histórico UNKNOWN. Esta é pesquisa/design candidato autorizado excepcionalmente antes de G3, não spec G4 aprovada. A0 FAILED/P1 OPEN/P2/P3 não liberadas. Nenhuma implementação ou publicação autorizada. Aplicar skill TFD-architecture compartilhada e referências canônicas indicadas em consultation.json.

## Fronteiras e responsabilidades

Clientes e telas Settings/AdminUsers reutilizados comunicam com API FilaOps adaptada; API consulta identidade/política vigente, coordena operação e PG16. Workers leem outbox persistente; ChatbotX permanece adaptador candidato, sem atribuição de garantias não comprovadas. Cache/socket apenas aceleram notificações e presença. Gateway de arquivos publica versões imutáveis protegidas. PG/Patroni e storage têm autoridade eleita/fencing próprio; catálogo externo e custódia independente suportam recuperação. Drive recebe somente DB cifrado e manifesto mínimo. Nenhum novo microserviço de negócio ou broker é necessário ao contrato: preferir coordenação/outbox no PG existente. Papéis lógicos podem compartilhar processos; não representam recursos instalados.

Fundação #1 fornece contratos e pré-requisitos. Plataforma #2 recebe dependências documentais Backups/Usuários, sem abrir nova Task/frente. #3/#4/#7/#8/#11 conservam regras de pedidos, comunicação/audiência, fiscal, financeiro e portal; recuperar seus registros não autoriza alterar regras de negócio. Permissão não desliga extras admin-only, autoria, revisões ou audiência.

## C1 — operação e leitura protegidas

AP2/AP3 em authority-protocol.md são contrato integrado normativo candidato. Chave (installation,tenant,type,operation_id), digest canônico, ator/ação/contexto derivados no servidor; mesmo ID/digest é idempotente, divergência conflito sem leak. Versão/lock por agregado, sem overwrite nem serialização global. Estado VALIDATED -> LOCAL_UNCERTAIN -> HA_PROVEN -> EXTERNAL_PROVEN -> PUBLISHABLE; ACK perdido nunca significa ausência. Mesmo ID para retry/reconsulta; preenchimento seguro e tentativas limitadas, esgotadas ficam pendentes de reconciliação.

Interfaces lógicas Submit/ProveOutcome/Outcome/PublishOutcome, não URLs existentes: REJECTED/CONFLICT/PENDING com referência opaca, PROTECTED com resultado/versão ou ACCEPTED_JOB separado de conclusão. Cliente não certifica tenant/receipt/protected/epoch. Novo executor reprova via barreira real e corte completo antes de liberar. Todas listas/detalhe/total/busca/preview/export/download/socket/replay/worker e chamadas de serviços usam AP3 antes de agregar/publicar; health/docs/SPA públicos não são mutação de negócio fictícia. Inventário S1 exato em surface-contract-map.json liga cada declaração à fonte setorial; contagem AST não prova completude dinâmica. Dependências privadas só após autorização atual.

Persistência candidata: operação/resultado/digest/versão/journal+outbox na mesma transação LOGGED, barreira, pins/referências, cursores, jobs/attempts, auditoria/policy AEP. Dedupe/tombstones sem poda automática arbitrária; migrations/DDL/URLs/status HTTP concretos são trabalho futuro dos donos após gates. Nenhum código alterado.


## C2 — outbox, integrações e chat

Aquisição e intenção do worker também passam AP3; EFFECT-1 do Backend exige receptor atomizando chave/digest/efeito, consulta terminal e epoch quando necessário. Sem suporte comprovado SMTP/IA/ChatbotX, envio ambíguo suspende retry automático; Message-ID não comprova dedupe. Lease não é fence; PSC AP5 governa saída.

Worker reivindica item com controle concorrente por agregado/conversa e lease; protege aquisição/intenção pela regra C1 antes de enviar. Revalida identidade, audiência, política e autoridade no momento de efeito. Receptor deve aceitar chave idempotente persistente ou fencing efetivo. Worker pausado pode retornar depois do lease: lease sozinho não garante efeito único. Crash após envio sem resposta => EFEITO_EXTERNO_INCERTO; consultar receptor pela mesma chave antes de retry. Sem suporte comprovado, suspender retry automático ambíguo e devolver lacuna do adaptador ao Backend, nunca prometer exactly-once global.

Mensagem tem sequência monotônica por conversa e ID durável; entrega/dedupe por destinatário, cursor recuperável, replay autorizado e ordenado com detecção de lacuna. Socket é aviso; reconexão lê história protegida após cursor, deduplica e retoma pendências. Salva no servidor exige C1/C3; entregue exige ack do destinatário/canal; lida exige ação/ack de leitura autorizado. Perda de cache, conexão ou processo não elimina histórico. Notificação/IA/job: recebido, pendente, executando, incerto, falhou/retry esgotado e concluído são distintos; anexos e resultados de IA mantêm audiência do domínio.


## C3 — objetos e vínculo

AP3/AP4 definem reserva externa durável anterior aos bytes, objeto imutável protegido HA+externo, vínculo/journal/outbox DB e corte obrigatório. PUBLICATION_PIN sobrevive pausa, promoção e COMMIT_UNCERTAIN, sem TTL destrutivo. Add-reference-ack antes de release-pin na mesma autoridade; falha conserva ambos. GC de objetos ERP/staging durável/pins/chaves/dependências permanece off; pontos DB Drive seguem caminho NORMAL RP1–RP4, com safe-off de falha. Prova de objeto no instante passado não dispensa pin atual. DELETE_STARTED/UNKNOWN rejeita novo vínculo na versão; nenhum hold retroativo.

Validar tipo/tamanho/hash sem executar conteúdo, staging privado; bytes e metadados/publicação/diretório duráveis conforme storage. DRBD C single-primary ou objeto multi-AZ continuam alternativas condicionais, não capacidades equivalentes presumidas. Fencing AP2 cobre mounts diretos/fds/root/API e operações em voo. URLs privadas/Range/CDN passam por PSC AP5 em cada chunk; origem não pode contornar revoke.


## C4 — disponibilidade e isolamento

AP2 especifica Admission, mudança de membros, fencing e rejoin; AP0/AP1 incluem autoridade externa sobrevivente. Candidato: três domínios de dados PG16/Patroni+DCS e entrada/app/auth redundantes. DRBD9 com três diskful/quorum/redundância é condicional a kernel/flush/fence; alternativa objeto externo multi-AZ exige adaptador/IAM/capabilities. Witness não é cópia de dados. Preferir reuso FilaOps sem broker novo; dois nós+testemunha não comprovam retomada de novas gravações protegidas em300s após perder data node.

RPO0 DB+arquivos confirmados por perda de um servidor, RTO<=300s da interrupção até reconexão atendimento+pendências+anexos+nova gravação protegida são REQUISITOS NÃO MEDIDOS. Incluir AEP/PSC/DNS/LB/TLS/auth/pools/fence no ensaio, nunca apenas PG promovido. Sem maioria/proteção remota/externa/isolamento, negar/pender, não degradar RPO. Provider/kernel/latência/domínios reais/flush/capacidade/custos são readiness futura, não promessa instalada. Partição arbitrária não garante escrita em ambos lados.


## C5 — backup e conjunto recuperável

Job manual/agendado autorizado possui ocorrência única, fuso IANA, instante UTC, policy_version e IDs estáveis. Em mudança de relógio, uma ocorrência lógica por slot; ocorrência omitida/falha fica explícita, não cria cópia fictícia. Frequência/horário/fuso configuráveis por instalação/empresa, edição concorrente por versão. Antes do snapshot, estabelecer holds de referências/objetos. Dump e inventário de referências usam a MESMA visão consistente; arquivos já são imutáveis. Capturar superset seguro se corte de objetos não puder ser exato. Dump lógico não é base para replay WAL.

Criptografar DB antes de envio, subpasta timestamp+ID sem sobrescrita. Manifesto mínimo: instalação, backup_id, sistema/schema/formato, data, integridade ciphertext e referências seguras ao conjunto; sem segredos ou arquivos ERP no Drive. Reconciliar upload interrompido/ack perdido pela mesma tentativa; sucesso só após verificação remota de ciphertext/manifesto, com alternativa explícita se checksum não disponível. UPLOAD_VERIFIED != SET_SEALED != RESTORE_VERIFIED. Token revogado/invalid_grant suspende jobs/limpeza, pede reconexão autorizada, sem loop infinito.

Conjunto externo liga: DB lógico snapshot/dump/roles ou físico system_identifier/base/timeline/history/cadeia WAL/corte; versões/hash/tamanho/tenant de TODOS os objetos referenciados; artefato/config/schema/extensões compatíveis; identidade e referências de custódia; operação/outbox/cursores/efeitos; policy/classes/holds/dependências; versão/autenticidade do catálogo. Não colocar componentes adicionais no Drive: catálogo completo/config/objetos ficam na trilha externa separada. Catálogo e chave recuperável sobrevivem fora da produção e do destino DB, com controles separados de upload/retenção/restore. Hash sem autenticidade não protege contra substituição maliciosa; assinatura com chave roubada não certifica cópia limpa.

Semântica técnica candidata 30 diárias/12 mensais: manter listas de pontos válidos por classe; um ponto pode contar em ambas e só sai quando dispensado por ambas. Mensal seleciona ponto válido do mês local; se não existir, mostrar lacuna, não fabricar. Padrão configurável não altera guarda legal por classe. A limpeza requerida tem caminho NORMAL RP1–RP4: elegibilidade em ambas classes, reserva autoritativa de sobreviventes/dependências/keys, admissão irrevogável anterior ao envio, DDE exclusivo sem bypass e recibo terminal por fileId. Safe-off só em falha/precondição/UNKNOWN. Hold pedido antes de admissão bloqueia e pode confirmar; depois apenas pedido/não garantido, fecha novas admissões e exige reconciliação sem DELETE implícito. RP5 distingue estados por arquivo/ponto e substituto novo. Nenhum descarte executado aqui. Cifra autenticada, nonce correto, envelope/key_id e versões antigas sob custódia independente; rotação preserva tudo que pontos/holds dependem, rewrap só após validação, sem biblioteca escolhida agora.


## C6 — recuperação conjunta e autoridade atual

AP0/AP1/AP3/AP6 fecham candidata lógica externa: base física+WAL contínuo/history, journal semântico reconstruível, TODOS objetos/pins/config/keys e política atual em cut selado antes de sucesso. Drive dump DB é trilha adicional, não base WAL nem catálogo completo. Prefixo externo sem bytes, ANY local, assinatura antiga ou log assíncrono não bastam. Sem dual-write PG+AEP presumido; commit local sem seal fica pendente.

Restore começa RECOVERY_CLOSED, bootstrap/head externo atual, verifica cut/bytes/chaves/compatibilidade e reconcilia política/canais/efeitos antes de abrir. Sessões do dump invalidadas com novo session_floor durável. Política AEP canônica completa prevalece; REVOKING nega e não ressuscita grant. Perda do HA com AEP/custódia sobreviventes tem plano; restore geral não recebeu meta300s automaticamente. Corrupção requer ponto limpo+journal/causalidade e validação de legítimos, não replay indiscriminado. Limite de intenção maliciosa indistinguível e destruição literal de toda história/chaves explícito AP6. Horizonte finito H NÃO inventado; recomendação sem poda externa automática tem impacto de espaço/privacidade a revisar, sem janela de perda aprovada.


## C7 — autorização e telas dependentes #2

Efetivo = contexto/empresa/registro/campo válidos E (perfil OU allow individual) E ausência de deny E invariantes do domínio. Alçada de aprovação é condição adicional. Alterar override não muda perfil de outros nem status admin; extras obrigatoriamente admin-only. Backend aplica em API, acesso direto, arquivos, exportação e chat, inclusive operações em voo antes de entregar novos dados. AEP AP5 é autoridade da política completa, PG projeção. Policy CAS/auditoria/invariantes são atômicos na AEP; PG não é segundo mestre. REVOKING fecha gates e confirmação espera TODOS PSC DRAINED/FENCED+estado externo final e projeção/cut protegidos. Política versionada, concessão/revogação/auditoria atômicas na autoridade canônica; autor/alvo/delta/data/versão sem segredos. Guarda de último admin serializa só conjunto administrativo da empresa; duas remoções/desativações não podem deixar zero. Autoelevação via perfil/override/import/API negada.

Reusar Settings/AdminUsers e gestão FilaOps; não alegar que count atual ou refresh token revogado resolve concorrência/socket. Backups: conectar/reconectar, escolher pasta, frequência/horário/fuso/retenção, executar manual, histórico/paginação/filtros/falhas. OAuth callback usa state descartável ligado a sessão/ator/tenant/redirect, reautoriza ao concluir; token só backend cifrado. drive.file é candidato limitado, NÃO append-only; não ampliar escopo por conveniência. Verificar capabilities de pasta existente/shared drive antes da spec final.

Estados FE exigidos: carregando, vazio legítimo, sem resultados, negado, indisponível, edição preservada, conflito com versão, pendente/incerto, erro/retry esgotado, reconectar/cancelado/expirado e sucesso comprovado. Backups distinguem fila/export/cifra/upload/verify/restore; Usuários mostra herdado/allow/deny/efetivo/alçada separados e confirmação de revoke aplicada às conexões. Navegação teclado, foco no erro, mensagens anunciadas e rótulos claros; não esconder controles como substituto da autorização. Mockup e validação visual/runtime N/A nesta entrega documental; QA UI dos fluxos/estados é aplicável. Nenhum código UI ou Task #2 foi aberto.

## Adendo documental humano r8/r9 ao C1/C7

O ciclo de rascunho/fila e os códigos públicos seguem phase-spec.md §§ Rascunho local/P4/P6, save-failure-catalog.md e save-acceptance-r9.json. Não alteram a união de 39 requests, o resultado protegido AP3, a autorização atual AP5, o CAS ou os protocolos RP. A fila não é prova de commit; um rascunho anterior ao clique não é operação submetida. Só copiar bytes cifrados não prova recuperabilidade. Políticas abertas permanecem explícitas e impedem habilitar o ciclo de vida dependente.
