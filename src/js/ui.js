export function setupUI() {
  console.log("MCS-PYTEL script");

  const toggleThemeButton = document.querySelector("#toggle-theme-button");
  toggleThemeButton.addEventListener("click", toggleThemeFunc);

  const toggleMenuButton = document.querySelector(".menu-toggle .hamburger");
  const navWrapper = document.querySelector(".nav-wrapper");

  toggleMenuButton.addEventListener("click", (event) => {
    event.currentTarget.classList.toggle("active");
    navWrapper.classList.toggle("show");
  });
}

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
