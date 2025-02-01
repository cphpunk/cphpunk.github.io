import { state } from "./state.js";

export function populateVenueFilters() {
  const container = document.getElementById('venueList');
  if (!container) return;

  try {
    container.innerHTML = `
      <div id="venueControls">
        <button id="enableAllVenues">Enable All</button>
        <button id="disableAllVenues">Disable All</button>
      </div>
      <h3>Venues</h3>
      ${Object.entries(state.venues).sort(([a], [b]) => a.localeCompare(b)).map(([venue, url]) => `
        <div class="venue-item">
          <div class="venue-info">
            <a href="${url}" target="_blank">${venue}</a>
          </div>
          <label class="venue-toggle">
            <input type="checkbox" data-venue="${venue}" ${state.pageFilters[venue] ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      `).join('')}
      <div id="venueControls">
        <button id="enableAllVenues">Enable All</button>
        <button id="disableAllVenues">Disable All</button>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load venues:', error);
    container.innerHTML = '<p>Failed to load venues</p>';
  }
}