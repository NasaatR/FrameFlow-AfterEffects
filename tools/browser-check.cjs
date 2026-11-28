'use strict';
// Real Chromium layout/interaction checks with a simulated AE transport, not an AE execution test.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{fixture}=require('../tests/host-fixture.cjs');
const root=path.resolve(__dirname,'..'),output=path.join(root,'artifacts');fs.mkdirSync(output,{recursive:true});
const results={version:require('../package.json').version,sourceRef:process.env.GITHUB_SHA||'local',engine:'Chromium',host:'simulated AE/CEP fixture; no actual Adobe connection',checks:[],screenshots:[],sourceHashes:{}};
const errors=[];
function hash(file){return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');}
for(const file of ['extension/index.html','extension/css/panel.css',...fs.readdirSync(path.join(root,'extension/js')).map(f=>'extension/js/'+f),'extension/jsx/host.jsx',...fs.readdirSync(path.join(root,'src')).filter(f=>f.endsWith('.jsxinc')).map(f=>'src/'+f),'tools/runtime-sources.cjs',...fs.readdirSync(path.join(root,'src/commands')).filter(f=>f.endsWith('.jsxinc')).map(f=>'src/commands/'+f),'tools/command-modules.cjs','tools/build.cjs','tests/host-fixture.cjs','tools/browser-check.cjs'])results.sourceHashes[file]=hash(file);
async function check(name,fn){try{await fn();results.checks.push({name,status:'pass'});}catch(e){results.checks.push({name,status:'fail',message:e.message});errors.push(name+': '+e.message);}}
async function screenshot(page,name){const file=path.join(output,name+'.png');await page.screenshot({path:file});results.screenshots.push(name+'.png');}
function logScreenshot(name){const data=fs.readFileSync(path.join(output,name)).toString('base64');for(let i=0;i<data.length;i+=8000)console.log('FF_SCREENSHOT '+name+' '+Math.floor(i/8000)+' '+data.slice(i,i+8000));}
(async()=>{
  const browser=await chromium.launch({headless:true});results.browserVersion=browser.version();
  try{
    const context=await browser.newContext({viewport:{width:360,height:290},reducedMotion:'reduce'}),page=await context.newPage(),pageErrors=[];
    page.on('pageerror',e=>pageErrors.push(e.message));
    const host=fixture();host.comp.name='Edit · long composition title';host.comp.items[0].name='Title / animation';host.comp.items[1].name='Scene 02 · animation';host.comp.items[0].inPoint=0;host.comp.items[0].outPoint=2;host.comp.items[1].inPoint=6;host.comp.items[1].outPoint=8;
    let heldPreview=null,holdPreviews=false;await page.exposeFunction('__ffHostEval',script=>{if(holdPreviews&&script.includes(encodeURIComponent('"preview":true')))return new Promise(resolve=>{heldPreview=()=>resolve(vm.runInContext(script,host.ctx));});return vm.runInContext(script,host.ctx);});
    await page.addInitScript(()=>{window.__adobe_cep__={getSystemPath:()=>'/test/FrameFlow',evalScript(script,cb){window.__ffHostEval(script).then(cb);},getHostEnvironment:()=>JSON.stringify({appSkinInfo:{panelBackgroundColor:{color:{red:24,green:24,blue:26}}}})};});
    await page.goto('file://'+path.join(root,'extension/index.html'));await page.waitForFunction(()=>document.getElementById('connection').textContent==='AE');
    const tool=async(owner,value)=>{
      const trigger=page.locator('#'+owner);
      if(await trigger.getAttribute('aria-expanded')!=='true')await trigger.click();
      await page.locator('#'+owner+'-actions [data-choice="'+value+'"]').click();
    };
    const preview=async(id)=>{
      const control=page.locator('#preview-plan');
      if(await control.getAttribute('aria-pressed')!=='true')await control.click();
      await page.locator('#'+id).click();
    };
    const tab=id=>page.locator('[data-settings-tab="'+id+'"]').click();
    const mode=id=>page.locator('[data-mode="'+id+'"]').click();
    const fits=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&
      ['.content','#offset-plan'].every(selector=>{const region=document.querySelector(selector);return region.scrollWidth<=region.clientWidth;}));
    await screenshot(page,'main-dark');
    await check('English default and reduced controls',async()=>{assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.match(await page.locator('#scope').textContent(),/Auto/);assert.equal(await page.locator('[data-mode=offset]').getAttribute('aria-pressed'),'true');for(const selector of ['#preview-toggle','#cti-label','#scope-hint','.shift-label','#menu','select'])assert.equal(await page.locator(selector).count(),0);assert.equal(await page.locator('#before-plus').textContent(),'12');});
    await check('all main commands fit the default 360x290 panel',async()=>{const fit=await page.evaluate(()=>{const box=document.querySelector('.content').getBoundingClientRect(),bottom=Math.max(...[...document.querySelectorAll('.utility-row button')].map(el=>el.getBoundingClientRect().bottom));return {bottom,limit:box.bottom,scroll:document.querySelector('.content').scrollHeight,client:document.querySelector('.content').clientHeight};});assert.ok(fit.bottom<=fit.limit+1,JSON.stringify(fit));});
    for(const width of [320,360,650]){await page.setViewportSize({width,height:290});await check('no horizontal overflow at '+width,async()=>assert.equal(await fits(),true));}
    await page.setViewportSize({width:360,height:290});
    await check('20 frame edits retain segmented button nodes and avoid global style/HTML mutations',async()=>{const observed=await page.evaluate(async()=>{let styles=0,html=0;const scope=document.querySelector('#scope button'),mode=document.querySelector('#mode button'),a=new MutationObserver(records=>styles+=records.length),b=new MutationObserver(records=>html+=records.length);a.observe(document.documentElement,{attributes:true,attributeFilter:['style']});for(const id of ['scope','mode'])b.observe(document.getElementById(id),{childList:true,subtree:true});const slider=document.getElementById('frame-slider');for(let n=13;n<=32;n++){slider.value=String(n);slider.dispatchEvent(new Event('input',{bubbles:true}));}await new Promise(requestAnimationFrame);a.disconnect();b.disconnect();return {styles,html,same:scope===document.querySelector('#scope button')&&mode===document.querySelector('#mode button'),step:document.querySelector('#after-plus .step-value').textContent};});assert.deepEqual(observed,{styles:0,html:0,same:true,step:'32'});await page.locator('#frames').fill('12');});
    await preview('after-plus');await page.waitForSelector('#apply-preview');await screenshot(page,'plan-dark');
    await check('preview is read-only and Apply executes the captured plan once',async()=>{assert.equal(host.groups(),0);assert.equal(await page.locator('#overlay').isHidden(),true);assert.equal(await page.locator('#offset-plan-details-body .plan-target').count(),0);await page.locator('#offset-plan-details summary').click();await page.waitForSelector('#offset-plan-details-body .plan-target');assert.equal(await page.locator('#apply-preview').isEnabled(),true);await page.locator('#apply-preview').click();await page.waitForFunction(()=>document.getElementById('overlay').hidden&&document.getElementById('status').textContent.includes('Done'));assert.equal(host.groups(),1);assert.equal(host.comp.items[1].inPoint,6.5);});
    await preview('after-plus');await page.waitForSelector('#apply-preview');host.comp.time=9;
    await check('changed AE cursor rejects the captured plan without writing',async()=>{await page.locator('#apply-preview').click();await page.waitForFunction(()=>/expired|changed/i.test(document.getElementById('status').textContent));assert.equal(host.groups(),1);});host.comp.time=4;await page.locator('#preview-plan').click();
    await check('Time buttons open an explicit interval policy before read-only preview',async()=>{await tool('time-menu','insert');await page.waitForSelector('#interval-preview');assert.equal(host.groups(),1);await page.locator('#interval-preview').click();await page.waitForSelector('#apply-preview');assert.equal(host.groups(),1);assert.match(await page.locator('#dialog-body').textContent(),/No layers or keys are deleted/);assert.equal(await page.locator('#apply-preview').isEnabled(),true);await page.locator('#close-dialog').click();});
    await check('a dismissed slow preview never replaces a newer dialog or writes a scene',async()=>{const groups=host.groups();holdPreviews=true;await tool('arrange-menu','stagger');await page.locator('#arrange-preview').click();const deadline=Date.now()+5000;while(!heldPreview){if(Date.now()>deadline)throw Error('No pending preview');await new Promise(resolve=>setTimeout(resolve,10));}await page.keyboard.press('Escape');await page.locator('#open-help').click();heldPreview();heldPreview=null;holdPreviews=false;await page.waitForFunction(()=>document.getElementById('app').getAttribute('aria-busy')==='false');assert.equal(await page.locator('#dialog-title').textContent(),'How FrameFlow Works');assert.equal(await page.locator('#apply-preview').count(),0);assert.equal(host.groups(),groups);await page.locator('#close-dialog').click();});
    await check('Arrange policies preview without writing and show per-layer shifts',async()=>{await tool('arrange-menu','stagger');await page.waitForSelector('#arrange-preview');assert.equal(await page.locator('#dialog-body').evaluate(el=>el.scrollTop),0);const b=await page.locator('#arrange-preview').boundingBox();assert.ok(b.y>=0&&b.y+b.height<=290);await screenshot(page,'arrange-policy');const groups=host.groups();await page.locator('#arrange-preview').click();await page.waitForSelector('#apply-preview');assert.equal(host.groups(),groups);assert.equal(await page.locator('#dialog-body').evaluate(el=>el.scrollTop),0);const apply=await page.locator('#apply-preview').boundingBox();assert.ok(apply.y>=0&&apply.y+apply.height<=290);assert.match(await page.locator('#dialog-body').textContent(),/Top → Bottom/);assert.match(await page.locator('#dialog-body').textContent(),/\+96 frames/);await screenshot(page,'arrange-plan');await page.locator('#close-dialog').click();});
    await check('Sequence zero gap validates its draft and applies in explicit reverse order',async()=>{await tool('arrange-menu','sequence');await page.locator('#arrange-frames').fill('-1');assert.equal(await page.locator('#arrange-preview').isEnabled(),false);await page.locator('#arrange-frames').fill('0');await page.locator('[data-arrange-order="bottom"]').click();await page.locator('[data-arrange-anchor="cursor"]').click();await page.locator('#arrange-preview').click();await page.waitForSelector('#apply-preview');await page.locator('#apply-preview').click();await page.waitForFunction(()=>document.getElementById('overlay').hidden&&document.getElementById('status').textContent.includes('Done'));assert.equal(host.comp.items[1].inPoint,4);assert.equal(host.comp.items[0].inPoint,6);});
    await page.locator('#open-settings').click();await tab('appearance');await page.locator('[data-pref="theme"][data-value="light"]').click();await screenshot(page,'settings-light');
    await check('language changes settings and main immediately and survives reopen',async()=>{await tab('data');await page.locator('[data-pref="language"][data-value="ru"]').click();assert.equal(await page.locator('#dialog-title').textContent(),'Настройки');assert.equal(await page.locator('html').getAttribute('lang'),'ru');await page.locator('#close-dialog').click();assert.match(await page.locator('#scope').textContent(),/Авто/);assert.match(await page.locator('#gap').textContent(),/Убрать паузу/);await screenshot(page,'main-russian');await page.locator('#open-settings').click();assert.equal(await page.locator('#dialog-title').textContent(),'Настройки');assert.equal(await page.locator('[data-pref="language"][data-value="ru"]').getAttribute('aria-pressed'),'true');});
    await check('large Russian text and settings fit 320x280 without horizontal overflow',async()=>{await page.setViewportSize({width:320,height:280});await tab('appearance');await page.locator('#pref-fontSize').evaluate(el=>{el.value='16';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await page.evaluate(()=>{const d=document.getElementById('dialog'),b=document.getElementById('dialog-body'),r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&b.scrollWidth<=b.clientWidth;}),true);await page.locator('#close-dialog').click();assert.equal(await fits(),true);await page.locator('#open-settings').click();await tab('appearance');await page.locator('#reset-appearance').click();});
    await check('Russian Arrange dialog with large text fits 320x280 and keeps keyboard focus',async()=>{await tab('appearance');await page.locator('#pref-fontSize').evaluate(el=>{el.value='16';el.dispatchEvent(new Event('input',{bubbles:true}));});await page.locator('#close-dialog').click();await tool('arrange-menu','sequence');await page.waitForSelector('#arrange-preview');assert.equal(await fits(),true);assert.equal(await page.evaluate(()=>{const b=document.getElementById('dialog-body');return b.scrollWidth<=b.clientWidth;}),true);await screenshot(page,'arrange-russian');await page.keyboard.press('Escape');assert.equal(await page.locator('#arrange-menu').evaluate(el=>document.activeElement===el),true);await page.locator('#open-settings').click();});
    await tab('data');await page.locator('[data-pref="language"][data-value="en"]').click();await page.locator('#close-dialog').click();
    await check('long mode labels and maximum frame step do not overflow',async()=>{await page.locator('#frames').fill('1000000');await page.locator('#frames').dispatchEvent('input');await mode('selectedKeys');assert.equal(await fits(),true);});
    await check('compact scope and mode buttons fit and tool groups stay in-flow',async()=>{
      const select=page.locator('[data-scope="selected"]');
      await select.click();
      assert.equal(await select.getAttribute('aria-pressed'),'true');
      await page.locator('[data-scope="auto"]').click();
      await page.locator('#time-menu').click();
      assert.equal(await page.locator('#overlay').isHidden(),true);
      assert.equal(await page.locator('#command-tools').isVisible(),true);
      assert.equal(await fits(),true);
      await page.locator('#time-menu-insert').focus();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#command-tools').isHidden(),true);
      assert.equal(await page.locator('#time-menu').evaluate(el=>document.activeElement===el),true);
    });
    await check('theme text contrast meets 4.5 to 1',async()=>{for(const theme of ['dark','light']){await page.locator('#open-settings').click();await tab('appearance');await page.locator('[data-pref="theme"][data-value="'+theme+'"]').click();const ratio=await page.evaluate(()=>{const style=getComputedStyle(document.body);return FFModel.contrast(style.getPropertyValue('--bg').trim(),style.getPropertyValue('--muted').trim());});assert.ok(ratio>=4.5,theme+' contrast '+ratio);await page.locator('#close-dialog').click();}});
    await check('invalid frame drafts still allow a read-only gap preview',async()=>{
      await page.locator('#frames').fill('');
      await page.locator('#preview-plan').click();
      assert.equal(await page.locator('#after-plus').isEnabled(),false);
      assert.equal(await page.locator('#gap').isEnabled(),true);
      await page.locator('#preview-plan').click();
      await page.locator('#frames').fill('12');
    });
    await check('offset hierarchy and label selection fit a narrow panel and leave AE unchanged',async()=>{
      const layer=host.comp.layer(1), source=layer.source, groups=host.groups();
      const child=new host.ctx.CompItem();
      Object.assign(child,{id:4001,name:'Browser fixture precomp with a long composition name',numLayers:0,duration:5});
      const labels=host.comp.items.map(item=>[item.property(1),item.property(1).keyLabel]);
      layer.source=child;for(const [property] of labels)property.keyLabel=()=>11;
      try{
        await page.locator('#open-settings').click();
        await tab('workflow');
        await page.locator('#open-offset-options').click();
        await page.locator('#use-selected-labels').click();
        await page.waitForSelector('[data-label-id="11"][aria-pressed="true"]');
        await page.locator('#inspect-precomps').click();
        await page.waitForSelector('#hierarchy-depth');
        assert.match(await page.locator('#dialog-body').textContent(),/Browser fixture precomp/);
        assert.equal(await page.locator('#dialog-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
        await page.locator('#hierarchy-depth input[value="1"]').check();
        await page.locator('#use-hierarchy-depth').click();
        assert.equal(await page.locator('#offset-depth').inputValue(),'1');
        await page.locator('#offset-depth').fill('0'); // Preserve the original scope for the catalogue checks.
        await page.locator('#close-dialog').click();
        assert.equal(host.groups(),groups);
      }finally{
        layer.source=source;for(const [property,previous] of labels){if(previous)property.keyLabel=previous;else delete property.keyLabel;}
      }
    });
    await check('favorites and In/Out + Keys stay reachable at 320 px',async()=>{
      await page.setViewportSize({width:320,height:280});
      const groups=host.groups();
      await page.locator('#frames').fill('31');
      await tool('time-menu','favorite-step');
      assert.equal(await page.locator('#presets [data-step="31"]').count(),1);
      await mode('edges');
      await page.locator('#after-plus').click();
      await page.waitForSelector('#apply-preview');
      assert.equal(host.groups(),groups);
      assert.equal(await fits(),true);
      assert.equal(await page.locator('#overlay').isHidden(),true);
      await page.locator('#close-offset-plan').click();
      await mode('offset');
    });
    await check('key-order conflicts offer a checked skip at 320 px without editing the scene',async()=>{
      const [first,second]=host.comp.items, groups=host.groups(), time=host.comp.time, out=first.outPoint, starts=[first.inPoint,second.inPoint];
      const keyTimes=host.comp.items.map(layer=>layer.keys.map(key=>key.time));
      try{
        host.comp.time=53/24;first.outPoint=6;first.inPoint=0;second.inPoint=0;
        first.keys.forEach((key,i)=>{key.time=[50,54,80][i]/24;});
        second.keys.forEach((key,i)=>{key.time=[1,20,30][i]/24;});
        await page.locator('#frames').fill('5');
        await page.locator('#before-plus').click();
        await page.waitForSelector('#preview-without-conflicts',{timeout:5000});
        assert.equal(await page.locator('#apply-preview').isEnabled(),false);
        await page.locator('#preview-without-conflicts').click();
        await page.waitForFunction(()=>!document.getElementById('apply-preview').disabled);
        assert.equal(host.groups(),groups);
        assert.equal(await fits(),true);
        assert.equal(await page.locator('#overlay').isHidden(),true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#offset-plan').isHidden(),true);
      }finally{
        host.comp.time=time;first.inPoint=starts[0];first.outPoint=out;second.inPoint=starts[1];
        host.comp.items.forEach((layer,i)=>layer.keys.forEach((key,j)=>{key.time=keyTimes[i][j];}));
      }
    });
    const fixtureRoot=path.join(output,'extension-with-extra-commands');fs.cpSync(path.join(root,'extension'),fixtureRoot,{recursive:true});
    const extraGroups=[{id:'tools',element:'tools-menu',title:['Tools','Инструменты']}],base={op:'arrange',form:'none',title:['Align tail','Конец к курсору'],args:{action:'alignOut',order:'top',anchor:'cursor',frames:1},context:['scope'],parameters:[],preview:'required'},extraCommands=[{...base,id:'alignTailShortcut',surface:'toolbar'},{...base,id:'tailInTools',surface:'menu',group:'tools'}];
    fs.appendFileSync(path.join(fixtureRoot,'js/commands.js'),'\nwindow.FFCommands=FFCommands.create(FFCommands.groups().concat('+JSON.stringify(extraGroups)+'),FFCommands.all().concat('+JSON.stringify(extraCommands)+'));\n');
    await page.setViewportSize({width:360,height:290});await page.goto('file://'+path.join(fixtureRoot,'index.html'));await page.waitForFunction(()=>document.getElementById('connection').textContent==='AE');
    await check('a catalogue-only toolbar command inherits theme and captured-plan application',async()=>{assert.equal(await fits(),true);assert.equal(await page.locator('#alignTailShortcut').getAttribute('class'),await page.locator('#gap').getAttribute('class'));const groups=host.groups();await page.locator('#alignTailShortcut').click();await page.waitForSelector('#apply-preview');assert.equal(host.groups(),groups);await page.locator('#apply-preview').click();await page.waitForFunction(()=>document.getElementById('overlay').hidden&&document.getElementById('status').textContent.includes('Done'));assert.deepEqual(host.comp.items.map(l=>l.outPoint),[4,4]);assert.equal(host.groups(),groups+1);});
    await check('a catalogue-only button group localizes and stays usable at narrow widths',async()=>{await page.setViewportSize({width:320,height:280});await tool('tools-menu','tailInTools');await page.waitForSelector('#apply-preview');await page.locator('#close-dialog').click();await page.locator('#open-settings').click();await tab('data');await page.locator('[data-pref="language"][data-value="ru"]').click();await page.locator('#close-dialog').click();assert.equal(await page.locator('#tools-menu').textContent(),'Инструменты');assert.equal(await fits(),true);await page.locator('#tools-menu').click();assert.equal(await page.locator('#tools-menu-actions [data-choice="tailInTools"]').textContent(),'Конец к курсору');await screenshot(page,'custom-commands-russian');await page.keyboard.press('Escape');assert.equal(await page.locator('#tools-menu').evaluate(el=>document.activeElement===el),true);});
    await check('settings show two columns on a wide panel, with neutral colors and exact values',async()=>{
      await page.setViewportSize({width:820,height:560});
      await page.locator('#open-settings').click();
      await tab('appearance');
      await page.locator('[data-pref="theme"][data-value="dark"]').click();
      await page.locator('#value-spacing').fill('0');
      assert.equal(await page.locator('#pref-spacing').inputValue(),'0');
      const review=await page.evaluate(()=>{
        const [a,b]=[...document.querySelectorAll('#settings-appearance .settings-card')].map(el=>el.getBoundingClientRect());
        const style=getComputedStyle(document.body);
        const neutral=['--bg','--surface','--raised','--hover','--border','--text','--muted','--accent','--warning','--danger'].every(key=>{
          const hex=style.getPropertyValue(key).trim().replace(/^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,'#$1$1$2$2$3$3');
          return /^#([a-f0-9]{2})\1\1$/i.test(hex);
        });
        return {columns:b.left>a.left&&b.top===a.top,neutral,gap:style.getPropertyValue('--gap').trim()};
      });
      assert.deepEqual(review,{columns:true,neutral:true,gap:'0px'});
      await screenshot(page,'settings-wide-dark');
      await page.locator('#close-dialog').click();
    });
    await check('no unhandled browser errors',async()=>assert.deepEqual(pageErrors,[]));await context.close();
  }finally{await browser.close();}
  results.status=errors.length?'fail':'pass';results.passed=results.checks.filter(x=>x.status==='pass').length;results.failed=errors.length;
  fs.writeFileSync(path.join(output,'browser-result.json'),JSON.stringify(results,null,2)+'\n');console.log('FF_BROWSER_RESULT '+JSON.stringify(results));for(const name of results.screenshots)logScreenshot(name);if(errors.length)throw Error(errors.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1;});

