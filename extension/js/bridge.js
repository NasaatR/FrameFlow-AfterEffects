(function(root) {
  'use strict';
  const VERSION='2.4.2';
  function uri(value) {return encodeURIComponent(value).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());}
  function encode(request) {return '$.global.FrameFlowCEP.dispatch("'+uri(JSON.stringify(request))+'")';}
  function problem(message,code,stage,op) {const e=Error(message);e.code=code;e.stage=stage;e.operation=op;return e;}
  function create(transport,timeout=15000,language) {
    let pending=false,uncertain=false,count=0,disposed=false;
    const session=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2), timers=new Set(),cancel=new Set();
    function call(data) {
      if(disposed) return Promise.reject(Error('Панель закрыта.'));
      if(pending) return Promise.reject(Error('Дождитесь завершения операции.'));
      if(uncertain&&data.op!=='read') return Promise.reject(Error('Результат предыдущего действия неизвестен. Нажмите «Обновить».'));
      const id=session+':'+(++count), request={id,version:VERSION,data}; if(language)request.language=language(); pending=true;
      return new Promise((resolve,reject)=>{
        let done=false;
        function finish(error,value) {
          if(done)return;done=true;clearTimeout(timer);timers.delete(timer);cancel.delete(abort);pending=false;
          if(error){uncertain=true;reject(error);}else{if(data.op==='read')uncertain=false;resolve(value);}
        }
        function abort(){finish(problem('Панель закрыта.','DISPOSED','rpc',data.op));}
        const timer=setTimeout(()=>finish(problem(data.op==='read'?'AE не ответил на чтение вовремя. Изменения не отправлялись. Нажмите «Обновить».':'AE не ответил вовремя. Операция могла выполниться. Нажмите «Обновить» перед следующим действием.','RPC_TIMEOUT','rpc',data.op)),timeout);
        timers.add(timer);cancel.add(abort);
        try {transport(encode(request),raw=>{
          if(done||disposed)return;
          try {
            if(typeof raw!=='string'||!raw||/^EvalScript error\.?$/i.test(raw)||raw.length>2500000) throw problem('AE не вернул данные FrameFlow. Нажмите «Обновить» для проверки загрузки ядра.','RPC_EMPTY','rpc',data.op);
            let result;
            try{result=JSON.parse(raw);}catch(e){throw problem('AE вернул ответ вне протокола FrameFlow (длина '+raw.length+'). Нажмите «Обновить».','RPC_FORMAT','rpc',data.op);}
            if(!result||result.id!==id||typeof result.ok!=='boolean') throw problem('Ответ AE не соответствует запросу.','RPC_ID','rpc',data.op);
            if(!result.ok) {
              const e=problem(result.error&&result.error.message||'Ошибка AE','HOST_REJECTED','host',data.op);e.host=result.error;
              done=true;clearTimeout(timer);timers.delete(timer);cancel.delete(abort);pending=false;reject(e);return;
            }
            if(!result.data||typeof result.data!=='object') throw problem('В ответе AE нет данных.','RPC_DATA','rpc',data.op);
            finish(null,result.data);
          } catch(e) {finish(e);}
        });}catch(e){finish(problem(e.message||String(e),'RPC_TRANSPORT','rpc',data.op));}
      });
    }
    return {call,get busy(){return pending;},get uncertain(){return uncertain;},dispose(){disposed=true;Array.from(cancel).forEach(fn=>fn());timers.forEach(clearTimeout);timers.clear();}};
  }
  function extensionPath(raw) {
    if(typeof raw!=='string'||!raw||raw.length>16384||/[\x00-\x1f]/.test(raw))throw problem('CEP не сообщил папку расширения.','BOOT_PATH','bootstrap','read');
    // CSInterface's documented URI decoding, plus UNC and already-native paths.
    let value=raw;
    if(/^file:\/\//i.test(value)) {
      value=decodeURI(value);
      if(/^file:\/\/\/[A-Za-z]:\//i.test(value))value=value.slice(8);
      else if(/^file:\/\/\//i.test(value))value=value.slice(7);
      else value='//'+value.slice(7);
    }
    value=value.replace(/\\/g,'/').replace(/\/$/,'');
    if(!/^(?:[A-Za-z]:\/|\/)/.test(value))throw problem('CEP вернул относительный путь расширения.','BOOT_PATH','bootstrap','read');
    return value;
  }
  function bootstrapScript(path) {
    // Only our installed file can be loaded. Arguments are URI literals, never code.
    // All reply strings are URI-encoded: no dependency on JSON in ExtendScript.
    return [
      '(function () {',
      'var stage="probe", f, h, expected="'+VERSION+'";',
      'function q(v) { return "\\\""+encodeURIComponent(String(v))+"\\\""; }',
      'function read(fn) { try { var value=fn(); return value===null || typeof value==="undefined" ? "" : value; } catch (ignored) { return ""; } }',
      // Capture the environment before loading the kernel: failure diagnostics need it too.
      'var ae=read(function(){return app.version;}), build=read(function(){return app.buildNumber;}), os=read(function(){return $.os;}), engine=read(function(){return $.version;});',
      'function reply(ok, message, e) {',
      'var original=e ? String(e.fileName||"").replace(/^.*[\\\\\\/]/,"") : "", scriptId=/^\\d+$/.test(original) ? original : "";',
      'var file=scriptId ? (stage==="load" ? "host.jsx" : "CEP bootstrap") : original;',
      'var fields=[["stage",stage],["message",message||""],["line",e ? (e.line||e.lineNumber||0) : 0],["file",file],["scriptId",scriptId],',
      '["version",h ? h.version||"" : ""],["expected",expected],["namespace",typeof h],["dispatchType",h ? typeof h.dispatch : "undefined"],',
      '["ae",ae],["build",build],["os",os],["engine",engine]], out=["\\\"ok\\\":"+(ok ? "true" : "false")], i;',
      'for (i=0;i<fields.length;i++) out.push(q(fields[i][0])+":"+q(fields[i][1]));',
      'return "{"+out.join(",")+"}";',
      '}',
      'try {',
      'h=$.global.FrameFlowCEP;',
      'if (!h || h.version!==expected || typeof h.dispatch!=="function") {',
      'stage="file"; f=new File(decodeURIComponent("'+uri(path+'/jsx/host.jsx')+'")); f.encoding="UTF-8";',
      'if (!f.exists) throw new Error("Host file missing: host.jsx");',
      'stage="load"; $.evalFile(f); h=$.global.FrameFlowCEP;',
      'stage="verify";',
      'if (!h) return reply(false,"Host namespace not registered in $.global");',
      'if (h.version!==expected) return reply(false,"Host version mismatch: expected "+expected+", received "+String(h.version||"unknown"));',
      'if (typeof h.dispatch!=="function") return reply(false,"Host dispatch is not a function");',
      '}',
      'stage="ready"; return reply(true);',
      '} catch (e) { return reply(false,e.message||e,e); }',
      '}())'
    ].join('\n');
  }
  function createCEP(cep,options={}) {
    const transport=(script,cb)=>cep.evalScript(script,cb),rpc=create(transport,options.timeout||15000,options.language);
    const diagnostics={stage:'not-started',hostVersion:'',environment:null,lastError:null};
    // CEP can identify AE even when the ExtendScript loader itself fails.
    try{const env=JSON.parse(cep.getHostEnvironment());if(typeof env.appVersion==='string')diagnostics.environment={ae:env.appVersion,build:'не получен',os:typeof cep.getOSInformation==='function'?String(cep.getOSInformation()).slice(0,300):'не получена'};}catch(e){}
    let connected=false,boot=null,disposed=false,abortBoot=null;
    function connect() {
      if(boot)return boot;
      diagnostics.stage='bootstrap';
      boot=new Promise((resolve,reject)=>{
        let done=false;
        function finish(e,value){if(done)return;done=true;clearTimeout(timer);abortBoot=null;if(e){connected=false;diagnostics.stage='failed';diagnostics.lastError={code:e.code,stage:e.stage,message:e.message,host:e.host};reject(e);}else{connected=true;diagnostics.stage='ready';diagnostics.lastError=null;resolve(value);}}
        const timer=setTimeout(()=>finish(problem('AE не ответил на проверку загрузчика. Сцена не изменялась. Закройте модальные окна AE и нажмите «Обновить».','BOOT_TIMEOUT','bootstrap','read')),options.bootTimeout||10000);
        abortBoot=()=>finish(problem('Панель закрыта.','DISPOSED','bootstrap','read'));
        try {
          const path=extensionPath(cep.getSystemPath('extension'));
          transport(bootstrapScript(path),raw=>{
            if(done||disposed)return;
            try {
              if(typeof raw!=='string'||raw.length>32000||!raw||/^EvalScript error\.?$/i.test(raw))throw problem('AE не выполнил загрузчик FrameFlow. Нажмите «Обновить».','BOOT_EMPTY','bootstrap','read');
              let result;try{result=JSON.parse(raw);}catch(e){throw problem('AE вернул некорректный ответ загрузчика (длина '+raw.length+').','BOOT_FORMAT','bootstrap','read');}
              if(!result||typeof result.ok!=='boolean')throw problem('Неизвестный ответ загрузчика AE.','BOOT_FORMAT','bootstrap','read');
              for(const key of Object.keys(result))if(typeof result[key]==='string')result[key]=decodeURIComponent(result[key]);
              if(result.ae)diagnostics.environment={ae:result.ae,build:result.build||'не получен',os:result.os||'не получена',engine:result.engine||''};
              if(!result.ok){const e=problem('Не удалось загрузить ядро AE: '+result.message,'BOOT_HOST',result.stage||'load','read');e.host={message:result.message,line:result.line,file:result.file,scriptId:result.scriptId,expectedVersion:result.expected,registeredVersion:result.version,namespace:result.namespace,dispatchType:result.dispatchType};throw e;}
              if(result.version!==VERSION)throw problem('Версии панели и ядра различаются. Переустановите FrameFlow '+VERSION+'.','BOOT_VERSION','probe','read');
              diagnostics.hostVersion=result.version;diagnostics.environment={ae:result.ae,build:result.build,os:result.os,engine:result.engine};finish(null,result);
            }catch(e){finish(e.code?e:problem(e.message||String(e),'BOOT_FORMAT','bootstrap','read'));}
          });
        }catch(e){finish(e.code?e:problem(e.message||String(e),'BOOT_TRANSPORT','bootstrap','read'));}
      }).finally(()=>{boot=null;});
      return boot;
    }
    return {
      async call(data){
        if(disposed)throw Error('Панель закрыта.');
        if(!connected){if(data.op!=='read')throw Error('Сначала нажмите «Обновить» для подключения к AE.');await connect();}
        try{return await rpc.call(data);}catch(e){if(e.code&&e.code!=='HOST_REJECTED'){connected=false;diagnostics.stage='failed';diagnostics.lastError={code:e.code,stage:e.stage,message:e.message};}throw e;}
      },
      get busy(){return !!boot||rpc.busy;},get uncertain(){return rpc.uncertain;},get connected(){return connected;},
      get needsReconnect(){return diagnostics.stage==='failed';},get diagnostics(){return diagnostics;},
      dispose(){disposed=true;if(abortBoot)abortBoot();rpc.dispose();}
    };
  }
  const api={create,createCEP,encode,extensionPath,bootstrapScript,VERSION};
  if(typeof module==='object'&&module.exports) module.exports=api;else root.FFBridge=api;
}(typeof window==='object'?window:this));

