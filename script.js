document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const closeIcon = document.querySelector('.close-icon');
  const nav = document.querySelector('nav');
  const container = document.querySelector('.container');
  const dropdowns = document.querySelectorAll('.dropdown');

  // Show hamburger icon on mobile, hide on desktop
  function updateMenuDisplay() {
    if (window.innerWidth > 768) {
      // Desktop: hide hamburger and close icon, close menu and dropdowns
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';
      hamburger.style.display = 'none';
      closeAllDropdowns();
    } else {
      // Mobile: show hamburger, hide close icon initially
      hamburger.style.display = 'flex';
      closeIcon.style.display = 'none';
    }
  }

  // Toggle the menu open/close state
  function toggleMenu() {
    const isOpen = nav.classList.contains('active');
    if (isOpen) {
      // Close menu
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';
      hamburger.style.display = 'flex';
      closeAllDropdowns();
    } else {
      // Open menu
      nav.classList.add('active');
      container.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      closeIcon.style.display = 'block';
      hamburger.style.display = 'none';
    }
  }

  // Close all dropdown menus
  function closeAllDropdowns() {
    dropdowns.forEach(dd => dd.classList.remove('open'));
  }

  // Toggle dropdown open/close on mobile; close other dropdowns when opening a new one
  function handleDropdownClick(e, dropdown) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const isOpen = dropdown.classList.contains('open');

      if (isOpen) {
        // Close this dropdown if already open
        dropdown.classList.remove('open');
      } else {
        // Close all others, then open this one
        closeAllDropdowns();
        dropdown.classList.add('open');
      }
    }
  }

  // Set up event listeners for dropdown buttons with keyboard accessibility
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');

    btn.addEventListener('click', e => handleDropdownClick(e, dropdown));

    // Accessibility: allow toggling dropdown with Enter or Space key
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDropdownClick(e, dropdown);
      }
    });
  });

  // Hamburger click toggles menu
  hamburger.addEventListener('click', toggleMenu);

  // Close icon click toggles menu (closes it)
  closeIcon.addEventListener('click', toggleMenu);

  // Accessibility: toggle menu via keyboard on hamburger and close icon
  [hamburger, closeIcon].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  });

  // Close menu and reset UI when window is resized (desktop mode)
  window.addEventListener('resize', updateMenuDisplay);

  // Initialize UI state on page load
  updateMenuDisplay();
});
