import { SCRIPT_URL } from "../constants.js";

const form = document.getElementById("careRequestFormPage");
const stepDots = document.querySelectorAll(".step-dot");
const formStepsWrapper = document.querySelector(".form-steps-wrapper");

let currentStep = 1;
let careForValue = "";
let selectedNeeds = [];
let isAnimating = false;
const animationDuration = 600;

function setWrapperHeight() {
  const activeStep = document.querySelector(".form-step.active");
  if (activeStep) {
    formStepsWrapper.style.height = activeStep.offsetHeight + "px";
  }
}

function updateStepIndicator() {
  stepDots.forEach((dot, index) => {
    dot.classList.toggle("active", index + 1 === currentStep);
  });
}

function goToStep(stepNum) {
  if (isAnimating) return;

  const isSuccess = stepNum === "success";
  const newStepEl = isSuccess
    ? document.getElementById("successStep")
    : document.querySelector(`.form-step[data-step="${stepNum}"]`);
  const currentStepEl = document.querySelector(".form-step.active");

  if (!newStepEl || newStepEl === currentStepEl) return;

  if (isSuccess) {
    document.querySelector(".care-form-header").style.display = "none";
    document.querySelector(".step-indicator").style.display = "none";
  }

  isAnimating = true;
  const currentStepNum = currentStepEl ? parseInt(currentStepEl.dataset.step || 0) : 0;
  const isForward = isSuccess || stepNum > currentStepNum;

  newStepEl.style.display = "block";
  const newHeight = newStepEl.offsetHeight;
  newStepEl.style.display = "";

  formStepsWrapper.style.height = newHeight + "px";

  const outClass = isForward ? "animate-out-left" : "animate-out-right";
  const inClass = isForward ? "animate-in-right" : "animate-in-left";

  if (currentStepEl) {
    currentStepEl.style.position = "absolute";
    currentStepEl.style.top = "0";
    currentStepEl.style.left = "0";
    currentStepEl.classList.add(outClass);
    currentStepEl.classList.remove("active");
  }

  newStepEl.classList.add(inClass);
  newStepEl.classList.add("active");

  setTimeout(() => {
    if (currentStepEl) {
      currentStepEl.classList.remove(outClass);
      currentStepEl.style.position = "";
      currentStepEl.style.top = "";
      currentStepEl.style.left = "";
    }

    newStepEl.classList.remove(inClass);

    if (!isSuccess) {
      currentStep = stepNum;
    }

    updateStepIndicator();
    isAnimating = false;
  }, animationDuration);
}

const careOptions = document.querySelectorAll('.form-step[data-step="1"] .care-option-card');
const careForInput = document.getElementById("careForInput");

careOptions.forEach((option) => {
  option.addEventListener("click", () => {
    careOptions.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
    careForValue = option.getAttribute("data-value");
    careForInput.value = careForValue;
    goToStep(2);
  });
});

const needCards = document.querySelectorAll(".need-checkbox-card");
const step2Next = document.getElementById("step2Next");
const step2Back = document.getElementById("step2Back");

function updateSelectedNeeds() {
  selectedNeeds = Array.from(document.querySelectorAll(".need-checkbox-card input:checked")).map(
    (cb) => cb.value
  );
  step2Next.disabled = selectedNeeds.length === 0;
}

needCards.forEach((card) => {
  card.addEventListener("click", () => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    card.classList.toggle("checked", checkbox.checked);
    updateSelectedNeeds();
  });
});

step2Next.addEventListener("click", () => goToStep(3));
step2Back.addEventListener("click", () => goToStep(1));

const step3Back = document.getElementById("step3Back");
step3Back.addEventListener("click", () => goToStep(2));

document
  .querySelectorAll('.form-step[data-step="3"] label.care-option-card input[type="radio"]')
  .forEach((r) => {
    const card = r.parentElement;
    card.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const name = r.getAttribute("name");
      document
        .querySelectorAll(`.form-step[data-step="3"] input[type="radio"][name="${name}"]`)
        .forEach((inp) => inp.parentElement.classList.remove("selected"));
      r.checked = true;
      card.classList.add("selected");
    });
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  goToStep("success");

  const data = {
    formType: "consultation",
    "Care For": careForValue,
    "Care Needs": selectedNeeds.join(" | "),
    "First Name": form.querySelector('[name="First Name"]').value,
    "Last Name": form.querySelector('[name="Last Name"]').value,
    "Phone Number": form.querySelector('[name="Phone Number"]').value,
    Email: form.querySelector('[name="Email"]').value,
    "Postal Code": form.querySelector('[name="Postal Code"]').value,
    "Preferred Contact":
      (form.querySelector('input[name="Preferred Contact"]:checked') || {}).value || "",
    "Preferred Time": form.querySelector('[name="Preferred Time"]').value,
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  })
    .then(() => console.log("Form data sent in background."))
    .catch((error) => console.error("Error sending form data in background:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  setWrapperHeight();
  window.addEventListener("resize", setWrapperHeight);
});
