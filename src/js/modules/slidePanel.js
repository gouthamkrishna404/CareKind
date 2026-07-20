export function goToStep(stepId) {
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

export function closeModal() {
  const slidePanel = document.getElementById("slidePanel");
  const overlay = document.getElementById("overlay");
  if (slidePanel && overlay) {
    slidePanel.classList.remove("open");
    overlay.classList.remove("active");
  }
}

export function initSlidePanel() {
  const slidePanel = document.getElementById("slidePanel");
  const overlay = document.getElementById("overlay");
  const closeSlide = document.getElementById("closeSlide");
  const getStartedBtn = document.querySelectorAll(".get-started-btn");
  const optionButtons = document.querySelectorAll(".option-btn");
  const backButtons = document.querySelectorAll(".back-arrow");

  function openPanel(stepId) {
    if (!slidePanel || !overlay) return;
    slidePanel.classList.add("open");
    overlay.classList.add("active");
    goToStep(stepId);
  }

  getStartedBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openPanel("step1");
    });
  });

  const footerApplyJobBtn = document.getElementById("footerApplyJobBtn");
  if (footerApplyJobBtn) {
    footerApplyJobBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openPanel("jobForm");
    });
  }

  const popupGetStarted = document.getElementById("popupGetStarted");
  if (popupGetStarted) {
    popupGetStarted.addEventListener("click", (e) => {
      e.preventDefault();
      openPanel("careForm");
    });
  }

  const footerCareAdultBtn = document.getElementById("footerCareAdultBtn");
  if (footerCareAdultBtn) {
    footerCareAdultBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openPanel("careForm");
    });
  }

  if (!slidePanel || !overlay || !closeSlide) return;

  closeSlide.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

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
