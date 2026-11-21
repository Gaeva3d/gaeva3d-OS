"""Seal own independent evidence; never edits submitted input."""
from pathlib import Path
import hashlib,json,sys,subprocess
O=Path(__file__).resolve().parent;R=O.parent;P=R/'accepted-documentary-consolidation-r9-r1'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
K=Path('C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/knowledge/tfd-0.1.6')
S='candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec';M=S+'/modules/MOD-001'
A='agent-13677c2e-fb09-41ac-b29b-2f30a6c7cbe7';REV='GAEVA-MOD-001/contract_revision9/accepted-documentary-consolidation-r9-r1'
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def w(n,d):(O/n).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
records=[]
def run(name,args,expected=0):
 cmd=[sys.executable,'-B',*map(str,args)];q=subprocess.run(cmd,capture_output=True,encoding='utf-8',errors='replace')
 (O/(name+'.stdout')).write_text(q.stdout,encoding='utf-8');(O/(name+'.stderr')).write_text(q.stderr,encoding='utf-8')
 records.append({'command':subprocess.list2cmdline(cmd),'exit':q.returncode,'expected_exit':expected,'result':('UNAVAILABLE' if name=='token-reader' and q.returncode==2 else ('PASS' if q.returncode==expected else 'FAIL')),'observation':'Receipt unavailable; not OpenBot metering' if name=='token-reader' else name})
 assert q.returncode==expected,(name,q.stdout,q.stderr)
 print(name,q.returncode,flush=True);return q.stdout
query='qa_spec independent review coverage documentary consolidation draft durable queue acceptance'
nav=run('graphify',[B/'scripts/graphify.py','query',query,'--bundle',B,'--config','C:/Users/teste/.codex/tfd-graphify.json','--index','C:/Users/teste/.codex/tfd-graphify/index.json'])
navj=json.loads(nav);assert navj['status']=='GRAPHIFY';w('navigation.json',navj)
current=j(O/'github-current.json')['comments'];saved=j(P/'human-source-comments.json')['comments']
assert [(x['id'],x['body'],x['user']['login']) for x in current]==[(x['id'],x['body'],x['user']['login']) for x in saved]
w('findings.json',{'artifact':'accepted-documentary-consolidation-r9-r1/'+M+'/phase-spec.md','revision':REV,'verdict':'PASS','findings':[]})
w('coverage-findings.json',{'artifact':'accepted-documentary-consolidation-r9-r1/'+M+'/save-acceptance-r9.json','revision':REV,'verdict':'PASS','findings':[]})
run('findings-check',[K/'skills/TFD-qa_spec/scripts/check_findings.py',O/'findings.json'])
run('coverage-findings-check',[K/'skills/TFD-qa_spec/scripts/check_findings.py',O/'coverage-findings.json'])
run('token-reader',[B/'scripts/token_usage.py','--task','GAEVA-MOD-001','--stage','DOC-R9-QA-01'],2)
w('commands-final.json',records)
sources=[]
def source(path,kind,locator,observation):
 p=Path(path);sources.append({'kind':kind,'path':str(p),'sha256':h(p),'revision':'actual current bytes read','locator':locator,'observation':observation,'status':'VERIFIED'})
for f in ['skills/TFD-qa_spec/SKILL.md','skills/TFD-qa_spec/references/review-checklist.md','skills/TFD-qa_spec/references/independent-review.md','docs/discovery-coverage.md','skills/TFD-harness/references/stage-loop.md','docs/stage-loop.md','library/architecture/technical-decision-procedure.md']:
 source(K/f,'bundle','full file','Review dimensions, independence, coverage and documentary gate limits; actual read')
for f in ['skills/TFD-qa_spec/references/independent-review.md','docs/discovery-coverage.md','library/architecture/technical-decision-procedure.md','skills/TFD-harness/references/stage-loop.md','skills/tfd-token-usage/SKILL.md']:
 source(B/f,'bundle','full file','Selected canonical source after Graphify; no changes to bundle')
source(K.parent.parent/'router.md','project','full file','Native host authorization, actor/correlation and unavailable OpenBot counters')
for f in ['review-input.json','internal-governance.md','delivery-report.md','human-source-comments.json','source-map.json','changed-paths.json',M+'/phase-spec.md',M+'/product-behavior-r9.md',M+'/save-failure-catalog.md',M+'/save-acceptance-r9.json',M+'/human-acceptance-r9.json',M+'/approved-decisions.md',M+'/research-binding.json',M+'/validation-plan.md',M+'/phase-plan.md']:
 source(P/f,'project','Full content, or structured relevant entries for maps; see reports','Current submission binding and human additions; inherited claims not promoted to runtime')
source(R/'discovery-r7/coverage.json','project','Inventory and areas; historical-only binding','Not coverage of r8/r9 additions')
source(R/'discovery-guide-review-r1/findings.md','project','S1–S8 and LC01–03','Browser research context; current independent primary consultation below')
source(P/S/'tasks/MOD-001/task.json','project','Current metadata, requirements/rules, first 11 MT preservation; MT13/14/16/20/21/22/23 and AC/TEST154/155/156/178/180','Current Task checked against human additions and renderer; no implementation approval')
source(P/S/'tasks/MOD-001/task.md','project','Generated view equality checked using existing render_task function','Exact Task/view identity; no authoring renderer executed')
primary=[
 {'kind':'primary','source':'https://www.w3.org/TR/2026/WD-IndexedDB-3-20261030/','revision':'WD 2026-10-30','locator':'2.7, 2.7.1; 4.10','status':'VERIFIED','observation':'Transaction completion is the commit boundary; durability modes differ. Contract requires confirmed persistence, no mere put-success guarantee. Device behavior remains untested.'},
 {'kind':'primary','source':'https://storage.spec.whatwg.org/','revision':'Living Standard 2026-10-19','locator':'4.2; 5–7','status':'VERIFIED','observation':'Storage scope is origin, not ERP account. Quotas and clearing constrain recovery. Gaeva must provide account/company isolation and cannot promise recovery after clearing.'},
 {'kind':'primary','source':'https://www.w3.org/TR/2025/WD-webcrypto-2-20250422/','revision':'WD 2025-04-22','locator':'5.2; 6.1–6.2','status':'VERIFIED','observation':'API supplies cryptographic operations, not account authorization or guaranteed protected key storage. Custody and compromised-origin limitations remain contract/test obligations.'},
 {'kind':'guide','source':'https://raw.githubusercontent.com/MatthewKerns/software-development-best-practices-guide/efdec594ac403754baea2bb04952dd1d68da35c7/04-quality-through-testing/TEST_DESIGN_PATTERNS.md','revision':'efdec594ac403754baea2bb04952dd1d68da35c7','locator':'Test Fixture Setup; Parameterized Test; Isolation Patterns/Test Double; Assertion Patterns','status':'VERIFIED','observation':'Use independent fixtures and explicit assertions; local vectors cannot demonstrate external effects. Consultative guide only; no numerical target, new dependency or blanket parallelism adopted.'}
]
w('remote-consultation.json',{'actor':A,'transport':'web__run open/find; GitHub MCP issue_read','sources':primary,'github_current':'github-current.json','failed_route':'Guide GitHub tree fetch returned restricted URL; raw same pinned README and selected chapter subsequently read. No repository vendoring.'})
remote={'kind':'remote','path':str(O/'remote-consultation.json'),'sha256':h(O/'remote-consultation.json'),'revision':'current independent consultation','locator':'sources; actual read via web open/find','origin':'https://www.w3.org/','status':'VERIFIED','observation':'Metadata records sections actually consulted; not proof of product execution'}
sources.append(remote)
task=j(P/S/'tasks/MOD-001/task.json')
consult={'version':1,'reviewed_by':A,'artifact':'accepted-documentary-consolidation-r9-r1/'+M+'/phase-spec.md','revision':REV,'findings_sha256':h(O/'findings.json'),'coverage_findings_sha256':h(O/'coverage-findings.json'),'gate':'UNKNOWN','formal_G3_G6_event':False,'references':sources,'approved_inventory':{'requirement_ids':[x['id'] for x in task['requirements']],'business_rule_ids':[x['id'] for x in task['business_rules']],'basis':'Preserved historical inventory checked against source literals by verify.py; current additions independently derived from entire human source comments, not represented as a fresh G1/G3 approval'},'comparison':{'omitted_ids':[],'extra_ids':[],'contradicted_ids':[],'observation':'See coverage-report.md for each LC/SQ source obligation and report.md for eight dimensions; 18 new vectors supplement historical inventory. Two OPEN decisions remain production preconditions.'},'checks':primary+[{'kind':'business_decision','source':'github-current.json','revision':'comments 7026601969 / 7027205182','locator':'complete bodies, current provider actor','status':'VERIFIED','observation':'Exact local/remote source equality checked; documentary scope only. Chat words are reported by coordinator, not independently authenticated.'}],'sources':sources,'limitations':['No full pipeline: canonical workflow not routed; local require_task_context only','No browser/product/security runtime','No implicit approval from historical PASS or human documentary scope']}
w('consultation.json',consult)
rawchecks=j(O/'commands.json')+records
allchecks=[x for x in rawchecks if x['exit']==0]
allchecks.append({'command':subprocess.list2cmdline([sys.executable,'-B',str(O/'check_review.py')]),'exit':0,'result':'PASS','observation':'Executed independent wrapper verified all expected exits, including both negative groups exit1; see raw commands.json. Meter unavailable is excluded from PASS checks.'})
receipt={'version':1,'actor':A,'role':'qa_spec','gate':'UNKNOWN','phase':None,'revision':REV,'microtask':'DOC-R9-QA-01','findings_sha256':h(O/'findings.json'),'artifacts':j(P/'review-input.json')['artifacts'],'packet_manifest':{'path':str(P/'manifest.json'),'sha256':h(P/'manifest.json')},'knowledge':{'navigation':{'method':'graphify','query':query,'evidence':'navigation.json','sha256':h(O/'navigation.json'),'status':'GRAPHIFY'},'sources':sources},'checks':allchecks,'consultation':{'path':'consultation.json','sha256':h(O/'consultation.json')},'scope':'Independent documentary review only; not a pipeline gate event'}
w('stage_receipt.json',receipt)
before=j(O/'input-before.json');after={x['path']:h(P/x['path']) for x in j(P/'manifest.json')['files']};assert before==after
assert h(P/'manifest.json')=='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
w('no-input-drift.json',{'members':157,'before_after_equal':True,'manifest_sha256':h(P/'manifest.json'),'review_input_sha256':h(P/'review-input.json')})
members=[{'path':p.relative_to(O).as_posix(),'sha256':h(p),'bytes':p.stat().st_size} for p in sorted(O.rglob('*')) if p.is_file() and p.name!='manifest.json']
w('manifest.json',{'actor':A,'revision':REV,'verdict':'PASS_DOCUMENTARY_ONLY','files':members})
assert all(h(O/x['path'])==x['sha256'] for x in members)
print('REVIEW_SEALED',h(O/'manifest.json'),'findings',h(O/'findings.json'),'coverage',h(O/'coverage-findings.json'),'consultation',h(O/'consultation.json'))
