(function () {
  'use strict';
  const valid = (language) => language === 'hu' || language === 'en';
  function resolve() {
    const query = new URLSearchParams(location.search).get('lang');
    if (valid(query)) return query;
    try { const stored = localStorage.getItem('noviramLang'); if (valid(stored)) return stored; } catch (_) {}
    return 'hu';
  }
  function refreshLinks(language = document.documentElement.lang) {
    language = valid(language) ? language : resolve();
    const destinations = {terms: language === 'en' ? 'terms.html' : 'aszf.html', privacy: language === 'en' ? 'privacy.html' : 'adatkezeles.html', company: 'company-details.html'};
    document.querySelectorAll('[data-local-href], [data-noviram-legal]').forEach((link) => {
      const target = destinations[link.dataset.noviramLegal] || link.dataset.localHref;
      if (!target) return;
      const url = new URL(target, location.href);
      if (url.origin !== location.origin) return;
      url.searchParams.set('lang', language);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    });
  }
  function apply(language) {
    language = valid(language) ? language : resolve();
    document.documentElement.lang = language;
    try { localStorage.setItem('noviramLang', language); } catch (_) {}
    refreshLinks(language);
    return language;
  }
  window.NoviramLanguage = Object.freeze({resolve, apply, refreshLinks});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => apply(resolve()), {once: true});
  else apply(resolve());
})();
