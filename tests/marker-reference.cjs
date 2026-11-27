'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {fixture} = require('./host-fixture.cjs');

function scenario(markerTimes=[1.5,2.5]) {
  const f=fixture(), source=f.comp.layer(2), target=f.comp.layer(1), original=source.property;
  const marker={get numKeys(){return markerTimes.length;},keyTime:i=>markerTimes[i-1]};
  source.name=target.name;
  source.property=k=>k==='ADBE Marker'?marker:original(k);
  function rpc(op,extra={}) { return f.call({op,token:f.state().token,...extra}); }
  function offset(extra={}) {
    return rpc('offset',{scope:'all',mode:'offset',region:'after',direction:1,
      frames:6,preview:true,compMarkers:false,...extra});
  }
  function bind() {
    const r=rpc('setMarkerReference',{layerId:source.id});
    assert.equal(r.ok,true,r.error?.message);
    return r.data.state.markerReference;
  }
  function apply(preview) { return rpc('applyPreview',{previewId:preview.id}); }
  return {f,source,target,markerTimes,bind,rpc,offset,apply};
}

test('reference selection/clear uses stable layer IDs and never writes scene markers',()=>{
  const s=scenario();
  assert.equal(s.f.state().markerReference,null);
  assert.equal(s.rpc('setMarkerReference',{layerId:s.target.id}).ok,false);
  const ref=s.bind();
  assert.deepEqual(ref,{layerId:s.source.id,name:s.source.name,count:2});
  assert.equal(s.offset({preview:false}).ok,false);
  assert.equal(s.rpc('clearMarkerReference').data.state.markerReference,null);
  assert.equal(s.f.writes(),0);
  assert.deepEqual(s.markerTimes,[1.5,2.5]);
});
test('offset uses all fixed reference markers; keys spanning a marker keep the layer bounds',()=>{
  const s=scenario(); s.bind();
  const planned=s.offset(); assert.equal(planned.ok,true,planned.error?.message);
  assert.equal(planned.data.preview.counts.keys,2);
  assert.equal(planned.data.preview.targets[0].minKeyDelta,0.25);
  assert.equal(planned.data.preview.targets[0].maxKeyDelta,0.5);
  assert.equal(s.f.writes(),0);
  const result=s.apply(planned.data.preview); assert.equal(result.data.result?.ok,true,result.data.message);
  assert.deepEqual(s.target.keys.map(k=>k.time),[1,2.25,3.5]);
  assert.deepEqual([s.target.startTime,s.target.inPoint,s.target.outPoint],[0,0,6]);
  assert.deepEqual(s.source.keys.map(k=>k.time),[1,2,3]);
  assert.equal(s.f.groups(),1);
});
test('Before and After retain the existing exact-boundary rule at every marker',()=>{
  for(const [region,expected] of [['before',[1.25,2,3]],['after',[1.25,2.5,3.5]]]){
    const s=scenario([1,2]); s.bind();
    const preview=s.offset({mode:'keys',region}).data.preview;
    assert.equal(s.apply(preview).data.result?.ok,true);
    assert.deepEqual(s.target.keys.map(k=>k.time),expected);
  }
});
test('moving a reference marker after preview blocks apply before any scene write',()=>{
  const s=scenario(); s.bind(); const preview=s.offset().data.preview;
  s.markerTimes[1]=2.75;
  const response=s.apply(preview);
  assert.equal(response.data.failure?.ok,false);
  assert.match(response.data.message,/marker/i);
  assert.equal(s.f.writes(),0); assert.equal(s.f.groups(),0);
});
test('a removed guide cannot silently turn a marker offset into a cursor offset',()=>{
  const s=scenario(); s.bind(); s.source.remove();
  assert.equal(s.f.state().markerReference.count,0);
  assert.equal(s.offset().ok,false);
  assert.equal(s.rpc('clearMarkerReference').data.state.markerReference,null);
});
test('layer mode anchors at In; crossing offset mode uses half-open Out',()=>{
  const s=scenario([1,2,5]); s.bind();
  s.target.inPoint=2; s.target.outPoint=5;
  const result=s.offset({mode:'layers'}).data.preview.targets[0];
  assert.equal(result.after.start,0.5);
  const change=s.offset().data.preview.targets[0];
  assert.equal(change.kind,'layer'); // In=2 includes the second marker; Out=5 excludes the third.
  assert.deepEqual(change.after,{start:0.5,inPoint:2.5,outPoint:5.5});
});
test('closing marker offsets reject collisions without applying earlier keys',()=>{
  const s=scenario([1.5,2.5]); s.bind();
  const r=s.offset({mode:'keys',direction:-1,frames:24});
  assert.equal(r.data.blocked,true);
  assert.equal(s.apply(r.data.preview).data.failure?.ok,false);
  assert.equal(s.f.writes(),0);
});
