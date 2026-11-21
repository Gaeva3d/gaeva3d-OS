"""Refresh documentary metadata, consultation and current author receipts."""
from pathlib import Path
import json,hashlib,difflib,subprocess,sys
O=Path(__file__).resolve().parent;R=O.parent;OLD=R/'final-documentary-candidate-r5';C=O/'candidate'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6');SH=R.parents[1]/'knowledge/tfd-0.1.6'
P='docs/gaeva/retomada-tfd/transformacao-filaops/spec';M=P+'/modules/MOD-001';TP=P+'/tasks/MOD-001/task.json'
def j(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def w(p,s):p.write_text(s,encoding='utf-8',newline='\n')
def wj(p,x):w(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
assert not (O/'manifest.json').exists(),'Frozen packet cannot be modified'
# Fix one relative link in the newly inserted product opening only.
p=C/P/'README.md';s=p.read_text(encoding='utf-8');a,b=s.split('\n---\n',1);a=a.replace('(save-failure-catalog.md)','(modules/MOD-001/save-failure-catalog.md)');w(p,a+'\n---\n'+b)
oldreviews=[]
for sector in ['spec','backend','ui','security']:
 path=R/('qa-final-candidate-r4-'+sector)/'findings.json';oldreviews.append({'role':sector,'path':str(path),'sha256':h(path),'verdict':j(path)['verdict'],'scope':'historical r7/final candidate r5 only, not automatic r9 PASS'})
inputs=j(O/'input-hashes.json')
for x in oldreviews:inputs[x['path']]=x['sha256']
wj(O/'input-hashes.json',inputs)
wj(O/'historical-reviews.json',{'r7':oldreviews,'r8_r9':[{'path':str(R/('qa-'+n)/'attempt-2/findings.json'),'sha256':h(R/('qa-'+n)/'attempt-2/findings.json'),'manifest_sha256':h(R/n/'manifest.json'),'observed_verdict':'PASS','actor_consultation':'UNVERIFIED in supplied findings; no dispatch receipt recovered in scoped directories/history search; new independent reviewer must establish current consultation'} for n in ['architecture-draft-save-r1','architecture-save-queue-r1']],'current_consolidation':'PENDING'})
# Record actual navigation bytes in UTF8 (PowerShell redirected stdout as UTF16).
g=O/'graphify.stdout';raw=g.read_bytes();text=raw.decode('utf-16') if raw.startswith((b'\xff\xfe',b'\xfe\xff')) else raw.decode('utf-8-sig');w(g,text)
nav=j(g);assert nav.get('status')=='GRAPHIFY',nav.keys()
graphcmd='"C:/Users/teste/Documents/deepseek-harness/default-workspace/.venv-tfd/Scripts/python.exe" -B "'+str(B/'scripts/graphify.py')+'" query "architecture phase specification task revision governance stage loop coverage" --bundle "'+str(B)+'" --config "C:/Users/teste/.codex/tfd-graphify.json" --index "C:/Users/teste/.codex/tfd-graphify/index.json"'
wj(O/'navigation.json',{'method':'graphify','query':'architecture phase specification task revision governance stage loop coverage','status':'GRAPHIFY','command':graphcmd,'exit':0,'evidence':'graphify.stdout','sha256':h(g),'observation':'Canonical pointers only, mandatory sources actually read separately; no rebuild'})
paths=[SH/'skills/TFD-architecture/SKILL.md',R.parents[1]/'router.md']+[B/x for x in ['skills/TFD-harness/references/stage-loop.md','docs/stage-loop.md','docs/discovery-coverage.md','skills/TFD-architecture/references/phase-spec.md','docs/sector-task.md','library/architecture/technical-decision-procedure.md','skills/tfd-token-usage/SKILL.md','hosts/codex/README.md']]
sources=[{'kind':'bundle' if str(p).startswith(str(B)) or str(p).startswith(str(SH)) else 'host','path':str(p),'sha256':h(p),'revision':'actual bytes read 2026-11-20','locator':'full file','observation':'Read for bounded architecture/consolidation, task/revision/gates/coverage and author evidence; no framework edit','status':'VERIFIED'} for p in paths]
sources += [{'kind':'project','path':str(R/'discovery-guide-review-r1/findings.md'),'sha256':h(R/'discovery-guide-review-r1/findings.md'),'revision':'discovery-guide-review-r1','locator':'S1-S8, P4/P6, LC01-LC03','observation':'Reuse unchanged browser concepts and constraints, no new cryptographic implementation choice or compatibility claim','status':'VERIFIED'},{'kind':'remote','origin':'https://github.com/Gaeva3d/gaeva3d-OS/issues/1','path':'human-source-comments.json','sha256':h(O/'human-source-comments.json'),'revision':'comments 7026601969 / 7027205182 current MCP read','locator':'entire exact bodies and authenticated provider author fields','observation':'Human documentary scope r8/r9; no operational permission','status':'VERIFIED'}]
wj(O/'consultation.json',{'actor':'agent-65a76b70-79bc-4539-b8b9-840998b76a10','role':'author','task_id':'GAEVA-MOD-001','contract_revision':9,'microtask':'DOC-R9-CONSOLIDATE-01','gate':'UNKNOWN','navigation':{'method':'graphify','query':nav.get('query','architecture phase specification task revision governance stage loop coverage'),'evidence':'navigation.json','sha256':h(O/'navigation.json'),'status':'GRAPHIFY'},'sources':sources,'source_map':'source-map.json','independent_review':False,'claims_not_verified':['historical r8/r9 reviewer identities/consultation','browser compatibility/quota/custody at runtime','CAS/current authorization/provider/PSC/DDE/AEP/scheduler','RPO0/RTO300s','canonical project root'],'technical_reuse':'Existing r8/r9 design reused in accepted scope, no repeat research of unchanged technical facts. Fixed source links and binding metadata only.'})
# Refresh references and every proposed patch against the original archived preimage.
refs=j(C/M/'reference-hashes.json')
for x in refs:x['sha256']=h(C/x['path'])
wj(C/M/'reference-hashes.json',refs)
changed=j(O/'changed-paths.json');combined=[]
for x in changed:
 rel=x['path'];pre=O/'preimages'/rel;a=pre.read_text(encoding='utf-8-sig').splitlines(keepends=True) if x['source_preimage_sha256'] else [];b=(C/rel).read_text(encoding='utf-8').splitlines(keepends=True)
 patch=''.join(difflib.unified_diff(a,b,fromfile='a/'+rel if x['source_preimage_sha256'] else '/dev/null',tofile='b/'+rel,n=3));w(O/x['patch'],patch);combined.append(patch);x['candidate_sha256']=h(C/rel)
wj(O/'changed-paths.json',changed);w(O/'combined.patch',''.join(combined))
delta=[]
for p in C.rglob('*'):
 if p.is_file():
  old=OLD/'candidate'/p.relative_to(C)
  if not old.exists() or h(old)!=h(p):delta.append({'path':p.relative_to(C).as_posix(),'r7_candidate_sha256':h(old) if old.exists() else None,'new_sha256':h(p)})
wj(O/'candidate-delta.json',sorted(delta,key=lambda x:x['path']))
sm=j(O/'source-map.json')
for x in sm:x['output_sha256']=h(C/x['path']);x['byte_exact']=x['source_sha256']==x['output_sha256'] if x['source_path'] else False
wj(O/'source-map.json',sm)
artifacts={key:{'path':path,'sha256':h(O/path)} for key,path in {'task':'candidate/'+TP,'view':'candidate/'+TP.replace('.json','.md'),'spec':'candidate/'+M+'/phase-spec.md','catalog':'candidate/'+M+'/typed-actions-v1/action-catalog.json','errors':'candidate/'+M+'/save-failure-catalog.md','acceptance':'candidate/'+M+'/save-acceptance-r9.json','patch':'combined.patch','source_map':'source-map.json','allowlist':'changed-paths.json','consultation':'consultation.json'}.items()}
wj(O/'review-input.json',{'task_id':'GAEVA-MOD-001','contract_revision':9,'packet_revision':O.name,'gate':'UNKNOWN','artifacts':artifacts,'independent_required':['qa_spec','qa_backend','qa_ui','security'],'historical_reviews':'historical-reviews.json','current_verdict':'PENDING','source_tuple':[{'path':str(R/n/'manifest.json'),'sha256':h(R/n/'manifest.json')} for n in ['final-documentary-candidate-r5','architecture-draft-save-r1','architecture-save-queue-r1','discovery-r7']],'human_sources':'human-source-comments.json','open_business_decisions':'abandonment and copy fate after logout/revocation remain OPEN; no questions asked; options/recommendation documentary only','no_author_independent_PASS':True})
print('REFRESHED; run documentary check before sealing; no upstream edits')
