/* Loaded as a normal <script> (works on file:// and any host). Exposes window.MortonQuietUI. */
(function () {
// Shared behaviour for the Morton Quiet (Concept 03) pages.
// Content is fully visible without JS; this layer only adds motion, responsive
// collapse, and interaction.

function initQuiet(opts = {}) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => window.matchMedia('(max-width: 860px)').matches;
  const cleanup = [];

  /* ---------- responsive collapse ---------- */
  const applyLayout = () => {
    const m = mobile();
    const nav = document.querySelector('[data-desknav]');
    const burger = document.querySelector('[data-burger]');
    const navcta = document.querySelector('[data-navcta]');
    if (nav) nav.style.display = m ? 'none' : 'flex';
    if (burger) burger.style.display = m ? 'flex' : 'none';
    if (navcta) navcta.style.display = m ? 'none' : 'inline-flex';

    document.querySelectorAll('[data-collapse]').forEach(el => {
      if (!el.dataset.gridBase) el.dataset.gridBase = el.style.gridTemplateColumns;
      el.style.gridTemplateColumns = m ? 'minmax(0,1fr)' : el.dataset.gridBase;
    });
    document.querySelectorAll('form[data-form]').forEach(f => {
      f.style.gridTemplateColumns = m ? '1fr' : '1fr 1fr';
    });
    document.querySelectorAll('[data-panel] > div:last-child').forEach(el => {
      if (!el.dataset.gridBase) el.dataset.gridBase = el.style.gridTemplateColumns;
      el.style.gridTemplateColumns = m ? 'auto minmax(0,1fr)' : el.dataset.gridBase;
    });
    document.querySelectorAll('[data-panelarrow]').forEach(el => {
      el.style.display = m ? 'none' : 'inline-flex';
    });
    document.querySelectorAll('[data-parallax]').forEach(el => {
      if (!el.dataset.mhBase) el.dataset.mhBase = el.style.minHeight;
      el.style.minHeight = m ? '52vh' : el.dataset.mhBase;
    });
    document.querySelectorAll('[data-sidebar]').forEach(el => {
      el.style.position = m ? 'static' : 'sticky';
    });
    const sticky = document.querySelector('[data-stickycta]');
    if (sticky) sticky.style.display = m ? 'block' : 'none';
    const floatc = document.querySelector('[data-floatcta]');
    if (floatc) floatc.style.display = m ? 'none' : 'inline-flex';
  };
  applyLayout();
  window.addEventListener('resize', applyLayout);
  cleanup.push(() => window.removeEventListener('resize', applyLayout));

  /* ---------- active nav link ---------- */
  if (opts.current) {
    const a = document.querySelector('[data-nav="' + opts.current + '"]');
    if (a) a.style.color = '#080808';
  }

  /* ---------- scroll ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    const navbg = document.querySelector('[data-navbg]');
    if (navbg) {
      const on = y > 40;
      navbg.style.background = on ? 'rgba(247,245,240,.9)' : 'rgba(247,245,240,0)';
      navbg.style.backdropFilter = on ? 'blur(16px)' : 'blur(0px)';
      navbg.style.webkitBackdropFilter = navbg.style.backdropFilter;
      navbg.style.borderBottomColor = on ? 'rgba(8,8,8,.12)' : 'rgba(8,8,8,0)';
    }
    if (!reduce) {
      document.querySelectorAll('[data-parallax] img').forEach(px => {
        const r = px.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          px.style.transform = 'translateY(' + (((r.top + r.height / 2) - window.innerHeight / 2) * -0.05).toFixed(2) + 'px)';
        }
      });
      document.querySelectorAll('[data-drift]').forEach(arc => {
        const r = arc.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const p = ((r.top + r.height / 2) - window.innerHeight / 2) * -0.08;
          arc.style.transform = 'translateY(calc(-50% + ' + p.toFixed(1) + 'px))';
        }
      });
    }
    const past = y > window.innerHeight * 0.9;
    const nearEnd = (window.innerHeight + y) > (document.documentElement.scrollHeight - window.innerHeight * 0.9);
    const floatc = document.querySelector('[data-floatcta]');
    if (floatc && !mobile()) {
      const on = past && !nearEnd;
      floatc.style.opacity = on ? '1' : '0';
      floatc.style.transform = on ? 'none' : 'translateY(14px)';
      floatc.style.pointerEvents = on ? 'auto' : 'none';
    }
    const sticky = document.querySelector('[data-stickycta]');
    if (sticky && mobile()) sticky.style.transform = past ? 'none' : 'translateY(100%)';

    const art = document.querySelector('[data-articlebody]');
    const artBar = document.querySelector('[data-readbar]');
    if (art && artBar) {
      const r = art.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      artBar.style.width = (done * 100).toFixed(1) + '%';
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
    } else if (el.hasAttribute('data-vline')) {
      el.style.transform = 'scaleY(1)';
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
    setTimeout(() => show(el), i > 0 ? i * 110 : 0);
    io.unobserve(el);
  }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  const scan = () => {
    document.querySelectorAll('[data-rise]:not([data-watched]),[data-mask]:not([data-watched]),[data-vline]:not([data-watched])').forEach(el => {
      el.setAttribute('data-watched', '1');
      if (reduce) { show(el); return; }
      if (el.hasAttribute('data-mask')) {
        const inner = el.firstElementChild;
        if (inner) {
          inner.style.transform = 'translateY(105%)';
          inner.style.opacity = '0';
          inner.style.transition = 'transform 1.1s cubic-bezier(.16,1,.3,1), opacity .8s ease';
        }
      } else if (!el.hasAttribute('data-vline')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1)';
      }
      io.observe(el);
    });
  };

  /* ---------- panels + card hovers ---------- */
  const bindPanels = () => {
    document.querySelectorAll('[data-panel]:not([data-bound])').forEach(panel => {
      panel.setAttribute('data-bound', '1');
      const img = panel.querySelector('[data-panelimg]');
      const title = panel.querySelector('[data-paneltitle]');
      const rule = panel.querySelector('[data-panelrule]');
      const arrow = panel.querySelector('[data-panelarrow]');
      const enter = () => {
        if (img) { img.style.opacity = '.55'; img.style.transform = 'scale(1)'; }
        if (title && !reduce) title.style.transform = 'translateX(16px)';
        if (rule) rule.style.transform = 'scaleX(1)';
        if (arrow) arrow.style.transform = 'translateX(10px)';
      };
      const leave = () => {
        if (img) { img.style.opacity = '0'; img.style.transform = 'scale(1.08)'; }
        if (title) title.style.transform = 'none';
        if (rule) rule.style.transform = 'scaleX(0)';
        if (arrow) arrow.style.transform = 'none';
      };
      panel.addEventListener('mouseenter', enter);
      panel.addEventListener('focus', enter);
      panel.addEventListener('mouseleave', leave);
      panel.addEventListener('blur', leave);
    });
    document.querySelectorAll('[data-person]:not([data-bound]),[data-article]:not([data-bound])').forEach(card => {
      card.setAttribute('data-bound', '1');
      const img = card.querySelector('img');
      if (!img) return;
      card.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.04)'; });
      card.addEventListener('mouseleave', () => { img.style.transform = 'none'; });
    });
  };

  const bindAll = () => { applyLayout(); scan(); bindPanels(); };
  bindAll();
  const rebinds = [setTimeout(bindAll, 400), setTimeout(bindAll, 1300)];
  const safety = setTimeout(() => {
    document.querySelectorAll('[data-rise],[data-mask],[data-vline]').forEach(show);
  }, 3000);
  cleanup.push(() => { rebinds.forEach(clearTimeout); clearTimeout(safety); if (io) io.disconnect(); });

  /* ---------- menu ---------- */
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
    setMenu(t.hasAttribute('data-menu-open'));
  };
  document.addEventListener('click', onClick);
  const onKey = e => { if (e.key === 'Escape') setMenu(false); };
  document.addEventListener('keydown', onKey);
  cleanup.push(() => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
  });

  /* ---------- accordion ---------- */
  document.querySelectorAll('[data-acc]').forEach(d => {
    d.addEventListener('toggle', () => {
      const sign = d.querySelector('[data-accmark]');
      if (sign) sign.style.transform = d.open ? 'rotate(45deg)' : 'none';
    });
  });

  /* ---------- form ---------- */
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      const sent = document.querySelector('[data-sent]');
      if (sent) sent.style.display = 'block';
    });
  });

  return () => cleanup.forEach(fn => fn());
}

window.MortonQuietUI = { initQuiet: initQuiet };
})();
