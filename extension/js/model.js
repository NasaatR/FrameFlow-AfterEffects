(function (root) {
  'use strict';
  const VERSION = '2.4.0';
  const defaults = {version:4, language:'en', theme:'dark', font:'system', fontSize:12, rowHeight:32, spacing:3, labelWidth:226, radius:6, accent:'#a7c7ff', motion:false, snap:true, autoRefresh:true, poll:1800, frames:12, mode:'offset', scope:'auto', compMarkers:false, mediaPolicy:'skip', rememberContext:false, units:'timecode', showKinds:true, contrast:'normal', quickSteps:[1,2,5,10,12,24,48]};
  const ranges = {fontSize:[11,16], rowHeight:[30,58], spacing:[0,12], labelWidth:[150,340], radius:[0,12], poll:[1000,5000], frames:[1,1000000]};
  const choices = {language:['en','ru'],theme:['dark','light','host'],font:['system','sans','mono'],mode:['layers','keys','selectedKeys','offset'],scope:['auto','selected','all'],mediaPolicy:['skip','stop'],units:['timecode','frames'],contrast:['normal','high']};
  function luminance(hex) { const channels=[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)); return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722; }
  function contrast(a,b) { const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
  function accentFor(hex,light) {
    let channels=[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16)),out=hex;
    const surfaces=light?['#f4f4f5','#eaeaec','#ffffff']:['#17181a','#212225','#292a2e'];
    const encode=c=>'#'+c.map(n=>n.toString(16).padStart(2,'0')).join('');
    const tinted=bg=>encode([1,3,5].map((n,i)=>Math.round(parseInt(bg.slice(n,n+2),16)*.87+channels[i]*.13)));
    while(surfaces.some(bg=>contrast(out,bg)<4.5||contrast(out,tinted(bg))<4.5)){
      channels=channels.map(n=>light?Math.floor(n*.8):Math.ceil(n+(255-n)*.08));out=encode(channels);
    }
    return out;
  }
  function validate(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![1,2,3,4].includes(value.version)) throw Error('Версия настроек не поддерживается. Исходные данные сохранены.');
    const out = Object.assign({}, defaults);
    Object.keys(value).forEach(k => {
      if (!Object.prototype.hasOwnProperty.call(defaults,k)) throw Error('Неизвестный параметр: ' + k);
      const v = value[k];
      if(k==='quickSteps') { out[k]=parseSteps(v); return; }
      if (k in ranges) { const r = ranges[k]; if (!Number.isInteger(v) || v < r[0] || v > r[1]) throw Error('Значение вне диапазона: ' + k); }
      else if (k in choices) { if (!choices[k].includes(v)) throw Error('Недопустимый вариант: ' + k); }
      else if (k === 'accent') { if (typeof v !== 'string' || !/^#[0-9a-f]{6}$/i.test(v) || contrast(v,'#151515') < 4.5) throw Error('Выберите более светлый акцентный цвет.'); }
      else if (typeof v !== typeof defaults[k] || (k === 'version' && ![1,2,3,4].includes(v))) throw Error('Неверный тип: ' + k);
      out[k] = v;
    });
    if(value.version<3 && value.rowHeight===38)out.rowHeight=defaults.rowHeight;
    if(value.version<3 && value.spacing===4)out.spacing=defaults.spacing;
    out.version=4; return out;
  }
  function startup(value) {const out=validate(value);if(!out.rememberContext){out.scope='auto';out.mode='offset';}return out;}
  function parseSteps(value) {
    const list=Array.isArray(value)?value:String(value).trim().split(/[,;\s]+/).map(Number);
    if(!list.length||list.length>8||list.some(n=>!Number.isInteger(n)||n<1||n>1000000))throw Error('Быстрые шаги: от 1 до 8 целых чисел, каждое от 1 до 1000000.');
    return [...new Set(list)];
  }
  function effectiveScope(s,scope) {
    if(scope!=='auto'&&scope!=='all'&&scope!=='selected')throw Error('Неизвестная область.');
    return scope==='all'||(scope==='auto'&&!selected(s).length)?'all':'selected';
  }
  function storage(store) {
    const key='frameflow.preferences.v1'; let known=null, protectedValue=false;
    function load() {
      try { known=store.getItem(key); return {value:known===null?Object.assign({},defaults):validate(JSON.parse(known)),error:null}; }
      catch(e) { protectedValue=true; return {value:Object.assign({},defaults),error:e.message}; }
    }
    function save(value) {
      const v=validate(value);
      if (protectedValue) throw Error('Сохранённые настройки не распознаны; изменения действуют в этой сессии. Экспортируйте их для сохранения.');
      if (store.getItem(key)!==known) { protectedValue=true; throw Error('Настройки изменились в другом окне. Перезапустите панель; текущие значения действуют в этой сессии.'); }
      const next=JSON.stringify(v); store.setItem(key,next);
      if(store.getItem(key)!==next) throw Error('Хранилище не подтвердило запись настроек.');
      known=next; return v;
    }
    return {load,save};
  }
  function selected(s) { return s ? s.layers.filter(l=>l.selected) : []; }
  function frame(time,fd) { return Math.round(time/fd); }
  function timecode(t,fd,displayStart) {
    const fps=Math.round(1/fd), frames=Math.round((t+(displayStart||0))/fd), a=Math.abs(frames);
    return (frames<0?'-':'') + [Math.floor(a/(fps*3600)),Math.floor(a/(fps*60))%60,Math.floor(a/fps)%60,a%fps].map(v=>String(v).padStart(2,'0')).join(':');
  }
  function parseTime(text,fd,displayStart,units) {
    const raw=String(text).trim();
    if (/^-?\d+(?:\.\d+)?$/.test(raw)) return units==='frames' ? Number(raw)*fd : Number(raw);
    const match=raw.match(/^(-?)(\d+):(\d{2}):(\d{2}):(\d{2})$/), fps=Math.round(1/fd);
    if(!match || Number(match[3])>59 || Number(match[4])>59 || Number(match[5])>=fps) throw Error('Время: HH:MM:SS:FF или число ' + (units==='frames'?'кадров':'секунд') + '.');
    return (match[1]? -1:1)*((Number(match[2])*3600+Number(match[3])*60+Number(match[4]))*fps+Number(match[5]))*fd - (displayStart||0);
  }
  function snapDelta(s, ids, delta, pps, enabled, excludeCTI) {
    const movers=s.layers.filter(l=>ids.includes(l.id)), fixed=s.layers.filter(l=>!ids.includes(l.id));
    let result=delta, best=7/pps, guide=null;
    const anchors=[0,s.duration,s.workStart,s.workStart+s.workDuration]; if(!excludeCTI) anchors.push(s.time);
    fixed.forEach(l=>anchors.push(l.inPoint,l.outPoint));
    if(enabled) movers.forEach(l=>[l.inPoint,l.outPoint].forEach(edge=>anchors.forEach(target=>{
      const d=target-(edge+delta); if(Math.abs(d)<best) {best=Math.abs(d);result=delta+d;guide=target;}
    })));
    return {delta:result,guide};
  }
  function trimLimit(l, edge, value, fd) {
    let lower=-10800,upper=10800;
    if(edge==='in') upper=l.outPoint-fd; else lower=l.inPoint+fd;
    if(l.remap || l.stretch<=0) {if(edge==='in') lower=l.inPoint;else upper=l.outPoint;}
    else if(l.sourceDuration!==null&&!l.still) {lower=Math.max(lower,Math.min(l.inPoint,l.start));upper=Math.min(upper,Math.max(l.outPoint,l.start+l.sourceDuration*l.stretch/100));}
    return Math.max(lower,Math.min(upper,value));
  }
  const api={VERSION,contrast,accentFor,defaults,ranges,choices,validate,startup,storage,parseSteps,effectiveScope,selected,frame,timecode,parseTime,snapDelta,trimLimit};
  if(typeof module==='object'&&module.exports) module.exports=api; else root.FFModel=api;
}(typeof window==='object'?window:this));

