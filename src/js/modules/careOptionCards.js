export function initCareOptionCards() {
  document
    .querySelectorAll('#careRequest label.care-option-card input[type="radio"]')
    .forEach((radio) => {
      const card = radio.parentElement;
      card.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = radio.getAttribute("name");
        document
          .querySelectorAll(`#careRequest input[type="radio"][name="${name}"]`)
          .forEach((input) => input.parentElement.classList.remove("selected"));
        radio.checked = true;
        card.classList.add("selected");
      });
    });
}
