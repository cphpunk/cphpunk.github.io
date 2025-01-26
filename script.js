/**
 * --- CONSTANTS & GLOBALS ---
 */
const EVENT_TAGS = [
  "MUSIC", "MOVIE", "ACTIVISM", "COMMUNITY", "THEATRE", "CULTURE", 
  "LGBTQ+", "YOGA", "SPORTS", "ART", "COMEDY", "SHOPPING", "GAMES", "QUIZ"
];

const TAG_EMOJIS = {
  "MUSIC": "🎵",
  "MOVIE": "🎬",
  "ACTIVISM": "✊",
  "COMMUNITY": "🤝",
  "THEATRE": "🎭",
  "CULTURE": "🏛️",
  "LGBTQ+": "🏳️‍🌈",
  "YOGA": "🧘",
  "SPORTS": "⚽",
  "ART": "🎨",
  "COMEDY": "😂",
  "SHOPPING": "🛍️",
  "GAMES": "🎮",
  "QUIZ": "🧠"
};

/** Holds all loaded events (both current and next week). */
let allEvents = [];

/** Tag filters: by default select all tags. */
let activeTagFilters = new Set(EVENT_TAGS);

/**
 * Page name filters: by default we either select all (once data is loaded),
 * or you can define a subset you want. We'll fill this set in populatePageList().
 */
let activePageFilters = new Set();

// Add these new functions for managing venue preferences
function saveVenuePreferences() {
    localStorage.setItem('activeVenues', JSON.stringify(Array.from(activePageFilters)));
    updateFilterIndicator(); 
}

function loadVenuePreferences() {
  const savedVenues = localStorage.getItem('activeVenues');
  if (savedVenues) {
      activePageFilters = new Set(JSON.parse(savedVenues));
      updateFilterIndicator(); 
  }
}

function updateFilterIndicator() {
    const infoButton = document.getElementById('infoButton');
    if (!infoButton) return;
    
    // Get all unique venues from current events
    const availableVenues = new Set(allEvents.map(e => e.pageName).filter(Boolean));
    
    // Check if all available venues are enabled (default state)
    // A filter is active if we have fewer venues enabled than are available
    const hasActiveFilters = activePageFilters.size < availableVenues.size;
    
    // Toggle the class based on whether we have any filters
    infoButton.classList.toggle('has-filters', hasActiveFilters);
}

/** Tracks which week the user is viewing. */
let currentWeekStart = moment(); //.startOf('week'); We now start the week from today

/**
 * --- LOADING & FETCHING ---
 */
async function fetchWeekEvents(weekStart) {
  const weekNumber = weekStart.format('WW').padStart(2, '0');
  const year = weekStart.format('YYYY');
  const fileName = `${year}-W${weekNumber}.json`; 

  try {
    const response = await fetch(fileName);
    if (!response.ok) {
      // e.g. if 404, return empty
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

async function loadAllEvents() {
  showLoadingSpinner();

  // Load current + next week
  const currentWeekEvents = await fetchWeekEvents(moment());
  const nextWeekEvents = await fetchWeekEvents(moment().add(1, 'week'));
  
  // Track summaries by date to detect duplicates
  const seenSummariesByDate = new Map(); // date string -> Set of summaries

  // Normalize and filter duplicates
  allEvents = [...currentWeekEvents, ...nextWeekEvents]
    .map(event => {
      const eventDate = moment.unix(event.date.start_timestamp).format('YYYY-MM-DD');
      const summary = event.name;

      // Initialize set for this date if it doesn't exist
      if (!seenSummariesByDate.has(eventDate)) {
        seenSummariesByDate.set(eventDate, new Set());
      }

      // Check if any existing summary contains this one
      const dateSet = seenSummariesByDate.get(eventDate);
      const isDuplicate = Array.from(dateSet).some(existingSummary => 
        existingSummary.toLowerCase().includes(summary.toLowerCase()) || 
        summary.toLowerCase().includes(existingSummary.toLowerCase())
      );

      if (isDuplicate) {
        return null; // Skip this event
      }

      // Add this summary to the set
      dateSet.add(summary);

      return {
        summary: summary,
        description: event.description,
        start: moment.unix(event.date.start_timestamp).toDate(),
        end: moment.unix(event.date.end_timestamp).toDate(),
        url: event.url,
        location: event.location?.name || '',
        imageUrl: event.image_url,
        platform: event.platform,
        pageName: event.page_name,
        venueUrl: event.page_url,
        tag: event.tag
      };
    })
    .filter(event => event !== null); // Remove the nulled duplicates

  // Initialize activePageFilters with all unique page names if it's empty
  if (activePageFilters.size === 0) {
    const uniquePages = new Set(allEvents.map(e => e.pageName).filter(Boolean));
    uniquePages.forEach(pageName => activePageFilters.add(pageName));
  }

  hideLoadingSpinner();
  showInfoButton();
  createWeekNavigation();
}

/**
 * --- WEEK NAVIGATION ---
 */
function createWeekNavigation() {
  const weekNavigation = document.getElementById('weekNavigation');
  if (!weekNavigation) return;

  weekNavigation.innerHTML = `
    <button id="prevWeek" class="week-button">←</button>
    <span id="weekDisplay" class="week-display"></span>
    <button id="nextWeek" class="week-button">→</button>
  `;

  // Listeners
  document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeekStart.subtract(1, 'week');
    displayEvents();
  });

  document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeekStart.add(1, 'week');
    displayEvents();
  });

  weekNavigation.style.display = 'flex';
  weekNavigation.style.display = 'none';
}

function updateWeekNavigation() {
  const prevWeekBtn = document.getElementById('prevWeek');
  const nextWeekBtn = document.getElementById('nextWeek');
  const weekDisplay = document.getElementById('weekDisplay');

  // If it's already the current real-world week, disable "previous" button
  if (prevWeekBtn) {
    prevWeekBtn.disabled = currentWeekStart.isSame(moment().startOf('week'));
  }

  // Check if next week has any events
  const nextWeekStart = moment(currentWeekStart).add(1, 'week').startOf('week');
  const nextWeekEnd = moment(nextWeekStart).endOf('week');

  const hasNextWeekEvents = allEvents.some(event =>
    moment(event.start).isBetween(nextWeekStart, nextWeekEnd, null, '[]') &&
    //activePageFilters.has(event.pageName) &&
    activeTagFilters.has(event.tag)
  );

  if (nextWeekBtn) {
    nextWeekBtn.disabled = !hasNextWeekEvents;
  }

  if (weekDisplay) {
    weekDisplay.textContent = `
      ${currentWeekStart.format('MMMM D')} 
      - 
      ${moment(currentWeekStart).endOf('week').format('MMMM D, YYYY')}
    `;
  }
}

/**
 * --- RENDER & DISPLAY EVENTS ---
 */
function displayEvents() {
  const eventList = document.getElementById('eventList');
  if (!eventList) return;
  eventList.innerHTML = '';

  // If currently the real-world week, start from today; otherwise from Monday
  //const isCurrentRealWeek = currentWeekStart.isSame(moment().startOf('week'));
  const eventStartFilter = moment(); // isCurrentRealWeek ? moment().startOf('day') : currentWeekStart;
  const weekEnd = moment().add(1, 'week'); // moment(currentWeekStart).endOf('week');

  // Use a Set to prevent duplicates
  const filteredSummaries = new Set();

  // Filter events by date, by pageName, by tag
  const eventsThisWeek = allEvents.filter(event => {
    if (filteredSummaries.has(event.summary)) return false;

    const isValidDate = moment(event.start).isBetween(eventStartFilter, weekEnd, null, '[]');
    const isValidPage = activePageFilters.has(event.pageName);
    const isValidTag  = activeTagFilters.has(event.tag);

    if (isValidDate && isValidPage && isValidTag) {
      filteredSummaries.add(event.summary);
      return true;
    }
    return false;
  });

  // Sort by start
  eventsThisWeek.sort((a, b) => a.start - b.start);

  // Group by day
  const groupedEvents = eventsThisWeek.reduce((groups, event) => {
    const dayKey = moment(event.start).format('MMMM D, YYYY');
    groups[dayKey] = groups[dayKey] || [];
    groups[dayKey].push(event);
    return groups;
  }, {});

  // Render
  Object.entries(groupedEvents).forEach(([date, events]) => {
    const dateDivider = document.createElement('div');
    dateDivider.className = 'event-day-divider';
    dateDivider.setAttribute('data-date', moment(date).format("dddd, MMMM D"));

    const eventContainer = document.createElement('div');
    eventContainer.className = 'event-day-container';

    dateDivider.appendChild(eventContainer);
    eventList.appendChild(dateDivider);

     //${moment(event.start).format('MMMM D, YYYY - h:mm A')}
    events.forEach(event => {
      const eventBox = document.createElement('div');
      eventBox.className = 'event-box';
      eventBox.innerHTML = `
        <img
          src="${event.imageUrl || '/api/placeholder/300/200'}"
          loading="lazy"
          alt="${event.summary}"
          class="event-image"
        />
        <div class="event-tag" data-tag="${event.tag}">${event.tag}</div>
        <div class="event-details">
          <div class="event-title">${event.summary}</div>
          <div class="event-date">
            📆 ${moment(event.start).format('h:mm A')}
          </div>
          <div class="event-location">
            📍 ${event.pageName || 'Not specified'}
          </div>
          <br>
        </div>
      `;

      // Modal on click
      eventBox.addEventListener('click', (e) => {
        if (!e.target.closest('.event-link')) {
          showEventDetails(event);
        }
      });

      eventContainer.appendChild(eventBox);
    });
  });

  updateWeekNavigation();
}

/**
 * --- PAGE-NAME FILTER LIST ---
 */
function populatePageList() {
  const pageList = document.getElementById('venueList');
  if (!pageList) return;
  
  // Clear existing content 
  pageList.innerHTML = '';

  // First, add the venue controls at the top
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'venueControls';
  controlsDiv.style.marginBottom = '20px';  // Add some space below the controls
  controlsDiv.innerHTML = `
      <button id="enableAllVenues">Enable All</button>
      <button id="disableAllVenues">Disable All</button>
  `;
  pageList.appendChild(controlsDiv);

  // Add the heading after the controls
  const heading = document.createElement('h3');
  heading.textContent = 'Venues';
  pageList.appendChild(heading);

  // Get unique page names and sort them
  const uniquePages = new Set(allEvents.map(e => e.pageName).filter(Boolean));
  const sortedPages = Array.from(uniquePages).sort();

  // If no venues are selected yet, select all of them
  if (activePageFilters.size === 0) {
      sortedPages.forEach(pageName => activePageFilters.add(pageName));
  }

  // Create venue items
  sortedPages.forEach(pageName => {
      const item = document.createElement('div');
      item.className = 'venue-item';

      const venueUrl = allEvents.find(event => event.pageName === pageName)?.venueUrl || '#';
      
      item.innerHTML = `
          <div class="venue-info">
              <a href="${venueUrl}" target="_blank">${pageName}</a>
          </div>
          <label class="venue-toggle">
              <input type="checkbox" name="${pageName}" ${activePageFilters.has(pageName) ? 'checked' : ''}>
              <span class="slider"></span>
          </label>
      `;

      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            activePageFilters.add(pageName);
        } else {
            activePageFilters.delete(pageName);
        }
        saveVenuePreferences();
        displayEvents();
    });
    

      pageList.appendChild(item);
  });

  // Setup venue control buttons
  const enableAllBtn = document.getElementById('enableAllVenues');
  const disableAllBtn = document.getElementById('disableAllVenues');
  
  if (enableAllBtn) {
      enableAllBtn.addEventListener('click', () => {
          sortedPages.forEach(pageName => activePageFilters.add(pageName));
          const checkboxes = pageList.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(cb => cb.checked = true);
          saveVenuePreferences();
          displayEvents();
      });
  }
  
  if (disableAllBtn) {
      disableAllBtn.addEventListener('click', () => {
          activePageFilters.clear();
          const checkboxes = pageList.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(cb => cb.checked = false);
          saveVenuePreferences();
          displayEvents();
      });
  }
}

/**
 * --- MODALS & UTILITIES ---
 */
function showEventDetails(event) {
  // Ensure the URL opens in a new tab if it exists
  if (event.url) {
    window.open(event.url, '_blank');
    return;
  }


  const modal = document.getElementById('eventModal');
  if (!modal) return;

  const modalImage       = document.getElementById('modalImage');
  const modalTitle       = document.getElementById('modalTitle');
  const modalDate        = document.getElementById('modalDate');
  const modalLocation    = document.getElementById('modalLocation');
  const modalDescription = document.getElementById('modalDescription');
  const modalLink        = document.getElementById('modalLink');
  const addToCalendarBtn = document.getElementById('addToCalendar');
  const modalTag         = document.getElementById('modalTag');

  modalImage.src = event.imageUrl || '/api/placeholder/600/300';
  modalImage.alt = event.summary;
  modalTitle.textContent = event.summary;
  modalDate.textContent = `
    ${moment(event.start).format('MMMM D, YYYY - h:mm A')} 
    to 
    ${moment(event.end).format('h:mm A')}
  `;
  modalTag.textContent = event.tag || '';

  if (event.location) {
    modalLocation.innerHTML = `<a href="http://maps.google.com/?q=${event.location}" 
                                 target="_blank">📍 ${event.location}</a>`;
  } else {
    modalLocation.textContent = 'Location not specified';
  }

  // Turn any URLs in the description into clickable links
  const safeDescription = event.description.replace(/(https?:\/\/[^\s]+)/g, (match) => {
    return `<a href="${match}" target="_blank">${match}</a>`;
  });
  modalDescription.innerHTML = safeDescription;

  // If the event has a main URL
  if (event.url) {
    modalLink.href = event.url;
  } else {
    modalLink.removeAttribute('href');
  }

  // "Add to Calendar" functionality
  addToCalendarBtn.onclick = () => addToCalendar(event);

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('eventModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function addToCalendar(event) {
  const startTime = moment(event.start).format('YYYYMMDDTHHmmss');
  const endTime   = moment(event.end).format('YYYYMMDDTHHmmss');

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || '')}&sprop=&sprop=name:&sprop=X-EVENT-TAGS:${event.tag}`;

  const appleCalendarICS = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${event.url}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location || ''}
X-EVENT-TAGS:${event.tag}
END:VEVENT
END:VCALENDAR
  `.trim();

  const appleCalendarUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(appleCalendarICS)}`;

  // Simple modal to show two links
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';

  const content = document.createElement('div');
  content.style.backgroundColor = 'white';
  content.style.padding = '20px';
  content.style.borderRadius = '10px';
  content.innerHTML = `
    <h3>Add to Calendar</h3>
    <p><a href="${googleCalendarUrl}" target="_blank">Add to Google Calendar</a></p>
    <p><a href="${appleCalendarUrl}" download="event.ics">Add to Apple Calendar</a></p>
    <button id="closeCalendarModal">Close</button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById('closeCalendarModal').onclick = (e) => {
    e.stopPropagation();
    document.body.removeChild(modal);
  };
}

function showLoadingSpinner() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'block';
}

function hideLoadingSpinner() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';
}

function showInfoButton() {
  const infoButton = document.getElementById('infoButton');
  if (infoButton) infoButton.style.display = 'block';
}

/**
 * --- REGISTER MISC. EVENTS (BUTTONS, MODALS, ETC.) ---
 */
function registerEvents() {
  // Info Modal
  const infoButton = document.getElementById('infoButton');
  const infoModal  = document.getElementById('infoModal');
  if (infoButton && infoModal) {
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

    // Close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === infoModal) {
        infoModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // iOS fix for outside touch
    infoModal.addEventListener('touchend', (event) => {
      if (event.target === infoModal) {
        event.preventDefault();
        event.stopPropagation();
        infoModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }, { passive: false });

    // Prevent scroll inside the modal content
    if (infoModalContent) {
      infoModalContent.addEventListener('touchmove', function (event) {
        event.stopPropagation();
      }, { passive: false });
    }
  }

  // Event Modal
  const eventModal = document.getElementById('eventModal');
  if (eventModal) {
    const eventCloseBtn = eventModal.querySelector('.close');
    const modalContent  = eventModal.querySelector('.modal-content');

    if (eventCloseBtn) {
      eventCloseBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    eventModal.addEventListener('click', (event) => {
      if (event.target === eventModal) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
      }
    });

    // iOS fix
    eventModal.addEventListener('touchend', (event) => {
      if (event.target === eventModal) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
      }
    }, { passive: false });

    // Prevent scrolling on modal content
    if (modalContent) {
      modalContent.addEventListener('touchmove', function (event) {
        event.stopPropagation();
      }, { passive: false });
    }
  }
}

/**
 * --- MAIN ENTRY POINT ---
 */
document.addEventListener('DOMContentLoaded', async function () {
  await loadAllEvents();
  loadVenuePreferences(); // Load saved venue preferences
  displayEvents();
  createFilterToggles();  // For TAG filtering
  populatePageList();     // For PAGE_NAME filtering
  registerEvents();
});


/**
 * --- TAG FILTERS (unchanged except for references) ---
 */
function createFilterToggles() {
  return;
  const tagFilters = document.getElementById('tagFilters');
  if (!tagFilters) {
    console.error('Tag filters container not found!');
    return;
  }

  tagFilters.innerHTML = '';
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container';
  tagFilters.appendChild(filterContainer);

  // Toggle button
  const filterToggle = document.createElement('button');
  filterToggle.className = 'filter-toggle';
  filterToggle.innerHTML = '<span>WANT FILTERS, KIDDO?</span>';
  filterToggle.style.display = 'none';
  filterToggle.style.margin = '0';
  filterToggle.style.padding = '0';
  filterToggle.addEventListener('click', toggleFilters);
  filterContainer.appendChild(filterToggle);

  // The hidden area for tag buttons
  /*
  const tagFiltersContainer = document.createElement('div');
  tagFiltersContainer.className = 'tag-filters';
  tagFiltersContainer.style.display = 'none';
  filterContainer.appendChild(tagFiltersContainer);*/

  // (Optional) read from cookies:
  // const savedTags = getCookie('activeTags');
  // if (savedTags) {
  //   activeTagFilters = new Set(JSON.parse(savedTags));
  // }

  EVENT_TAGS.forEach(tag => {
    const button = document.createElement('button');
    button.className = 'tag-button';
    button.dataset.tag = tag;
    button.classList.toggle('active', activeTagFilters.has(tag));
    button.style.opacity = '0';
    button.style.transform = 'scale(0)';

    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = TAG_EMOJIS[tag] || '';

    const text = document.createElement('span');
    text.textContent = tag;

    button.appendChild(emoji);
    button.appendChild(text);

    button.addEventListener('click', () => {
      button.classList.toggle('active');
      if (activeTagFilters.has(tag)) {
        activeTagFilters.delete(tag);
      } else {
        activeTagFilters.add(tag);
      }
      button.classList.add('shake');
      setTimeout(() => button.classList.remove('shake'), 1);
      displayEvents();
      saveTags();
    });

    tagFiltersContainer.appendChild(button);
  });
}

function toggleFilters() {
  const filterContainer = document.querySelector('.filter-container');
  if (!filterContainer) return;

  const filterToggle = filterContainer.querySelector('.filter-toggle');
  const tagFiltersContainer = filterContainer.querySelector('.tag-filters');

  filterToggle.remove();
  tagFiltersContainer.style.display = 'flex';

  // Animate in
  const buttons = tagFiltersContainer.querySelectorAll('.tag-button');
  const containerRect = tagFiltersContainer.getBoundingClientRect();
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;

  buttons.forEach((button, index) => {
    button.style.position = 'absolute';
    button.style.left = `${centerX}px`;
    button.style.top = `${centerY}px`;
    setTimeout(() => {
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
      button.style.position = 'relative';
      button.style.left = 'auto';
      button.style.top = 'auto';
      button.classList.add('animate');
    }, index * 50);
  });
}

function saveTags() {
  setCookie('activeTags', JSON.stringify(Array.from(activeTagFilters)), 30);
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}
