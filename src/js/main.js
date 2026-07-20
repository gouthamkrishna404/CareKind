import { initNav } from "./modules/nav.js";
import { initSlidePanel } from "./modules/slidePanel.js";
import { initCareForms } from "./modules/careForms.js";
import { initCareOptionCards } from "./modules/careOptionCards.js";
import { initTestimonialCarousel } from "./modules/testimonialCarousel.js";
import { initServiceCarousel } from "./modules/serviceCarousel.js";
import { initFaqAccordion } from "./modules/faqAccordion.js";
import { initMarketingPopup } from "./modules/marketingPopup.js";
import { initSmoothScroll } from "./modules/smoothScroll.js";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initSlidePanel();
  initCareForms();
  initCareOptionCards();
  initTestimonialCarousel();
  initServiceCarousel();
  initFaqAccordion();
  initMarketingPopup();
  initSmoothScroll();
});
