export function setupUI() {
    console.log("MCS-PYTEL script");
    
  const toggleThemeButton = document.querySelector('#toggle-theme-button');
  toggleThemeButton.addEventListener('click', toggleThemeFunc);

  const toggleMenuButton = document.querySelector('.menu-toggle');
  toggleMenuButton.addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('show');
  });
}

var isThemeDark = true;
const toggleThemeFunc = () => {
    if (isThemeDark) {
        document.body.classList.add('light');
    }
    else {
        document.body.classList.remove('light');
    }
    isThemeDark = !isThemeDark;
};
