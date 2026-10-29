'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),C=require('../extension/js/commands.js'),{compileHost}=require('../tools/command-modules.cjs'),{fixture}=require('./host-fixture.cjs'),{analyze}=require('../tools/es3-check.cjs');
const root=path.resolve(__dirname,'..'),context={scope:'auto',mode:'offset',frames:12,compMarkers:false,mediaPolicy:'skip'};
function command(extra={}){return {id:'alignTailButton',op:'alignTail',surface:'toolbar',form:'none',title:['Align tail','Конец к курсору'],args:{},context:['scope'],parameters:[],preview:'required',...extra};}
test('catalogue retains every timing command and builds identical scoped payloads',()=>{
  assert.equal(C.all().length,11);assert.deepEqual(C.build('after-plus',context),{op:'offset',...context,region:'after',direction:1,preview:false});
  assert.deepEqual(C.build('gap',context,{},true),{op:'gap',scope:'auto',compMarkers:false,preview:true});
  assert.deepEqual(C.build('sequence',context,{order:'bottom',anchor:'first',frames:0}),{op:'arrange',scope:'auto',action:'sequence',order:'bottom',anchor:'first',frames:0,preview:true});
  assert.equal(C.title(C.get('insertTime'),'ru'),'Вставить время');
});
test('catalogue rejects duplicate/unknown definitions and data that could alter transport fields',()=>{
  for(const c of [command({id:'gap'}),command({id:'constructor'}),command({op:'../bad'}),command({surface:'unknown'}),command({surface:'menu',group:'missing'}),command({parameters:['op']}),command({args:{token:'x'}}),command({args:{fn(){}}}),command({args:{bad:NaN}}),command({unexpected:1}),command({id:'time-menu'}),command({title:['English only']})])assert.throws(()=>C.create(C.groups(),C.all().concat(c)));
  assert.throws(()=>C.create(C.groups().concat(C.groups()[0]),C.all()));
  assert.throws(()=>C.get('unknown'));assert.throws(()=>C.build('gap',context,{op:'read'}));assert.throws(()=>C.build('sequence',context,{order:'top',anchor:'first',frames:0},false));
});
test('catalogue is isolated from caller mutations and only reads declared context',()=>{
  const a=C.get('gap');a.op='read';a.title[0]='Changed';assert.equal(C.get('gap').op,'gap');
  const c={...context,secret:'not-requested'},r=C.build('gap',c);assert.equal('secret'in r,false);r.scope='all';assert.equal(C.build('gap',c).scope,'auto');
  assert.throws(()=>C.build('gap',{}));assert.throws(()=>C.build('sequence',context,{order:'top',anchor:'cursor',frames:Infinity}));
});
function workspace(){
  fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});const dir=fs.mkdtempSync(path.join(root,'artifacts/command-module-test-'));
  for(const relative of ['src/panel-host.jsxinc','src/commands','extension/js/commands.js','extension/index.html'])fs.cpSync(path.join(root,relative),path.join(dir,relative),{recursive:true});
  return {dir,cleanup(){fs.rmSync(dir,{recursive:true,force:true});}};
}
const newModule='registerPlan("alignTail", function (c,r) {\n schema(r,"|op||token||scope||preview|");\n return FFHost.prepareArrange({scope:r.scope,action:"alignOut",order:"top",anchor:"cursor",frames:1});\n}, false);\n';
function compiled(dir){return '$.global.FrameFlowCEP=(function(){\n'+fs.readFileSync(path.join(root,'extension/js/i18n.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/core.jsxinc'),'utf8')+'\n'+compileHost(dir)+'\nreturn FFCEP;}());';}
test('adding a module joins the same preview, validation, Undo and duplicate-acknowledgement lifecycle',()=>{
  const w=workspace();try{
    fs.writeFileSync(path.join(w.dir,'src/commands/align-tail.jsxinc'),newModule);const hostSource=compiled(w.dir);assert.equal(analyze(hostSource).status,'pass');const f=fixture({hostSource}),token=f.state().token;
    const direct=f.call({op:'alignTail',scope:'auto',preview:false,token});assert.equal(direct.ok,false);assert.equal(f.writes(),0);
    const p=f.call({op:'alignTail',scope:'auto',preview:true,token});assert.equal(p.ok,true);assert.equal(p.data.preview.blocked,false);assert.equal(f.writes(),0);assert.equal(f.groups(),0);
    const payload={op:'applyPreview',previewId:p.data.preview.id,token:p.data.state.token},r=f.call(payload,'custom:apply');assert.equal(r.data.result.ok,true);assert.deepEqual(f.comp.items.map(l=>l.outPoint),[4,4]);assert.equal(f.groups(),1);assert.equal(f.undo(),0);const writes=f.writes();assert.deepEqual(f.call(payload,'custom:apply'),r);assert.equal(f.writes(),writes);
  }finally{w.cleanup();}
});
test('new modules inherit stale-key and locked-target checks without editing dispatcher logic',()=>{
  const w=workspace();try{
    fs.writeFileSync(path.join(w.dir,'src/commands/align-tail.jsxinc'),newModule);const hostSource=compiled(w.dir),f=fixture({hostSource});
    const p=f.call({op:'alignTail',scope:'auto',preview:true,token:f.state().token});f.comp.items[0].keys[0].value=321;
    const r=f.call({op:'applyPreview',previewId:p.data.preview.id,token:p.data.state.token});assert.equal(r.data.failure.ok,false);assert.equal(f.writes(),0);
    const g=fixture({hostSource});g.comp.items[1].locked=true;const blocked=g.call({op:'alignTail',scope:'auto',preview:true,token:g.state().token});assert.equal(blocked.data.preview.blocked,true);assert.equal(g.writes(),0);
  }finally{w.cleanup();}
});
test('build rejects duplicate/missing modules, unresolved insertion and UI identity collisions',()=>{
  for(const mutate of [
    dir=>fs.writeFileSync(path.join(dir,'src/commands/duplicate.jsxinc'),fs.readFileSync(path.join(dir,'src/commands/gap.jsxinc'))),
    dir=>fs.unlinkSync(path.join(dir,'src/commands/gap.jsxinc')),
    dir=>fs.writeFileSync(path.join(dir,'src/panel-host.jsxinc'),'no insertion marker'),
    dir=>fs.writeFileSync(path.join(dir,'src/commands/reserved.jsxinc'),'registerPlan("read", function (c,r) { return null; }, false);'),
    dir=>fs.appendFileSync(path.join(dir,'extension/index.html'),'<button id="time-menu"></button>')
  ]){const w=workspace();try{mutate(w.dir);assert.throws(()=>compileHost(w.dir));}finally{w.cleanup();}}
});
