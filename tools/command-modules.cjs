'use strict';
const fs=require('node:fs'),path=require('node:path');
// Discovery is build-time only. Installed panels never load code from user paths.
function compileHost(root){
  const directory=path.join(root,'src/commands'),marker='/* @frameflow-plan-commands */',ops=new Set();
  const files=fs.readdirSync(directory,{withFileTypes:true}).filter(e=>e.name.endsWith('.jsxinc')).sort((a,b)=>a.name.localeCompare(b.name,'en'));
  if(!files.length)throw Error('No host command modules.');
  const modules=files.map(e=>{
    if(!e.isFile()||!/^[a-z][a-z0-9-]*\.jsxinc$/.test(e.name))throw Error('Invalid command module: '+e.name);
    const code=fs.readFileSync(path.join(directory,e.name),'utf8'),registrations=[...code.matchAll(/^registerPlan\("([a-z][A-Za-z0-9]{0,39})", function \(c,r\) \{/gm)];
    if(registrations.length!==1)throw Error('Use one registerPlan declaration per module: '+e.name);
    const op=registrations[0][1];if(ops.has(op)||['read','seek','select','applyPreview','trim','split'].includes(op))throw Error('Duplicate/reserved host operation: '+op);ops.add(op);
    return '/* Module: '+e.name+' */\n'+code;
  });
  const catalogue=require(path.join(root,'extension/js/commands.js'));
  for(const c of catalogue.all())if(!ops.has(c.op))throw Error('Missing host command module for '+c.id+': '+c.op);
  const html=fs.readFileSync(path.join(root,'extension/index.html'),'utf8'),staticIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const g of catalogue.groups())if(staticIds.has(g.element))throw Error('Command menu ID conflicts with the page: '+g.element);
  for(const c of catalogue.all()){
    if(c.surface==='shift'&&!staticIds.has(c.id))throw Error('Missing fixed shift surface: '+c.id);
    if(c.surface!=='shift'&&staticIds.has(c.id))throw Error('Command ID conflicts with the page: '+c.id);
    if(c.icon&&!staticIds.has('i-'+c.icon))throw Error('Missing command icon: '+c.icon);
  }
  let host=fs.readFileSync(path.join(root,'src/panel-host.jsxinc'),'utf8');
  if(host.split(marker).length!==2)throw Error('Expected one host command-module marker.');
  host=host.replace(marker,()=>modules.join('\n'));
  return host;
}
module.exports={compileHost};
