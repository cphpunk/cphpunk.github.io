import { renderSite } from './render.js';
import { setVenueEnabled, enableAllVenues, disableAllVenues } from './filters.js';

/*
* This module handles all user interactions with the UI elements.
* Primary responsibilities are:
* 1. Modal interactions (open/close/scroll behavior)
* 2. Venue filter interactions (toggle individual venues, enable/disable all)
*/

export function registerInteractions() {
  registerInfoModalInteraction();
  registerVenueFiltersInteraction();
}

function registerInfoModalInteraction() {
  const infoButton = document.getElementById('infoButton');
  const infoModal  = document.getElementById('infoModal');

  console.assert(infoButton, 'Info button not found');
  console.assert(infoModal, 'Info modal not found');

  const infoCloseButton = infoModal.querySelector('.close');
  const infoModalContent = infoModal.querySelector('.modal-content');

  infoButton.addEventListener('click', () => {
    infoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  if (infoCloseButton) {
    infoCloseButton.addEventListener('click', () => {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Close modal when clicking outside content area
  window.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  /*
  * iOS has special handling requirements for touch events and modals.
  * These handlers prevent unwanted behaviors on iOS devices.
  */
  infoModal.addEventListener('touchend', (event) => {
    if (event.target === infoModal) {
      event.preventDefault();
      event.stopPropagation();
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }, { passive: false });

  // Prevent page scroll when scrolling modal content on iOS
  if (infoModalContent) {
    infoModalContent.addEventListener('touchmove', function (event) {
      event.stopPropagation();
    }, { passive: false });
  }
}

/*
* Sets up all event listeners for venue filtering functionality.
* This includes individual venue toggles and the enable/disable all buttons.
*/
function registerVenueFiltersInteraction() {
  const container = document.getElementById('venueList');

  console.assert(container, "venueList not found");

  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      const venue = input.parentElement.previousElementSibling.querySelector('a').textContent.trim();
      onVenueToggleClick(venue, input.checked);
    });
  });

  document.querySelectorAll('#enableAllVenues').forEach(button => {
    button.addEventListener('click', onEnableAllClick);
  });

  document.querySelectorAll('#disableAllVenues').forEach(button => {
    button.addEventListener('click', onDisableAllClick);
  });
}

/*
* Handles toggling individual venue visibility.
* Updates both the state and triggers a UI refresh.
*/
function onVenueToggleClick(venue, enabled) {
  setVenueEnabled(venue, enabled);
  refresh();
}

/*
* Enables all venues in the filter.
* Updates both the state and all checkbox UI elements.
*/
function onEnableAllClick() {
  enableAllVenues();
  refresh();
}

/*
* Disables all venues in the filter.
* Updates both the state and all checkbox UI elements.
*/
function onDisableAllClick() {
  disableAllVenues();
  refresh();
}

/*
* Saves the current filter state and refreshes the event display.
* Called after any filter changes to persist preferences and update UI.
*/
function refresh() {
  renderSite();
}