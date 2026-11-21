# Read-only relational validation of serialized documentary fixtures.
import pathlib,json,ast,re,datetime,sys
p=pathlib.Path(__file__).parent/'candidate'/'docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001'/'typed-actions-v1'
source=ast.parse((pathlib.Path(__file__).parent/'checker-source.py').read_text(encoding='utf-8'))
ns={'re':re,'json':json,'datetime':datetime}
exec(compile(ast.Module(body=[x for x in source.body if isinstance(x,ast.FunctionDef) and x.name=='check'],type_ignores=[]),'subset-check','exec'),ns);check=ns['check']
by={x['action']:x for x in json.loads((p/'action-catalog.json').read_text(encoding='utf-8'))['actions']}
def structural(x):
 checks=[]
 for k,a in [('request','ConfigureSchedule'),('edit_request','ConfigureSchedule'),('stale_request','ConfigureSchedule')]:
  if k in x:checks.append(check(by[a]['request_schema'],x[k]))
 for k,a in [('write_response','ConfigureSchedule'),('reload_response','GetBackupConfiguration'),('outcome_response','GetOutcome'),('fresh_reload','GetBackupConfiguration'),('conflict','ConfigureSchedule')]:
  if k in x:checks.append(check(by[a]['response_schema'],x[k]))
 if 'payload' in x:return check(by['GetBackupConfiguration']['response_schema'],x['payload'])==x['expected_valid']
 return all(checks)
def relations(x):
 failures=[]
 def require(ok,name):
  if not ok:failures.append(name)
 if 'reload_response' in x:
  req=x['request'];wr=x['write_response'];orig=x['outcome_response']['result']['original_response'];load=x['reload_response'];edit=x['edit_request']
  require(req['operation_id']==wr['operation_id'],'mutation_id!=write_id')
  require(req['operation_id']==orig['operation_id'],'mutation_id!=outcome_original_id')
  require(orig==wr,'original_response!=write_response')
  require(wr['action']==req['action']==orig['action']=='ConfigureSchedule','mutation_action')
  require(wr['result_version']==wr['result']['config_version']>req['target']['expected_version'],'write_version')
  require(load['result_version']==load['result']['config_version']==wr['result']['config_version'],'reload_version')
  for field,value in req['payload'].items():
   require(wr['result']['stored_schedule'].get(field)==value,'write_field:'+field)
   require(load['result']['stored_schedule'].get(field)==value,'reload_field:'+field)
  require(edit['target']['expected_version']==load['result']['config_version'],'edit_expected_version')
  require(edit['target']['kind']==req['target']['kind'] and edit['target']['id']==req['target']['id'],'edit_target')
  require(edit['operation_id']!=req['operation_id'],'edit_requires_new_id')
  require(edit['payload']=={k:load['result']['stored_schedule'][k] for k in req['payload']},'edit_values')
  if 'outcome_request' in x:
   q=x['outcome_request'];require(q['target']['id']==req['operation_id'],'query_target_original_id');require(q['operation_id']==x['outcome_response']['operation_id'],'query_own_response_id')
  if 'reload_request' in x:
   q=x['reload_request'];require(q['operation_id']==load['operation_id'],'reload_query_response_id');require(q['target']['id']==req['target']['id'],'reload_query_target')
 if 'fresh_reload' in x:
  stale=x['stale_request'];conf=x['conflict'];fresh=x['fresh_reload']
  require(stale['operation_id']==conf['operation_id'],'conflict_response_id')
  require(conf['current_version']==fresh['result_version']==fresh['result']['config_version']>stale['target']['expected_version'],'conflict_current_version')
  require(x['unsaved_draft']==stale['payload'],'conflict_preserves_draft')
 return failures
def main():
 if '--old' in sys.argv:path=p.parent/'corrections-action-contracts-backend-r2/schedule-roundtrip-examples.json';cs=json.loads(path.read_text(encoding='utf-8'))['cases']
 elif '--negative' in sys.argv:
  which=sys.argv[sys.argv.index('--negative')+1];vectors=json.loads((p/'relational-negative-examples.json').read_text(encoding='utf-8'))['examples'];selected=[v for v in vectors if v['kind']==which];assert len(selected)==8
  assert all(v['expected_structural_valid'] is True and v['expected_relational_valid'] is False for v in selected)
  cs=[v['payload'] for v in selected]
 else:path=p/'schedule-roundtrip-examples.json';cs=json.loads(path.read_text(encoding='utf-8'))['cases']
 failures=[];chains=0
 for i,x in enumerate(cs):
  assert structural(x),('STRUCTURAL_FIXTURE_ERROR',i,x['case'])
  chains+=int('reload_response' in x)
  f=relations(x)
  if f:failures.append({'index':i,'case':x['case'],'failures':f})
 print(json.dumps({'saved_cases':len(cs),'positive_chains':chains,'relational_failures':failures,'runtime_tested':False}))
 if '--negative' in sys.argv:assert len(failures)==len(cs)==8,('NEGATIVE_EXPECTATION_NOT_MET',failures)
 return 1 if failures else 0
if __name__=='__main__':sys.exit(main())
