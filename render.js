import { state } from './state.js';
import { DOM_CLASSES } from './constants.js';

export function renderSite() {
  updateEventsByFilters();
  updateVenueToggles();
}

async function updateEventsByFilters() {
  document.querySelectorAll(`.${DOM_CLASSES.EVENTBOX}`).forEach(eventBox => {
    const eventId = eventBox.dataset.id;
    const event = state.events.find(e => e.id === eventId);
    
    console.assert(event, `Event with id ${eventId} not found`);

    const venueEnabled = state.pageFilters[event.venue];
    const tagEnabled = state.tagFilters.has(event.tag);
    
    // Show event only if both venue and tag filters are enabled
    eventBox.style.display = venueEnabled && tagEnabled ? 'flex' : 'none';
  });

  // Hide empty date dividers
  document.querySelectorAll('.event-day-divider').forEach(divider => {
    const hasVisibleEvents = Array.from(divider.querySelectorAll(`.${DOM_CLASSES.EVENTBOX}`))
      .some(event => event.style.display !== 'none');
    divider.style.display = hasVisibleEvents ? 'block' : 'none';
  });
}

async function updateVenueToggles() {
  document.querySelectorAll('.venue-toggle input[type="checkbox"]').forEach(checkbox => {
    const venue = checkbox.dataset.venue;
    checkbox.checked = state.pageFilters[venue];
  });
}