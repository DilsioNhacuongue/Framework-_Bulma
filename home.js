/* ============================================================
   StackFive — animações da página inicial
   Só é carregado por index.html.
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- utilitários ---------- */
  function splitWords(el) {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(' ').forEach((word, i, arr) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      outer.setAttribute('aria-hidden', 'true');
      outer.style.setProperty('--n', i);
      const inner = document.createElement('span');
      inner.textContent = word;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
  const easeOutBack = (x) => { const c1 = 1.05, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  /* ---------- palavras dos títulos ---------- */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) splitWords(heroTitle);
  document.querySelectorAll('[data-split]').forEach(splitWords);

  /* ---------- atrasos escalonados ---------- */
  document.querySelectorAll('.team-card').forEach((c, i) => c.style.setProperty('--d', (i % 3) * 140 + 'ms'));
  document.querySelectorAll('.framework-note code').forEach((c, i) => c.style.setProperty('--k', i));

  /* ---------- entrada do hero ---------- */
  const startHero = () => {
    if (heroTitle) heroTitle.classList.add('is-in');
    document.querySelectorAll('.hero-fade').forEach((el) => el.classList.add('is-in'));
  };
  requestAnimationFrame(() => requestAnimationFrame(startHero));

  /* ---------- entrada ao fazer scroll ---------- */
  const revealTargets = document.querySelectorAll('[data-split], [data-reveal], .team-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- barra de progresso e navbar ---------- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const nav = document.querySelector('.sf-navbar');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0) + ')';
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- inclinação 3D dos cartões ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.team-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- botão magnético ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = 'translate(' + (dx * 12).toFixed(1) + 'px,' + (dy * 8).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transition = 'transform .5s cubic-bezier(.2,.9,.2,1)';
        btn.style.transform = '';
        setTimeout(() => { btn.style.transition = ''; }, 520);
      });
    });
  }

  /* ============================================================
     HERO — cinco pontos convergem numa só rede
     ============================================================ */
  const hero = document.getElementById('hero');
  const cv = document.getElementById('heroCanvas');
  const stage = document.getElementById('heroStage');
  if (!hero || !cv || !stage || !cv.getContext) return;
  const ctx = cv.getContext('2d');

  const FONT = '"Trebuchet MS","Century Gothic","Segoe UI",sans-serif';
  const members = [
    { id: 'dilsio',   name: 'Dilsio',   area: 'Cibersegurança e Redes',   color: '#2FBFB3', leader: true },
    { id: 'larrissa', name: 'Larrissa', area: 'UI/UX Design',             color: '#E0669F' },
    { id: 'osvaldo',  name: 'Osvaldo',  area: 'Backend e Bases de Dados', color: '#7C9CF0' },
    { id: 'idelson',  name: 'Idelson',  area: 'Redes e DevOps',           color: '#EA9060' },
    { id: 'angelo',   name: 'Àngelo',   area: 'Inteligência Artificial',  color: '#A98BEA' }
  ];
  const nodes = members.map((m, i) => Object.assign({ i, x: 0, y: 0, sx: 0, sy: 0, h: 0, tx: 0, ty: 0, arrived: 0 }, m));
  // arestas: contorno do pentágono e estrela interior
  const edges = [];
  for (let i = 0; i < 5; i++) edges.push({ a: i, b: (i + 1) % 5, w: 0.55, k: edges.length });
  for (let i = 0; i < 5; i++) edges.push({ a: i, b: (i + 2) % 5, w: 0.22, k: edges.length });

  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  let particles = [];
  const mouse = { x: -9999, y: -9999, on: false };
  let hovered = -1;
  let running = false, visible = true;
  let t0 = performance.now();

  function layout() {
    const hr = hero.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const oldW = W, oldH = H;
    W = Math.max(1, Math.round(hr.width));
    H = Math.max(1, Math.round(hr.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = sr.left - hr.left + sr.width / 2;
    cy = sr.top - hr.top + sr.height / 2;
    R = Math.min(sr.width * (W < 600 ? 0.30 : 0.27), sr.height * 0.30);

    const n = clamp(Math.round((W * H) / 15000), 22, 80);
    if (!particles.length || Math.abs(oldW - W) > 40 || Math.abs(oldH - H) > 40) {
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: 0.8 + Math.random() * 1.3
      }));
    }
    nodes.forEach((nd) => {
      if (!nd.sx) { // ponto de partida espalhado, fixo
        nd.sx = clamp(cx + (Math.random() - 0.5) * W * 0.9, 20, W - 20);
        nd.sy = clamp(cy + (Math.random() - 0.5) * H * 0.9, 20, H - 20);
      }
    });
  }

  function targetOf(nd, t) {
    const rot = reduced ? 0 : Math.sin(t / 7000) * 0.10;
    const ang = (-90 + 72 * nd.i) * Math.PI / 180 + rot;
    const fl = reduced ? 0 : Math.sin(t / 1100 + nd.i * 1.7) * 3;
    return { x: cx + R * Math.cos(ang) + fl, y: cy + R * Math.sin(ang) + fl * 0.6 };
  }

  function labelBox(nd) {
    // devolve posição e alinhamento do texto conforme o espaço disponível
    ctx.font = '700 15px ' + FONT;
    const w1 = ctx.measureText(nd.name).width;
    ctx.font = '400 12px ' + FONT;
    const w2 = ctx.measureText(nd.area).width;
    const w = Math.max(w1, w2);
    const off = 20;
    let place = nd.i === 0 ? 'top' : (nd.i === 1 || nd.i === 4) ? (nd.i === 1 ? 'right' : 'left') : 'bottom';
    if (place === 'right' && nd.x + off + w > W - 10) place = 'top';
    if (place === 'left' && nd.x - off - w < 10) place = 'top';
    let x = nd.x, y = nd.y, align = 'center', base = 'alphabetic';
    if (place === 'top') { y = nd.y - off - 18; }
    if (place === 'bottom') { y = nd.y + off + 12; }
    if (place === 'right') { x = nd.x + off; align = 'left'; y = nd.y - 2; }
    if (place === 'left') { x = nd.x - off; align = 'right'; y = nd.y - 2; }
    if (align === 'center') x = clamp(x, w / 2 + 10, W - w / 2 - 10);
    return { x, y, align };
  }

  function drawFrame(now) {
    const t = now - t0;
    ctx.clearRect(0, 0, W, H);

    /* partículas ambiente */
    for (const p of particles) {
      if (!reduced) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 130) * 0.9; p.x += (dx / d) * f; p.y += (dy / d) * f; }
        }
      }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 105 * 105) {
          ctx.strokeStyle = 'rgba(150,215,205,' + ((1 - Math.sqrt(d2) / 105) * 0.22).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (mouse.on) {
        const dx = a.x - mouse.x, dy = a.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 150 * 150) {
          ctx.strokeStyle = 'rgba(190,240,230,' + ((1 - Math.sqrt(d2) / 150) * 0.45).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle = 'rgba(200,232,226,.55)';
    for (const p of particles) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }

    /* posição dos nós: viajam do ponto de partida até ao pentágono */
    nodes.forEach((nd) => {
      const delay = 450 + nd.i * 150, dur = 1500;
      const p = reduced ? 1 : clamp((t - delay) / dur, 0, 1);
      nd.arrived = p;
      const tg = targetOf(nd, t);
      const e = easeOutBack(p);
      nd.x = lerp(nd.sx, tg.x, e);
      nd.y = lerp(nd.sy, tg.y, e);
    });

    /* estado de hover */
    let hv = -1;
    if (mouse.on) {
      let best = 34 * 34;
      nodes.forEach((nd) => { const dx = nd.x - mouse.x, dy = nd.y - mouse.y, d2 = dx * dx + dy * dy; if (nd.arrived > 0.9 && d2 < best) { best = d2; hv = nd.i; } });
    }
    if (hv !== hovered) { hovered = hv; hero.style.cursor = hv >= 0 ? 'pointer' : ''; }
    nodes.forEach((nd) => { nd.h = lerp(nd.h, nd.i === hovered ? 1 : 0, 0.18); });

    /* arestas desenhadas uma a uma */
    const edgeStart = reduced ? -99999 : 2300;
    edges.forEach((ed) => {
      const A = nodes[ed.a], B = nodes[ed.b];
      const p = clamp((t - edgeStart - ed.k * 160) / 700, 0, 1);
      if (p <= 0) return;
      const ep = easeOutCubic(p);
      const ex = lerp(A.x, B.x, ep), ey = lerp(A.y, B.y, ep);
      const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
      const boost = Math.max(A.h, B.h);
      g.addColorStop(0, A.color); g.addColorStop(1, B.color);
      ctx.globalAlpha = clamp(ed.w + boost * 0.4, 0, 1);
      ctx.strokeStyle = g; ctx.lineWidth = ed.w > 0.4 ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.globalAlpha = 1;
      // pacote de dados a percorrer a aresta já desenhada
      if (p >= 1 && !reduced) {
        const f = ((t / (2400 + ed.k * 170)) + ed.k * 0.37) % 1;
        const px = lerp(A.x, B.x, f), py = lerp(A.y, B.y, f);
        const gl = ctx.createRadialGradient(px, py, 0, px, py, 9);
        gl.addColorStop(0, '#ffffff'); gl.addColorStop(0.25, A.color); gl.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = ed.w > 0.4 ? 0.95 : 0.6;
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, 9, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    /* ligações de partículas próximas aos nós */
    nodes.forEach((nd) => {
      if (nd.arrived < 0.5) return;
      for (const p of particles) {
        const dx = p.x - nd.x, dy = p.y - nd.y, d2 = dx * dx + dy * dy;
        if (d2 < 95 * 95) {
          ctx.globalAlpha = (1 - Math.sqrt(d2) / 95) * 0.5;
          ctx.strokeStyle = nd.color; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(nd.x, nd.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    });

    /* nós e etiquetas */
    nodes.forEach((nd) => {
      const r = (nd.leader ? 9 : 7) + nd.h * 3;
      const gl = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, r * 4.2);
      gl.addColorStop(0, nd.color + 'AA'); gl.addColorStop(1, nd.color + '00');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(nd.x, nd.y, r * 4.2, 0, 6.2832); ctx.fill();

      if (!reduced && nd.arrived >= 1) { // onda a sair do nó
        const cyc = (t / 3400 + nd.i * 0.23) % 1;
        ctx.globalAlpha = (1 - cyc) * 0.55; ctx.strokeStyle = nd.color; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, r + cyc * 30, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (nd.leader) { // anel dourado do líder
        ctx.save(); ctx.translate(nd.x, nd.y); ctx.rotate(reduced ? 0 : t / 2600);
        ctx.strokeStyle = '#D4A24C'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.arc(0, 0, r + 7, 0, 6.2832); ctx.stroke(); ctx.restore(); ctx.setLineDash([]);
      }
      ctx.fillStyle = nd.color; ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#0D1B2A'; ctx.beginPath(); ctx.arc(nd.x, nd.y, r * 0.38, 0, 6.2832); ctx.fill();

      const la = clamp((nd.arrived - 0.7) / 0.3, 0, 1);
      if (la > 0) {
        const L = labelBox(nd);
        ctx.textAlign = L.align; ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = la;
        ctx.fillStyle = '#FFFFFF'; ctx.font = '700 ' + (15 + nd.h) + 'px ' + FONT;
        ctx.fillText(nd.name, L.x, L.y);
        ctx.globalAlpha = la * (0.62 + nd.h * 0.38);
        ctx.fillStyle = nd.h > 0.05 ? nd.color : '#B9C9C6'; ctx.font = '400 12px ' + FONT;
        ctx.fillText(nd.area, L.x, L.y + 16);
        ctx.globalAlpha = 1;
      }
    });
  }

  function loop(now) {
    if (!running) return;
    drawFrame(now);
    requestAnimationFrame(loop);
  }
  function start() { if (running || reduced) return; running = true; requestAnimationFrame(loop); }
  function stop() { running = false; }

  /* eventos */
  function setMouse(e) {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    if (reduced) drawFrame(performance.now());
  }
  hero.addEventListener('pointermove', setMouse);
  hero.addEventListener('pointerleave', () => { mouse.on = false; if (reduced) drawFrame(performance.now()); });
  hero.addEventListener('click', (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let hit = -1, best = 40 * 40;
    nodes.forEach((nd) => { const dx = nd.x - x, dy = nd.y - y, d2 = dx * dx + dy * dy; if (nd.arrived > 0.9 && d2 < best) { best = d2; hit = nd.i; } });
    if (hit < 0) return;
    const card = document.querySelector('[data-member="' + nodes[hit].id + '"]');
    if (!card) return;
    card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => { card.classList.remove('is-called'); void card.offsetWidth; card.classList.add('is-called'); }, reduced ? 0 : 650);
    setTimeout(() => card.classList.remove('is-called'), 2400);
  });

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { layout(); if (reduced) drawFrame(performance.now()); }).observe(hero);
  } else {
    window.addEventListener('resize', () => { layout(); if (reduced) drawFrame(performance.now()); });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => {
      visible = en[0].isIntersecting;
      if (visible && !document.hidden) start(); else stop();
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });

  layout();
  t0 = performance.now();
  if (reduced) { nodes.forEach((n) => { n.arrived = 1; }); drawFrame(t0 + 99999); } else start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); if (reduced) drawFrame(performance.now()); });
})();
