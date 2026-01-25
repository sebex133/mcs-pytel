

var isThemeDark = true;
const toggleThemeFunc = (e) => {
  const themeToggler = e.currentTarget;

  document.body.classList.add('transitioning-mode');

  if (isThemeDark) {
    document.body.classList.add("light-mode");
    themeToggler.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
    themeToggler.classList.remove("light-mode");
  }

  isThemeDark = !isThemeDark;

  // Save user choice for theme.
  document.cookie = `theme_dark=${isThemeDark};path=/;max-age=${60*60*24*365}`;

  setTimeout(function() {
    document.body.classList.remove('transitioning-mode');
  }, 150);
};

export function setupUI() {
  // Switch theme on switcher click.
  const toggleThemeButton = document.querySelector("#toggle-theme-button");
  toggleThemeButton.addEventListener("click", toggleThemeFunc);
  
  // Switch theme by cookie value.
  const themeDarkCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith('theme_dark' + "="))
    ?.split("=")[1] ?? "true";

  if (themeDarkCookie != 'true') {
    isThemeDark = !isThemeDark;
    document.body.classList.add('light-mode');
    toggleThemeButton.classList.add('light-mode');
  }

  // Menu wrapper.
  const headerWrapper = document.querySelector(".header-wrapper");
  const menuWrapper = document.querySelector(".menu-wrapper");
  const toggleMenuButton = document.querySelector(".menu-toggle .hamburger");
  const navWrapper = document.querySelector(".nav-wrapper");

  // Focus trap handler.
  var focusTrappedElementsHandlers = new Map();
  const focusTrapHandler = (e) => {
    if (!menuWrapper.contains(e.target) || [...e.target.classList].indexOf('synthetic-focus-trap-end') > -1) {
      e.stopPropagation();
      toggleMenuButton.focus();
    }
  };

  // Menu hamburger.
  const toggleMenuFunc = () => {
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
  };

  toggleMenuButton.addEventListener("click", toggleMenuFunc);

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

  // Menu close on body click.
  document.body.addEventListener('click', (event) => {
    if (toggleMenuButton.classList.contains('active') && !headerWrapper.contains(event.target)) {
      toggleMenuFunc();
    }
  });

  // Contact copt to clipboard.
  document.getElementById("copy-to-clipboard-button").addEventListener("click", async (e) => {
    const clickedElement = e.currentTarget;
    const textToCopy = clickedElement.innerHTML;

    clickedElement.classList.add('clicked');
    setTimeout(() => {
      clickedElement.classList.remove('clicked');
    }, 200);

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });
}

// Dialog modal.
export function dialogs() {
  const dialogs = document.querySelectorAll(".dialog");

  dialogs.forEach(el => {
    el.addEventListener("pointerdown", (e) => {
      if (e.target === el) {
        el.close();
      }
    });

    const dialogClose = el.querySelector('.dialog-close');
    dialogClose.addEventListener("click", (e) => {
      el.close();
    });
  });

  const dialogOpeners = document.querySelectorAll(".dialog-opener");

  dialogOpeners.forEach(el => {
    const relatedDialog = document.getElementById(el.getAttribute('data-related-dialog'));
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!relatedDialog.open) {
        relatedDialog.showModal();
        relatedDialog.focus();
      }
    });
  });
}
