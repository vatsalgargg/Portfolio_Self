const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const compactScreen = matchMedia('(max-width: 700px), (pointer: coarse)');
const header = document.querySelector('.header');
const menu = document.querySelector('#menu');
const toggle = document.querySelector('#menu-toggle');
let menuDestination = null;
const closeMenu = () => menu.close();
toggle.addEventListener('click', () => { menu.showModal(); toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; });
document.querySelector('#menu-close').addEventListener('click', closeMenu);
menu.addEventListener('close', () => { toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; (menuDestination || toggle).focus({preventScroll:true}); menuDestination = null; });
menu.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => { menuDestination = document.querySelector(link.hash); menuDestination.setAttribute('tabindex', '-1'); closeMenu(); }));
let scheduled = false;
function updateScroll() {
  const y = window.scrollY;
  const extent = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle('scrolled', y > 50);
  document.documentElement.style.setProperty('--progress', extent > 0 ? y / extent : 0);
  document.documentElement.style.setProperty('--backdrop-opacity', Math.max(.12, 1 - y / innerHeight * .8));
  document.documentElement.style.setProperty('--parallax', reducedMotion.matches || compactScreen.matches ? '0px' : Math.min(y * .18, 160) + 'px');
  scheduled = false;
}
addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, {passive:true});
addEventListener('resize', updateScroll);
reducedMotion.addEventListener('change', updateScroll);
compactScreen.addEventListener('change', updateScroll);
updateScroll();
if ('IntersectionObserver' in window) {
  document.body.classList.add('motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('[data-count]').forEach(counter => {
      if (reducedMotion.matches) return;
      const end = Number(counter.dataset.count), start = performance.now();
      function tick(now) { const progress = reducedMotion.matches ? 1 : Math.min((now - start) / 1100, 1); counter.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3))).toLocaleString('en-US'); if (progress < 1) requestAnimationFrame(tick); }
      requestAnimationFrame(tick);
    });
    observer.unobserve(entry.target);
  }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Replay the signature when it leaves and re-enters the viewport.
if ('IntersectionObserver' in window) {
  const signatureObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('writing', entry.isIntersecting);
  }), {threshold:.55});
  signatureObserver.observe(document.querySelector('.signature'));
  const closingObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.closest('footer').classList.toggle('in-view', entry.isIntersecting);
  }), {threshold:.2});
  closingObserver.observe(document.querySelector('.closing'));
  const labels = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  }), {threshold:.4});
  document.querySelectorAll('.resume-section>.section-label').forEach(label => labels.observe(label));
}
