'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../extension/jsx/host.jsx'),'utf8');
function fixture(options={}){
  const hostSource=options.hostSource||source;
  let nextId=100,undo=0,groups=0,writes=0,failed=false,loads=0,failOffset=false;
  const types={OneD:1,TwoD:2,ThreeD:3,TwoD_SPATIAL:4,ThreeD_SPATIAL:5,COLOR:6,LAYER_INDEX:7,MASK_INDEX:8,SHAPE:9,TEXT_DOCUMENT:10,MARKER:11};
  function CompItem(){}const comp=new CompItem();comp.items=[];
  Object.assign(comp,{id:1,name:'Fixture "Comp"',duration:12,frameDuration:1/24,displayStartTime:0,time:4,workAreaStart:0,workAreaDuration:12});
  Object.defineProperties(comp,{numLayers:{get:()=>comp.items.length},selectedLayers:{get:()=>comp.items.filter(l=>l.selected)}});comp.layer=i=>comp.items[i-1];
  function make(inPoint,outPoint,keySource){
    const keys=keySource?keySource.map(k=>({...k})):[1,2,3].map((time,i)=>({time,value:i*10,selected:i===1}));
    let st=0,ip=inPoint,op=outPoint;
    const l={id:++nextId,name:'Layer '+nextId,locked:false,selected:true,enabled:true,label:8,stretch:100,matchName:'ADBE AV Layer',parent:null,hasTrackMatte:false,isTrackMatte:false,timeRemapEnabled:false,
      hasAudio:false,hasVideo:true,source:{id:400,duration:12,mainSource:{isStill:false}},numProperties:1,selectedProperties:[],keys};
    Object.defineProperties(l,{index:{get:()=>comp.items.indexOf(l)+1},startTime:{get:()=>st,set:v=>{writes++;const d=v-st;st=v;ip+=d;op+=d;keys.forEach(k=>k.time+=d);if(failOffset&&l.id===102&&v!==0&&!failed){failed=true;throw Error("Injected offset failure");}}},
      inPoint:{get:()=>ip,set:v=>{writes++;ip=v;}},outPoint:{get:()=>op,set:v=>{writes++;op=v;if(options.failSecondTrim&&l.id===102&&v===4&&!failed){failed=true;throw Error('Injected trim failure');}}}});
    const p={propertyValueType:1,propertyType:1,isSpatial:false,canSetExpression:false,matchName:'ADBE Opacity',propertyIndex:1,name:'Opacity',propertyGroup:()=>l,
      keyTime:i=>keys[i-1].time,keyValue:i=>keys[i-1].value,keySelected:i=>keys[i-1].selected,
      keyInInterpolationType:()=>1,keyOutInterpolationType:()=>1,keyInTemporalEase:()=>[{speed:0,influence:33.333}],keyOutTemporalEase:()=>[{speed:0,influence:33.333}],keyTemporalAutoBezier:()=>false,keyTemporalContinuous:()=>false,
      setValueAtTime:(time,value)=>{writes++;const old=keys.find(k=>k.time===time);if(old)old.value=value;else keys.push({time,value,selected:false});keys.sort((a,b)=>a.time-b.time);},
      removeKey:i=>{writes++;keys.splice(i-1,1);},setSelectedAtKey:(i,value)=>{keys[i-1].selected=value;},setInterpolationTypeAtKey:()=>{},setTemporalAutoBezierAtKey:()=>{},setTemporalContinuousAtKey:()=>{}};
    Object.defineProperty(p,'numKeys',{get:()=>keys.length});l.property=id=>id===1||id==='ADBE Opacity'?p:null;
    l.duplicate=()=>{writes++;const copy=make(ip,op,keys);copy.selected=true;comp.items.splice(comp.items.indexOf(l),0,copy);return copy;};l.remove=()=>{writes++;comp.items.splice(comp.items.indexOf(l),1);};
    return l;
  }
  comp.items.push(make(0,6),make(2,8));
  const app={project:{activeItem:comp},version:'25.6',buildNumber:99,beginUndoGroup:()=>{undo++;groups++;},endUndoGroup:()=>{undo--;}};
  const ctx={app,CompItem,PropertyValueType:types,PropertyType:{PROPERTY:1},KeyframeInterpolationType:{BEZIER:2},KeyframeEase:function(speed,influence){this.speed=speed;this.influence=influence;},$:{os:'Test OS',version:'test'}};
  ctx.$.global=options.detachedGlobal?{}:ctx;
  ctx.File=function(file){this.fsName=file;this.exists=options.missingHost!==true;};
  ctx.$.evalFile=function(file){loads++;if(options.loadError)throw options.loadError;return vm.runInContext(options.evalFileScope==='global'?hostSource:'(function(){\n'+hostSource+'\n}());',ctx,{filename:file.fsName});};
  vm.createContext(ctx);if(!options.unloaded)vm.runInContext(hostSource,ctx);
  let count=0;
  function raw(text){return JSON.parse(ctx.$.global.FrameFlowCEP.dispatch(encodeURIComponent(text)));}
  function call(data,id){return raw(JSON.stringify({id:id||'test:'+(++count),version:'2.4.2',data}));}
  function state(){const r=call({op:'read'});assert.equal(r.ok,true,r.error&&r.error.message);return r.data.state;}
  function action(op,extra={}){return call({op,token:state().token,ids:[101],...extra});}
  return {ctx,comp,app,call,raw,state,action,injectOffsetFailure(){failOffset=true;},addLayer(inPoint,outPoint){const l=make(inPoint,outPoint);comp.items.push(l);return l;},writes:()=>writes,undo:()=>undo,groups:()=>groups,loads:()=>loads};
}
module.exports={fixture};

