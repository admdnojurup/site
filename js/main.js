/* ========================================
   Pragma — Main JavaScript
   Scroll reveals, nav, mobile menu, FAQ
   ======================================== */

(function () {
  'use strict';

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Service Row Slide-in & Active Highlighting ---
  var serviceRows = Array.prototype.slice.call(document.querySelectorAll('.service-row'));

  if (serviceRows.length) {
    var activeRow = null;

    // Highlight the row closest to viewport center
    function updateActiveRow() {
      var viewportCenter = window.innerHeight / 2;
      var closest = null;
      var closestDist = Infinity;

      serviceRows.forEach(function (row) {
        var rect = row.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var rowCenter = rect.top + rect.height / 2;
        var dist = Math.abs(rowCenter - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = row;
        }
      });

      if (closest !== activeRow) {
        if (activeRow) activeRow.classList.remove('active');
        if (closest) closest.classList.add('active');
        activeRow = closest;
      }
    }

    window.addEventListener('scroll', updateActiveRow, { passive: true });
    updateActiveRow();

    // Reveal all rows together when the section enters viewport (stagger via CSS)
    var rowsContainer = serviceRows[0].parentElement;
    var rowObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            serviceRows.forEach(function (row) {
              row.classList.add('visible');
            });
            rowObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    // Exclude service rows from the generic reveal observer, observe container instead
    serviceRows.forEach(function (row) {
      revealObserver.unobserve(row);
    });
    rowObserver.observe(rowsContainer);
  }

  // --- Navigation scroll state ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile Menu ---
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    hamburger.setAttribute('aria-label', isOpen ? 'Atidaryti meniu' : 'Uždaryti meniu');
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
      question.setAttribute('aria-expanded', !isActive);
    });
  });
})();
