import { state } from "./state.js";
import { DOM_IDS, DOM_CLASSES, TAG_EMOJIS, ALL_EVENT_CATEGORIES, DATE_FORMATS, DEFAULTS, EVENT_DISPLAY,
  ALL_COPENHAGEN_SOURCES
} from "./constants.js";
import { setDistrictEnabled } from "./filters.js";

/*
* Map Handling is rough and needs to be split in logic / filter / view as the other stuff in the future:
*/

const LABEL_STYLE = {
  SELECTED_COLOR: '#000000',
  UNSELECTED_COLOR: '#808080', 
  HOVER_SELECTED_COLOR: '#1a1a1a',
  HOVER_UNSELECTED_COLOR: '#666666'
};

export async function generateHTML() {
  populateVenueFilters();
  populateEvents();
  await generateMap();
}

async function generateMap() {
  try {
    const response = await fetch('assets/copenhagen_districts.svg');
    const svgContent = await response.text();
    const container = document.getElementById('map-container');
    container.innerHTML = `<br>
      <div class="filter-section">
        <div class="filter-header">
          <h3>DISTRICTS:</h3>
          <div class="filter-controls">
            <button class="control-btn enable">All</button>
            <button class="control-btn disable">None</button>
          </div>
        </div>
        ${svgContent}
      </div>
    `;

    setupDistricts();
  } catch (error) {
    console.error('Error loading map:', error);
  }
}

function setupDistricts() {
  document.querySelectorAll('path[data-district], circle[data-district]').forEach(element => {
    const district = element.dataset.district;
    const labelRect = document.querySelector(`rect[data-district="${district}"]`);
    const isEnabled = state.districtFilters[district];
    
    updateDistrictStyle(element, isEnabled, labelRect);
    
    element.addEventListener('click', () => toggleDistrict(element));
    element.addEventListener('mouseenter', () => handleHover(element, true));
    element.addEventListener('mouseleave', () => handleHover(element, false));
  });
}

function toggleDistrict(path) {
  const district = path.dataset.district;
  const isSelected = state.districtFilters[district];
  const labelRect = document.querySelector(`rect[data-district="${district}"]`);
  
  updateDistrictStyle(path, !isSelected, labelRect);

  setDistrictEnabled(district, !isSelected);
}

export function updateDistrictStyle(path, isSelected, labelRect) {
  path.style.fill = isSelected ? LABEL_STYLE.SELECTED_COLOR : LABEL_STYLE.UNSELECTED_COLOR;
  path.style.cursor = 'pointer';

  //Disable IOS tap highlight
  path.style.webkitTapHighlightColor = 'transparent';

  if (labelRect) {
    labelRect.setAttribute('fill', isSelected ? LABEL_STYLE.SELECTED_COLOR : LABEL_STYLE.UNSELECTED_COLOR);
    labelRect.setAttribute('fill-opacity', '0.9');
  }
}

function handleHover(path, isHovering) {
  const isSelected = state.districtFilters[path.dataset.district];
  path.style.fill = isHovering
    ? isSelected ? LABEL_STYLE.HOVER_SELECTED_COLOR : LABEL_STYLE.HOVER_UNSELECTED_COLOR
    : isSelected ? LABEL_STYLE.SELECTED_COLOR : LABEL_STYLE.UNSELECTED_COLOR;
  
  if (isHovering) {
    path.style.transform = 'translateY(-5px)';
    path.style.transition = 'transform 0.1s ease';
  } else {
    path.style.transform = 'scale(1)';
  }
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
          <h3>SOURCES:</h3>
          <div class="filter-controls">
            <button class="control-btn enable">All</button>
            <button class="control-btn disable">None</button>
          </div>
        </div>
        <div id="${DOM_IDS.FILTER_LIST}" class="filter-list">
        ${Object.entries(ALL_COPENHAGEN_SOURCES).sort(([a], [b]) => a.localeCompare(b)).map(([venue, url]) => `
          <div class="${DOM_CLASSES.VENUE_ITEM}">
            <div class="${DOM_CLASSES.VENUE_INFO}">
              <a href="${url}" target="_blank">${venue}</a>
            </div>
            <label class="${DOM_CLASSES.VENUE_TOGGLE}">
              <input type="checkbox" data-venue="${venue}" ${state.sourceFilters[venue] ? 'checked' : ''}>
              <span class="${DOM_CLASSES.SLIDER}"></span>
            </label>
          </div>
        `).join('')}
      </div>
      </div>
    `;

    const tagList = document.getElementById(DOM_IDS.TAG_LIST);
    tagList.innerHTML = ALL_EVENT_CATEGORIES.map(tag => `
      <div class="filter-item">
        <button class="tag-filter ${state.categoryFilters[tag] ? 'active' : ''}" 
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
              <div class="event-location">${EVENT_DISPLAY.ICONS.LOCATION} ${event.venue + " (" + event.district + ")"}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}