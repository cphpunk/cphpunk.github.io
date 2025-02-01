import { loadEvents } from './api.js';
import { loadVenuePreferences } from './filters.js';
import { renderSite } from './render.js';
import { state } from './state.js';
import { registerInteractions } from './interaction.js';
import { populateVenueFilters } from './constructor.js';

document.addEventListener('DOMContentLoaded', async () => {
  state.events = await loadEvents();
  await loadVenuePreferences();
  
  populateVenueFilters();
  renderSite();
  registerInteractions();
});