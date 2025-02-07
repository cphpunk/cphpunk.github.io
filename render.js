/**
 * @fileoverview Updates the DOM based on available Events and Filters.
 * @description Called once during site constructions, then upon event 'filtersChanged'.
 * The class doesn't generate any HTML element, it simply show or hides the proper ones depending on filters.
 * @author Mattia
 */

import { state } from './state.js';
import { 
  DOM_CLASSES,
  DOM_IDS,
  EVENTS_KEYS,
  UNKNOWN_COPENHAGEN_DISTRICT,
  ALL_COPENHAGEN_DISTRICTS, ALL_EVENT_CATEGORIES, ALL_COPENHAGEN_SOURCES
} from './constants.js';

export function initializeDOMRenderer() {
  document.addEventListener(EVENTS_KEYS.FILTERS_CHANGED, updateDOM);
  updateDOM();
}

function updateDOM() {
  updateEventsByFilters();
  updateVenueToggles();
  updateFilterIndicator();
  updateFiltersCount();
}

async function updateEventsByFilters() {
  document.querySelectorAll(`.${DOM_CLASSES.EVENTBOX}`).forEach(eventBox => {
    const eventId = eventBox.dataset.id;
    const event = state.events.find(e => e.id === eventId);
    
    console.assert(event, `Event with id ${eventId} not found`);

    const venueEnabled = state.sourceFilters[event.venue];
    const tagEnabled = state.categoryFilters[event.tag];

    const district = event.district;
    if (district === "Anywhere Else") district = UNKNOWN_COPENHAGEN_DISTRICT;
    const districtEnabled = state.districtFilters[district];

    // Show event only if both venue and tag filters are enabled
    eventBox.style.display = venueEnabled && tagEnabled && districtEnabled ? 'flex' : 'none';
  });

  // Hide empty date dividers
  document.querySelectorAll('.event-day-divider').forEach(divider => {
    const hasVisibleEvents = Array.from(divider.querySelectorAll(`.${DOM_CLASSES.EVENTBOX}`))
      .some(event => event.style.display !== 'none');
    divider.style.display = hasVisibleEvents ? 'block' : 'none';
  });

  // Show "no events" message if no events are visible
  const hasVisibleEvents = Array.from(document.querySelectorAll(`.${DOM_CLASSES.EVENTBOX}`))
    .some(event => event.style.display !== 'none');
  document.getElementById('noEvents').style.display = hasVisibleEvents ? 'none' : 'block';
}

async function updateVenueToggles() {
  document.querySelectorAll('.venue-toggle input[type="checkbox"]').forEach(checkbox => {
    const venue = checkbox.dataset.venue;
    checkbox.checked = state.sourceFilters[venue];
  });
}


/*
* If the user has set filters, we show them a little red dot on the gear icon.
* Ideally this would allow them to notice that they have filters active.
*/
function updateFilterIndicator() {
  const infoButton = document.getElementById(DOM_IDS.INFO_BUTTON);
  if (infoButton) {
    const enabledVenueCount = Object.values(state.sourceFilters).filter(enabled => enabled).length;
    const availableVenues = Object.keys(ALL_COPENHAGEN_SOURCES).length;
    const enabledTagCount = Object.values(state.categoryFilters).filter(enabled => enabled).length;
    const enabledDistrictCount = Object.values(state.districtFilters).filter(enabled => enabled).length;
    const hasDisabledDistrict = Object.values(state.districtFilters).some(enabled => !enabled);
    const hasActiveFilters = enabledVenueCount < availableVenues || 
                            enabledTagCount < ALL_EVENT_CATEGORIES.length ||
                            enabledDistrictCount < ALL_COPENHAGEN_DISTRICTS.length ||
                            hasDisabledDistrict;
    infoButton.classList.toggle('has-filters', hasActiveFilters);
  }
}
function updateFiltersCount() {
  // Update Districts count
  const totalDistricts = Object.keys(state.districtFilters).length;
  const enabledDistricts = Object.values(state.districtFilters).filter(Boolean).length;
  const districtHeader = document.getElementById('districtsHeader');
  if (districtHeader) {
    districtHeader.textContent = `DISTRICTS (${String(enabledDistricts).padStart(2, '0')}/${String(totalDistricts).padStart(2, '0')})`;
  }

  // Update Categories count
  const totalCategories = ALL_EVENT_CATEGORIES.length;
  const enabledCategories = Object.values(state.categoryFilters).filter(Boolean).length;
  const categoryHeader = document.getElementById('categoriesHeader');
  if (categoryHeader) {
    categoryHeader.textContent = `CATEGORIES (${String(enabledCategories).padStart(2, '0')}/${String(totalCategories).padStart(2, '0')})`;
  }

  // Update Sources count
  const totalSources = Object.keys(ALL_COPENHAGEN_SOURCES).length;
  const enabledSources = Object.values(state.sourceFilters).filter(Boolean).length;
  const sourceHeader = document.getElementById('sourcesHeader');
  if (sourceHeader) {
    sourceHeader.textContent = `SOURCES (${String(enabledSources).padStart(2, '0')}/${String(totalSources).padStart(2, '0')})`;
  }
}

export function toggleLoadingSpinner(show) {
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
      spinner.style.display = show ? 'block' : 'none';
  }
}