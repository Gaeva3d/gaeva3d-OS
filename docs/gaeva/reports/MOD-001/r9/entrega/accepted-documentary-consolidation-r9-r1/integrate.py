"""Bounded documentary integration. Writes only this new packet, never a project."""
from pathlib import Path
import json, hashlib, shutil, difflib, sys
O=Path(__file__).resolve().parent; R=O.parent; OLD=R/'final-documentary-candidate-r5'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
P='docs/gaeva/retomada-tfd/transformacao-filaops/spec'; M=P+'/modules/MOD-001'; TP=P+'/tasks/MOD-001/task.json'
def h(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def write(p,s):
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8',newline='\n')
def wj(p,v): write(p,json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def edit(p,a,b):
 s=p.read_text(encoding='utf-8-sig');assert s.count(a)==1,(str(p),a[:100]);write(p,s.replace(a,b,1))
assert not (O/'candidate').exists(),'Refuse integration over existing output'
# Read and pin actual complete inputs before copying or modifying their new copies.
inputs={}
for folder in ['final-documentary-candidate-r5','architecture-draft-save-r1','architecture-save-queue-r1']:
 for path in (R/folder).rglob('*'):
  if path.is_file(): inputs[str(path)]=h(path)
for rel in ['qa-architecture-draft-save-r1/attempt-2/findings.json','qa-architecture-save-queue-r1/attempt-2/findings.json','discovery-r7/manifest.json','discovery-r7/coverage.json','discovery-guide-review-r1/findings.md']:
 inputs[str(R/rel)]=h(R/rel)
assert h(R/'architecture-save-queue-r1/manifest.json')=='358aeee9bb08d00985ba098b0617ddbbef0b21d87512c8a34e290ca58988ff2f'
assert h(R/'discovery-r7/manifest.json')=='a870f87b025f0061936062243d4c589ef9d8a8ae44d52dab011efa33135c576c'
for name in ['architecture-draft-save-r1','architecture-save-queue-r1']:
 manifest=j(R/name/'manifest.json')
 for entry in manifest['delta']: assert h(R/name/'candidate'/entry['path'])==entry['candidate_sha256']
 f=j(R/('qa-'+name)/'attempt-2/findings.json');assert f['verdict']=='PASS' and f['revision']==h(R/name/'manifest.json')
wj(O/'input-hashes.json',inputs)
shutil.copytree(OLD/'candidate',O/'candidate');shutil.copytree(OLD/'preimages',O/'preimages')
C=O/'candidate';mod=C/M
for p in (R/'architecture-save-queue-r1/candidate').rglob('*'):
 if p.is_file(): dest=C/p.relative_to(R/'architecture-save-queue-r1/candidate');dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest)
t=j(C/TP);assert t['contract_revision']==9
# Task r9 is retained byte for byte: no same-revision contract edits.
edit(mod/'phase-spec.md','# Fundação — especificação proposta do contrato r9','# Fundação — contrato documental r9 consolidado')
edit(mod/'phase-spec.md','Research tuple r3+Discovery r6 tem quatro PASS documentais qualificados antes desta autoria, não G4/G6, aceite ou autorização operacional. Estes NOVOS bytes precisam QA próprio.','A pesquisa r3/Discovery r6 tem quatro PASS históricos restritos. A cobertura formal de referência é Discovery r7, preservada por hash; os acréscimos humanos r8/r9 têm fontes e matriz complementar próprias. O aceite comunicado em 20/11 cobre o escopo documental r8/r9; a nova tupla consolidada precisa de QA independente. Gate formal UNKNOWN, sem G6 ou autorização operacional inferidos.')
edit(mod/'phase-spec.md','A decisão humana da revisão de 19/11 está registrada em S5 do Discovery integral.','A decisão anterior de 19/11 consta de S5 em discovery-guide-review-r1/findings.md, distinto de discovery-r7/coverage.json. As fontes humanas exatas atuais são os comentários 7026601969 (r8) e 7027205182 (r9), vinculados em human-acceptance-r9.json deste módulo.')
edit(mod/'phase-spec.md','F07 permanece encerrado no parecer histórico; esta correção F08/QAB-FINAL2-01/SEC-ACT-01/QAUI-FINAL2-01 requer novos pareceres correntes. Taskr7/vista e39requests inalterados, nenhum novo alvo/rota/ação ou aprovação.','F07/F08 e correlações de agenda permanecem histórico da revisão r7, sem nova substituição desses achados. Nesta consolidação, os 39 requests e fixtures de agenda permanecem byte a byte; Task/vista r9 incorporam exclusivamente os acréscimos documentais humanos r8/r9. Os contadores históricos finalspec 3/3 e consolidação 2/3 são preservados; esta ampliação humana é distinta, sem reiniciar contadores. Novos pareceres independentes devem vincular esta tupla.')
write(mod/'phase-spec.md',(mod/'phase-spec.md').read_text(encoding='utf-8')+'\n## Vínculos correntes da consolidação r9\n\n[Descrição do produto](product-behavior-r9.md), [aceite e fontes humanas](human-acceptance-r9.json), [política complementar por ação](save-action-bindings-r9.json), [matriz de critérios](save-acceptance-r9.json) e catálogo de falhas REF-21 integram o contrato. A matriz complementa os 88 cenários antigos, sem renumerar os 31 REQ/38 RULE ou alegar que a cobertura antiga revisou os acréscimos. Consultas e callbacks internos não são cliques Salvar. A elegibilidade concreta de cada formulário/ação exige inventário e prova futuros; presença no catálogo de 39 ações não habilita fila nem retry. Os critérios LC/SQ da matriz são identificadores documentais complementares vinculados aos AC/TEST/MT existentes, não novas Tasks ou eventos.\n\nPrazo de abandono e destino após logout/revogação permanecem OPEN; opções e recomendação em product-behavior-r9.md não são decisões aprovadas. Até decisão e QA aplicáveis, não habilitar esses fluxos em produção. Os parâmetros criptográficos e a matriz de navegadores/capacidade dependem das revisões técnicas e provas futuras já exigidas. A spec não promete recuperação após limpeza do navegador ou execução com o ERP fechado.\n')
comments=j(O/'human-source-comments.json')['comments'];assert {x['id'] for x in comments}=={7026601969,7027205182}
human={ 'task_id':t['task_id'],'contract_revision':9,'scope':'ACCEPTED_DOCUMENTARY_SCOPE_ONLY','formal_gate':'UNKNOWN','dispatch_message_id':'2781fd83-a04d-41f6-9aba-2f19ddee8ef7','reported_human_words':["aprovei leia lá e prossiga","não me pergunta mais nada só me entraga no final vou sair"],'chat_words_provenance':'Relatadas pelo coordenador na mensagem correlacionada; não verificação independente da conversa humana.','github_sources':[{'id':x['id'],'url':x['html_url'],'actor':x['user']['login'],'created_at':x['created_at'],'updated_at':x['updated_at'],'body':x['body'],'body_utf8_sha256':hashlib.sha256(x['body'].encode()).hexdigest()} for x in comments],'accepted_artifacts':[{'path':str(R/n/'manifest.json'),'sha256':h(R/n/'manifest.json')} for n in ['architecture-draft-save-r1','architecture-save-queue-r1']],'new_consolidated_QA':'PENDING','implementation_authorized':False,'operational_authorization':False,'open_decisions':['prazo de abandono','destino da cópia após logout ou revogação']}
wj(mod/'human-acceptance-r9.json',human)
product='''# Fundação — comportamento esperado no Gaeva OS, r9

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
'''
write(mod/'product-behavior-r9.md',product)
# Supplemental catalogue, with no invented UI inventory or inferred replay eligibility.
cat=j(mod/'typed-actions-v1/action-catalog.json');rows=[]
for a in cat['actions']:
 internal=a['action'] in ['CompleteProviderLink','RunScheduledBackup']
 kind='INTERNAL_NOT_UI_SAVE' if internal else ('EXPLICIT_SAVE_IF_FORM_MAPPED' if a['mutation'] else 'QUERY_NOT_SAVE')
 rows.append({'action':a['action'],'contract_locator':a['contract_locator'],'wire_catalog':'typed-actions-v1/action-catalog.json','mutation':a['mutation'],'application':kind,'form_inventory':'NOT_IMPLEMENTED_NOT_VERIFIED','queue_enablement':'NOT_GRANTED_BY_THIS_CATALOG','eligibility': 'requires confirmed encrypted recoverable snapshot + current authorization + safe dedupe/query/recovery contract; not inferred from mutation=true' if kind=='EXPLICIT_SAVE_IF_FORM_MAPPED' else 'not a UI Save intent','permission':a['permission'],'persistence':a['persistence'],'retry':a['retry'],'public_failure_catalog':'save-failure-catalog.md','result_mapping':'interpret authorized typed status/reason AND local state; HTTP/operation ID alone never classify','acceptance_ids':['AC-154','AC-155','AC-156','AC-178','AC-180'] if kind=='EXPLICIT_SAVE_IF_FORM_MAPPED' else [],'automatic_replay_proven':False})
wj(mod/'save-action-bindings-r9.json',{'contract_revision':9,'wire_catalog_sha256':h(mod/'typed-actions-v1/action-catalog.json'),'scope':'supplemental shared Save policy; not 39 new endpoints and not a complete ERP UI inventory','product_action_inventory':'PLANNED after implementation for every module; module routes remain owned by their sectors','actions':rows})
cases=[
 ('LC-01','AC-156','before_save','Rascunho cifrado confirmado; zero mutação e zero intenção na fila.',None),
 ('LC-02','AC-156','after_save_before_send','Intenção imutável e cópia confirmada; revalidar/consultar antes de retry seguro mesmo ID/versão/conteúdo.',1101),
 ('LC-03','AC-156','after_send_before_commit','Consultar autoridade corrente; ausência só autoriza retry conforme contrato, mesmo ID/versão/conteúdo e único efeito.',1102),
 ('LC-04','AC-156','commit_without_confirmation','GetOutcome recupera confirmação protegida original; não repetir efeito.',1102),
 ('LC-05','AC-155','new_edits_during_pending','Confirmar v1 remove só v1; v2 e anexos ainda referenciados permanecem.',None),
 ('LC-06','AC-155','version_conflict','Rascunho preservado; revisão explícita; nova intenção usa novo ID e versão corrente.',1104),
 ('LC-07','AC-178','actor_company_record_isolation','Outra conta/empresa ou vínculo adulterado não lê/recupera chave/envia; não revelar existência alheia.',1105),
 ('LC-08','AC-180','logout_multitab_revocation','Invalidade conhecida bloqueia imediatamente; retomada/reabertura exige acesso atual online.',1105),
 ('LC-09','AC-156','quota_crypto_transaction_failure','Não gravar em claro nem prometer fila; manter memória autorizada, online permitido se autorizado.',1103),
 ('LC-10','AC-178','key_rotation_unavailable','Rotação mantém recuperação autorizada ou sinaliza bloqueio; nenhuma perda silenciosa.',1103),
 ('SQ-01','AC-156','durable_shared_queue_multitab','Só cópias elegíveis confirmadas; mesma intenção não cria nova operação; servidor deduplica.',1101),
 ('SQ-02','AC-156','local_guard_loss_and_unknown','1103 prevalece sobre promessa de fila e explicita resultado incerto/consulta original.',1103),
 ('SQ-03','AC-156','no_queue_contract_unknown_query_supported','1102, consulta autorizada original; sem promessa de cópia e sem replay automático.',1102),
 ('SQ-04','AC-156','no_queue_contract_unknown_no_query','1102, manter incerteza e orientar fluxo autorizado; nenhum reenvio cego.',1102),
 ('SQ-05','AC-154','invalid_fields','1106 sinaliza campos autorizados; corrigir e criar intenção nova; sem retry do inválido.',1106),
 ('SQ-06','AC-156','protected_then_cleanup_failure','Salvo continua; repetir só limpeza correspondente, jamais gravação.',None),
 ('SQ-07','AC-155','wrong_ack_id_version','ACK de outro ID/versão não confirma nem apaga; manter intenção e novas edições.',None),
 ('SQ-08','AC-156','reopen_same_actor_current_access','Consultar operação original após autorização online; mesmo ID/versão/conteúdo quando permitido; uma gravação.',None),
]
acs={x['id']:x for x in t['acceptance_criteria']};vectors=[]
for key,ac,scenario,expected,code in cases:
 a=acs[ac];vectors.append({'id':key,'source_comment_id':7026601969 if key.startswith('LC') else 7027205182,'scenario':scenario,'acceptance_id':ac,'test_id':a['validation'],'microtask_ids':a['microtask_ids'],'requirement_ids':a['requirement_ids'],'rule_ids':a['rule_ids'],'expected':expected,'failure_code':code,'status':'PLANNED_NOT_EXECUTED','oracle':'future authorized isolated product test; sanitized ID/digest/version/state and observed writes/denials; no fixture proves runtime'})
wj(mod/'save-acceptance-r9.json',{'contract_revision':9,'supplemental_not_renumbering':True,'existing_scenarios':88,'source_comment_ids':[7026601969,7027205182],'test_method':'After implementation, fault injection at specified boundary, inspect encrypted store/queue + authorized outcome and count actual effects; contrast wrong actor/version/ID; UI announce status without color-only meaning. Include two or more domains and concurrent tabs.','vectors':vectors})
# Keep the complete old normative protocols and typed requests untouched.
write(mod/'contracts.md',(mod/'contracts.md').read_text(encoding='utf-8')+'\n## Adendo documental humano r8/r9 ao C1/C7\n\nO ciclo de rascunho/fila e os códigos públicos seguem phase-spec.md §§ Rascunho local/P4/P6, save-failure-catalog.md e save-acceptance-r9.json. Não alteram a união de 39 requests, o resultado protegido AP3, a autorização atual AP5, o CAS ou os protocolos RP. A fila não é prova de commit; um rascunho anterior ao clique não é operação submetida. Só copiar bytes cifrados não prova recuperabilidade. Políticas abertas permanecem explícitas e impedem habilitar o ciclo de vida dependente.\n')
write(mod/'validation-plan.md',(mod/'validation-plan.md').read_text(encoding='utf-8')+'\n## Acréscimos humanos r8/r9 — P4/P6\n\nA matriz save-acceptance-r9.json especifica cenários LC/SQ ligados a AC/TEST/MT existentes. Validar após o código com inventário de todos os Salvar por módulo, isolamento entre contas/empresas/registros, dois domínios distintos, múltiplas abas e perda de conexão nos três pontos descritos. Verificar cifra/chaves, recuperação online, rotação, quota, ACK exato, preservação de edições novas, conflito, ausência de fila por contrato, precedência 1103/1102 e limpeza após confirmação. Inspecionar efeitos reais e ausência de escrita indevida. Produto NOT_EXECUTED; checks desta entrega só verificam documentos/fixtures. QA nova deve revisar sem herdar o PASS anterior.\n')
for file in ['phase-plan.md']:
 edit(mod/file,'# Plano Fundação r7','# Plano Fundação r9')
plan=j(mod/'phase-plan.json');plan['contract_revision']=9;wj(mod/'phase-plan.json',plan)
reg=j(C/P/'task-registry.json');one=next(x for x in reg['canonicals'] if x['module_id']=='MOD-001');one['contract_revision']=9;one['maturity']='DRAFT r9; escopo documental r8/r9 aceito, tupla consolidada em QA PENDING; gate UNKNOWN; A0FAILED/P1OPEN/P2P3unreleased; sem aplicação ou implementação';one['scope'].append('Rascunho cifrado IndexedDB, intenção imutável, fila compartilhada elegível, recuperação autorizada e Falha 1101–1106; fontes humanas 7026601969/7027205182; decisões de abandono/logout OPEN.');wj(C/P/'task-registry.json',reg)
for rel,needle,repl in [(P+'/README.md','## Candidato documental MOD001 r6','## Candidato documental MOD001 r9'),(P+'/modules/MOD-001.md','## Proposta r6 — contrato integrado atual para QA','## Contrato documental r9 — consolidação atual para QA'),(P+'/phase-plan.md','## Adendo documental proposto MOD001 r6','## Adendo documental consolidado MOD001 r9')]: edit(C/rel,needle,repl)
edit(C/P/'modules/MOD-001.md','Mesmo TaskID, revision6 draft proposto; texto histórico acima preservado.','Mesmo TaskID, revision9 draft; escopo documental r8/r9 aceito conforme fontes humanas, nova consolidação aguarda QA. Texto histórico acima preservado e não é revisão corrente.')
edit(C/P/'phase-plan.md','Plano específico [r6](modules/MOD-001/phase-plan.md)','Plano específico [r9](modules/MOD-001/phase-plan.md)')
readme=C/P/'README.md';write(readme,'# Fundação — revisão documental r9\n\n'+product.split('## Decisões ainda abertas')[0].split('\n',1)[1]+'\n[Leitura do produto e pendências](modules/MOD-001/product-behavior-r9.md) · [Task r9](tasks/MOD-001/task.md) · [Contrato](modules/MOD-001/phase-spec.md). Abaixo permanece contexto histórico de preparação geral; os estados e revisões antigos não são estado corrente da Fundação. A governança integral está nos contratos e no registro, sem liberação operacional.\n\n---\n\n'+readme.read_text(encoding='utf-8'))
edit(C/P/'README.md','atualizam somente Fundação, ainda draft/reviewpending.','consolidam somente Fundação em r9, ainda draft/QA corrente pendente. O aceite comunicado cobre escopo documental, não gate ou operação.')
# Trace refinements keep exactly 88 old scenarios and all their original identifiers.
trace=j(mod/'traceability.json')
for x in trace:
 vs=[v for v in vectors if v['acceptance_id']==x['acceptance_id']]
 if vs:x['human_r8_r9_addendum']={'path':M+'/save-acceptance-r9.json','vector_ids':[v['id'] for v in vs],'sources':sorted({v['source_comment_id'] for v in vs}),'execution':'PLANNED_NOT_EXECUTED'}
wj(mod/'traceability.json',trace)
rb=j(mod/'research-binding.json');rb['proposed_contract_revision']=9;rb['status']='DOCUMENTARY_SCOPE_ACCEPTED_NEW_CONSOLIDATED_QA_PENDING_NOT_GATE';rb['human_additions']={'r8_manifest':h(R/'architecture-draft-save-r1/manifest.json'),'r9_manifest':h(R/'architecture-save-queue-r1/manifest.json'),'source':'human-acceptance-r9.json','review_provenance':'historical findings bind manifest but actor/consultation unverified; fresh independent review required','scope':'new explicit human additions, not reset of finalspec3/3 or consolidation2/3'};wj(mod/'research-binding.json',rb)
write(mod/'action-changelog.md',(mod/'action-changelog.md').read_text(encoding='utf-8')+'\n## Consolidação documental r9 — aceite de escopo r8/r9\n\nTask e vista provêm byte a byte de architecture-save-queue-r1, revisão 9. Protocolos antigos, união/catálogo/fixtures tipados preservados. Acrescentados fontes humanas exatas, matriz LC/SQ, catálogo complementar de aplicação do Salvar, regras de erro e vínculo de rastreabilidade. Atualizados apenas projeções MOD001/metadados e descrições correntes. QA desta nova tupla PENDING; gate UNKNOWN. Contadores antigos 3/3 e 2/3 não reiniciados.\n')
# Hash references after every content edit (no circular Task hash in registry).
refs=j(mod/'reference-hashes.json')
for x in refs:x['sha256']=h(C/x['path'])
for rel in ['save-failure-catalog.md','human-acceptance-r9.json','product-behavior-r9.md','save-action-bindings-r9.json','save-acceptance-r9.json']:
 path=M+'/'+rel
 if not any(x['path']==path for x in refs):refs.append({'path':path,'sha256':h(C/path)})
wj(mod/'reference-hashes.json',refs)
orig=j(OLD/'changed-paths.json');allowed={x['path']:x for x in orig};context=j(OLD/'revision-register.json')['context_only']
for p in C.rglob('*'):
 if p.is_file() and not (OLD/'candidate'/p.relative_to(C)).exists():allowed[p.relative_to(C).as_posix()]={'source_preimage_sha256':None}
changed=[];combined=[]
for rel,guard in sorted(allowed.items()):
 pre=O/'preimages'/rel;sha=guard['source_preimage_sha256'];assert (h(pre) if sha else None)==sha
 a=pre.read_text(encoding='utf-8-sig').splitlines(keepends=True) if sha else []
 b=(C/rel).read_text(encoding='utf-8').splitlines(keepends=True)
 patch=''.join(difflib.unified_diff(a,b,fromfile='a/'+rel if sha else '/dev/null',tofile='b/'+rel,n=3));name='patches/'+rel+'.patch';write(O/name,patch);combined.append(patch)
 changed.append({'path':rel,'source_preimage_sha256':sha,'candidate_sha256':h(C/rel),'patch':name,'action':'modify' if sha else 'add','permission':'documentary proposal only; no application authorized'})
write(O/'combined.patch',''.join(combined));wj(O/'changed-paths.json',changed)
delta=[]
for p in C.rglob('*'):
 if p.is_file():
  old=OLD/'candidate'/p.relative_to(C)
  if not old.exists() or h(old)!=h(p):delta.append({'path':p.relative_to(C).as_posix(),'r7_candidate_sha256':h(old) if old.exists() else None,'new_sha256':h(p)})
wj(O/'candidate-delta.json',sorted(delta,key=lambda x:x['path']))
wj(O/'revision-register.json',{'task_id':t['task_id'],'contract_revision':9,'task_status':'draft','human_scope_acceptance':'recorded from exact linked r8/r9 sources; not gate','formal_gate':'UNKNOWN','current_QA':'PENDING','historical_counters':{'finalspec':'3/3','consolidation':'2/3'},'scope_addition':'explicit human r8/r9, not a retry/reset of exhausted prior findings','apply_allowlist':'changed-paths.json','context_only':context,'application':'NOT_APPLIED; canonical root UNKNOWN; unrelated dirty Git branch not touched','task_unchanged_from_r9':h(C/TP),'historical_REF12_purpose':'Task REF-12 retains historical r6 prose to preserve accepted Task bytes. Actual linked spec identity is r9; resolve identity by contract_revision and current source/manifest, not stale purpose label.'})
source_map=[]
for p in C.rglob('*'):
 if p.is_file():
  rel=p.relative_to(C).as_posix();r9=R/'architecture-save-queue-r1/candidate'/rel;old=OLD/'candidate'/rel
  src=r9 if r9.exists() else old
  source_map.append({'path':rel,'source_path':str(src) if src.exists() else None,'source_sha256':h(src) if src.exists() else None,'output_sha256':h(p),'byte_exact':src.exists() and h(src)==h(p),'role':'context_only' if rel in context else 'apply_proposal','change_kind':'integration documentary delta' if src.exists() and h(src)!=h(p) else ('source copy' if src.exists() else 'new documentary addendum')})
wj(O/'source-map.json',sorted(source_map,key=lambda x:x['path']))
write(O/'README.md',product.replace('(save-failure-catalog.md)','(candidate/'+M+'/save-failure-catalog.md)').split('## Leitura técnica')[0]+'\n## Rotas de revisão\n\nComeçar em [produto](candidate/'+M+'/product-behavior-r9.md), [Task gerada](candidate/'+TP.replace('.json','.md')+'), [contrato](candidate/'+M+'/phase-spec.md). A [governança interna](internal-governance.md), mapas e comandos ficam separados da apresentação do produto. Apenas changed-paths.json define propostas de aplicação; candidate contém também contexto, nunca copiar a pasta inteira. Nenhuma aplicação foi feita.\n')
write(O/'internal-governance.md','''# Rotas internas e limites — DOC-R9-CONSOLIDATE-01

Autor Architecture agent-65a76b70-79bc-4539-b8b9-840998b76a10. Coordenador agent-97250e7c-4112-4c26-bcaf-4d7066200462. Mensagem 2781fd83-a04d-41f6-9aba-2f19ddee8ef7, Task GAEVA-MOD-001, contrato 9, gate formal UNKNOWN. Sem evento de pipeline, sem aprovação independente pelo autor.

QA Spec: ler manifesto final, source-map, input-hashes, Task/vista/spec, reference-hashes, changed-paths, comentários humanos exatos, matriz complementar LC/SQ e Discovery r7. Conferir escopo humano acrescido sem alegar cobertura automática antiga. Findings históricos r8/r9 vinculam os manifests corretos, mas ator/consulta não estão nos arquivos recebidos nem foram recuperados nas buscas disponíveis nesta conversa: proveniência independente UNVERIFIED. Revisor corrente deve produzir sua própria consulta/recibo. Não transferir um PASS antigo para estes bytes.

QA Backend: contratos C/AP/RP, união tipada e fixtures preservados, nova política de fila/imutabilidade, GetOutcome antes de retry, dedupe/CAS e incerteza. QA UI: textos/estados, seis Falhas, precedência, preservação de novas edições, conflito e ausência de fila por contrato. Segurança: isolamento de conta/empresa/registro, cifra/custódia/recuperação, logout/revogação, anexos elegíveis e ausência de dados/chaves em claro. Todos revisam a mesma tupla; consultas e callbacks não viram cliques Salvar. Inventário concreto por módulo e elegibilidade de replay são trabalhos futuros, não comprovados.

Task JSON r9 e sua vista são fontes byte a byte. Não alterar renderer/biblioteca. Seu REF-12 contém descrição histórica r6, sem determinar revisão; a identidade r9 está em contract_revision, spec e manifesto. QA deve avaliar essa conservação explícita. Estimativas históricas de baixa confiança não foram medidas e exigem reestimativa antes das fases afetadas pela ampliação humana.

Discovery r7 (manifest a870f87b025f0061936062243d4c589ef9d8a8ae44d52dab011efa33135c576c, cobertura 4ed53f08488c4d466ad2c9194cfe51357f0c61689bc6dfa1e370f0b8ec6a372a) fica intacta. 31 REQ, 38 RULE, 22 fluxos e 88 cenários antigos não são revisão dos acréscimos r8/r9. Pesquisa r3 e QA r7 são históricas e restritas. Contadores finalspec3/3 e consolidação2/3 permanecem; esta ampliação humana não reabre achados encerrados nem inventa nova tentativa antiga.

A0FAILED/P1OPEN/P2P3unreleased. RPO0/RTO300s não medidos. AEP/DDE/PSC não implementados. Raiz canônica UNKNOWN; nenhuma alteração na pasta Git com branch codex/gaeva-ui-design-guide. Apenas documentos/scripts de verificação local nesta nova pasta. Sem dependência, build, DB, infra, Drive, restore, failover, Git ou publicação. Não mover MOD002. Sem recuperação garantida de dados destruídos, sem escolher raiz/quorum/horizonte ou reduzir retenção.

Material novo para AGENTS do projeto: a classificação de falha de salvamento depende do resultado autorizado E do estado local; só fila recuperável confirmada permite promessa de fila, e confirmação protegida com falha de limpeza nunca reenvia gravação. Fontes humanas 7026601969/7027205182 e catálogo r9. Proposta de memória do projeto, não escrita fora da pasta autorizada.
''')
print(json.dumps({'task_revision':9,'candidate_files':len(source_map),'apply_proposals':len(changed),'integration_deltas':len(delta),'task_byte_exact':h(C/TP)==h(R/'architecture-save-queue-r1/candidate'/TP),'runtime_tested':False}))
