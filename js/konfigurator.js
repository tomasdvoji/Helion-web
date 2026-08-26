// Konfigurátor FVE – výpočetní engine. Pravidla převzata 1:1 z interního nabídkového
// Excelu (CN_HFVE): model spotřeby (Bilance), výroba dle azimutu/sklonu, bilanční
// vodopád s koeficientem soudobosti, kusovník a ceny (Nabídka), dotace NZÚ, ekonomika (Shrnutí).
(() => {
'use strict';
const D = FVE_DATA;
const DPH = 0.12;
const DNY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MES_VYROBA = [0.02, 0.06, 0.09, 0.11, 0.11, 0.13, 0.13, 0.12, 0.10, 0.06, 0.04, 0.03];
const T_VODA = [5.9, 6.6, 7.9, 8.2, 9.6, 10.1, 10.6, 10.7, 10.1, 8.9, 7.8, 6.5];
const MES_TOPENI = [0.224, 0.2225, 0.130, 0.088, 0.0159, 0, 0, 0, 0.0078, 0.0757, 0.0929, 0.1433];
const LETNOST = [0, 0, 0.03, 0.1, 0.4, 1, 1, 1, 0.6, 0.05, 0, 0];
// roční výroba kWh/kWp dle azimutu (0 = jih, -90 = východ), lineární interpolace
const AZIMUT_TAB = [[-180, 562], [-90, 841], [-45, 945], [0, 980], [45, 950], [90, 940], [180, 562]];
// spotřebiče: [klíč, název, fixní podíl, sezóna (letni/zimni/null), W, hodin(n = osob)]
const SPOTREBICE = [
  ['lednice', 'Lednice s mrazákem', 0.8, 'letni', 500, n => 1 + n / 4],
  ['mrazak', 'Samostatný mrazák', 1, null, 800, () => 2],
  ['pc', 'Počítač / home office', 1, null, 300, n => 1 + n / 2],
  ['tv', 'Televize', 1, null, 300, n => 1 + n / 2],
  ['pracka', 'Pračka', 1, null, 600, () => 1.5],
  ['susicka', 'Sušička', 1, null, 600, () => 1.5],
  ['svetla', 'Osvětlení', 0.3, 'zimni', 300, n => 5 + n / 4],
  ['sporak', 'Elektrický sporák', 1, null, 4000, n => 0.25 + n / 8],
  ['trouba', 'Trouba', 1, null, 3000, n => 0.2 + n / 10],
  ['bazen', 'Bazén (ohřev + filtrace)', 0, 'letni', 1650, () => 3],
  ['virivka', 'Vířivka', 0, 'letni', 1200, () => 2],
  ['rekuperace', 'Rekuperace', 0, 'zimni', 85, () => 24],
  ['dilna', 'Zahrada, dílna', 0.2, 'letni', 350, () => 3],
];

const najdi = (arr, nazev) => arr.find(p => p.nazev === nazev);
const interp = (tab, x) => {
  for (let i = 1; i < tab.length; i++) {
    if (x <= tab[i][0]) {
      const [x0, y0] = tab[i - 1], [x1, y1] = tab[i];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
  }
  return tab[tab.length - 1][1];
};

// ---------- model spotřeby (kWh/měsíc) ----------
function spotrebaModel(inp) {
  const cop = t => D.ucinnosti[t] || 1;
  const tv = inp.zdrojVody ? T_VODA.map((t, m) => (55 - t) * inp.osoby * 50 * 0.00116 * DNY[m] / cop(inp.zdrojVody)) : DNY.map(() => 0);
  // roční potřeba vytápění z tepelné ztráty (denostupně, viz Excel Bilance F22)
  const topeniRok = inp.vytapeniElektrinou
    ? (0.85 * 0.9 * 24 * inp.ztrata * (242 * (19 - 3.8))) / (0.95 * 0.95 * (19 + 18)) * 0.0036 * 277.778 / cop(inp.zdrojTopeni)
    : 0;
  const topeni = MES_TOPENI.map(p => p * topeniRok);
  const ev = DNY.map(d => inp.ev ? d * inp.kmDen * inp.evSpotreba / 100 : 0);
  let fix = 0, letni = 0, zimni = 0;
  for (const [klic, , dFix, sezona, w, hod] of SPOTREBICE) {
    if (!inp.spotrebice.has(klic)) continue;
    const whDen = w * hod(inp.osoby);
    fix += whDen * dFix;
    if (sezona === 'letni') letni += whDen * (1 - dFix); else if (sezona === 'zimni') zimni += whDen * (1 - dFix);
  }
  let ostatni = DNY.map((d, m) => (fix * d + zimni * (1 - LETNOST[m]) * d + letni * LETNOST[m] * d) / 1000);
  // pokud zákazník zná roční spotřebu z vyúčtování, dorovnáme položku „ostatní“
  if (inp.rocniSpotreba > 0) {
    const model = suma(tv) + suma(topeni) + suma(ev) + suma(ostatni);
    const rozdil = inp.rocniSpotreba - (suma(tv) + suma(topeni) + suma(ev));
    if (rozdil > 0 && suma(ostatni) > 0) { const k = rozdil / suma(ostatni); ostatni = ostatni.map(x => x * k); }
  }
  return { tv, topeni, ev, ostatni };
}
const suma = a => a.reduce((s, x) => s + x, 0);

// ---------- výroba ----------
function vyrobaRok(plochy) {
  return plochy.reduce((s, p) => s + interp(AZIMUT_TAB, p.azimut) * (1 - Math.abs(p.sklon - 35) / 700) * (1 - p.stineni) * p.kwp, 0);
}

// ---------- bilance (vodopád jako v Excelu, pořadí topení → EV → ostatní → voda) ----------
function bilance(vyrobaR, sp, kwhBat, kwp) {
  const k = 0.42 + Math.min(0.5, kwp ? 0.3 * kwhBat / kwp : 0);
  let kryto = 0, prebytek = 0;
  for (let m = 0; m < 12; m++) {
    const v = vyrobaR * MES_VYROBA[m];
    const r1 = Math.max(0, Math.min(v * k, sp.topeni[m]));
    const r2 = Math.max(0, Math.min(v * k - r1, sp.ev[m]));
    const r3 = Math.max(0, Math.min(v * k - r1 - r2, sp.ostatni[m]));
    const r4 = Math.max(0, Math.min(v * k - r1 - r2 - r3, sp.tv[m]));
    kryto += r1 + r2 + r3 + r4;
    prebytek += Math.max(0, v - (r1 + r2 + r3 + r4));
  }
  return { kryto, prebytek };
}

// ---------- kusovník a cena (bez DPH; ceny už obsahují obchodní přirážku) ----------
function polozka(rozpis, nazev, ks, cenaKus, praceKus) {
  if (ks <= 0) return 0;
  const celkem = ks * (cenaKus + praceKus);
  rozpis.push({ nazev, ks: Math.round(ks * 100) / 100, celkem: Math.round(celkem) });
  return celkem;
}

function sestavCenu(inp, panelKs, moduly, sHA, sWallbox) {
  const rozpis = [];
  const panel = najdi(D.panely, inp.panel);
  const kwp = panelKs * panel.wp / 1000;
  let c = 0;
  c += polozka(rozpis, panel.nazev, panelKs, panel.prodej, panel.prace);

  // konstrukce dle typu střechy
  if (inp.strecha === 'plocha') {
    const set = najdi(D.konstrukce, 'Konstrukce na plochou střechu se zadním krycím plechem, 10°, zátěžová');
    c += polozka(rozpis, set.nazev, panelKs, set.prodej, set.prace);
  } else if (inp.strecha === 'zem') {
    const set = najdi(D.konstrukce, 'Konstrukce na zem se zemními vruty 25°, pozinkovaná');
    c += polozka(rozpis, set.nazev, panelKs, set.prodej, set.prace);
  } else {
    const uchyt = najdi(D.konstrukce, {
      taska: 'Hák na taškovou střechu, stavitelný, nerez/hliník',
      falc: 'Falcový úchyt, nerez',
      plech: 'Al úchyt na plechovou/bitumenovou/trapézovou střechu, délka 400mm',
    }[inp.strecha]);
    const profilM = Math.ceil(panelKs * 2 * (panel.vyska_mm + 22) * 1.05 / 1000 / 2) * 2;
    const uchytKs = uchyt.pocet_dle === 'profil' ? Math.ceil(profilM / 0.8 / 2) * 2 : Math.ceil(panelKs * uchyt.nasobek_na_panel);
    c += polozka(rozpis, uchyt.nazev, uchytKs, uchyt.prodej, uchyt.prace);
    c += polozka(rozpis, 'Al profil na uložení panelů (m)', profilM, 212.5, 212.5); // cena z Nabídky (170 Kč × 1.25)
  }
  c += polozka(rozpis, 'Úchytky a nerezový spojovací materiál', panelKs, 81, 81);
  const kabelM = Math.round(kwp * (inp.strecha === 'plocha' ? 15 : 10) * 2);
  c += polozka(rozpis, 'Solární kabeláž a konektory', kabelM, 30, 30);

  // měnič: nejmenší hybridní GoodWe s výkonem >= 0.85 × kWp
  const hybridy = D.menice.filter(m => m.hybridni === 1 && m.nazev.includes('GoodWe')).sort((a, b) => a.kw - b.kw);
  const menic = hybridy.find(m => m.kw >= kwp * 0.85) || hybridy[hybridy.length - 1];
  c += polozka(rozpis, menic.nazev, 1, menic.prodej, menic.prace);
  const rozvadec = najdi(D.rozvadece, menic.rozvadec);
  c += polozka(rozpis, rozvadec.nazev, 1, rozvadec.prodej, rozvadec.prace);
  c += polozka(rozpis, 'RDC - rozvaděč s přepěťovými ochranami DC', 1, 6100, 400);

  // baterie + BMS
  const bat = najdi(D.baterie, inp.baterie);
  let kwhBat = 0;
  if (moduly > 0) {
    kwhBat = Math.round(moduly * bat.kwh_modul * 10) / 10;
    c += polozka(rozpis, bat.nazev, moduly, bat.prodej, bat.prace);
    const bms = najdi(D.bms, bat.bms);
    if (bms && bms.prodej + bms.prace > 0) c += polozka(rozpis, bms.nazev, Math.ceil(moduly / bat.max_modulu_na_bms), bms.prodej, bms.prace);
  }
  if (sHA) { const ha = D.vytezovace.find(v => v.nazev.startsWith('Home assistant')); c += polozka(rozpis, 'Chytré řízení Helion (Home Assistant)', 1, ha.prodej, ha.prace); }
  let wallboxPrace = 0;
  if (sWallbox) {
    const wb = D.wallboxy.find(w => w.nazev.includes('GoodWe EV Charger HCA G2 11'));
    c += polozka(rozpis, wb.nazev, 1, wb.prodej, wb.prace);
    c += polozka(rozpis, 'Montáž a zprovoznění nabíjecí stanice', 1, 3500, 4000);
    wallboxPrace = 7500;
  }

  // elektroinstalace a služby (fixní položky z Excelu)
  const instMat = Math.max(0, kwp * 1000 - wallboxPrace / 2);
  c += polozka(rozpis, 'Instalační materiál (kabely, jističe, chráničky…)', 1, instMat, instMat * 0.3);
  c += polozka(rozpis, 'Úprava elektroměrového rozvaděče dle PPDS', 1, 1000, 400);
  c += polozka(rozpis, 'Doprava pracovníků', 1, 2000, 2000);
  c += polozka(rozpis, 'Montáž a zprovoznění FV systému, zaškolení', 1, 0, 2000);
  c += polozka(rozpis, 'Projektová dokumentace, revize, vyřízení dotace, připojení k DS', 1, 0, 10200);

  const bezDph = Math.ceil(c);
  const sDph = Math.round(bezDph * (1 + DPH));
  return { rozpis, kwp, kwhBat, menic: menic.nazev, bezDph, sDph };
}

// ---------- dotace NZÚ ----------
function dotace(kwp, kwhBat, sWallbox, sHA, cenaSDph) {
  if (kwp < 2 || kwhBat < kwp) return 0;
  const zaklad = kwp * 10000 + kwhBat * 10000 + (sWallbox ? 10000 : 0);
  let d = Math.min(100000, zaklad);
  if (sHA) d += Math.min(40000, Math.max(0, zaklad - 100000)); // bonus: sdílení v EDC + chytré řízení
  return Math.round(Math.min(d, cenaSDph / 2));
}

// ---------- ekonomika ----------
function ekonomika(vyrobaR, prebytek, sazba, investice, sEV, kmDen) {
  const s = D.sazby[sazba] || D.sazby.D25d;
  const cenaKwh0 = (s.silovka + s.distribuce) * 1.22;
  let kum = -investice, navratnost = null, usporaRok1 = 0;
  for (let t = 0; t < 25; t++) {
    const r = Math.pow(1.03, t), deg = Math.pow(1 - 0.008, t);
    const v = vyrobaR * deg, p = prebytek * deg;
    let cf = (v - p) * cenaKwh0 * r + p * 0.5 * r - 1500 * r;
    if (sEV) cf += kmDen * 365 * (40 * 5.5 / 100 - 0.6) * r; // úspora PHM proti benzínu (0.6 Kč/km el. mix)
    if (t === 0) usporaRok1 = cf;
    const pred = kum; kum += cf;
    if (navratnost === null && kum >= 0) navratnost = t + (0 - pred) / cf;
  }
  return { usporaRok1: Math.round(usporaRok1), navratnost: navratnost ? Math.round(navratnost * 10) / 10 : null };
}

// ---------- varianty ----------
function spocitej(inp) {
  const sp = spotrebaModel(inp);
  const spotrebaRok = suma(sp.tv) + suma(sp.topeni) + suma(sp.ev) + suma(sp.ostatni);
  const panel = najdi(D.panely, inp.panel);
  const maxPanelu = Math.max(4, Math.floor(inp.plocha / ((panel.vyska_mm + 200) * (panel.sirka_mm + 50) / 1e6)));
  const bat = najdi(D.baterie, inp.baterie);
  const plochyKwp = ks => inp.plochy.map(p => ({ ...p, kwp: ks * panel.wp / 1000 * p.podil }));

  const variant = (nazev, podilPanelu, batNasobek, sHA, sWallbox, popis) => {
    const ks = Math.max(4, Math.round(maxPanelu * podilPanelu));
    const kwp = ks * panel.wp / 1000;
    const moduly = batNasobek === 0 ? 0 : Math.ceil(kwp * batNasobek / bat.kwh_modul);
    const cena = sestavCenu(inp, ks, moduly, sHA, sWallbox && inp.ev);
    const vyr = vyrobaRok(plochyKwp(ks));
    const bil = bilance(vyr, sp, cena.kwhBat, cena.kwp);
    const dot = dotace(cena.kwp, cena.kwhBat, sWallbox && inp.ev, sHA, cena.sDph);
    const eko = ekonomika(vyr, bil.prebytek, inp.sazba, cena.sDph - dot, sWallbox && inp.ev, inp.kmDen);
    return { nazev, popis, ks, cena, dot, poDotaci: cena.sDph - dot, vyroba: Math.round(vyr),
             vlastni: Math.round(bil.kryto / vyr * 100), pokryti: Math.round(bil.kryto / spotrebaRok * 100),
             sHA, sWallbox: sWallbox && inp.ev, ...eko };
  };

  return {
    spotrebaRok: Math.round(spotrebaRok), maxPanelu,
    varianty: [
      variant('Úsporná', 0.7, 1.0, false, false, 'Nejnižší pořizovací cena, baterie jen pro dotaci'),
      variant('Doporučená', 1.0, 1.5, true, false, 'Nejlepší poměr cena / úspora, s chytrým řízením'),
      variant('Maximální', 1.0, 2.0, true, true, 'Maximální soběstačnost – větší baterie, chytré řízení i wallbox'),
    ],
  };
}

window.KONFIG = { spocitej, SPOTREBICE, sazby: Object.keys(D.sazby), panely: D.panely, baterie: D.baterie };
})();
