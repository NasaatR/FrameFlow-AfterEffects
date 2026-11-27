'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{fixture}=require('./host-fixture.cjs');
test('read returns actual metadata without writes or Undo',()=>{const f=fixture(),s=f.state();assert.equal(s.layers.length,2);assert.equal(s.name,'Fixture "Comp"');assert.equal(f.writes(),0);assert.equal(f.groups(),0);});
test('move translates exact target and all its keys once, preserving selection',()=>{const f=fixture(),other=f.comp.items[1];const r=f.action('move',{deltaFrames:12});assert.equal(r.ok,true);assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[0].inPoint,.5);assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),[1.5,2.5,3.5]);assert.equal(other.inPoint,2);assert.equal(f.groups(),1);assert.equal(f.undo(),0);});
test('stale token blocks edits after outside timing changes',()=>{const f=fixture(),s=f.state();f.comp.items[0].inPoint=.1;const before=f.writes();const r=f.call({op:'move',token:s.token,ids:[101],deltaFrames:12});assert.equal(r.ok,false);assert.equal(f.writes(),before);});
test('project identity checked even with reused IDs',()=>{const f=fixture(),s=f.state();f.app.project={activeItem:f.comp,rootFolder:{}};const r=f.call({op:'move',token:s.token,ids:[101],deltaFrames:12});assert.equal(r.ok,false);assert.equal(f.groups(),0);});
test('fresh project wrappers reuse a token for the same active project and composition',()=>{
  const f=fixture(),rootFolder=f.app.project.rootFolder;let projectReads=0;
  Object.defineProperty(f.app,'project',{get(){projectReads++;return {activeItem:f.comp,rootFolder};}});
  const token=f.state().token;
  assert.equal(f.state().token,token);assert.equal(projectReads,2);
});
test('reordered layers invalidate snapshot and cannot retarget by index',()=>{const f=fixture(),s=f.state();f.comp.items.reverse();const r=f.call({op:'move',token:s.token,ids:[101],deltaFrames:12});assert.equal(r.ok,false);assert.equal(f.writes(),0);});
test('locked target blocks the entire native move',()=>{const f=fixture();f.comp.items[1].locked=true;const r=f.action('move',{ids:[101,102],deltaFrames:12});assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),0);});
test('duplicate mutation ID is acknowledged without applying twice',()=>{const f=fixture(),data={op:'move',token:f.state().token,ids:[101],deltaFrames:12};const a=f.call(data,'duplicate'),before=f.writes(),b=f.call(data,'duplicate');assert.deepEqual(b,a);assert.equal(f.writes(),before);const c=f.call({...data,deltaFrames:24},'duplicate');assert.equal(c.ok,false);});
test('trim changes only requested bound and preserves keys',()=>{const f=fixture(),l=f.comp.items[0],before=JSON.stringify(l.keys);const r=f.action('trim',{edge:'out',time:4});assert.equal(r.data.result.ok,true);assert.equal(l.outPoint,4);assert.equal(l.startTime,0);assert.equal(l.inPoint,0);assert.equal(JSON.stringify(l.keys),before);assert.equal(f.groups(),1);});
test('trim failure restores every touched target and closes Undo',()=>{const f=fixture({failSecondTrim:true}),r=f.action('trim',{ids:[101,102],edge:'out',time:4});assert.equal(r.data.failure.error.message,'Injected trim failure');assert.equal(r.data.failure.restored,true);assert.deepEqual(f.comp.items.map(l=>l.outPoint),[6,8]);assert.equal(f.undo(),0);});
test('trim cannot extend finite media or collapse a layer',()=>{const f=fixture();assert.equal(f.action('trim',{edge:'out',time:13}).ok,false);assert.equal(f.action('trim',{edge:'in',time:6}).ok,false);assert.equal(f.writes(),0);});
test('Time Remap supports shortening but blocks extension',()=>{const f=fixture();f.comp.items[0].timeRemapEnabled=true;assert.equal(f.action('trim',{edge:'out',time:7}).ok,false);assert.equal(f.action('trim',{edge:'out',time:4}).data.result.ok,true);});
test('split duplicates animation and trims original and copy',()=>{const f=fixture(),r=f.action('split',{time:4}),a=f.comp.items.find(l=>l.id===101),copy=f.comp.items.find(l=>l.id===103);assert.equal(r.ok,true);assert.equal(r.data.result.ok,true);assert.equal(f.comp.numLayers,3);assert.equal(a.outPoint,4);assert.equal(copy.inPoint,4);assert.equal(copy.outPoint,6);assert.deepEqual(copy.keys,a.keys);assert.equal(a.selected,true);assert.equal(copy.selected,false);assert.equal(f.groups(),1);assert.equal(f.undo(),0);});
test('split blocks parent and matte relationships before mutation',()=>{for(const field of ['hasTrackMatte','isTrackMatte','parent']){const f=fixture();f.comp.items[0][field]=field==='parent'?f.comp.items[1]:true;assert.equal(f.action('split',{time:4}).ok,false);assert.equal(f.writes(),0);}});
test('split blocks layers with children and CTI outside',()=>{const f=fixture();f.comp.items[1].parent=f.comp.items[0];assert.equal(f.action('split',{time:4}).ok,false);const g=fixture();assert.equal(g.action('split',{time:7}).ok,false);assert.equal(g.writes(),0);});
test('preview move has no scene or Undo side effects',()=>{const f=fixture(),r=f.action('move',{deltaFrames:12,preview:true});assert.equal(r.ok,true);assert.equal(r.data.blocked,false);assert.equal(f.writes(),0);assert.equal(f.groups(),0);});
test('unexpected preview on trim is rejected before mutation',()=>{const f=fixture();assert.equal(f.action('trim',{edge:'out',time:4,preview:true}).ok,false);assert.equal(f.writes(),0);});
test('empty explicit target never expands to all layers',()=>{const f=fixture();assert.equal(f.action('move',{ids:[],deltaFrames:12}).ok,false);assert.equal(f.writes(),0);});
test('selection synchronizes by stable ID and allows clearing',()=>{const f=fixture();assert.equal(f.action('select',{ids:[102]}).ok,true);assert.deepEqual(f.comp.selectedLayers.map(l=>l.id),[102]);assert.equal(f.action('select',{ids:[]}).ok,true);assert.equal(f.comp.selectedLayers.length,0);assert.equal(f.groups(),0);});
test('seek updates CTI without modifying layer times',()=>{const f=fixture(),r=f.action('seek',{ids:undefined,time:2});assert.equal(r.ok,true);assert.equal(f.comp.time,2);assert.equal(f.writes(),0);assert.equal(f.groups(),0);});
test('malformed JSON, prototype keys and non-finite values never execute code',()=>{const f=fixture();for(const text of ['{"id":"x", "data": (app.hacked=true)}','{"__proto__":{}}','{"x":1,"x":2}','{"a":1e400}','[1,]','{"a":"\\q"}','null']){const r=f.raw(text);assert.equal(r.ok,false);}assert.equal(f.app.hacked,undefined);assert.equal(f.writes(),0);});
test('unknown command, fields, duplicate IDs, NaN and huge payload are rejected',()=>{const f=fixture();for(const extra of [{op:'execute',code:'app.quit()'},{op:'move',deltaFrames:12,unexpected:1},{op:'move',deltaFrames:12,ids:[101,101]},{op:'move',deltaFrames:null},{op:'move',deltaFrames:1000001}])assert.equal(f.action(extra.op,extra).ok,false);assert.equal(f.raw(' '.repeat(65537)).ok,false);assert.equal(f.writes(),0);});
test('negative and subframe moves preserve fractional timing',()=>{const f=fixture();f.comp.frameDuration=1001/24000;f.comp.items[0].inPoint=.123;const r=f.action('move',{deltaFrames:-2.5});assert.equal(r.data.result.ok,true);assert.ok(Math.abs(f.comp.items[0].inPoint-(.123-2.5*1001/24000))<1e-10);});

function timing(f,extra={}){return f.call({op:'offset',token:f.state().token,scope:'auto',mode:'layers',frames:12,region:'after',direction:1,compMarkers:false,preview:false,...extra});}
function separated(f){f.comp.items[0].inPoint=0;f.comp.items[0].outPoint=2;f.comp.items[1].inPoint=6;f.comp.items[1].outPoint=8;return f;}
for(const region of ['before','after'])for(const direction of [-1,1])test('scope-aware whole-layer command affects only '+region+' with direction '+direction,()=>{const f=separated(fixture()),r=timing(f,{scope:'all',region,direction});assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[0].inPoint,region==='before'?direction*.5:0);assert.equal(f.comp.items[1].inPoint,region==='after'?6+direction*.5:6);assert.equal(f.groups(),1);assert.equal(f.undo(),0);});
test('Auto without selection acts on the entire composition',()=>{const f=separated(fixture());f.comp.items.forEach(l=>l.selected=false);const r=timing(f);assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[1].inPoint,6.5);assert.equal(f.comp.items[0].inPoint,0);});
test('Auto respects actual AE selection and All explicitly ignores it',()=>{const f=separated(fixture());f.comp.items[1].selected=false;const r=timing(f);assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[1].inPoint,6);assert.equal(f.groups(),0);assert.equal(timing(f,{scope:'all'}).data.result.ok,true);assert.equal(f.comp.items[1].inPoint,6.5);});
test('explicit Selected with no selection and explicit empty IDs never expand scope',()=>{const f=fixture();f.comp.items.forEach(l=>l.selected=false);const before=f.writes();assert.equal(timing(f,{scope:'selected'}).ok,false);assert.equal(timing(f,{scope:'auto',ids:[]}).ok,false);assert.equal(f.writes(),before);assert.equal(f.groups(),0);});
test('gap supports Auto with no selection, independently of movement modes and frame step',()=>{const f=separated(fixture());f.comp.items.forEach(l=>l.selected=false);const r=f.call({op:'gap',token:f.state().token,scope:'auto',compMarkers:false});assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[1].inPoint,2);assert.equal(f.comp.items[0].inPoint,0);assert.equal(f.groups(),1);});
test('Auto gap with a selection never widens to unrelated layers',()=>{const f=separated(fixture());f.comp.items[1].selected=false;const before=f.writes();assert.equal(f.call({op:'gap',token:f.state().token,scope:'auto',compMarkers:false}).ok,false);assert.equal(f.writes(),before);});
test('a locked layer on the opposite side cannot block an offset',()=>{const f=separated(fixture());f.comp.items[0].locked=true;const r=timing(f,{scope:'all',mode:'offset'});assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[1].inPoint,6.5);assert.equal(f.comp.items[0].inPoint,0);});
test('a locked relevant target still blocks the entire operation before writes',()=>{const f=separated(fixture());f.comp.items[1].locked=true;const before=f.writes(),r=timing(f,{scope:'all',mode:'offset'});assert.equal(r.data.failure.ok,false);assert.match(r.data.message,/Locked/);assert.equal(f.writes(),before);assert.equal(f.groups(),0);});
test('locked keyless and out-of-side-key layers do not block key-only commands',()=>{const f=fixture();f.comp.time=2;f.comp.items[0].locked=true;f.comp.items[0].keys.splice(0,3,{time:1,value:1,selected:true});const r=timing(f,{scope:'all',mode:'keys'});assert.equal(r.data.result.ok,true);assert.deepEqual(f.comp.items[1].keys.map(k=>k.time),[1,2.5,3.5]);assert.equal(f.comp.items[0].keys[0].time,1);});
test('key-only side boundaries include CTI after and exclude it before',()=>{for(const region of ['before','after']){const f=fixture();f.comp.time=2;f.comp.items[1].selected=false;const r=timing(f,{mode:'keys',region});assert.equal(r.data.result.ok,true);assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),region==='before'?[1.5,2,3]:[1,2.5,3.5]);assert.equal(f.comp.items[0].inPoint,0);assert.equal(f.comp.items[0].outPoint,6);}});

// Reproduce the user's 24 fps / five-frame finite-footage limits.
function mediaScene(region='after'){
  const f=fixture();f.comp.duration=15;f.comp.time=146/24;
  const rows=[[218,318,372],[223,307,352],[265,313,348],[123,223,275],[138,209,257],[170,218,253],[15,115,189],[-9,91,169],[0,71,181],[71,71,192]];
  while(f.comp.items.length<10)f.addLayer(0,8);
  f.comp.items.forEach((l,i)=>{const r=rows[i];l.startTime=r[0]/24;l.inPoint=r[1]/24;l.outPoint=r[2]/24;l.source.duration=i===9?121/24:20;l.selected=false;l.keys.splice(0,l.keys.length,{time:5,value:10,selected:true},{time:7,value:20,selected:false});});
  // This fixture exercises an edge extension outside the limited layer's animation.
  f.comp.items[9].keys[0].time=6.5;
  if(region==='before'){f.comp.items[0].startTime=0;f.comp.items[0].inPoint=1;f.comp.items[0].outPoint=2;}
  return f;
}
function remember(l){return JSON.stringify({start:l.startTime,inPoint:l.inPoint,outPoint:l.outPoint,keys:l.keys});}
for(const [region,direction] of [['after',1],['before',-1]])test('media policy skips only the exhausted layer for reported '+region+' '+direction,()=>{
  const f=mediaScene(region),limited=f.comp.items[9],before=remember(limited),valid=f.comp.items[0],edge=region==='after'?'inPoint':'startTime',old=valid[edge],writes=f.writes();
  const r=timing(f,{mode:'offset',scope:'auto',region,direction,frames:5,mediaPolicy:'skip'});
  assert.equal(r.ok,true);assert.equal(r.data.result.ok,true);assert.equal(r.data.result.mediaSkipped,1);assert.equal(r.data.result.skipped,1);assert.equal(r.data.result.partial,true);assert.ok(r.data.result.changed>0);assert.equal(remember(limited),before);assert.ok(Math.abs(valid[edge]-old-direction*5/24)<1e-10);assert.ok(f.writes()>writes);assert.equal(f.groups(),1);assert.equal(f.undo(),0);assert.match(r.data.message,/без запаса: 1/);assert.match(r.data.report,/MediaPolicy=skip/);
});
test('stop policy and omitted legacy policy still cancel all writes on a media limit',()=>{for(const policy of ['stop',undefined]){const f=mediaScene(),before=f.writes(),r=timing(f,{mode:'offset',scope:'all',frames:5,...(policy?{mediaPolicy:policy}:{})});assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),before);assert.equal(f.groups(),0);assert.match(r.data.report,/Предел исходного медиа/);}});
test('preview shows the allowed media skip without writes or Undo',()=>{const f=mediaScene(),before=f.writes(),r=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'skip',preview:true});assert.equal(r.data.blocked,false);assert.match(r.data.message,/без запаса: 1/);assert.match(r.data.report,/К изменению: 9/);assert.equal(f.writes(),before);assert.equal(f.groups(),0);});
test('media skip does not bypass another relevant locked target',()=>{const f=mediaScene();f.comp.items[0].locked=true;const before=f.writes(),r=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'skip'});assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),before);assert.equal(f.groups(),0);assert.match(r.data.report,/Locked layer/);});
test('only exhausted media is a visible no-op with no Undo group',()=>{const f=mediaScene(),limited=f.comp.items[9];f.comp.items=[limited];const before=remember(limited),writes=f.writes(),r=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'skip'});assert.equal(r.data.result.ok,true);assert.equal(r.data.result.changed,0);assert.equal(r.data.result.mediaSkipped,1);assert.match(r.data.message,/без запаса: 1/);assert.equal(f.groups(),0);assert.equal(f.writes(),writes);assert.equal(remember(limited),before);});
test('invalid media policy is rejected before writing',()=>{const f=mediaScene(),before=f.writes();for(const mediaPolicy of ['ignore',false,null,{}])assert.equal(timing(f,{mode:'offset',mediaPolicy}).ok,false);assert.equal(f.writes(),before);assert.equal(f.groups(),0);});

test('media skip does not bypass an unsupported partial-key target',()=>{const f=mediaScene();f.comp.items[6].property(1).propertyValueType=999;const before=f.writes(),r=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'skip'});assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),before);assert.equal(f.groups(),0);assert.match(r.data.report,/Специальные ключи/);});
test('a write failure still recovers changed targets when another layer is intentionally skipped',()=>{const f=mediaScene(),limited=f.comp.items[9],before=f.comp.items.map(remember);f.injectOffsetFailure();const r=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'skip'});assert.equal(r.data.failure.ok,false);assert.equal(r.data.failure.restored,true);assert.deepEqual(f.comp.items.map(remember),before);assert.equal(remember(limited),before[9]);assert.equal(f.groups(),1);assert.equal(f.undo(),0);});

function previewMove(f,extra={}){return timing(f,{mode:'layers',scope:'all',frames:12,preview:true,...extra});}
function applyPreview(f,p,extra={}){return f.call({op:'applyPreview',token:f.state().token,previewId:p.id,...extra});}
test('structured preview has counts and exact bounds but never serializes native key values',()=>{const f=separated(fixture()),r=previewMove(f),p=r.data.preview;assert.equal(p.counts.layers,1);assert.equal(p.counts.keys,3);assert.equal(p.targets[0].layerId,102);assert.equal(p.targets[0].before.inPoint,6);assert.equal(p.targets[0].after.inPoint,6.5);assert.equal(p.counts.changes,1);assert.equal(p.blocked,false);assert.equal('snapshot'in p.targets[0],false);assert.equal(f.groups(),0);});
test('applying a checked plan uses its captured targets and has one Undo group',()=>{const f=separated(fixture()),p=previewMove(f).data.preview,r=applyPreview(f,p);assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[1].inPoint,6.5);assert.deepEqual(f.comp.items[1].keys.map(k=>k.time),[1.5,2.5,3.5]);assert.equal(f.comp.items[0].inPoint,0);assert.equal(f.groups(),1);assert.equal(f.undo(),0);const writes=f.writes();assert.equal(applyPreview(f,p).ok,false);assert.equal(f.writes(),writes);});
test('cached plan rejects changed CTI, layer scope, source and project before writes',()=>{for(const change of [f=>f.comp.time=7,f=>f.comp.items[0].selected=false,f=>f.comp.items[1].source.duration=11,f=>f.app.project={activeItem:f.comp,rootFolder:{}}]){const f=separated(fixture()),p=previewMove(f).data.preview;change(f);const writes=f.writes(),r=applyPreview(f,p);assert.equal(r.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);}});
test('read recovers when AE invalidates a cached project reference and rejects the old preview',()=>{
  const f=separated(fixture()),writes=f.writes(),preview=previewMove(f).data.preview,token=f.state().token;
  const oldRoot=f.app.project.rootFolder;
  f.app.project={activeItem:f.comp,rootFolder:{}};
  f.ctx.isValid=object=>{if(object===oldRoot)throw Error('Object is invalid');return !!object;};
  assert.notEqual(f.state().token,token);
  assert.equal(applyPreview(f,preview).ok,false);
  assert.equal(f.writes(),writes);assert.equal(f.groups(),0);
  const applied=applyPreview(f,previewMove(f).data.preview);
  assert.equal(applied.ok,true);assert.equal(applied.data.result.ok,true);assert.equal(f.groups(),1);
});
test('a failed read discards the preview even when the same composition returns',()=>{
  const f=separated(fixture()),writes=f.writes(),preview=previewMove(f).data.preview,token=f.state().token;
  f.app.project.activeItem=null;
  assert.equal(f.call({op:'read'}).ok,false);
  f.app.project.activeItem=f.comp;
  assert.notEqual(f.state().token,token);
  assert.equal(applyPreview(f,preview).ok,false);
  assert.equal(f.writes(),writes);assert.equal(f.groups(),0);
});
test('key edits after preview fail native preflight even when metadata token stays unchanged',()=>{for(const change of [k=>k.time+=.1,k=>k.value=99,k=>k.selected=!k.selected]){const f=separated(fixture()),p=previewMove(f).data.preview;change(f.comp.items[1].keys[1]);const writes=f.writes(),r=applyPreview(f,p);assert.equal(r.ok,true);assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);}});
test('preview plans expire after two minutes and a newer preview invalidates the old one',()=>{const f=separated(fixture());let now=Date.now();f.ctx.Date=function(){return new Date(now);};const p=previewMove(f).data.preview;now+=120001;assert.equal(applyPreview(f,p).ok,false);assert.equal(f.groups(),0);const a=previewMove(f).data.preview,b=previewMove(f,{direction:-1}).data.preview;assert.notEqual(a.id,b.id);assert.equal(applyPreview(f,a).ok,false);assert.equal(f.groups(),0);});
test('preview apply duplicate RPC is acknowledged without repeating the mutation',()=>{const f=separated(fixture()),p=previewMove(f).data.preview,data={op:'applyPreview',token:f.state().token,previewId:p.id};const a=f.call(data,'apply-once'),writes=f.writes(),b=f.call(data,'apply-once');assert.deepEqual(a,b);assert.equal(a.data.result.ok,true);assert.equal(f.writes(),writes);assert.equal(f.groups(),1);});
test('gap preview exposes the actual interval and can apply the checked removal',()=>{const f=separated(fixture()),r=f.call({op:'gap',token:f.state().token,scope:'auto',compMarkers:false,preview:true}),p=r.data.preview;assert.equal(p.operation,'gap');assert.equal(p.cti,4);assert.deepEqual(p.gap,{start:2,end:6});assert.equal(p.frames,96);assert.equal(p.delta,-4);assert.equal(f.groups(),0);const applied=applyPreview(f,p);assert.equal(applied.data.result.ok,true);assert.equal(f.comp.items[1].inPoint,2);assert.equal(f.groups(),1);});
test('media policy counts survive preview and applying the captured plan',()=>{const f=mediaScene(),p=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'skip',preview:true}).data.preview;assert.equal(p.counts.layers,9);assert.equal(p.counts.mediaSkipped,1);assert.equal(p.skips.length,1);const original=remember(f.comp.items[9]),r=applyPreview(f,p);assert.equal(r.data.result.ok,true);assert.equal(r.data.result.changed,9);assert.equal(remember(f.comp.items[9]),original);});
test('blocked preview cannot be forced into an edit through applyPreview',()=>{const f=mediaScene(),p=timing(f,{mode:'offset',scope:'all',frames:5,mediaPolicy:'stop',preview:true}).data.preview,writes=f.writes();assert.equal(p.blocked,true);assert.equal(applyPreview(f,p).data.failure.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);});
test('preview target details are bounded while counts cover the whole planned operation',()=>{const f=separated(fixture());for(let i=0;i<104;i++)f.addLayer(6,8);const p=previewMove(f).data.preview;assert.equal(p.counts.layers,105);assert.equal(p.targets.length,100);assert.equal(p.targetsOmitted,5);assert.equal(f.groups(),0);});
test('a failed replacement preview also invalidates the previous cached plan',()=>{const f=separated(fixture()),p=previewMove(f).data.preview;assert.equal(previewMove(f,{frames:0}).ok,false);assert.equal(applyPreview(f,p).ok,false);assert.equal(f.groups(),0);});

function interval(f,extra={}){return f.call({op:'interval',token:f.state().token,action:'insert',frames:12,scope:'all',crossing:'keep',compMarkers:false,preview:true,...extra});}
function animationInterval(){const f=fixture();f.comp.time=2;f.comp.items[0].source.mainSource.isStill=true;f.comp.items[0].keys.splice(0,3,{time:1,value:10,selected:true},{time:3,value:20,selected:false});f.comp.items[1].inPoint=7;f.comp.items[1].outPoint=9;return f;}
test('Insert Time keeps crossing layers intact and moves later video layers natively',()=>{const f=animationInterval(),original=remember(f.comp.items[0]),p=interval(f).data.preview;assert.equal(p.operation,'insertTime');assert.equal(p.counts.keptCrossing,1);assert.equal(p.counts.layers,1);assert.equal(f.groups(),0);const r=applyPreview(f,p);assert.equal(r.data.result.ok,true);assert.equal(remember(f.comp.items[0]),original);assert.equal(f.comp.items[1].inPoint,7.5);assert.equal(f.groups(),1);});
test('Insert Time retimes supported crossing animation and moves later layers exactly once',()=>{const f=animationInterval(),p=interval(f,{crossing:'retime'}).data.preview;assert.equal(p.blocked,false);assert.equal(p.counts.layers,2);const r=applyPreview(f,p);assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[0].startTime,0);assert.equal(f.comp.items[0].inPoint,0);assert.equal(f.comp.items[0].outPoint,6.5);assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),[1,3.5]);assert.equal(f.comp.items[1].inPoint,7.5);assert.equal(f.comp.duration,12);assert.equal(f.groups(),1);});
test('Remove Time preserves all keys and shortens supported crossing animation',()=>{const f=animationInterval(),p=interval(f,{action:'remove',crossing:'retime'}).data.preview;assert.equal(p.blocked,false);assert.equal(p.cti,2);assert.equal(p.interval.end,2.5);const r=applyPreview(f,p);assert.equal(r.data.result.ok,true);assert.equal(f.comp.items[0].outPoint,5.5);assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),[1,2.5]);assert.equal(f.comp.items[1].inPoint,6.5);assert.equal(f.comp.duration,12);assert.equal(f.groups(),1);assert.equal(f.undo(),0);});
test('removal rejects keys at interval start or inside it, and accepts the exclusive end',()=>{for(const time of [2,2.25,2.5]){const f=animationInterval();f.comp.items[0].keys[1].time=time;const writes=f.writes(),p=interval(f,{action:'remove',crossing:'retime'}).data.preview;assert.equal(p.blocked,time!==2.5);if(time!==2.5){assert.equal(applyPreview(f,p).data.failure.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);}else{assert.equal(applyPreview(f,p).data.result.ok,true);assert.deepEqual(f.comp.items[0].keys.map(k=>k.time),[1,2]);}}});
test('crossing moving media and unsupported time mappings are explicit blockers for Retime',()=>{for(const change of [l=>l.source.mainSource.isStill=false,l=>l.hasAudio=true,l=>l.timeRemapEnabled=true,l=>l.stretch=-100,l=>delete l.source.mainSource]){const f=animationInterval();change(f.comp.items[0]);const writes=f.writes(),p=interval(f,{crossing:'retime'}).data.preview;assert.equal(p.blocked,true);assert.equal(applyPreview(f,p).data.failure.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);assert.match(p.skips.join(' '),/split in AE/);}});
test('layers beginning, ending or fully contained in a removal require Keep or manual split',()=>{for(const bounds of [[2.2,6],[0,2.3],[2.1,2.4]]){const f=animationInterval();f.comp.items[0].inPoint=bounds[0];f.comp.items[0].outPoint=bounds[1];const p=interval(f,{action:'remove',crossing:'retime'}).data.preview;assert.equal(p.blocked,true);const keep=interval(f,{action:'remove',crossing:'keep'}).data.preview;assert.equal(keep.blocked,false);assert.equal(keep.counts.keptCrossing,1);assert.equal(f.groups(),0);}});
test('interval bounds, policies and unchecked mutation attempts reject without writes',()=>{const f=animationInterval();const writes=f.writes();for(const extra of [{preview:false},{action:'erase'},{crossing:'split'},{frames:0},{frames:1.5},{frames:1000001},{action:'remove',frames:1000},{scope:'other'}])assert.equal(interval(f,extra).ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);});
test('selected interval scope never expands and empty explicit selection rejects',()=>{const f=animationInterval();f.comp.items[0].selected=false;const p=interval(f,{scope:'selected'}).data.preview;assert.equal(p.counts.layers,1);f.comp.items[1].selected=false;assert.equal(interval(f,{scope:'selected'}).ok,false);assert.equal(f.groups(),0);});
test('kept crossings can be locked; a locked later target blocks the entire interval',()=>{const f=animationInterval();f.comp.items[0].locked=true;assert.equal(interval(f).data.preview.blocked,false);f.comp.items[1].locked=true;const p=interval(f).data.preview;assert.equal(p.blocked,true);assert.equal(applyPreview(f,p).data.failure.ok,false);assert.equal(f.groups(),0);});
test('an added keyed property after interval preview invalidates application',()=>{const f=animationInterval(),l=f.comp.items[0],p=interval(f,{action:'remove',crossing:'retime'}).data.preview,original=l.property,prop={...original(1),propertyIndex:2,matchName:'New Property',keyTime:()=>2.1,keyValue:()=>99,numKeys:1};l.numProperties=2;l.property=id=>id===2?prop:original(id);const writes=f.writes(),r=applyPreview(f,p);assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);});
test('interval preflight retains and checks properties with zero moved keys',()=>{const f=animationInterval();f.comp.items[0].keys.splice(1,1);const p=interval(f,{action:'remove',crossing:'retime'}).data.preview;f.comp.items[0].keys[0].value=99;const writes=f.writes(),r=applyPreview(f,p);assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);});
test('interval native write failure recovers targets and closes the Undo group',()=>{const f=animationInterval(),p=interval(f,{crossing:'retime'}).data.preview,before=f.comp.items.map(remember);f.injectOffsetFailure();const r=applyPreview(f,p);assert.equal(r.data.failure.ok,false);assert.equal(r.data.failure.restored,true);assert.deepEqual(f.comp.items.map(remember),before);assert.equal(f.groups(),1);assert.equal(f.undo(),0);});
test('fractional frame rate and subframe CTI use exact frameDuration for intervals',()=>{const f=animationInterval();f.comp.frameDuration=1001/24000;f.comp.time=2.0125;const p=interval(f,{frames:5,crossing:'retime'}).data.preview;assert.ok(Math.abs(p.delta-5*1001/24000)<1e-12);assert.equal(p.interval.start,2.0125);assert.equal(applyPreview(f,p).data.result.ok,true);assert.ok(Math.abs(f.comp.items[1].inPoint-(7+5*1001/24000))<1e-12);});

function markerProperty(f,entries){const carrier=f.addLayer(0,12),p=carrier.property(1);f.comp.items.pop();carrier.keys.splice(0,carrier.keys.length,...entries.map(([time,duration=0])=>({time,selected:false,value:{comment:'Artist marker',duration,protectedRegion:false,getParameters(){return {};}}})));p.propertyValueType=11;p.matchName='ADBE Marker';return {p,keys:carrier.keys};}
test('interval comp markers move only when opted in, preserving duration and values',()=>{for(const enabled of [false,true]){const f=animationInterval(),m=markerProperty(f,[[1],[4,1]]);f.comp.markerProperty=m.p;const r=interval(f,{compMarkers:enabled,crossing:'retime'});assert.equal(r.ok,true);assert.equal(r.data.preview.blocked,false);const applied=f.call({op:'applyPreview',token:r.data.state.token,previewId:r.data.preview.id});assert.equal(applied.ok,true);assert.equal(applied.data.failure,undefined);assert.deepEqual(m.keys.map(k=>k.time),enabled?[1,4.5]:[1,4]);assert.equal(m.keys[1].value.duration,1);assert.equal(m.keys[1].value.comment,'Artist marker');}});
test('insert blocks duration markers crossing the insertion point before all writes',()=>{for(const placement of ['comp','layer']){const f=animationInterval(),m=markerProperty(f,[[1,2]]);if(placement==='comp')f.comp.markerProperty=m.p;else{const l=f.comp.items[0];l.numProperties=2;const original=l.property;l.property=id=>id===2?m.p:original(id);m.p.propertyIndex=2;m.p.propertyGroup=()=>l;}const writes=f.writes(),r=interval(f,{compMarkers:true,crossing:'retime'});assert.equal(r.ok,true);assert.equal(r.data.preview.blocked,true);assert.match(r.data.report,/duration marker/);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);}});
test('remove blocks point markers in cut and duration markers overlapping either edge',()=>{for(const entries of [[[2.25]],[[1,1.25]],[[2.4,1]]]){const f=animationInterval(),m=markerProperty(f,entries);f.comp.markerProperty=m.p;const writes=f.writes(),r=interval(f,{action:'remove',compMarkers:true,crossing:'retime'});assert.equal(r.data.preview.blocked,true);assert.equal(f.writes(),writes);assert.equal(f.groups(),0);}});
test('new composition markers after interval preview invalidate the plan without a write',()=>{const f=animationInterval(),m=markerProperty(f,[]);f.comp.markerProperty=m.p;const writes=f.writes(),r=interval(f,{compMarkers:true});assert.equal(r.data.preview.blocked,false);m.keys.push({time:3,selected:false,value:{comment:'new',duration:0,getParameters(){return {};}}});const a=f.call({op:'applyPreview',token:r.data.state.token,previewId:r.data.preview.id});assert.equal(a.ok,true);assert.ok(a.data.failure);assert.equal(f.writes(),writes);});
test('interval later-layer movement retains native audio, parent and matte relationships',()=>{const f=animationInterval(),l=f.comp.items[1],parent=f.comp.items[0];l.hasAudio=true;l.parent=parent;l.hasTrackMatte=true;l.trackMatteLayer=parent;const original=l.keys.map(k=>k.time),r=interval(f);const a=f.call({op:'applyPreview',token:r.data.state.token,previewId:r.data.preview.id});assert.equal(a.ok,true);assert.equal(a.data.failure,undefined);assert.equal(l.inPoint,7.5);assert.equal(l.parent,parent);assert.equal(l.trackMatteLayer,parent);assert.deepEqual(l.keys.map(k=>k.time),original.map(t=>t+.5));});
test('English diagnostics preserve artist-authored names and reject unknown language',()=>{const f=fixture();f.comp.name='Маркеры композиции';f.comp.items[0].name='слой';const r=f.raw(JSON.stringify({id:'english:1',version:'2.5.0',language:'en',data:{op:'read'}}));assert.equal(r.ok,true);assert.equal(r.data.state.name,'Маркеры композиции');assert.equal(r.data.state.layers[0].name,'слой');const bad=f.raw(JSON.stringify({id:'english:2',version:'2.5.0',language:'fr',data:{op:'read'}}));assert.equal(bad.ok,false);assert.equal(f.writes(),0);});


for(const region of ['before','after'])for(const preview of [false,true]){
  test('between keys at frame 141: '+region+' -5, preview='+preview,()=>{
    const f=fixture(),l=f.comp.items[0];f.comp.time=141/24;l.outPoint=15;
    l.keys.forEach((k,i)=>{k.time=[120,144,168][i]/24;});
    const stationary=l.keys[region==='after'?0:2];
    const initial=f.writes(),r=timing(f,{mode:'offset',ids:[l.id],region,direction:-1,frames:5,preview});
    if(preview){assert.equal(f.writes(),initial);assert.equal(r.data.preview.targets[0].kind,'property');}
    const applied=preview?applyPreview(f,r.data.preview):r;
    assert.equal(applied.data.result.ok,true);
    assert.deepEqual(l.keys.map(k=>Math.round(k.time*24)),region==='after'?[120,139,163]:[115,144,168]);
    assert.deepEqual([l.startTime,l.inPoint,l.outPoint],[0,0,15]);
    assert.ok(l.keys.includes(stationary));assert.equal(f.groups(),1);
  });
}

test('After -5 moves a later layer and the later keys of a crossing layer in one undo group',()=>{
  const f=fixture(),cross=f.comp.items[0],later=f.comp.items[1];
  f.comp.time=141/24;cross.outPoint=12;later.startTime=7;
  cross.keys.forEach((k,i)=>{k.time=[5,6,7][i];});
  const r=timing(f,{scope:'all',mode:'offset',direction:-1,frames:5});
  assert.equal(r.data.result.ok,true);assert.equal(f.groups(),1);
  assert.equal(later.startTime,7-5/24);assert.equal(cross.outPoint,12);
  assert.deepEqual(cross.keys.map(k=>k.time),[5,6-5/24,7-5/24]);
});

test('between keys, a five-frame collision blocks every layer before writing',()=>{
  const f=fixture(),l=f.comp.items[0];f.comp.time=141/24;
  l.keys.forEach((k,i)=>{k.time=[139,144,168][i]/24;});
  const writes=f.writes(),before=f.comp.items.map(remember);
  const r=timing(f,{scope:'all',mode:'offset',direction:-1,frames:5});
  assert.equal(r.data.failure.ok,false);assert.match(r.data.message,/Коллизия/);
  assert.equal(f.writes(),writes);assert.equal(f.groups(),0);assert.deepEqual(f.comp.items.map(remember),before);
});

for(const dimensions of [2,3])test('separated Position axes are found once through the leader and shifted only after the cursor: '+dimensions+'D',()=>{
  const f=fixture(),layer=f.comp.items[0],axes=[layer,f.comp.items[1],f.addLayer(0,8)].slice(0,dimensions);
  const leader={propertyType:1,propertyIndex:1,propertyGroup:()=>layer,matchName:'ADBE Position',
    propertyValueType:5,isSeparationLeader:true,dimensionsSeparated:true};
  const followers=axes.map((owner,axis)=>Object.assign(owner.property(1),{propertyIndex:axis+2,
    matchName:'ADBE Position_'+axis,isSeparationFollower:true,separationLeader:leader,separationDimension:axis}));
  let lookups=0;
  leader.getSeparationFollower=axis=>{lookups++;assert.ok(axis<dimensions);return followers[axis];};
  layer.threeDLayer=dimensions===3;
  // X appears in the index and selection, other axes are accessible only via the leader.
  layer.numProperties=2;layer.property=id=>id===1||id===leader.matchName?leader:id===2?followers[0]:null;
  f.comp.items=[layer];layer.selectedProperties=[leader,followers[0]];f.comp.time=2.5;
  const r=timing(f,{mode:'offset',frames:5,direction:-1,preview:true});
  assert.equal(r.data.preview.counts.keys,dimensions);assert.equal(r.data.preview.counts.properties,dimensions);
  assert.deepEqual(r.data.preview.targets.map(t=>t.axis),Array.from({length:dimensions},(_,i)=>i));
  const applied=applyPreview(f,r.data.preview);assert.equal(applied.data.result.ok,true);
  for(const owner of axes)assert.deepEqual(owner.keys.map(k=>k.time),[1,2,3-5/24]);
  assert.ok(lookups>0);assert.equal(f.groups(),1);
});
test('properties without Bezier support move with Hold interpolation and retain key labels',()=>{
  const f=fixture(),l=f.comp.items[0],p=l.property(1);f.comp.time=2.5;l.selected=true;f.comp.items[1].selected=false;
  p.isInterpolationTypeValid=type=>type!==f.ctx.KeyframeInterpolationType.BEZIER;
  p.keyInInterpolationType=p.keyOutInterpolationType=()=>3;
  p.setInterpolationTypeAtKey=()=>{throw Error('Hold is already the native interpolation');};
  for(const name of ['keyInTemporalEase','keyOutTemporalEase','keyTemporalContinuous','keyTemporalAutoBezier','setTemporalContinuousAtKey','setTemporalAutoBezierAtKey','setTemporalEaseAtKey'])
    p[name]=()=>{throw Error('Unsupported Bezier access: '+name);};
  l.keys[2].label=7;p.keyLabel=i=>l.keys[i-1].label||0;p.setLabelAtKey=(i,label)=>{l.keys[i-1].label=label;};
  const r=timing(f,{scope:'selected',mode:'offset',frames:5,direction:-1});
  assert.equal(r.data.result.ok,true);assert.deepEqual(l.keys.map(k=>k.time),[1,2,3-5/24]);assert.equal(l.keys[2].label,7);
});

for (const region of ['before','after']) test('In/Out + Keys previews and moves the '+region+' edge and only that side’s keys',()=>{
  const f=fixture(),layer=f.comp.layer(1);
  f.comp.time=2.5;
  const direction=region==='before'?1:-1;
  const request={ids:[layer.id],mode:'edges',frames:6,region,direction};
  assert.match(timing(f,request).error.message,/requires a preview/);
  const r=timing(f,{...request,preview:true});
  assert.equal(r.data.preview.blocked,false);
  const change=r.data.preview.targets[0];
  assert.equal(change.kind,'edge');
  assert.deepEqual(change.before,{start:0,inPoint:0,outPoint:6});
  assert.deepEqual(change.after,{start:0,inPoint:region==='before'?0.25:0,outPoint:region==='after'?5.75:6});
  assert.equal(f.groups(),0);
  assert.equal(applyPreview(f,r.data.preview).data.result.ok,true);
  assert.deepEqual(layer.keys.map(k=>k.time),region==='before'?[1.25,2.25,3]:[1,2,2.75]);
});

test('In/Out + Keys rejects a smaller edge that would hide a key fixed by a label filter',()=>{
  const f=fixture(),layer=f.comp.layer(1),prop=layer.property(1);
  layer.keys[2].time=5.9;
  prop.keyLabel=i=>i===3?5:0;
  prop.setLabelAtKey=()=>{};
  const reply=timing(f,{ids:[layer.id],mode:'edges',frames:12,direction:-1,region:'after',
    labelFilter:'protect',labelIds:[5],preview:true});
  assert.equal(reply.data.preview.blocked,true);
  assert.match(reply.data.preview.skips.join(' '),/hide a visible key/);
  assert.equal(f.groups(),0);
});

test('a property with no keys in scope needs only an endpoint read',()=>{
  const f=fixture(),layer=f.comp.layer(1),prop=layer.property(1);
  let timeReads=0;
  const keyTime=prop.keyTime;
  prop.keyTime=(i)=>{timeReads++;return keyTime(i);};
  const r=timing(f,{ids:[layer.id],mode:'keys',direction:1,region:'after',preview:true});
  assert.equal(r.data.preview.counts.changes,0);
  assert.equal(timeReads,1);
});

function subframeScene() {
  const f=fixture(), edge=f.comp.layer(1), later=f.comp.layer(2), marker=later.property(1);
  f.comp.time=8.125;f.comp.duration=20;
  edge.outPoint=19.997;
  later.startTime=-0.5866666666666667;
  later.inPoint=16.871666666666666;
  later.outPoint=21.246666666666666;
  later.source=null;
  marker.propertyValueType=f.ctx.PropertyValueType.MARKER;
  marker.matchName='ADBE Marker';
  later.keys.splice(0,later.keys.length,{time:18.1234,selected:true,
    value:{comment:'Cue',duration:0.2,protectedRegion:false,getParameters(){return {};}}});
  const quantize=t=>Math.round(t*24576)/24576;
  const request={mode:'offset',region:'after',direction:-1,frames:5,mediaPolicy:'skip'};
  return {f,edge,later,quantize,request};
}

test('the reported AE 27 After -5 accepts subframe rounding on a mixed edge and native layer with a marker',()=>{
  const {f,edge,later,quantize,request}=subframeScene();
  const marker=later.keys[0];
  const originalMarkerTime=marker.time, expectedDelta=-5/24;
  const tail=f.addLayer(13,17);
  f.useNativeTime(quantize);
  const preview=timing(f,{...request,preview:true}).data.preview;
  assert.deepEqual(preview.targets.map(t=>t.kind),['edge','layer','layer']);
  const applied=applyPreview(f,preview).data;
  assert.equal(applied.result?.ok,true,applied.report);
  assert.equal(applied.result.changed,3);
  assert.equal(edge.outPoint,quantize(19.997+expectedDelta));
  assert.equal(later.startTime,quantize(-0.795));
  assert.equal(later.inPoint,16.663330078125);
  assert.equal(later.outPoint,21.038330078125);
  assert.equal(later.keys[0],marker);
  assert.ok(Math.abs(marker.time-(originalMarkerTime+expectedDelta))<0.000005);
  assert.equal(marker.value.comment,'Cue');
  assert.equal(tail.inPoint,quantize(13+expectedDelta));
  assert.equal(f.groups(),1);
  assert.equal(f.undo(),0);
});

test('recovery after an actual write error tolerates native subframe rounding',()=>{
  const {f,edge,later,quantize,request}=subframeScene();
  const marker=later.keys[0],out=later.outPoint,time=marker.time;
  f.useNativeTime(quantize);
  f.injectOffsetFailure();
  const response=timing(f,request).data;
  assert.equal(response.failure.error.message,'Injected offset failure');
  assert.equal(response.failure.restored,true,response.report);
  assert.equal(response.failure.partial,false);
  assert.equal(response.failure.changed,0);
  assert.equal(edge.outPoint,quantize(19.997));
  assert.equal(later.outPoint,quantize(out));
  assert.equal(later.keys[0],marker);
  assert.ok(Math.abs(marker.time-time)<0.000025);
  assert.equal(f.undo(),0);
});

test('a layer rounded to the wrong frame still fails and reports unconfirmed recovery when appropriate',()=>{
  const {f,request}=subframeScene();
  f.useNativeTime(t=>Math.round(t*24)/24);
  const response=timing(f,request).data;
  assert.equal(response.failure.ok,false);
  assert.equal(response.failure.restored,false);
  assert.equal(response.failure.partial,true);
  assert.match(response.message,/Recovery not confirmed/);
  assert.match(response.report,/RECOVERY NOT CONFIRMED|ВОССТАНОВЛЕНИЕ НЕ ПОДТВЕРЖДЕНО/);
  assert.equal(f.undo(),0);
});

test('subframe write tolerance applies to moved keys and leaves preview preflight strict',()=>{
  const f=fixture(),layer=f.comp.layer(1),first=layer.keys[0],middle=layer.keys[1];
  f.comp.time=2.5;layer.keys[2].time=3.001;
  const r={ids:[layer.id],mode:'offset',region:'after',direction:-1,frames:5,preview:true};
  const preview=timing(f,r).data.preview;
  layer.keys[1].time+=0.000003255;
  const expired=applyPreview(f,preview).data;
  assert.equal(expired.failure.ok,false);
  assert.equal(f.groups(),0);
  layer.keys[1].time=2;
  const quantize=t=>Math.round(t*24576)/24576;
  f.useNativeTime(quantize);
  const applied=applyPreview(f,timing(f,r).data.preview).data;
  assert.equal(applied.result?.ok,true,applied.report);
  assert.deepEqual(layer.keys.map(k=>k.time),[1,2,quantize(3.001-5/24)]);
  assert.equal(layer.keys[0],first);
  assert.equal(layer.keys[1],middle);
});

function exhaustedPrecompScene() {
  const f=fixture({clampPrecompEdges:true}), edge=f.comp.layer(1), later=f.comp.layer(2);
  f.comp.duration=20;f.comp.time=179/24;
  edge.outPoint=20;later.startTime=14;
  const source=new f.ctx.CompItem();
  Object.assign(source,{id:771,name:'Source comp',duration:20,frameDuration:1/24});
  edge.source=source;
  edge.keys.forEach((key,index)=>{key.time=10+index;});
  const request={mode:'offset',scope:'auto',frames:5,region:'after',direction:1,mediaPolicy:'skip'};
  return {f,edge,later,source,request};
}

test('After +5 keeps the 20-second exhausted precomp and its keys in place, and moves the other layer',()=>{
  const {f,edge,later,request}=exhaustedPrecompScene(), before=remember(edge), writes=f.writes(), laterStart=later.startTime;
  const preview=timing(f,{...request,preview:true}).data.preview;
  assert.equal(preview.counts.mediaSkipped,1);
  assert.match(preview.skips[0],/исходного прекомпа.*20\.208.*20 s/);
  assert.deepEqual(preview.targets.map(t=>t.layerId),[later.id]);
  assert.equal(f.writes(),writes);
  const applied=applyPreview(f,preview).data;
  assert.equal(applied.result?.ok,true,applied.report);
  assert.equal(applied.result.mediaSkipped,1);
  assert.equal(applied.result.changed,1);
  assert.equal(applied.warning,true);
  assert.equal(remember(edge),before);
  assert.equal(later.startTime,laterStart+5/24);
  assert.equal(f.groups(),1);
  assert.equal(f.undo(),0);
});

test('an exhausted precomp blocks before any write under Cancel All',()=>{
  const {f,request}=exhaustedPrecompScene(), writes=f.writes();
  const response=timing(f,{...request,mediaPolicy:'stop'}).data;
  assert.equal(response.failure.ok,false);
  assert.match(response.message,/исходного прекомпа/);
  assert.equal(response.failure.attempted,0);
  assert.equal(f.writes(),writes);
  assert.equal(f.groups(),0);
});

test('precomp handles use the stretched instance and its start, independent of display start and parent duration',()=>{
  const {f,edge,source,request}=exhaustedPrecompScene();
  f.comp.duration=12;edge.startTime=2;edge.stretch=150;source.duration=8;source.displayStartTime=3600;
  edge.outPoint=14-5/24;
  const result=timing(f,{...request,ids:[edge.id]}).data;
  assert.equal(result.result?.ok,true,result.report);
  assert.equal(result.result.mediaSkipped,0);
  assert.equal(edge.outPoint,14);
  assert.equal(f.comp.duration,12);
  assert.equal(source.duration,8);
});

test('Before -5 checks the head of a precomp, while shortening and whole-layer translation still work',()=>{
  const {f,edge,source,request}=exhaustedPrecompScene();
  edge.startTime=1.25;edge.inPoint=1.25;edge.outPoint=11.25;edge.stretch=50;
  edge.keys.forEach((key,index)=>{key.time=3+index;});
  const before={...request,ids:[edge.id],region:'before',direction:-1};
  const result=timing(f,before).data;
  assert.equal(result.result?.ok,true,result.report);
  assert.equal(result.result.mediaSkipped,1);
  assert.match(result.report,/In запрошен/);
  assert.equal(edge.inPoint,1.25);
  assert.equal(timing(f,{...before,direction:1}).data.result.ok,true);
  assert.equal(edge.inPoint,1.25+5/24);
  f.comp.time=0;
  const move=timing(f,{...request,ids:[edge.id]}).data;
  assert.equal(move.result?.ok,true,move.report);
  assert.equal(move.result.mediaSkipped,0);
  assert.equal(edge.outPoint,11.25+5/24);
  assert.equal(source.duration,20);
});

test('Before +5 at frame 53 can preview skipping two conflicting layers, then apply the same step to the others',()=>{
  const f=fixture(),first=f.comp.layer(1),second=f.comp.layer(2),safe=f.addLayer(0,8);
  f.comp.time=53/24;f.comp.duration=8;
  for (const layer of [first,second]) {
    layer.keys[0].time=50/24;layer.keys[1].time=54/24;layer.keys[2].time=80/24;
  }
  safe.keys[0].time=1/24;safe.keys[1].time=20/24;safe.keys[2].time=30/24;
  const original=[remember(first),remember(second)], writes=f.writes();
  const request={mode:'offset',region:'before',direction:1,frames:5,mediaPolicy:'skip'};
  const blocked=timing(f,request).data;
  assert.equal(blocked.failure.attempted,0);
  assert.equal(blocked.preview.blocked,true);
  assert.equal(blocked.preview.id,null);
  assert.equal(blocked.preview.counts.conflictLayers,2);
  assert.match(blocked.report,/ADBE Opacity.*#1 2\.083333333 s → 2\.291666667 s; #2 2\.25 s → 2\.25 s/);
  assert.match(timing(f,{...request,skipKeyConflicts:true}).error.message,/requires a preview/);

  const retry=timing(f,{...request,preview:true,skipKeyConflicts:true}).data.preview;
  assert.equal(retry.blocked,false);
  assert.equal(retry.counts.conflictLayers,2);
  assert.deepEqual(retry.targets.map(target=>target.layerId),[safe.id]);
  assert.equal(f.writes(),writes);
  assert.equal(f.groups(),0);
  const result=applyPreview(f,retry).data;
  assert.equal(result.result?.ok,true,result.report);
  assert.equal(result.result.conflictSkipped,2);
  assert.equal(result.warning,true);
  assert.deepEqual([remember(first),remember(second)],original);
  assert.equal(safe.inPoint,5*f.comp.frameDuration);
  assert.equal(f.groups(),1);
  assert.equal(f.undo(),0);
});

test('the one-time skip does not bypass locked targets or composition-marker collisions',()=>{
  for(const blockedBy of ['locked','compositionMarkers']){
    const f=fixture(),first=f.comp.layer(1);
    f.comp.time=53/24;
    first.keys[0].time=50/24;first.keys[1].time=54/24;first.keys[2].time=80/24;
    if(blockedBy==='locked')f.comp.layer(2).locked=true;
    else f.comp.markerProperty=markerProperty(f,[[50/24],[54/24]]).p;
    const r=timing(f,{mode:'keys',frames:5,region:'before',direction:1,compMarkers:blockedBy==='compositionMarkers',
      preview:true,skipKeyConflicts:true}).data.preview;
    assert.equal(r.counts.conflictLayers,1);
    assert.equal(r.blocked,true);
    assert.equal(f.writes(),0);
  }
});
