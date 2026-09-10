/*
 * HELION.CZ — měřicí vrstva bez GTM
 * ---------------------------------------------------------------------------
 * Vkládat do <head> jako TŘETÍ v pořadí: consent.js → attribution.js → mereni.js.
 *
 * Proč ne GTM: měříme tři věci (GA4, Meta, později Google Ads). Kontejner by
 * přidal další vrstvu, další načítání a další místo, kde se dá něco rozbít,
 * aniž by to bylo v gitu. Tenhle soubor dělá totéž, je v repozitáři a je vidět.
 *
 * Co dělá:
 *   1. načte GA4 (gtag.js). Consent Mode v2 už nastavil consent.js na denied,
 *      takže do souhlasu jdou jen bezcookie pingy — to je správné chování.
 *   1b. načte značku UET od Microsoftu. Ta má vlastní consent mode, takže
 *      se stejně jako GA4 načítá hned a do souhlasu jede v režimu denied.
 *   2. Meta pixel načte AŽ po souhlasu s marketingem. Meta Consent Mode
 *      nerespektuje, gating tedy musí být tady.
 *   2b. Sklik (rc.js) načte LÍNĚ, až je co poslat. Retargeting neměříme,
 *      takže na běžné stránce nemá co dělat.
 *   3. odchytává událost generate_lead z attribution.js a rozešle ji
 *      do GA4, do Meta, do Google Ads, do Skliku a do Microsoftu.
 *
 * OVĚŘENO 7. 9. 2026 A OPRAVENO. V docs/ga4.md bylo pro nový web uvedeno
 * G-6CPT4HZRMY. To ID ale do property 362903270, kterou čte HME, NEPATŘÍ —
 * ta má jediný datový stream a ten má ID G-4QF6H07Y1C.
 *
 * Web by tedy měřil do místa, kam se nástroj nedívá, a dashboard by zůstal
 * prázdný, aniž by cokoli hlásilo chybu. Přesně ta tichá porucha, před
 * kterou varoval §8 předávacího dokumentu.
 *
 * Potvrdila to i data: provoz v property 362903270 spadl 4. 9., kdy se
 * doména přepnula na nový web, a od té doby do ní neteče nic.
 *
 * Kdyby se ID někdy měnilo, ověřte ho v GA4: Správce → Datové proudy →
 * rozkliknout stream. Číslo u výpisu je ID streamu, ne měřicí ID.
 */
(function () {
  'use strict';

  var GA4_ID   = 'G-4QF6H07Y1C';   // stream v property 362903270
  var META_ID  = '9235028319898505';
  /* Konverzní akce "Poptávka z webu" v účtu 399-311-0681, založena 8. 9. 2026.
     Kategorie "Odeslání formuláře pro zájemce", bez peněžní hodnoty — skutečná
     hodnota přijde později přes offline konverze z Accessu, až je zakázka
     podepsaná. Hlásí se AŽ po potvrzeném uložení poptávky, ne při kliknutí. */
  var ADS_ID   = 'AW-973730074';
  var ADS_LBL  = 'AW-973730074/A7N9CLusi_EcEJrip9AD';

  /* Sklik — ID konverzní akce z rozhraní: Nástroje → Měření konverzí.
     Nula znamená VYPNUTO a rc.js se pak vůbec nenačítá.

     POZOR NA VÝBĚR AKCE. V účtu jsou k 10. 9. 2026 dvě konverze, obě typu
     „vytvoření objednávky" a obě pojmenované Objednávka (100043919
     a 100043986). Poptávka na fotovoltaiku objednávka není; dosadit sem
     jednu z nich by znamenalo číst v reportech něco jiného, než se stalo.
     Proto vznikla 10. 9. 2026 konverze „Odeslání poptávky" typu odeslání
     formuláře, ID 100288930. To je ta, která patří sem.

     Výchozí hodnota je u ní ZÁMĚRNĚ prázdná. Sklik by ji jinak otiskl
     každé konverzi, u které kód žádnou nepošle, a to je většina poptávek —
     hodnotu zakázky v okamžiku odeslání formuláře neznáme. Spočítá ji až
     konfigurátor a jen tehdy se posílá. Stejná úvaha jako u Googlu a Mety. */
  var SKLIK_KONVERZE = 100288930;

  /* Microsoft Advertising — ID značky UET z rozhraní: Nástroje → UET tag.
     Prázdné znamená VYPNUTO a bat.js se nenačítá. */
  var UET_ID = '';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  var pendingLead = null;   // poptávka odeslaná dřív, než padl souhlas s marketingem

  /* ---------- 1) GA4 ---------- */

  (function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    (document.head || document.documentElement).appendChild(s);
  })();

  gtag('js', new Date());
  gtag('config', GA4_ID, { send_page_view: true });
  if (ADS_ID) gtag('config', ADS_ID);

  /* ---------- 1b) Microsoft Advertising (UET) ---------- */

  /* Načítá se hned jako GA4, ne až po souhlasu. Microsoft má vlastní
     consent mode a chce ho nastavený co nejdřív — než se stránka donačte.
     Do souhlasu tedy značka jede v režimu ad_storage: denied, což je
     totéž chování jako u GA4: měří se, ale bez ukládání na zařízení.

     Meta se načítá až po souhlasu proto, že žádný consent mode nemá.
     Rozdíl v přístupu je rozdíl v tom, co ty nástroje umí. */

  function uetPush() {
    window.uetq = window.uetq || [];
    window.uetq.push.apply(window.uetq, arguments);
  }

  if (UET_ID) {
    window.uetq = window.uetq || [];
    uetPush('consent', 'default', { ad_storage: 'denied' });

    (function (w, d, t, r, u) {
      var f, n, i;
      w[u] = w[u] || [];
      f = function () {
        var o = { ti: UET_ID, enableAutoSpaTracking: false };
        o.q = w[u];
        w[u] = new w.UET(o);
        w[u].push('pageLoad');
      };
      n = d.createElement(t); n.src = r; n.async = 1;
      n.onload = n.onreadystatechange = function () {
        var st = this.readyState;
        if (st && st !== 'loaded' && st !== 'complete') return;
        f(); n.onload = n.onreadystatechange = null;
      };
      i = d.getElementsByTagName(t)[0];
      i.parentNode.insertBefore(n, i);
    })(window, document, 'script', 'https://bat.bing.com/bat.js', 'uetq');
  }

  /* Posílá se jen při ZMĚNĚ. Consent.js hlásí souhlas dvakrát — jednou
     z localStorage při načtení a jednou přes dataLayer — a dvě stejné
     aktualizace za sebou by ve frontě jen přidávaly šum. */
  var uetStav = null;

  function uetSouhlas(granted) {
    if (!UET_ID) return;
    var novy = !!granted;
    if (uetStav === novy) return;
    uetStav = novy;
    uetPush('consent', 'update', { ad_storage: novy ? 'granted' : 'denied' });
  }

  /* ---------- 2) Meta pixel — až po souhlasu s marketingem ---------- */

  var metaLoaded = false;

  function loadMeta() {
    if (metaLoaded || !META_ID) return;
    metaLoaded = true;

    /* standardní snippet Meta pixelu, jen bez automatického spuštění */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_ID);
    window.fbq('track', 'PageView');

    /* poptávka odeslaná dřív, než člověk klikl na souhlas */
    if (pendingLead) { sendMeta(pendingLead); pendingLead = null; }
  }

  function marketingGranted() {
    try {
      var st = window.helionConsent && window.helionConsent.state();
      return !!(st && st.marketing);
    } catch (e) { return false; }
  }

  /* consent.js mohl souhlas obnovit z localStorage ještě před načtením
     tohohle souboru — spoléhat jen na událost by tichý pixel nechal ležet. */
  if (marketingGranted()) { loadMeta(); uetSouhlas(true); }

  /* ---------- 3) generate_lead → tři příjemci ---------- */

  /* Typy poptávek, které se do reklamy nepočítají jako konverze.
     Zatím jediný: záruční reklamace na vlastní instalaci. Servis cizí
     elektrárny konverze JE — to je placená zakázka od nového zákazníka. */
  var NEPOCITAT = { zaruka: 1 };

  /* Select na webu nemá value, posílá se celý text volby. Do GA4 chceme
     krátký kód, ať se dá segmentovat; původní text jdeme taky, ať je dohledatelný. */
  function leadKod(text) {
    var t = (text || '').toLowerCase();
    if (/z[aá]ru[cč]/.test(t))       return 'zaruka';
    if (/rodinn/.test(t))            return 'rd';
    if (/bytov|svj/.test(t))         return 'svj';
    if (/firm/.test(t))              return 'firma';
    if (/^servis|servis fve/.test(t)) return 'servis';
    if (/prohlídk|prohlidk/.test(t)) return 'kontrola';
    if (/termoviz/.test(t))          return 'termovize';
    if (/chytr|smart/.test(t))       return 'smart';
    if (/konfigur/.test(t))          return 'konfigurator';
    return 'jine';
  }

  /* AŽ SE SEM BUDE PŘIDÁVAT MICROSOFT (UET), POZOR NA MĚNU.
     ------------------------------------------------------
     Účet Microsoft Ads běží v EURECH. Koruna mezi měnami účtu není —
     Microsoft jich nabízí 28 a ze střední Evropy jen polský zlotý,
     takže při zakládání účtu bylo euro jediná rozumná volba.

     Hodnotu konverze ale POSÍLAT V KORUNÁCH LZE, CZK je v seznamu měn
     pro ConversionGoalRevenue a Microsoft si to přepočte sám. Podmínka
     je, že se měna uvede VÝSLOVNĚ. Z dokumentace:

       "If not, the value is treated as being in the account currency,
        which can lead to inflated or incorrect revenue reporting."

     Prakticky: zakázka za 252 000 poslaná bez měny se přečte jako
     252 000 EUR, tedy zhruba šest milionů korun, a optimalizace se bude
     učit na dvacetkrát nadsazené hodnotě.

     https://learn.microsoft.com/en-us/advertising/guides/currencies */

  /* ---------- 2b) Sklik ---------- */

  /* rc.js se načítá LÍNĚ, až když je co poslat. Na rozdíl od GA4 a UET
     neměří zobrazení stránky — retargeting nemáme zapnutý — takže by na
     každé stránce jen visel a stahoval se pro nic.

     Souhlas se Skliku PŘEDÁVÁ, neblokuje se jím načtení. `consent: 0`
     je Seznamem zamýšlený režim: konverze se započítá, ale nespáruje se
     s člověkem. Zahodit ji úplně by znamenalo, že by účet bez souhlasu
     neviděl vůbec nic a kampaň by se neměla podle čeho učit. Stejná
     úvaha jako u Consent Mode od Googlu. */

  var sklikNacita = false;
  var sklikFronta = [];

  function sklikOdeslat(konf) {
    if (window.rc && window.rc.conversionHit) {
      window.rc.conversionHit(konf);
      return;
    }
    sklikFronta.push(konf);
    if (sklikNacita) return;
    sklikNacita = true;

    var sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://c.seznam.cz/js/rc.js';
    sc.onload = function () {
      if (!window.rc || !window.rc.conversionHit) return;
      while (sklikFronta.length) window.rc.conversionHit(sklikFronta.shift());
    };
    (document.head || document.documentElement).appendChild(sc);
  }

  function sendSklik(d) {
    if (!SKLIK_KONVERZE) return;
    var konf = { id: SKLIK_KONVERZE, consent: marketingGranted() ? 1 : 0 };
    /* Hodnota jen když ji známe. Sklik ji čte v KORUNÁCH, žádné haléře
       jako v API — tam jsou haléře, tady koruny. */
    if (d.value) konf.value = d.value;
    sklikOdeslat(konf);
  }

  function sendUet(d) {
    if (!UET_ID) return;
    var p = {
      event_category: 'poptavka',
      event_label: d.lead_type || ''
    };
    /* MĚNU UVÁDĚT VŽDY, viz poznámka výš. Účet běží v eurech a hodnota
       bez měny by se přečetla jako eura. */
    if (d.value) { p.revenue_value = d.value; p.currency = d.currency || 'CZK'; }
    uetPush('event', 'submit_lead_form', p);
  }

  function sendMeta(d) {
    if (!window.fbq) return;
    var p = {
      content_name: d.lead_type_raw || d.lead_type || '',
      content_category: d.lead_type || ''
    };
    /* Konfigurátor umí spočítat cenu po dotaci — Meta i Google pak
       neoptimalizují na počet poptávek, ale na jejich hodnotu. */
    if (d.value) { p.value = d.value; p.currency = d.currency || 'CZK'; }
    window.fbq('track', 'Lead', p);
  }

  function odeslatLead(ev) {
    var d = {
      lead_type:     leadKod(ev.lead_type),
      lead_type_raw: ev.lead_type || '',
      form_id:       ev.form_id || 'inquiry',
      utm_source:    ev.utm_source || '',
      utm_medium:    ev.utm_medium || '',
      utm_campaign:  ev.utm_campaign || '',
      gclid:         ev.gclid || '',
      visits:        ev.visits || 1
    };

    /* hodnota chodí jen z konfigurátoru; u běžné poptávky ji neznáme
       a vymyšlená hodnota by rozbila optimalizaci víc než žádná */
    if (ev.value) { d.value = ev.value; d.currency = ev.currency || 'CZK'; }
    if (ev.konf_varianta) d.konf_varianta = ev.konf_varianta;
    if (ev.konf_kwp)      d.konf_kwp = ev.konf_kwp;

    gtag('event', 'generate_lead', d);

    /* Záruční reklamace na naši vlastní instalaci NENÍ konverze.
       Kdyby se posílala do Ads, Google by se učil přivádět jich víc —
       a platilo by se dvakrát: za proklik a pak za výjezd, který se
       podle ceníku neúčtuje. Do GA4 jde dál, ať je vidět, kolik jich je. */
    if (!NEPOCITAT[d.lead_type]) {
      if (ADS_LBL) {
        var c = { send_to: ADS_LBL };
        if (d.value) { c.value = d.value; c.currency = d.currency; }
        gtag('event', 'conversion', c);
      }
      /* Sklik a Microsoft jdou pod stejnou podmínkou jako Google Ads.
         Reklamní systém, který se učí přivádět záruční reklamace, je
         drahý omyl bez ohledu na to, čí je. */
      sendSklik(d);
      sendUet(d);
    }

    if (window.fbq) sendMeta(d);
    else pendingLead = d;   // souhlas ještě nepadl, pošleme až po něm
  }

  /* ---------- 4) odposlech dataLayeru ---------- */

  /* attribution.js i consent.js jen pushují do dataLayeru a počítají s tím,
     že si to vyzvedne GTM. GTM tu není, takže push obalíme sami. */
  var push = window.dataLayer.push;
  window.dataLayer.push = function () {
    var out = push.apply(window.dataLayer, arguments);
    for (var i = 0; i < arguments.length; i++) {
      var a = arguments[i];
      if (!a || typeof a !== 'object' || !a.event) continue;
      if (a.event === 'generate_lead')   odeslatLead(a);
      if (a.event === 'consent_resolved') {
        uetSouhlas(a.consent_marketing);
        if (a.consent_marketing) loadMeta();
      }
    }
    return out;
  };

  /* Události, které stihly proletět dřív, než jsme push obalili. */
  for (var i = 0; i < window.dataLayer.length; i++) {
    var a = window.dataLayer[i];
    if (a && a.event === 'consent_resolved') {
      uetSouhlas(a.consent_marketing);
      if (a.consent_marketing) loadMeta();
    }
  }
})();
