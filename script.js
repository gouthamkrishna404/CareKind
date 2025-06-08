document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const container = document.querySelector('.container');
  const closeIcon = document.querySelector('.close-icon');

  // Function to close all dropdowns
  const dropdowns = document.querySelectorAll('.dropdown');
  function closeAllDropdowns() {
    dropdowns.forEach(dd => dd.classList.remove('open'));
  }

  // Toggle menu open/close
  function toggleMenu() {
    const isOpen = nav.classList.contains('active');
    if (isOpen) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';  // hide close icon
      hamburger.style.display = 'flex';  // show hamburger bars
      closeAllDropdowns();
    } else {
      nav.classList.add('active');
      container.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      closeIcon.style.display = 'block'; // show close icon
      hamburger.style.display = 'none';  // hide hamburger bars
    }
  }

  // Hamburger click toggles menu
  hamburger.addEventListener('click', toggleMenu);

  // Close icon click toggles menu (closes menu)
  closeIcon.addEventListener('click', toggleMenu);

  // Accessibility: allow toggling with Enter or Space on hamburger
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Accessibility: allow toggling with Enter or Space on close icon
  closeIcon.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Dropdown toggle on mobile
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');

    btn.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('open');
        if (isOpen) {
          dropdown.classList.remove('open');
        } else {
          closeAllDropdowns();
          dropdown.classList.add('open');
        }
      }
    });
  });

  // Close menu if window is resized larger than mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';
      hamburger.style.display = 'flex';
      closeAllDropdowns();
    }
  });

  // Initially hide close icon
  closeIcon.style.display = 'none';
});
