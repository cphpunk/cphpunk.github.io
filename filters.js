import { state } from './state.js';
import { displayEvents } from './render.js';

/*
* Users can set which venues they want to see.
* Data structure is simple: venue is the key, boolean is the value.
*/
export function saveVenuePreferences() {
  try {
    const venues = [...state.pageFilters].reduce((acc, venue) => {
      acc[venue] = state.pageFilters.has(venue);
      return acc;
    }, {});
    localStorage.setItem('venueSettings', JSON.stringify(venues));
    updateFilterIndicator();
  } catch (error) {
    console.error('Failed to save venue preferences:', error);
  }
}

export function loadVenuePreferences() {
  const saved = localStorage.getItem('venueSettings');
  if (!saved) {
    enableAllVenues();
    return;
  };

  const venues = JSON.parse(saved);
  const currentVenues = new Set(state.events.map(e => e.venue));
  state.pageFilters = new Set([...currentVenues].filter(v => venues[v] === true));
  updateFilterIndicator();
}

/*
* If the user has set filters, we show them a little red dot on the gear icon.
* Ideally this would allow them to see they have filters active.
*/
function updateFilterIndicator() {
  const infoButton = document.getElementById('infoButton');
  if (infoButton) {
    const available = new Set(state.events.map(e => e.venue));
    infoButton.classList.toggle('has-filters', state.pageFilters.size < available.size);
  }
}

function enableAllVenues() {
  state.pageFilters = new Set(state.events.map(e => e.venue));
  saveVenuePreferences();
  displayEvents();
  // Update all checkboxes to checked state
  document.querySelectorAll('.venue-toggle input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = true;
  });
}

function disableAllVenues() {
  state.pageFilters.clear();
  saveVenuePreferences();
  displayEvents();
  // Update all checkboxes to unchecked state
  document.querySelectorAll('.venue-toggle input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
}

export function populateVenueList() {
  const container = document.getElementById('venueList');
  if (!container) return;

  container.innerHTML = `
    <div id="venueControls">
      <button id="enableAllVenues">Enable All</button>
      <button id="disableAllVenues">Disable All</button>
    </div>
    <h3>Venues</h3>
    ${[...new Set(state.events.map(e => e.venue))].sort().map(venue => `
      <div class="venue-item">
        <div class="venue-info">
          <a href="${state.events.find(e => e.venue === venue)?.venueUrl}" target="_blank">${venue}</a>
        </div>
        <label class="venue-toggle">
          <input type="checkbox" ${state.pageFilters.has(venue) ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    `).join('')}
    <div id="venueControls">
      <button id="enableAllVenues">Enable All</button>
      <button id="disableAllVenues">Disable All</button>
    </div>
  `;

  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      const venueName = input.parentElement.previousElementSibling.textContent.trim();
      state.pageFilters[input.checked ? 'add' : 'delete'](venueName);
      saveVenuePreferences();
      displayEvents();
    });
  });

  document.querySelectorAll('#enableAllVenues').forEach(button => {
    button.addEventListener('click', enableAllVenues);
  });

  document.querySelectorAll('#disableAllVenues').forEach(button => {
    button.addEventListener('click', disableAllVenues);
  });
}