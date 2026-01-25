export function cookieConsent() { 
  const cookieDialog = document.getElementById("cookie-dialog");
  const cookieForm = document.getElementById("cookie-form");
  const cookieOpener = document.getElementById("cookie-dialog-opener");

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1];
  }

  function setConsentCookie(values) {
    const value = JSON.stringify({
      functional: true,
      analytics: values.analytics,
      marketing: values.marketing
    });
    document.cookie = `cookie_consent=${value};path=/;max-age=${60*60*24*365}`;
  }

  function openCookieDialog() {
    if (!cookieDialog.open) {
      cookieDialog.showModal();
      cookieDialog.focus();
    }
  }

  function setCookieSettingsMode() {
    cookieDialog.classList.add('cookie-settings-mode');
    cookieDialog.focus();
  }

  cookieDialog.addEventListener('close', () => {
    if (!getCookie("cookie_consent")) {
      openCookieDialog();
    }
  });

  cookieDialog.addEventListener('cancel', (e) => {
    if (!getCookie("cookie_consent")) {
      e.preventDefault();
    }
  });

  // Backdrop click close.
  cookieDialog.addEventListener("pointerdown", (e) => {
    if (e.target === cookieDialog && getCookie("cookie_consent")) {
      cookieDialog.close();
    }
  });

  // First visit - force dialog, other visits - switch settings mode.
  const userCookiePreferences = JSON.parse(getCookie("cookie_consent") ?? '{}');
  if (!Object.keys(userCookiePreferences).length) {
    openCookieDialog();
  }
  else {
    cookieForm.analytics.checked = userCookiePreferences.analytics;
    cookieForm.marketing.checked = userCookiePreferences.marketing;
    setCookieSettingsMode();
  }

  // Reopen via button
  cookieOpener.addEventListener("click", () => openCookieDialog());
  
  // Open settings mode.
  document.getElementById("cookie-settings").onclick = () => {
    setCookieSettingsMode();
  };

  // Save selected.
  document.getElementById("accept-selected").onclick = () => {
    setConsentCookie({
      analytics: cookieForm.analytics.checked,
      marketing: cookieForm.marketing.checked
    });
    cookieDialog.close();
  };

  // Deny optional.
  document.getElementById("deny-optional").onclick = () => {
    cookieForm.analytics.checked = false;
    cookieForm.marketing.checked = false;
    setConsentCookie({ analytics: false, marketing: false });
    cookieDialog.close();
  };

  // Accept all.
  document.getElementById("accept-all").onclick = () => {
    cookieForm.analytics.checked = true;
    cookieForm.marketing.checked = true;
    setConsentCookie({ analytics: true, marketing: true });
    cookieDialog.close();
  };

}