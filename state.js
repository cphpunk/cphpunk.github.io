/**
 * @fileoverview Holds current state (events, filters, date)
 * @description Meant to hold only data! Ideally no functionality should be in here.
 * @author Mattia
 */

/*
* Events for the time window, ready to be displayed // loader.js
*/
let allEvents = [];

/*
* Dictionary, where key : tag name, value : enabled // filters.js
*/
let categoryFilters = {}

/*
* Dictionary, where key : source name, value : enabled // filters.js
*/
let sourceFilters = {};

/*
* Dictionary, where key : district name, value : enabled // filters.js
*/
let districtsFilter = {};

/*
* The site shows events from Today to Seven days from now.
*/
let today = Object.freeze(moment().startOf('day'));
let sevenDaysOut = Object.freeze(moment().endOf('day').add(1, 'week'));


export const state = {
  get events() { return allEvents },
  set events(events) { allEvents = events },

  get categoryFilters() { return categoryFilters },
  get sourceFilters() { return sourceFilters },
  get districtFilters() { return districtsFilter },

  set categoryFilters(filters) { categoryFilters = filters },
  set sourceFilters(filters) { sourceFilters = filters },
  set districtFilters(districts) { districtsFilter = districts },

  get timeWindowStart() { return today },
  get timeWindowEnd() { return sevenDaysOut }
};