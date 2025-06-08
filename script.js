document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const container = document.querySelector('.container');
  const closeIcon = document.querySelector('.close-icon');

  // Show hamburger on mobile, hide on desktop
  function updateMenuDisplay() {
    if (window.innerWidth > 768) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';
      hamburger.style.display = 'none';  // hide hamburger on desktop
      closeAllDropdowns();
    } else {
      hamburger.style.display = 'flex';  // show hamburger on mobile
      closeIcon.style.display = 'none';
    }
  }

  // Toggle menu open/close
  function toggleMenu() {
    const isOpen = nav.classList.contains('active');
    if (isOpen) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';
      hamburger.style.display = 'flex';
      closeAllDropdowns();
    } else {
      nav.classList.add('active');
      container.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      closeIcon.style.display = 'block';
      hamburger.style.display = 'none';
    }
  }

  hamburger.addEventListener('click', toggleMenu);
  closeIcon.addEventListener('click', toggleMenu);

  // Accessibility: allow toggling with Enter or Space on hamburger and close icon
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });
  closeIcon.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Dropdown toggle on mobile
  const dropdowns = document.querySelectorAll('.dropdown');

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

  // Close all dropdowns
  function closeAllDropdowns() {
    dropdowns.forEach(dd => dd.classList.remove('open'));
  }

  // Window resize handler
  window.addEventListener('resize', updateMenuDisplay);

  // Initial setup on page load
  updateMenuDisplay();
});
