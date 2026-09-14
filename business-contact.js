(function () {
  'use strict';
  // This module receives corporate facts only. It never reads the isolated HVAC session.
  const apiBase = String((window.NOVIRAM_AGENT_CONFIG || {}).apiBaseUrl || '').replace(/\/$/, '');
  const pageContext = document.body.dataset.agentPageContext === 'lead_engine_product_page' ? 'lead_engine_product_page' : 'corporate_home';
  const copy = {
    hu: {title: 'Egyeztessünk a projektről', intro: 'Az AI-asszisztens nélkül is írhat nekünk. Töltse ki az űrlapot; a megkeresést csak az Elküldöm a Noviramnak gombbal küldi el.', name: 'Név', email: 'E-mail', phone: 'Telefon (nem kötelező)', company: 'Cégnév (nem kötelező)', summary: 'Projektösszefoglaló (elküldés előtt szerkeszthető)', summaryHelp: 'Az összefoglalóval együtt azokat a projektadatokat is elküldjük, amelyeket a Noviram AI felismert. A HVAC demó beszélgetése és adatai nem kerülnek bele.', privacy: 'Az elküldéssel megadott kapcsolati és projektadatait a Noviram a megkeresés megválaszolására kezeli és céges e-mail-címére továbbítja. Ez nem hírlevél-feliratkozás.', privacyLink: 'Adatkezelés', send: 'Elküldöm a Noviramnak', pending: 'Küldés folyamatban…', sent: 'A levelezési szolgáltató átvette a megkeresést a Noviram részére. Ez még nem igazolja a postaládába érkezést vagy az elolvasást.', mock: 'Tesztüzem: nem küldtünk e-mailt. A rendszer csak az adatokat ellenőrizte. Valódi megkereséshez nyissa meg a saját levelezőjét az alábbi hivatkozással.', failed: 'Nem sikerült megerősíteni a küldést. Az adatai itt maradtak. Megpróbálhatja újra, vagy másolja ki az összefoglalót és írjon e-mailt.', invalid: 'Adja meg a nevét és egy érvényes e-mail-címet.', copy: 'Összefoglaló másolása', copied: 'Az összefoglaló másolva.', fallback: 'Saját levelező megnyitása', close: 'Bezárás', subject: 'Noviram üzleti megkeresés', leadSummary: 'Szeretném átbeszélni, hogyan használhatnánk a Lead Engine-t a cégünknél.', honeypot: 'Weboldal — hagyja üresen', warning: 'Ne adjon meg bizalmas vagy különleges személyes adatot.'},
    en: {title: 'Let’s discuss your project', intro: 'Contact us directly if you prefer; an AI conversation is not required. Your business enquiry is sent to Noviram only when you explicitly submit below.', name: 'Name', email: 'Email', phone: 'Phone (optional)', company: 'Company name (optional)', summary: 'Project summary — review and edit', summaryHelp: 'We send this together with project facts recognised by the corporate AI. The HVAC demo conversation and its data are not part of this enquiry.', privacy: 'Noviram uses the contact and project details you submit to respond to your enquiry and forwards them to its company email address. This is not a newsletter subscription.', privacyLink: 'Privacy', send: 'Send to Noviram', pending: 'Sending…', sent: 'The email service accepted your enquiry for Noviram. This does not yet confirm inbox delivery or that it has been read.', mock: 'Development simulation: no email was sent. The test receiver validated the details; use the email option for a real enquiry.', failed: 'We could not confirm sending. Your details are still here. Retry, or copy the summary and send an email.', invalid: 'Enter your name and a valid email address.', copy: 'Copy summary', copied: 'Summary copied.', fallback: 'Open your email app', close: 'Close', subject: 'Noviram business enquiry', leadSummary: 'I would like to discuss using Noviram Lead Engine for my business.', honeypot: 'Website — leave blank', warning: 'Do not provide confidential or sensitive personal information.'}
  };
  let language = document.documentElement.lang === 'en' ? 'en' : 'hu';
  let pending = false, result = '', snapshot = {}, summaryEdited = false, interestedInLeadEngine = false;
  let productContext = null;
  const text = () => copy[language];
  const dialog = document.createElement('dialog');
  dialog.id = 'businessEnquiry';
  dialog.className = 'business-enquiry';
  dialog.setAttribute('aria-labelledby', 'businessEnquiryTitle');
  dialog.innerHTML = '<div class="business-enquiry-head"><h2 id="businessEnquiryTitle" data-contact-label="title"></h2><button type="button" class="business-close" data-contact-close>×</button></div><p class="business-enquiry-intro" data-contact-label="intro"></p><form id="businessEnquiryForm" novalidate><div class="business-fields"><label><span data-contact-label="name"></span><input id="businessName" name="name" autocomplete="name" maxlength="120" required></label><label><span data-contact-label="email"></span><input id="businessEmail" name="email" type="email" autocomplete="email" maxlength="254" required></label><label><span data-contact-label="phone"></span><input id="businessPhone" name="phone" type="tel" autocomplete="tel" maxlength="60"></label><label><span data-contact-label="company"></span><input id="businessCompany" name="company" autocomplete="organization" maxlength="160"></label></div><label class="business-summary-label"><span data-contact-label="summary"></span><textarea id="businessSummary" name="projectSummary" maxlength="4000" rows="6" aria-describedby="businessSummaryHelp"></textarea></label><p id="businessSummaryHelp" class="business-fine" data-contact-label="summaryHelp"></p><div class="business-honeypot" aria-hidden="true"><label><span data-contact-label="honeypot"></span><input name="website" tabindex="-1" autocomplete="off" maxlength="200"></label></div><p class="business-fine"><span data-contact-label="warning"></span></p><p class="business-fine"><span data-contact-label="privacy"></span> <a data-noviram-legal="privacy" data-contact-label="privacyLink"></a></p><p class="business-result" id="businessEnquiryResult" role="status" aria-live="polite" tabindex="-1" hidden></p><button class="btn btn-primary business-submit" id="businessSubmit" type="submit" data-contact-label="send"></button><div class="business-fallbacks"><button class="btn btn-ghost" id="businessCopy" type="button" data-contact-label="copy"></button><a class="business-mail" id="businessMail" data-contact-label="fallback"></a></div><p class="business-fine" id="businessCopyFeedback" aria-live="polite"></p></form>';
  document.body.appendChild(dialog);
  const form = dialog.querySelector('form');
  const summary = dialog.querySelector('#businessSummary');
  const status = dialog.querySelector('#businessEnquiryResult');
  const submit = dialog.querySelector('#businessSubmit');
  const field = (name) => form.elements.namedItem(name);
  function mailText() {
    return [text().name + ': ' + field('name').value, text().email + ': ' + field('email').value, text().phone + ': ' + field('phone').value, text().company + ': ' + field('company').value, '', summary.value].join('\n');
  }
  function refreshMail() {
    dialog.querySelector('#businessMail').href = 'mailto:info@noviram.com?subject=' + encodeURIComponent(text().subject) + '&body=' + encodeURIComponent(mailText());
  }
  function render() {
    dialog.querySelectorAll('[data-contact-label]').forEach((element) => { element.textContent = text()[element.dataset.contactLabel]; });
    dialog.querySelector('[data-contact-close]').setAttribute('aria-label', text().close);
    window.NoviramLanguage?.refreshLinks(language);
    submit.disabled = pending || result === 'sent';
    form.querySelectorAll('input, textarea').forEach((input) => { input.disabled = pending; });
    submit.textContent = pending ? text().pending : text().send;
    form.setAttribute('aria-busy', String(pending));
    status.hidden = !result;
    status.textContent = result ? text()[result] : '';
    status.dataset.state = result;
    refreshMail();
  }
  function open(interest, cta) {
    if (!pending) {
      const completedDemo = interest === 'lead_engine_demo';
      productContext = completedDemo && ['demo_product_interest','demo_product_discuss'].includes(cta)
        ? {product:'lead_engine',source:'hvac_demo',demo_completed:true,cta} : null;
      // This entry point receives only a semantic product-interest flag. Never
      // read the HVAC session or accept homeowner fields from an event payload.
      snapshot = completedDemo ? {service_interest:['lead_engine']} : window.NoviramCorporateContact?.snapshot() || {};
      interestedInLeadEngine = interestedInLeadEngine || interest === 'lead_engine';
      if (interestedInLeadEngine) snapshot.service_interest = [...new Set([...(snapshot.service_interest || []), 'lead_engine'])];
      if (!summaryEdited) {
        const generated = completedDemo
          ? (language === 'hu' ? 'Megnéztem a Noviram Lead Engine HVAC minősítési demóját. Hasonló érdeklődő-kezelési és minősítési rendszert szeretnék megismerni a saját vállalkozásom számára.' : 'I have completed the Noviram Lead Engine HVAC qualification demo. I would like to explore a similar enquiry-handling and qualification system for my own business.')
          : window.NoviramCorporateContact?.summary() || '';
        summary.value = (generated || (interestedInLeadEngine ? text().leadSummary : '')).slice(0, 4000);
        if (interestedInLeadEngine && !summary.value.includes('Lead Engine')) summary.value = (text().leadSummary + '\n\n' + summary.value).slice(0, 4000);
      }
    }
    render();
    if (!dialog.open) dialog.showModal();
    field('name').focus();
  }
  dialog.querySelector('[data-contact-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-noviram-contact]');
    if (trigger) { event.preventDefault(); open(trigger.dataset.noviramContact); }
  });
  window.addEventListener('noviram:contact', (event) => open(event.detail?.interest,event.detail?.cta));
  form.addEventListener('input', (event) => {
    if (event.target === summary) summaryEdited = true;
    event.target.removeAttribute('aria-invalid');
    if (!pending) result = '';
    render();
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    const invalid = !field('name').value.trim() ? field('name') : (!field('email').validity.valid || !field('email').value.trim() ? field('email') : null);
    if (invalid) { result = 'invalid'; render(); invalid.setAttribute('aria-invalid', 'true'); invalid.focus(); return; }
    const contact = {name: field('name').value.trim(), email: field('email').value.trim()};
    if (field('phone').value.trim()) contact.phone = field('phone').value.trim();
    if (field('company').value.trim()) contact.company = field('company').value.trim();
    pending = true; result = 'pending'; render();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(apiBase + '/api/leads/submit', {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept-Language': language}, signal: controller.signal, body: JSON.stringify({language, contact, state: snapshot, ...(productContext?{productContext}:{}), projectSummary: summary.value, pageContext, website: field('website').value})});
      const data = await response.json().catch(() => null);
      // Do not infer delivery from HTTP 2xx alone, or from a mock response.
      if (!response.ok || !data) throw new Error('submission_failed');
      if (data.status === 'sent' && data.delivered === true) result = 'sent';
      else if (data.status === 'mock' && data.delivered === false) result = 'mock';
      else throw new Error('unconfirmed_submission');
    } catch (_) { result = 'failed'; }
    finally { clearTimeout(timeout); pending = false; render(); if (dialog.open) status.focus(); }
  });
  dialog.querySelector('#businessCopy').addEventListener('click', async () => {
    const feedback = dialog.querySelector('#businessCopyFeedback');
    try { await navigator.clipboard.writeText(mailText()); feedback.textContent = text().copied; }
    catch (_) { feedback.textContent = mailText(); }
  });
  window.addEventListener('noviram:corporatereset', () => {
    if (pending) return;
    snapshot = {}; summary.value = ''; summaryEdited = false; interestedInLeadEngine = false; result = '';
    productContext = null;
    dialog.querySelector('#businessCopyFeedback').textContent = '';
    render();
  });
  window.addEventListener('noviram:languagechange', (event) => { language = event.detail?.language === 'en' ? 'en' : 'hu'; render(); });
  render();
})();
