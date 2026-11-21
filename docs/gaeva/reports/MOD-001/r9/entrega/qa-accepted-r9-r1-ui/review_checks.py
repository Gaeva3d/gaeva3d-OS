"""Independent read-only documentary checks; no product behavior is simulated."""
from pathlib import Path
import hashlib, json, subprocess, sys
O=Path(__file__).resolve().parent
P=O.parent/'accepted-documentary-consolidation-r9-r1'
M=P/'candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001'
T=P/'candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/task.json'
def h(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def seal():
    assert h(P/'manifest.json')=='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
    mf=j(P/'manifest.json'); assert len(mf['files'])==157
    for x in mf['files']:
        q=P/x['path']; assert q.resolve().is_relative_to(P.resolve())
        assert h(q)==x['sha256'] and q.stat().st_size==x['bytes'],x['path']
    assert h(P/'review-input.json')=='e1ca7d28e10801fde590975765502fbb8d646d2648c1330fc06dd80968840961'
    for x in j(P/'review-input.json')['artifacts'].values(): assert h(P/x['path'])==x['sha256']
    for path,sha in j(P/'input-hashes.json').items(): assert h(Path(path))==sha,path
    return {'members':157,'upstream_no_drift':True}
checks=[]
checks.append({'name':'input_integrity_before','result':seal()})
t=j(T); vec=j(M/'save-acceptance-r9.json')['vectors']
acs={x['id']:x for x in t['acceptance_criteria']}; tests={x['id']:x for x in t['required_tests']}
assert t['contract_revision']==9 and len(vec)==18
assert len({v['id'] for v in vec})==18
assert {v['failure_code'] for v in vec if v['failure_code']}==set(range(1101,1107))
for v in vec:
    a=acs[v['acceptance_id']]
    assert a['validation']==v['test_id'] and v['test_id'] in tests
    for k in ['microtask_ids','requirement_ids','rule_ids']: assert a[k]==v[k]
    assert v['status']=='PLANNED_NOT_EXECUTED'
assert {v['scenario'] for v in vec} >= {'local_guard_loss_and_unknown','protected_then_cleanup_failure','new_edits_during_pending','version_conflict','no_queue_contract_unknown_query_supported','no_queue_contract_unknown_no_query','actor_company_record_isolation','logout_multitab_revocation','reopen_same_actor_current_access'}
checks.append({'name':'supplemental_bindings','vectors':18,'codes':list(range(1101,1107)),'runtime_tested':False})
pol=j(M/'save-action-bindings-r9.json'); cat=j(M/'typed-actions-v1/action-catalog.json')
assert len(pol['actions'])==len(cat['actions'])==39
assert [a['action'] for a in pol['actions']]==[a['action'] for a in cat['actions']]
for a in pol['actions']:
    assert a['queue_enablement']=='NOT_GRANTED_BY_THIS_CATALOG' and a['automatic_replay_proven'] is False
    if a['application'] in ['QUERY_NOT_SAVE','INTERNAL_NOT_UI_SAVE']:
        assert a['eligibility']=='not a UI Save intent'
    else: assert 'confirmed encrypted recoverable snapshot' in a['eligibility']
checks.append({'name':'action_policy','actions':39,'kinds':{k:sum(a['application']==k for a in pol['actions']) for k in {a['application'] for a in pol['actions']}}})
old=O.parent/'final-documentary-candidate-r5/candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/typed-actions-v1'
typed=M/'typed-actions-v1'; files=[p for p in old.rglob('*') if p.is_file()]
assert files and all(h(p)==h(typed/p.relative_to(old)) for p in files)
chains=[x for x in j(typed/'schedule-roundtrip-examples.json')['cases'] if 'reload_response' in x]
assert len(chains)==8
for x in chains:
    req=x['request']; write=x['write_response']; original=x['outcome_response']['result']['original_response']; reload=x['reload_response']; edit=x['edit_request']
    assert req['operation_id']==write['operation_id']==original['operation_id'] and write==original
    assert req['action']==write['action']==original['action']=='ConfigureSchedule'
    assert edit['operation_id']!=req['operation_id']
    assert edit['target']['expected_version']==reload['result']['config_version']==write['result']['config_version']
    assert all(write['result']['stored_schedule'][k]==v==reload['result']['stored_schedule'][k] for k,v in req['payload'].items())
    assert edit['payload']=={k:reload['result']['stored_schedule'][k] for k in req['payload']}
neg=j(typed/'relational-negative-examples.json')['examples']
assert len(neg)==16
for n in neg:
    x=n['payload']; rq=x['request']['operation_id']; wr=x['write_response']['operation_id']; original=x['outcome_response']['result']['original_response']['operation_id']
    assert n['expected_structural_valid'] and not n['expected_relational_valid']
    assert (rq!=wr and rq==original) if n['kind']=='WRITE_ID_SWAPPED' else (rq==wr and rq!=original)
checks.append({'name':'independent_saved_relations','chains':8,'single_id_swap_negatives':16,'preserved_typed_files':len(files),'runtime_tested':False})
commands=[]
for script,args,expected in [('verify_saved.py',[],0),('verify_relations.py',[],0),('verify_relations.py',['--negative','WRITE_ID_SWAPPED'],1),('verify_relations.py',['--negative','ORIGINAL_ID_SWAPPED'],1),('verify.py',['--requests'],0),('verify.py',[],0)]:
    cmd=[sys.executable,'-B',str(P/script),*args]
    run=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8')
    record={'command':subprocess.list2cmdline(cmd),'exit':run.returncode,'expected_exit':expected,'result':'PASS' if run.returncode==expected else 'FAIL','observation':run.stdout,'stderr':run.stderr,'scope':'documentary only; expected exit 1 is negative rejection'}
    commands.append(record)
    (O/'commands.json').write_text(json.dumps(commands,ensure_ascii=False,indent=2),encoding='utf-8')
    assert run.returncode==expected,record
checks.append({'name':'input_integrity_after','result':seal()})
(O/'check-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'independent_documentary_checks':'PASS','vectors':18,'saved_chains':8,'relational_negatives':16,'commands':len(commands),'input_members':157,'runtime_tested':False}))
