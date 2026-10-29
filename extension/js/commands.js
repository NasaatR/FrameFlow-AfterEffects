/* Command metadata only. AE handlers validate every request independently. */
(function(root){
  'use strict';
  const contextKeys=['scope','mode','frames','compMarkers','mediaPolicy'];
  const reserved=['__proto__','prototype','constructor','op','token','preview'];
  const identifier=value=>typeof value==='string'&&/^[a-z][a-zA-Z0-9-]{0,47}$/.test(value)&&!reserved.includes(value);
  const clone=value=>JSON.parse(JSON.stringify(value));
  function data(value,depth=0){
    if(depth>8)throw Error('Command arguments are too deeply nested.');
    if(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value))return;
    if(Array.isArray(value)){value.forEach(v=>data(v,depth+1));return;}
    if(value&&Object.getPrototypeOf(value)===Object.prototype){Object.keys(value).forEach(k=>{if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe command argument.');data(value[k],depth+1);});return;}
    throw Error('Command arguments must contain JSON data.');
  }
  function title(value){if(!Array.isArray(value)||value.length!==2||value.some(s=>typeof s!=='string'||!s.trim()||s.length>160))throw Error('English and Russian command titles are required.');}
  function create(groupInput,commandInput){
    if(!Array.isArray(groupInput)||!Array.isArray(commandInput)||groupInput.length>20||commandInput.length>100)throw Error('Invalid command catalogue.');
    const groups=new Map(),commands=new Map(),elements=new Set(),choices=new Set();
    groupInput.forEach(g=>{if(!g||!identifier(g.id)||!identifier(g.element)||groups.has(g.id)||elements.has(g.element))throw Error('Invalid or duplicate command group.');title(g.title);groups.set(g.id,clone(g));elements.add(g.element);});
    commandInput.forEach(c=>{
      if(!c||Object.keys(c).some(k=>!['id','op','title','surface','group','choice','form','args','context','parameters','preview','icon'].includes(k))||!identifier(c.id)||!identifier(c.op)||commands.has(c.id)||elements.has(c.id))throw Error('Invalid or duplicate command.');
      title(c.title);
      if(!['shift','toolbar','menu'].includes(c.surface)||!['optional','required'].includes(c.preview)||!['none','interval','arrange'].includes(c.form))throw Error('Invalid command presentation.');
      if(c.surface==='menu'&&!groups.has(c.group)||c.surface!=='menu'&&c.group!==undefined)throw Error('Unknown command group.');
      if(c.form!=='none'&&c.preview!=='required')throw Error('Parameter forms require preview.');
      if(c.icon!==undefined&&!/^[a-z][a-z0-9-]{0,31}$/.test(c.icon))throw Error('Invalid command icon.');
      if(c.choice!==undefined&&(typeof c.choice!=='string'||!c.choice||c.choice.length>80))throw Error('Invalid command choice.');
      const choiceKey=(c.group||c.surface)+':'+(c.choice||c.id);if(choices.has(choiceKey))throw Error('Duplicate command menu choice.');choices.add(choiceKey);
      if(!Array.isArray(c.context)||new Set(c.context).size!==c.context.length||c.context.some(k=>!contextKeys.includes(k)))throw Error('Invalid command context.');
      if(!Array.isArray(c.parameters)||new Set(c.parameters).size!==c.parameters.length||c.parameters.some(k=>!identifier(k)||reserved.includes(k)))throw Error('Invalid command parameters.');
      if(!c.args||Array.isArray(c.args)||Object.keys(c.args).some(k=>reserved.includes(k)||c.parameters.includes(k)||c.context.includes(k)))throw Error('Invalid command argument template.');data(c.args);
      if(JSON.stringify(c.args).length>8192)throw Error('Command argument template is too large.');
      commands.set(c.id,clone(c));
    });
    function get(id){if(!commands.has(id))throw Error('Unknown command: '+id);return clone(commands.get(id));}
    function all(){return [...commands.values()].map(clone);}
    function build(id,context,parameters={},preview){
      const c=get(id),out={op:c.op},keys=Object.keys(parameters);
      if(keys.some(k=>!c.parameters.includes(k))||c.parameters.some(k=>!Object.prototype.hasOwnProperty.call(parameters,k)))throw Error('Command parameters do not match its declaration.');
      c.context.forEach(k=>{if(!Object.prototype.hasOwnProperty.call(context,k))throw Error('Missing command context: '+k);data(context[k]);out[k]=clone(context[k]);});
      Object.assign(out,clone(c.args));keys.forEach(k=>{data(parameters[k]);out[k]=clone(parameters[k]);});
      if(preview===undefined)preview=c.preview==='required';if(typeof preview!=='boolean'||c.preview==='required'&&!preview)throw Error('This command requires preview.');out.preview=preview;return out;
    }
    return {get,all,groups:()=>[...groups.values()].map(clone),inGroup:id=>all().filter(c=>c.group===id),build,create,title:(c,language)=>c.title[language==='ru'?1:0]};
  }
  const groups=[{id:'time',element:'time-menu',title:['Time','Время']},{id:'arrange',element:'arrange-menu',title:['Arrange','Раскладка']}];
  const commands=[];
  ['before','after'].forEach(region=>[-1,1].forEach(direction=>commands.push({id:region+(direction<0?'-minus':'-plus'),op:'offset',surface:'shift',choice:region+':'+direction,form:'none',title:region==='before'?['Before cursor','До курсора']:['After cursor','После курсора'],args:{region,direction},context:['scope','mode','frames','compMarkers','mediaPolicy'],parameters:[],preview:'optional'})));
  commands.push({id:'gap',op:'gap',surface:'toolbar',form:'none',title:['Close Gap','Убрать паузу'],icon:'gap',args:{},context:['scope','compMarkers'],parameters:[],preview:'optional'});
  [['insert','Insert Time','Вставить время'],['remove','Remove Time','Удалить время']].forEach(([action,en,ru])=>commands.push({id:action+'Time',op:'interval',surface:'menu',group:'time',choice:action,form:'interval',title:[en,ru],args:{action},context:['scope','frames','compMarkers'],parameters:['crossing'],preview:'required'}));
  [['alignIn','Align In to Cursor','Начало к курсору'],['alignOut','Align Out to Cursor','Конец к курсору'],['stagger','Stagger','Лесенка'],['sequence','Sequence','Последовательно']].forEach(([action,en,ru])=>commands.push({id:action,op:'arrange',surface:'menu',group:'arrange',choice:action,form:'arrange',title:[en,ru],args:{action},context:['scope'],parameters:['order','anchor','frames'],preview:'required'}));
  const api=create(groups,commands);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.FFCommands=api;
}(typeof window==='object'?window:this));
