import { SCRIPT_URL } from "../constants.js";
import { goToStep, closeModal } from "./slidePanel.js";

let careFor = "";

function submitForm(form, includeExtra = false) {
  const formData = new FormData(form);
  const data = {};

  goToStep("step1");
  closeModal();

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

    const checkedNeeds = Array.from(
      document.querySelectorAll('#careNeeds input[type="checkbox"]:checked')
    ).map((cb) => cb.name);
    data["Care Needs"] = checkedNeeds.join(" | ");

    const preferredTime = form.querySelector("input[name='Preferred Time']");
    if (preferredTime && preferredTime.value) data["Preferred Time"] = preferredTime.value;

    const preferredContact = form.querySelector("input[name='Preferred Contact']:checked");
    if (preferredContact && preferredContact.value) data["Preferred Contact"] = preferredContact.value;
  } else {
    data["formType"] = "job";
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  }).finally(() => {
    form.reset();
  });
}

export function initCareForms() {
  document.querySelectorAll("#careForm .option-btn").forEach((button) => {
    button.addEventListener("click", () => {
      careFor = button.getAttribute("name") || "";
    });
  });

  const jobForm = document.getElementById("jobFormFields");
  if (jobForm) {
    jobForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(jobForm);
    });
  }

  const careForm = document.getElementById("careRequestForm");
  if (careForm) {
    careForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(careForm, true);
    });
  }
}
