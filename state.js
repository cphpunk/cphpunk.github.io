import { EVENT_TAGS } from './constants.js';

let allEvents = [];
let activeTagFilters = new Set(EVENT_TAGS);
let activePageFilters = {};
let venues = {};

/*
* The site shows events from Today to Seven days from now.
*/
let today = moment().startOf('day');
let sevenDaysOut = moment().endOf('day').add(1, 'week');

Object.freeze(today);
Object.freeze(sevenDaysOut);

export const state = {
  get events() { return allEvents },
  set events(events) { allEvents = events },

  get tagFilters() { return activeTagFilters },
  set tagFilters(filters) { activeTagFilters = new Set(filters) },

  get pageFilters() { return activePageFilters },
  set pageFilters(filters) { activePageFilters = filters },

  get venues() { return venues },
  set venues(v) { venues = v },

  get windowStart() { return today },
  get windowEnd() { return sevenDaysOut }
};