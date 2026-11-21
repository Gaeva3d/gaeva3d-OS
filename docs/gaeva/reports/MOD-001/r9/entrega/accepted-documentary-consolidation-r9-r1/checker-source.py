import json,pathlib,re,copy,datetime,hashlib,subprocess,sys
p=pathlib.Path(__file__).parent;r=p.parent;c=r/'final-documentary-candidate-r3/candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec';cat=json.loads((p/'action-catalog.json').read_text(encoding='utf-8'));actions=cat['actions']
def check(s,v):
 if 'oneOf' in s:return sum(check(x,v) for x in s['oneOf'])==1
 if 'const' in s and (type(v)!=type(s['const']) or v!=s['const']):return False
 if 'enum' in s and not any(type(v)==type(x) and v==x for x in s['enum']):return False
 typ=s.get('type');types={'object':dict,'array':list,'string':str,'integer':int,'boolean':bool}
 if typ and type(v)!=types[typ]:return False
 if typ=='object':
  if not all(k in v for k in s.get('required',[])):return False
  if s.get('additionalProperties') is False and set(v)-set(s.get('properties',{})):return False
  return all(check(s['properties'][k],val) for k,val in v.items())
 if typ=='array':return len(v)>=s.get('minItems',0) and (not s.get('uniqueItems') or len(set(json.dumps(x,sort_keys=True) for x in v))==len(v)) and all(check(s['items'],x) for x in v)
 if typ=='integer':return s.get('minimum',v)<=v<=s.get('maximum',v)
 if typ=='string':
  if not s.get('minLength',0)<=len(v)<=s.get('maxLength',len(v)):return False
  if 'pattern' in s and not re.search(s['pattern'],v):return False
  if s.get('format')=='date-time':
   try:datetime.datetime.strptime(v,'%Y-%m-%dT%H:%M:%SZ')
   except ValueError:return False
 return True
def sample(s):
 if 'oneOf' in s:return sample(s['oneOf'][0])
 if 'const' in s:return s['const']
 if 'enum' in s:return s['enum'][0]
 typ=s.get('type')
 if typ=='object':return {k:('America/Sao_Paulo' if k=='timezone' else sample(s['properties'][k])) for k in s['required']}
 if typ=='array':return [sample(s['items']) for _ in range(s.get('minItems',0))]
 if typ=='integer':return s.get('minimum',0)
 if typ=='boolean':return False
 if s.get('format')=='date-time':return '2030-01-01T00:00:00Z'
 if s.get('pattern')=='^[0-9a-f]{64}$':return '0'*64
 if '[01]' in s.get('pattern',''):return '03:15'
 return 'fictional-value'
allowed={'$schema','oneOf','const','enum','type','properties','required','additionalProperties','items','minItems','uniqueItems','minimum','maximum','minLength','maxLength','pattern','format'}
def lint(s):
 assert not set(s)-allowed,set(s)-allowed
 if s.get('type')=='object':
  assert s['additionalProperties'] is False
  assert set(s['required'])<=set(s['properties'])
  for x in s['properties'].values():lint(x)
 if 'items' in s:lint(s['items'])
 for x in s.get('oneOf',[]):lint(x)
rows=json.loads((c/'modules/MOD-001/traceability.json').read_text(encoding='utf-8-sig'));task=json.loads((c/'tasks/MOD-001/task.json').read_text(encoding='utf-8-sig'));ac={x['id'] for x in task['acceptance_criteria']};tests={x['id'] for x in task['required_tests']}
bind=[];results=[];responses=[];negative_responses=[]
union=json.loads((p/'request-union.schema.json').read_text(encoding='utf-8'));lint(union)
assert len(set(x['action'] for x in actions))==len(actions)==39
for a in actions:
 name=a['action'];s=a['request_schema'];e=a['example'];lint(a['response_schema']);assert check(s,e),name;assert check(union,e),name
 for label,modify in [('extra',lambda x:x['payload'].update({'unlisted':True})),('forged-context',lambda x:x.update({'tenant_id':'fictional-other'})),('null',lambda x:x.update({'payload':None})),('missing',lambda x:x.pop('action')),('wrongtype',lambda x:x.update({'operation_id':False}))]:
  bad=copy.deepcopy(e);modify(bad);assert not check(union,bad),(name,label)
 for key in s['properties']['payload']['required']:
  bad=copy.deepcopy(e);bad['payload'].pop(key);assert not check(s,bad),(name,'required',key)
  bad=copy.deepcopy(e);bad['payload'][key]=None;assert not check(s,bad),(name,'null field',key)
 for rs in a['response_schema']['oneOf']:
  ex=sample(rs);assert check(a['response_schema'],ex),(name,'response',ex);responses.append(copy.deepcopy(ex))
  bad_response=copy.deepcopy(ex);bad_response['raw_token']='fictional-forbidden';assert not check(a['response_schema'],bad_response),(name,'response extra')
  assert 'raw_token' not in ex and 'raw_token' not in responses[-1]
  negative_responses.append({'action':name,'status':ex['status'],'expected_valid':False,'case':'forbidden-extra-field','payload':copy.deepcopy(bad_response)})
 selected=[x for x in rows if x['flow'] in a['flows']]
 assert selected and all(x['acceptance_id'] in ac and x['test_id'] in tests for x in selected)
 bindings=[{'flow':x['flow'],'scenario':x['action'],'acceptance_id':x['acceptance_id'],'test_id':x['test_id'],'microtask_ids':x['microtask_ids'],'requirement_ids':x['Task_requirements'],'rule_ids':x['Task_rules'],'contract_locator':a['contract_locator']} for x in selected]
 bind.append({'action':name,'locator':'action-fields.md#'+a['contract_locator'].lower(),'request_schema_pointer':'/actions/'+str(actions.index(a))+'/request_schema','existing_bindings':bindings,'field_acceptance_cases':['positive typed payload','missing required','extra field','wrong type/null','forged context rejected'],'future_semantic_oracles':['stale CAS -> CONFLICT, no write','no grant/field permission -> denied safely','domain invariant/admin-only extras -> no bypass','same operation/digest -> same result; changed digest -> conflict','concurrent last-admin/policy/config/hold ordering according to applicable action','restore/restart -> fresh head, no resurrected grant/duplicate effect'],'execution':'structural document checks executed; semantic/runtime oracles NOT_EXECUTED'})
 results.append({'action':name,'document_schema_example_checks':'OK','future_runtime':'NOT_EXECUTED'})
(p/'acceptance-bindings.json').write_text(json.dumps(bind,ensure_ascii=False,indent=2),encoding='utf-8');(p/'response-examples.json').write_text(json.dumps({'fictitious':True,'responses':responses},ensure_ascii=False,indent=2),encoding='utf-8');(p/'catalog-check.json').write_text(json.dumps({'actions':39,'response_variants':len(responses),'keyword_subset_linted':True,'results':results,'runtime_tested':False},indent=2),encoding='utf-8')
print('CATALOG_OK',len(actions),'actions',len(responses),'typed response examples; structural negatives checked; semantic runtime not executed')

(p/'negative-response-examples.json').write_text(json.dumps({'fictitious':True,'examples':negative_responses},ensure_ascii=False,indent=2),encoding='utf-8')
# Reopen the actual serialized bytes; in-memory assertions alone missed F08.
saved=json.loads((p/'response-examples.json').read_text(encoding='utf-8'))['responses']
saved_negative=json.loads((p/'negative-response-examples.json').read_text(encoding='utf-8'))['examples']
by_action={a['action']:a for a in actions}
for ex in saved:assert check(by_action[ex['action']]['response_schema'],ex),('SAVED_POSITIVE_INVALID',ex['action'],ex['status'])
for ex in saved_negative:assert ex['expected_valid'] is False and check(by_action[ex['action']]['response_schema'],ex['payload']) is False,('SAVED_NEGATIVE_ACCEPTED',ex['action'])
assert len(saved)==len(saved_negative)==238
(p/'serialized-validation.json').write_text(json.dumps({'saved_positive_count':len(saved),'saved_positive_valid':len(saved),'saved_negative_count':len(saved_negative),'saved_negative_correctly_rejected':len(saved_negative),'reopened_from_disk':True,'no_alias_mutation_asserted':True,'runtime_tested':False},indent=2),encoding='utf-8')
print('SERIALIZED_OK',len(saved),'positive',len(saved_negative),'negative; reopened JSON')
