'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{fixture}=require('./host-fixture.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/core.jsxinc'),'utf8'),context={};
vm.runInNewContext(source.slice(0,source.indexOf('var FFHost =')),context);
const core=context.FFCore;
function preview(f,extra={}){return f.call({op:'arrange',token:f.state().token,scope:'auto',action:'stagger',order:'top',anchor:'cursor',frames:12,preview:true,...extra});}
function apply(f,p,id){assert.equal(p.ok,true,p.error&&p.error.message);return f.call({op:'applyPreview',token:p.data.state.token,previewId:p.data.preview.id},id);}
function near(a,b){assert.ok(Math.abs(a-b)<1e-9,a+' != '+b);}
function shape(l){return {id:l.id,start:l.startTime,inPoint:l.inPoint,outPoint:l.outPoint,selected:l.selected,keys:l.keys.map(k=>({...k}))};}
test('arrangement preview is read-only, ordered, and includes individual deltas',()=>{
  const f=fixture(),before=f.comp.items.map(shape),p=preview(f);assert.equal(p.ok,true);assert.equal(p.data.preview.operation,'arrange');
  assert.deepEqual(p.data.preview.targets.map(t=>[t.layerId,t.position,t.delta]),[[101,1,4],[102,2,2.5]]);assert.equal(p.data.preview.arrangement.total,2);
  assert.deepEqual(f.comp.items.map(shape),before);assert.equal(f.groups(),0);assert.equal(f.writes(),0);
});
for(const action of ['alignIn','alignOut'])test(action+' uses native layer translation and preserves duration, keys and selection',()=>{
  const f=fixture(),before=f.comp.items.map(shape),p=preview(f,{action}),r=apply(f,p);assert.equal(r.data.result.ok,true);
  f.comp.items.forEach((l,i)=>{const delta=4-before[i][action==='alignIn'?'inPoint':'outPoint'];near(l.inPoint,before[i].inPoint+delta);near(l.outPoint,before[i].outPoint+delta);near(l.startTime,before[i].start+delta);assert.deepEqual(l.keys,before[i].keys.map(k=>({...k,time:k.time+delta})));assert.equal(l.selected,before[i].selected);});
  assert.equal(f.groups(),1);assert.equal(f.undo(),0);
});
for(const order of ['top','bottom','time'])test('sequence with zero gap and '+order+' order preserves lengths',()=>{
  const f=fixture();f.comp.items[0].inPoint=3;f.comp.items[0].outPoint=5;f.comp.items[1].inPoint=1;f.comp.items[1].outPoint=4;
  const p=preview(f,{action:'sequence',frames:0,order}),a=order==='top'?f.comp.items[0]:f.comp.items[1],b=f.comp.items.find(l=>l!==a),da=a.outPoint-a.inPoint,db=b.outPoint-b.inPoint;
  assert.deepEqual(p.data.preview.targets.map(s=>s.layerId),[a.id,b.id]);assert.equal(apply(f,p).data.result.ok,true);
  near(a.inPoint,4);near(b.inPoint,a.outPoint);near(a.outPoint-a.inPoint,da);near(b.outPoint-b.inPoint,db);assert.equal(f.comp.duration,12);
});
test('stagger reverses explicit layer order and keeps the first-layer anchor',()=>{
  const f=fixture(),p=preview(f,{order:'bottom',anchor:'first',frames:5});assert.equal(apply(f,p).data.result.ok,true);
  near(f.comp.items[1].inPoint,2);near(f.comp.items[0].inPoint,2+5/24);assert.equal(p.data.preview.targets.length,1);
});
test('time ordering uses layer index as a stable tie breaker',()=>{
  const f=fixture();f.comp.items.forEach(l=>l.inPoint=1);const p=preview(f,{order:'time'});assert.deepEqual(p.data.preview.targets.map(s=>s.layerId),[101,102]);
});
test('fractional FPS and subframes remain exact through sequence and rerun is a no-op',()=>{
  const f=fixture();f.comp.time=1.123;f.comp.frameDuration=1001/30000;f.comp.items[0].inPoint=.111;f.comp.items[0].outPoint=1.337;
  const p=preview(f,{action:'sequence',frames:7});assert.equal(apply(f,p).data.result.ok,true);near(f.comp.items[0].inPoint,1.123);near(f.comp.items[1].inPoint,1.123+1.226+7*1001/30000);
  const groups=f.groups(),again=preview(f,{action:'sequence',frames:7});assert.equal(again.data.preview.counts.changes,0);assert.equal(apply(f,again).data.result.ok,true);assert.equal(f.groups(),groups);
});
test('Auto without selection arranges the composition; empty Selected never expands',()=>{
  const f=fixture();f.comp.items.forEach(l=>l.selected=false);const p=preview(f);assert.equal(p.data.preview.counts.layers,2);assert.equal(apply(f,p).data.result.ok,true);
  const before=f.writes();assert.equal(preview(f,{scope:'selected'}).ok,false);assert.equal(f.writes(),before);
});
test('explicit Selected leaves unselected layer content untouched',()=>{
  const f=fixture();f.comp.items[1].selected=false;const before=shape(f.comp.items[1]),p=preview(f,{action:'alignIn',scope:'selected'});assert.equal(p.data.preview.counts.layers,1);assert.equal(apply(f,p).data.result.ok,true);assert.deepEqual(shape(f.comp.items[1]),before);
});
test('a moving locked target blocks the entire arrangement',()=>{
  const f=fixture();f.comp.items[1].locked=true;const p=preview(f);assert.equal(p.data.preview.blocked,true);assert.equal(p.data.preview.counts.skipped,1);assert.equal(apply(f,p).data.failure.ok,false);assert.equal(f.writes(),0);assert.equal(f.groups(),0);
});
test('an unchanged locked anchor does not block other layers',()=>{
  const f=fixture();f.comp.items[0].locked=true;const p=preview(f,{anchor:'first'});assert.equal(p.data.preview.blocked,false);assert.equal(apply(f,p).data.result.ok,true);near(f.comp.items[1].inPoint,.5);
});
for(const mutate of [f=>f.comp.time++,f=>f.comp.items.reverse(),f=>f.comp.items[0].selected=false,f=>f.comp.items[0].stretch=50,f=>f.comp.items[0].source.duration++,f=>f.addLayer(1,3)])test('external target/scope change rejects an arrangement: '+mutate.toString(),()=>{
  const f=fixture(),p=preview(f);mutate(f);const writes=f.writes(),r=apply(f,p);assert.equal(r.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);
});
test('a new keyed property after preview is rejected before native translation',()=>{
  const f=fixture(),p=preview(f),l=f.comp.items[0],base=l.property(1);l.numProperties=2;
  const extra=Object.assign({},base,{matchName:'ADBE Rotation',propertyIndex:2});Object.defineProperty(extra,'numKeys',{get:()=>base.numKeys});l.property=id=>id===2?extra:id===1||id==='ADBE Opacity'?base:null;
  const r=apply(f,p);assert.equal(r.data.failure.ok,false);assert.match(r.data.failure.error.message,/Keyed properties changed/);assert.equal(f.writes(),0);
});
test('key value edits invalidate a captured arrangement',()=>{
  const f=fixture(),p=preview(f);f.comp.items[1].keys[0].value=999;const r=apply(f,p);assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),0);assert.equal(f.comp.items[1].keys[0].value,999);
});
test('runtime failure restores every translated layer and closes the Undo group',()=>{
  const f=fixture(),before=f.comp.items.map(shape),p=preview(f);f.injectOffsetFailure();const r=apply(f,p);assert.equal(r.data.failure.error.message,'Injected offset failure');assert.equal(r.data.failure.restored,true);assert.deepEqual(f.comp.items.map(shape),before);assert.equal(f.undo(),0);
});
test('arrangement apply acknowledges a repeated RPC id without a second mutation',()=>{
  const f=fixture(),p=preview(f),r=apply(f,p,'arrange:apply'),writes=f.writes();assert.deepEqual(apply(f,p,'arrange:apply'),r);assert.equal(f.writes(),writes);assert.equal(f.groups(),1);
});
test('whole-layer arrangements move native media, audio and Time Remap without extending source handles',()=>{
  const f=fixture();f.comp.items[0].source.duration=1;f.comp.items[0].hasAudio=true;f.comp.items[0].timeRemapEnabled=true;
  const p=preview(f);assert.equal(p.data.preview.blocked,false);assert.equal(apply(f,p).data.result.ok,true);
});
test('unknown fields, action, order, anchor, invalid frame counts and missing preview fail closed',()=>{
  const f=fixture();for(const extra of [{preview:false},{preview:undefined},{action:'delete'},{order:'clickOrder'},{anchor:'unknown'},{scope:'unknown'},{frames:0},{frames:-1},{frames:1.5},{frames:1000001},{frames:'12'},{unexpected:true},{action:'alignOut',anchor:'first'}])assert.equal(preview(f,extra).ok,false,JSON.stringify(extra));assert.equal(f.writes(),0);
});
test('one-layer Stagger/Sequence and AE range overflow are rejected without writes',()=>{
  const f=fixture();f.comp.items[1].selected=false;for(const action of ['stagger','sequence'])assert.equal(preview(f,{action}).ok,false);
  f.comp.items[1].selected=true;assert.equal(preview(f,{frames:1000000}).ok,false);assert.equal(f.writes(),0);
});
test('unchanged arrangements do not scan properties or create undo history',()=>{
  const f=fixture();f.comp.items.forEach(l=>{l.inPoint=4;l.property=()=>{throw Error('Unexpected property scan');};});
  const before=f.writes(),p=preview(f,{action:'alignIn'});assert.equal(p.data.preview.counts.changes,0);assert.equal(apply(f,p).data.result.ok,true);assert.equal(f.writes(),before);assert.equal(f.groups(),0);
});
test('large arrangements cap browser details at 100 without truncating the native plan',()=>{
  const f=fixture();f.comp.time=4.123;for(let i=0;i<148;i++)f.addLayer(i/10,i/10+1);const before=f.writes(),p=preview(f,{frames:1});
  assert.equal(p.data.preview.targets.length,100);assert.equal(p.data.preview.counts.layers,150);assert.equal(p.data.preview.targetsOmitted,50);assert.equal(p.data.preview.arrangement.total,150);assert.equal('slots' in p.data.preview.arrangement,false);assert.equal(f.writes(),before);
});
test('composition markers remain untouched by whole-layer arrangements',()=>{
  const f=fixture(),l=f.addLayer(1,2);l.selected=false;const marker=l.property(1),before=JSON.stringify(l.keys);f.comp.markerProperty=marker;const p=preview(f);assert.equal(apply(f,p).data.result.ok,true);assert.equal(JSON.stringify(l.keys),before);
});
test('pure arrangement invariants across 120 subframe layouts and three explicit orders',()=>{
  for(let seed=1;seed<=120;seed++){
    const models=Array.from({length:7},(_,i)=>({id:i+1,index:i+1,start:(i-seed)/17,inPoint:(i*seed%19)/11,outPoint:(i*seed%19)/11+(i+1)/13})),before=JSON.stringify(models),c={cti:seed/23,frameDuration:1001/30000};
    for(const order of ['top','bottom','time'])for(const action of ['stagger','sequence']){
      const slots=core.arrangement(models,c,{action,order,anchor:'cursor',frames:5}),byId=new Map(models.map(m=>[m.id,m]));let expected=c.cti;
      for(const slot of slots){const m=byId.get(slot.id);near(m.inPoint+slot.delta,expected);expected+=action==='sequence'?m.outPoint-m.inPoint+5*c.frameDuration:5*c.frameDuration;}
    }
    assert.equal(JSON.stringify(models),before);
  }
});
