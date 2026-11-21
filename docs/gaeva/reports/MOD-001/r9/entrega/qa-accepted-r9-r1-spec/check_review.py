"""Independent documentary checks; writes only this review directory."""
from pathlib import Path
import hashlib,json,subprocess,sys,ast
O=Path(__file__).resolve().parent
R=O.parent
P=R/'accepted-documentary-consolidation-r9-r1'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
S='docs/gaeva/retomada-tfd/transformacao-filaops/spec'
M=P/'candidate'/S/'modules/MOD-001'
def j(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def h(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def write(name,data): (O/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def seal():
    assert h(P/'manifest.json')=='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
    assert h(P/'review-input.json')=='e1ca7d28e10801fde590975765502fbb8d646d2648c1330fc06dd80968840961'
    files=j(P/'manifest.json')['files'];assert len(files)==157
    for e in files:
        q=P/e['path'];assert q.resolve().is_relative_to(P.resolve())
        assert h(q)==e['sha256'] and q.stat().st_size==e['bytes'],e['path']
    for e in j(P/'review-input.json')['artifacts'].values():assert h(P/e['path'])==e['sha256']
    return {e['path']:e['sha256'] for e in files}
before=seal();write('input-before.json',before)
commands=[]
def run(name,args,expected=0):
    cmd=[sys.executable,'-B',*map(str,args)]
    q=subprocess.run(cmd,capture_output=True,encoding='utf-8',errors='replace')
    (O/(name+'.stdout')).write_text(q.stdout,encoding='utf-8')
    (O/(name+'.stderr')).write_text(q.stderr,encoding='utf-8')
    rec={'name':name,'argv':cmd,'command':subprocess.list2cmdline(cmd),'exit':q.returncode,'expected_exit':expected,'result':'PASS' if q.returncode==expected else 'FAIL','observation':'Expected rejection of relationally invalid saved fixtures' if expected==1 else 'Local documentary check; no product runtime'}
    commands.append(rec);write('commands.json',commands)
    print(name,q.returncode,rec['result'],flush=True)
    assert q.returncode==expected,rec
run('task-schema',[B/'scripts/validate_task.py',P/'candidate'/S/'tasks/MOD-001/task.json','--require-coverage'])
run('invariants',[P/'verify.py'])
run('manifest',[P/'verify.py','--manifest'])
run('formal-historical-inventory',[P/'verify.py','--g6-local'])
run('requests',[P/'verify.py','--requests'])
run('responses',[P/'verify_saved.py'])
run('relations',[P/'verify_relations.py'])
run('negative-write',[P/'verify_relations.py','--negative','WRITE_ID_SWAPPED'],1)
run('negative-original',[P/'verify_relations.py','--negative','ORIGINAL_ID_SWAPPED'],1)
for phase in ['P4-CONTROLS','P5-BACKUPS','P6-ASSURANCE']:
    run('estimate-'+phase,[B/'scripts/validate_estimate.py',P/'candidate'/S/'estimates'/('GAEVA-MOD-001-'+phase+'.json')])
t=j(P/'candidate'/S/'tasks/MOD-001/task.json');cat=j(M/'typed-actions-v1/action-catalog.json');pol=j(M/'save-action-bindings-r9.json');vec=j(M/'save-acceptance-r9.json')['vectors']
assert j(P/'manifest.json')['author']!='agent-13677c2e-fb09-41ac-b29b-2f30a6c7cbe7'
old=j(R/'final-documentary-candidate-r5/candidate'/S/'tasks/MOD-001/task.json')
assert old['microtasks'][:11]==t['microtasks'][:11]
acs={a['id']:a for a in t['acceptance_criteria']};tests={x['id']:x for x in t['required_tests']};mts={x['id'] for x in t['microtasks']}
for x in vec:
    assert x['acceptance_id'] in acs and x['test_id'] in tests
    assert x['test_id']==acs[x['acceptance_id']]['validation']
    assert set(x['microtask_ids'])<=mts
    assert tests[x['test_id']]['type']=='manual' and 'NOT_EXECUTED' in tests[x['test_id']]['command']
by={a['action']:a for a in cat['actions']}
for x in pol['actions']:
    assert x['action'] in by and x['permission']==by[x['action']]['permission']
    assert x['queue_enablement']=='NOT_GRANTED_BY_THIS_CATALOG' and x['automatic_replay_proven'] is False
    assert all(a in acs for a in x['acceptance_ids'])
assert len(by)==39 and len(vec)==18
human=j(P/'human-source-comments.json')['comments'];accepted=j(M/'human-acceptance-r9.json')['github_sources']
for x,y in zip(human,accepted):assert (x['id'],x['body'],x['user']['login'])==(y['id'],y['body'],y['actor'])
after=seal();assert before==after;write('input-after.json',after)
write('self-check.json',{'actor':'agent-13677c2e-fb09-41ac-b29b-2f30a6c7cbe7','author_conflict':False,'sealed_members':157,'input_drift':False,'manual_vectors_bound':18,'actions_unchanged':39,'original_microtasks_preserved':11,'checks':commands,'runtime_tested':False})
print('INDEPENDENT_CHECKS_OK; no product runtime; input unchanged')
