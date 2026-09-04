// Helion.cz — main.js
document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  burger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#primary-nav a').forEach(a =>
  a.addEventListener('click', () => document.body.classList.remove('nav-open')));

// scroll: header shadow + progress bar
const pbar = document.getElementById('progress-bar');
addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', scrollY > 10);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (pbar && max > 0) pbar.style.width = (scrollY / max * 100) + '%';
}, { passive: true });

// spot price (stejné API jako původní helion.cz)
fetch('https://spotovaelektrina.cz/api/v1/price/get-actual-price-json')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('spot-price');
    if (el && d && d.priceCZK != null) el.textContent = `Spot: ${d.priceCZK} Kč/MWh`;
  })
  .catch(() => {});

// counters
const counters = document.querySelectorAll('.number[data-count]');
if (counters.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = +e.target.dataset.count;
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / 1800, 1);
        e.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('cs-CZ');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}

// stack carousel + autoplay + swipe
const carousel = document.getElementById('stack-carousel');
if (carousel) {
  const cards = [...carousel.querySelectorAll('.card')];
  const dotsBox = carousel.querySelector('.dots');
  const next = carousel.querySelector('.next');
  const prev = carousel.querySelector('.prev');
  let cur = 0;
  cards.forEach((_, i) => {
    const b = document.createElement('button');
    b.addEventListener('click', () => { cur = i; render(); });
    dotsBox.appendChild(b);
  });
  const dots = [...dotsBox.children];
  function render() {
    cards.forEach((card, i) => {
      const off = (i - cur + cards.length) % cards.length;
      const depth = Math.min(off, 3);
      card.style.transform = `translateY(${depth * -22}px) scale(${1 - depth * 0.045})`;
      card.style.zIndex = cards.length - off;
      card.style.opacity = off > 3 ? 0 : 1;
      card.style.pointerEvents = off === 0 ? 'auto' : 'none';
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }
  next.addEventListener('click', () => { cur = (cur + 1) % cards.length; render(); });
  prev.addEventListener('click', () => { cur = (cur - 1 + cards.length) % cards.length; render(); });
  render();
  let timer = setInterval(() => next.click(), 5000);
  const reset = () => { clearInterval(timer); timer = setInterval(() => next.click(), 5000); };
  carousel.addEventListener('click', reset);
  let x0 = null;
  carousel.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev).click();
    x0 = null; reset();
  }, { passive: true });
}

// accordion
document.querySelectorAll('.accordion__btn').forEach(btn => {
  const item = btn.parentElement;
  const content = item.querySelector('.accordion__content');
  const sync = () => { content.style.maxHeight = item.classList.contains('open') ? content.scrollHeight + 'px' : 0; };
  btn.addEventListener('click', () => { item.classList.toggle('open'); sync(); });
  sync();
});

// generické filtry (reference, novinky, manuály)
const filters = document.querySelectorAll('.filter');
if (filters.length) {
  const items = document.querySelectorAll('[data-cat]:not(.filter)');
  filters.forEach(f => f.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const cat = f.dataset.cat;
    items.forEach(c => c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat));
  }));
}

// lightbox pro reference
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('p');
  document.querySelectorAll('.ref-card').forEach(card => {
    const open = () => {
      lbImg.src = card.querySelector('img').src;
      lbCap.textContent = card.querySelector('h4').textContent +
        (card.querySelector('figcaption p') ? ' — ' + card.querySelector('figcaption p').textContent : '');
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  lb.addEventListener('click', e => { if (e.target !== lbImg) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// inquiry form -> mailto (statický web bez backendu)
const form = document.getElementById('inquiry-form');
if (form) {
  // servis: ukázat servisní ceník + povinný souhlas; ?typ=servis předvyplní typ poptávky
  const typeSel = form.querySelector('select[name="type"]');
  const servisBox = document.getElementById('servis-box');
  const kontrolaBox = document.getElementById('kontrola-box');
  const isServis = () => /^servis/i.test(typeSel.value);
  const isKontrola = () => /prohlídka/i.test(typeSel.value);
  // ?typ=fve|servis|kontrola předvyplní typ poptávky (rozcestník)
  const typRe = { fve: /rodinný/i, servis: /^servis/i, kontrola: /prohlídka/i }[new URLSearchParams(location.search).get('typ')];
  if (typRe) [...typeSel.options].some(o => typRe.test(o.text) && (typeSel.value = o.value, true));
  const syncServis = () => {
    if (servisBox) servisBox.hidden = !isServis();
    if (kontrolaBox) kontrolaBox.hidden = !isKontrola();
  };
  typeSel.addEventListener('change', syncServis);
  syncServis();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    if (isServis() && servisBox && !servisBox.querySelector('input[type="checkbox"]').checked) {
      alert('Pro objednání servisu prosím potvrďte souhlas se servisním ceníkem.');
      servisBox.querySelector('input[type="checkbox"]').focus();
      return;
    }
    const body = ['Jméno: ' + d.get('name'), 'Telefon: ' + d.get('phone'), 'E-mail: ' + d.get('email'),
      'Místo: ' + (d.get('place') || '-'), 'Poptávka: ' + d.get('type'),
      ...(isServis() ? ['Souhlas se servisním ceníkem (800 Kč paušál, 700 Kč/hod, 20 Kč/km, bez DPH): ANO'] : []),
      '', d.get('msg') || ''].join('\n');
    location.href = 'mailto:info@helion.cz?subject=' + encodeURIComponent('Poptávka z webu – ' + d.get('type'))
      + '&body=' + encodeURIComponent(body);
  });
}

// scroll reveal
(() => {
  const targets = document.querySelectorAll(
    '.hp-intro-block__top, .bento__tile, .hp-intro-block__imgs, .hp-intro-block__text, ' +
    '.hp-skills-block__head, .hp-posts-block__top, .news-card, ' +
    '.hp-members-block__content, .prod-item, .step, .ref-card, .team__card, ' +
    '.accordion__item, .contact__info, .contact__map, .e-footer__claim, .man-card, .article__hero-img'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.d = String(i % 3 + 1);
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -30px' });
  targets.forEach(el => io.observe(el));
})();

// jemný parallax intro obrázků
(() => {
  const main = document.querySelector('.img-main');
  const small = document.querySelector('.img-small');
  if (!main) return;
  addEventListener('scroll', () => {
    const r = main.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    main.style.transform = `translateY(${p * 26}px)`;
    if (small) small.style.transform = `translateY(${p * -32}px)`;
  }, { passive: true });
})();

// magnetické tlačítko (desktop, jemné)
if (matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.translate = `${x}px ${y}px`;
    });
    el.addEventListener('mouseleave', () => { el.style.translate = '0 0'; });
  });
}


// hero video: načíst až po zobrazení, plynulý fade-in, pauza mimo viewport
(() => {
  const v = document.getElementById('hero-video');
  if (!v) return;
  const conn = navigator.connection || {};
  if (conn.saveData) return; // šetřič dat: zůstane poster
  const start = () => {
    v.preload = 'auto';
    v.load();
    v.addEventListener('canplay', () => {
      v.classList.add('ready');
      v.play().catch(() => {});
    }, { once: true });
  };
  requestIdleCallback ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 800);
  new IntersectionObserver(es => es.forEach(e => {
    if (!v.classList.contains('ready')) return;
    e.isIntersecting ? v.play().catch(() => {}) : v.pause();
  }), { threshold: 0.1 }).observe(v);
})();
