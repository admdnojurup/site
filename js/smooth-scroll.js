/* Lenis smooth scroll — init before main.js */
(function () {
  'use strict';

  var lenis = new Lenis({
    duration: 1.4,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    wheelMultiplier: 0.7,
    touchMultiplier: 1.2,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  window.__lenis = lenis;
})();
