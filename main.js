import { state } from './state.js';
import { loadEvents } from './loader.js';
import { loadVenuePreferences } from './filters.js';
import { initializeDOMRenderer, toggleLoadingSpinner } from './render.js';
import { registerInteractions } from './interaction.js';
import { generateHTML } from './constructor.js';

document.addEventListener('DOMContentLoaded', async () => {
  toggleLoadingSpinner(true);

  state.events = await loadEvents(state.timeWindowStart, state.timeWindowEnd);

  await loadVenuePreferences();
  await generateHTML();
  
  initializeDOMRenderer();
  registerInteractions();

  toggleLoadingSpinner(false);
});