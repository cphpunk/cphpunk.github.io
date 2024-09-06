const icsFiles = 
{
  "KraftWerket.ics": {
    "url": "https://kraftwerket.kk.dk/en/events",
    "type": "KK"
  },
  "Kulturhuset Islands Brygge.ics": {
    "url": "https://kulturhusetislandsbrygge.kk.dk/koncerter",
    "type": "KK"
  },
  "Mayhem.ics": {
    "url": "https://mayhemkbh.dk",
    "type": "Custom"
  },
  "Spillestedet Stengade.ics": {
    "url": "https://www.facebook.com/spillestedetstengade/events",
    "type": "Facebook"
  },
  "HUSET.ics": {
    "url": "https://huset.kk.dk/en/events",
    "type": "KK"
  },
  "Villa Kultur.ics": {
    "url": "https://www.facebook.com/villakultur/events",
    "type": "Facebook"
  },
  "R\u00e5huset.ics": {
    "url": "https://www.facebook.com/Raahuset/events",
    "type": "Facebook"
  },
  "Mayhem KBH.ics": {
    "url": "https://www.facebook.com/mayhemkbh/events",
    "type": "Facebook"
  },
  "ALICE cph.ics": {
    "url": "https://www.facebook.com/alicecphcom/events",
    "type": "Facebook"
  },
  "Musik Loppen.ics": {
    "url": "https://www.facebook.com/musikloppen/events",
    "type": "Facebook"
  },
  "KoncertKirken.ics": {
    "url": "https://www.facebook.com/koncertkirken/events",
    "type": "Facebook"
  },
  "RUST.ics": {
    "url": "https://www.facebook.com/RUSTkbh/events",
    "type": "Facebook"
  },
  "Pumpehuset.ics": {
    "url": "https://www.facebook.com/Pumpehuset/events/",
    "type": "Facebook"
  },
  "HUSET  (Huset i Magstr\u00e6de).ics": {
    "url": "https://www.facebook.com/Huset.Koebenhavn/events",
    "type": "Facebook"
  },
  "Basement CPH.ics": {
    "url": "https://www.facebook.com/BasementKBH/events",
    "type": "Facebook"
  },
  "VEGA.ics": {
    "url": "https://www.facebook.com/VEGAcph/events",
    "type": "Facebook"
  },
  "Operaen Christiania.ics": {
    "url": "https://www.facebook.com/operaenscafe/events",
    "type": "Facebook"
  },
  "Punks Undead.ics": {
    "url": "https://www.facebook.com/PunksUndeadCPH/events",
    "type": "Facebook"
  },
  "Ungdomshuset.ics": {
    "url": "https://www.facebook.com/UngdomshusetD61/events",
    "type": "Facebook"
  },
  "Radar.ics": {
    "url": "https://www.facebook.com/radarlive/events",
    "type": "Facebook"
  },
  "DROP INN.ics": {
    "url": "https://www.facebook.com/dropinnmusic/events",
    "type": "Facebook"
  },
  "Haven CPH.ics": {
    "url": "https://www.facebook.com/havencph/events",
    "type": "Facebook"
  },
  "Hangaren.ics": {
    "url": "https://www.facebook.com/HangarenCopenhagen/events",
    "type": "Facebook"
  },
  "Hotel Cecil.ics": {
    "url": "https://www.facebook.com/hotelcecilcph/events",
    "type": "Facebook"
  },
  "Ukirke.ics": {
    "url": "https://www.facebook.com/uKirke/events",
    "type": "Facebook"
  },
  "BETA2300.ics": {
    "url": "https://www.facebook.com/beta2300/events",
    "type": "Facebook"
  },
  "Amager Bio.ics": {
    "url": "https://www.facebook.com/amagerbio/events",
    "type": "Facebook"
  },
  "Polychrome.ics": {
    "url": "https://www.facebook.com/profile.php?id=100057501157471&sk=events",
    "type": "Facebook"
  },
  "LiteraturHaus.ics": {
    "url": "https://www.facebook.com/literaturhauskbh/events",
    "type": "Facebook"
  },
  "Lygtens Kro.ics": {
    "url": "https://www.facebook.com/lygtenskro/events",
    "type": "Facebook"
  }
}

let allEvents = [];
let currentWeekStart = moment().startOf('week');

let activeFilters = new Set(Object.keys(icsFiles));

async function fetchICSFile(url) {
  const response = await fetch(url);
  const data = await response.text();
  return data;
}

function parseICSData(icsData, source) {
  const jcalData = ICAL.parse(icsData);
  const comp = new ICAL.Component(jcalData);
  return comp.getAllSubcomponents('vevent').map(vevent => {
    const event = new ICAL.Event(vevent);
    return {
      summary: event.summary,
      description: event.description,
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
      url: vevent.getFirstPropertyValue('url'),
      location: event.location,
      imageUrl: vevent.getFirstPropertyValue('x-cover-image-url'),
      source: source,
      venueUrl: icsFiles[source].url,
      venueType: icsFiles[source].type
    };
  });
}

async function loadAllEvents() {
  const promises = Object.entries(icsFiles).map(([file, info]) => {
    return fetchICSFile(file).then(icsData => parseICSData(icsData, file));
  });
  const events = await Promise.all(promises);
  allEvents = events.flat();
  displayEvents();
}

function displayEvents() {
  const eventList = document.getElementById('eventList');
  eventList.innerHTML = '';

  let eventStartFilter = (currentWeekStart.isSame(moment().startOf('week'))) ? moment().startOf('day') : currentWeekStart;

  const weekEnd = moment(currentWeekStart).endOf('week');

  const filteredSummaries = new Set();

  const eventsThisWeek = allEvents.filter(event => {
    if (filteredSummaries.has(event.summary)) return false;

    const isValidDate = moment(event.start).isBetween(eventStartFilter, weekEnd, null, '[]');
    const isValidSource = activeFilters.has(event.source);

    if (isValidDate && isValidSource) {
      filteredSummaries.add(event.summary);
    }

    return isValidDate && isValidSource;
  });

  eventsThisWeek.sort((a, b) => a.start - b.start);

  const groupedEvents = eventsThisWeek.reduce((groups, event) => {
    const date = moment(event.start).format('MMMM D, YYYY');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  for (const [date, events] of Object.entries(groupedEvents)) {
    const dateDivider = document.createElement('div');
    dateDivider.className = 'event-day-divider';
    dateDivider.setAttribute('data-date', date);
    eventList.appendChild(dateDivider);

    const eventContainer = document.createElement('div');
    eventContainer.className = 'event-day-container';
    dateDivider.appendChild(eventContainer);

    events.forEach(event => {
      const eventBox = document.createElement('div');
      eventBox.className = 'event-box';
      eventBox.innerHTML = `  
                <img src="${event.imageUrl || '/api/placeholder/300/200'}" loading="lazy" alt="${event.summary}" class="event-image">
                <button class="add-to-calendar" title="Add to Calendar">📅</button>
                <div class="event-details">
                    <div class="event-title">${event.summary}</div>
                    <div class="event-date">${moment(event.start).format('MMMM D, YYYY - h:mm A')}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-actions">
                        <span class="view-details">View Details</span>
                        <a href="${event.url}" target="_blank" class="event-link">Original Page</a>
                    </div>
                </div>
            `;
      eventContainer.appendChild(eventBox);

      eventBox.querySelector('.view-details').addEventListener('click', () => showEventDetails(event));
      eventBox.querySelector('.add-to-calendar').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        addToCalendar(event);
      });
    });
  }

  updateWeekNavigation();
}

function showEventDetails(event) {
  const addToCalendarBtns = document.querySelectorAll('.add-to-calendar');
  addToCalendarBtns.forEach(btn => btn.style.display = 'none');

  const modal = document.getElementById('eventModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalLocation = document.getElementById('modalLocation');
  const modalDescription = document.getElementById('modalDescription');
  const modalLink = document.getElementById('modalLink');
  const addToCalendarBtn = document.getElementById('addToCalendar');

  modalImage.src = event.imageUrl || '/api/placeholder/600/300';
  modalImage.alt = event.summary;
  modalTitle.textContent = event.summary;
  modalDate.textContent = `${moment(event.start).format('MMMM D, YYYY - h:mm A')} to ${moment(event.end).format('h:mm A')}`;

  if (event.location) {
    modalLocation.innerHTML = '<a href="http://maps.google.com/?q=' + event.location + '" target="_blank">' +  "📍" + event.location + "</a>";
  } else {
    modalLocation.textContent = 'Location not specified';
  }
  
  let description = event.description.replace(/(https?:\/\/[^\s]+)/g, (match) => {
    return `<a href="${match}" target="_blank">${match}</a>`;
  });

  //description.replace(/\n/g, '<br>');
 
  modalDescription.innerHTML = description;

  console.log(event.description);

  modalLink.href = event.url;

  addToCalendarBtn.onclick = () => addToCalendar(event);

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function addToCalendar(event) {
  const startTime = moment(event.start).format('YYYYMMDDTHHmmss');
  const endTime = moment(event.end).format('YYYYMMDDTHHmmss');
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || '')}&sprop=&sprop=name:`;

  const appleCalendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${event.url}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`;

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
        <button id="closeModal">Close</button>
    `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById('closeModal').onclick = () => {
    document.body.removeChild(modal);
  };
}

function updateWeekNavigation() {
  const prevWeekBtn = document.getElementById('prevWeek');
  const nextWeekBtn = document.getElementById('nextWeek');
  const weekDisplay = document.getElementById('weekDisplay');

  prevWeekBtn.disabled = currentWeekStart.isSame(moment().startOf('week'));

  // Check if there are events in the next week
  const nextWeekStart = moment(currentWeekStart).add(1, 'week').startOf('week');
  const nextWeekEnd = moment(nextWeekStart).endOf('week');
  const hasNextWeekEvents = allEvents.some(event =>
    moment(event.start).isBetween(nextWeekStart, nextWeekEnd, null, '[]') &&
    activeFilters.has(event.source)
  );

  nextWeekBtn.disabled = !hasNextWeekEvents;

  weekDisplay.textContent = `${currentWeekStart.format('MMMM D')} - ${moment(currentWeekStart).endOf('week').format('MMMM D, YYYY')}`;
}

function closeModal() {
  const addToCalendarBtns = document.querySelectorAll('.add-to-calendar');
  addToCalendarBtns.forEach(btn => btn.style.display = 'block');

  const modal = document.getElementById('eventModal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('eventModal');
  const closeButton = modal.querySelector('.close');

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Close modal on escape key press
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});

function createFilterToggles() {
  const facebookFilters = document.getElementById('facebookFilters');
  const kkFilters = document.getElementById('kkFilters');
  const customFilters = document.getElementById('customFilters');

  Object.entries(icsFiles).forEach(([file, info]) => {
    const toggle = document.createElement('label');
    toggle.className = 'filter-toggle';
    toggle.innerHTML = `
              <input type="checkbox" name="${file}" checked>
              <a href="${info.url}" target="_blank">${file.replace('.ics', '')}</a>
          `;

    toggle.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) {
        activeFilters.add(file);
      } else {
        activeFilters.delete(file);
      }
      displayEvents();
    });

    switch (info.type) {
      case 'Facebook':
        facebookFilters.appendChild(toggle);
        break;
      case 'KK':
        kkFilters.appendChild(toggle);
        break;
      case 'Custom':
        customFilters.appendChild(toggle);
        break;
    }
  });

  const filterHeader = document.querySelector('.filter-header');
  const filterContent = document.querySelector('.filter-content');

  const toggleAllButton = document.createElement('button');
  toggleAllButton.textContent = 'Disable All';
  toggleAllButton.className = 'toggle-all-button';

  filterHeader.appendChild(toggleAllButton);

  toggleAllButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const filterToggles = filterContent.querySelectorAll('.filter-toggle input');
    const areAllChecked = Array.from(filterToggles).every(toggle => toggle.checked);

    filterToggles.forEach(toggle => {
      toggle.checked = !areAllChecked;
      if (toggle.checked) {
        activeFilters.add(toggle.name);
      } else {
        activeFilters.delete(toggle.name);
      }
    });

    toggleAllButton.textContent = areAllChecked ? 'Enable All' : 'Disable All';

    displayEvents();
  });

  const arrow = document.querySelector('.arrow');

  filterHeader.addEventListener('click', () => {
    filterContent.classList.toggle('open');
    arrow.classList.toggle('open');
  });
}

document.getElementById('prevWeek').addEventListener('click', () => {
  currentWeekStart.subtract(1, 'week');
  displayEvents();
});

document.getElementById('nextWeek').addEventListener('click', () => {
  currentWeekStart.add(1, 'week');
  displayEvents();
});

window.onclick = function (event) {
  const modal = document.getElementById('eventModal');
  if (event.target == modal || event.target.className == 'close') {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
  }
}

createFilterToggles();
loadAllEvents();