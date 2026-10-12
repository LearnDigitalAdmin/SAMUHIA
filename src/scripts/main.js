/* SAMUHIA — progressive enhancement only. The site is fully readable and navigable without this file. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  const menu = $('.menu');
  const nav = $('#nav');
  if (menu && nav) {
    const set = (open) => {
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    };
    menu.addEventListener('click', () => set(!nav.classList.contains('open')));
    nav.addEventListener('click', (e) => e.target.closest('a') && set(false));
    addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  }

  /* ---------- Reveal on scroll (only below-the-fold elements are hidden, so no flash) ---------- */
  const targets = $$('[data-reveal]');
  if (targets.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add('in');
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.1 }
    );
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('rv');
      io.observe(el);
    });
  }

  /* ---------- Hero ecosystem: click a product to preview it; links still work without JS ---------- */
  const eco = $('#eco');
  const tip = $('#tip');
  if (eco && tip) {
    if (reduceMotion) $$('animateMotion', eco).forEach((m) => m.parentNode.remove());
    const text = (tag, value, cls) => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      el.textContent = value;
      return el;
    };
    const link = (href, label) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      if (/^https?:/.test(href)) a.rel = 'noopener';
      return a;
    };
    eco.addEventListener('click', (e) => {
      const node = e.target.closest('a.node[data-slug]');
      if (!node) return;
      // Second click on the active node follows the link normally.
      if (node.classList.contains('is-active')) return;
      e.preventDefault();
      $$('a.node', eco).forEach((n) => n.classList.toggle('is-active', n === node));
      const d = node.dataset;
      const head = document.createElement('div');
      const strong = text('strong', d.name);
      head.append(strong, ' · ', text('span', d.cat, 'muted'));
      const actions = text('p', '');
      actions.style.marginTop = '10px';
      actions.append(link(`/products/${d.slug}/`, `Explore ${d.name} →`), '\u00a0\u00a0', link(d.app, 'Open app ↗'));
      tip.replaceChildren(head, text('p', d.desc), text('p', `For: ${d.aud}`, 'muted'), actions);
    });
  }

  /* ---------- Contact form (works with no backend: opens the visitor's email app) ---------- */
  const form = $('#contact-form');
  if (form) {
    const status = $('#form-status');
    const topic = new URLSearchParams(location.search).get('topic');
    const select = $('#product');
    if (topic && select) Array.from(select.options).forEach((o) => { if (o.text === topic) select.value = o.text; });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        try {
          const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          status.textContent = 'Thank you — your message has been sent.';
          return;
        } catch {
          status.textContent = 'Sorry, that did not send. Please email us directly instead.';
          return;
        }
      }
      const subject = encodeURIComponent(`[${data.product}] Message from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      location.href = `mailto:${form.dataset.email}?subject=${subject}&body=${body}`;
      status.textContent = 'Opening your email app… if nothing happens, email us directly at ' + form.dataset.email + '.';
    });
  }
})();
