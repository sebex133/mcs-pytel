// Import modules
import { setupUI, dialogs } from './ui.js';
import { cookieConsent } from './cookie-consent.js';

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  setupUI();
  dialogs();
  cookieConsent();
});
