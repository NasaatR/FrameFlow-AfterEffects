'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {fixture} = require('./host-fixture.cjs');

function scene() {
  const f = fixture();
  f.comp.time = 1.5;
  for (const layer of f.comp.items) {
    const prop = layer.property(1);
    layer.keys.forEach((k, i) => { k.label = [0, 2, 7][i]; });
    prop.keyLabel = i => layer.keys[i-1].label;
    prop.setLabelAtKey = (i, label) => { layer.keys[i-1].label = label; };
  }
  return f;
}

function offset(f, args) {
  const response = f.call({op:'offset', token:f.state().token, ids:[101], mode:'offset', region:'after', direction:-1, frames:5,
    compMarkers:false, mediaPolicy:'skip', ...args});
  assert.equal(response.ok, true, JSON.stringify(response.error));
  return response.data;
}

function assign(f, label) {
  return f.call({op:'labelSelectedKeys', token:f.state().token, label}).data;
}

test('After -5 from between keys honors both protected labels and inverse labels', () => {
  for (const [filter, movedIndex] of [['protect',2],['only',1]]) {
    const f = scene(), layer = f.comp.items[0];
    const {result} = offset(f, {labelFilter:filter, labelIds:[2]});
    assert.equal(result.ok, true);
    assert.equal(result.movedKeys, 1);
    assert.deepEqual(layer.keys.map(k => k.time), [1, 2, 3].map((t,i) => i === movedIndex ? t - 5/24 : t));
    assert.deepEqual(layer.keys.map(k => k.label), [0,2,7]);
    assert.equal(layer.outPoint, 6);
  }
});

test('a native whole-layer shift cannot indirectly move a protected key', () => {
  for (const mode of ['offset','layers']) {
    const f = scene(), layer = f.comp.items[0];
    f.comp.time = 0;
    const {result} = offset(f, {mode,labelFilter:'protect', labelIds:[0]});
    assert.equal(result.ok, true);
    assert.equal(result.movedKeys, mode === 'offset' ? 2 : 0);
    assert.equal(layer.keys[0].time, 1);
    assert.equal(layer.startTime, 0);
    assert.equal(layer.outPoint, 6);
  }
});

test('intentional layer exclusions work in strict mode without bypassing key collisions', () => {
  for (const [flag,field,val] of [['skipLocked','locked',true],['skipDisabled','enabled',false]]) {
    const f = scene();
    f.comp.items[0][field] = val;
    const {result} = offset(f, {ids:[101,102], mode:"keys", [flag]:true});
    assert.equal(result.ok,true); assert.equal(result.skipped,1); assert.equal(result.movedKeys,2);
    assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),[1,2,3]);
  }
  const f = scene();
  f.comp.items[0].locked = true;
  assert.equal(offset(f,{ids:[101,102],mode:"keys",skipLocked:true,frames:24}).failure.ok,false);
  assert.equal(f.groups(),0);
});

test('unsupported-property opt-out keeps supported sibling animation actionable', () => {
  const f = scene(), layer = f.comp.items[0], supported = layer.property(1);
  const special = {propertyIndex:2, propertyType:1, propertyValueType:999, matchName:'Custom Value',numKeys:1,keyTime:()=>2,propertyGroup:()=>layer};
  layer.property = id => id === 2 || id === 'Custom Value' ? special : id === 1 || id === supported.matchName ? supported : null;
  layer.numProperties = 2;
  const {result} = offset(f,{skipUnsupported:true});
  assert.equal(result.ok,true); assert.equal(result.skipped,1); assert.equal(result.movedKeys,2);
  assert.equal(layer.keys[2].time,3-5/24);
});

test('disabled properties are excluded even on enabled layers', () => {
  const f = scene(), prop = f.comp.items[0].property(1);
  prop.enabled=false; prop.canSetEnabled=true;
  const {result} = offset(f,{ids:[101,102],mode:'keys',skipDisabled:true});
  assert.equal(result.skipped,1); assert.equal(result.movedKeys,2);
  assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),[1,2,3]);
});

test('label changes after preview require a fresh preview before writing', () => {
  const f = scene(), layer = f.comp.items[0];
  const {preview,state} = offset(f,{preview:true,mode:'keys',labelFilter:'only',labelIds:[2]});
  layer.keys[2].label = 2;
  const {failure} = f.call({op:'applyPreview',token:state.token,previewId:preview.id}).data;
  assert.equal(failure.ok,false); assert.equal(f.groups(),0);
});

test('assigning zero labels key selection across layers and avoids empty undo groups', () => {
  const f = scene();
  const first = assign(f,0).result;
  assert.equal(first.ok,true); assert.equal(first.changed,2); assert.equal(f.groups(),1);
  for (const l of f.comp.items) assert.deepEqual(l.keys.map(k=>k.label),[0,0,7]);
  assert.equal(assign(f,0).result.changed,0); assert.equal(f.groups(),1);
  for(const l of f.comp.items) for(const k of l.keys) k.selected=false;
  assert.match(assign(f,1).failure.error.message,/select/i); assert.equal(f.groups(),1);
});

test('label command rolls back even when AE changes a label then raises', () => {
  const f = scene(), prop = f.comp.items[1].property(1), set = prop.setLabelAtKey;
  prop.setLabelAtKey = (i,label) => { set(i,label); if(label === 8) throw Error('Injected label write'); };
  const r = assign(f,8);
  assert.equal(r.failure.ok,false); assert.match(r.failure.error.message,/Injected label write/);
  assert.equal(r.failure.partial,false); assert.equal(f.undo(),0);
  for(const l of f.comp.items) assert.deepEqual(l.keys.map(k=>k.label),[0,2,7]);
});

test('label availability, valid IDs and locked target checks precede every write', () => {
  const f = scene(), prop = f.comp.items[0].property(1);
  f.comp.items[1].locked=true;
  assert.match(assign(f,1).failure.error.message,/locked/); assert.equal(f.groups(),0);
  delete prop.keyLabel;
  assert.equal(offset(f,{labelFilter:'only',labelIds:[2]}).failure.ok,false);
  for (const extra of [{labelFilter:'only',labelIds:[]},{labelIds:[0,0]},{labelIds:[17]},{skipLocked:'true'}]) {
    const r=f.call({op:'offset',token:f.state().token,scope:'all',mode:'keys',frames:5,compMarkers:false,region:'after',direction:-1,...extra});
    assert.equal(r.ok,false);
  }
  assert.equal(f.groups(),0);
});
