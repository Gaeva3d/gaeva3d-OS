"""Run installed validators and readonly saved-fixture checks; receipt every exit."""
from pathlib import Path
import subprocess,json,hashlib,sys
O=Path(__file__).resolve().parent;B=Path('C:/Users/teste/.codex/plugins/cache/tfd-local/the-factory-developer/0.1.6');C=O/'candidate';P='docs/gaeva/retomada-tfd/transformacao-filaops/spec';py=sys.executable
jobs=[('task-schema',[str(B/'scripts/validate_task.py'),str(C/P/'tasks/MOD-001/task.json'),'--require-coverage'],0),('render-task',[str(B/'scripts/render_task.py'),str(C/P/'tasks/MOD-001/task.json'),'--require-coverage'],0),('saved-response-fixtures',[str(O/'verify_saved.py')],0),('saved-schedule-relations',[str(O/'verify_relations.py')],0),('negative-write-id',[str(O/'verify_relations.py'),'--negative','WRITE_ID_SWAPPED'],1),('negative-original-id',[str(O/'verify_relations.py'),'--negative','ORIGINAL_ID_SWAPPED'],1),('typed-request-subset',[str(O/'verify.py'),'--requests'],0),('local-formal-inventory',[str(O/'verify.py'),'--g6-local'],0)]
for name in ['P4-CONTROLS','P5-BACKUPS','P6-ASSURANCE']:jobs.append(('estimate-'+name,[str(B/'scripts/validate_estimate.py'),str(C/P/'estimates'/('GAEVA-MOD-001-'+name+'.json'))],0))
jobs += [('documentary-invariants',[str(O/'verify.py')],0),('token-reader',[str(B/'scripts/token_usage.py'),'--task','GAEVA-MOD-001','--stage','DOC-R9-CONSOLIDATE-01'],2)]
records=[];fail=False
for name,args,expected in jobs:
 cmd=[py,'-B']+args;p=subprocess.run(cmd,capture_output=True,encoding='utf-8',errors='replace');(O/(name+'.stdout')).write_text(p.stdout,encoding='utf-8');(O/(name+'.stderr')).write_text(p.stderr,encoding='utf-8')
 is_meter=name=='token-reader';ok=p.returncode==expected;fail|=not ok
 result='UNAVAILABLE' if is_meter and ok else ('EXPECTED_REJECTION' if expected and ok else ('PASS' if ok else 'FAIL'))
 records.append({'command':subprocess.list2cmdline(cmd),'argv':cmd,'exit':p.returncode,'expected_exit':expected,'result':result,'stdout':name+'.stdout','stderr':name+'.stderr','observation':'Receipt missing; not OpenBot token metering' if is_meter else ('Intentional structural-valid/relational-invalid swap must be rejected; no runtime test' if expected else 'Documentary/local validation only')})
 print(name,p.returncode,result)
(O/'commands.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
sys.exit(1 if fail else 0)
