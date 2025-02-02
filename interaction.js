import { renderSite } from './render.js';
import { setVenueEnabled, enableAllVenues, disableAllVenues, setTagEnabled, enableAllTags, disableAllTags } from './filters.js';
import { DOM_IDS, DOM_CLASSES } from './constants.js';

/*
* This module handles all user interactions with the UI elements.
* Primary responsibilities are:
* 1. Modal interactions (open/close/scroll behavior)
* 2. Venue filter interactions (toggle individual venues, enable/disable all)
* 3. Tag filter interactions (toggle individual tags, enable/disable all)
*/

export function registerInteractions() {
  registerInfoModalInteraction();
  registerFiltersInteraction();
}

function registerInfoModalInteraction() {
  const infoButton = document.getElementById(DOM_IDS.INFO_BUTTON);
  const infoModal = document.getElementById(DOM_IDS.INFO_MODAL);

  console.assert(infoButton, 'Info button not found');
  console.assert(infoModal, 'Info modal not found');

  const infoCloseButton = infoModal.querySelector(`.${DOM_CLASSES.MODAL_CLOSE}`);
  const infoModalContent = infoModal.querySelector(`.${DOM_CLASSES.MODAL_CONTENT}`);

  infoButton.addEventListener('click', () => {
    infoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  });

  if (infoCloseButton) {
    infoCloseButton.addEventListener('click', () => {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    });
  }

  // Close modal when clicking outside content area
  window.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
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
      document.body.classList.remove('modal-open');
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
* Sets up all event listeners for venue and tag filtering functionality.
* This includes individual venue toggles, tag toggles and their respective enable/disable all buttons.
*/
function registerFiltersInteraction() {
  const container = document.getElementById(DOM_IDS.VENUE_LIST);

  console.assert(container, "venueList not found");

  container.querySelectorAll('input[data-venue]').forEach(input => {
    input.addEventListener('change', () => {
      onVenueToggleClick(input.dataset.venue, input.checked);
    });
  });

  // Handle both venue and tag controls
  document.querySelectorAll('.filter-controls .control-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const section = e.target.closest('.filter-section');
      if (section.querySelector('#tagList')) {
        // Handle tag controls
        if (e.target.classList.contains('enable')) {
          enableAllTags();
          document.querySelectorAll('.tag-filter').forEach(t => t.classList.add('active'));
        } else {
          disableAllTags();
          document.querySelectorAll('.tag-filter').forEach(t => t.classList.remove('active'));
        }
      } else {
        // Handle venue controls
        if (e.target.classList.contains('enable')) {
          enableAllVenues();
        } else {
          disableAllVenues();
        }
      }
      refresh();
    });
  });

  // Tag filter interactions
  document.querySelectorAll('.tag-filter').forEach(button => {
    button.addEventListener('click', (e) => {
      const tag = e.target.dataset.tag;
      const isActive = e.target.classList.contains('active');
      setTagEnabled(tag, !isActive);
      e.target.classList.toggle('active');
      refresh();
    });
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