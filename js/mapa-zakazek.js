/* Mapka zakázek na úvodní stránce: kraje ČR a do nich „napadají" panely
   zakázek po letech, až když je mapka vidět celá. Bez ovládání. */
(function () {
  const box = document.getElementById('mapa-zakazek');
  const m = window.HELION_MAPA;
  if (!box || !m) return;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `-12 -12 ${m.w + 24} ${m.h + 24}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Mapa České republiky s místy, kde HELION od roku 2003 pracoval');
  const kraje = document.createElementNS(NS, 'path');
  kraje.setAttribute('d', m.kraje);
  kraje.setAttribute('class', 'mapa-kraje');
  svg.append(kraje);
  const vrstva = document.createElementNS(NS, 'g');
  svg.append(vrstva);
  box.append(svg);
  const rok = box.parentElement.querySelector('.mapa-rok');

  const body = [];
  for (let i = 0; i < m.body.length; i += 3) body.push({ x: m.body[i], y: m.body[i + 1], r: m.body[i + 2] });

  function panel(b) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${b.x} ${b.y}) rotate(-12)`);
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', -5);
    r.setAttribute('y', -3.5);
    r.setAttribute('width', 10);
    r.setAttribute('height', 7);
    r.setAttribute('rx', 1);
    r.setAttribute('class', 'mapa-panel');
    g.append(r);
    vrstva.append(g);
    return r;
  }

  const klid = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (klid || !('IntersectionObserver' in window)) {
    body.forEach(panel);
    if (rok) rok.textContent = '2003–' + (2003 + body[body.length - 1].r);
    return;
  }

  const DELKA = 4200;   // ms na celou historii
  const posledniRok = body[body.length - 1].r;
  function prehrat() {
    const t0 = performance.now();
    let i = 0;
    function krok(ted) {
      const hotovo = Math.min(1, (ted - t0) / DELKA);
      const doRoku = hotovo * (posledniRok + 1);
      while (i < body.length && body[i].r < doRoku) {
        const r = panel(body[i]);
        r.animate([
          { transform: 'translate(-8px, -70px) rotate(-25deg)', opacity: 0 },
          { opacity: 1, offset: 0.3 },
          { transform: 'translate(0, 0) rotate(0)', opacity: 1 }
        ], { duration: 520, easing: 'cubic-bezier(.3,0,.7,1)' });
        r.classList.add('je-novy');
        setTimeout(() => r.classList.remove('je-novy'), 700);
        i++;
      }
      if (rok) rok.textContent = String(2003 + Math.min(posledniRok, Math.floor(doRoku)));
      if (hotovo < 1) requestAnimationFrame(krok);
      else if (rok) rok.textContent = '2003–' + (2003 + posledniRok);
    }
    requestAnimationFrame(krok);
  }

  const io = new IntersectionObserver((zaznamy) => {
    if (zaznamy.some(z => z.intersectionRatio >= 0.95)) { io.disconnect(); prehrat(); }
  }, { threshold: [0.95] });
  io.observe(box);
})();
