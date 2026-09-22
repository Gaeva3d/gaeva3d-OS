import assert from 'node:assert/strict';
import test from 'node:test';
import { createTeamAccessHandler, temporaryPassword } from '../supabase/functions/team-access/handler.ts';

const callerId='10000000-0000-0000-0000-000000000001';
const memberId='20000000-0000-0000-0000-000000000002';
const targetId='30000000-0000-0000-0000-000000000003';
const email='person@example.invalid';
const input={action:'create_access',name:'Pessoa',email,role:'designer',capacity:3,jobTitle:'Designer'};

function fixture(options={}) {
 const calls=[];
 let exists=!!options.existing;
 const identity={id:callerId,app_metadata:{gaeva_requires_password_change:!!options.temporary},user_metadata:{role:'admin'}};
 const target={id:targetId,email,email_confirmed_at:options.unconfirmed?null:'2026-09-08',app_metadata:{existing_key:'keep'}};
 const member={id:memberId,name:'Pessoa',email,is_active:true,deleted_at:null,user_id:options.self?callerId:targetId};
 const auth={
  getUser:async token=>{calls.push(['verify',token]);return {data:{user:options.badToken?null:identity},error:options.badToken?{}:null};},
  admin:{
   createUser:async body=>{calls.push(['create',body]);exists=true;return options.race?{data:{user:null},error:{}}:{data:{user:target},error:null};},
   getUserById:async id=>{calls.push(['getTarget',id]);return {data:{user:target},error:null};},
   updateUserById:async(id,body)=>{calls.push(['update',id,body]);return {data:{user:target},error:null};},
  }
 };
 const client={auth,
  from(table){
   let column;
   const query={select(){return query;},eq(c){column=c;return query;},
    async single(){return {data:table==='team_members'?member:{role:options.role??'admin',is_active:!options.inactive},error:null};},
    async maybeSingle(){return {data:exists?{id:targetId,email,is_active:true}:null,error:null};}
   };return query;
  },
  async rpc(name,args){calls.push([name,args]);return {data:member,error:name==='link_team_access'&&options.linkFail?{message:'Vínculo recusado.'}:null};}
 };
 const handler=createTeamAccessHandler({url:'https://example.invalid',publicKey:'public',serviceKey:'private-test-only',createClient:()=>client});
 async function run(body=input,authorization='Bearer user-token'){
  const res=await handler(new Request('https://example.invalid/team-access',{method:'POST',headers:authorization?{Authorization:authorization}:{},body:JSON.stringify(body)}));
  return {status:res.status,headers:res.headers,body:await res.json()};
 }
 return {calls,run,handler};
}

test('missing or invalid sessions cannot reach privileged operations',async()=>{
 for(const [options,token] of [[{},''],[{badToken:true},'Bearer invalid']]){
  const f=fixture(options);assert.equal((await f.run(input,token)).status,401);
  assert.equal(f.calls.filter(c=>c[0]!=='verify').length,0);
 }
});
test('all four non-admin roles and inactive admins are denied despite editable metadata',async()=>{
 for(const options of [...['commercial','production','designer','viewer'].map(role=>({role})),{inactive:true},{temporary:true}]){
  const f=fixture(options);assert.equal((await f.run()).status,403);assert.equal(f.calls.some(c=>c[0]==='create'),false);
 }
});
test('new access prepares existing tables, creates Auth and links with no cached credentials',async()=>{
 const f=fixture();const r=await f.run({...input,email:' PERSON@EXAMPLE.INVALID '});
 assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(r.body.created,true);
 assert.equal(r.body.email,email);assert.equal(r.body.password.length,36);
 assert.deepEqual(f.calls.map(c=>c[0]),['verify','prepare_team_access','create','getTarget','link_team_access']);
 const create=f.calls.find(c=>c[0]==='create')[1];assert.equal(create.email_confirm,true);
 assert.equal(create.app_metadata.gaeva_requires_password_change,true);
 assert.equal(create.app_metadata.role,undefined); // Role comes from the existing team via the RLS RPC.
 assert.equal(f.calls.find(c=>c[0]==='link_team_access')[1].p_user_id,targetId);
});
test('existing account is linked without overwriting its password or creating another identity',async()=>{
 const f=fixture({existing:true});const r=await f.run({action:'create_access',memberId,email});
 assert.equal(r.status,200);assert.equal(r.body.password,undefined);assert.equal(r.body.created,false);
 assert.equal(f.calls.some(c=>['create','update'].includes(c[0])),false);
 assert.equal(f.calls.find(c=>c[0]==='prepare_team_access')[1].p_member_id,memberId);
});
test('concurrent Auth creation reuses the winning identity without leaking an invalid password',async()=>{
 const f=fixture({race:true});const r=await f.run();assert.equal(r.status,200);
 assert.equal(r.body.password,undefined);assert.equal(r.body.created,false);
});
test('a failed link or unconfirmed identity never returns credentials or false success',async()=>{
 for(const options of [{linkFail:true},{existing:true,unconfirmed:true}]){
  const f=fixture(options);const r=await f.run();assert.equal(r.status,409);assert.equal(r.body.password,undefined);assert.equal(r.body.ok,undefined);
 }
});
test('self-service password change ignores supplied user IDs and preserves trusted metadata',async()=>{
 const f=fixture({role:'designer',temporary:true});const r=await f.run({action:'change_password',password:'New!StrongPassword123',userId:targetId});
 assert.equal(r.status,200);const update=f.calls.find(c=>c[0]==='update');assert.equal(update[1],callerId);
 assert.equal(update[2].app_metadata.gaeva_requires_password_change,false);
 assert.equal(r.body.password,undefined);
});
test('administrator reset targets only a linked active member and requires password change',async()=>{
 const f=fixture();const r=await f.run({action:'reset_password',memberId,userId:callerId});
 assert.equal(r.status,200);const update=f.calls.find(c=>c[0]==='update');assert.equal(update[1],targetId);
 assert.equal(update[2].app_metadata.existing_key,'keep');assert.equal(update[2].app_metadata.gaeva_requires_password_change,true);
 assert.equal((await fixture({self:true}).run({action:'reset_password',memberId})).status,400);
});
test('invalid input and short passwords are rejected before account creation',async()=>{
 for(const body of [{...input,email:'invalid'},{...input,role:'owner'},{...input,capacity:-1},{action:'change_password',password:'short'}]){
  const f=fixture();assert.equal((await f.run(body)).status,400);assert.equal(f.calls.some(c=>['create','update','prepare_team_access'].includes(c[0])),false);
 }
});
test('temporary passwords have cryptographic randomness and all required character classes',()=>{
 const passwords=Array.from({length:100},temporaryPassword);assert.equal(new Set(passwords).size,100);
 assert.ok(passwords.every(p=>p.length===36&&/[a-z]/.test(p)&&/[A-Z]/.test(p)&&/\d/.test(p)&&/[^a-z0-9]/i.test(p)));
});
