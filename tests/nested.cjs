'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {fixture} = require('./host-fixture.cjs');

function setup() {
  const root = fixture();
  const child = fixture();
  Object.setPrototypeOf(child.comp, root.ctx.CompItem.prototype);
  Object.assign(child.comp,{id:2,name:'Nested source',usedIn:[root.comp],frameDuration:1/30,time:8,displayStartTime:100});
  child.comp.items.length = 1;
  child.comp.items[0].id = 301;
  root.comp.items[0].source = child.comp;
  root.comp.items[0].stretch = 200;
  function preview(extra={}) {
    return root.action('offset',{depth:1,preview:true,mode:'offset',region:'after',direction:-1,frames:6,
      compMarkers:false,mediaPolicy:'skip',...extra});
  }
  function apply(response) {
    assert.equal(response.ok,true,JSON.stringify(response.error));
    assert.equal(response.data.blocked,false,JSON.stringify(response.data.preview));
    return root.call({op:'applyPreview',token:response.data.state.token,previewId:response.data.preview.id});
  }
  return {root,child,preview,apply};
}
function times(f) { return f.comp.items[0].keys.map(k=>k.time); }

test('nested After −6 converts the parent CTI and seconds across 200% stretch and mixed frame rates; host keeps both playheads and instance bounds',()=>{
  const {root,child,preview,apply}=setup();
  const plan=preview();
  assert.equal(plan.ok,true,JSON.stringify(plan));
  assert.deepEqual(plan.data.preview.nestedSources,[{id:2,name:'Nested source',depth:1}]);
  assert.equal(plan.data.preview.targets[0].compId,2);
  assert.equal(plan.data.preview.targets[0].delta,-0.125);
  assert.deepEqual(times(child),[1,2,3]);
  const result=apply(plan);
  assert.equal(result.data.result?.ok,true,JSON.stringify(result.data.failure));
  assert.deepEqual(times(child),[1,1.875,2.875]);
  assert.deepEqual(times(root),[1,2,3]);
  assert.equal(root.comp.layer(1).outPoint,6);
  assert.equal(child.comp.layer(1).outPoint,6);
  assert.equal(root.comp.time,4);assert.equal(child.comp.time,8);
  assert.equal(root.groups(),1);assert.equal(root.undo(),0);assert.equal(child.groups(),0);
});

test('same-source instances are edited once, unselected and differently mapped instances are blocked',()=>{
  const {root,child,preview,apply}=setup();
  root.comp.layer(2).source=child.comp;
  assert.match(preview().error.message,/outside/);
  assert.match(preview({ids:[101,102]}).error.message,/identical source timing/);
  root.comp.layer(2).stretch=200;
  const plan=preview({ids:[101,102]});
  assert.equal(plan.data.preview.nestedSources.length,1);
  assert.equal(apply(plan).data.result.ok,true);
  assert.deepEqual(times(child),[1,1.875,2.875]);
});

test('pre-existing and newly introduced external uses block source writes, including stale preview application',()=>{
  const {root,child,preview,apply}=setup();
  const plan=preview();
  const other=fixture().comp;other.id=100;other.name='Other';other.layer(1).source=child.comp;
  child.comp.usedIn.push(other);
  const r=apply(plan);
  assert.equal(r.data.failure.ok,false);
  assert.match(r.data.failure.error.message,/outside/);
  assert.match(preview().error.message,/outside/);
  assert.equal(root.groups(),0);assert.deepEqual(times(child),[1,2,3]);
});

test('nested source timing changes and protected markers introduced after preview block in preflight',()=>{
  for (const mutation of [child=>{child.comp.frameDuration=1/60;},child=>{
    child.comp.markerProperty={numKeys:1,keyTime:()=>3,keyValue:()=>({protectedRegion:true,duration:1})};
  }]) {
    const {root,child,preview,apply}=setup();const plan=preview();mutation(child);
    assert.equal(apply(plan).data.failure.ok,false);assert.equal(root.groups(),0);
  }
});

test('depth stops at the requested level and unlimited reaches a second stretched source',()=>{
  const {root,child,preview,apply}=setup();
  const grand=fixture().comp;Object.setPrototypeOf(grand,root.ctx.CompItem.prototype);
  Object.assign(grand,{id:3,name:'Grand',usedIn:[child.comp]});
  grand.items.length=1;grand.layer(1).id=401;child.comp.layer(1).source=grand;
  assert.equal(preview().data.preview.nestedSources.length,1);
  const plan=preview({depth:-1});
  assert.deepEqual(plan.data.preview.nestedSources.map(n=>n.id),[2,3]);
  assert.equal(apply(plan).data.result.ok,true);
  assert.deepEqual(grand.layer(1).keys.map(k=>k.time),[1,1.875,2.875]);
  assert.equal(root.groups(),1);
});

test('a whole precomp instance moves natively without moving its source a second time',()=>{
  const {root,child,preview,apply}=setup();root.comp.time=0;
  const plan=preview();
  assert.deepEqual(plan.data.preview.nestedSources,[]);
  assert.equal(apply(plan).data.result.ok,true);
  assert.equal(root.comp.layer(1).startTime,-0.25);
  assert.deepEqual(times(child),[1,2,3]);
});

test('nested preview rejects ambiguous maps and direct writes; depth zero leaves legacy behavior selectable',()=>{
  const {root,child,preview}=setup();
  assert.match(preview({preview:false}).error.message,/preview/);
  assert.equal(preview({depth:0}).data.preview.nestedSources.length,0);
  root.comp.layer(1).timeRemapEnabled=true;
  assert.match(preview().error.message,/unremapped/);
  root.comp.layer(1).timeRemapEnabled=false;root.comp.layer(1).stretch=-100;
  assert.match(preview().error.message,/positive Stretch/);
  assert.deepEqual(times(child),[1,2,3]);assert.equal(root.groups(),0);
});

test('cross-composition failure restores earlier targets and both selections in the single owned undo scope',()=>{
  const {root,child,preview,apply}=setup();
  root.comp.layer(1).keys[2].time=5;
  const later=child.comp.layer(1), prop=later.property(1), original=prop.setValueAtTime;
  let fail=true;later.selected=false;
  prop.setValueAtTime=(...args)=>{later.selected=true;if(fail){fail=false;throw Error('nested failure');}return original(...args);};
  const result=apply(preview());
  assert.equal(result.data.failure.restored,true,JSON.stringify(result.data.failure));
  assert.equal(result.data.failure.selectionRestored,true);
  assert.deepEqual(times(root),[1,2,5]);assert.deepEqual(times(child),[1,2,3]);
  assert.equal(later.selected,false);assert.equal(root.comp.layer(1).selected,true);
  assert.equal(root.groups(),1);assert.equal(root.undo(),0);
});

function useGuide(f,times) {
  const layer=f.addLayer(0,12), property=layer.property;
  layer.property=id=>id==='ADBE Marker'?{numKeys:times.length,keyTime:i=>times[i-1]}:property(id);
  const response=f.call({op:'setMarkerReference',token:f.state().token,layerId:layer.id});
  assert.equal(response.ok,true,response.error?.message);
  return layer;
}

test('marker offsets recurse through Stretch and retain the contribution of markers outside the instance',()=>{
  const {root,child,preview,apply}=setup();
  root.comp.layer(1).inPoint=2;
  useGuide(root,[1,3,5]);
  const plan=preview({direction:1});
  assert.equal(plan.ok,true,plan.error?.message);
  assert.equal(plan.data.preview.markerReference.count,3);
  assert.equal(plan.data.preview.nestedSources[0].id,2);
  const target=plan.data.preview.targets.find(t=>t.compId===2);
  assert.equal(target.minKeyDelta,0.125);
  assert.equal(target.maxKeyDelta,0.375);
  assert.equal(apply(plan).data.result.ok,true);
  assert.deepEqual(times(child),[1.125,2.25,3.375]);
  assert.equal(root.comp.layer(1).inPoint,2);
  assert.equal(root.comp.layer(1).outPoint,6);
  assert.equal(root.groups(),1);
});

test('a guide precomp stays outside the recursive target set',()=>{
  const {root,child,preview,apply}=setup();
  const guide=useGuide(root,[1,3]);
  guide.source=child.comp;
  assert.match(preview({ids:[101,guide.id]}).error.message,/outside/);
  assert.deepEqual(times(child),[1,2,3]);
  assert.equal(root.groups(),0);
  root.comp.layer(1).source=guide; // The child source is only used by the guide now.
  const response=preview({ids:[101,guide.id]});
  assert.deepEqual(response.data.preview.nestedSources,[]);
  assert.equal(apply(response).data.result.ok,true);
  assert.deepEqual(times(child),[1,2,3]);
});

test('changing a root reference marker invalidates the captured nested plan before any write',()=>{
  const {root,child,preview,apply}=setup(), boundaries=[1,3,5];
  useGuide(root,boundaries);
  const plan=preview({direction:1});
  assert.equal(plan.data.preview.blocked,false);
  boundaries[1]=3.125;
  assert.match(apply(plan).data.failure.error.message,/markers moved/i);
  assert.deepEqual(times(child),[1,2,3]);
  assert.equal(root.groups(),0);
});

test('the hierarchy lists direct and deeper sources, including duplicate uses, before an offset is planned',()=>{
  const {root,child}=setup();
  const grand=fixture().comp;Object.setPrototypeOf(grand,root.ctx.CompItem.prototype);
  grand.id=3;grand.name='Grand';
  root.comp.layer(2).source=child.comp;
  child.comp.layer(1).source=grand;
  const result=root.call({op:'inspectPrecomps',scope:'all',token:root.state().token});
  assert.equal(result.ok,true);
  assert.deepEqual(result.data.hierarchy.rows.map(r=>[r.depth,r.source,r.shared]),[
    [1,'Nested source',false],[1,'Nested source',true],[2,'Grand',false]
  ]);
  assert.equal(root.writes(),0);
});

test('a nested target that loses precomp handles after preview is rejected before any write',()=>{
  const {root,child,preview,apply}=setup(),layer=child.comp.layer(1);
  const source=new root.ctx.CompItem();
  Object.assign(source,{id:5,duration:12,frameDuration:1/30});
  layer.source=source;
  layer.keys.forEach((key,index)=>{key.time=3+index;});
  const planned=preview({direction:1});
  assert.equal(planned.data.preview.targets.some(t=>t.compId===2&&t.kind==='edge'),true);
  source.duration=6;
  const response=apply(planned).data;
  assert.equal(response.failure.ok,false);
  assert.match(response.message,/Source handles changed/);
  assert.equal(root.groups(),0);
  assert.equal(layer.outPoint,6);
});
