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

// Town pins on the 553 x 972 map image: x = 151 + (lon - 80.214) * 230.6, y = 27 + (9.835 - lat) * 231.6
const pins = [
  [79,715,'Nugegoda'],
  [91,683,'Kadawatha'],
  [102,662,'Gampaha'],
  [149,694,'Avissawella'],
  [75,644,'Katunayake'],
  [124,650,'Nittambuwa'],
  [130,628,'Mirigama'],
  [116,749,'Horana'],
  [93,780,'Kalutara'],
  [193,609,'Rambukkana'],
  [205,625,'Mawanella'],
  [194,757,'Ratnapura'],
  [226,772,'Pelmadulla'],
  [298,836,'Embilipitiya'],
  [156,472,'Ambanpola'],
  [175,466,'Ehetuwewa'],
  [276,691,'Nuwara Eliya'],
  [282,650,'Rikillagaskada'],
  [240,919,'Kekanadura'],
  [244,902,'Puhulwella'],
  [212,892,'Akuressa'],
  [254,897,'Hakmana'],
  [259,923,'Dickwella'],
  [360,886,'Hambantota'],
  [309,877,'Angunakolapelessa'],
  [356,744,'Wellawaya'],
  [362,813,'Thanamalwila'],
  [490,615,'Ampara'],
  [479,601,'Uhana'],
  [524,714,'Pottuvil'],
  [501,525,'Kattankudy'],
  [455,471,'Walachchena'],
  [394,348,'Muttur'],
  [286,255,'Sripura'],
  [337,466,'Polonnaruwa'],
  [324,419,'Medirigiriya'],
  [215,327,'Medawachchiya']
];
const map = document.querySelector('[data-pins]');
pins.forEach(([x, y, town], i) => {
  const pin = document.createElement('span');
  pin.className = 'pin';
  pin.title = town;
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

// Demo form: emailed to healthpassportlk@gmail.com through FormSubmit, without leaving the page.
const demoForm = document.querySelector('[data-demo-form]');
const formStatus = demoForm.querySelector('[data-form-status]');
demoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = demoForm.querySelector('button');
  button.disabled = true;
  formStatus.className = '';
  formStatus.textContent = 'Sending…';
  try {
    const res = await fetch('https://formsubmit.co/ajax/healthpassportlk@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(demoForm))),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || res.status);
    demoForm.reset();
    formStatus.className = 'ok';
    formStatus.textContent = 'Thank you! We received your request and will call you soon.';
  } catch (error) {
    formStatus.className = 'err';
    formStatus.textContent = 'Sorry, that did not send. Please call 0760 510 500.';
  } finally {
    button.disabled = false;
  }
});
