// Import modules
import { setupUI } from './ui.js';
// import { fetchData } from './api.js';
// import { formatDate } from './utils.js';

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  setupUI();

//   try {
//     const data = await fetchData();
//     const formatted = formatDate(data.date);
//     document.querySelector('#output').textContent = `Data loaded on ${formatted}`;
//   } catch (error) {
//     console.error('Error loading data:', error);
//   }
});