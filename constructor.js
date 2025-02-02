import { state } from "./state.js";
import { DOM_IDS, DOM_CLASSES, TAG_EMOJIS, EVENT_TAGS,  DATE_FORMATS, DEFAULTS, EVENT_DISPLAY  } from "./constants.js";

export function generateHTML() {
  populateVenueFilters();
  populateEvents();
}

function populateVenueFilters() {
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
        <div id="${DOM_IDS.FILTER_LIST}" class="filter-list">
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

function populateEvents() {
  const eventList = document.getElementById(DOM_IDS.EVENT_LIST);
  
  eventList.innerHTML = Object.entries(
    state.events
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
          <div class="${DOM_CLASSES.EVENTBOX}" data-id="${event.id}" onclick="window.open('${event.url}', '_blank')" style="cursor: pointer">
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