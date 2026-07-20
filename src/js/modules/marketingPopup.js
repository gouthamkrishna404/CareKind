export function initMarketingPopup() {
  const popupOverlay = document.getElementById("popupOverlay");
  const popupClose = document.getElementById("popupClose");
  const popupGetStarted = document.getElementById("popupGetStarted");

  if (!popupOverlay || !popupClose || !popupGetStarted) return;

  let popupShown = false;
  const popupShownSession = sessionStorage.getItem("popupShown");

  function showPopup() {
    popupOverlay.classList.add("show");
    popupShown = true;
    sessionStorage.setItem("popupShown", "true");
    document.body.style.overflow = "hidden";
  }

  function hidePopup() {
    popupOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  if (!popupShownSession) {
    setTimeout(() => {
      if (!popupShown) showPopup();
    }, 8000);

    let scrollThreshold = false;
    window.addEventListener("scroll", () => {
      if (!scrollThreshold && window.scrollY > 800 && !popupShown) {
        scrollThreshold = true;
        setTimeout(() => {
          if (!popupShown) showPopup();
        }, 2000);
      }
    });
  }

  popupClose.addEventListener("click", hidePopup);

  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) hidePopup();
  });

  popupGetStarted.addEventListener("click", hidePopup);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popupOverlay.classList.contains("show")) hidePopup();
  });
}
