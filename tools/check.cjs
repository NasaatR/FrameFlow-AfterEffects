'use strict';
const {spawnSync}=require('node:child_process'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
for(const args of [['tools/build.cjs'],['--expose-internals','tools/es3-check.cjs','extension/jsx','src','tests/native'],['--expose-internals','--test','--test-reporter=tap',...fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.cjs')&&!f.endsWith('-fixture.cjs')).sort().map(f=>path.join('tests',f))]]){
  const r=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);
}
for(const f of fs.readdirSync(path.join(root,'extension/js'))){const r=spawnSync(process.execPath,['--check',path.join('extension/js',f)],{cwd:root,stdio:'inherit'});if(r.status)process.exit(r.status);}

