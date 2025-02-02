import { state } from './state.js';
import { STORAGE_KEYS, DOM_IDS, EVENT_TAGS } from './constants.js';

/*
* Users can set which venues and tags they want to see.
* Data structure is simple: venue/tag is the key, boolean is the value.
* Stored in localStorage under filters key.
*/
function saveFilters() {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify({
      [STORAGE_KEYS.PAGE_FILTERS]: state.pageFilters,
      [STORAGE_KEYS.TAG_FILTERS]: Array.from(state.tagFilters)
    }));
    updateFilterIndicator();
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
}

export async function loadVenuePreferences() {
  /*
  * First we load all of the possible venues from a JSON file.
  */
  const response = await fetch('data/uniqueVenues.json');
  const venues = await response.json();
  state.venues = venues;

  const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
  
  if (!saved) {
    enableAllVenues();
    state.tagFilters = new Set(EVENT_TAGS);
    return;
  }

  const filters = JSON.parse(saved);
  state.pageFilters = filters[STORAGE_KEYS.PAGE_FILTERS] || {};
  state.tagFilters = new Set(filters[STORAGE_KEYS.TAG_FILTERS] || EVENT_TAGS);
  updateFilterIndicator();
}

/*
* If the user has set filters, we show them a little red dot on the gear icon.
* Ideally this would allow them to see they have filters active.
*/
function updateFilterIndicator() {
  const infoButton = document.getElementById(DOM_IDS.INFO_BUTTON);
  if (infoButton) {
    const enabledCount = Object.values(state.pageFilters).filter(enabled => enabled).length;
    const available = Object.keys(state.venues).length;
    infoButton.classList.toggle('has-filters', enabledCount < available);
  }
}

export function setVenueEnabled(venue, enabled) {
  state.pageFilters[venue] = enabled;
  saveFilters();
}

export function enableAllVenues() {
  state.pageFilters = Object.keys(state.venues).reduce((acc, venue) => {
    acc[venue] = true;
    return acc;
  }, {});
  saveFilters();
}

export function disableAllVenues() {
  state.pageFilters = Object.keys(state.venues).reduce((acc, venue) => {
    acc[venue] = false;
    return acc;
  }, {});
  saveFilters();
}

export function setTagEnabled(tag, enabled) {
  if (enabled) state.tagFilters.add(tag);
  else state.tagFilters.delete(tag);
  saveFilters();
}

export function enableAllTags() {
  state.tagFilters = new Set(EVENT_TAGS);
  saveFilters();
}

export function disableAllTags() {
  state.tagFilters.clear();
  saveFilters();
}