/* =================================================================
   ALEX SANDER — interações
   Lenis smooth scroll · header state · mobile nav ·
   reveal-on-scroll · carrossel loop contínuo
   ================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var docEl = document.documentElement;

  /* ---------- 1. Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- 2. Carrossel: duplica itens p/ loop perfeito ---------- */
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ---------- 3. Lenis smooth scroll (com fallback nativo) ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.09 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target) {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -70 });
    } else {
      var y = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  /* ---------- 4. Âncoras internas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeNav();
      scrollToTarget(target);
      history.replaceState(null, '', id);
    });
  });

  /* ---------- 5. Header: estado ao rolar ---------- */
  var header = document.querySelector('.site-header');
  function onScroll(y) {
    var sy = typeof y === 'number' ? y : window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', sy > 24);
  }
  if (lenis) lenis.on('scroll', function (e) { onScroll(e.scroll); });
  window.addEventListener('scroll', function () { onScroll(); }, { passive: true });
  onScroll();

  /* ---------- 6. Menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  function openNav() { if (!nav) return; nav.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Fechar menu'); }
  function closeNav() { if (!nav) return; nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); }
  if (toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.contains('is-open') ? closeNav() : openNav();
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- 7. Reveal on scroll (robust · não depende de IO) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function revealAll() { revealEls.forEach(function (el) { el.classList.add('in-view'); }); revealEls = []; }

  if (reduceMotion) {
    revealAll();
  } else {
    var revealInView = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = revealEls.length - 1; i >= 0; i--) {
        var r = revealEls[i].getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > -40) {
          revealEls[i].classList.add('in-view');
          revealEls.splice(i, 1);
        }
      }
    };
    revealInView();                                   // acima da dobra: já aparece
    window.addEventListener('scroll', revealInView, { passive: true });
    window.addEventListener('resize', revealInView, { passive: true });
    window.addEventListener('load', revealInView);
    if (lenis) lenis.on('scroll', revealInView);
    // failsafe: nunca deixar conteúdo invisível
    setTimeout(revealAll, 2400);
  }

  /* ---------- 8. Nav ativo conforme seção ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = {};
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
    navLinks[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks[entry.target.id];
        if (link && entry.isIntersecting) {
          Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
