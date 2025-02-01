import { state } from './state.js';

/*
* Users can set which venues they want to see.
* Data structure is simple: venue is the key, boolean is the value.
* Stored in localStorage under pageFilters key.
*/
export function saveVenuePreferences() {
  try {
    localStorage.setItem('filters', JSON.stringify({ pageFilters: state.pageFilters }));
    updateFilterIndicator();
  } catch (error) {
    console.error('Failed to save venue preferences:', error);
  }
}

export async function loadVenuePreferences() {
  /*
  * First we load all of the possible venues from a JSON file.
  */
  const response = await fetch('data/uniqueVenues.json');
  const venues = await response.json();
  state.venues = venues;

  const saved = localStorage.getItem('filters');
  
  if (!saved) {
    enableAllVenues();
    return;
  };

  const filters = JSON.parse(saved);
  state.pageFilters = filters.pageFilters || {};
  updateFilterIndicator();
}

/*
* If the user has set filters, we show them a little red dot on the gear icon.
* Ideally this would allow them to see they have filters active.
*/
function updateFilterIndicator() {
  const infoButton = document.getElementById('infoButton');
  if (infoButton) {
    const enabledCount = Object.values(state.pageFilters).filter(enabled => enabled).length;
    const available = Object.keys(state.venues).length;
    infoButton.classList.toggle('has-filters', enabledCount < available);
  }
}
export function setVenueEnabled(venue, enabled) {
  state.pageFilters[venue] = enabled;
  saveVenuePreferences();
}

export function enableAllVenues() {
  state.pageFilters = Object.keys(state.venues).reduce((acc, venue) => {
    acc[venue] = true;
    return acc;
  }, {});
  saveVenuePreferences();
}

export function disableAllVenues() {
  state.pageFilters = Object.keys(state.venues).reduce((acc, venue) => {
    acc[venue] = false;
    return acc;
  }, {});
  saveVenuePreferences();
}