(function(){
  'use strict';
  const M=FFModel,C=FFCommands,U=FFUI,$=id=>document.getElementById(id),icons=U.icon;
  const commandList=C.all(),commandGroups=C.groups(),shiftCommands=commandList.filter(c=>c.surface==='shift'),toolbarCommands=commandList.filter(c=>c.surface==='toolbar'),previewCommands=commandList.filter(c=>c.preview==='optional'&&c.form==='none');
  const groupedCommands=new Map(commandGroups.map(g=>[g.id,commandList.filter(c=>c.group===g.id)]));
  const appearanceKeys=new Set(['fontSize','rowHeight','spacing','radius','font','theme','accent','motion','contrast','language']);
  let prefs,preferenceStore,saveTimer=null,saveError='',state=null,bridge=null,isDemo=false,disposed=false,pollTimer=null,busy=false,menuOwner=null,dialogFocus=null,lastReport='',history=[],readFailures=0,connectionFailed=false,frameDraft=false,quickDraft=null,activePreview=null,statusRaw='',dialogRevision=0;
  const t=(en,ru)=>prefs.language==='ru'?ru:en,D=text=>FFText.message(text,prefs.language);
  const modeNames=()=>({offset:t('Layers + Keys','Слои и ключи'),layers:t('Whole Layers','Слои целиком'),keys:t('All Keys','Все ключи'),selectedKeys:t('Selected Keys','Выделенные ключи')});
  const modeNotes=()=>({offset:t('Between keys, shift only keys on the chosen side. Otherwise shift that side’s layers or crossing edges.','Между ключами сдвигаются только ключи выбранной стороны. В остальных случаях сдвигаются слои или их края.'),layers:t('Move the entire layer with all keys. The side is determined by its In point.','Перенос целого слоя со всеми ключами. Сторона определяется по In.'),keys:t('Move keys on the chosen side. Layer bounds stay unchanged.','Перенос ключей выбранной стороны без изменения границ слоя.'),selectedKeys:t('Only selected AE keys on the chosen side.','Только выделенные в AE ключи на выбранной стороне.')});
  const scopeNames=()=>({auto:t('Auto','Авто'),selected:t('Selected','Выделенные'),all:t('All Layers','Все слои')});
  const arrangeNames=()=>Object.fromEntries(C.inGroup('arrange').filter(c=>c.form==='arrange').map(c=>[c.args.action,C.title(c,prefs.language)]));
  const orderNames=()=>({top:t('Top → Bottom','Сверху вниз'),bottom:t('Bottom → Top','Снизу вверх'),time:t('Start Time','По началу')});
  let arrangeOrder='top',arrangeAnchor='cursor',sequenceGap=0;
  function word(n,one,many,ruOne,ruFew,ruMany){if(prefs.language!=='ru')return n===1?one:many;const a=Math.abs(n)%100,b=a%10;return a>10&&a<20?ruMany:b===1?ruOne:b>=2&&b<=4?ruFew:ruMany;}
  function frameWord(n){return word(n,'frame','frames','кадр','кадра','кадров');}
  const esc=U.escape;
  function status(text,error,warning){statusRaw=text;$('status').textContent=D(text);$('status').title=D(text);$('status-icon').classList.toggle('error',!!error);$('status-icon').classList.toggle('warning',!!warning&&!error);}
  function log(op,detail){history.push(new Date().toISOString()+' '+op+' '+String(detail||'').slice(0,350));if(history.length>40)history.shift();}
  function reportText(){const d=bridge&&bridge.diagnostics,env=state?state.environment:d&&d.environment;return 'FrameFlow '+M.VERSION+'\n'+(isDemo?t('DEMO · AE disconnected\n','ДЕМО · AE не подключён\n'):'')+(env?'AE '+env.ae+' / build '+env.build+'\nOS '+env.os+'\n'+(env.engine?'ExtendScript '+env.engine+'\n':''):t('AE: no confirmed connection\n','AE: нет подтверждённого соединения\n'))+(state?'Comp ID '+state.compId+' / FPS '+Number((1/state.frameDuration).toFixed(3))+' / CTI '+state.time+'\n':'')+t('Scope: ','Область: ')+prefs.scope+' / '+t('mode: ','режим: ')+prefs.mode+' / '+t('step: ','шаг: ')+prefs.frames+' / '+t('media: ','исходник: ')+prefs.mediaPolicy+'\n'+(d?t('Loader: ','Загрузчик: ')+d.stage+t(' / core: ',' / ядро: ')+(d.hostVersion||t('unconfirmed','не подтверждено'))+'\n':'')+(connectionFailed?t('Auto refresh paused until Refresh.\n','Автообновление приостановлено до «Обновить».\n'):'')+'\n'+D(lastReport)+'\n\n'+t('Recent events:\n','Последние события:\n')+D(history.join('\n'));}
  function preferenceError(message){saveError=message;status(message,true);const node=$('settings-status');if(node)node.textContent=D(message);}
  function persist(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{preferenceStore.save(prefs);saveError='';if($('settings-status'))$('settings-status').textContent=t('Settings saved.','Настройки сохранены.');}catch(e){preferenceError(e.message);}},220);}
  function change(key,value){try{const next=M.validate(Object.assign({},prefs,{[key]:value})),a=prefs[key],b=next[key],same=Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>v===b[i]):a===b;if(same){render();return true;}prefs=next;if(appearanceKeys.has(key))applyAppearance();persist();if(key==='quickSteps'||key==='language')renderPresets();render();if(key==='autoRefresh'||key==='poll')schedulePoll();return true;}catch(e){status(e.message,true);return false;}}
  function applyAppearance(){const style=document.documentElement.style;for(const [key,css,unit]of[['fontSize','font-size','px'],['rowHeight','row','px'],['spacing','gap','px'],['radius','radius','px']])style.setProperty('--'+css,prefs[key]+unit);style.setProperty('--font',prefs.font==='mono'?'"SFMono-Regular",Consolas,monospace':prefs.font==='sans'?'Arial,"Helvetica Neue",sans-serif':'system-ui,-apple-system,"Segoe UI",sans-serif');let light=prefs.theme==='light';if(prefs.theme==='host'&&window.__adobe_cep__){try{const c=JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo.panelBackgroundColor.color;light=c.red+c.green+c.blue>420;}catch(e){}}const accent=M.accentFor(prefs.accent,light);style.setProperty('--accent',accent);style.setProperty('--selected','rgba('+[1,3,5].map(n=>parseInt(accent.slice(n,n+2),16)).join(',')+',.13)');document.body.classList.toggle('light',light);document.body.classList.toggle('motion',prefs.motion);document.body.classList.toggle('high-contrast',prefs.contrast==='high');document.documentElement.setAttribute('lang',prefs.language);}
  function ready(){return !!state&&!busy&&!connectionFailed&&!bridge.uncertain;}
  function validateState(s){if(!s||s.version!==M.VERSION||typeof s.token!=='string'||!s.environment||!Array.isArray(s.layers)||s.layers.length>2000||!Number.isFinite(s.duration)||s.duration<=0||!Number.isFinite(s.frameDuration)||s.frameDuration<=0||!Number.isFinite(s.time))throw Error(t('Invalid composition state from AE.','Некорректное состояние композиции от AE.'));const ids=new Set();s.layers.forEach(l=>{if(!Number.isInteger(l.id)||ids.has(l.id)||typeof l.name!=='string'||![l.start,l.inPoint,l.outPoint,l.stretch].every(Number.isFinite))throw Error(t('Invalid layer data.','Некорректные данные слоя.'));ids.add(l.id);});}
  function accept(s){validateState(s);state=s;}
  function renderPresets(){$('presets').innerHTML=prefs.quickSteps.map(n=>'<button data-step="'+n+'" title="'+n+' '+frameWord(n)+'">'+n+'</button>').join('');$('presets').querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>setFrames(Number(b.dataset.step)));}
  function validFrames(){const raw=String($('frames').value).trim(),n=Number(raw);return /^\d+$/.test(raw)&&Number.isInteger(n)&&n>=1&&n<=1000000;}
  function readFrames(){if(!validFrames())throw Error(t('Enter 1–1000000 whole frames.','Введите от 1 до 1000000 целых кадров.'));return Number($('frames').value);}
  function setFrames(n){n=Math.max(1,Math.min(1000000,n));frameDraft=false;$('frames').value=String(n);$('frames').setAttribute('aria-invalid','false');change('frames',n);}
  function directionLabel(region,direction){return (region==='before'?t('Before cursor','До курсора'):t('After cursor','После курсора'))+' · '+(direction>0?'+':'−')+prefs.frames+' '+frameWord(prefs.frames);}
  function render(){
    const r=ready(),selected=M.selected(state).length,any=!!state&&(prefs.scope!=='selected'?state.layers.length>0:selected>0),valid=validFrames(),eligibility={ready:r,any,valid};
    $('app').setAttribute('aria-busy',String(busy));
    document.querySelectorAll('[data-en]').forEach(el=>{U.text(el,el.getAttribute(prefs.language==='ru'?'data-ru':'data-en'));});
    document.querySelectorAll('[data-label-en]').forEach(el=>{const label=el.getAttribute(prefs.language==='ru'?'data-label-ru':'data-label-en');U.attribute(el,'aria-label',label);if(el.title!==label)el.title=label;});
    if(!frameDraft&&document.activeElement!==$('frames'))$('frames').value=prefs.frames;
    $('frame-slider').value=Math.min(120,prefs.frames);$('frame-slider').title=t('Quick range: 1–120 frames. Current step: ','Быстрый диапазон: 1–120 кадров. Текущий шаг: ')+prefs.frames;
    document.querySelectorAll('[data-step]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.step)===prefs.frames);b.setAttribute('aria-pressed',String(Number(b.dataset.step)===prefs.frames));});
    const scopeNote=prefs.scope==='auto'?t('Selected AE layers, or all layers if none are selected.','Выделенные в AE слои; без выделения — все слои.'):prefs.scope==='all'?t('All composition layers.','Все слои композиции.'):selected?t('Selected AE layers.','Выделенные в AE слои.'):t('No selected layers. Select them in AE or choose Auto.','Нет выделенных слоёв. Выделите их в AE или выберите Авто.');
    U.html($('scope'),esc(scopeNames()[prefs.scope])+icons('chevron'));$('scope').title=scopeNote;$('scope').setAttribute('aria-label',t('Scope: ','Область: ')+scopeNames()[prefs.scope]);$('scope').disabled=busy;
    U.html($('mode'),esc(modeNames()[prefs.mode])+icons('chevron'));$('mode').disabled=busy;$('mode').title=modeNotes()[prefs.mode];$('mode').setAttribute('aria-label',t('Move: ','Переносить: ')+modeNames()[prefs.mode]);
    shiftCommands.forEach(c=>{const b=$(c.id);b.disabled=!available(c,eligibility);U.text(b.querySelector('.step-value'),prefs.frames);b.title=commandLabel(c)+' · '+(c.args.direction<0?t('Move earlier','Сдвинуть раньше'):t('Move later','Сдвинуть позже'))+t(' · Shift-click for a one-time step',' · Shift + щелчок для разового шага');b.setAttribute('aria-label',b.title);});
    toolbarCommands.forEach(c=>{const b=$(c.id);b.disabled=!available(c,eligibility);U.label(b,C.title(c,prefs.language));b.title=commandLabel(c);});
    commandGroups.forEach(g=>{const b=$(g.element);b.disabled=g.id==='time'?!r:!groupedCommands.get(g.id).some(c=>available(c,eligibility));U.label(b,C.title(g,prefs.language));});
    $('preview-plan').disabled=!previewCommands.some(c=>available(c,eligibility));$('refresh').disabled=busy;
    if($('arrange-preview'))$('arrange-preview').disabled=busy||!!($('arrange-frames')&&$('arrange-frames').getAttribute('aria-invalid')==='true');
    if($('apply-preview'))$('apply-preview').disabled=!r||isDemo||!activePreview||activePreview.blocked||activePreview.counts.changes===0;
    $('frame-minus').disabled=busy||prefs.frames<=1;$('frame-plus').disabled=busy||prefs.frames>=1000000;$('frame-slider').disabled=busy;$('frames').disabled=busy;
    $('half-second').disabled=!state||busy;$('one-second').disabled=!state||busy;
    const live=!connectionFailed&&(!!state||bridge&&bridge.connected);$('connection').textContent=isDemo?t('Demo','Демо'):connectionFailed?t('Offline','Сбой связи'):live?'AE':t('No AE','Нет AE');$('connection').className='connection '+(isDemo?'demo':live?'live':'');
    U.text($('comp-name'),state?state.name:t('No composition','Нет композиции'));$('comp-name').title=state?state.name+' · '+Number((1/state.frameDuration).toFixed(3))+' fps':'';
    const options=offsetContext();
    $('offset-context').hidden=!options.length;
    U.text($('offset-context'),options.join(' · '));
    $('offset-context').title=t('Offset options','Параметры сдвига');
    $('offset-context').disabled=busy;
    $('empty-text').hidden=!!state;$('status').textContent=D(statusRaw);$('status').title=D(statusRaw);
  }
  async function request(data,quiet=false,expectedComp=null){
    if(disposed||busy)return null;
    if(data.op!=='read'&&!ready()){status(t('Click Refresh to connect to AE.','Нажмите «Обновить» для подключения к AE.'),true);return null;}
    const previewRevision=dialogRevision;closeMenu();busy=true;clearTimeout(pollTimer);render();if(!quiet)status(data.op==='read'?t('Reading AE…','Читаем AE…'):t('Checking AE…','Проверяем AE…'));
    let readCompleted=false;
    try{
      const fresh=await bridge.call({op:'read'});if(disposed)return null;accept(fresh.state);readCompleted=true;connectionFailed=false;readFailures=0;
      if(expectedComp!==null&&state.compId!==expectedComp)throw Error(t('Composition changed. Reopen this action in the intended composition.','Композиция сменилась. Откройте действие заново в нужной композиции.'));
      // A reference can change in AE after the last panel refresh.
      if(data.op==='offset'&&state.markerReference)data.preview=true;
      const result=data.op==='read'?fresh:await bridge.call(Object.assign({},data,{token:state.token}));if(disposed)return null;
      if(result.state)accept(result.state);if(result.report)lastReport=result.report;
      if(result.failure){
        const failure=result.failure, context=failure.failure||{};
        const message=[result.message,failure.error&&failure.error.message].find(value=>typeof value==='string'&&value.trim()&&!/^(undefined|null)$/i.test(value.trim()))||t('AE rejected the operation.','AE отклонил операцию.');
        const detail=[message,context.phase,context.target].filter(Boolean).join(' · ');
        lastReport=result.report||JSON.stringify(failure,null,2);log(data.op,detail);status(detail,true);
      }
      else if(!quiet){status(result.message||(isDemo?t('Demo · AE disconnected','Демо · AE не подключён'):t('Synced with AE','Синхронизировано с AE')),false,result.warning);log(data.op,result.message||t('confirmed','подтверждено'));}
      if(data.preview&&previewRevision===dialogRevision)showPreview(result);return result;
    }catch(cause){if(disposed)return null;const e=cause&&cause.message?cause:new Error(typeof cause==='string'&&cause!=='undefined'?cause:t('AE returned no error description.','AE не передал описание ошибки.'));connectionFailed=!!(bridge.needsReconnect||bridge.uncertain);if(!readCompleted){readFailures++;state=null;}$('empty-text').textContent=D(e.message);status(e.message,true);log(data.op,(e.code?e.code+' / '+e.stage+' · ':'')+e.message);lastReport=D(e.message)+(e.code?'\nCode: '+e.code+'\nStage: '+e.stage+'\nRequest: '+data.op:'')+(e.host?'\n'+JSON.stringify(e.host,null,2):'');return null;}
    finally{busy=false;render();schedulePoll();}
  }
  let activeRefresh=null;
  function refresh(quiet=false){
    if(quiet&&connectionFailed)return Promise.resolve(null);
    if(busy)return activeRefresh||Promise.resolve(null);
    const reading=request({op:'read'},quiet);
    activeRefresh=reading;
    reading.finally(()=>{if(activeRefresh===reading)activeRefresh=null;});
    return reading;
  }
  function available(c,s){s=s||{ready:ready(),any:!!state&&(prefs.scope!=='selected'?state.layers.length>0:M.selected(state).length>0),valid:validFrames()};return s.ready&&s.any&&(!c.context.includes('frames')||s.valid);}
  function commandLabel(c){return c.surface==='shift'?directionLabel(c.args.region,c.args.direction):C.title(c,prefs.language);}
  function runCommand(id,preview,overrides={}){
    const c=C.get(id);
    if(!available(c))return null;
    if(c.form==='interval')return showInterval(c.args.action,id);
    if(c.form==='arrange')return showArrange(c.args.action,id);
    const context=Object.assign({},prefs,overrides), payload=C.build(id,context,{},preview);
    if(c.op==='offset'){
      for(const key of ['depth','labelFilter','labelIds','skipLocked','skipDisabled','skipUnsupported'])payload[key]=context[key];
      if(context.depth!==0||state.markerReference)payload.preview=true;
      if(context.labelFilter!=='off'&&!context.labelIds.length){showOffsetOptions();return null;}
    }
    return request(payload);
  }
  function promptShift(command,depth){
    const side=command.args.region==='before'?t('Before cursor','До курсора'):t('After cursor','После курсора');
    const direction=command.args.direction<0?t('earlier','раньше'):t('later','позже');
    openDialog(side+' · '+direction,'<label class="setting-row" for="shift-step"><span>'+t('Frames for this shift','Кадры для этого сдвига')+'</span><input class="arrange-number" id="shift-step" type="text" value="'+prefs.frames+'" aria-describedby="shift-step-error"></label><p class="settings-status" id="shift-step-error" role="status"></p><div class="operation-actions"><button class="primary-button" id="shift-step-go">'+t('Preview Changes','Показать план')+'</button></div>');
    const field=$('shift-step'),button=$('shift-step-go'),feedback=$('shift-step-error');
    function getStep(){
      try{
        const frames=M.parseFrameStep(field.value);
        field.setAttribute('aria-invalid','false');feedback.textContent='';button.disabled=false;
        return frames;
      }catch(error){
        field.setAttribute('aria-invalid','true');feedback.textContent=D(error.message);button.disabled=true;
        return null;
      }
    }
    field.oninput=getStep;
    button.onclick=safe(()=>{
      const frames=getStep();
      if(frames===null)return;
      return runCommand(command.id,true,{frames,depth});
    });
    field.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();button.click();}};
    field.focus();field.select();
  }
  function listenKBar(){
    const cep=window.__adobe_cep__,eventName='com.frameflow.ae.panel.kbar';
    if(!cep||typeof cep.addEventListener!=='function')return;
    let waiting=false;
    const receive=safe(async event=>{
      if(disposed||isDemo||!event||!event.data)return;
      const match=typeof event.data==='string'&&/^Offset(Next|Before)(Plus|Moins)(Comp)?(\?)?$/.exec(event.data.trim());
      if(!match){status(t('Unknown FrameFlow KBar argument.','Неизвестный аргумент KBar для FrameFlow.'),true);return;}
      if(waiting)return;
      if(busy&&activeRefresh&&state){
        // Opening an already-loaded CEP panel can trigger a focus refresh.
        // Only wait for a read. Never queue a command behind an edit.
        const compId=state.compId;
        waiting=true;
        try{
          const fresh=await activeRefresh;
          if(!fresh||disposed||!state||state.compId!==compId)return;
        }finally{waiting=false;}
      }
      if(!$('overlay').hidden||!ready()){
        status(t('Close the dialog and wait for FrameFlow to sync, then press the KBar button.','Закройте диалог и дождитесь связи с AE, затем нажмите кнопку KBar.'),true);
        return;
      }
      const command=C.get((match[1]==='Next'?'after':'before')+(match[2]==='Plus'?'-plus':'-minus'));
      if(!available(command)){status(t('Check the frame step and layer scope.','Проверьте шаг и область слоёв.'),true);return;}
      const depth=match[3]?(prefs.depth||1):0;
      if(match[4])return promptShift(command,depth);
      return runCommand(command.id,depth!==0,{depth});
    });
    cep.addEventListener(eventName,receive);
    window.addEventListener('beforeunload',()=>{if(typeof cep.removeEventListener==='function')cep.removeEventListener(eventName,receive);});
  }
  function setupCommandSurfaces(){
    toolbarCommands.forEach(c=>{const b=U.actionButton({id:c.id,text:C.title(c,prefs.language),symbol:c.icon,onClick:safe(()=>runCommand(c.id))});b.setAttribute('data-command',c.id);$('command-actions').append(b);});
    commandGroups.forEach(g=>$('command-menus').append(U.actionButton({id:g.element,text:C.title(g,prefs.language),variant:'quiet',menu:true,onClick:()=>openMenu($(g.element),menuItems(g))})));
    shiftCommands.forEach(c=>{$(c.id).setAttribute('data-command',c.id);$(c.id).onclick=safe(e=>e&&e.shiftKey?promptShift(c,prefs.depth||0):runCommand(c.id));});
  }
  function menuItems(group){
    const items=groupedCommands.get(group.id).map(c=>({id:c.choice||c.id,label:commandLabel(c),disabled:!available(c),onClick:()=>runCommand(c.id)}));
    if(group.id==='time'){
      items.push({id:'markerReference',label:t('Marker reference…','Опорные маркеры…'),disabled:!ready()||isDemo,onClick:showMarkerReference});
      items.push(...timeToolItems());
    }
    return items;
  }
  function schedulePoll(){clearTimeout(pollTimer);if(disposed||connectionFailed||isDemo||!prefs.autoRefresh||!window.__adobe_cep__)return;const delay=Math.min(30000,prefs.poll*Math.pow(2,Math.min(readFailures,5)));pollTimer=setTimeout(()=>{if(!busy&&!document.hidden&&$('overlay').hidden&&!menuOwner&&!document.querySelector('input:focus'))refresh(true);else schedulePoll();},document.hasFocus()?delay:Math.max(3000,delay));}
  function safe(fn){return (...args)=>{try{return Promise.resolve(fn(...args)).catch(e=>status(e.message,true));}catch(e){status(e.message,true);}};}
  function closeMenu(){if(menuOwner){menuOwner.setAttribute('aria-expanded','false');menuOwner=null;}$('menu').hidden=true;}
  function openMenu(owner,items){
    const was=menuOwner===owner;closeMenu();if(was)return;
    menuOwner=owner;owner.setAttribute('aria-expanded','true');const menu=$('menu');menu.innerHTML='';
    items.forEach(item=>menu.append(U.menuItem(item,safe(()=>{closeMenu();owner.focus();return item.onClick();}))));
    menu.hidden=false;const rect=owner.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(rect.left,innerWidth-menu.offsetWidth-8))+'px';menu.style.top=Math.max(8,Math.min(rect.bottom+5,innerHeight-menu.offsetHeight-8))+'px';const first=[...menu.querySelectorAll('button')].find(b=>!b.disabled);if(first)first.focus();
  }
  function openDialog(title,html){dialogRevision++;closeMenu();activePreview=null;if($('overlay').hidden)dialogFocus=document.activeElement;$('dialog-title').textContent=title;$('dialog-body').innerHTML=html;const footer=$('dialog-footer'),actions=$('dialog-body').querySelector('.plan-actions,.operation-actions');footer.innerHTML='';footer.hidden=!actions;if(actions)footer.append(actions);$('overlay').hidden=false;$('dialog').focus();$('dialog-body').scrollTop=0;$('dialog-body').scrollLeft=0;}
  function closeDialog(){dialogRevision++;$('overlay').hidden=true;activePreview=null;if(dialogFocus&&document.contains(dialogFocus))dialogFocus.focus();schedulePoll();}
  function download(name,text){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  function choice(key,choices){return '<div class="settings-choice">'+choices.map(([v,label])=>'<button data-pref="'+key+'" data-value="'+v+'" class="'+(prefs[key]===v?'active':'')+'" aria-pressed="'+(prefs[key]===v)+'">'+esc(label)+'</button>').join('')+'</div>';}
  function range(key,label){const [min,max]=M.ranges[key];return '<div class="setting-row"><label for="pref-'+key+'">'+label+'</label><div class="range-wrap"><input id="pref-'+key+'" data-range="'+key+'" type="range" min="'+min+'" max="'+max+'" value="'+prefs[key]+'"><output>'+prefs[key]+'</output></div></div>';}
  function toggle(key,label){return '<label class="setting-row"><span>'+label+'</span><input type="checkbox" data-toggle="'+key+'" '+(prefs[key]?'checked':'')+'></label>';}
  function showReport(autoCopy=false){
    openDialog(t('FrameFlow Report','Отчёт FrameFlow'),'<p class="note">'+t('The report stays on your computer. Review it before sharing.','Отчёт остаётся на вашем компьютере. Просмотрите его перед отправкой.')+'</p><textarea id="report-text" class="report-text" readonly aria-label="'+t('Report text','Текст отчёта')+'"></textarea><div class="settings-actions"><button id="copy-report" class="primary-button">'+t('Copy','Скопировать')+'</button><button id="export-report" class="secondary-button">'+t('Save TXT','Сохранить TXT')+'</button><span id="report-copy-state" class="note" role="status" aria-live="polite"></span></div>');
    $('report-text').value=reportText();const field=$('report-text'),copyState=$('report-copy-state');
    function copied(message){if(document.contains(copyState))copyState.textContent=message;}
    async function copy(){field.focus();field.select();try{if(document.execCommand('copy')){copied(t('Copied','Скопировано'));return;}}catch(e){}try{if(!navigator.clipboard||typeof navigator.clipboard.writeText!=='function')throw Error('copy');await navigator.clipboard.writeText(field.value);copied(t('Copied','Скопировано'));}catch(e){copied(t('Copy blocked. Text selected: Ctrl/Cmd+C.','Копирование заблокировано. Текст выделен: Ctrl/Cmd+C.'));}}
    $('copy-report').onclick=copy;$('export-report').onclick=()=>download('FrameFlow-'+M.VERSION+'-report.txt',field.value);if(autoCopy)copy();
  }
  function showPreview(result){
    const p=result.preview;if(!p){openDialog(t('Preview','Предпросмотр'),'<p class="plan-message">'+(isDemo?t('Interface demo. Connect After Effects to calculate a real plan.','Демо интерфейса. Подключите After Effects для расчёта плана.'):t('AE returned no plan. Try again.','AE не вернул план. Повторите проверку.'))+'</p>');return;}
    const time=v=>M.timecode(v,p.frameDuration,p.displayStart),delta=(p.delta>0?'+':'−')+Number(Math.abs(p.delta/p.frameDuration).toFixed(3))+' '+frameWord(p.frames),kind={layer:t('Whole layer','Слой целиком'),edge:t('Edge + keys','Край и ключи'),property:t('Keys','Ключи')};
    const operation=p.arrangement?arrangeNames()[p.arrangement.action]:p.operation==='gap'?t('Close Gap','Убрать паузу'):p.operation==='insertTime'?t('Insert Time','Вставить время'):p.operation==='removeTime'?t('Remove Time','Удалить время'):(p.region==='before'?t('Before cursor','До курсора'):t('After cursor','После курсора'))+' · '+delta;
    const rows=p.targets.map(target=>{
      const fd=target.frameDuration||p.frameDuration,localTime=v=>M.timecode(v,fd,target.displayStart===undefined?p.displayStart:target.displayStart);
      const targetDelta=typeof target.delta==='number'?target.delta:p.delta;
      const signedFrames=value=>(value>0?'+':value<0?'−':'')+Number(Math.abs(value/fd).toFixed(6));
      const keyRange=Number.isFinite(target.minKeyDelta)&&Number.isFinite(target.maxKeyDelta)
        ? signedFrames(target.minKeyDelta)+(Math.abs(target.maxKeyDelta-target.minKeyDelta)>fd*.000001?' … '+signedFrames(target.maxKeyDelta):'')
        : '';
      const shift=(keyRange||signedFrames(targetDelta))+' '+frameWord(Math.round(Math.abs((keyRange?target.maxKeyDelta:targetDelta)/fd)));
      const rootLayer=state&&state.layers.find(l=>l.id===target.layerId);
      let title=target.layerName||(rootLayer&&rootLayer.name)||t('Composition markers','Маркеры композиции');
      if(target.compName&&p.nestedSources&&p.nestedSources.length)title=target.compName+' / '+title;
      let description=(Number.isInteger(target.axis)?'XYZ'[target.axis]+' · ':'')+kind[target.kind]+' · '+shift;
      if(target.kind==='edge'){
        description=[['inPoint','In'],['outPoint','Out']].filter(([k])=>Math.abs(target.before[k]-target.after[k])>fd*.000001).map(([k,label])=>label+' '+localTime(target.before[k])+' → '+localTime(target.after[k])).join(' · ')+(keyRange?' · '+t('Keys','Ключи')+' '+shift:'');
      }else if(target.kind==='layer')description+=' · In '+localTime(target.before.inPoint)+' → '+localTime(target.after.inPoint);
      return '<div class="plan-target"><div class="plan-target-title"><strong>'+(target.position?target.position+'. ':'')+esc(title)+'</strong><span>'+(target.index?'#'+target.index+' · ':'')+target.keys+' '+t('keys','кл.')+'</span></div><p>'+esc(description)+'</p></div>';
    }).join('');
    const nested=p.nestedSources&&p.nestedSources.length?'<p class="plan-message">'+t('Nested sources','Вложенные композиции')+' ('+p.nestedSources.length+'): '+p.nestedSources.map(s=>esc(s.name)).join(', ')+'</p>':'';
    const marker=p.markerReference?'<p class="plan-message">'+t('Marker reference · ','Опорный слой · ')+esc(p.markerReference.name)+' ('+p.markerReference.count+')</p>':'';
    const arrangement=p.arrangement?'<p class="plan-message">'+esc(orderNames()[p.arrangement.order])+' · '+(p.arrangement.anchor==='cursor'?t('AE Cursor','Курсор AE'):t('First Layer','Первый слой'))+(p.arrangement.action==='sequence'||p.arrangement.action==='stagger'?' · '+p.arrangement.frames+' '+frameWord(p.arrangement.frames):'')+'</p>':'';
    const interval=p.interval?'<p class="plan-message">'+esc((p.operation==='removeTime'?'['+time(p.interval.start)+' → '+time(p.interval.end)+')':time(p.interval.start)+' · '+delta)+' · '+(p.interval.crossing==='keep'?t('Keep crossing layers','Оставить пересекающие слои'):t('Retime crossing animation','Изменить тайминг анимации')))+'. '+t('Composition duration unchanged. No layers or keys are deleted.','Длительность композиции не меняется. Слои и ключи не удаляются.')+'</p>':'';
    openDialog(t('Change Plan','План изменений'),'<p class="plan-context"><strong>'+esc(operation)+'</strong><br>'+esc(time(p.cti))+' · '+esc(scopeNames()[p.scope])+'</p>'+arrangement+interval+nested+marker+'<div class="plan-summary"><span><strong>'+p.counts.layers+'</strong> '+word(p.counts.layers,'layer','layers','слой','слоя','слоёв')+'</span><span><strong>'+p.counts.keys+'</strong> '+word(p.counts.keys,'key','keys','ключ','ключа','ключей')+'</span><span><strong>'+p.counts.skipped+'</strong> '+t('skipped','пропусков')+'</span>'+(p.counts.keptCrossing?'<span><strong>'+p.counts.keptCrossing+'</strong> '+t('kept','оставлено')+'</span>':'')+'</div>'+(p.blocked?'<p class="plan-message error">'+t('Writing blocked. See the reasons below.','Запись заблокирована. Причины ниже.')+'</p>':'<p class="plan-message">'+(p.counts.changes?t('Nothing changed yet.','Пока ничего не изменено.'):t('No matching changes. Scene stays unchanged.','Подходящих изменений нет. Сцена останется прежней.'))+'</p>')+(p.counts.mediaSkipped?'<p class="plan-message warning">'+t('Insufficient source handles: ','Без запаса исходника: ')+p.counts.mediaSkipped+'. '+t('These layers and their keys stay in place.','Эти слои и все их ключи останутся на месте.')+'</p>':'')+(p.counts.outsideComposition?'<p class="plan-message warning">'+p.counts.outsideComposition+' '+t('layers extend beyond the composition. Duration stays unchanged.','слоёв выходят за границы композиции. Длительность не меняется.')+'</p>':'')+'<div class="plan-targets">'+rows+'</div>'+(p.targetsOmitted?'<p class="note">'+t('More targets: ','Ещё целей: ')+p.targetsOmitted+'. '+t('See the report.','Подробности — в отчёте.')+'</p>':'')+(p.errors.length||p.skips.length?'<h3>'+t('Reasons & skipped targets','Причины и пропуски')+'</h3><ul class="plan-reasons">'+p.errors.concat(p.skips).map(reason=>'<li>'+esc(D(reason))+'</li>').join('')+'</ul>':'')+(p.skipsOmitted?'<p class="note">'+t('More skipped: ','Ещё пропусков: ')+p.skipsOmitted+'.</p>':'')+'<div class="plan-actions"><button id="apply-preview" class="primary-button" '+(p.blocked||!p.counts.changes||isDemo?'disabled':'')+'>'+t('Apply Plan','Применить план')+'</button><button id="plan-report" class="quiet-button">'+t('Technical Report','Технический отчёт')+'</button></div><p class="plan-footnote">'+t('Valid for 2 minutes. AE rechecks the same targets before writing. Changes require a new preview.','План действует 2 минуты. AE повторно проверит те же цели перед записью. При изменениях потребуется новая проверка.')+'</p>');
    activePreview=p;$('apply-preview').onclick=safe(()=>{const id=p.id;closeDialog();return request({op:'applyPreview',previewId:id});});$('plan-report').onclick=()=>showReport(true);
  }
  function showArrange(action,commandId){
    const align=action==='alignIn'||action==='alignOut';
    const chips=(name,choices,value)=>'<div class="settings-choice">'+Object.keys(choices).map(k=>'<button data-arrange-'+name+'="'+k+'" class="'+(k===value?'active':'')+'" aria-pressed="'+(k===value)+'">'+esc(choices[k])+'</button>').join('')+'</div>';
    openDialog(arrangeNames()[action],'<p class="plan-context">'+esc(scopeNames()[prefs.scope])+' · '+t('Whole layers + all keys','Целые слои и все ключи')+'</p>'+(align?'':'<p class="setting-label">'+t('Order','Порядок')+'</p>'+chips('order',orderNames(),arrangeOrder)+'<p class="setting-label">'+t('Start at','Начать от')+'</p>'+chips('anchor',{cursor:t('AE Cursor','Курсор AE'),first:t('First Layer','Первый слой')},arrangeAnchor)+'<label class="setting-row" for="arrange-frames"><span>'+ (action==='sequence'?t('Gap · frames','Зазор · кадры'):t('Step · frames','Шаг · кадры'))+'</span><input id="arrange-frames" class="arrange-number" type="number" inputmode="numeric" min="'+(action==='sequence'?0:1)+'" max="1000000" step="1" value="'+(action==='sequence'?sequenceGap:prefs.frames)+'" aria-invalid="false"></label>')+'<p class="note">'+(action==='sequence'?t('Each layer starts after the previous one ends. A zero gap joins them end to end.','Каждый слой начинается после конца предыдущего. Нулевой зазор соединяет их встык.'):action==='stagger'?t('Spaces layer starts evenly. Existing durations stay intact.','Равномерный шаг между началами слоёв. Длительности сохраняются.'):t('Moves each whole layer to align its '+(action==='alignIn'?'In':'Out')+' point with the AE cursor.','Переносит каждый слой целиком, совмещая '+(action==='alignIn'?'начало':'конец')+' с курсором AE.'))+'</p><p class="note">'+t('Composition duration and composition markers stay unchanged.','Длительность и маркеры композиции не меняются.')+'</p><p id="arrange-error" class="settings-status" role="status"></p><div class="operation-actions"><button id="arrange-preview" class="primary-button">'+t('Preview Changes','Показать план')+'</button></div>');
    ['order','anchor'].forEach(key=>$('dialog-body').querySelectorAll('[data-arrange-'+key+']').forEach(b=>b.onclick=()=>{if(key==='order')arrangeOrder=b.dataset.arrangeOrder;else arrangeAnchor=b.dataset.arrangeAnchor;$('dialog-body').querySelectorAll('[data-arrange-'+key+']').forEach(el=>{const on=el===b;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on));});}));
    const field=$('arrange-frames');
    const valid=()=>{const raw=field?String(field.value).trim():'1',n=Number(raw);return /^\d+$/.test(raw)&&Number.isInteger(n)&&n>=(action==='sequence'?0:1)&&n<=1000000;};
    if(field)field.oninput=()=>{const ok=valid();field.setAttribute('aria-invalid',String(!ok));$('arrange-preview').disabled=!ok||busy;$('arrange-error').textContent=ok?'':t('Enter a whole frame count in the shown range.','Введите целое число кадров в указанном диапазоне.');};
    $('arrange-preview').onclick=safe(()=>{if(!valid())return;const frames=align?1:Number(field.value);if(action==='sequence')sequenceGap=frames;return request(C.build(commandId,prefs,{order:arrangeOrder,anchor:align?'cursor':arrangeAnchor,frames},true));});
  }
  function timeToolItems(){
    const disabled=!ready()||isDemo;
    return [
      {id:'measure-time',label:t('Measure selection','Измерить выделение'),disabled,onClick:measureSelection},
      {id:'time-zone',label:t('Range from cursor','Интервал от курсора'),disabled,onClick:showTimeZone},
      {id:'offset-counter',label:t('Offset counter','Счётчик сдвига'),disabled,onClick:showOffsetCounter}
    ];
  }
  async function measureSelection(){
    const revision=dialogRevision;
    const result=await request({op:'measureTime'},false,state.compId);
    if(!result||!result.measurement||revision!==dialogRevision)return;
    const m=result.measurement, rounded=Math.round(m.frames);
    const title=m.kind==='keys'?t('Selected key span','Размах выделенных ключей'):m.kind==='cursorKey'?t('Cursor to selected key','От курсора до ключа'):t('Selected layer span','Размах выделенных слоёв');
    const display=n=>M.timecode(n,result.state.frameDuration,result.state.displayStart);
    openDialog(title,'<p class="plan-context">'+Number(m.frames.toFixed(4))+' '+frameWord(m.frames)+'</p><p>'+display(m.start)+' → '+display(m.end)+'</p>'+(m.seam?'<p class="note">'+(m.seam.kind==='gap'?t('Gap','Зазор'):t('Overlap','Перекрытие'))+' · '+Number(m.seam.frames.toFixed(4))+' '+frameWord(m.seam.frames)+'</p>':'')+'<div class="operation-actions"><button id="use-measure" class="primary-button">'+t('Use step','Использовать шаг')+' · '+rounded+'</button>'+(m.seam?'<button id="use-seam" class="secondary-button">'+(m.seam.kind==='gap'?t('Use gap','Взять зазор'):t('Use overlap','Взять перекрытие'))+'</button>':'')+'</div>');
    if(m.seam){const step=Math.round(m.seam.frames);$('use-seam').disabled=step<1||step>1000000;$('use-seam').onclick=()=>{setFrames(step);closeDialog();};}
    $('use-measure').disabled=rounded<1||rounded>1000000;
    $('use-measure').onclick=()=>{setFrames(rounded);closeDialog();};
  }
  function showOffsetCounter(){
    const value=state.offsetCounter||0, compId=state.compId, baseToken=state.token;
    openDialog(t('Offset counter','Счётчик сдвига'),'<p class="plan-context">'+(value>0?'+':'')+value+' '+frameWord(value)+'</p><p class="note">'+t('Signed frame step, counted once per successful shift in this composition during this session. Undo and Redo do not change the counter.','Шаг со знаком для каждого успешного сдвига в этой композиции за сеанс. Undo и Redo не меняют счётчик.')+'</p><div class="operation-actions"><button id="use-counter" class="primary-button">'+t('Use as step','Использовать как шаг')+'</button><button id="reset-counter" class="secondary-button">'+t('Reset counter','Обнулить счётчик')+'</button></div>');
    $('use-counter').disabled=!value||Math.abs(value)>1000000;
    $('use-counter').onclick=()=>{setFrames(Math.abs(value));closeDialog();};
    $('reset-counter').disabled=!value;
    $('reset-counter').onclick=safe(async()=>{const revision=dialogRevision;const result=await request({op:'resetCounter',baseToken},false,compId);if(result&&!result.failure&&revision===dialogRevision)showOffsetCounter();});
  }
  function showTimeZone(){
    const comp=state, fd=comp.frameDuration, max=Math.floor(comp.duration/fd+0.000001), origin=Math.round(comp.time/fd);
    const initial=Math.min(max,origin+prefs.frames)>origin?Math.min(max,origin+prefs.frames):Math.max(0,origin-prefs.frames);
    const display=n=>M.timecode(n,fd,comp.displayStart);
    openDialog(t('Range from cursor','Интервал от курсора'),'<p class="plan-context">'+t('Cursor','Курсор')+' · '+display(comp.time)+'</p><label class="setting-row" for="zone-end"><span>'+t('Other endpoint · frame from comp start','Вторая граница · кадр от начала композиции')+'</span><input class="arrange-number" id="zone-end" type="number" min="0" max="'+max+'" step="1" value="'+initial+'"></label><input id="zone-slider" type="range" min="0" max="'+max+'" step="1" value="'+initial+'" aria-label="'+t('Range endpoint','Граница интервала')+'"><p id="zone-description" role="status"></p><div class="operation-actions"><button id="use-zone" class="primary-button">'+t('Use as step','Использовать как шаг')+'</button><button id="apply-zone" class="secondary-button">'+t('Set AE work area','Задать рабочую область AE')+'</button></div>');
    const field=$('zone-end'),slider=$('zone-slider'),apply=$('apply-zone'),use=$('use-zone');
    function update(){
      const end=Number(field.value), valid=String(field.value).trim()!==''&&Number.isInteger(end)&&end>=0&&end<=max;
      const span=Math.abs(end-comp.time/fd), rounded=Math.round(span);
      field.setAttribute('aria-invalid',String(!valid));apply.disabled=!valid||span<1-0.000001;
      use.disabled=!valid||rounded<1||rounded>1000000;
      if(valid)slider.value=end;
      $('zone-description').textContent=valid?display(Math.min(comp.time,end*fd))+' → '+display(Math.max(comp.time,end*fd))+' · '+Number(span.toFixed(4))+' '+frameWord(span):t('Choose an endpoint inside the composition.','Выберите границу внутри композиции.');
    }
    field.oninput=update;slider.oninput=()=>{field.value=slider.value;update();};
    use.onclick=()=>{setFrames(Math.round(Math.abs(Number(field.value)-comp.time/fd)));closeDialog();};
    apply.onclick=safe(async()=>{const revision=dialogRevision;const result=await request({op:'setZone',baseToken:comp.token,endFrame:Number(field.value)},false,comp.compId);if(result&&!result.failure&&revision===dialogRevision)closeDialog();});
    update();
  }
  function showInterval(action,commandId){
    openDialog(action==='insert'?t('Insert Time','Вставить время'):t('Remove Time','Удалить время'),'<p class="plan-context">'+readFrames()+' '+frameWord(readFrames())+' '+t('at the AE cursor','от курсора AE')+' · '+esc(scopeNames()[prefs.scope])+'</p><p class="setting-label">'+t('Layers crossing the interval','Слои на пересечении интервала')+'</p><div class="settings-choice"><button data-crossing="keep" class="active" aria-pressed="true">'+t('Keep','Оставить')+'</button><button data-crossing="retime" aria-pressed="false">'+t('Retime Animation','Изменить анимацию')+'</button></div><p id="crossing-note" class="note"></p><p class="note">'+t('Later layers move with all their keys. Composition duration stays unchanged. No layers or keys are deleted.','Слои после интервала сдвигаются со всеми ключами. Длительность композиции не меняется. Слои и ключи не удаляются.')+'</p><div class="operation-actions"><button id="interval-preview" class="primary-button">'+t('Preview Changes','Показать план')+'</button></div>');
    let crossing='keep';const note=()=>{$('crossing-note').textContent=crossing==='keep'?t('Crossing layers and their keys remain entirely in place.','Пересекающие слои и все их ключи остаются на месте.'):t('Extends or shortens crossing animation. Video, audio, precomps and Time Remap need a manual split in AE. Keys inside a removed interval block writing.','Удлиняет или сокращает пересекающую анимацию. Видео, аудио, прекомпозиции и Time Remap требуют ручного разделения в AE. Ключи внутри удаляемого интервала блокируют запись.');};note();
    $('dialog-body').querySelectorAll('[data-crossing]').forEach(b=>b.onclick=()=>{crossing=b.dataset.crossing;$('dialog-body').querySelectorAll('[data-crossing]').forEach(el=>{el.classList.toggle('active',el.dataset.crossing===crossing);el.setAttribute('aria-pressed',String(el.dataset.crossing===crossing));});note();});
    $('interval-preview').onclick=safe(()=>request(C.build(commandId,Object.assign({},prefs,{frames:readFrames()}),{crossing},true)));
  }
  function offsetContext(){
    const active=[];
    if(prefs.depth!==0)active.push(prefs.depth===-1?t('All precomp levels','Все уровни прекомпозиций'):t('Precomp depth ','Глубина прекомпозиций ')+prefs.depth);
    if(prefs.labelFilter!=='off')active.push((prefs.labelFilter==='only'?t('Only labels ','Только метки '):t('Protect labels ','Защита меток '))+(prefs.labelIds.join(', ')||'—'));
    if(prefs.skipLocked||prefs.skipDisabled||prefs.skipUnsupported)active.push(t('Skip rules on','Правила пропуска'));
    if(state&&state.markerReference)active.push(t('Markers · ','Маркеры · ')+state.markerReference.name);
    return active;
  }
  function showOffsetOptions(){
    const compId=state?state.compId:null;
    const labelName=i=>i===0?t('0 · None','0 · Без метки'):String(i);
    const labels=Array.from({length:17},(_,i)=>'<button type="button" data-label-id="'+i+'" aria-pressed="'+prefs.labelIds.includes(i)+'">'+labelName(i)+'</button>').join('');
    openDialog(t('Offset options','Параметры сдвига'),
      '<h3>'+t('Precompositions','Прекомпозиции')+'</h3>'+
      '<label class="setting-row"><span>'+t('Nested depth','Глубина вложенности')+'</span><input id="offset-depth" class="arrange-number" type="number" step="1" min="-1" max="1000" value="'+prefs.depth+'"></label>'+
      '<button id="inspect-precomps" class="secondary-button">'+t('Inspect hierarchy…','Посмотреть вложения…')+'</button><p class="note">'+t('0 edits the current composition. 1 includes its direct sources. −1 includes all levels. Nested changes open a plan.','0 — текущая композиция. 1 — также её прямые прекомпозиции. −1 — все уровни. Вложенные изменения открываются в плане.')+'</p>'+
      '<h3>'+t('Keyframe labels','Метки ключей')+'</h3>'+choice('labelFilter',[['off',t('Off','Выкл.')],['protect',t('Protect selected labels','Защитить метки')],['only',t('Move only these labels','Только эти метки')]])+
      '<div class="label-grid" role="group" aria-label="'+t('AE label numbers','Номера меток AE')+'">'+labels+'</div><p id="filter-hint" class="note"></p>'+
      '<button id="use-selected-labels" class="secondary-button">'+t('Read labels from selected keys','Взять метки выделенных ключей')+'</button>'+
      '<div class="setting-row"><label for="key-label">'+t('Label for selected AE keys','Метка для выделенных ключей AE')+'</label><input id="key-label" class="arrange-number" type="number" step="1" min="0" max="16" value="'+(prefs.labelIds[0]||0)+'"></div>'+
      '<button id="assign-key-label" class="secondary-button">'+t('Assign to selected keys','Назначить выделенным ключам')+'</button>'+
      '<h3>'+t('Skip during offset','Пропускать при сдвиге')+'</h3><div class="settings-grid">'+
      toggle('skipLocked',t('Locked layers','Заблокированные слои'))+
      toggle('skipDisabled',t('Disabled layers and properties','Выключенные слои и свойства'))+
      toggle('skipUnsupported',t('Unsupported properties','Неподдерживаемые свойства'))+'</div>'+
      '<p id="offset-options-status" class="settings-status" role="status"></p><button id="offset-markers" class="secondary-button">'+t('Marker reference…','Опорные маркеры…')+'</button>');
    const body=$('dialog-body'),depth=$('offset-depth'),label=$('key-label'),assign=$('assign-key-label');
    function sync(){
      const needsLabels=prefs.labelFilter!=='off'&&!prefs.labelIds.length;
      $('filter-hint').textContent=needsLabels?t('Choose at least one AE label number to use this filter.','Для этого фильтра выберите хотя бы один номер метки AE.'):t('Numbers match the label slots in AE. 0 includes unlabeled keys.','Номера соответствуют меткам AE. 0 включает ключи без метки.');
      body.querySelectorAll('[data-label-id]').forEach(b=>b.setAttribute('aria-pressed',String(prefs.labelIds.includes(Number(b.dataset.labelId)))));
      body.querySelectorAll('[data-pref]').forEach(b=>{const active=b.dataset.value===prefs.labelFilter;b.setAttribute('aria-pressed',String(active));b.classList.toggle('active',active);});
      assign.disabled=!ready()||isDemo||!/^\d+$/.test(label.value)||Number(label.value)>16;
      for(const id of ['offset-markers','inspect-precomps','use-selected-labels'])$(id).disabled=!ready()||isDemo;
    }
    body.querySelectorAll('[data-pref]').forEach(b=>b.onclick=()=>{change('labelFilter',b.dataset.value);sync();});
    body.querySelectorAll('[data-label-id]').forEach(b=>b.onclick=()=>{
      const id=Number(b.dataset.labelId);
      change('labelIds',prefs.labelIds.includes(id)?prefs.labelIds.filter(v=>v!==id):prefs.labelIds.concat(id));
      sync();
    });
    body.querySelectorAll('[data-toggle]').forEach(el=>el.onchange=()=>change(el.dataset.toggle,el.checked));
    depth.oninput=()=>{
      const ok=/^-?\d+$/.test(depth.value)&&Number(depth.value)>=-1&&Number(depth.value)<=1000;
      depth.setAttribute('aria-invalid',String(!ok));
      $('offset-options-status').textContent=ok?'':t('Enter a whole depth from −1 to 1000.','Введите целую глубину от −1 до 1000.');
      if(ok)change('depth',Number(depth.value));
    };
    label.oninput=()=>{sync();label.setAttribute('aria-invalid',String(!/^\d+$/.test(label.value)||Number(label.value)>16));};
    assign.onclick=safe(async()=>{
      if(assign.disabled||!ready())return;
      assign.disabled=true;
      const revision=dialogRevision;
      await request({op:'labelSelectedKeys',label:Number(label.value)},false,compId);
      if(revision!==dialogRevision)return;
      $('offset-options-status').textContent=D(statusRaw);
      sync();
    });
    $('inspect-precomps').onclick=safe(()=>showPrecompHierarchy(compId));
    $('use-selected-labels').onclick=safe(async()=>{
      const revision=dialogRevision;
      const result=await request({op:'readSelectedKeyLabels'},false,compId);
      if(revision!==dialogRevision)return;
      if(result&&Array.isArray(result.labelIds)){
        change('labelIds',result.labelIds);
        $('offset-options-status').textContent=t('Labels loaded from AE keys.','Метки загружены из ключей AE.');
      }else $('offset-options-status').textContent=D(statusRaw);
      sync();
    });
    $('offset-markers').onclick=safe(showMarkerReference);
    sync();
  }
  async function showPrecompHierarchy(compId){
    const revision=dialogRevision;
    const result=await request({op:'inspectPrecomps',scope:prefs.scope},false,compId);
    if(!result||!result.hierarchy||revision!==dialogRevision)return;
    const {rows,limited}=result.hierarchy;
    const levels=[0,...new Set(rows.map(row=>row.depth))];
    if(rows.length)levels.push(-1);
    const defaultLevel=levels.includes(prefs.depth)?prefs.depth:0;
    const options=levels.map(level=>'<option value="'+level+'"'+(defaultLevel===level?' selected':'')+'>'+
      (level<0?t('All levels','Все уровни'):level===0?t('Current comp','Текущая композиция'):t('Depth ','Глубина ')+level)+'</option>').join('');
    const items=rows.map(row=>'<div class="plan-target"><div class="plan-target-title"><strong>'+esc(row.source)+'</strong><span>'+
      t('Level ','Уровень ')+row.depth+'</span></div><p>'+esc(row.parent)+' / '+esc(row.instance)+(row.shared?' · '+t('Shared source','Общий источник'):'')+'</p></div>').join('');
    openDialog(t('Precomp hierarchy','Вложенные композиции'),'<p class="plan-context">'+esc(result.state.name)+' · '+esc(scopeNames()[prefs.scope])+'</p>'+
      '<label for="hierarchy-depth">'+t('Offset depth','Глубина сдвига')+'</label><select id="hierarchy-depth" class="layer-picker">'+options+'</select><div class="operation-actions"><button id="use-hierarchy-depth" class="primary-button">'+t('Use this depth','Выбрать глубину')+'</button></div>'+
      (rows.length?'<div class="plan-targets">'+items+'</div>':'<p class="note">'+t('No precomps in this scope.','В этой области нет прекомпозиций.')+'</p>')+
      (limited?'<p class="note">'+t('The list is capped. Narrow the layer scope to inspect more detail.','Список ограничен. Сузьте область слоёв для подробного просмотра.')+'</p>':''));
    $('hierarchy-depth').value=String(defaultLevel);
    $('use-hierarchy-depth').onclick=()=>{
      change('depth',Number($('hierarchy-depth').value));
      showOffsetOptions();
    };
  }
  async function showMarkerReference(){
    if(!ready()||isDemo)return;
    const compId=state.compId,revision=dialogRevision;
    const result=await request({op:'readMarkerGuides'},false,compId);
    if(!result||!Array.isArray(result.guides)||revision!==dialogRevision)return;
    const reference=result.state.markerReference, guides=result.guides;
    const preferred=guides.find(l=>reference&&l.id===reference.layerId)||guides.find(l=>l.selected)||guides[0];
    const activeId=preferred?preferred.id:null;
    const options=guides.map(l=>'<option value="'+l.id+'"'+(l.id===activeId?' selected':'')+'>#'+l.index+' · '+esc(l.name)+' ('+l.count+')</option>').join('');
    openDialog(t('Marker reference','Опорные маркеры'),
      '<p class="plan-context">'+esc(state.name)+'</p><p class="note">'+t('Choose a layer with markers. Each marker defines a Before/After boundary and contributes one step. The reference layer stays in place.','Выберите слой с маркерами. Каждый маркер задаёт границу «До/После» и добавляет один шаг сдвига. Опорный слой остаётся на месте.')+'</p>'+
      (reference?'<p>'+t('Current reference · ','Опорный слой · ')+esc(reference.name)+' ('+reference.count+')</p>':'')+
      (options?'<label for="marker-layer">'+t('Reference layer','Слой с маркерами')+'</label><select id="marker-layer" class="layer-picker">'+options+'</select>':'<p class="note">'+t('Add at least one layer marker in AE to pick a reference.','Добавьте хотя бы один маркер на слой в AE.')+'</p>')+
      '<p id="marker-status" class="settings-status" role="status"></p><div class="operation-actions"><button id="set-marker-reference" class="primary-button" '+(options?'':'disabled')+'>'+t('Use layer markers','Использовать маркеры')+'</button>'+
      '<button id="clear-marker-reference" class="secondary-button" '+(reference?'':'disabled')+'>'+t('Clear reference','Убрать привязку')+'</button></div>');
    const picker=$('marker-layer');if(activeId!==null)picker.value=String(activeId);
    async function update(payload){
      const revision=dialogRevision;
      const result=await request(payload,false,compId);
      if(revision!==dialogRevision)return;
      if(result&&!result.failure){closeDialog();return;}
      $('marker-status').textContent=D(statusRaw);
    }
    $('set-marker-reference').onclick=safe(()=>update({op:'setMarkerReference',layerId:Number(picker.value)}));
    $('clear-marker-reference').onclick=safe(()=>update({op:'clearMarkerReference'}));
  }
  function showSettings(){
    openDialog(t('Settings','Настройки'),'<h3>'+t('Language','Язык')+'</h3>'+choice('language',[['en','English'],['ru','Русский']])+'<h3>'+t('Workflow','Работа')+'</h3><div class="settings-grid">'+toggle('rememberContext',t('Remember scope and mode','Запоминать область и режим'))+toggle('autoRefresh',t('Refresh from AE automatically','Обновлять сведения из AE'))+toggle('compMarkers',t('Move composition markers','Переносить маркеры композиции'))+'</div><button id="open-offset-options" class="secondary-button">'+t('Offset options…','Параметры сдвига…')+'</button><p class="note">'+t('Starts in Auto · Layers + Keys unless remembered. Step and appearance are always saved.','Без запоминания открывается Авто · Слои и ключи. Шаг и внешний вид сохраняются всегда.')+'</p><p class="setting-label">'+t('When video source handles run out','Если закончились исходные кадры видео')+'</p>'+choice('mediaPolicy',[['skip',t('Keep This Layer','Оставить этот слой')],['stop',t('Cancel All','Отменить всё')]])+'<p class="note">'+t('Skipped layers keep all their keys. Other available targets move.','Пропущенный слой и все его ключи остаются на месте. Остальные доступные цели сдвигаются.')+'</p><h3>'+t('Appearance','Внешний вид')+'</h3><p class="setting-label">'+t('Theme','Тема')+'</p>'+choice('theme',[['dark',t('Dark','Тёмная')],['light',t('Light','Светлая')],['host',t('Follow AE','Как в AE')]])+'<p class="setting-label">'+t('Font','Шрифт')+'</p>'+choice('font',[['system',t('System','Системный')],['sans','Arial'],['mono',t('Mono','Моно')]])+'<div class="settings-grid">'+range('fontSize',t('Text size','Размер текста'))+range('rowHeight',t('Shift button height','Размер кнопок сдвига'))+range('spacing',t('Button spacing','Интервал кнопок'))+range('radius',t('Corner radius','Скругление'))+'<label class="setting-row"><span>'+t('Accent','Акцент')+'</span><input id="pref-accent" type="color" value="'+prefs.accent+'"></label>'+toggle('motion',t('Window animation','Анимация окон'))+'<label class="setting-row"><span>'+t('High contrast','Повышенный контраст')+'</span><input type="checkbox" data-contrast="true" '+(prefs.contrast==='high'?'checked':'')+'></label></div><p class="setting-label">'+t('Density','Плотность')+'</p><div class="settings-choice"><button data-preset="compact">'+t('Compact','Компактно')+'</button><button data-preset="balanced">'+t('Balanced','Обычно')+'</button><button data-preset="large">'+t('Large','Крупнее')+'</button></div><h3>'+t('Quick Steps','Быстрые шаги')+'</h3><label class="note" for="quick-step-values">'+t('Up to 8 frame values, separated by commas','До 8 значений в кадрах, через запятую')+'</label><input id="quick-step-values" class="quick-step-setting" value="'+esc(quickDraft===null?prefs.quickSteps.join(', '):quickDraft)+'"><p id="settings-status" class="settings-status" role="status">'+esc(D(saveError)||t('Changes save automatically.','Изменения сохраняются автоматически.'))+'</p><div class="settings-actions"><button id="export-settings" class="secondary-button">'+t('Export JSON','Экспорт JSON')+'</button><button id="import-settings" class="secondary-button">'+t('Import','Импорт')+'</button><button id="reset-appearance" class="quiet-button">'+t('Reset Appearance','Сбросить вид')+'</button></div>');
    $('open-offset-options').onclick=showOffsetOptions;
    const body=$('dialog-body');body.querySelectorAll('[data-pref]').forEach(b=>b.onclick=()=>{const key=b.dataset.pref;if(!change(key,b.dataset.value))return;if(key==='language'){showSettings();const active=[...$('dialog-body').querySelectorAll('[data-pref]')].find(el=>el.dataset.pref==='language'&&el.dataset.value===prefs.language);if(active)active.focus();return;}body.querySelectorAll('[data-pref]').forEach(el=>{el.classList.toggle('active',prefs[el.dataset.pref]===el.dataset.value);el.setAttribute('aria-pressed',String(prefs[el.dataset.pref]===el.dataset.value));});});
    body.querySelectorAll('[data-range]').forEach(el=>el.oninput=()=>{if(change(el.dataset.range,Number(el.value)))el.nextElementSibling.textContent=el.value;});body.querySelectorAll('[data-toggle]').forEach(el=>el.onchange=()=>change(el.dataset.toggle,el.checked));body.querySelector('[data-contrast]').onchange=e=>change('contrast',e.target.checked?'high':'normal');$('pref-accent').oninput=e=>change('accent',e.target.value);
    $('quick-step-values').oninput=e=>{quickDraft=e.target.value;try{change('quickSteps',M.parseSteps(e.target.value));e.target.setAttribute('aria-invalid','false');}catch(error){e.target.setAttribute('aria-invalid','true');$('settings-status').textContent=D(error.message);}};
    body.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{const values={compact:{rowHeight:30,fontSize:11,spacing:2},balanced:{rowHeight:32,fontSize:12,spacing:3},large:{rowHeight:48,fontSize:14,spacing:6}}[b.dataset.preset];prefs=M.validate(Object.assign({},prefs,values));applyAppearance();persist();render();showSettings();});
    $('reset-appearance').onclick=()=>{for(const k of ['theme','font','fontSize','rowHeight','spacing','radius','accent','motion','contrast'])prefs[k]=M.defaults[k];applyAppearance();persist();render();showSettings();};$('export-settings').onclick=()=>download('FrameFlow-settings-v4.json',JSON.stringify(prefs,null,2));$('import-settings').onclick=()=>$('import-file').click();
  }
  function showHelp(){openDialog(t('How FrameFlow Works','Как работает FrameFlow'),'<p class="help-text"><strong>'+t('1. Place the cursor in AE.','1. Поставьте курсор в таймлайне AE.')+'</strong><br>'+t('Choose a frame step using presets, slider or − / +. Shift changes it by 10; the wheel works over the focused number.','Выберите шаг кнопкой, ползунком или − / +. Shift меняет шаг на 10 кадров; колесо работает над активным числом.')+'</p><p class="help-text"><strong>'+t('2. Scope defaults to Auto.','2. По умолчанию — Авто.')+'</strong><br>'+t('Auto uses selected AE layers, or all layers when none are selected. Selected never expands an empty selection.','Авто использует выделенные в AE слои; без выделения — всю композицию. «Выделенные» без выделения не расширяет область.')+'</p><p class="help-text"><strong>'+t('3. Choose Before or After cursor, then an arrow.','3. Выберите До или После курсора и стрелку.')+'</strong><br>'+t('Left moves earlier; right moves later. Before excludes a key at the cursor; After includes it. Each action reads the current AE cursor and selection.','Влево — раньше, вправо — позже. «До» не включает ключ на курсоре; «После» включает. Перед действием курсор и выделение перечитываются из AE.')+'</p><p class="help-text">'+Object.keys(modeNames()).map(k=>'<strong>'+esc(modeNames()[k])+':</strong> '+esc(modeNotes()[k])).join('<br>')+'</p><p class="help-text"><strong>'+t('Close Gap','Убрать паузу')+'</strong> — '+t('removes the empty gap under the cursor, independent of step and mode. Plan offers a preview for any direction or Close Gap. Apply Plan executes only the checked targets.','удаляет пустой промежуток под курсором независимо от шага и режима. Меню «План» проверяет любое направление или удаление паузы. «Применить план» выполняет только проверенные изменения.')+'</p><p class="help-text"><strong>'+t('Time → Insert / Remove','Время → Вставить / Удалить')+'</strong> — '+t('shifts later layers by the frame step. Keep leaves crossing layers intact; Retime Animation changes eligible animation only. Footage crossings need a manual AE split. No layers or keys are deleted; composition duration stays unchanged. Always preview the interval before applying.','сдвигает последующие слои на выбранный шаг. «Оставить» сохраняет пересекающие слои целиком. «Изменить анимацию» меняет только доступную анимацию. Видео и аудио на пересечении требуют ручного разделения в AE. Слои и ключи не удаляются; длительность композиции не меняется. Перед применением всегда показывается план.')+'</p><p class="help-text"><strong>Arrange</strong> — '+t('Align In/Out to the cursor, Stagger layer starts or Sequence end to end with a gap. Set Top → Bottom, Bottom → Top or Start Time order and the cursor/first-layer anchor. Whole layers and all native keys move together. Preview is required; composition markers and duration stay unchanged.','Выравнивание начала/конца к курсору, лесенка начал или последовательность с зазором. Выберите порядок сверху, снизу или по началу и точку отсчёта — курсор либо первый слой. Целые слои и все нативные ключи перемещаются вместе. Требуется план; маркеры и длительность композиции не меняются.')+'</p><p class="help-text">'+t('Insufficient video handles keep that entire layer in place by default. Settings can cancel the entire operation instead. Locked targets and key collisions block writing. Undo / Redo in AE. R refreshes; ? opens Help. Report opens and copies the diagnostics.','Если исходных кадров не хватает, весь этот слой по умолчанию остаётся на месте. В настройках можно выбрать «Отменить всё». Блокировки и коллизии ключей запрещают запись. Undo / Redo выполняйте в AE. R обновляет сведения; ? открывает справку. «Отчёт» открывает и копирует диагностику.')+'</p><p class="note">FrameFlow '+M.VERSION+' · Made by Nasaat</p>');}
  function keydown(e){
    if(!$('overlay').hidden){if(e.key==='Escape'){e.preventDefault();closeDialog();}if(e.key==='Tab'){const a=[...$('dialog').querySelectorAll('button,input,select,textarea')].filter(el=>!el.disabled);if(a.length){const i=a.indexOf(document.activeElement),next=e.shiftKey?(i<=0?a.length-1:i-1):(i+1)%a.length;e.preventDefault();a[next].focus();}}return;}
    if(menuOwner){const owner=menuOwner,list=[...$('menu').querySelectorAll('button')].filter(b=>!b.disabled),i=list.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();closeMenu();owner.focus();}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();list[(i+(e.key==='ArrowDown'?1:-1)+list.length)%list.length].focus();}return;}
    if(e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(e.key.toLowerCase()==='r'){e.preventDefault();refresh();}else if(e.key==='?'){e.preventDefault();showHelp();}
  }
  function setup(){
    try{preferenceStore=M.storage(localStorage);const loaded=preferenceStore.load();prefs=M.startup(loaded.value);if(loaded.error)saveError=loaded.error;}catch(e){prefs=M.validate(M.defaults);saveError=t('Storage unavailable. Settings apply to this session.','Хранилище недоступно. Настройки действуют в этой сессии.');preferenceStore={save(){throw Error(saveError);}};}
    setupCommandSurfaces();$('frames').value=prefs.frames;applyAppearance();renderPresets();
    if(window.__adobe_cep__&&typeof window.__adobe_cep__.evalScript==='function'){bridge=FFBridge.createCEP(window.__adobe_cep__,{language:()=>prefs.language});refresh();}else{bridge=FFBridge.create(()=>{throw Error(t('Open FrameFlow via Window → Extensions in After Effects.','Откройте FrameFlow через Window → Extensions в After Effects.'));});$('demo').hidden=false;status(t('Open the panel in After Effects','Откройте панель в After Effects'));render();}
    listenKBar();
    $('demo').onclick=()=>{bridge.dispose();bridge=FFDemo.create();isDemo=true;connectionFailed=false;readFailures=0;refresh();};if(!window.__adobe_cep__&&new URLSearchParams(location.search).get('demo')==='1')$('demo').click();
    $('offset-context').onclick=showOffsetOptions;
    $('refresh').onclick=()=>refresh();$('open-settings').onclick=showSettings;$('open-help').onclick=showHelp;$('open-report').onclick=()=>showReport(true);
    $('scope').onclick=()=>openMenu($('scope'),Object.keys(scopeNames()).map(v=>({id:v,label:scopeNames()[v],active:prefs.scope===v,onClick:()=>change('scope',v)})));
    $('mode').onclick=()=>openMenu($('mode'),Object.keys(modeNames()).map(v=>({id:v,label:modeNames()[v],note:modeNotes()[v],active:prefs.mode===v,onClick:()=>change('mode',v)})));
    const frameInput=$('frames');
    frameInput.title=t('Frames or calculation. Press Enter to calculate, e.g. (24 + 6) / 2.','Кадры или выражение. Enter вычисляет результат, например (24 + 6) / 2.');
    frameInput.oninput=()=>{
      const plain=validFrames();frameDraft=!plain;
      if(plain){frameInput.setAttribute('aria-invalid','false');change('frames',readFrames());return;}
      let computable=false;try{M.parseFrameStep(frameInput.value);computable=true;}catch(ignored){}
      frameInput.setAttribute('aria-invalid',String(!computable));
      status(computable?t('Press Enter to use the calculated step.','Нажмите Enter, чтобы задать рассчитанный шаг.'):t('Enter 1–1000000 whole frames or a calculation.','Введите от 1 до 1000000 целых кадров или выражение.'),!computable);render();
    };
    frameInput.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();try{const value=M.parseFrameStep(frameInput.value);setFrames(value);status(value+' '+frameWord(value));}catch(error){frameInput.setAttribute('aria-invalid','true');status(t('The calculation must give 1–1000000 whole frames.','Результат должен быть целым числом от 1 до 1000000 кадров.'),true);}});
    $('frame-minus').onclick=e=>setFrames(prefs.frames-(e.shiftKey?10:1));$('frame-plus').onclick=e=>setFrames(prefs.frames+(e.shiftKey?10:1));$('frame-slider').oninput=e=>setFrames(Number(e.target.value));$('frames').addEventListener('wheel',e=>{if(document.activeElement!==$('frames')||busy)return;e.preventDefault();setFrames(prefs.frames+(e.deltaY<0?1:-1)*(e.shiftKey?10:1));},{passive:false});$('half-second').onclick=()=>setFrames(Math.max(1,Math.round(.5/state.frameDuration)));$('one-second').onclick=()=>setFrames(Math.max(1,Math.round(1/state.frameDuration)));
    $('preview-plan').onclick=()=>openMenu($('preview-plan'),previewCommands.map(c=>({id:c.choice||c.id,label:commandLabel(c),disabled:!available(c),onClick:()=>runCommand(c.id,true)})));
    $('close-dialog').onclick=closeDialog;$('overlay').onclick=e=>{if(e.target===$('overlay'))closeDialog();};$('import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>20000)throw Error(t('Settings file exceeds 20 KB.','Файл настроек превышает 20 KB.'));prefs=M.validate(JSON.parse(await file.text()));quickDraft=null;applyAppearance();persist();renderPresets();render();showSettings();}catch(error){preferenceError(error.message);}finally{e.target.value='';}};
    document.addEventListener('keydown',safe(keydown));document.addEventListener('pointerdown',e=>{if(menuOwner&&!$('menu').contains(e.target)&&!menuOwner.contains(e.target))closeMenu();});window.addEventListener('resize',closeMenu);window.addEventListener('focus',()=>{if(!busy&&$('overlay').hidden)refresh(true);});document.addEventListener('visibilitychange',schedulePoll);
    window.addEventListener('beforeunload',()=>{disposed=true;clearTimeout(pollTimer);clearTimeout(saveTimer);try{preferenceStore.save(prefs);}catch(e){}bridge.dispose();});render();schedulePoll();if(saveError)status(saveError,true);
  }
  setup();
}());

