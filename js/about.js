// Shared behaviour for inner pages (phone links, mobile nav, scroll reveal). The homepage uses main.js.
(function () {
  var C = window.OOF, $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-phone]').forEach(function (a) { a.textContent = C.phone; a.href = C.phoneHref; });
  document.querySelectorAll('[data-phone-btn]').forEach(function (a) { a.textContent = 'Call ' + C.phone; a.href = C.phoneHref; });
  document.querySelectorAll('video[data-film]').forEach(function (v) { v.src = C.media + '/' + C[v.dataset.film]; });
  // Films autoplay muted while at least half on screen, and pause once scrolled more than halfway out of view
  var films = document.querySelectorAll('video[data-film]');
  if (films.length && !reduce) {
    var fio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && en.intersectionRatio >= 0.5) { v.muted = v.dataset.touched ? v.muted : true; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (!en.isIntersecting || en.intersectionRatio < 0.5) { v.pause(); }
      });
    }, { threshold: [0, 0.5, 1] });
    films.forEach(function (v) { v.muted = true; v.addEventListener('volumechange', function () { if (!v.muted) v.dataset.touched = '1'; }); fio.observe(v); });
  }
  $('#yr').textContent = new Date().getFullYear();

  var nav = $('#nav'), toggle = $('#navToggle');
  toggle.addEventListener('click', function () { var o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });
  $('#navLinks').addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });

  var rv = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); rv.unobserve(en.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { reduce ? el.classList.add('is-visible') : rv.observe(el); });
})();
