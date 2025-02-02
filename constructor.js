import { state } from "./state.js";
import { DOM_IDS, DOM_CLASSES, TAG_EMOJIS, EVENT_TAGS } from "./constants.js";

export function populateVenueFilters() {
  const container = document.getElementById(DOM_IDS.VENUE_LIST);
  if (!container) return;

  try {
    container.innerHTML = `<br>
      <div class="filter-section">
        <div class="filter-header">
          <h3>CATEGORIES:</h3>
          <div class="filter-controls">
            <button class="control-btn enable">All</button>
            <button class="control-btn disable">None</button>
          </div>
        </div>
        <div id="${DOM_IDS.TAG_LIST}" class="tag-list"></div>
      </div>

      <div class="filter-section">
        <div class="filter-header">
          <h3>VENUES:</h3>
          <div class="filter-controls">
            <button class="control-btn enable">All</button>
            <button class="control-btn disable">None</button>
          </div>
        </div>
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
      </div>
    `;

    const tagList = document.getElementById(DOM_IDS.TAG_LIST);
    tagList.innerHTML = EVENT_TAGS.map(tag => `
      <div class="filter-item">
        <button class="tag-filter ${state.tagFilters.has(tag) ? 'active' : ''}" 
                data-tag="${tag}">
          ${TAG_EMOJIS[tag]} ${tag}
        </button>
      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load venues:', error);
    container.innerHTML = '<p>Failed to load venues</p>';
  }
}