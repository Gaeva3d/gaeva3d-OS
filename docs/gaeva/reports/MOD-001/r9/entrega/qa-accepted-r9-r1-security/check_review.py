from pathlib import Path
import hashlib,json,subprocess,sys,ast,copy,re,datetime
O=Path(__file__).resolve().parent
P=O.parent/'accepted-documentary-consolidation-r9-r1'
B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6')
M=Path('candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001')
def h(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def j(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def save(n,v): (O/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
assert h(P/'manifest.json')=='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
assert h(P/'review-input.json')=='e1ca7d28e10801fde590975765502fbb8d646d2648c1330fc06dd80968840961'
manifest=j(P/'manifest.json'); assert len(manifest['files'])==157
before={x['path']:h(P/x['path']) for x in manifest['files']}
for x in manifest['files']:
 assert before[x['path']]==x['sha256'] and (P/x['path']).stat().st_size==x['bytes'],x['path']
ri=j(P/'review-input.json')
for a in ri['artifacts'].values(): assert h(P/a['path'])==a['sha256']
assert manifest['author']!='agent-6b9f3e9e-8ea7-4483-a52c-63129f849a5a'
old=O.parent/'final-documentary-candidate-r5'
unchanged=[]
for p in (old/M/'typed-actions-v1').rglob('*'):
 if p.is_file():
  rel=p.relative_to(old); assert h(p)==h(P/rel);unchanged.append(str(rel))
for n in ['authority-protocol.md','retention-protocol.md','retention-validation.md','approved-decisions.md']:
 assert h(old/M/n)==h(P/M/n);unchanged.append(n)
cat=j(P/M/'typed-actions-v1/action-catalog.json'); pol=j(P/M/'save-action-bindings-r9.json')
assert len(cat['actions'])==len(pol['actions'])==39
assert all(a['automatic_replay_proven'] is False and a['queue_enablement']=='NOT_GRANTED_BY_THIS_CATALOG' for a in pol['actions'])
tree=ast.parse((P/'checker-source.py').read_text(encoding='utf-8'))
ns={'json':json,'re':re,'datetime':datetime}
exec(compile(ast.Module(body=[x for x in tree.body if isinstance(x,ast.FunctionDef) and x.name=='check'],type_ignores=[]),'subset-check','exec'),ns)
rows=[]
for a in cat['actions']:
 check=ns['check']; s=a['request_schema']; req=copy.deepcopy(a['example']);assert check(s,req)
 for key in ['tenant_id','actor_id','installation','protected','current_authority_head']:
  bad=copy.deepcopy(req);bad[key]='forged-context';assert not check(s,bad),(a['action'],key)
 rows.append({'action':a['action'],'permission':a['permission'],'forged_context_vectors_rejected':5,'runtime_authorization_tested':False})
save('action-checks.json',rows)
vectors=j(P/M/'save-acceptance-r9.json')['vectors'];assert len(vectors)==18
assert all(v['status']=='PLANNED_NOT_EXECUTED' for v in vectors)
assert {'actor_company_record_isolation','logout_multitab_revocation','key_rotation_unavailable','wrong_ack_id_version','protected_then_cleanup_failure'}<={v['scenario'] for v in vectors}
save('input-verification.json',{'manifest_sha256':h(P/'manifest.json'),'review_input_sha256':h(P/'review-input.json'),'members':157,'tuple':ri['artifacts'],'preserved_files':unchanged,'author':manifest['author'],'reviewer':'agent-6b9f3e9e-8ea7-4483-a52c-63129f849a5a','independence':'reviewer not author; prior independent reviews are not source authorship','runtime_tested':False})
jobs=[('saved-fixtures',[str(P/'verify_saved.py')],0),('relations',[str(P/'verify_relations.py')],0),('negative-write',[str(P/'verify_relations.py'),'--negative','WRITE_ID_SWAPPED'],1),('negative-original',[str(P/'verify_relations.py'),'--negative','ORIGINAL_ID_SWAPPED'],1),('documentary-invariants',[str(P/'verify.py')],0),('manifest-readback',[str(P/'verify.py'),'--manifest'],0),('token-reader',[str(B/'scripts/token_usage.py'),'--task','GAEVA-MOD-001','--stage','DOC-R9-QA-01'],2)]
records=[]
for name,args,expected in jobs:
 cmd=[sys.executable,'-B']+args;r=subprocess.run(cmd,capture_output=True,encoding='utf-8',errors='replace')
 (O/(name+'.stdout')).write_text(r.stdout,encoding='utf-8');(O/(name+'.stderr')).write_text(r.stderr,encoding='utf-8')
 records.append({'name':name,'argv':cmd,'command':subprocess.list2cmdline(cmd),'exit':r.returncode,'expected_exit':expected,'result':'UNAVAILABLE' if name=='token-reader' else ('EXPECTED_REJECTION' if expected else 'PASS') if r.returncode==expected else 'FAIL'})
 save('commands.json',records); print(name,r.returncode)
 assert r.returncode==expected,name
assert all(h(P/k)==v for k,v in before.items())
assert h(P/'manifest.json')=='e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
save('no-input-drift.json',{'members':157,'unchanged':True,'manifest_unchanged':True,'input_read_only':True})
print('INDEPENDENT_CHECK_OK 157 members; 195 forged-context negatives; original controls unchanged; no input drift')
