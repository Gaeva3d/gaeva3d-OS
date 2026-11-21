"""Independent documentary checks. Only this review directory is writable."""
from pathlib import Path
import json, hashlib, copy, datetime, re, subprocess, sys

OUT=Path(__file__).resolve().parent
ROOT=OUT.parent
PACK=ROOT/'accepted-documentary-consolidation-r9-r1'
MOD=Path('candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001')
M=PACK/MOD
T=M/'typed-actions-v1'
PY=Path('C:/Users/teste/Documents/deepseek-harness/default-workspace/.venv-tfd/Scripts/python.exe')
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def save(name,value): (OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

EXPECTED='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
assert sha(PACK/'manifest.json')==EXPECTED
manifest=j(PACK/'manifest.json')
assert manifest['author']!='agent-d25ca98a-0e3f-47f1-8d1e-712fc437fba3'
assert len(manifest['files'])==157
def integrity():
    assert sha(PACK/'manifest.json')==EXPECTED
    for f in manifest['files']:
        p=PACK/f['path']
        assert sha(p)==f['sha256'] and p.stat().st_size==f['bytes'], f['path']
    assert {f['path'] for f in manifest['files']}=={p.relative_to(PACK).as_posix() for p in PACK.rglob('*') if p.is_file() and p.name!='manifest.json'}
integrity()
inp=j(PACK/'review-input.json')
assert sha(PACK/'review-input.json')=='e1ca7d28e10801fde590975765502fbb8d646d2648c1330fc06dd80968840961'
for f in inp['artifacts'].values(): assert sha(PACK/f['path'])==f['sha256'],f['path']
save('input-snapshot.json',{'manifest_sha256':EXPECTED,'review_input_sha256':sha(PACK/'review-input.json'),'members':manifest['files'],'artifacts':inp['artifacts']})

# Separate evaluator: no imports of the author's checker or generator.
KEYS={'$schema','oneOf','const','enum','type','properties','required','additionalProperties','items','minItems','uniqueItems','minimum','maximum','minLength','maxLength','pattern','format'}
def lint(s):
    assert not set(s)-KEYS,set(s)-KEYS
    if s.get('type')=='object':
        assert s.get('additionalProperties') is False
        assert set(s.get('required',[]))<=set(s['properties'])
        for x in s['properties'].values(): lint(x)
    if 'items' in s: lint(s['items'])
    for x in s.get('oneOf',[]): lint(x)
def equal(a,b): return type(a) is type(b) and a==b
def valid(s,v):
    if 'oneOf' in s and sum(valid(x,v) for x in s['oneOf'])!=1:return False
    if 'const' in s and not equal(v,s['const']):return False
    if 'enum' in s and not any(equal(v,x) for x in s['enum']):return False
    typ=s.get('type')
    if typ and type(v) is not {'object':dict,'array':list,'string':str,'integer':int,'boolean':bool}[typ]:return False
    if typ=='object':
        if not set(s.get('required',[]))<=v.keys():return False
        if s.get('additionalProperties') is False and v.keys()-s['properties'].keys():return False
        return all(valid(s['properties'][k],x) for k,x in v.items())
    if typ=='array':
        return len(v)>=s.get('minItems',0) and (not s.get('uniqueItems') or len({json.dumps(x,sort_keys=True) for x in v})==len(v)) and all(valid(s['items'],x) for x in v)
    if typ=='integer' and not s.get('minimum',v)<=v<=s.get('maximum',v):return False
    if typ=='string':
        if not s.get('minLength',0)<=len(v)<=s.get('maxLength',len(v)):return False
        if 'pattern' in s and re.search(s['pattern'],v) is None:return False
        if s.get('format')=='date-time':
            try: datetime.datetime.strptime(v,'%Y-%m-%dT%H:%M:%SZ')
            except ValueError:return False
    return True

catalog=j(T/'action-catalog.json'); by={x['action']:x for x in catalog['actions']}
assert len(by)==39
for a in by.values():
    for key in ['request_schema','response_schema','result_schema']:lint(a[key])
union=j(T/'request-union.schema.json');lint(union)
requests=j(T/'examples.json')['requests']
assert len(requests)==39 and {q['action'] for q in requests}==set(by)
negative_count=0
for q in requests:
    s=by[q['action']]['request_schema'];assert valid(s,q) and valid(union,q)
    variants=[]
    for key in s['required']:
        bad=copy.deepcopy(q);del bad[key];variants.append(bad)
        bad=copy.deepcopy(q);bad[key]=None;variants.append(bad)
    for key in ['tenant_id','actor','protected','epoch','current_authority_head']:
        bad=copy.deepcopy(q);bad[key]='forged';variants.append(bad)
    for key in s['properties']['payload'].get('required',[]):
        bad=copy.deepcopy(q);del bad['payload'][key];variants.append(bad)
        bad=copy.deepcopy(q);bad['payload'][key]=None;variants.append(bad)
    bad=copy.deepcopy(q);bad['target']['expected_version']=False;variants.append(bad)
    bad=copy.deepcopy(q);bad['payload']['unexpected']=True;variants.append(bad)
    for bad in variants:assert not valid(s,bad),(q['action'],bad)
    negative_count+=len(variants)
pos=j(T/'response-examples.json')['responses'];neg=j(T/'negative-response-examples.json')['examples']
assert len(pos)==len(neg)==238
for x in pos:
    assert valid(by[x['action']]['response_schema'],x)
    assert 'raw_token' not in json.dumps(x)
    bad=copy.deepcopy(x);bad['raw_token']='fictional-forbidden';assert not valid(by[x['action']]['response_schema'],bad)
for x in neg:assert x['expected_valid'] is False and not valid(by[x['action']]['response_schema'],x['payload'])

chains=0
def relation(x):
    q=x['request'];w=x['write_response'];o=x['outcome_response']['result']['original_response'];r=x['reload_response'];e=x['edit_request']
    assert q['operation_id']==w['operation_id']==o['operation_id']
    assert o==w and q['action']==w['action']==o['action']=='ConfigureSchedule'
    assert w['result_version']==w['result']['config_version']==r['result_version']==r['result']['config_version']>q['target']['expected_version']
    assert e['target']==dict(q['target'],expected_version=r['result_version'])
    assert e['operation_id']!=q['operation_id']
    for k,v in q['payload'].items():assert w['result']['stored_schedule'][k]==r['result']['stored_schedule'][k]==e['payload'][k]==v
cases=j(T/'schedule-roundtrip-examples.json')['cases']
for x in cases:
    if 'reload_response' in x:relation(x);chains+=1
assert len(cases)==18 and chains==8
rejected={}
for x in j(T/'relational-negative-examples.json')['examples']:
    assert x['expected_structural_valid'] and x['expected_relational_valid'] is False
    payload=x['payload']
    for k,a in [('request','ConfigureSchedule'),('edit_request','ConfigureSchedule')]:assert valid(by[a]['request_schema'],payload[k])
    for k,a in [('write_response','ConfigureSchedule'),('reload_response','GetBackupConfiguration'),('outcome_response','GetOutcome')]:assert valid(by[a]['response_schema'],payload[k])
    try:relation(payload)
    except AssertionError:rejected[x['kind']]=rejected.get(x['kind'],0)+1
    else:raise AssertionError('bad relation accepted')
assert rejected=={'WRITE_ID_SWAPPED':8,'ORIGINAL_ID_SWAPPED':8}

# Exact preservation against original final r5; current review, not inherited QA.
OLD=ROOT/'final-documentary-candidate-r5'/MOD
preserved=[]
for p in (OLD/'typed-actions-v1').rglob('*'):
    if p.is_file():
        rel=p.relative_to(OLD);assert sha(p)==sha(M/rel),str(rel);preserved.append(str(rel))
for name in ['authority-protocol.md','retention-protocol.md','retention-validation.md','surface-contract-map.json','id-crosswalk.json','approved-decisions.md']:
    assert sha(M/name)==sha(OLD/name);preserved.append(name)
policy=j(M/'save-action-bindings-r9.json')
assert [a['action'] for a in policy['actions']]==list(by)
assert policy['wire_catalog_sha256']==sha(T/'action-catalog.json')
for a in policy['actions']:
    assert a['automatic_replay_proven'] is False
    assert a['queue_enablement']=='NOT_GRANTED_BY_THIS_CATALOG'
task=j(PACK/'candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/task.json')
ac={x['id']:x for x in task['acceptance_criteria']};tests={x['id'] for x in task['required_tests']};mt={x['id'] for x in task['microtasks']}
vectors=j(M/'save-acceptance-r9.json')['vectors']
assert len(vectors)==18
for v in vectors:
    assert v['status']=='PLANNED_NOT_EXECUTED' and v['test_id'] in tests
    assert ac[v['acceptance_id']]['validation']==v['test_id']
    assert set(v['microtask_ids'])<=mt
save('independent-checks.json',{'manifest_members':157,'requests':39,'request_negatives_rejected':negative_count,'response_positives':238,'response_negatives':238,'added_response_extra_negatives':238,'saved_schedule_cases':18,'positive_chains':8,'structural_valid_relational_rejections':rejected,'preserved_files':preserved,'supplemental_bindings':18,'runtime_tested':False,'schema_engine':'independent explicit keyword subset; not full JSON Schema 2020-12 certification'})

commands=[]
def run(name,args,expected=0):
    cmd=[str(PY),'-B',*map(str,args)]
    r=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',errors='replace')
    (OUT/(name+'.stdout')).write_text(r.stdout,encoding='utf-8')
    (OUT/(name+'.stderr')).write_text(r.stderr,encoding='utf-8')
    commands.append({'command':subprocess.list2cmdline(cmd),'exit':r.returncode,'expected_exit':expected,'result':'PASS' if r.returncode==expected else 'FAIL','observation':'Expected documentary rejection' if expected else 'Read-only documentary check'})
    save('commands.json',commands)
    assert r.returncode==expected,(name,r.returncode,r.stderr)
run('navigation',[B/'scripts/graphify.py','query','qa_backend documentary review persistence idempotency recovery queue stage loop consultation','--bundle',B,'--config','C:/Users/teste/.codex/tfd-graphify.json','--index','C:/Users/teste/.codex/tfd-graphify/index.json'])
run('author-readonly-saved',[PACK/'verify_saved.py'])
run('author-readonly-relations',[PACK/'verify_relations.py'])
run('negative-write-id',[PACK/'verify_relations.py','--negative','WRITE_ID_SWAPPED'],1)
run('negative-original-id',[PACK/'verify_relations.py','--negative','ORIGINAL_ID_SWAPPED'],1)
run('requests-subset',[PACK/'verify.py','--requests'])
run('documentary-invariants',[PACK/'verify.py'])
run('manifest-and-upstream-drift',[PACK/'verify.py','--manifest'])
integrity()
save('no-input-drift.json',{'manifest_sha256':sha(PACK/'manifest.json'),'members':157,'all_hashes_and_sizes_unchanged':True,'upstream_check':'manifest-and-upstream-drift.stdout','runtime_tested':False})
print(json.dumps({'independent_document_checks':'PASS','requests':39,'negative_requests':negative_count,'responses':238,'negative_responses':238,'chains':chains,'relation_rejections':rejected,'input_drift':False,'runtime_tested':False}))
