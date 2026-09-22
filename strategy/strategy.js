// BBK × DAYIN strategy deck — reveal.js init + counters + chrome state
(function(){
  const print = /print-pdf/gi.test(window.location.search);
  if (print) document.documentElement.classList.add('print');

  Reveal.initialize({
    width: 1920, height: 1080, margin: 0, minScale: 0.1, maxScale: 3,
    hash: true, history: true, center: false, controls: false, progress: true,
    slideNumber: false, transition: 'fade', transitionSpeed: 'fast', backgroundTransition: 'fade',
    navigationMode: 'linear', keyboard: true, touch: true, overview: true,
    pdfMaxPagesPerSlide: 1, pdfSeparateFragments: false,
    plugins: [ RevealNotes ]
  });

  const tot = document.getElementById('tot'), cur = document.getElementById('cur');
  const slides = () => Reveal.getTotalSlides();
  const pad = n => String(n).padStart(2, '0');

  function state(){
    const s = Reveal.getCurrentSlide();
    const html = document.documentElement;
    html.classList.toggle('dark', s.classList.contains('dark'));
    html.classList.toggle('cover', s.classList.contains('cover'));
    html.classList.toggle('orange', s.classList.contains('orange'));
    cur.textContent = pad(Reveal.getIndices().h + 1);
    tot.textContent = pad(slides());
    count(s);
  }

  // count-up numbers: <span class="cnt" data-to="69587" data-dec="0" data-pre="" data-suf="">0</span>
  function count(s){
    s.querySelectorAll('.cnt').forEach(el => {
      if (el.dataset.done || print) { if (print) el.textContent = fmt(el, +el.dataset.to); return; }
      el.dataset.done = 1;
      const to = +el.dataset.to, dur = 1100, t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(el, to * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  function fmt(el, v){
    const dec = +(el.dataset.dec || 0);
    const n = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
    return (el.dataset.pre || '') + n + (el.dataset.suf || '');
  }

  Reveal.on('ready', state);
  Reveal.on('slidechanged', state);
  if (print) { // make every counter/bar final for the PDF
    document.querySelectorAll('.cnt').forEach(el => el.textContent = fmt(el, +el.dataset.to));
  }
})();
