/* MunVari — shared behaviour for content pages: theme and text size. */
(function(){
  const d=document.documentElement;
  try{const t=localStorage.getItem('munvari.theme');if(t)d.setAttribute('data-theme',t);const z=localStorage.getItem('munvari.size');if(z)d.setAttribute('data-size',z);}catch(e){}
  if(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())d.classList.add('is-app');
  window.toggleTheme=function(){
    const cur=d.getAttribute('data-theme');
    const dark=cur?cur==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    const nx=dark?'light':'dark'; d.setAttribute('data-theme',nx);
    try{localStorage.setItem('munvari.theme',nx);}catch(e){}
  };
  window.toggleSize=function(){
    const on=d.getAttribute('data-size')!=='lg';
    if(on)d.setAttribute('data-size','lg');else d.removeAttribute('data-size');
    const b=document.getElementById('sizeBtn');if(b)b.setAttribute('aria-pressed',on);
    try{on?localStorage.setItem('munvari.size','lg'):localStorage.removeItem('munvari.size');}catch(e){}
  };
  document.addEventListener('DOMContentLoaded',()=>{const b=document.getElementById('sizeBtn');if(b)b.setAttribute('aria-pressed',d.getAttribute('data-size')==='lg');});
})();
