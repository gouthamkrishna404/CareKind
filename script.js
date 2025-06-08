document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const closeIcon = document.querySelector('.close-icon');
  const nav = document.querySelector('nav');
  const container = document.querySelector('.container');
  const dropdowns = document.querySelectorAll('.dropdown');

  if (!hamburger || !closeIcon || !nav || !container) {
    return;
  }

  function updateMenuDisplay() {
    if (window.innerWidth > 768) {
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeIcon.style.display = 'none';
      hamburger.style.display = 'none';
      closeAllDropdowns();
    } else {
      hamburger.style.display = 'flex';
      closeIcon.style.display = 'none';
      nav.classList.remove('active');
      container.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      closeAllDropdowns();
    }
  }

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

  function closeAllDropdowns() {
    dropdowns.forEach(dd => dd.classList.remove('open'));
  }

  hamburger.addEventListener('click', toggleMenu);
  closeIcon.addEventListener('click', toggleMenu);

  [hamburger, closeIcon].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  });

  window.addEventListener('resize', updateMenuDisplay);

  document.addEventListener('click', (e) => {
    const navRect = nav.getBoundingClientRect();
    const clickInsideNav = nav.contains(e.target);
    const clickOnHamburger = hamburger.contains(e.target);
    const clickOnCloseIcon = closeIcon.contains(e.target);
    const clickBelowNav = e.clientY > navRect.bottom;

    if (clickBelowNav && !clickInsideNav && !clickOnHamburger && !clickOnCloseIcon) {
      if (nav.classList.contains('active')) {
        toggleMenu();
      }
      closeAllDropdowns();
    }
  });

  updateMenuDisplay();
});
