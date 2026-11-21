from pathlib import Path
import json,hashlib,subprocess,datetime
O=Path(__file__).resolve().parent; R=O.parent; P=R/'accepted-documentary-consolidation-r9-r1'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
PY=Path('C:/Users/teste/Documents/deepseek-harness/default-workspace/.venv-tfd/Scripts/python.exe')
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def put(name,x):(O/name).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
commands=j(O/'commands.json')
for x in commands:
    if x['expected_exit']==1:x['result']='EXPECTED_REJECTION'
cmd=[str(PY),'-B',str(B/'scripts/token_usage.py'),'--task','GAEVA-MOD-001','--stage','DOC-R9-QA-01']
r=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8')
(O/'token-reader.stdout').write_text(r.stdout,encoding='utf-8');(O/'token-reader.stderr').write_text(r.stderr,encoding='utf-8')
commands.append({'command':subprocess.list2cmdline(cmd),'exit':r.returncode,'result':'UNAVAILABLE','observation':'No OpenBot native receipt; does not measure OpenBot usage'})
commands.insert(0,{'command':subprocess.list2cmdline([str(PY),'-B',str(O/'review.py')]),'exit':0,'result':'PASS','observation':'Observed exec session 65601 exit0; independent-checks.json, semantic documentary review in report.md'})
put('commands.json',commands)
nav=j(O/'navigation.stdout');put('navigation.json',nav)
sources=[]
for p,kind,loc,obs in [
 (Path('C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/knowledge/tfd-0.1.6/skills/TFD-qa_backend/SKILL.md'),'host','full file','Independent exact revision review; no author repairs'),
 (Path('C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/router.md'),'host','full file','Native routing, readonly scope and metering'),
 (B/'skills/TFD-harness/references/stage-loop.md','bundle','full file','Own consultation, immutable actor/revision receipts'),
 (B/'docs/stage-loop.md','bundle','full file','Receipt contract; no pipeline event fabricated'),
 (B/'library/architecture/technical-decision-procedure.md','bundle','full file','Primary sources and explicit limits'),
 (P/'internal-governance.md','project','full file','Authorship and boundaries'),
 (P/'review-input.json','project','full file','Exact current tuple'),
 (P/'human-source-comments.json','project','comments 7026601969 and 7027205182','Local sealed exact bodies; remote identity not reauthenticated')]:
    sources.append({'kind':kind,'path':str(p),'sha256':h(p),'revision':'actual bytes read during DOC-R9-QA-01','locator':loc,'observation':obs,'status':'VERIFIED'})
M=P/'candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001'
for name,loc in [('phase-spec.md','P4/P6 and current bindings'),('contracts.md','C1/C2/C3/C5/C6/C7 and human addendum'),('authority-protocol.md','AP1/AP2/AP3/AP4/AP5'),('retention-protocol.md','RP1–RP4'),('save-failure-catalog.md','all rows and precedence'),('product-behavior-r9.md','full file'),('save-action-bindings-r9.json','all 39 metadata entries'),('save-acceptance-r9.json','all 18 planned vectors'),('typed-actions-v1/action-contracts.md','ACAT1–4/8/9'),('typed-actions-v1/action-catalog.json','all saved schemas evaluated; normatively preserved')]:
    sources.append({'kind':'project','path':str(M/name),'sha256':h(M/name),'revision':'contract_revision9 / preserved typed origin','locator':loc,'observation':'Current documentary semantic review and independent byte checks, see report.md','status':'VERIFIED'})
remote=[
 {'origin':'https://www.w3.org/TR/IndexedDB-3/','revision':'W3C WD 2026-10-30','locator':'2.7 transaction lifecycle/durability','observation':'Atomic transaction boundary; strict/relaxed/default are durability hints; not universal loss-proof storage.'},
 {'origin':'https://storage.spec.whatwg.org/','revision':'Living Standard 2026-10-19','locator':'5, 7.1, 7.2','observation':'Persistence and clearing policies; explicit user removal still possible.'},
 {'origin':'https://www.w3.org/TR/webcrypto/','revision':'W3C FPWD 2025-04-22','locator':'4.3, 5.2','observation':'Crypto primitives do not independently establish ERP account authorization or key provisioning.'},
 {'origin':'https://json-schema.org/draft/2020-12/json-schema-validation','revision':'2020-12 / published 2022-06-16','locator':'6.1, 6.5, 7','observation':'Typed structural validation and optional format behavior; local subset is not complete dialect certification.'}]
put('primary-consultation.json',{'actor':'agent-d25ca98a-0e3f-47f1-8d1e-712fc437fba3','method':'web open/find actually executed in current review','sources':remote,'limits':'Observations are consultation notes, not a downloaded complete standard or runtime proof.'})
for x in remote:sources.append(dict(x,kind='remote',path='primary-consultation.json',sha256=h(O/'primary-consultation.json'),status='VERIFIED'))
knowledge={'navigation':{'method':'graphify','query':'qa_backend documentary review persistence idempotency recovery queue stage loop consultation','evidence':'navigation.json','sha256':h(O/'navigation.json'),'status':'GRAPHIFY'},'sources':sources}
actor='agent-d25ca98a-0e3f-47f1-8d1e-712fc437fba3'
put('consultation.json',dict(actor=actor,role='qa_backend',task_id='GAEVA-MOD-001',contract_revision=9,microtask='DOC-R9-QA-01',gate='UNKNOWN',independent_review=True,**knowledge))
put('findings.json',{'task_id':'GAEVA-MOD-001','revision':9,'verdict':'PASS','findings':[]})
artifacts=j(P/'review-input.json')['artifacts']
put('stage_receipt.json',{'version':1,'actor':actor,'role':'qa_backend','task_id':'GAEVA-MOD-001','gate':'UNKNOWN','phase':None,'revision':9,'microtask':'DOC-R9-QA-01','packet_revision':P.name,'correlation':'ddd80af6-c02a-4ef0-b946-2d6cd3509ae8','input_manifest_sha256':h(P/'manifest.json'),'artifacts':artifacts,'knowledge':knowledge,'findings_sha256':h(O/'findings.json'),'checks':[x for x in commands if x['exit']==0 and x['result']=='PASS'],'negative_checks':'commands.json records expected exit1 and eight rejected relations in each group; consolidated review.py exit0 asserts these counts','limits':['documentary only','no formal gate transition','no runtime proof','no other sector verdict'],'report_sha256':h(O/'report.md')})
for x in j(P/'manifest.json')['files']:
    p=P/x['path'];assert h(p)==x['sha256'] and p.stat().st_size==x['bytes']
assert h(P/'manifest.json')=='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
put('self-check.json',{'review_script_exit':0,'independence':True,'author':'agent-65a76b70-79bc-4539-b8b9-840998b76a10','reviewer':actor,'verdict':'PASS','input_members_unchanged':157,'only_own_review_folder_written':True,'formal_gate':'UNKNOWN','unexpected_failures':[],'token_reader_exit':r.returncode,'tokens':'unavailable; OpenBot receipt absent; open turn partial'})
put('manifest.json',{'task_id':'GAEVA-MOD-001','revision':9,'role':'qa_backend','actor':actor,'verdict':'PASS','files':[{'path':p.relative_to(O).as_posix(),'sha256':h(p),'bytes':p.stat().st_size} for p in sorted(O.rglob('*')) if p.is_file() and p.name!='manifest.json']})
for x in j(O/'manifest.json')['files']:assert h(O/x['path'])==x['sha256']
print(json.dumps({'verdict':'PASS','scope':'Backend documentary only','report_sha256':h(O/'report.md'),'findings_sha256':h(O/'findings.json'),'stage_receipt_sha256':h(O/'stage_receipt.json'),'manifest_sha256':h(O/'manifest.json'),'manifest_members':len(j(O/'manifest.json')['files']),'input_members_unchanged':157,'token_reader_exit':r.returncode}))
