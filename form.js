/*
 * HELION.CZ — odeslání poptávky
 * ---------------------------------------------------------------------------
 * Vkládat do <head> ZA attribution.js — potřebuje z něj doplněná skrytá pole.
 *
 * Obsluhuje obě poptávková místa na webu:
 *   - formulář na poptavka.html (#inquiry-form)
 *   - konfigurátor FVE, který volá window.helionOdeslat() sám
 *
 * POZOR NA main.js
 * ----------------
 * Ten měl vlastní obsluhu odeslání, která skládala mailto:. Dvě obsluhy na
 * jednom formuláři znamenají, že se poptávka odešle na server A zároveň se
 * otevře poštovní klient. Obsluha v main.js je proto odstraněná a kontrola
 * souhlasu se servisním ceníkem se přesunula sem — musí proběhnout PŘED
 * odesláním, a při dvou posluchačích se na pořadí spolehnout nedá.
 *
 * PROČ NE mailto:
 * ---------------
 * Na mobilu a u lidí s webmailem se zpráva často neodešle vůbec a nikdo se
 * to nedozví. Nevznikne konverze, takže se Google ani Sklik nemají na čem
 * učit, a nedorazí gclid, takže se zakázka nikdy nespáruje s reklamou,
 * která ji přivedla.
 *
 * Konverze se hlásí AŽ po úspěšném uložení, ne při kliknutí na tlačítko.
 */
(function () {
  'use strict';

  /* Endpoint v HME. Jiná doména než web, proto tam běží CORS. */
  var ENDPOINT = 'https://lead.helion.cz/api/leads/web';

  var TELEFON = '773 165 260';
  var EMAIL = 'info@helion.cz';

  var STYLE =
    '.hf-msg{margin-top:16px;padding:14px 16px;border-radius:8px;font:15px/1.5 system-ui,sans-serif}' +
    '.hf-msg.ok{background:#e0efe7;color:#155c3f;border:1px solid #9dcdb6}' +
    '.hf-msg.err{background:#f8e6e3;color:#8f231b;border:1px solid #e0a79f}' +
    '.hf-hp{position:absolute!important;left:-9999px!important;opacity:0!important;height:0!important}';

  function styl() {
    if (document.getElementById('hf-style')) return;
    var s = document.createElement('style');
    s.id = 'hf-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function hlaska(kam, text, druh) {
    styl();
    var el = kam.querySelector('.hf-msg');
    if (!el) {
      el = document.createElement('div');
      el.className = 'hf-msg';
      kam.appendChild(el);
    }
    el.className = 'hf-msg ' + druh;
    el.textContent = text;
    el.setAttribute('role', druh === 'err' ? 'alert' : 'status');
    /* Posun na hlášku je pohodlí, ne funkce. Kdyby ho prostředí neumělo,
       nesmí to shodit celou obsluhu — člověk by přišel o potvrzení, že se
       poptávka odeslala. */
    try { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
    return el;
  }

  /* ------------------------------------------------------------------ */
  /* Odeslání — společné pro formulář i konfigurátor                      */
  /* ------------------------------------------------------------------ */

  /**
   * Pošle poptávku a vrátí Promise. Konverzi do dataLayeru hlásí sama,
   * až když server potvrdí uložení.
   */
  function odeslat(data) {
    var telo = {};
    Object.keys(data).forEach(function (k) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== '') telo[k] = data[k];
    });

    /* Atribuce se přidává tady, ať na ni nemusí myslet každé volací místo. */
    if (window.helionAttribution) {
      var a = window.helionAttribution();
      Object.keys(a).forEach(function (k) {
        if (telo[k] === undefined && a[k] !== '' && a[k] !== undefined) telo[k] = a[k];
      });
    }

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telo)
    }).then(function (r) {
      if (r.status === 429) throw new Error('Z této adresy přišlo příliš mnoho poptávek. Zkuste to prosím za chvíli.');
      return r.json().then(function (odpoved) {
        if (!r.ok || !odpoved || odpoved.stav !== 'ok') {
          throw new Error((odpoved && odpoved.detail) || 'Server poptávku nepřijal.');
        }
        return odpoved;
      }, function () {
        throw new Error('Server odpověděl nečekaným způsobem.');
      });
    }).then(function (odpoved) {
      window.dataLayer = window.dataLayer || [];
      var udalost = {
        event: 'generate_lead',
        form_id: telo.form_id || 'inquiry',
        lead_type: telo.type || telo.lead_type || 'nespecifikovano',
        lead_id: odpoved.id || ''
      };
      /* Konfigurátor umí spočítat cenu po dotaci — hodnota konverze. */
      ['value', 'currency', 'konf_varianta', 'konf_kwp', 'konf_baterie'].forEach(function (k) {
        if (data[k]) udalost[k] = data[k];
      });
      if (window.helionAttribution) {
        var a2 = window.helionAttribution();
        Object.keys(a2).forEach(function (k) { if (udalost[k] === undefined) udalost[k] = a2[k]; });
      }
      window.dataLayer.push(udalost);
      return odpoved;
    });
  }

  window.helionOdeslat = odeslat;

  function chybovaHlaska(e) {
    return 'Poptávku se nepodařilo odeslat: ' + e.message +
      ' Zavolejte prosím na ' + TELEFON + ' nebo napište na ' + EMAIL + '.';
  }
  window.helionChybovaHlaska = chybovaHlaska;

  /* ------------------------------------------------------------------ */
  /* Formulář na poptavka.html                                           */
  /* ------------------------------------------------------------------ */

  function honeypot(form) {
    if (form.elements['website']) return;
    var w = document.createElement('div');
    w.className = 'hf-hp';
    w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<label>Nevyplňujte<input name="website" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(w);
  }

  /* Servisní poptávka vyžaduje souhlas s ceníkem. Bývalo v main.js;
     po zrušení tamní obsluhy to musí být tady, jinak by souhlas nikdo
     nekontroloval a objednávka servisu by šla bez něj. */
  function servisNeposvecen(form) {
    var typ = form.elements['type'];
    if (!typ || !/^servis/i.test(typ.value)) return false;
    var box = document.getElementById('servis-box');
    var check = box && box.querySelector('input[type="checkbox"]');
    if (check && !check.checked) {
      check.focus();
      return true;
    }
    return false;
  }

  function init() {
    styl();
    var formulare = document.querySelectorAll('form#inquiry-form, form[data-track="lead"]');

    Array.prototype.forEach.call(formulare, function (form) {
      honeypot(form);

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();

        var btn = form.querySelector('button[type="submit"], button:not([type])');
        if (btn && btn.disabled) return;

        if (window.helionFillForm) window.helionFillForm(form);

        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (servisNeposvecen(form)) {
          hlaska(form, 'Pro objednání servisu prosím potvrďte souhlas se servisním ceníkem.', 'err');
          return;
        }

        var data = {};
        var fd = new FormData(form);
        fd.forEach(function (v, k) { data[k] = v; });
        data.form_id = 'poptavka';

        var puvodni = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Odesílám…'; }

        odeslat(data).then(function () {
          form.reset();
          hlaska(form, 'Děkujeme, poptávku máme. Ozveme se vám nejpozději následující pracovní den.', 'ok');
          if (btn) btn.textContent = 'Odesláno';
        }).catch(function (e) {
          hlaska(form, chybovaHlaska(e), 'err');
          if (btn) { btn.disabled = false; btn.textContent = puvodni; }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
