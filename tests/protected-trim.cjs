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
