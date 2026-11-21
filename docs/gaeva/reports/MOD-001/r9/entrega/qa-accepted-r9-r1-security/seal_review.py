from pathlib import Path
import json,hashlib
O=Path(__file__).resolve().parent;P=O.parent/'accepted-documentary-consolidation-r9-r1'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
K=Path('C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/knowledge/tfd-0.1.6')
M='candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/'
actor='agent-6b9f3e9e-8ea7-4483-a52c-63129f849a5a'
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(n,v):(O/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
remote=[{'origin':'https://www.w3.org/TR/2017/REC-WebCryptoAPI-20170126/','revision':'Recommendation 2017; generic TR redirected to Level 2 draft, not selected for implementation','locator':'sections 5-6; key storage and author security considerations','observation':'API primitives do not establish safe application key custody or protection against compromised same-origin scripts.'},{'origin':'https://www.w3.org/TR/2026/WD-IndexedDB-3-20261030/','revision':'Working Draft 2026-10-30','locator':'2.7 Transactions; durability hints','observation':'Transaction completion and durability hint require actual browser/capability verification; no browser durability certified.'},{'origin':'https://storage.spec.whatwg.org/','revision':'Living Standard 2026-10-19','locator':'4.2 storage keys; 7 management','observation':'Storage key based on origin, not ERP account; storage loss remains possible. Account isolation must be enforced by application.'}]
save('primary-source-consultation.json',{'consulted_by':actor,'method':'actual web open/find during this review','sources':remote,'scope':'independent conceptual verification; no selected crypto parameters, no compatibility assertion'})
sources=[]
paths=[K/'skills/TFD-devops/SKILL.md',K/'skills/TFD-security/SKILL.md',K/'skills/TFD-devops/references/github-readiness.md',K/'skills/TFD-devops/references/project-governance.md',K/'skills/TFD-harness/references/stage-loop.md',K/'library/architecture/technical-decision-procedure.md',K.parent.parent/'router.md',B/'docs/stage-loop.md',B/'library/plugins/security-standard/skills/security-standard/SKILL.md']
for n in ['preventive-security-research','false-positive-validation','coverage-model','finding-standard']:
 paths.append(B/('library/plugins/security-standard/skills/security-standard/references/'+n+'.md'))
for n in ['review-input.json','internal-governance.md','delivery-report.md','human-source-comments.json','source-map.json','changed-paths.json','verify.py','verify_saved.py','verify_relations.py','checker-source.py']:
 paths.append(P/n)
for n in ['phase-spec.md','contracts.md','authority-protocol.md','product-behavior-r9.md','save-failure-catalog.md','save-acceptance-r9.json','save-action-bindings-r9.json','typed-actions-v1/action-catalog.json']:
 paths.append(P/(M+n))
for p in paths:
 assert p.is_file(),str(p)
 sources.append({'path':str(p),'sha256':h(p),'revision':'bytes consulted in current r9 review','locator':'full file or scoped security sections as recorded in review.md','status':'VERIFIED'})
nav={'method':'graphify','query':'security review local encrypted drafts queued intents recovery authorization revocation key loss','evidence':'navigation.json','sha256':h(O/'navigation.json'),'status':j(O/'navigation.json')['status']}
save('consultation.json',{'actor':actor,'role':'independent operational security assurance','task_id':'GAEVA-MOD-001','contract_revision':9,'gate':'UNKNOWN','navigation':nav,'sources':sources,'primary_sources_evidence':{'path':'primary-source-consultation.json','sha256':h(O/'primary-source-consultation.json')},'scope':'documentary only; no inherited peer or author PASS'})
coverage=[
 ('SEC-R9-01','Conta/empresa/ficha/anexos','phase-spec:85-95; LC07/08','Contexto autenticado e chave por versão; outra conta autorizada à ficha ainda é recusada. Contexto local não prova permissão; projeção allowlisted e anexos limitados.'),
 ('SEC-R9-02','Custódia/rotação/perda','phase-spec:93-95; LC09/10','Chave privada no ERP autorizado, conteúdo/chaves abertas não persistidos; nova autorização online do titular antes de recuperar. Rotação não pode inutilizar cópias silenciosamente. Primitivas/parâmetros e recuperação real ainda sujeitos a revisão e ensaio.'),
 ('SEC-R9-03','Logout/revogação e abas','phase-spec:90; LC08; product-behavior decisões abertas','Bloqueio imediato quando conhecido, liberação de referências abertas e revalidação no servidor. Origem/sessão comprometida fora da garantia. Abandono e destino após logout OPEN, com opções e recomendação não aprovada; dependências não habilitáveis em produção.'),
 ('SEC-R9-04','Fila/replay/ACK','phase-spec:85-114; SQ01-08; saved fixture checks','Somente snapshot recuperável confirmado; rascunho e intenção separados. Consulta original e autorização corrente precedem retry elegível. ID/versão/conteúdo preservados; ACK alheio não remove cópia; limpeza falha após PROTECTED não reenvia gravação.'),
 ('SEC-R9-05','Falhas/visibilidade','save-failure-catalog completo','1103 não promete fila; 1102 conserva incerteza inclusive sem fila/consulta; 1105 restringe leitura/consulta sem revelar existência. Código não substitui reason seguro/autorização. Sem HTTP ou token bruto como mensagem.'),
 ('SEC-R9-06','U5/U6 leitura/autoridade/efeitos','contracts C1-C7; authority AP0-AP6; hashes preservados','Política atual antes de liberação; REVOKING nega; todos PSC drenados/cercados; restore fechado e invalidação de sessões antigas. Sem canal direto, credencial alternativa, replay externo ambíguo ou recuperação de todas histórias/chaves destruídas.'),
 ('SEC-R9-07','39 ações/permissões/internas','action-catalog; save-action-bindings; action-checks.json','Permissões distintas mantidas; alçada não decorre de configurar; callback OAuth e scheduler internos não viram Salvar. Catálogo não habilita fila/replay. 195 extras de contexto rejeitados no subconjunto; isso não executa autorização.'),
 ('SEC-R9-08','Integridade/escopo','input-verification; documentary-invariants; no-input-drift','157 membros e tuple íntegros; 45 propostas, 7 preimages, 7 contexto; reconstrução de diff local exit0. Sem aplicação nem escolha da raiz; ausência futura de adições ainda deve ser verificada no alvo.')]
save('coverage.json',[{'id':i,'surface':s,'evidence':e,'observation':o,'status':'REVIEWED','assurance':'DOCUMENTARY_ONLY','runtime':'NOT_VALIDATED'} for i,s,e,o in coverage])
find={'task_id':'GAEVA-MOD-001','contract_revision':9,'microtask':'DOC-R9-QA-01','actor':actor,'role':'independent operational security assurance','input_manifest_sha256':h(P/'manifest.json'),'review_input_sha256':h(P/'review-input.json'),'verdict':'PASS','scope':'DOCUMENTARY_ONLY','findings':[],'completion_blocked':False,'runtime_security_status':'NOT VALIDATED','open_decisions':['abandonment period','copy fate after logout/revocation'],'no_implementation_or_release_approval':True}
save('findings.json',find)
report='''# Parecer independente de segurança operacional documental — contrato 9

**PASS documental**, exclusivamente para a tupla em input-verification.json, manifesto e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf e review-input e1ca7d28e10801fde590975765502fbb8d646d2648c1330fc06dd80968840961. Nenhum achado documental impeditivo. Segurança em execução: **NOT VALIDATED**. Este parecer não é aceite humano nem PASS operacional/G9.

Ator agent-6b9f3e9e-8ea7-4483-a52c-63129f849a5a, assessor independente designado; autor Architecture agent-65a76b70-79bc-4539-b8b9-840998b76a10. Não autorizei nem corrigi contribuições originais. Meus pareceres históricos são avaliações, não autoria dos controles. Nenhum veredicto futuro de pares ou antigo PASS foi usado para aprovar estes bytes. Mensagem ddd80af6-c02a-4ef0-b946-2d6cd3509ae8, MT DOC-R9-QA-01, gate UNKNOWN.

## Evidência e conclusão por superfície

'''+ '\n\n'.join('**'+i+' — '+s+'** ('+e+'). '+o for i,s,e,o in coverage)+'''

## Verificações efetivamente executadas

check_review.py: exit0; 157 hashes/tamanhos, tuple, controles preservados, 39 ações e 195 negativos de contexto. verify_saved.py: exit0, 238 positivos válidos/238 negativos rejeitados nos arquivos salvos. verify_relations.py: exit0, 18 casos/8 cadeias; WRITE_ID_SWAPPED e ORIGINAL_ID_SWAPPED: exit1 esperado, 8 rejeições cada. verify.py: exit0 para invariantes documentais/diffs; --manifest exit0. Comandos completos, stdout/stderr e exits em commands.json. Leitor de tokens exit2, recibo indisponível; turno parcial.

A função check foi lida e isolada por AST, sem executar o gerador checker-source.py. Os demais scripts foram inspecionados antes de execução. Subconjunto explícito de JSON Schema, sem certificação integral 2020-12 e sem simular autorização, cifra, CAS, armazenamento ou scheduler. Nenhum ensaio de produto realizado.

Consulta própria: Graphify atual e fontes canônicas em consultation.json. Fontes humanas locais 7026601969/7027205182 foram lidas diretamente; identidade remota não foi reautenticada neste parecer. W3C WebCrypto Recommendation 2017, IndexedDB 3 WD 2026-10-30 e WHATWG Storage 2026-10-19 conferidos em fontes primárias: armazenamento por origem exige isolamento da aplicação; transação/durability e cifra não comprovam a composição. A URL genérica de WebCrypto redirecionou ao draft Level2; não o tratei como seleção aprovada de implementação. Ver primary-source-consultation.json.

## Limites preservados

Banco, API/Backend, Frontend/UI, Infra/DevOps e Privacidade: contratos documentais revisados; execução NOT VALIDATED. Dependências/Supply Chain: nenhuma alteração/install/build, sem auditoria de dependências. Navegador, custódia e rotação reais, negativas de permissão/revogação, provedores, RPO0/RTO300s e AEP/DDE/PSC não executados/comprovados. Falta de implementação não é achado de vulnerabilidade confirmada.

Abandono e destino após logout/revogação continuam OPEN: bloqueiam habilitação dos fluxos dependentes, não esta entrega documental. Gate UNKNOWN, A0 FAILED, P1 OPEN, P2/P3 não liberadas e contadores 3/3 e 2/3 intactos. R8/r9 são acréscimos humanos explícitos, sem reset. Sem garantias se todas cópias/chaves forem destruídas. Nenhuma decisão de quorum/raiz/horizonte alterada. Sem aceite de outro setor.

Escritas somente nesta pasta independente: checker, recibos, consulta e relatório. Nenhum arquivo de entrada/projeto/biblioteca/configuração alterado; no-input-drift.json registra readback dos 157 membros. Nenhum commit/push/publicação/DB/infra/build/restore/failover executado.
'''
(O/'review.md').write_text(report,encoding='utf-8')
save('stage_receipt.json',{'version':1,'actor':actor,'role':'security','gate':'UNKNOWN','phase':None,'revision':9,'microtask':'DOC-R9-QA-01','mode':'independent documentary review','artifacts':j(P/'review-input.json')['artifacts'],'knowledge':{'navigation':nav,'sources':sources},'checks':j(O/'commands.json'),'findings_sha256':h(O/'findings.json'),'verdict':'PASS DOCUMENTARY_ONLY','runtime_security_status':'NOT VALIDATED'})
for x in j(P/'manifest.json')['files']:assert h(P/x['path'])==x['sha256']
files=[{'path':p.relative_to(O).as_posix(),'sha256':h(p),'bytes':p.stat().st_size} for p in O.rglob('*') if p.is_file() and p.name!='manifest.json']
save('manifest.json',{'actor':actor,'contract_revision':9,'verdict':'PASS DOCUMENTARY_ONLY','files':files})
for x in files:assert h(O/x['path'])==x['sha256']
print('SEALED',len(files),'files',h(O/'manifest.json'))
