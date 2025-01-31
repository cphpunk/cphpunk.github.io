import { state } from './state.js';

export function displayEvents() {
  const eventList = document.getElementById('eventList');
  
  eventList.innerHTML = Object.entries(
    state.events
      .filter(event => state.pageFilters.has(event.venue))
      .reduce((groups, event) => {
        const date = moment(event.start).format('MMMM D, YYYY');
        groups[date] = groups[date] || [];
        groups[date].push(event);
        return groups;
      }, {})
  ).map(([date, events]) => `
    <div class="event-day-divider" data-date="${date}">
      <div class="event-day-container">
        ${events.map(event => `
          <div class="event-box" onclick="window.open('${event.url}', '_blank')" style="cursor: pointer">
            <img src="${event.imageUrl || 'placeholder.jpg'}" class="event-image" loading="lazy" alt="${event.name}">
            <div class="event-tag" data-tag="${event.tag}">${event.tag}</div>
            <div class="event-details">
              <div class="event-title">${event.name}</div>
              <div class="event-date">📆 ${moment(event.start).format('h:mm A')}</div>
              <div class="event-location">📍 ${event.venue}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}