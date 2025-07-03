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
    if (window.innerWidth > 768) {
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

    if (clickBelowNav && !clickInsideNav && !clickOnHamburger && !clickOnCloseIcon) {
      if (nav.classList.contains("active")) {
        toggleMenu();
      }
      closeAllDropdowns();
    }
  });

  window.addEventListener("resize", updateMenuDisplay);

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("mouseenter", () => dropdown.classList.add("show"));
    dropdown.addEventListener("mouseleave", () => dropdown.classList.remove("show"));
  });

  getStartedBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      slidePanel.classList.add("open");
      overlay.classList.add("active");
      goToStep("step1");
    });
  });

  document.getElementById("footerApplyJobBtn").addEventListener("click", (e) => {
    e.preventDefault();
    slidePanel.classList.add("open");
    overlay.classList.add("active");
    goToStep("jobForm");
  });

  document.getElementById("footerCareAdultBtn").addEventListener("click", (e) => {
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
          const checkedBoxes = currentStep.querySelectorAll('input[type="checkbox"]:checked');
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

const scriptURL = "https://script.google.com/macros/s/AKfycbzVPGA41BE0LRNEqB-_CbdmZVlRjRrSg5Zmqk-nlS68CaUTtz2PTKMdo0arZ4zHNWU4/exec";
let careFor = "";

document.querySelectorAll("#careForm .option-btn").forEach((button) => {
  button.addEventListener("click", () => {
    careFor = button.getAttribute("name");
  });
});

const jobForm = document.getElementById("jobFormFields");
if (jobForm) {
  jobForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm(jobForm);
  });
}

const careForm = document.getElementById("careRequestForm");
if (careForm) {
  careForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm(careForm, true);
  });
}

function submitForm(form, includeExtra = false) {
  const formData = new FormData(form);
  const data = {};
  goToStep("step1");
  closeModal();

  formData.forEach((value, key) => {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });

  if (includeExtra) {
    data["formType"] = "consultation";
    data["Care For"] = careFor;
    const needs = [];
    document.querySelectorAll("#careNeeds input[type='checkbox']:checked").forEach((cb) => {
      const label = cb.parentElement.textContent.trim();
      needs.push(label);
    });
    data["Care Needs"] = needs.join(" | ");
  } else {
    data["formType"] = "job";
  }

  fetch(scriptURL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then(() => {
      form.reset();
    })
    .catch(() => {
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

let lastX = 0, lastY = 0;
const minDistance = 200;

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

document.addEventListener("mousemove", (e) => {
  if (distance(e.pageX, e.pageY, lastX, lastY) < minDistance) return;
  lastX = e.pageX;
  lastY = e.pageY;

  const leaf = document.createElement("img");
  leaf.src = "images/image.svg";
  leaf.className = "leaf";

  const offsetX = Math.random() * 20 - 10;
  const offsetY = 10 + Math.random() * 10;

  const contentRect = document.getElementById("page-content").getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
  leaf.style.left = e.pageX + offsetX + "px";
  leaf.style.top = (e.pageY - contentRect.top - scrollTop + offsetY) + "px";

  const rotation = Math.floor(Math.random() * 360) + "deg";
  leaf.style.setProperty("--rotation", rotation);

  const driftX = (Math.random() * 200 - 100).toFixed(2) + "px";
  const fallDistance = (Math.random() * 300 + 250).toFixed(2) + "px";
  leaf.style.setProperty("--drift-x", driftX);
  leaf.style.setProperty("--fall-distance", fallDistance);

  const scale = (Math.random() * 0.4 + 0.8).toFixed(2);
  leaf.style.setProperty("--scale", scale);
  leaf.style.width = 24 * scale + "px";
  leaf.style.height = 24 * scale + "px";

  const duration = (Math.random() * 3 + 4).toFixed(2);
  leaf.style.animation = `leaf-fall ${duration}s linear forwards`;

  document.getElementById("page-content").appendChild(leaf);

  setTimeout(() => {
    leaf.remove();
  }, duration * 1000 + 500);
});

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
  return card.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
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
  intervalId = setInterval(() => {
    moveToIndex(index + 1);
  }, 2000);
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

window.onload = init;
