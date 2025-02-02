import { loadEvents } from './api.js';
import { loadVenuePreferences } from './filters.js';
import { renderSite } from './render.js';
import { registerInteractions } from './interaction.js';
import { generateHTML } from './constructor.js';
import { toggleLoadingSpinner } from './ux.js';

document.addEventListener('DOMContentLoaded', async () => {
  toggleLoadingSpinner(true);

  await loadEvents();
  await loadVenuePreferences();
  
  generateHTML();
  renderSite();
  registerInteractions();

  toggleLoadingSpinner(false);
});