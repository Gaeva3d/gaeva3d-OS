# Read-only checker of actual saved fixtures; never runs generators.
import pathlib,json,ast,sys,copy,datetime,re
p=pathlib.Path(__file__).parent/'candidate'/'docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001'/'typed-actions-v1'
source=(pathlib.Path(__file__).parent/'checker-source.py').read_text(encoding='utf-8');tree=ast.parse(source)
ns={'json':json,'re':re,'datetime':datetime};exec(compile(ast.Module(body=[x for x in tree.body if isinstance(x,ast.FunctionDef) and x.name=='check'],type_ignores=[]),str(p/'check_catalog.py'),'exec'),ns);check=ns['check']
cat=json.loads((p/'action-catalog.json').read_text(encoding='utf-8'));by={x['action']:x for x in cat['actions']}
if '--old' in sys.argv:
 by={x['action']:x for x in json.loads((p/'preimage-r1/action-catalog.json').read_text(encoding='utf-8'))['actions']}
 pos=json.loads((p/'preimage-r1/response-examples.json').read_text(encoding='utf-8'))['responses']
elif '--probe' in sys.argv:pos=json.loads((p/'contaminated-positive-probe.json').read_text(encoding='utf-8'))['payload']['responses']
else:pos=json.loads((p/'response-examples.json').read_text(encoding='utf-8'))['responses']
invalid=[(x.get('action'),x.get('status')) for x in pos if not check(by[x['action']]['response_schema'],x)]
if invalid:print('SAVED_POSITIVE_INVALID',len(invalid),'/',len(pos),'first',invalid[0]);sys.exit(1)
neg=json.loads((p/'negative-response-examples.json').read_text(encoding='utf-8'))['examples']
assert all(x['expected_valid'] is False and not check(by[x['action']]['response_schema'],x['payload']) for x in neg)
assert len({(x['action'],x['status']) for x in pos})==len(pos)==238
print('SAVED_FIXTURES_VALID',len(pos),'positive',len(neg),'negative; disk bytes only')
