export function initServiceCarousel() {
  const gridContainer = document.querySelector(".grid-container");
  if (!gridContainer) return;

  const sphereIndicator = document.createElement("div");
  sphereIndicator.className = "carousel-sphere-indicator";
  gridContainer.parentElement.insertAdjacentElement("afterend", sphereIndicator);

  let scrollInterval;
  const isScrolling = false;

  function autoScroll() {
    if (!gridContainer || isScrolling) return;
    const scrollAmount = 360;
    const maxScroll = gridContainer.scrollWidth - gridContainer.clientWidth;

    if (gridContainer.scrollLeft >= maxScroll - 10) {
      gridContainer.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      gridContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  function startAutoScroll() {
    if (scrollInterval) return;
    scrollInterval = setInterval(autoScroll, 4000);
  }

  startAutoScroll();
}
