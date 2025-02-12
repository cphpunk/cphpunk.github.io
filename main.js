import { state } from './state.js';
import { loadEvents } from './loader.js';
import { loadFilters } from './filters.js';
import { initializeDOMRenderer, toggleLoadingSpinner } from './render.js';
import { registerInteractions } from './interaction.js';
import { generateHTML } from './constructor.js';

document.addEventListener('DOMContentLoaded', async () => {
  toggleLoadingSpinner(true);

  state.events = await loadEvents(state.timeWindowStart, state.timeWindowEnd);

  await loadFilters();
  await generateHTML();

  initializeDOMRenderer();
  registerInteractions();

  toggleLoadingSpinner(false);
  
  checkAdblockerMessingWithImages();
});


/*
* This isn't the greatest way to do to this.. but if some image covers are not loading they might be being blocked by an adblocker.
* So we run this check three times, one second between each attempt, to see if it's happening.
* That should give us enough time to catch this happening.
* This should probably go in renderer.js?
*/
function checkAdblockerMessingWithImages(attempts = 0) {
  const visibleEvents = document.querySelectorAll('.event-box[style*="display: flex"] img');
  const placeholderCount = Array.from(visibleEvents).filter(img =>
    img.dataset.usesPlaceholder === 'true'
  ).length;
  const allEventsUsingPlaceholder = placeholderCount >= 8;

  if (allEventsUsingPlaceholder && visibleEvents.length > 0) {
    const eventList = document.getElementById('eventList');
    const message = document.createElement('div');
    message.className = 'adblocker-notice';
    message.innerHTML = `
      <p>⚠️ If you don't see the proper event images, try disabling your adblocker. We don't run ads, don't worry :)</p>
    `;
    eventList.insertAdjacentElement('beforebegin', message);
  } else if (attempts < 3) {
    setTimeout(() => checkAdblockerMessingWithImages(attempts + 1), 1000);
  }
}