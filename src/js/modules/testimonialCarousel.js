export function initTestimonialCarousel() {
  const track = document.getElementById("testimonial-track");
  const leftArrow = document.getElementById("arrow-left");
  const rightArrow = document.getElementById("arrow-right");
  const carouselWrapper = document.querySelector(".carousel-wrapper");

  if (!track || !leftArrow || !rightArrow || !carouselWrapper) return;

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
    const delay = window.innerWidth > 1024 ? 3000 : 5000;
    intervalId = setInterval(() => {
      moveToIndex(index + 1);
    }, delay);
  }

  function stopAutoSlide() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  }

  leftArrow.addEventListener("click", () => moveToIndex(index - 1));
  rightArrow.addEventListener("click", () => moveToIndex(index + 1));

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

  window.addEventListener("load", init);
}
