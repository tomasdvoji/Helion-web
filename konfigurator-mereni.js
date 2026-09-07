/*
 * HELION.CZ — údaje z konfigurátoru FVE pro odeslání a měření
 * ---------------------------------------------------------------------------
 * Vkládat na konec <body> stránky konfigurator.html, za js/main.js.
 *
 * Konfigurátor je nejhodnotnější poptávka na webu: člověk, který si proklikal
 * střechu, orientaci, spotřebu i spotřebiče, ví, co chce. Sám o sobě ale
 * neposílá nic měřitelného — nemá formulář, jen tlačítko s vlastním onclick.
 *
 * Tenhle soubor si pamatuje, kterou ze tří variant člověk vybral, a vyčte
 * z její karty cenu po dotaci a výkon. Poptávka díky tomu nese peněžní
 * hodnotu, takže Google i Meta můžou optimalizovat na hodnotu, ne na počet.
 *
 * SÁM NIC NEODESÍLÁ ANI NEHLÁSÍ. Odeslání i konverzi řeší form.js, protože
 * konverze se smí hlásit až po potvrzeném uložení. Kdyby se hlásila při
 * kliknutí, počítaly by se do reklamy i poptávky, které nikam nedorazily.
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
       první textový uzel, jinak se přičte i cena s DPH z rozpisu */
    var cena = karta.querySelector('.cena');
    if (cena) {
      var prvni = '';
      for (var i = 0; i < cena.childNodes.length; i++) {
        var n = cena.childNodes[i];
        if (n.nodeType === 3) prvni += n.nodeValue;
        else if (n.nodeName === 'SMALL') break;
      }
      var v = cislo(prvni);
      if (v) { out.value = v; out.currency = 'CZK'; }
    }

    var polozky = karta.querySelectorAll('li');
    for (var j = 0; j < polozky.length; j++) {
      var s = polozky[j].querySelector('span'), b = polozky[j].querySelector('b');
      if (!s || !b) continue;
      var popis = s.textContent.toLowerCase();
      if (popis.indexOf('výkon') === 0) out.konf_kwp = b.textContent.trim();
      if (popis.indexOf('baterie') === 0) out.konf_baterie = b.textContent.trim();
    }

    var h3 = karta.querySelector('h3');
    if (h3) out.konf_varianta = h3.textContent.trim();
    return out;
  }

  /* Karty vznikají až po výpočtu, proto delegovaně přes document. */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('button[data-v]');
    if (!b) return;
    vybranaKarta = b.closest('.konf-karta');
  }, true);

  /** Vrátí, co je o vybrané sestavě známo. Volá to konfigurátor při odeslání. */
  window.helionKonfData = function () {
    return zKarty(vybranaKarta);
  };
})();
