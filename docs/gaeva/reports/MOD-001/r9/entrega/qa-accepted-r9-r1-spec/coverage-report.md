# Cobertura complementar primeiro — parecer separado

PASS documental da suficiência dos acréscimos humanos r8/r9 na matriz save-acceptance-r9.json, SHA256 bfe0076d3350b5850bda766b8a4b8f6932b2a183f89f4e08a72d86a52d953408, para a tupla accepted-documentary-consolidation-r9-r1. Não é PASS G3 nem nova revisão de Discovery r7.

Fontes humanas lidas independentemente por GitHub MCP: 7026601969 e 7027205182, autor guilhermedemorais-dev; cópia independente em github-current.json. Conferência semântica confrontou cada obrigação dos dois corpos com phase-spec §§ Rascunho/P4/P6, catálogo e vetores, não apenas IDs ou número de linhas.

| Vetor | Obrigação confrontada e resultado |
|---|---|
| LC-01 | Digitar antes do clique: cifra local confirmada, zero mutação e zero intenção de envio; AC/TEST-156. |
| LC-02 | Clique antes do envio: intenção imutável, proteção confirmada; retorno só após autorização/consulta; mesmo ID/versão/conteúdo. |
| LC-03 | Envio sem commit conhecido: ausência na autoridade precisa permitir retry; resultado incerto não é ausência. |
| LC-04 | Commit com ACK perdido: GetOutcome recupera confirmação original, sem repetir efeito. |
| LC-05 | Edição v2 enquanto v1 pendente: apagar somente v1 e anexos sem outras referências; AC/TEST-155. |
| LC-06 | Conflito: preservar draft, revisar dados autorizados; reaplicação explícita com novo ID e versão. |
| LC-07 | Conta/empresa/registro adulterado: nenhuma leitura, chave ou envio alheio; AC/TEST-178. |
| LC-08 | Logout/expiração/revogação: bloqueio conforme conhecimento, reabertura/retomada só com validação online; AC/TEST-180. |
| LC-09 | Quota/cifra/transação: 1103 sem persistir em claro nem prometer fila; online autorizado continua possível. |
| LC-10 | Rotação/chave indisponível: recuperar quando autorizado ou bloquear explicitamente, sem perda silenciosa. |
| SQ-01 | Fila comum entre abas: somente intenções elegíveis confirmadas; dedupe do servidor continua obrigatório. |
| SQ-02 | Guarda perdida com resultado incerto: 1103 impede promessa de fila e mantém orientação de consulta original. |
| SQ-03 | Sem fila por contrato, com consulta: 1102, consulta autorizada, nenhum replay automático. |
| SQ-04 | Sem fila e sem consulta: 1102, incerteza explícita e fluxo autorizado; nenhum reenvio cego. |
| SQ-05 | Dados inválidos: 1106, campos visíveis sinalizados, correção cria intenção nova; AC/TEST-154. |
| SQ-06 | Protegido mas limpeza falhou: permanece Salvo, repetir apenas limpeza correspondente. |
| SQ-07 | ACK de outro ID/versão: não confirmar/apagar; preservar intenção e novas edições. |
| SQ-08 | Reabrir com o titular: autorização online, consulta original, um efeito; retry somente quando permitido. |

Perspectivas aplicáveis: negócio — escopo vem dos comentários, políticas abertas não decididas; UI/UX — rótulo Falha, seis números e ações, sem só cor; frontend — draft/snapshot, abas, armazenamento, limpeza exata; backend — autorização/GetOutcome/dedupe/CAS; dados — cifra/contexto/versões/anexos; segurança — custódia e acesso atual; qualidade — testes após implementação com falha injetada e observação de efeitos; operações — limites de armazenamento/chaves/recuperação e reestimativa antes da fase. Nenhuma dessas áreas recebeu N/A global para o novo comportamento. Aprovação de cada setor permanece separada.

Catálogo por ação é política complementar, não inventário de todos os formulários: todas as 39 entradas conservam permission/retry/persistence existentes e automatic_replay_proven=false. Consultas/callbacks não são cliques Salvar; queue_enablement não concede fila. Inventário concreto por módulo e justificativa para não replay são obrigações futuras explícitas, adequadas ao mandato documental.

Discovery r7 permanece histórica: 31 REQ/38 RULE/22 fluxos/88 cenários pré-existentes e conteúdo dos 11 MT iniciais são conservados por comparação dos bytes/estruturas. Os 18 LC/SQ complementam aceites existentes sem alegar cobertura retroativa. As duas decisões OPEN impedem habilitar o ciclo de vida dependente em produção; opções/recomendação não são decisões humanas nem omissões escondidas.

Não há lacuna major/blocker identificada no recorte documental atual. Este resultado não prova execução futura, browser suportado, primitives criptográficas ou desempenho; parâmetros e gates anteriores permanecem exigidos.
