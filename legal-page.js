(function(){
  'use strict';
  const api=window.NoviramLanguage;
  const language=api?api.resolve():'hu';
  const kind=document.documentElement.dataset.legalKind;
  const routes={terms:{hu:'aszf.html',en:'terms.html'},privacy:{hu:'adatkezeles.html',en:'privacy.html'}};
  const target=routes[kind]&&routes[kind][language];
  if(target&&location.pathname.split('/').pop()!==target){
    const next=new URL(target,location.href);next.searchParams.set('lang',language);next.hash=location.hash;location.replace(next.href);return;
  }
  function render(){
    if(api)api.apply(language);else document.documentElement.lang=language;
    document.querySelectorAll('[data-company-language]').forEach(el=>{el.hidden=el.dataset.companyLanguage!==language;});
    document.querySelectorAll('[data-legal-language]').forEach(el=>{if(el.dataset.legalLanguage===language)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    if(kind==='company'){
      document.title=(language==='en'?'Company details':'Cégadatok')+' — Noviram Digital Kft.';
      const meta=document.querySelector('meta[name="description"]');
      if(meta)meta.content=language==='en'?'Company and contact details of Noviram Digital Kft.':'A Noviram Digital Kft. cégadatai és elérhetősége.';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
