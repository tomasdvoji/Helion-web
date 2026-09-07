/*
 * HELION.CZ — měření konfigurátoru FVE
 * ---------------------------------------------------------------------------
 * Vkládat na konec <body> stránky konfigurator.html, za js/main.js.
 *
 * Proč zvlášť: attribution.js se věší na form#inquiry-form, ale konfigurátor
 * žádný formulář neodesílá — má jen tlačítko #lead-odeslat s vlastním
 * onclick, který skládá mailto:. Bez tohohle souboru zůstane nejhodnotnější
 * poptávka na webu úplně neměřená.
 *
 * Co dělá:
 *   1. zapamatuje si, kterou ze tří variant člověk vybral, a vyčte z karty
 *      cenu po dotaci a výkon — konverze tím dostane peněžní hodnotu,
 *      ne jen "přišel lead"
 *   2. při odeslání pošle generate_lead do dataLayeru se stejnou strukturou
 *      jako attribution.js, takže to mereni.js rozešle do GA4 i do Mety
 *
 * Poslouchá v capture fázi, aby doběhl dřív, než původní onclick nastaví
 * location.href na mailto:.
 *
 * POZNÁMKA: dokud konfigurátor odesílá přes mailto:, je tohle měření
 * záměru, ne doručené poptávky — na mobilu a ve webmailu se zpráva
 * často neodešle. Čísla proto budou nadhodnocená. Skutečné řešení je
 * přepnout odesílání na endpoint (§9 předávacího dokumentu); do té doby
 * je lepší měřit se známou chybou než neměřit vůbec.
 */
(function () {
  'use strict';

  var vybranaKarta = null;

  function cislo(text) {
    /* ceny jsou formátované s mezerami (i pevnými) — nechat jen číslice */
    var d = (text || '').replace(/[^\d]/g, '');
    return d ? parseInt(d, 10) : null;
  }

  function zKarty(karta) {
    if (!karta) return {};
    var out = {};

    /* .cena obsahuje "123 456 Kč" a pak <small> s rozpisem — brát jen
       první textový uzel, jinak se sečte i cena s DPH z rozpisu */
    var cena = karta.querySelector('.cena');
    if (cena) {
      var prvni = '';
      for (var i = 0; i < cena.childNodes.length; i++) {
        var n = cena.childNodes[i];
        if (n.nodeType === 3) prvni += n.nodeValue;
        else if (n.nodeName === 'SMALL') break;
      }
      out.value = cislo(prvni);
    }

    var polozky = karta.querySelectorAll('li');
    for (var j = 0; j < polozky.length; j++) {
      var s = polozky[j].querySelector('span'), b = polozky[j].querySelector('b');
      if (!s || !b) continue;
      var popis = s.textContent.toLowerCase();
      if (popis.indexOf('výkon') === 0) out.kwp = b.textContent.trim();
      if (popis.indexOf('baterie') === 0) out.baterie = b.textContent.trim();
    }

    var h3 = karta.querySelector('h3');
    if (h3) out.varianta = h3.textContent.trim();
    return out;
  }

  /* 1) která varianta — karty vznikají až po výpočtu, proto delegovaně */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('button[data-v]');
    if (!b) return;
    vybranaKarta = b.closest('.konf-karta');
  }, true);

  /* 2) odeslání */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('#lead-odeslat');
    if (!b) return;

    /* Původní onclick se při prázdné variantě vrátí bez odeslání —
       ať neposíláme konverzi za něco, co neodešlo. */
    var nazev = document.getElementById('lead-varianta');
    if (!nazev || !nazev.textContent.trim()) return;

    var k = zKarty(vybranaKarta);
    var attr = (typeof window.helionAttribution === 'function') ? window.helionAttribution() : {};

    var payload = {
      event: 'generate_lead',
      form_id: 'konfigurator',
      lead_type: 'Konfigurátor FVE – ' + (k.varianta || nazev.textContent.trim()),
      konf_varianta: k.varianta || nazev.textContent.trim(),
      konf_kwp: k.kwp || '',
      konf_baterie: k.baterie || ''
    };
    if (k.value) { payload.value = k.value; payload.currency = 'CZK'; }

    for (var key in attr) if (Object.prototype.hasOwnProperty.call(attr, key)) payload[key] = attr[key];

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }, true);
})();
