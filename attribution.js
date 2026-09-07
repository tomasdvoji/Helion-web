/*
 * HELION.CZ — sběr atribučních parametrů
 * ---------------------------------------------------------------------------
 * Zachytí klikací ID a UTM parametry při PRVNÍ návštěvě a udrží je,
 * dokud návštěvník neodešle poptávku. Bez toho nelze uzavřenou zakázku
 * spárovat s reklamou, která ji přivedla.
 *
 * Vkládat do <head> PŘED GTM, aby stihl zachytit i rychlé odchody.
 * Bez závislostí, ~3 kB.
 *
 * Co dělá:
 *   1. při vstupu uloží gclid / gbraid / wbraid / msclkid / fbclid + utm_*
 *   2. drží first-touch (co přivedlo poprvé) i last-touch (poslední zdroj)
 *   3. platnost 90 dní — u firemních zakázek je cyklus v měsících
 *   4. při odeslání formuláře doplní skrytá pole a pošle dataLayer událost
 *
 * POZOR na referrer: formulář nesmí odesílat přes cizí doménu ani
 * přesměrování, které referrer zahodí. Přesně kvůli tomu skončilo
 * v dubnu 2025 čtrnáct ze sedmnácti poptávek v kanálu "Direct".
 */
(function () {
  'use strict';

  var KEY = 'helion_attr';
  var DAYS = 90;
  var CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid', 'ttclid'];
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function now() { return Date.now(); }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || !d.first || now() - d.first.ts > DAYS * 864e5) return null;
      return d;
    } catch (e) { return null; }
  }

  function write(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* private mode */ }
  }

  /* Vytáhne z aktuální URL vše, co vypadá jako reklamní zdroj. */
  function touchFromUrl() {
    var q = new URLSearchParams(location.search);
    var t = { ts: now(), lp: location.pathname, ref: document.referrer || '' };
    var found = false;

    CLICK_IDS.forEach(function (k) {
      var v = q.get(k);
      if (v) { t[k] = v.slice(0, 200); found = true; }
    });
    UTMS.forEach(function (k) {
      var v = q.get(k);
      if (v) { t[k] = v.slice(0, 100); found = true; }
    });

    /* Bez parametrů odvodíme zdroj z referreru, ať nekončí všechno jako Direct. */
    if (!found) {
      var r = t.ref;
      if (!r) return null;
      var host;
      try { host = new URL(r).hostname.replace(/^www\./, ''); } catch (e) { return null; }
      if (host === location.hostname.replace(/^www\./, '')) return null; // vlastní web
      t.utm_source = host;
      t.utm_medium = /google|seznam|bing|duckduckgo|ecosia/.test(host) ? 'organic' : 'referral';
      found = true;
    }
    return found ? t : null;
  }

  var store = read() || {};
  var touch = touchFromUrl();

  if (touch) {
    if (!store.first) store.first = touch;   // co přivedlo poprvé — už se nepřepisuje
    store.last = touch;                       // poslední zdroj před konverzí
    store.visits = (store.visits || 0) + 1;
    write(store);
  } else if (!store.first) {
    /* Přímý vstup bez jakéhokoli zdroje — zaznamenáme, ať víme, že to byl opravdu Direct. */
    store.first = { ts: now(), lp: location.pathname, ref: '', utm_source: '(direct)', utm_medium: '(none)' };
    store.last = store.first;
    store.visits = 1;
    write(store);
  }

  /* ---- zpřístupnění pro formulář a GTM ---- */

  function flat() {
    var f = store.first || {}, l = store.last || {}, out = {};
    CLICK_IDS.concat(UTMS).forEach(function (k) {
      if (f[k]) out['first_' + k] = f[k];
      if (l[k]) out[k] = l[k];              // last-touch bez prefixu = hlavní hodnota
    });
    out.first_landing = f.lp || '';
    out.first_referrer = f.ref || '';
    out.first_seen = f.ts ? new Date(f.ts).toISOString() : '';
    out.visits = store.visits || 1;
    return out;
  }

  window.helionAttribution = flat;

  /* Doplní skrytá pole do formuláře. Volat i po dynamickém vykreslení. */
  function fillForm(form) {
    if (!form || form.dataset.attrFilled) return;
    var data = flat();
    Object.keys(data).forEach(function (k) {
      if (form.elements[k]) { form.elements[k].value = data[k]; return; }
      var i = document.createElement('input');
      i.type = 'hidden';
      i.name = k;
      i.value = data[k];
      form.appendChild(i);
    });
    form.dataset.attrFilled = '1';
  }

  window.helionFillForm = fillForm;

  function init() {
    var forms = document.querySelectorAll('form#inquiry-form, form[data-track="lead"]');
    Array.prototype.forEach.call(forms, function (form) {
      fillForm(form);
      /* Před odesláním doplnit znovu — mezi načtením stránky a odesláním
         mohl člověk projít další stránky a last-touch se změnil. */
      form.addEventListener('submit', function () { fillForm(form); });
    });
  }

  /* KONVERZI TENHLE SOUBOR NEHLÁSÍ — dělá to form.js, až když server
     potvrdí uložení.

     Dřív se generate_lead pushovalo rovnou odsud při odeslání formuláře.
     Dávalo to smysl v době, kdy web žádný backend neměl a poptávka končila
     v mailto: — jinak by se nezměřilo nic. Od chvíle, kdy se poptávka
     odesílá na endpoint, by to ale znamenalo dvě konverze na jednu poptávku
     a hlášení úspěchu i tehdy, když se odeslání nepovedlo. Reklama by se
     učila na číslech, která neodpovídají skutečnosti. */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
