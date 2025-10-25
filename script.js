document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const closeIcon = document.querySelector(".close-icon");
  const nav = document.querySelector("nav");
  const container = document.querySelector(".container");
  const dropdowns = document.querySelectorAll(".dropdown");
  const getStartedBtn = document.querySelectorAll(".get-started-btn");
  const slidePanel = document.getElementById("slidePanel");
  const overlay = document.getElementById("overlay");
  const closeSlide = document.getElementById("closeSlide");
  const optionButtons = document.querySelectorAll(".option-btn");
  const backButtons = document.querySelectorAll(".back-arrow");

  if (!hamburger || !closeIcon || !nav || !container) return;

  function closeAllDropdowns() {
    dropdowns.forEach((dd) => dd.classList.remove("open", "show"));
  }

  function updateMenuDisplay() {
    if (window.innerWidth > 1250) {
      nav.classList.remove("active");
      container.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
      closeIcon.style.display = "none";
      hamburger.style.display = "none";
      closeAllDropdowns();
    } else {
      hamburger.style.display = "flex";
      closeIcon.style.display = "none";
      nav.classList.remove("active");
      container.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
      closeAllDropdowns();
    }
  }

  function toggleMenu() {
    const isOpen = nav.classList.contains("active");
    if (isOpen) {
      nav.classList.remove("active");
      container.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
      closeIcon.style.display = "none";
      hamburger.style.display = "flex";
      closeAllDropdowns();
    } else {
      nav.classList.add("active");
      container.classList.add("menu-open");
      hamburger.setAttribute("aria-expanded", "true");
      closeIcon.style.display = "block";
      hamburger.style.display = "none";
    }
  }

  hamburger.addEventListener("click", toggleMenu);
  closeIcon.addEventListener("click", toggleMenu);

  [hamburger, closeIcon].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  });

  document.addEventListener("click", (e) => {
    const navRect = nav.getBoundingClientRect();
    const clickInsideNav = nav.contains(e.target);
    const clickOnHamburger = hamburger.contains(e.target);
    const clickOnCloseIcon = closeIcon.contains(e.target);
    const clickBelowNav = e.clientY > navRect.bottom;

    if (
      clickBelowNav &&
      !clickInsideNav &&
      !clickOnHamburger &&
      !clickOnCloseIcon
    ) {
      if (nav.classList.contains("active")) {
        toggleMenu();
      }
      closeAllDropdowns();
    }
  });

  window.addEventListener("resize", updateMenuDisplay);

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("mouseenter", () =>
      dropdown.classList.add("show")
    );
    dropdown.addEventListener("mouseleave", () =>
      dropdown.classList.remove("show")
    );
  });

  getStartedBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      slidePanel.classList.add("open");
      overlay.classList.add("active");
      goToStep("step1");
    });
  });

  document
    .getElementById("footerApplyJobBtn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      slidePanel.classList.add("open");
      overlay.classList.add("active");
      goToStep("jobForm");
    });

  document
    .getElementById("popupGetStarted")
    .addEventListener("click", (e) => {
      e.preventDefault();
      slidePanel.classList.add("open");
      overlay.classList.add("active");
      goToStep("careForm");
    });
  document
    .getElementById("footerCareAdultBtn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      slidePanel.classList.add("open");
      overlay.classList.add("active");
      goToStep("careForm");
    });

  if (slidePanel && overlay && closeSlide) {
    closeSlide.addEventListener("click", () => {
      slidePanel.classList.remove("open");
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
      slidePanel.classList.remove("open");
      overlay.classList.remove("active");
    });

    function switchStep(currentStep, nextStep, outClass, inClass) {
      currentStep.classList.add(outClass);
      currentStep.addEventListener("animationend", function handleOut() {
        currentStep.removeEventListener("animationend", handleOut);
        currentStep.style.display = "none";
        currentStep.classList.remove(outClass, "active");
        nextStep.style.display = "flex";
        nextStep.classList.add(inClass, "active");
        nextStep.addEventListener("animationend", function handleIn() {
          nextStep.classList.remove(inClass);
          nextStep.removeEventListener("animationend", handleIn);
        });
      });
    }

    const steps = document.querySelectorAll(".step");
    steps.forEach((step) => {
      step.style.display = "none";
      step.classList.remove("active");
    });

    const step1 = document.getElementById("step1");
    if (step1) {
      step1.style.display = "flex";
      step1.classList.add("active");
    }

    optionButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const currentStep = button.closest(".step");
        const nextStepId = button.getAttribute("data-next");
        const nextStep = document.getElementById(nextStepId);

        if (currentStep.id === "careNeeds") {
          const checkedBoxes = currentStep.querySelectorAll(
            'input[type="checkbox"]:checked'
          );
          if (checkedBoxes.length === 0) {
            event.preventDefault();
            return;
          }
        }

        if (nextStep) {
          event.preventDefault();
          switchStep(currentStep, nextStep, "slide-out-left", "slide-in-right");
        }
      });
    });

    backButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const currentStep = button.closest(".step");
        const backStepId = button.getAttribute("data-back");
        const backStep = document.getElementById(backStepId);

        if (backStep) {
          switchStep(currentStep, backStep, "slide-out-right", "slide-in-left");
        }
      });
    });
  }

  updateMenuDisplay();
});

const scriptURL = 'https://script.google.com/macros/s/AKfycbznNTKGjvHBfewbyYEZaCYwZsWnyb_MPO9KP2El5fzePhSRuPGnYmNHON43P8lZ7Voe/exec';

let careFor = "";

// -------------------- Care For buttons --------------------
document.querySelectorAll("#careForm .option-btn").forEach((button) => {
  button.addEventListener("click", () => {
    careFor = button.getAttribute("name") || '';
  });
});

// -------------------- Job Form --------------------
const jobForm = document.getElementById("jobFormFields");
if (jobForm) {
  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm(jobForm);
  });
}

// -------------------- Care Request Form --------------------
const careForm = document.getElementById("careRequestForm");
if (careForm) {
  careForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm(careForm, true);
  });
}

// -------------------- Submit Form Function --------------------
function submitForm(form, includeExtra = false) {
  const formData = new FormData(form);
  const data = {};

  // Go to first step and close modal if functions exist
  if (typeof goToStep === "function") goToStep("step1");
  if (typeof closeModal === "function") closeModal();

  // Add normal form fields
  formData.forEach((value, key) => {
    if (data[key]) {
      if (Array.isArray(data[key])) data[key].push(value);
      else data[key] = [data[key], value];
    } else {
      data[key] = value;
    }
  });

  if (includeExtra) {
    data["formType"] = "consultation";
    data["Care For"] = careFor;

    // ✅ Capture Care Needs
    const checkedNeeds = Array.from(document.querySelectorAll('#careNeeds input[type="checkbox"]:checked'))
      .map(cb => cb.name);
    data["Care Needs"] = checkedNeeds.join(" | ");

    // ✅ Capture Preferred Time
    const preferredTime = form.querySelector("input[name='Preferred Time']");
    if (preferredTime && preferredTime.value) data["Preferred Time"] = preferredTime.value;

    // ✅ Capture Preferred Contact
    const preferredContact = form.querySelector("input[name='Preferred Contact']:checked");
    if (preferredContact && preferredContact.value) data["Preferred Contact"] = preferredContact.value;

  } else {
    data["formType"] = "job";
  }

  // -------------------- Send Data to Google Script --------------------
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  }).finally(() => {
    form.reset();
  });
}


function goToStep(stepId) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => {
    step.style.display = "none";
    step.classList.remove("active");
  });

  const target = document.getElementById(stepId);
  if (target) {
    target.style.display = "flex";
    target.classList.add("active");
  }
}

function closeModal() {
  const slidePanel = document.getElementById("slidePanel");
  const overlay = document.getElementById("overlay");
  if (slidePanel && overlay) {
    slidePanel.classList.remove("open");
    overlay.classList.remove("active");
  }
}

const track = document.getElementById("testimonial-track");
const leftArrow = document.getElementById("arrow-left");
const rightArrow = document.getElementById("arrow-right");
let index = 0;
let intervalId = null;

function visibleCount() {
  return window.innerWidth <= 1024 ? 1 : 3;
}

function getCardWidth() {
  const card = track.querySelector(".testimonial-card");
  if (!card) return 0;
  const style = window.getComputedStyle(card);
  return (
    card.offsetWidth +
    parseFloat(style.marginLeft) +
    parseFloat(style.marginRight)
  );
}

function moveToIndex(newIndex) {
  const total = track.children.length;
  const count = visibleCount();
  const cardWidth = getCardWidth();

  index = newIndex;
  track.style.transition = "transform 0.6s ease";
  track.style.transform = `translateX(${-cardWidth * index}px)`;

  if (index >= total - count) {
    setTimeout(() => {
      track.style.transition = "none";
      index = 0;
      track.style.transform = `translateX(0)`;
    }, 600);
  }
}

function startAutoSlide() {
  if (intervalId) return;
  let delay;
  if (window.innerWidth > 1024) {
    delay = 3000;
  } else {
    delay = 5000;
  }
  intervalId = setInterval(() => {
    moveToIndex(index + 1);
  }, delay);
}

function stopAutoSlide() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

leftArrow.addEventListener("click", () => {
  moveToIndex(index - 1);
});

rightArrow.addEventListener("click", () => {
  moveToIndex(index + 1);
});

const carouselWrapper = document.querySelector(".carousel-wrapper");
carouselWrapper.addEventListener("mouseenter", () => {
  if (window.innerWidth > 1024) stopAutoSlide();
});
carouselWrapper.addEventListener("mouseleave", () => {
  if (window.innerWidth > 1024) startAutoSlide();
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    index = 0;
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    stopAutoSlide();
    if (window.innerWidth > 1024) {
      leftArrow.style.display = "flex";
      rightArrow.style.display = "flex";
    } else {
      leftArrow.style.display = "none";
      rightArrow.style.display = "none";
    }
    startAutoSlide();
  }, 300);
});

function cloneCardsForLoop() {
  const count = visibleCount();
  const cards = track.querySelectorAll(".testimonial-card");
  for (let i = 0; i < count; i++) {
    const clone = cards[i].cloneNode(true);
    track.appendChild(clone);
  }
}
function init() {
  cloneCardsForLoop();
  if (window.innerWidth > 1024) {
    leftArrow.style.display = "flex";
    rightArrow.style.display = "flex";
  } else {
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
  }
  track.style.transition = "none";
  track.style.transform = "translateX(0)";
  startAutoSlide();
}

    // FAQ Accordion functionality
    document.addEventListener('DOMContentLoaded', function() {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Close all FAQ items
          faqItems.forEach(faq => {
            faq.classList.remove('active');
          });
          
          // Open clicked item if it wasn't active
          if (!isActive) {
            item.classList.add('active');
          }
        });
      });

      // Popup functionality
      const popupOverlay = document.getElementById('popupOverlay');
      const popupClose = document.getElementById('popupClose');
      const popupGetStarted = document.getElementById('popupGetStarted');
      let popupShown = false;

      // Check if popup was already shown in this session
      const popupShownSession = sessionStorage.getItem('popupShown');

      // Show popup after 12 seconds or on scroll
      if (!popupShownSession) {
        // Timer-based trigger
        setTimeout(() => {
          if (!popupShown) {
            showPopup();
          }
        }, 8000);

        // Scroll-based trigger
        let scrollThreshold = false;
        window.addEventListener('scroll', () => {
          if (!scrollThreshold && window.scrollY > 800 && !popupShown) {
            scrollThreshold = true;
            setTimeout(() => {
              if (!popupShown) {
                showPopup();
              }
            }, 2000);
          }
        });
      }

      function showPopup() {
        popupOverlay.classList.add('show');
        popupShown = true;
        sessionStorage.setItem('popupShown', 'true');
        document.body.style.overflow = 'hidden';
      }

      function hidePopup() {
        popupOverlay.classList.remove('show');
        document.body.style.overflow = '';
      }

      // Close popup on X button
      popupClose.addEventListener('click', hidePopup);

      // Close popup on overlay click
      popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
          hidePopup();
        }
      });

      // Close popup when clicking "Book Free Consultation"
      popupGetStarted.addEventListener('click', hidePopup);

      // Close popup on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('show')) {
          hidePopup();
        }
      });

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (href !== '#' && href !== '#home') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        });
      });
    });

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".grid-container");
  if (!gridContainer) return;
  const sphereIndicator = document.createElement("div");
  sphereIndicator.className = "carousel-sphere-indicator";
  gridContainer.parentElement.insertAdjacentElement("afterend", sphereIndicator);
  let scrollInterval;
  let isScrolling = false;
  function autoScroll() {
    if (!gridContainer || isScrolling) return;
    const scrollAmount = 360;
    const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;

    if (gridContainer.scrollLeft >= maxScroll - 10) {
      gridContainer.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      // Scroll to next card
      gridContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }
  function startAutoScroll() {
    if (scrollInterval) return;
    scrollInterval = setInterval(autoScroll, 4000);
  }
  startAutoScroll();
});

document.querySelectorAll('#careRequest label.care-option-card input[type="radio"]').forEach(r => {
      const card = r.parentElement;
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = r.getAttribute('name');
        document.querySelectorAll(`#careRequest input[type="radio"][name="${name}"]`).forEach(inp => inp.parentElement.classList.remove('selected'));
        r.checked = true;
        card.classList.add('selected');
      });
    });

setTimeout(() => {
    document.getElementById('popup').classList.add('show');
  }, 15000); // show popup after 15 seconds

window.onload = init;


