export function setupUI() {
  console.log("MCS-PYTEL script");

  const toggleThemeButton = document.querySelector("#toggle-theme-button");
  toggleThemeButton.addEventListener("click", toggleThemeFunc);

  const menuWrapper = document.querySelector(".menu-wrapper");
  const toggleMenuButton = document.querySelector(".menu-toggle .hamburger");
  const navWrapper = document.querySelector(".nav-wrapper");
  const debugData = document.querySelector("#debug-data");

  const focusTrapHandler = (e) => {
    const escapedHtml = e.target.innerHTML .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    debugData.innerHTML = "<span>" + escapedHtml 
      + "_men?" + !menuWrapper.contains(e.target)
      + '_end?' + e.target.classList.contains('synthetic-focus-trap-end') 
      + "<span><br/>" + debugData.innerHTML;

    if (!menuWrapper.contains(e.target) || [...e.target.classList].indexOf('synthetic-focus-trap-end') > -1) {
      e.stopPropagation();
      toggleMenuButton.focus();
    }
  };

  toggleMenuButton.addEventListener("click", (event) => {
    toggleMenuButton.classList.toggle("active");
    navWrapper.classList.toggle("show");

    const dropdownFocusTrapHandler = focusTrappedElementsHandlers.get(toggleMenuButton);
    if (navWrapper.classList.contains('show') && !dropdownFocusTrapHandler) {
      document.body.addEventListener('focusin', focusTrapHandler);
      focusTrappedElementsHandlers.set(toggleMenuButton, focusTrapHandler);
    }
    else if (!navWrapper.classList.contains('show') && dropdownFocusTrapHandler) {
      document.body.removeEventListener('focusin', dropdownFocusTrapHandler);
      focusTrappedElementsHandlers.delete(toggleMenuButton);
    }
  });

  const mainNavLinks = document.getElementsByClassName("main-nav-link");
  for (let i = 0; i < mainNavLinks.length; i++) {
    mainNavLinks[i].addEventListener("click", (event) => {
      toggleMenuButton.classList.remove("active");
      navWrapper.classList.remove("show");

      const dropdownFocusTrapHandler = focusTrappedElementsHandlers.get(toggleMenuButton);
      if (!navWrapper.classList.contains('show') && dropdownFocusTrapHandler) {
        document.body.removeEventListener('focusin', dropdownFocusTrapHandler);
        focusTrappedElementsHandlers.delete(toggleMenuButton);
      }
    });
  }
}

var focusTrappedElementsHandlers = new Map();

var isThemeDark = true;
const toggleThemeFunc = () => {
  document.body.classList.add('transitioning-mode');

  if (isThemeDark) {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
  
  isThemeDark = !isThemeDark;

  setTimeout(function() {
    document.body.classList.remove('transitioning-mode');
  }, 300);
};
