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
  function actionButton({id,text,variant='secondary',symbol,onClick}){
    if(!['secondary','quiet','primary'].includes(variant))throw Error('Invalid button variant.');
    const b=document.createElement('button');b.id=id;b.setAttribute('id',id);b.type='button';b.className=variant+'-button';
    b.innerHTML=(symbol?icon(symbol):'')+'<span data-button-label="true">'+escape(text)+'</span>';
    b.onclick=onClick;return b;
  }
  root.FFUI={escape,icon,html,text,attribute,label,actionButton};
}(window));
