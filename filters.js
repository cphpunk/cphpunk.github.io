/**
 * @fileoverview Enables and Disables Districts, Tags and Venue filters.
 * @description Interaction & Render agnostic.
 * Sets filter settings in current state & automatically saves them to localstorage.
 * NB: Tags are called Categories in 
 * @author Mattia
 */

import { 
  state
 } from './state.js';
import { 
  STORAGE_KEYS,
  ALL_EVENT_CATEGORIES, ALL_COPENHAGEN_SOURCES, ALL_COPENHAGEN_DISTRICTS,
  EVENTS_KEYS
 } from './constants.js';

/*
* Users can set which sources, tags and districts they want to see.
* Data structure is simple: source/tag/district is the key, boolean is the value.
* Stored in localStorage under filters key.
*/
function saveFiltersToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify({
      [STORAGE_KEYS.PAGE_FILTERS]: state.sourceFilters,
      [STORAGE_KEYS.TAG_FILTERS]: state.categoryFilters,
      [STORAGE_KEYS.DISTRICT_FILTERS]: state.districtFilters
    }));

    document.dispatchEvent(new Event(EVENTS_KEYS.FILTERS_CHANGED));

  } catch (error) {
    console.error('Failed to save filters:', error);
  }
}

export async function loadVenuePreferences() {
  const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
  
  if (!saved) {
    enableAllSources();
    enableAllCategories();
    enableAllDistricts();
    return;
  }

  const filters = JSON.parse(saved);

  state.sourceFilters = filters[STORAGE_KEYS.PAGE_FILTERS];
  state.categoryFilters = filters[STORAGE_KEYS.TAG_FILTERS];
  state.districtFilters = filters[STORAGE_KEYS.DISTRICT_FILTERS];
}

//===========
// SOURCES
// Sources are the pages events are scraped from.
//===========

export function setSourceEnabled(source, enabled) {
  state.sourceFilters[source] = enabled;
  saveFiltersToLocalStorage();
}

export function enableAllSources() {
  state.sourceFilters = Object.keys(ALL_COPENHAGEN_SOURCES).reduce((acc, venue) => {
    acc[venue] = true;
    return acc;
  }, {});
  saveFiltersToLocalStorage();
}

export function disableAllSources() {
  state.sourceFilters = Object.keys(ALL_COPENHAGEN_SOURCES).reduce((acc, venue) => {
    acc[venue] = false;
    return acc;
  }, {});
  saveFiltersToLocalStorage();
}

//===========
// CATEGORY
// Categories are... categories. Music, Movie, Activism, etc..
//===========

export function setCategoryEnabled(category, enabled) {
  state.categoryFilters[category] = enabled;
  saveFiltersToLocalStorage();
}

export function enableAllCategories() {
  state.categoryFilters = ALL_EVENT_CATEGORIES.reduce((acc, tag) => {
    acc[tag] = true;
    return acc;
  }, {});
  saveFiltersToLocalStorage();
}

export function disableAllCategories() {
  state.categoryFilters = ALL_EVENT_CATEGORIES.reduce((acc, tag) => {
    acc[tag] = false;
    return acc;
  }, {});
  saveFiltersToLocalStorage();
}

//===========
// DISTRICTS
// Districts are the 10 Copenhagen Official District + Frederiskberg + A filter for anywhere else
//===========


export function setDistrictEnabled(district, enabled) {
  state.districtFilters[district] = enabled;
  saveFiltersToLocalStorage();
}

export function enableAllDistricts() {
  state.districtFilters = ALL_COPENHAGEN_DISTRICTS.reduce((acc, district) => {
    acc[district] = true;
    return acc;
  }, {});
  saveFiltersToLocalStorage();
}

export function disableAllDistricts() {
  state.districtFilters = ALL_COPENHAGEN_DISTRICTS.reduce((acc, district) => {
    acc[district] = false;
    return acc;
  }, {});
  saveFiltersToLocalStorage();
}