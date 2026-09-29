/* Mapka zakázek na úvodní stránce: do krajů ČR padají shora panely zakázek
   rok po roku (FVE, kolektory, tepelná čerpadla). Hraje dokola, jen když je
   mapka vidět celá; mimo obrazovku stojí. Bez ovládání. */
(function () {
  const box = document.getElementById('mapa-zakazek');
  const m = window.HELION_MAPA;
  if (!box || !m) return;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (jmeno, atributy, rodic) => {
    const e = document.createElementNS(NS, jmeno);
    for (const k in atributy) e.setAttribute(k, atributy[k]);
    if (rodic) rodic.append(e);
    return e;
  };

  const svg = el('svg', { viewBox: `-15 -15 ${m.w + 30} ${m.h + 30}`, role: 'img',
    'aria-label': 'Mapa České republiky s místy, kde HELION od roku 2003 pracoval' });
  el('path', { d: m.kraje, class: 'mapa-kraje' }, svg);
  const vrstva = el('g', {}, svg);
  box.append(svg);
  const rok = box.parentElement.querySelector('.mapa-rok');
  const popis = box.parentElement.querySelector('.mapa-text .label');
  const fmt = n => n.toLocaleString('cs-CZ');
  // Velké číslo = kolik zakázek už na mapě je (i zamrzlý snímek pak dává smysl), rok v popisku.
  const ukaz = (n, r, hotovo) => {
    if (rok) rok.textContent = fmt(n);
    if (popis) popis.textContent = hotovo ? 'zakázek po celé ČR, 2003–' + r : 'zakázek po celé ČR, 2003–' + r + '…';
  };

  const body = [];
  for (let i = 0; i < m.body.length; i += 4) {
    body.push({ x: m.body[i], y: m.body[i + 1], r: m.body[i + 2], typ: m.body[i + 3] });
  }
  const posledniRok = body[body.length - 1].r;

  // Symboly převzaté z velké mapy: FVE panel s mřížkou, trubicový kolektor,
  // venkovní jednotka tepelného čerpadla, šedomodrý panel = druh neuveden.
  function symbol(b) {
    const misto = el('g', { transform: `translate(${b.x} ${b.y})` }, vrstva);
    const pad = el('g', { class: 'mapa-pad' }, misto);
    const s = el('g', { transform: 'scale(1.9) rotate(-12)', class: 'mapa-symbol' }, pad);
    if (b.typ === 1) {
      el('rect', { class: 'kolektor', x: -6, y: -5, width: 12, height: 9, rx: 1 }, s);
      el('path', { class: 'kolektor-trubky', d: 'M-4,-3V2 M-1.4,-3V2 M1.4,-3V2 M4,-3V2' }, s);
    } else if (b.typ === 2) {
      el('rect', { class: 'cerpadlo', x: -7, y: -5, width: 14, height: 10, rx: 1 }, s);
      el('circle', { class: 'cerpadlo-vetrak', cx: -2, r: 3.3 }, s);
    } else {
      el('rect', { class: 'stin', x: -5, y: -2, width: 12, height: 9, rx: 1 }, s);
      el('rect', { class: b.typ === 0 ? 'panel' : 'panel panel-jiny', x: -6, y: -5, width: 12, height: 8, rx: 0.5 }, s);
      el('path', { class: 'panel-mrizka', d: 'M-2,-5V3 M2,-5V3 M-6,-1H6' }, s);
    }
    return { misto, pad, s };
  }

  // Při omezených animacích v systému panely jen přibývají (bez padání).
  const klid = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) {
    body.forEach(symbol);
    ukaz(body.length, 2003 + posledniRok, true);
    return;
  }

  // Časová osa: každý rok stejně dlouhý úsek, zakázky roku rovnoměrně v něm.
  const ROK_MS = 420, PAUZA_MS = 4500, ZMIZENI_MS = 900;
  const poRocich = new Map();
  body.forEach(b => poRocich.set(b.r, (poRocich.get(b.r) || 0) + 1));
  const videno = new Map();
  const kdy = body.map(b => {
    const n = videno.get(b.r) || 0;
    videno.set(b.r, n + 1);
    return b.r * ROK_MS + (n / poRocich.get(b.r)) * ROK_MS;
  });
  const KONEC = (posledniRok + 1) * ROK_MS;

  let hlava = 0, i = 0, posledni = 0, bezi = false, aktualni = null, pauzaDo = 0;
  const vsechny = [];

  function pust(b) {
    const sym = symbol(b);
    vsechny.push(sym);
    const vyska = b.y + 260;          // padá odshora, nad okrajem mapy
    if (!klid && sym.pad.animate) sym.pad.animate([
      { transform: `translate(-26px, -${vyska}px) rotate(-35deg)`, opacity: 0 },
      { transform: `translate(-17px, -${vyska * 0.8}px) rotate(-24deg)`, opacity: 1, offset: 0.15 },
      { transform: 'translate(0, 3px) rotate(3deg)', opacity: 1, offset: 0.86 },
      { transform: 'translate(0, 0) rotate(0)', opacity: 1 }
    ], { duration: 620, easing: 'cubic-bezier(.4,0,.8,1)' });
    if (aktualni) aktualni.classList.remove('je-aktualni');
    aktualni = sym.s;
    aktualni.classList.add('je-aktualni');
  }

  function odznova() {
    const stare = vsechny.splice(0);
    stare.forEach(sym => { if (sym.misto.animate) sym.misto.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ZMIZENI_MS, fill: 'forwards' }); });
    setTimeout(() => stare.forEach(sym => sym.misto.remove()), ZMIZENI_MS);
    hlava = 0; i = 0; aktualni = null;
  }

  function snimek(t) {
    if (!bezi) return;
    const dt = posledni ? Math.min(t - posledni, 100) : 0;
    posledni = t;
    if (pauzaDo) {
      pauzaDo -= dt;
      if (pauzaDo <= 0) { pauzaDo = 0; odznova(); }
    } else {
      hlava += dt;
      while (i < body.length && kdy[i] <= hlava) pust(body[i++]);
      ukaz(i, 2003 + Math.min(posledniRok, Math.floor(hlava / ROK_MS)), false);
      if (hlava >= KONEC) {
        ukaz(body.length, 2003 + posledniRok, true);
        if (aktualni) aktualni.classList.remove('je-aktualni');
        pauzaDo = PAUZA_MS;
      }
    }
    requestAnimationFrame(snimek);
  }

  function nastav(vidim) {
    if (vidim === bezi) return;
    bezi = vidim;
    posledni = 0;
    if (svg.getAnimations) svg.getAnimations({ subtree: true }).forEach(a => (vidim ? a.play() : a.pause()));
    if (vidim) requestAnimationFrame(snimek);
  }

  // „Vidět celá" s rezervou: při zvětšení stránky Chrome hlásí třeba 0,949
  // místo 0,95 a přesná hranice by animaci nikdy nespustila.
  new IntersectionObserver(z => nastav(z[z.length - 1].intersectionRatio >= 0.8),
    { threshold: [0, 0.25, 0.5, 0.8, 0.9, 1] }).observe(box);
})();
