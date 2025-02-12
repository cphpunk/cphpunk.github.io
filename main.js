import { state } from './state.js';
import { loadEvents } from './loader.js';
import { loadFilters } from './filters.js';
import { initializeDOMRenderer, toggleLoadingSpinner } from './render.js';
import { registerInteractions } from './interaction.js';
import { generateHTML } from './constructor.js';
import { DEFAULTS } from './constants.js';

document.addEventListener('DOMContentLoaded', async () => {
  toggleLoadingSpinner(true);

  state.events = await loadEvents(state.timeWindowStart, state.timeWindowEnd);

  await loadFilters();
  await generateHTML();

  // Check if all visible events are using placeholder
  const visibleEvents = document.querySelectorAll('.event-box[style*="display: flex"] img');
  const allUsingPlaceholder = Array.from(visibleEvents).every(img => 
    img.src === DEFAULTS.PLACEHOLDER_IMAGE || img.currentSrc === DEFAULTS.PLACEHOLDER_IMAGE
  );

  if (allUsingPlaceholder && visibleEvents.length > 0) {
    const eventList = document.getElementById('eventList');
    const message = document.createElement('div');
    message.className = 'adblocker-notice';
    message.innerHTML = `
      <p>⚠️ If you don't see the proper event images, try disabling your adblocker. We don't run ads, don't worry :)</p>
    `;
    eventList.insertAdjacentElement('beforebegin', message);
  }
  
  initializeDOMRenderer();
  registerInteractions();

  toggleLoadingSpinner(false);
});