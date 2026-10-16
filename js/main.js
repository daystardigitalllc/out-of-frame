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
  else { dep.textContent = 'Call To Reserve'; dep.href = C.phoneHref; dep.removeAttribute('target'); }

  // ---- Nav
  var nav = $('#nav'), toggle = $('#navToggle');
  toggle.addEventListener('click', function () { var o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });
  $('#navLinks').addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });

  // ---- Hero focus-in on scroll
  var hero = $('#hero'), bg = $('#heroBg'), content = $('#heroContent'), vf = $('#viewfinder'),
      vfFocus = $('#vfFocus'), shade = $('#heroShade'), cue = $('#heroScroll');
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 40);
    var span = hero.offsetHeight - window.innerHeight;
    var p = Math.max(0, Math.min(1, y / (span * 0.7)));
    var e = reduce ? 1 : ease(p);
    bg.style.filter = 'blur(' + (18 * (1 - e)).toFixed(2) + 'px) brightness(' + (0.55 + 0.4 * e).toFixed(3) + ')';
    bg.style.transform = 'scale(' + (1.12 - 0.12 * e).toFixed(4) + ')';
    shade.style.opacity = (1 - 0.15 * e).toFixed(3);
    var out = Math.max(0, (y - span * 0.75) / (span * 0.25));
    content.style.opacity = (1 - Math.min(1, out)).toFixed(3);
    content.style.transform = 'translateY(' + (-30 * out).toFixed(1) + 'px) scale(' + (1 - 0.04 * out).toFixed(4) + ')';
    vf.style.opacity = p > 0.97 ? Math.max(0, 1 - out * 1.2) : 1;
    var locked = p > 0.92;
    vf.classList.toggle('is-locked', locked);
    vfFocus.textContent = locked ? 'FOCUS LOCKED' : 'FOCUSING…';
    cue.style.opacity = y > 60 ? 0 : 1;
    // viewfinder reticle tightens as it focuses
    vf.style.setProperty('--p', e);
    vf.querySelector('.vf__reticle span').style.transform = 'scale(' + (1.5 - 0.5 * e).toFixed(3) + ')';
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ---- YouTube helpers
  function embed(start, end, opts) {
    opts = opts || {};
    var q = new URLSearchParams({
      autoplay: 1, mute: opts.sound ? 0 : 1, controls: opts.sound ? 1 : 0, start: start, rel: 0,
      modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: opts.sound ? 0 : 1
    });
    if (end) q.set('end', end);
    if (!opts.sound) { q.set('loop', 1); q.set('playlist', VID); }
    return 'https://www.youtube-nocookie.com/embed/' + VID + '?' + q.toString();
  }
  function frame(src) {
    var f = document.createElement('iframe');
    f.src = src; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.setAttribute('tabindex', '-1');
    f.setAttribute('aria-hidden', 'true'); f.title = 'Out of Frame film';
    return f;
  }

  // ---- Hero background via IFrame API (cycles segments)
  var segs = C.heroSegments, si = 0, player, timer;
  function loadHero() {
    if (reduce) return;
    var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s);
  }
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('heroPlayer', {
      videoId: VID,
      playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, iv_load_policy: 3, start: segs[0].start, origin: location.origin },
      events: {
        onReady: function (e) { e.target.mute(); e.target.seekTo(segs[0].start, true); e.target.playVideo(); },
        onStateChange: function (e) {
          if (e.data === 1) {
            $('#heroWrap').classList.add('is-on');
            clearInterval(timer);
            timer = setInterval(function () {
              if (player.getCurrentTime() >= segs[si].end) {
                si = (si + 1) % segs.length;
                player.seekTo(segs[si].start, true);
              }
            }, 400);
          } else if (e.data === 0) { player.seekTo(segs[si].start, true); player.playVideo(); }
        }
      }
    });
  };
  loadHero();

  // ---- Looping clip tiles (lazy: load when visible)
  var reel = $('#reel');
  C.reel.forEach(function (r) {
    var b = document.createElement('button');
    b.className = 'reel__tile reveal'; b.dataset.start = r.start; b.dataset.end = r.end; b.setAttribute('aria-label', 'Play ' + r.title);
    b.innerHTML = '<span class="reel__meta"><small>' + r.tag + '</small><b>' + r.title + '</b></span>';
    reel.appendChild(b);
    b.addEventListener('click', function () { openModal(r.start); });
  });
  var lazy = document.querySelectorAll('.reel__tile, .svc__clip');
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      var el = en.target;
      if (en.isIntersecting && !el.querySelector('iframe') && !reduce) {
        var f = frame(embed(el.dataset.start || el.dataset.clip, el.dataset.end));
        el.insertBefore(f, el.firstChild);
      }
    });
  }, { rootMargin: '200px' });
  lazy.forEach(function (el) { if (el.dataset.clip) { el.dataset.start = el.dataset.clip; } io.observe(el); });

  // ---- Modal
  var modal = $('#modal'), mf = $('#modalFrame');
  function openModal(start) {
    var f = frame(embed(start || 0, 0, { sound: true })); f.removeAttribute('aria-hidden'); f.removeAttribute('tabindex');
    mf.innerHTML = ''; mf.appendChild(f); modal.hidden = false; document.body.style.overflow = 'hidden';
    if (player && player.pauseVideo) player.pauseVideo();
  }
  function closeModal() {
    modal.hidden = true; mf.innerHTML = ''; document.body.style.overflow = '';
    if (player && player.playVideo) player.playVideo();
  }
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
        .then(function (r) { if (!r.ok) throw 0; form.reset(); status.textContent = 'Thank you — we received your inquiry and will be in touch very soon.'; })
        .catch(function () { status.textContent = 'Something went wrong. Please call ' + C.phone + ' or email ' + C.email + '.'; });
    } else {
      var body = ['Name: ' + data.get('name'), 'Email: ' + data.get('email'), 'Phone: ' + data.get('phone'),
        'Event date: ' + data.get('date'), 'Interested in: ' + data.get('service'), 'Venue: ' + data.get('venue'), '', data.get('message')].join('\n');
      location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Inquiry from ' + data.get('name')) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Opening your email app… or call ' + C.phone + '.';
    }
  });
})();
