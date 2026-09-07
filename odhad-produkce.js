/*
 * HELION.CZ — odhad výroby fotovoltaické elektrárny
 * ---------------------------------------------------------------------------
 * Počítá se v prohlížeči, bez volání na server. Kalkulačka na webu, kam míří
 * reklama, nemá umřít s cizí službou — a PVGIS navíc neposílá hlavičky CORS,
 * takže na něj z prohlížeče volat ani nejde.
 *
 * ODKUD SE BEROU ČÍSLA
 * Měsíční globální ozáření a difuzní podíl pro osm míst v ČR jsou z PVGIS
 * (JRC Evropské komise), průměr let 2020–2023. Zapečená data, ne odhad.
 *
 * JAK SE POČÍTÁ
 *   1. denní úhrn se rozdělí na čtvrthodiny (Collares-Pereira & Rabl pro
 *      globál, Liu & Jordan pro difuz)
 *   2. sluneční geometrie pro reprezentativní den měsíce (Klein)
 *   3. převod na rovinu panelů podle Hay & Daviese — část difuzu se chová
 *      jako přímé záření, proto anizotropní model, ne izotropní
 *   4. výkonnostní poměr kalibrovaný na PVGIS pro každé místo zvlášť
 *   5. korekce podle sklonu a orientace
 *
 * PROČ TA KOREKCE
 * Samotný fyzikální model sedí do ±2 % všude, kde se panely reálně montují,
 * ale u strmých ploch otočených k severu nadhodnocuje — izotropní obloha
 * tam dává víc difuzu, než PVGIS naměří. U svislé stěny na sever až o 34 %.
 * Tabulka ten rozdíl srovnává.
 *
 * OVĚŘENO
 * Proti PVGIS na 112 kombinacích sklonu a orientace pro Trutnov a Brno.
 * Korekce se počítala jen z nich; ověřovala se na Plzni, která do ní
 * nevstoupila, a na sklonech i azimutech mimo uzly tabulky:
 *     bez korekce   průměrná chyba 3,63 %   největší 34,6 %
 *     s korekcí     průměrná chyba 0,34 %   největší  1,4 %
 *
 * KONVENCE ORIENTACE je stejná jako v PVGIS:
 *     0° = jih, -90° = východ, +90° = západ, ±180° = sever
 */
window.HELION_ODHAD = (function () {
  'use strict';

  var D = Math.PI / 180;
  var DEN = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
  var DNI = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var ALBEDO = 0.2;

  var MISTA = {
    trutnov: { nazev: "Trutnov a Krkonoše", lat: 50.5815, ghi: [22.23, 44.78, 94.99, 126.72, 159.8, 173.7, 171.56, 138.56, 108.03, 58.98, 23, 17.26], kd: [0.73, 0.592, 0.483, 0.5, 0.512, 0.47, 0.495, 0.505, 0.475, 0.575, 0.79, 0.752], pr: 0.7965 },
    praha: { nazev: "Praha a střední Čechy", lat: 50.0755, ghi: [26.59, 47.34, 97.16, 131.17, 166.68, 176.4, 176.38, 144.94, 110.28, 65.33, 29.79, 21.43], kd: [0.652, 0.55, 0.463, 0.485, 0.482, 0.452, 0.475, 0.465, 0.47, 0.55, 0.66, 0.665], pr: 0.7827 },
    hradec: { nazev: "Hradec Králové a Pardubice", lat: 50.2092, ghi: [25.99, 43.55, 96.47, 131.86, 166.99, 179.56, 179.65, 143.78, 110.94, 64.52, 27.22, 20.25], kd: [0.667, 0.61, 0.458, 0.485, 0.48, 0.44, 0.455, 0.462, 0.46, 0.56, 0.698, 0.688], pr: 0.7908 },
    liberec: { nazev: "Liberec a Jizerské hory", lat: 50.7663, ghi: [19.41, 39.13, 89.48, 119.09, 158.25, 167.11, 168.05, 133.5, 101.26, 54.09, 23.33, 16.87], kd: [0.777, 0.605, 0.495, 0.508, 0.52, 0.48, 0.51, 0.515, 0.497, 0.58, 0.745, 0.752], pr: 0.8033 },
    plzen: { nazev: "Plzeň a západní Čechy", lat: 49.7475, ghi: [25.28, 46.63, 96.21, 132.35, 165.51, 181.92, 177.03, 143.44, 112.87, 64.27, 29.47, 20.64], kd: [0.715, 0.575, 0.478, 0.483, 0.485, 0.435, 0.472, 0.482, 0.46, 0.57, 0.68, 0.715], pr: 0.7742 },
    budejovice: { nazev: "České Budějovice a jih", lat: 48.9745, ghi: [28.91, 51.12, 98.75, 133.06, 157.69, 181.68, 181.41, 143.41, 113.12, 70.62, 35.61, 23.21], kd: [0.658, 0.545, 0.458, 0.478, 0.495, 0.427, 0.447, 0.453, 0.455, 0.515, 0.585, 0.685], pr: 0.7684 },
    brno: { nazev: "Brno a jižní Morava", lat: 49.1951, ghi: [30.29, 51.73, 104.96, 135.29, 165.4, 183.08, 184.38, 146.99, 113.54, 67.47, 30.57, 20.45], kd: [0.623, 0.535, 0.438, 0.475, 0.48, 0.443, 0.438, 0.455, 0.457, 0.522, 0.635, 0.7], pr: 0.782 },
    ostrava: { nazev: "Ostrava a Slezsko", lat: 49.8209, ghi: [27.84, 43.7, 95.98, 123.14, 149.99, 173.57, 175.66, 140.68, 106.86, 66.34, 31.7, 20.04], kd: [0.642, 0.578, 0.475, 0.508, 0.5, 0.445, 0.445, 0.457, 0.462, 0.525, 0.605, 0.7], pr: 0.7866 },
  };

  /* Poměr PVGIS/model. Řádky po 15° sklonu, sloupce po 45° azimutu
     od -180 do +180 včetně (krajní sloupce jsou stejné, sever je cyklický). */
  var SKLONY = [0, 15, 30, 45, 60, 75, 90];
  var AZIMUTY = [-180, -135, -90, -45, 0, 45, 90, 135, 180];
  var KOREKCE = [
    [0.9811, 0.9811, 0.9811, 0.9811, 0.9811, 0.9811, 0.9811, 0.9811, 0.9811],
    [0.9693, 0.9769, 0.9863, 0.9904, 0.9912, 0.9853, 0.9777, 0.9707, 0.9693],
    [0.9689, 0.986, 0.9986, 0.9992, 0.998, 0.9876, 0.9806, 0.9711, 0.9689],
    [0.9501, 0.9928, 1.007, 1.0064, 1.0042, 0.9896, 0.9826, 0.9754, 0.9501],
    [0.904, 0.9636, 1.0018, 1.0108, 1.0091, 0.9894, 0.9761, 0.9542, 0.904],
    [0.7873, 0.8906, 0.9774, 1.0089, 1.0103, 0.9828, 0.9563, 0.8906, 0.7873],
    [0.6538, 0.7849, 0.9262, 0.9924, 0.9991, 0.9638, 0.9167, 0.7981, 0.6538]
  ];

  function korekce(sklon, azimut) {
    var s = Math.max(0, Math.min(90, sklon));
    var a = Math.max(-180, Math.min(180, azimut));
    var i = Math.min(SKLONY.length - 2, Math.floor(s / 15));
    var j = Math.min(AZIMUTY.length - 2, Math.floor((a + 180) / 45));
    var ts = (s - SKLONY[i]) / (SKLONY[i + 1] - SKLONY[i]);
    var ta = (a - AZIMUTY[j]) / (AZIMUTY[j + 1] - AZIMUTY[j]);
    var h1 = KOREKCE[i][j] * (1 - ta) + KOREKCE[i][j + 1] * ta;
    var h2 = KOREKCE[i + 1][j] * (1 - ta) + KOREKCE[i + 1][j + 1] * ta;
    return h1 * (1 - ts) + h2 * ts;
  }

  function rozdeleni(omega, omegaS) {
    var jm = Math.sin(omegaS) - omegaS * Math.cos(omegaS);
    if (jm <= 0) return [0, 0];
    var rozdil = Math.cos(omega) - Math.cos(omegaS);
    if (rozdil <= 0) return [0, 0];
    var rd = (Math.PI / 24) * rozdil / jm;
    var a = 0.409 + 0.5016 * Math.sin(omegaS - 60 * D);
    var b = 0.6609 - 0.4767 * Math.sin(omegaS - 60 * D);
    return [Math.max(0, rd * (a + b * Math.cos(omega))), Math.max(0, rd)];
  }

  /** Ozáření roviny panelů za měsíc, kWh/m². */
  function poaMesic(lat, ghi, kd, sklonDeg, azimutDeg, m) {
    var sirka = lat * D, sklon = sklonDeg * D, azimut = azimutDeg * D;
    var n = DEN[m];
    var dekl = 23.45 * D * Math.sin(2 * Math.PI * (284 + n) / 365);
    var x = -Math.tan(sirka) * Math.tan(dekl);
    var omegaS = Math.acos(Math.max(-1, Math.min(1, x)));
    if (omegaS <= 0) return 0;

    var dnu = DNI[m];
    var hDen = ghi / dnu, hdDen = hDen * kd;

    var g0 = 1367 * (1 + 0.033 * Math.cos(2 * Math.PI * n / 365));
    var h0Den = (24 / Math.PI) * g0 * (
      Math.cos(sirka) * Math.cos(dekl) * Math.sin(omegaS) +
      omegaS * Math.sin(sirka) * Math.sin(dekl)) / 1000;

    var poa = 0, krok = 0.25;
    for (var h = -12 + krok / 2; h < 12; h += krok) {
      var omega = h * 15 * D;
      if (Math.abs(omega) >= omegaS) continue;
      var cosZ = Math.sin(sirka) * Math.sin(dekl) +
                 Math.cos(sirka) * Math.cos(dekl) * Math.cos(omega);
      if (cosZ <= 0.01) continue;

      var sinZ = Math.sqrt(Math.max(0, 1 - cosZ * cosZ));
      var cosAz = sinZ > 1e-6
        ? (Math.sin(sirka) * cosZ - Math.sin(dekl)) / (Math.cos(sirka) * sinZ) : 1;
      cosAz = Math.max(-1, Math.min(1, cosAz));
      var azSlunce = Math.acos(cosAz) * (omega < 0 ? -1 : 1);

      var cosTheta = Math.max(0, cosZ * Math.cos(sklon) +
        sinZ * Math.sin(sklon) * Math.cos(azSlunce - azimut));

      var r = rozdeleni(omega, omegaS);
      var ig = hDen * r[0], idf = hdDen * r[1];
      var ib = Math.max(0, ig - idf);
      var rb = cosTheta / cosZ;

      var ai = (h0Den > 0 && r[1] > 0) ? ib / (h0Den * r[1]) : 0;
      ai = Math.max(0, Math.min(1, ai));

      poa += (ib * rb
            + idf * (ai * rb + (1 - ai) * (1 + Math.cos(sklon)) / 2)
            + ig * ALBEDO * (1 - Math.cos(sklon)) / 2) * krok;
    }
    return poa * dnu;
  }

  /**
   * @param {number} kwp   instalovaný výkon
   * @param {number} sklon 0 = naplocho, 90 = svisle
   * @param {number} azimut 0 = jih, -90 = východ, +90 = západ
   * @param {string} misto klíč do MISTA
   * @returns {{rok:number, mesice:number[], nakwp:number}}
   */
  function spocitej(kwp, sklon, azimut, misto) {
    var m = MISTA[misto] || MISTA.trutnov;
    var k = korekce(sklon, azimut);
    var mesice = [];
    for (var i = 0; i < 12; i++) {
      mesice.push(poaMesic(m.lat, m.ghi[i], m.kd[i], sklon, azimut, i) * m.pr * k * kwp);
    }
    var rok = mesice.reduce(function (a, b) { return a + b; }, 0);
    return { rok: rok, mesice: mesice, nakwp: kwp > 0 ? rok / kwp : 0 };
  }

  /** Nejlepší sklon a orientace pro dané místo — pro srovnání s tím, co má člověk. */
  function optimum(misto) {
    var nej = { rok: 0, sklon: 35, azimut: 0 };
    for (var s = 0; s <= 90; s += 1) {
      for (var a = -60; a <= 60; a += 5) {
        var v = spocitej(1, s, a, misto).rok;
        if (v > nej.rok) nej = { rok: v, sklon: s, azimut: a };
      }
    }
    return nej;
  }

  return { spocitej: spocitej, optimum: optimum, mista: MISTA };
})();
