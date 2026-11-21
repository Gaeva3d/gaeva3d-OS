"""Read-only checks of the assembled documentary packet, not a product emulator."""
from pathlib import Path
import hashlib,json,sys,difflib,re,copy,ast,datetime
O=Path(__file__).resolve().parent;R=O.parent;C=O/'candidate';OLD=R/'final-documentary-candidate-r5'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6');sys.path.insert(0,str(B/'scripts'))
P='docs/gaeva/retomada-tfd/transformacao-filaops/spec';M=P+'/modules/MOD-001';TP=P+'/tasks/MOD-001/task.json'
def j(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
t=j(C/TP);cov=j(R/'discovery-r7/coverage.json')
if '--manifest' in sys.argv:
 mf=j(O/'manifest.json')
 for x in mf['files']:assert h(O/x['path'])==x['sha256'],x['path']
 assert {x['path'] for x in mf['files']}=={p.relative_to(O).as_posix() for p in O.rglob('*') if p.is_file() and p.name!='manifest.json'}
 for p,sha in j(O/'input-hashes.json').items():assert h(Path(p))==sha,p
 print('SEALED_READBACK_OK',len(mf['files']),'members; all upstream input bytes unchanged');sys.exit(0)
if '--g6-local' in sys.argv:
 from pipeline import require_task_context
 require_task_context(t,{'spec':t['spec'],'discovery':'discovery-r7/coverage.json'},{'discovery':h(R/'discovery-r7/coverage.json')},t['phases'],cov,({'coverage':'discovery-r7/coverage.json'},{'coverage':h(R/'discovery-r7/coverage.json')}),require_spec=True,coverage_required=True)
 print('LOCAL_FORMAL_INVENTORY_ONLY_OK; no G6 event/PASS; r8/r9 supplementary content still needs QA');sys.exit(0)
if '--requests' in sys.argv:
 p=C/M/'typed-actions-v1';ns={'json':json,'re':re,'datetime':datetime};tree=ast.parse((O/'checker-source.py').read_text(encoding='utf-8'));funcs=[x for x in tree.body if isinstance(x,ast.FunctionDef) and x.name=='check'];assert len(funcs)==1
 exec(compile(ast.Module(body=funcs,type_ignores=[]),'existing-subset-check','exec'),ns);check=ns['check'];cat=j(p/'action-catalog.json');by={a['action']:a for a in cat['actions']};reqs=j(p/'examples.json')['requests'];assert len(reqs)==len(by)==39
 for q in reqs:
  schema=by[q['action']]['request_schema'];assert check(schema,q),q['action']
  extra=copy.deepcopy(q);extra['forged_extra']='forbidden';assert not check(schema,extra)
  null=copy.deepcopy(q);null['payload']=None;assert not check(schema,null)
  missing=copy.deepcopy(q);missing.pop('operation_id');assert not check(schema,missing)
 print('REQUEST_SUBSET_OK 39 saved positives; 117 direct extra/null/missing negatives rejected; not full JSONSchema certification');sys.exit(0)
from validate_task import validate_task
from render_task import render_task
assert not validate_task(t,require_coverage=True)
assert (C/TP.replace('.json','.md')).read_text(encoding='utf-8')==render_task(t,'task.json')
assert t['contract_revision']==9 and t['status']=='draft'
for ext in ['json','md']:assert h(C/TP.replace('.json','.'+ext))==h(R/'architecture-save-queue-r1/candidate'/TP.replace('.json','.'+ext))
base=j(OLD/'candidate'/TP)
for key in ['task_id','requirements','business_rules','allowed_paths','protected_paths','stop_conditions','gates','phases','technical_coverage','sectors','estimate']:assert t[key]==base[key],key
assert t['microtasks'][:11]==base['microtasks'][:11]
assert t['acceptance_criteria'][0]==base['acceptance_criteria'][0] and t['required_tests'][0]==base['required_tests'][0]
cross=j(C/M/'id-crosswalk.json');assert len(t['requirements'])==31 and len(t['business_rules'])==38
assert set(cross['requirements'].values())==set(cov['requirement_ids'])=={x['id'] for x in t['requirements']}
assert set(cross['rules'].values())==set(cov['business_rule_ids'])=={x['id'] for x in t['business_rules']}
assert h(R/'discovery-r7/manifest.json')=='a870f87b025f0061936062243d4c589ef9d8a8ae44d52dab011efa33135c576c'
assert h(R/'discovery-r7/coverage.json')=='4ed53f08488c4d466ad2c9194cfe51357f0c61689bc6dfa1e370f0b8ec6a372a'
for x in j(R/'discovery-r6/approved-inventory.json')['items']:
 assert next(v for v in t['requirements'] if v['id']==cross['requirements'][x['requirement_alias']])['description']==x['literal']
 assert next(v for v in t['business_rules'] if v['id']==cross['rules'][x['rule_alias']])['description']==x['literal']
trace=j(C/M/'traceability.json');oldtrace=j(OLD/'candidate'/M/'traceability.json');assert len(trace)==len(oldtrace)==88 and len({x['flow'] for x in trace})==22
for now,old in zip(trace,oldtrace):
 cleaned={k:v for k,v in now.items() if k!='human_r8_r9_addendum'};assert cleaned==old
acs={a['id']:a for a in t['acceptance_criteria']};tests={x['id']:x for x in t['required_tests']};mts={x['id'] for x in t['microtasks']};vec=j(C/M/'save-acceptance-r9.json')['vectors'];assert len(vec)==18
for v in vec:
 a=acs[v['acceptance_id']];assert v['test_id']==a['validation'] and v['test_id'] in tests
 assert v['microtask_ids']==a['microtask_ids'] and set(v['microtask_ids'])<=mts
 assert v['requirement_ids']==a['requirement_ids'] and v['rule_ids']==a['rule_ids'] and v['status']=='PLANNED_NOT_EXECUTED'
assert {v['failure_code'] for v in vec if v['failure_code']}==set(range(1101,1107))
assert {v['source_comment_id'] for v in vec}=={7026601969,7027205182}
pol=j(C/M/'save-action-bindings-r9.json');cat=j(C/M/'typed-actions-v1/action-catalog.json');assert len(pol['actions'])==39
assert [x['action'] for x in pol['actions']]==[x['action'] for x in cat['actions']]
assert all(x['automatic_replay_proven'] is False for x in pol['actions'])
for folder in ['typed-actions-v1']:
 for old in (OLD/'candidate'/M/folder).rglob('*'):
  if old.is_file():assert h(old)==h(C/M/folder/old.relative_to(OLD/'candidate'/M/folder)),str(old)
for name in ['authority-protocol.md','retention-protocol.md','retention-validation.md','id-crosswalk.json','approved-decisions.md','surface-contract-map.json']:assert h(C/M/name)==h(OLD/'candidate'/M/name),name
for x in j(C/M/'reference-hashes.json'):assert h(C/x['path'])==x['sha256'],x['path']
assert all((C/x['path']).is_file() for x in t['references'])
oldreg=j(OLD/'candidate'/P/'task-registry.json');reg=j(C/P/'task-registry.json');assert [x for x in reg['canonicals'] if x['module_id']!='MOD-001']==[x for x in oldreg['canonicals'] if x['module_id']!='MOD-001']
assert next(x for x in reg['canonicals'] if x['module_id']=='MOD-001')['contract_revision']==9
assert j(C/M/'phase-plan.json')['phases']==t['phases'] and j(C/M/'phase-plan.json')['contract_revision']==9
changed=j(O/'changed-paths.json');context=j(O/'revision-register.json')['context_only'];assert len(context)==7
assert not set(context)&{x['path'] for x in changed}
assert {x['path'] for x in changed}|set(context)=={p.relative_to(C).as_posix() for p in C.rglob('*') if p.is_file()}
combined=[]
for x in changed:
 rel=x['path'];assert rel.startswith(P+'/') and '..' not in Path(rel).parts
 assert h(C/rel)==x['candidate_sha256']
 pre=O/'preimages'/rel;sha=x['source_preimage_sha256'];assert (h(pre) if sha else None)==sha
 a=pre.read_text(encoding='utf-8-sig').splitlines(keepends=True) if sha else []
 b=(C/rel).read_text(encoding='utf-8').splitlines(keepends=True)
 expected=''.join(difflib.unified_diff(a,b,fromfile='a/'+rel if sha else '/dev/null',tofile='b/'+rel,n=3));actual=(O/x['patch']).read_text(encoding='utf-8');assert actual==expected;combined.append(actual)
 # Reconstruct actual target using hunk contents, independently of diff generation.
 out=[];pos=0;lines=actual.splitlines(keepends=True);i=2
 while i<len(lines):
  m=re.match(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',lines[i]);assert m,lines[i]
  start=int(m.group(1));length=int(m.group(2) or 1);start=start-1 if length else start
  out.extend(a[pos:start]);pos=start;i+=1
  while i<len(lines) and not lines[i].startswith('@@ '):
   line=lines[i];kind=line[0];value=line[1:]
   if kind in [' ','-']:assert pos<len(a) and a[pos]==value;(None);pos+=1
   if kind in [' ','+']:out.append(value)
   i+=1
 out.extend(a[pos:]);assert out==b,('patch replay',rel)
assert (O/'combined.patch').read_text(encoding='utf-8')==''.join(combined)
for entry in j(O/'source-map.json'):
 assert h(C/entry['path'])==entry['output_sha256']
 if entry['source_path']:assert h(Path(entry['source_path']))==entry['source_sha256']
for p,sha in j(O/'input-hashes.json').items():assert h(Path(p))==sha,p
for p in C.rglob('*'):
 if p.is_file():
  text=p.read_bytes().decode('utf-8','strict');assert '\ufffd' not in text,('replacement char',str(p))
  if p.suffix=='.json':j(p)
  if p.suffix=='.md':assert not any(x in text for x in ['Ã§','Ã£','â€','Â·']),('mojibake',str(p))
human=j(C/M/'human-acceptance-r9.json');assert human['formal_gate']=='UNKNOWN' and not human['implementation_authorized'] and len(human['open_decisions'])==2
for x in human['github_sources']:assert hashlib.sha256(x['body'].encode()).hexdigest()==x['body_utf8_sha256'] and x['actor']=='guilhermedemorais-dev'
print(json.dumps({'documentary_checks':'OK','task_revision':9,'task_and_view_byte_exact_r9':True,'requirements':31,'rules':38,'flows':22,'original_scenarios':88,'supplemental_vectors':18,'typed_actions_unchanged':39,'apply_proposals':len(changed),'original_preimage_guards':sum(bool(x['source_preimage_sha256']) for x in changed),'context_only':len(context),'new_independent_QA':'PENDING','runtime_tested':False}))
