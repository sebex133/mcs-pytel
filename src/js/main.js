// Import modules
import { setupUI, dialogs } from './ui.js';
import { cookieConsent } from './cookie-consent.js';
// import { fetchData } from './api.js';
// import { formatDate } from './utils.js';

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  setupUI();
  dialogs();
  cookieConsent();

  document.querySelectorAll('.dialog-wrapper')
    .forEach(el => new CustomScrollbar(el));
//   try {
//     const data = await fetchData();
//     const formatted = formatDate(data.date);
//     document.querySelector('#output').textContent = `Data loaded on ${formatted}`;
//   } catch (error) {
//     console.error('Error loading data:', error);
//   }
});

class CustomScrollbar {
  constructor(container) {
    this.container = container;
    this.content = container.querySelector('.dialog-body');
    this.scrollbar = container.querySelector('.custom-scrollbar');
    this.thumb = container.querySelector('.custom-thumb');

    this.isDragging = false;
    this.startY = 0;
    this.startScrollTop = 0;

    this.init();
  }

  init() {
    this.updateThumb();
    this.bindEvents();
  }

  bindEvents() {
    // Sync thumb on scroll
    this.content.addEventListener('scroll', () => this.updateThumb());

    // Resize support
    window.addEventListener('resize', () => this.updateThumb());

    // Drag thumb
    this.thumb.addEventListener('mousedown', e => this.onDragStart(e));
    document.addEventListener('mousemove', e => this.onDragMove(e));
    document.addEventListener('mouseup', () => this.onDragEnd());

    // Touch support (iOS Safari)
    this.thumb.addEventListener('touchstart', e => this.onDragStart(e.touches[0]));
    document.addEventListener('touchmove', e => this.onDragMove(e.touches[0]));
    document.addEventListener('touchend', () => this.onDragEnd());
  }

  updateThumb() {
    const { scrollTop, scrollHeight, clientHeight } = this.content;
    const ratio = clientHeight / scrollHeight;

    const thumbHeight = Math.max(clientHeight * ratio, 30);
    const thumbTop = (scrollTop / scrollHeight) * clientHeight;

    this.thumb.style.height = `${thumbHeight}px`;
    this.thumb.style.transform = `translateY(${thumbTop}px)`;

    // Hide scrollbar if not needed
    this.scrollbar.style.display = ratio >= 1 ? 'none' : 'block';
  }

  onDragStart(e) {
    this.isDragging = true;
    this.startY = e.clientY;
    this.startScrollTop = this.content.scrollTop;
    document.body.style.userSelect = 'none';
  }

  onDragMove(e) {
    if (!this.isDragging) return;

    const deltaY = e.clientY - this.startY;
    const scrollRatio =
      this.content.scrollHeight / this.content.clientHeight;

    this.content.scrollTop =
      this.startScrollTop + deltaY * scrollRatio;
  }

  onDragEnd() {
    this.isDragging = false;
    document.body.style.userSelect = '';
  }
}
