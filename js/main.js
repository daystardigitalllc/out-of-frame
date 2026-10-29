(function () {
  var C = window.OOF, $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VID = C.videoId;

  // ---- Config-driven bits
  document.querySelectorAll('[data-phone]').forEach(function (a) { a.textContent = C.phone; a.href = C.phoneHref; });
  document.querySelectorAll('[data-phone-btn]').forEach(function (a) { a.textContent = 'Call ' + C.phone; a.href = C.phoneHref; });
  $('#yr').textContent = new Date().getFullYear();
  var dep = $('#depositBtn');
  if (C.depositUrl) { dep.href = C.depositUrl; }
  else {
    // placeholder until a Stripe Payment Link is set in config.js
    dep.removeAttribute('target');
    dep.addEventListener('click', function (e) {
      e.preventDefault();
      $('#formStatus').textContent = 'Online deposits are coming soon. To reserve your date now, call ' + C.phone + '.';
    });
  }

  // ---- Nav
  var nav = $('#nav'), toggle = $('#navToggle');
  toggle.addEventListener('click', function () { var o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });
  $('#navLinks').addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });

  // ---- Hero: the footage starts soft and out of focus, then racks into focus over the first stretch of scroll
  var hero = $('#hero'), bg = $('#heroBg'), shade = $('#heroShade'), cue = $('#heroScroll');
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 40);
    var span = hero.offsetHeight - window.innerHeight;
    var p = Math.max(0, Math.min(1, y / (span * 0.5)));
    var e = reduce ? 1 : ease(p), k = 1 - e;
    bg.style.filter = 'blur(' + (18 * k).toFixed(2) + 'px) brightness(' + (0.8 + 0.2 * e).toFixed(3) + ')';
    bg.style.transform = 'scale(' + (1 + 0.08 * k).toFixed(4) + ')';
    shade.style.opacity = (1 - 0.15 * e).toFixed(3);
    cue.style.opacity = y > 60 ? 0 : 1;
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  var hv = $('#heroVideo'); if (hv) { hv.muted = true; var pp = hv.play(); if (pp && pp.catch) pp.catch(function () {}); }

  // ---- Looping clip tiles (local files; play only while visible)
  function makeVideo(src, poster) {
    var v = document.createElement('video');
    v.src = src; v.poster = poster; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata'; v.setAttribute('aria-hidden', 'true');
    return v;
  }
  var reel = $('#reel');
  C.reel.forEach(function (r) {
    var b = document.createElement('button');
    b.className = 'reel__tile reveal'; b.setAttribute('aria-label', 'Play ' + r.title);
    b.appendChild(makeVideo(r.src, r.poster));
    b.insertAdjacentHTML('beforeend', '<span class="reel__meta"><b>' + r.title + '</b></span>');
    reel.appendChild(b);
    b.addEventListener('click', function () { openModal(r.start); });
  });
  document.querySelectorAll('.svc__clip').forEach(function (el) { el.appendChild(makeVideo(el.dataset.src, el.dataset.poster)); });
  var vio = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      var v = en.target.querySelector('video'); if (!v || reduce) return;
      if (en.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause();
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reel__tile, .svc__clip, .name__media').forEach(function (el) { vio.observe(el); });

  // ---- Closing section: same out-of-frame entrance as the hero, driven by scroll position
  var closing = $('#closing'), cbg = closing.querySelector('.closing__bg'), cv = cbg.querySelector('video'), cin = closing.querySelector('.closing__inner');
  function closingScroll() {
    var r = closing.getBoundingClientRect(), span = closing.offsetHeight - window.innerHeight;
    // stays out of frame for the first 30% of the pinned scroll, then slides in over the next 50%
    var p = Math.max(0, Math.min(1, (-r.top - span * 0.3) / (span * 0.5)));
    var e = reduce ? 1 : ease(p), k = 1 - e;
    cbg.style.transform = 'translate(' + (-36 * k).toFixed(2) + 'vw,' + (14 * k).toFixed(2) + 'vh) scale(' + (0.5 + 0.5 * e).toFixed(4) + ') rotate(' + (-6 * k).toFixed(2) + 'deg)';
    cbg.style.clipPath = 'inset(0 round ' + (16 * k).toFixed(1) + 'px)';
    cin.style.opacity = reduce ? 1 : Math.max(0, Math.min(1, (p - 0.55) / 0.35)).toFixed(3);
    closing.classList.toggle('is-framed', r.top < window.innerHeight * 0.1);
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(closingScroll); }, { passive: true });
  window.addEventListener('resize', closingScroll);
  closingScroll();
  new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (reduce) return;
      if (en.isIntersecting) { var pr = cv.play(); if (pr && pr.catch) pr.catch(function () {}); } else cv.pause();
    });
  }, { threshold: .1 }).observe(closing);

  // ---- Full film (YouTube) in a modal
  function embed(start) {
    return 'https://www.youtube-nocookie.com/embed/' + VID + '?' + new URLSearchParams({ autoplay: 1, start: start, rel: 0, modestbranding: 1, playsinline: 1 });
  }
  // ---- Modal
  var modal = $('#modal'), mf = $('#modalFrame');
  function openModal(start) {
    var f = document.createElement('iframe');
    f.src = embed(start || 0); f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.title = 'Out of Frame film';
    mf.innerHTML = ''; mf.appendChild(f); modal.hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.hidden = true; mf.innerHTML = ''; document.body.style.overflow = ''; }
  $('#featurePlay').addEventListener('click', function () { openModal(0); });
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // ---- Scroll reveal
  var rv = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); rv.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach(function (el) { rv.observe(el); });

  // ---- Inquiry form
  var form = $('#inquiryForm'), status = $('#formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    ['name', 'email'].forEach(function (n) {
      var el = form.elements[n], ok = el.value.trim() && (n !== 'email' || /\S+@\S+\.\S+/.test(el.value));
      el.classList.toggle('err', !ok); if (!ok) bad = true;
    });
    if (bad) { status.textContent = 'Please add your name and a valid email.'; return; }
    var data = new FormData(form);
    if (data.get('_gotcha')) return;
    if (C.formspreeId) {
      status.textContent = 'Sending…';
      fetch('https://formspree.io/f/' + C.formspreeId, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); status.textContent = 'Thank you - we received your inquiry and will be in touch very soon.'; })
        .catch(function () { status.textContent = 'Something went wrong. Please call ' + C.phone + ' or email ' + C.email + '.'; });
    } else {
      var body = ['Name: ' + data.get('name'), 'Email: ' + data.get('email'), 'Phone: ' + data.get('phone'),
        'Event date: ' + data.get('date'), 'Interested in: ' + data.get('service'), 'Venue: ' + data.get('venue'), '', data.get('message')].join('\n');
      location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Inquiry from ' + data.get('name')) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Opening your email app… or call ' + C.phone + '.';
    }
  });
})();
