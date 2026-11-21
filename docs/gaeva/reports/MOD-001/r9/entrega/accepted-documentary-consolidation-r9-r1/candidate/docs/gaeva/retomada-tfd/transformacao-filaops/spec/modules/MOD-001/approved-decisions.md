# Decisões humanas — recuperação, backups e permissões — r1

Data: 18/11/2026. Fonte: respostas expressas do usuário às três perguntas `openbot.ask_user` (`recovery_targets`, `backup_retention`, `recovery_approver`) neste chat. Registro consolidado pelo coordenador; requisitos aprovados de negócio, não capacidades comprovadas nem aceite da Task completa. Aplicação documental autorizada; implementação e execução operacional não autorizadas. Histórico A0 FAILED/P1 OPEN não alterado.

## Recuperação e arquitetura requerida

- RPO de **0 minutos** para mensagens, pedidos, recebimentos, artes e arquivos cuja gravação o Gaeva já confirmou, diante de falha ou perda de **um servidor**.
- RTO de **até 5 minutos**, da interrupção à recuperação das jornadas essenciais, incluindo reconexão do atendimento, recuperação de mensagens pendentes e acesso aos arquivos.
- Manter implantação containerizada em VPS, reaproveitando FilaOps, ChatbotX e contratos existentes. PostgreSQL com replicação síncrona, failover seguro e servidores em domínios de falha independentes. Proteção equivalente para arquivos e consistência dos vínculos com o banco.
- Cache pode apoiar desempenho, presença e eventos; sua perda não pode apagar mensagens ou operações confirmadas.
- Desastres de todas as cópias, exclusões e corrupção exigem plano específico com backups externos protegidos e restauração testada. **Nenhuma janela de perda de dados foi aprovada nesses cenários.** Não estender silenciosamente a garantia para um cenário ainda sem plano comprovado.
- Metas são requisitos a implementar e comprovar por DevOps/Database, não resultados medidos. Não impor serialização global dos salvamentos como substituto da consistência.

## Operações e atendimento

- Permitir salvamentos simultâneos; tratar concorrência no mesmo registro sem sobrescrita silenciosa. Sucesso somente após confirmar persistência com a proteção exigida.
- Resposta ausente/timeout: consultar o resultado ou repetir a mesma operação com o **mesmo identificador único**. Prevenir duplicação de pedidos, mensagens, cobranças e demais efeitos. Resultado desconhecido permanece pendente de reconciliação; não significa operação ausente.
- Falha temporária: tentativas limitadas, intervalos e controle de duplicidade; preservar dados preenchidos com segurança.
- Salvamento não confirmado: informar falha ou pendência e preservar preenchimento; nunca mostrar salvo sem confirmação nem descartar solicitação silenciosamente.
- Notificações, IA e integrações demoradas podem executar em segundo plano com registro persistente, estados, retomada e prevenção de efeitos duplicados. Diferenciar recebido para processamento de concluído.
- Chat: persistir mensagem e pendência de entrega na **mesma transação**; entrega em tempo real, recuperação após reconexão, ordem por conversa e ausência de duplicação. Distinguir salva no servidor, entregue e lida. Queda da conexão/reinício de contêiner não elimina mensagens confirmadas.
- Comprovar ponta a ponta: falhas durante gravação/confirmação/entrega, perda de resposta, reconexão, reinício de contêiner, perda de um servidor e recuperação de arquivos vinculados. Medir RPO/RTO, integridade, ausência de perda de operações confirmadas e de efeitos duplicados.

## Configurações → Backups

- Padrão: **30 cópias diárias e 12 cópias mensais do banco**. Retenção configurável por instalação/empresa pelo administrador autorizado. Não presumir se um ponto conta nas duas classes sem resolver a semântica técnica explicitamente na spec.
- Permitir conectar Google Drive, selecionar pasta principal, configurar frequência, horário, fuso e retenção, executar backup manual e consultar histórico/falhas.
- Cada backup cria subpasta própria com data/hora e identificador único: backup consistente do banco **criptografado antes do envio** e manifesto com instalação, versão do sistema/schema, data e verificação de integridade.
- Não sobrescrever pontos anteriores. Proteger credenciais; manter cópia recuperável da chave de descriptografia **separada do destino dos backups**. Não registrar segredos em docs/recibos.
- Sucesso somente após concluir e verificar upload. Limpeza conforme retenção, preservando último ponto válido e dependências de recuperação. Suspender descarte quando houver falha de backup ou bloqueio de preservação.
- Snapshots da VPS são proteção separada. Google Drive recebe **somente backup do banco**. Restauração verifica compatibilidade com arquivos/uploads disponíveis no snapshot; snapshots do provedor não são considerados previamente validados.
- Teste de restauração em ambiente isolado obrigatório. Backup diário não substitui replicação necessária ao RPO zero.
- Guarda legal de documentos terá política própria por classe; retenção acima é operacional. **Nenhum descarte autorizado agora.**

## Aprovação de negócio e Configurações → Usuários e permissões

- Nesta revisão, **o usuário aprova as definições de negócio**. Em produção, cada empresa designa responsável autorizado para tolerâncias de recuperação e retenção, com delegação expressa e auditável. Não exigir outro aprovador nominal para reconhecer esta decisão humana atual.
- Cada tipo de usuário/setor possui perfil predefinido. Administrador autorizado escolhe perfil ao cadastrar/editar pessoa e pode liberar/restringir funções individualmente, sem alterar padrão dos demais nem transformar a pessoa em administrador.
- Catálogo de permissões por módulo/ação: consultar, criar, editar, aprovar, exportar, excluir quando permitido, configurar integrações, administrar backups e demais operações sujeitas à autorização.
- Mostrar permissões herdadas, liberações individuais, restrições individuais e acesso efetivo. Restrições individuais prevalecem sobre permissões do perfil.
- Acesso e alçada de aprovação distintos: consultar/editar configuração não concede automaticamente autoridade de aprovar decisões de negócio.
- Permissões não desligam regras obrigatórias do domínio; preservar concessão de cotas extras somente por administrador autorizado.
- Backend valida todas as entradas: API, acesso direto, arquivos, exportações e eventos do chat. Isolamento por empresa e restrições por registro e campo.
- Auditar concessões, revogações e aprovações: autor, usuário afetado, alteração, data e versão da política. Impedir autoelevação e remoção/desativação do último administrador ativo, inclusive com concorrência. Revogações alcançam sessões e conexões existentes.
- Reaproveitar gestão de usuários FilaOps. Incorporar ao Discovery e às specs canônicas da Plataforma e módulos afetados, sincronizar issues e obter revisão documental independente.

## Roteamento e limites

Discovery incorpora estas decisões na revisão corrente ou em nova revisão imutável e decompõe cobertura/efeitos sobre Fundação e Plataforma. As novas telas de Backups/Usuários tornam inadequado manter N/A global de frontend para todo o escopo ampliado; a alocação entre módulos deve ser explícita, sem iniciar outra frente de Task. Registrar dependências dos demais módulos para aplicação posterior em sua ordem.

Autor corrige seus artefatos; QA independente revisa revisão exata. A solicitação de sincronizar issues integra o pedido atual; qualquer escrita externa exige verificar ator, destino, capacidade e matriz de governança, sem presumir autorização para push/PR/merge/deploy. Enquanto isso, manter minutas revisáveis. Este registro não altera fontes congeladas, não recria G1 histórico, não amplia pareceres antigos e não autoriza operação de infraestrutura, conexão do Drive, descarte, restore ou fabricação.

Aplicação documental proposta: fonte antes de Roteamento é registro humano, Roteamento interpretação. Ordem atual NO GitHub publication supersede intenção histórica de sync.
