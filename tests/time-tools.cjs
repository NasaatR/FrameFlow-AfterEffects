'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture}=require('./host-fixture.cjs');
const {parseFrameStep}=require('../extension/js/model.js');
test('frame-step calculator uses bounded arithmetic and whole results',()=>{
  for(const [input,result] of [['(24 + 6) / 2',15],['1+2*3',7],['8/4*3',6],['.5*6',3],['−2 + 7',5],['3+(-1)',2],['(0.1+0.2)*10',3]])assert.equal(parseFrameStep(input),result);
  for(const input of ['','1/0','1/2','1e2','1;2','app.quit()','3**2','6 7','0','(2+4','1000001','9007199254740992-9007199254740990','1'.repeat(97)])assert.throws(()=>parseFrameStep(input),undefined,input);
});
test('measurement separates layer extent from gap/overlap, selected keys override layer bounds',()=>{
  const f=fixture(),[a,b]=f.comp.items,call=()=>f.call({op:'measureTime',token:f.state().token}).data.measurement;
  assert.deepEqual(call(),{kind:'layers',start:0,end:8,frames:192,seam:{kind:'overlap',frames:96}});
  b.inPoint=7;assert.deepEqual(call().seam,{kind:'gap',frames:24});
  const p=a.property(1);a.selectedProperties=[p];p.selectedKeys=[1,3];
  assert.deepEqual(call(),{kind:'keys',start:1,end:3,frames:48,seam:null});
  p.selectedKeys=[2];assert.deepEqual(call(),{kind:'cursorKey',start:2,end:4,frames:48,seam:null});
  assert.equal(f.groups(),0);
});
test('work area follows cursor in either direction, rejects stale authorship and restores on partial failure',()=>{
  const f=fixture(),c=f.comp;
  const zone=(endFrame,baseToken)=>{const token=f.state().token;return f.call({op:'setZone',token,baseToken:baseToken||token,endFrame});};
  assert.equal(zone(24).data.result.ok,true);assert.equal(c.workAreaStart,1);assert.equal(c.workAreaDuration,3);assert.equal(c.time,4);
  assert.equal(zone(24).data.result.changed,0);assert.equal(f.groups(),1);
  const old=f.state().token;c.time=5;assert.equal(zone(200,old).ok,false);
  assert.equal(zone(240).data.result.ok,true);assert.equal(c.workAreaStart,5);assert.equal(c.workAreaDuration,5);
  let duration=c.workAreaDuration,fail=true;
  Object.defineProperty(c,'workAreaDuration',{get:()=>duration,set(value){duration=value;if(fail){fail=false;throw Error('Injected work area failure');}}});
  const result=zone(48).data.failure;assert.equal(result.restored,true);assert.match(result.error.message,/Injected/);
  assert.equal(c.workAreaStart,5);assert.equal(duration,5);assert.equal(f.undo(),0);
});
test('counter advances once per confirmed directional edit, never on preview, no-op, replay or non-offset commands',()=>{
  const f=fixture(),a=f.comp.items[0];
  f.comp.time=1.5;const shift=(direction,preview=false)=>({op:'offset',token:f.state().token,ids:[a.id],mode:'keys',region:'after',direction,frames:5,compMarkers:false,preview});
  const request=shift(-1,true);const preview=f.call(request);
  assert.equal(preview.data.state.offsetCounter,0);
  const apply={op:'applyPreview',token:request.token,previewId:preview.data.preview.id};
  assert.equal(f.call(apply,'counter-apply').data.state.offsetCounter,-5);
  assert.equal(f.call(apply,'counter-apply').data.state.offsetCounter,-5);
  assert.equal(f.call(shift(1)).data.state.offsetCounter,0);
  f.comp.time=11;assert.equal(f.call(shift(-1)).data.state.offsetCounter,0);
  f.comp.time=1.5;assert.equal(f.call(shift(1)).data.state.offsetCounter,5);
  assert.equal(f.action('move',{deltaFrames:2}).data.state.offsetCounter,5);
  const token=f.state().token;assert.equal(f.call({op:'resetCounter',token,baseToken:token}).data.state.offsetCounter,0);
  assert.equal(f.call(shift(1)).data.state.offsetCounter,5);
  f.app.project.rootFolder={};assert.equal(f.state().offsetCounter,0);
});
