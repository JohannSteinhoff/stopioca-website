// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

function closeMenu() {
  links.classList.remove('open');
  toggle.classList.remove('open');
  document.body.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});

// Close menu after tapping a link (mobile)
links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===== Scroll indicator (boba-pearl straw) =====
const dots = Array.from(document.querySelectorAll('.spy-dot'));
const spySections = dots
  .map(d => ({ dot: d, el: document.getElementById(d.dataset.target) }))
  .filter(s => s.el);

let activeId = null;
function setActive(target) {
  if (target === activeId) return;     // skip redundant DOM writes
  activeId = target;
  dots.forEach(d => {
    const on = d.dataset.target === target;
    d.classList.toggle('active', on);
    if (on) d.setAttribute('aria-current', 'location');
    else d.removeAttribute('aria-current');
  });
}

if (spySections.length) {
  // Scroll-position scrollspy: a trigger line sits ~32% down the viewport;
  // the active section is the last one whose top has passed that line.
  // Robust for sections shorter than the viewport, the footer gap, and both
  // ends of the page (unlike a center-line IntersectionObserver).
  const TRIGGER = 0.32;

  function update() {
    const docEl = document.documentElement;
    const line = window.scrollY + window.innerHeight * TRIGGER;
    let current = spySections[0].el.id;
    for (const { el } of spySections) {
      if (el.offsetTop <= line) current = el.id; else break;
    }
    // Snap to the last section once we reach the very bottom (footer region).
    if (window.scrollY + window.innerHeight >= docEl.scrollHeight - 2) {
      current = spySections[spySections.length - 1].el.id;
    }
    setActive(current);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', update);
  update();
}

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
