const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const container = document.querySelector('.container');
const dropdowns = document.querySelectorAll('.dropdown');

hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  container.classList.toggle('menu-open');
  nav.classList.toggle('active');

  // Close all dropdowns on menu toggle
  dropdowns.forEach(d => d.classList.remove('open'));
});

// Handle dropdown toggles on mobile (click)
dropdowns.forEach(dropdown => {
  const btn = dropdown.querySelector('.dropbtn');
  btn.addEventListener('click', e => {
    if(window.innerWidth <= 768){
      e.preventDefault();
      // Close other dropdowns
      dropdowns.forEach(d => {
        if(d !== dropdown) d.classList.remove('open');
      });
      // Toggle current dropdown
      dropdown.classList.toggle('open');
    }
  });
});

// Close menu if window resizes bigger than mobile
window.addEventListener('resize', () => {
  if(window.innerWidth > 768){
    container.classList.remove('menu-open');
    nav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
    dropdowns.forEach(d => d.classList.remove('open'));
  }
});
