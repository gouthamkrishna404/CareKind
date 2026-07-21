export function initNav() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const container = document.querySelector(".container");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (!hamburger || !nav || !container) return;

  function closeAllDropdowns() {
    dropdowns.forEach((dd) => dd.classList.remove("open", "show"));
  }

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    document.body.style.overflow = "";
  }

  function pulseHamburger() {
    if (navigator.vibrate) navigator.vibrate(10);
    hamburger.classList.remove("pulse");
    // Force reflow so the animation can restart on rapid repeat taps.
    void hamburger.offsetWidth;
    hamburger.classList.add("pulse");
  }

  function openMenu() {
    nav.classList.add("active");
    container.classList.add("menu-open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    lockBodyScroll();
  }

  function closeMenu() {
    nav.classList.remove("active");
    container.classList.remove("menu-open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    unlockBodyScroll();
    closeAllDropdowns();
  }

  let lastToggleTime = 0;

  function toggleMenu() {
    const now = Date.now();
    if (now - lastToggleTime < 250) return;
    lastToggleTime = now;

    pulseHamburger();
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function updateMenuDisplay() {
    if (window.innerWidth > 1250) {
      hamburger.style.display = "none";
      closeMenu();
    } else {
      hamburger.style.display = "block";
      closeMenu();
    }
  }

  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    }
  });

  document.addEventListener("click", (e) => {
    // Ignore clicks landing immediately after a toggle so the same tap that
    // just opened/closed the menu can never be re-read as an outside click.
    if (Date.now() - lastToggleTime < 300) return;

    const navRect = nav.getBoundingClientRect();
    const clickInsideNav = nav.contains(e.target);
    const clickOnHamburger = hamburger.contains(e.target);
    const clickBelowNav = e.clientY > navRect.bottom;

    if (clickBelowNav && !clickInsideNav && !clickOnHamburger) {
      if (nav.classList.contains("active")) {
        closeMenu();
      } else {
        closeAllDropdowns();
      }
    }
  });

  window.addEventListener("resize", updateMenuDisplay);

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("mouseenter", () => dropdown.classList.add("show"));
    dropdown.addEventListener("mouseleave", () => dropdown.classList.remove("show"));

    const dropbtn = dropdown.querySelector(".dropbtn");
    if (!dropbtn) return;
    dropbtn.setAttribute("aria-expanded", "false");
    dropbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      dropdowns.forEach((dd) => {
        dd.classList.remove("open");
        dd.querySelector(".dropbtn")?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        dropdown.classList.add("open");
        dropbtn.setAttribute("aria-expanded", "true");
      }
    });
  });

  updateMenuDisplay();
}
