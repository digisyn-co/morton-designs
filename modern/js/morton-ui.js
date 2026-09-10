/* Loaded as a normal <script> (works on file:// and any host). Exposes window.MortonUI. */
(function () {
// Shared behaviour for the Morton Modern pages.
// Fail-safe by design: content is visible without JS; this only adds motion and interaction.

function initMorton(opts = {}) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accent = opts.accent || '#F2B632';
  const cleanup = [];

  if (accent !== '#F2B632') {
    document.body.querySelectorAll('*').forEach(el => {
      const s = el.getAttribute('style') || '';
      if (s.includes('#F2B632')) el.setAttribute('style', s.split('#F2B632').join(accent));
    });
  }

  if (opts.gridLines === false) {
    const g = document.querySelector('[data-grid]');
    if (g) g.style.display = 'none';
  }

  const highlight = () => {
    if (!opts.current) return;
    const active = document.querySelector('[data-nav="' + opts.current + '"]');
    if (active) active.style.color = accent;
  };

  /* ---------- scroll: progress bar, nav background, hero parallax ---------- */
  const onScroll = () => {
    const bar = document.querySelector('[data-progress]');
    const navbg = document.querySelector('[data-navbg]');
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    if (navbg) {
      const on = window.scrollY > 40;
      navbg.style.background = on ? 'rgba(6,9,15,.86)' : 'rgba(6,9,15,0)';
      navbg.style.backdropFilter = on ? 'blur(16px)' : 'blur(0px)';
      navbg.style.webkitBackdropFilter = navbg.style.backdropFilter;
      navbg.style.borderBottomColor = on ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,0)';
    }
    if (!reduce) {
      document.querySelectorAll('[data-parallax] img').forEach(px => {
        const r = px.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          px.style.transform = 'translateY(' + (((r.top + r.height / 2) - window.innerHeight / 2) * -0.045).toFixed(2) + 'px)';
        }
      });
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanup.push(() => window.removeEventListener('scroll', onScroll));

  /* ---------- reveals ---------- */
  const show = el => {
    el.setAttribute('data-revealed', '1');
    if (el.hasAttribute('data-mask')) {
      const inner = el.firstElementChild;
      if (inner) { inner.style.transform = 'none'; inner.style.opacity = '1'; }
    } else if (el.hasAttribute('data-line')) {
      el.style.transform = 'scaleX(1)';
    } else {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  };

  const io = reduce ? null : new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const sibs = Array.from(el.parentElement ? el.parentElement.children : [])
      .filter(n => n.hasAttribute && n.hasAttribute('data-mask'));
    const i = sibs.indexOf(el);
    setTimeout(() => show(el), i > 0 ? i * 90 : 0);
    io.unobserve(el);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  const scan = () => {
    const targets = Array.from(document.querySelectorAll('[data-rise],[data-mask],[data-line]'))
      .filter(el => !el.hasAttribute('data-revealed') && !el.hasAttribute('data-watched'));
    targets.forEach(el => {
      el.setAttribute('data-watched', '1');
      if (reduce) { show(el); return; }
      if (el.hasAttribute('data-mask')) {
        const inner = el.firstElementChild;
        if (inner) {
          inner.style.transform = 'translateY(105%)';
          inner.style.opacity = '0';
          inner.style.transition = 'transform .95s cubic-bezier(.16,1,.3,1), opacity .7s ease';
        }
      } else if (el.hasAttribute('data-line')) {
        el.style.transform = 'scaleX(0)';
        el.style.transition = 'transform 1.1s cubic-bezier(.16,1,.3,1)';
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
      }
      io.observe(el);
    });
  };
  scan();
  const rescans = [setTimeout(scan, 350), setTimeout(scan, 1200)];
  const safety = setTimeout(() => {
    document.querySelectorAll('[data-rise],[data-mask],[data-line]').forEach(show);
  }, 3000);
  cleanup.push(() => { rescans.forEach(clearTimeout); clearTimeout(safety); if (io) io.disconnect(); });

  /* ---------- practice index: hover swaps background ---------- */
  const bindRows = () => {
  const bgs = {};
  document.querySelectorAll('[data-bg]').forEach(img => { bgs[img.getAttribute('data-bg')] = img; });
  document.querySelectorAll('[data-row]:not([data-bound])').forEach(row => {
    row.setAttribute('data-bound', '1');
    const key = row.getAttribute('data-bgkey');
    const title = row.querySelector('[data-rowtitle]');
    const arrow = row.querySelector('[data-arrow]');
    const enter = () => {
      Object.entries(bgs).forEach(([k, img]) => {
        img.style.opacity = k === key ? '1' : '0';
        img.style.transform = k === key ? 'scale(1)' : 'scale(1.06)';
      });
      if (title && !reduce) title.style.transform = 'translateX(14px)';
      if (arrow) arrow.style.transform = 'translateX(10px)';
    };
    const leave = () => {
      Object.values(bgs).forEach(img => { img.style.opacity = '0'; img.style.transform = 'scale(1.06)'; });
      if (title) title.style.transform = 'none';
      if (arrow) arrow.style.transform = 'none';
    };
    row.addEventListener('mouseenter', enter);
    row.addEventListener('focus', enter);
    row.addEventListener('mouseleave', leave);
    row.addEventListener('blur', leave);
  });
  };

  /* ---------- image / card hovers ---------- */
  const bindCards = () => {
  document.querySelectorAll('[data-person]:not([data-bound]),[data-article]:not([data-bound])').forEach(card => {
    card.setAttribute('data-bound', '1');
    const img = card.querySelector('img');
    const barEl = card.querySelector('[data-personbar]');
    card.addEventListener('mouseenter', () => {
      if (img) img.style.transform = 'scale(1.05)';
      if (barEl) barEl.style.transform = 'scaleX(1)';
    });
    card.addEventListener('mouseleave', () => {
      if (img) img.style.transform = 'none';
      if (barEl) barEl.style.transform = 'scaleX(0)';
    });
  });
  };

  /* ---------- full-screen menu (delegated, so mount order does not matter) ---------- */
  const setMenu = open => {
    const menu = document.querySelector('[data-menu]');
    if (!menu) return;
    menu.style.clipPath = open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)';
    menu.style.pointerEvents = open ? 'auto' : 'none';
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    const btn = document.querySelector(open ? '[data-menu-close]' : '[data-menu-open]');
    if (btn) btn.focus();
  };
  const onClick = e => {
    const t = e.target.closest ? e.target.closest('[data-menu-open],[data-menu-close],[data-menu-link]') : null;
    if (!t) return;
    if (t.hasAttribute('data-menu-open')) setMenu(true); else setMenu(false);
  };
  document.addEventListener('click', onClick);
  const onKey = e => { if (e.key === 'Escape') setMenu(false); };
  document.addEventListener('keydown', onKey);
  cleanup.push(() => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); });

  /* ---------- custom cursor ---------- */
  const bindCursor = () => {
  const dot = document.querySelector('[data-cursor-dot]:not([data-bound])');
  const useCursor = opts.customCursor !== false && !reduce &&
    window.matchMedia('(hover: hover) and (min-width: 900px)').matches;
  if (dot && useCursor) {
    dot.setAttribute('data-bound', '1');
    const labels = { explore: 'Explore', view: 'View', open: 'Open', read: 'Read' };
    let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      dot.style.transform = 'translate(' + (cx - 42) + 'px,' + (cy - 42) + 'px)';
      raf = requestAnimationFrame(loop);
    };
    const onMove = e => {
      tx = e.clientX; ty = e.clientY;
      const t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (t) { dot.textContent = labels[t.getAttribute('data-cursor')] || 'Open'; dot.style.opacity = '1'; }
      else dot.style.opacity = '0';
    };
    dot.style.left = '0px';
    dot.style.top = '0px';
    window.addEventListener('mousemove', onMove, { passive: true });
    loop();
    cleanup.push(() => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); });
  }
  };

  const bindAll = () => { highlight(); bindRows(); bindCards(); bindCursor(); };
  bindAll();
  const rebinds = [setTimeout(bindAll, 400), setTimeout(bindAll, 1300)];
  cleanup.push(() => rebinds.forEach(clearTimeout));

  /* ---------- enquiry form ---------- */
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      const sent = document.querySelector('[data-sent]');
      if (sent) sent.style.display = 'block';
    });
  });

  /* ---------- insights filter ---------- */
  const chips = Array.from(document.querySelectorAll('[data-filter]'));
  if (chips.length) {
    const apply = key => {
      chips.forEach(c => {
        const on = c.getAttribute('data-filter') === key;
        c.style.background = on ? accent : 'transparent';
        c.style.color = on ? '#06090F' : '#06090F';
        c.style.borderColor = on ? accent : 'rgba(6,9,15,.25)';
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      document.querySelectorAll('[data-cat]').forEach(item => {
        item.style.display = (key === 'all' || item.getAttribute('data-cat') === key) ? '' : 'none';
      });
    };
    chips.forEach(c => c.addEventListener('click', () => apply(c.getAttribute('data-filter'))));
    apply('all');
  }

  /* ---------- article reading progress ---------- */
  const art = document.querySelector('[data-articlebody]');
  const artBar = document.querySelector('[data-readbar]');
  if (art && artBar) {
    const onRead = () => {
      const r = art.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      artBar.style.width = (done * 100).toFixed(1) + '%';
    };
    onRead();
    window.addEventListener('scroll', onRead, { passive: true });
    cleanup.push(() => window.removeEventListener('scroll', onRead));
  }

  return () => cleanup.forEach(fn => fn());
}

window.MortonUI = { initMorton: initMorton };
})();
