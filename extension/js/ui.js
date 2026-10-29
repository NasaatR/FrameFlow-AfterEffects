/* Shared panel components. Product-specific actions belong in the command catalogue. */
(function(root){
  'use strict';
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const htmlCache=new WeakMap();
  function html(node,value){if(htmlCache.get(node)!==value){node.innerHTML=value;htmlCache.set(node,value);}}
  function text(node,value){value=String(value);if(node.textContent!==value)node.textContent=value;}
  function attribute(node,key,value){value=String(value);if(node.getAttribute(key)!==value)node.setAttribute(key,value);}
  function icon(id){if(!/^[a-z][a-z0-9-]*$/.test(id))throw Error('Invalid icon.');return '<svg aria-hidden="true"><use href="#i-'+id+'"/></svg>';}
  function label(button,value){text(button.querySelector('[data-button-label]'),value);}
  function actionButton({id,text,variant='secondary',symbol,menu=false,onClick}){
    if(!['secondary','quiet','primary'].includes(variant))throw Error('Invalid button variant.');
    const b=document.createElement('button');b.id=id;b.setAttribute('id',id);b.type='button';b.className=variant+'-button';
    b.innerHTML=(symbol?icon(symbol):'')+'<span data-button-label="true">'+escape(text)+'</span>'+(menu?icon('chevron'):'');
    if(menu){b.setAttribute('aria-haspopup','menu');b.setAttribute('aria-expanded','false');}b.onclick=onClick;return b;
  }
  function menuItem(item,onClick){
    const b=document.createElement('button');b.type='button';b.disabled=!!item.disabled;if(item.note)b.className='with-note';b.setAttribute('role',item.active===undefined?'menuitem':'menuitemradio');
    if(item.active!==undefined)b.setAttribute('aria-checked',String(item.active));if(item.id)b.setAttribute('data-choice',item.id);
    b.innerHTML='<span class="menu-copy"><span>'+escape(item.label)+'</span>'+(item.note?'<small>'+escape(item.note)+'</small>':'')+'</span>'+(item.active?icon('check'):'');b.onclick=onClick;return b;
  }
  root.FFUI={escape,icon,html,text,attribute,label,actionButton,menuItem};
}(window));
