'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {fixture} = require('./host-fixture.cjs');

function scene(start) {
  const host = fixture();
  const layer = host.comp.items[0];
  const source = new host.ctx.CompItem();
  source.duration = 12;
  source.id = 456;
  const marker = {protectedRegion:true, duration:0.5};
  source.markerProperty = {numKeys:1, keyTime:()=>start, keyValue:()=>marker};
  layer.source = source;
  const request = {op:'offset',token:host.state().token,ids:[layer.id],mode:'offset',
    region:'after',direction:-1,frames:12,compMarkers:false,preview:true};
  return {host, marker, request};
}

test('offset cannot trim visible protected source time',()=>{
  const {host,request} = scene(5.3);
  const response = host.call(request);
  assert.equal(response.data.preview.blocked,true);
  assert.match(response.data.preview.errors.join(' '),/protected source region/i);
  assert.equal(host.groups(),0);
});
test('a protected region introduced after preview cancels before the first write',()=>{
  const {host,marker,request} = scene(5.5);
  marker.protectedRegion = false;
  const preview = host.call(request).data.preview;
  assert.equal(preview.blocked,false);
  marker.protectedRegion = true;
  const response = host.call({op:'applyPreview',token:request.token,previewId:preview.id});
  assert.equal(response.data.failure.ok,false);
  assert.equal(host.groups(),0);
  assert.equal(host.writes(),0);
});
test('an earlier protected region permits a trim outside the region',()=>{
  const {host,request} = scene(1);
  request.preview = false;
  assert.equal(host.call(request).data.result.ok,true);
  assert.equal(host.comp.items[0].outPoint,5.5);
});

function attachMarker(layer,value) {
  const property=layer.property;
  const marker={numKeys:1,propertyType:1,propertyValueType:11,propertyIndex:2,matchName:'ADBE Marker',
    propertyGroup:()=>layer,keyValue:()=>value,keyTime:()=>5.3,keySelected:()=>false};
  value.getParameters=()=>({});
  layer.property=id=>id==='ADBE Marker'||id===2?marker:property(id);
}

test('instance protection survives a removed source marker and keeps only the affected layer when requested',()=>{
  const {host,marker,request}=scene(1);
  const layer=host.comp.layer(1), other=host.comp.layer(2);
  marker.protectedRegion=false;
  const copy={protectedRegion:true,duration:0.5};
  attachMarker(layer,copy);
  request.mode='edges';
  request.ids.push(other.id);
  assert.equal(host.call(request).data.preview.blocked,true);
  request.skipProtected=true;
  const draft=host.call(request).data.preview;
  assert.equal(draft.blocked,false);
  assert.equal(draft.counts.protectedSkipped,1);
  assert.equal(draft.targets.some(target=>target.layerId===layer.id),false);
  const response=host.call({op:'applyPreview',token:request.token,previewId:draft.id}).data;
  assert.equal(response.warning,true);
  assert.equal(response.result.protectedSkipped,1);
  assert.equal(layer.outPoint,6);
  assert.equal(other.outPoint,7.5);
  assert.equal(copy.duration,0.5);
});

test('a change to the instance protected marker after preview prevents applying a trim',()=>{
  const {host,marker,request}=scene(1);
  const layer=host.comp.layer(1);
  const copy={protectedRegion:false,duration:0.5};
  attachMarker(layer,copy);
  request.mode='edges';
  marker.protectedRegion=false;
  request.skipProtected=true;
  const draft=host.call(request).data.preview;
  copy.protectedRegion=true;
  const response=host.call({op:'applyPreview',token:request.token,previewId:draft.id}).data;
  assert.equal(response.failure.ok,false);
  assert.equal(host.groups(),0);
  assert.equal(layer.outPoint,6);
});
