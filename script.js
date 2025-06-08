document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const container = document.querySelector('.container');

  // Toggle menu open/close
  function toggleMenu() {
    const isOpen = nav.classList.contains('active');
    if (isOpen) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeAllDropdowns();
    } else {
      nav.classList.add('active');
      container.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Accessibility: allow toggling with Enter or Space on hamburger and close icon
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Dropdown toggle on mobile
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');

    // On desktop, hover is handled by CSS, so here only handle clicks for mobile
    btn.addEventListener('click', e => {
      // Only toggle if mobile (window width <= 768)
      if (window.innerWidth <= 768) {
        e.preventDefault();
        // Toggle dropdown open state
        const isOpen = dropdown.classList.contains('open');
        if (isOpen) {
          dropdown.classList.remove('open');
        } else {
          // Close all other dropdowns first (optional)
          closeAllDropdowns();
          dropdown.classList.add('open');
        }
      }
    });
  });

  // Close all dropdowns
  function closeAllDropdowns() {
    dropdowns.forEach(dd => dd.classList.remove('open'));
  }

  // Close menu if window is resized larger than mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeAllDropdowns();
    }
  });
});
