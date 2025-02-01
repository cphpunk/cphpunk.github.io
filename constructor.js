import { state } from "./state.js";
import { DOM_IDS, DOM_CLASSES } from "./constants.js";

export function populateVenueFilters() {
  const container = document.getElementById(DOM_IDS.VENUE_LIST);
  if (!container) return;

  try {
    container.innerHTML = `
      <div id="${DOM_IDS.VENUE_CONTROLS}">
        <button id="${DOM_IDS.ENABLE_ALL_VENUES}">Enable All</button>
        <button id="${DOM_IDS.DISABLE_ALL_VENUES}">Disable All</button>
      </div>
      <h3>Venues</h3>
      ${Object.entries(state.venues).sort(([a], [b]) => a.localeCompare(b)).map(([venue, url]) => `
        <div class="${DOM_CLASSES.VENUE_ITEM}">
          <div class="${DOM_CLASSES.VENUE_INFO}">
            <a href="${url}" target="_blank">${venue}</a>
          </div>
          <label class="${DOM_CLASSES.VENUE_TOGGLE}">
            <input type="checkbox" data-venue="${venue}" ${state.pageFilters[venue] ? 'checked' : ''}>
            <span class="${DOM_CLASSES.SLIDER}"></span>
          </label>
        </div>
      `).join('')}
      <div id="${DOM_IDS.VENUE_CONTROLS}">
        <button id="${DOM_IDS.ENABLE_ALL_VENUES}">Enable All</button>
        <button id="${DOM_IDS.DISABLE_ALL_VENUES}">Disable All</button>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load venues:', error);
    container.innerHTML = '<p>Failed to load venues</p>';
  }
}