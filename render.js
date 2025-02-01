import { state } from './state.js';
import { DOM_IDS, DATE_FORMATS, DEFAULTS, EVENT_DISPLAY } from './constants.js';

export function renderSite() {
  displayEvents();
  updateVenueToggles();
}

function displayEvents() {
  const eventList = document.getElementById(DOM_IDS.EVENT_LIST);
  
  eventList.innerHTML = Object.entries(
    state.events
      .filter(event => state.pageFilters[event.venue])
      .reduce((groups, event) => {
        const date = moment(event.start).format(DATE_FORMATS.EVENT_DATE);
        groups[date] = groups[date] || [];
        groups[date].push(event);
        return groups;
      }, {})
  ).map(([date, events]) => `
    <div class="event-day-divider" data-date="${date}">
      <div class="event-day-container">
        ${events.map(event => `
          <div class="event-box" onclick="window.open('${event.url}', '_blank')" style="cursor: pointer">
            <img src="${event.imageUrl || DEFAULTS.PLACEHOLDER_IMAGE}" class="event-image" loading="lazy" alt="${event.name}">
            <div class="event-tag" data-tag="${event.tag}">${event.tag}</div>
            <div class="event-details">
              <div class="event-title">${event.name}</div>
              <div class="event-date">${EVENT_DISPLAY.ICONS.DATE} ${moment(event.start).format(DATE_FORMATS.EVENT_TIME)}</div>
              <div class="event-location">${EVENT_DISPLAY.ICONS.LOCATION} ${event.venue}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function updateVenueToggles() {
  document.querySelectorAll('.venue-toggle input[type="checkbox"]').forEach(checkbox => {
    const venue = checkbox.dataset.venue;
    checkbox.checked = state.pageFilters[venue];
  });
}