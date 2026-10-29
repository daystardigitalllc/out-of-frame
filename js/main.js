(function () {
  var C = window.OOF, $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // ---- Nav turns solid after the first bit of scroll; the scroll cue fades out
  var cue = $('#heroScroll');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 40);
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
  // the first-look clip fades up from black, so park it on a real frame until it plays
  var fl = document.querySelector('.name__media video');
  if (fl) fl.addEventListener('loadedmetadata', function () { fl.currentTime = 6; }, { once: true });
  // tap to unmute: starts the film over with sound, tap again to mute
  var sb = $('#soundBtn');
  if (fl && sb) sb.addEventListener('click', function () {
    var on = fl.muted;
    if (on) { fl.currentTime = 0; fl.muted = false; var pr = fl.play(); if (pr && pr.catch) pr.catch(function () {}); }
    else { fl.muted = true; }
    sb.textContent = on ? 'Mute' : 'Tap to unmute';
    sb.setAttribute('aria-pressed', on);
  });
  var vio = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      var v = en.target.querySelector('video'); if (!v || reduce) return;
      if (en.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause();
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reel__tile, .svc__clip, .name__media').forEach(function (el) { vio.observe(el); });

  // ---- Closing section: play the clip only while it is on screen
  var closing = $('#closing'), cv = closing.querySelector('video');
  new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (reduce) return;
      if (en.isIntersecting) { var pr = cv.play(); if (pr && pr.catch) pr.catch(function () {}); } else cv.pause();
    });
  }, { threshold: .1 }).observe(closing);

  // ---- Full film (hosted) in a modal
  // ---- Modal
  var modal = $('#modal'), mf = $('#modalFrame');
  function openModal(start) {
    var v = document.createElement('video');
    v.src = C.media + '/' + C.rayFilm + '#t=' + (start || 0);
    v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('aria-label', 'Out of Frame wedding film');
    mf.innerHTML = ''; mf.appendChild(v); modal.hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.hidden = true; mf.innerHTML = ''; document.body.style.overflow = ''; }
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
