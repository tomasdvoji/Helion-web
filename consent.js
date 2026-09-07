/*
 * HELION.CZ — souhlas s cookies + Google Consent Mode v2
 * ---------------------------------------------------------------------------
 * Vkládat do <head> jako PRVNÍ skript — před GTM i před attribution.js.
 * Musí stihnout nastavit výchozí stav souhlasu dřív, než se načte měření.
 *
 * Právní rámec:
 *   § 89 odst. 3 zák. č. 127/2005 Sb. — pro neesenciální cookies je nutný
 *   předchozí souhlas (opt-in). Výchozí stav je proto "denied" a nic se
 *   nespustí, dokud návštěvník aktivně nesouhlasí.
 *
 *   Odmítnutí musí být stejně snadné jako souhlas — proto jsou obě tlačítka
 *   vizuálně rovnocenná. "Odmítnout" schované pod odkazem je opakovaně
 *   pokutovaná praktika.
 *
 * Bez závislostí, ~5 kB včetně stylů.
 */
(function () {
  'use strict';

  var KEY = 'helion_consent';
  var MONTHS = 12;

  /* ---------- 1) Výchozí stav PŘED načtením měření ---------- */

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (!d || !d.ts || Date.now() - d.ts > MONTHS * 30 * 864e5) return null;
      return d;
    } catch (e) { return null; }
  }

  var saved = load();

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function apply(state, isUpdate) {
    var g = state.analytics ? 'granted' : 'denied';
    var a = state.marketing ? 'granted' : 'denied';
    gtag('consent', isUpdate ? 'update' : 'default', {
      analytics_storage: g,
      ad_storage: a,
      ad_user_data: a,
      ad_personalization: a,
      functionality_storage: state.analytics ? 'granted' : 'denied',
      personalization_storage: a
    });
    window.dataLayer.push({
      event: 'consent_resolved',
      consent_analytics: state.analytics,
      consent_marketing: state.marketing
    });
  }

  if (saved) apply(saved, true);

  function save(analytics, marketing) {
    var state = { analytics: !!analytics, marketing: !!marketing, ts: Date.now(), v: 1 };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    apply(state, true);
    return state;
  }

  /* Znovuotevření z patičky: <a href="#" onclick="helionConsent.open();return false"> */
  window.helionConsent = {
    open: function () { render(true); },
    state: function () { return load(); },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} render(true); }
  };

  if (saved) return; // souhlas už je, lištu nezobrazujeme

  /* ---------- 2) Lišta ---------- */

  var CSS = [
    '.hc-ovl{position:fixed;inset:0;background:rgba(15,20,28,.45);z-index:2147483646;display:flex;align-items:flex-end;justify-content:center}',
    '.hc{background:#fff;color:#16202c;max-width:640px;width:100%;margin:16px;border-radius:10px;',
    'box-shadow:0 12px 40px rgba(0,0,0,.28);padding:24px;font:15px/1.55 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}',
    '.hc h2{margin:0 0 10px;font-size:18px;line-height:1.3}',
    '.hc p{margin:0 0 14px;color:#3d4756}',
    '.hc a{color:#2c3e9e}',
    '.hc-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}',
    '.hc-btn{flex:1 1 160px;padding:12px 18px;border-radius:7px;border:1px solid #2c3e9e;background:#2c3e9e;color:#fff;',
    'font:600 15px/1 system-ui,sans-serif;cursor:pointer}',
    '.hc-btn.sec{background:#fff;color:#2c3e9e}',
    '.hc-btn:hover{opacity:.9}',
    '.hc-btn:focus-visible{outline:3px solid #9aa8e8;outline-offset:2px}',
    '.hc-link{background:none;border:0;color:#5a6472;text-decoration:underline;cursor:pointer;font:14px/1 system-ui,sans-serif;padding:10px 4px}',
    '.hc-opt{display:flex;gap:10px;align-items:flex-start;padding:12px 0;border-top:1px solid #e3e7ee}',
    '.hc-opt input{margin-top:3px;width:18px;height:18px;flex:none}',
    '.hc-opt b{display:block;font-size:14px}',
    '.hc-opt span{font-size:13.5px;color:#5a6472}',
    '@media(prefers-color-scheme:dark){.hc{background:#161c26;color:#e7ebf2}.hc p{color:#b3bccb}',
    '.hc-btn.sec{background:#161c26;color:#93a6f0;border-color:#93a6f0}.hc-btn{background:#3b52c4;border-color:#3b52c4}',
    '.hc-opt{border-top-color:#2a3341}.hc-opt span{color:#818c9e}.hc a{color:#93a6f0}}'
  ].join('');

  function render(showDetail) {
    if (document.getElementById('hc-ovl')) return;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var ovl = document.createElement('div');
    ovl.className = 'hc-ovl';
    ovl.id = 'hc-ovl';
    ovl.setAttribute('role', 'dialog');
    ovl.setAttribute('aria-modal', 'true');
    ovl.setAttribute('aria-labelledby', 'hc-title');

    var detail = showDetail
      ? '<div class="hc-opt"><input type="checkbox" id="hc-a" checked>' +
        '<label for="hc-a"><b>Analytické</b><span>Měření návštěvnosti webu. Pomáhá nám zjistit, které stránky jsou užitečné.</span></label></div>' +
        '<div class="hc-opt"><input type="checkbox" id="hc-m" checked>' +
        '<label for="hc-m"><b>Marketingové</b><span>Měření účinnosti reklamy. Bez nich nevíme, která reklama přivedla poptávku.</span></label></div>'
      : '';

    ovl.innerHTML =
      '<div class="hc">' +
        '<h2 id="hc-title">Souhlas s cookies</h2>' +
        '<p>Nezbytné cookies používáme vždy — bez nich by web nefungoval. ' +
        'Analytické a marketingové použijeme jen s vaším souhlasem. ' +
        'Souhlas můžete kdykoli změnit v patičce webu.</p>' +
        detail +
        '<div class="hc-btns">' +
          '<button class="hc-btn" id="hc-all" type="button">Přijmout vše</button>' +
          '<button class="hc-btn sec" id="hc-none" type="button">Odmítnout vše</button>' +
          (showDetail ? '<button class="hc-btn sec" id="hc-sel" type="button">Uložit výběr</button>' : '') +
        '</div>' +
        (showDetail ? '' : '<button class="hc-link" id="hc-more" type="button">Nastavit podrobně</button>') +
      '</div>';

    document.body.appendChild(ovl);

    function close() { ovl.remove(); st.remove(); }

    document.getElementById('hc-all').onclick = function () { save(true, true); close(); };
    document.getElementById('hc-none').onclick = function () { save(false, false); close(); };
    var more = document.getElementById('hc-more');
    if (more) more.onclick = function () { close(); render(true); };
    var sel = document.getElementById('hc-sel');
    if (sel) sel.onclick = function () {
      save(document.getElementById('hc-a').checked, document.getElementById('hc-m').checked);
      close();
    };

    document.getElementById('hc-all').focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { render(false); });
  } else {
    render(false);
  }
})();
