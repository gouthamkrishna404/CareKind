document.addEventListener('DOMContentLoaded', () => {
  // ======= Menu Elements =======
  const hamburger = document.querySelector('.hamburger');
  const closeIcon = document.querySelector('.close-icon');
  const nav = document.querySelector('nav');
  const container = document.querySelector('.container');
  const dropdowns = document.querySelectorAll('.dropdown');

  // ======= Slide Panel Elements =======
  const getStartedBtn = document.querySelectorAll('.get-started-btn');
  const slidePanel = document.getElementById('slidePanel');
  const overlay = document.getElementById('overlay');
  const closeSlide = document.getElementById('closeSlide');
  const optionButtons = document.querySelectorAll('.option-btn');
  const backButtons = document.querySelectorAll('.back-arrow');

  if (!hamburger || !closeIcon || !nav || !container) return;

  // ----- Dropdown helpers -----
  function closeAllDropdowns() {
    dropdowns.forEach(dd => dd.classList.remove('open', 'show'));
  }

  // ----- Menu open/close helpers -----
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

  // ----- Event listeners for menu -----
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

  document.addEventListener('click', e => {
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

  window.addEventListener('resize', updateMenuDisplay);

  // ----- Dropdown hover effects (desktop optional) -----
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => dropdown.classList.add('show'));
    dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('show'));
  });

  // ======= Slide panel open/close =======
  getStartedBtn.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();               // prevent default anchor behavior
    document.getElementById('slidePanel').classList.add('open');
    document.getElementById('overlay').classList.add('active');
    goToStep('step1');                // reset to first step
  });
});
  if (slidePanel && overlay && closeSlide) {
    closeSlide.addEventListener('click', () => {
      slidePanel.classList.remove('open');
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
      slidePanel.classList.remove('open');
      overlay.classList.remove('active');
    });

    // ----- Step switching helpers -----
    function switchStep(currentStep, nextStep, outClass, inClass) {
      currentStep.classList.add(outClass);

      currentStep.addEventListener('animationend', function handleOut() {
        currentStep.removeEventListener('animationend', handleOut);
        currentStep.style.display = 'none';
        currentStep.classList.remove(outClass, 'active');

        nextStep.style.display = 'flex';
        nextStep.classList.add(inClass, 'active');

        nextStep.addEventListener('animationend', function handleIn() {
          nextStep.classList.remove(inClass);
          nextStep.removeEventListener('animationend', handleIn);
        });
      });
    }

    // ----- Initialize steps -----
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
      step.style.display = 'none';
      step.classList.remove('active');
    });

    const step1 = document.getElementById('step1');
    if (step1) {
      step1.style.display = 'flex';
      step1.classList.add('active');
    }

    // ----- Option button click (Next) -----
    optionButtons.forEach(button => {
      button.addEventListener('click', event => {
        const currentStep = button.closest('.step');
        const nextStepId = button.getAttribute('data-next');
        const nextStep = document.getElementById(nextStepId);

        if (currentStep.id === 'careNeeds') {
          const checkedBoxes = currentStep.querySelectorAll('input[type="checkbox"]:checked');
          if (checkedBoxes.length === 0) {
            event.preventDefault();
            return;
          }
        }

        if (nextStep) {
          event.preventDefault();
          switchStep(currentStep, nextStep, 'slide-out-left', 'slide-in-right');
        }
      });
    });

    // ----- Back button click -----
    backButtons.forEach(button => {
      button.addEventListener('click', () => {
        const currentStep = button.closest('.step');
        const backStepId = button.getAttribute('data-back');
        const backStep = document.getElementById(backStepId);

        if (backStep) {
          switchStep(currentStep, backStep, 'slide-out-right', 'slide-in-left');
        }
      });
    });
  }

  // Set initial menu state based on window size
  updateMenuDisplay();
});

// ======= Form Submission =======
const scriptURL = 'https://script.google.com/macros/s/AKfycbxiCqmlApiEmiLrWRke9_NvkOEqoTXhPreW9PY5Skt2B6ilG1FpR6uzAzY5QAc-YHs3/exec';
let careFor = '';

// Save careFor value from step
document.querySelectorAll("#careForm .option-btn").forEach(button => {
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
  goToStep("step1"); // define goToStep to handle UI reset
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
    document.querySelectorAll("#careNeeds input[type='checkbox']:checked").forEach(cb => {
      const label = cb.parentElement.textContent.trim();
      needs.push(label);
    });
    data["Care Needs"] = needs.join(" | ");;
  }else {
    data["formType"] = "job";
  }

  fetch(scriptURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
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

// Define goToStep and closeModal if not already present
function goToStep(stepId) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    step.style.display = 'none';
    step.classList.remove('active');
  });

  const target = document.getElementById(stepId);
  if (target) {
    target.style.display = 'flex';
    target.classList.add('active');
  }
}

function closeModal() {
  const slidePanel = document.getElementById('slidePanel');
  const overlay = document.getElementById('overlay');
  if (slidePanel && overlay) {
    slidePanel.classList.remove('open');
    overlay.classList.remove('active');
  }
}
