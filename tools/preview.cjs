'use strict';
// Generates a self-contained, explicitly demo-only browser preview from the actual UI.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),extension=path.join(root,'extension');
let html=fs.readFileSync(path.join(extension,'index.html'),'utf8');
html=html.replace(/<title>FrameFlow[^<]*<\/title>/,'<title>FrameFlow '+require('../package.json').version+' — Demo without AE</title>')
  .replace("script-src 'self';","script-src 'self' 'unsafe-inline';")
  .replace('<link rel="stylesheet" href="css/panel.css">','<style>'+fs.readFileSync(path.join(extension,'css/panel.css'),'utf8')+'</style>');
html=html.replace(/<script src="(js\/[a-z0-9-]+\.js)"><\/script>/g,(_,file)=>{
  let code=fs.readFileSync(path.join(extension,file),'utf8');
  if(file==='js/panel.js')code=code.replace("if(window.__adobe_cep__&&typeof window.__adobe_cep__.evalScript==='function')",'if(false)')
    .replace("if(!window.__adobe_cep__&&new URLSearchParams(location.search).get('demo')==='1')",'if(true)');
  return '<script>'+code.replace(/<\/script/gi,'<\\/script')+'</script>';
});
fs.writeFileSync(path.join(root,'PREVIEW.html'),html);
console.log('Built PREVIEW.html (demo-only, no AE connection)');
