# Fundação — comportamento esperado no Gaeva OS, r9

O ERP preserva o trabalho elegível enquanto a pessoa preenche uma ficha e informa com clareza se o salvamento foi confirmado. Os dados temporários ficam cifrados neste dispositivo, ligados à conta, empresa e ficha. Antes de clicar em **Salvar**, não há envio nem operação na fila.

**Salvar** fixa uma intenção imutável: ID, versão esperada, conteúdo e anexos elegíveis. A interface mostra **Salvamento pendente** até a confirmação protegida do servidor. Só entram na fila durável e cifrada as cópias cuja persistência local foi confirmada e que podem ser recuperadas com segurança. Novas edições ficam separadas da intenção em trânsito.

Na retomada, o ERP valida online a autorização atual e consulta a operação original. Só repete quando o contrato permitir, usando o mesmo ID, versão e conteúdo. Resultado incerto não permite reenvio cego. A confirmação remove apenas a versão reconhecida e preserva edições posteriores. Conflito exige revisão e decisão explícita antes de uma nova intenção. Ações sem fila também preservam a incerteza quando não há confirmação.

A interface apresenta **Falha**, um número estável e a próxima ação. 1101: cópia confirmada na fila e falha temporária; 1102: confirmação desconhecida, consultar; 1103: guarda local esperada falhou ou se perdeu; 1104: conflito de versão, revisar; 1105: sessão ou permissão inválida, revalidar; 1106: campos inválidos, corrigir. O [catálogo](save-failure-catalog.md) define condições e precedência. Confirmação protegida permanece **Salvo**, mesmo se a limpeza local precisar ser repetida, sem reenviar a gravação.

Troca de conta/empresa, logout, expiração ou revogação conhecidos bloqueiam abertura e retomada. Outra conta não recupera a cópia, mesmo tendo acesso à mesma ficha. Reabrir depende de autorização online do titular. Não há promessa de recuperação após remoção dos dados pelo navegador, nem de processamento com o ERP fechado. RPO zero do servidor não cobre rascunho local ainda não confirmado.

## Decisões ainda abertas

Prazo de abandono: opções são prazo fixo por classe/formulário ou descarte explícito pelo titular dentro de uma política revisada. Recomenda-se prazo configurável por classe e aviso antes de expirar, sem escolher duração nem descartar pendências não confirmadas silenciosamente. **Recomendação técnica, não aprovada.**

Após logout/revogação: opções são remoção imediata da cópia cifrada ou retenção inacessível por prazo revisado, com recuperação somente se o mesmo titular voltar a obter autorização online. Recomenda-se definir retenção inacessível com prazo e descarte verificável por classe, conciliando continuidade e minimização. **Recomendação, não aprovada; não habilitar o ciclo de vida em produção sem decisão.** Preservar bloqueio imediato conhecido em qualquer alternativa.

## Leitura técnica

[Contrato completo](phase-spec.md), [Task JSON](../../tasks/MOD-001/task.json), [vista gerada](../../tasks/MOD-001/task.md), [critérios e testes futuros](save-acceptance-r9.json), [fontes do aceite](human-acceptance-r9.json). O aceite refere-se ao escopo documental; a nova consolidação aguarda revisão independente. Produto, autorização/CAS, navegador e scheduler ainda não foram executados. A0 FAILED, P1 OPEN, P2/P3 não liberadas; RPO 0/RTO 300 s não medidos.
