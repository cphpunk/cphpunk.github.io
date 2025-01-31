import { loadEvents } from './api.js';
import { loadVenuePreferences, populateVenueList } from './filters.js';
import { displayEvents } from './render.js';
import { state } from './state.js';
import { registerInteractions } from './interaction.js';

document.addEventListener('DOMContentLoaded', async () => {
  state.events = await loadEvents();
  loadVenuePreferences();
  populateVenueList();
  displayEvents();
  registerInteractions();
});