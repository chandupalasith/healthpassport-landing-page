// Scroll reveals, number count-up, map pins, back-to-top ring and the demo form.
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const countUp = (el) => {
  const target = Number(el.dataset.count);
  const comma = 'comma' in el.dataset;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / 1200, 1);
    const value = Math.round(target * (1 - (1 - t) ** 3));
    el.textContent = comma ? value.toLocaleString('en-US') : value;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const seen = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    if (!calm) entry.target.querySelectorAll('[data-count]').forEach(countUp);
    seen.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => seen.observe(el));

// Pin positions on the 553 x 972 map image.
const pins = [[283,254],[391,348],[331,418],[368,506],[496,526],[334,575],[482,614],[519,713],[153,471],[176,467],[189,610],[203,626],[129,628],[123,651],[72,645],[63,663],[88,684],[75,713],[148,695],[277,691],[327,723],[114,749],[104,785],[191,757],[224,771],[359,813],[292,838],[311,884],[210,891],[233,916],[258,922],[237,710],[228,927],[342,686]];
const map = document.querySelector('[data-pins]');
pins.forEach(([x, y], i) => {
  const pin = document.createElement('span');
  pin.className = 'pin';
  pin.style.cssText = `left:${x / 5.53}%;top:${y / 9.72}%;--d:${(i * 0.37) % 3.6}s`;
  map.append(pin);
});

// A second copy of the client list makes the marquee loop without a gap.
if (!calm) {
  const list = document.querySelector('.marquee-list');
  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
  list.after(copy);
}

// Back-to-top button with a ring that fills as the page scrolls.
const toTop = document.querySelector('.to-top');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  toTop.style.setProperty('--p', max > 0 ? (scrollY / max) * 100 : 0);
  toTop.classList.toggle('on', scrollY > 400);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// The demo form has no server: it opens WhatsApp with the message ready to send.
document.querySelector('[data-demo-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const { name, lab, town } = event.target.elements;
  const lines = ['ආයුබෝවන්, මට Health Passport demo login එක එවන්න.', `Name: ${name.value}`, `Lab: ${lab.value}`];
  if (town.value) lines.push(`Town: ${town.value}`);
  open(`https://wa.me/94760510500?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});
