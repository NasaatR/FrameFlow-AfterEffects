/* Explicit read-only browser demo. Never selected as a fallback for AE failures. */
(function(root){
  'use strict';
  function create(){
    const s={version:'2.4.2',token:'demo:1',compId:1,name:'Пример композиции',duration:12,frameDuration:1/24,displayStart:0,time:4,workStart:0,workDuration:12,environment:{ae:'Демо — AE не подключён',build:'—',os:'Browser'},layers:[{id:101,name:'Пример слоя',start:0,inPoint:0,outPoint:2,stretch:100,selected:false},{id:102,name:'Пример слоя 2',start:0,inPoint:6,outPoint:10,stretch:100,selected:false}]};
    function state(){return JSON.parse(JSON.stringify(s));}
    return {get busy(){return false;},get uncertain(){return false;},dispose(){},async call(r){
      if(r.op==='read')return {state:state()};
      return {state:state(),message:'Демо интерфейса · операции выполняются только в After Effects',report:'FrameFlow 2.4.2 · ДЕМО\nДействие: '+r.op+'\nОбласть: '+r.scope+'\nЭто пример интерфейса. Слои, ключи и Undo в браузере не моделируются.'};
    }};
  }
  root.FFDemo={create};
}(window));

