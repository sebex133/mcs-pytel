export function cookieConsent() { 
  const dialog = document.getElementById("cookie-dialog");
  const opener = document.getElementById("cookie-banner-opener");
  const form = document.getElementById("cookie-form");
  const reopenClose = document.getElementById("reopen-close");

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1];
  }

  function setConsentCookie(values) {
    const value = `functional=true&analytics=${values.analytics}&marketing=${values.marketing}`;
    document.cookie = `cookie_consent=${value};path=/;max-age=${60*60*24*365}`;
  }

  function openDialog(force = false) {
    if (!dialog.open) dialog.showModal();
    reopenClose.classList.toggle("hidden", force);
  }

  dialog.addEventListener('close', () => {
    if (!getCookie("cookie_consent")) {
      console.log('reopen if not deiction');
      openDialog(true);
    }
  });

  dialog.addEventListener('cancel', (e) => {
    if (!getCookie("cookie_consent")) {
      e.preventDefault();
      console.log('make decision ifrst');
    }
  });

  // First visit → force dialog
  if (!getCookie("cookie_consent")) {
    openDialog(true);
  }

  // Reopen via button
  opener.addEventListener("click", () => openDialog(false));

  // Save selected.
  document.getElementById("accept-selected").onclick = () => {
    setConsentCookie({
      analytics: form.analytics.checked,
      marketing: form.marketing.checked
    });
    dialog.close();
  };

  // Deny optional.
  document.getElementById("deny-optional").onclick = () => {
    form.analytics.checked = false;
    form.marketing.checked = false;
    setConsentCookie({ analytics: false, marketing: false });
    dialog.close();
  };

  // Accept all.
  document.getElementById("accept-all").onclick = () => {
    form.analytics.checked = true;
    form.marketing.checked = true;
    setConsentCookie({ analytics: true, marketing: true });
    dialog.close();
  };

  // Close only when reopened
  document.getElementById("close-dialog").onclick = () => dialog.close();
}