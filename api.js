import { state } from './state.js';
import { normalizeString, getSimilarity } from './utils.js';

/*
* Weeks are stored in JSON files with this naming convention: YYYY-WXX.json
* Where XX is the week number (duh)
*/ 
async function fetchWeekEvents(date) {
  const weekNumber = date.format('WW').padStart(2, '0');
  const year = date.format('YYYY');

  try {
    const response = await fetch(`events/${year}-W${weekNumber}.json`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

/*
* We need all events between today and 7 days.
* But events are separated by week - so we need to load both this week and the next week's events,
* and then filter out anything outside this time window.
*/
export async function loadEvents() {
  const [currentWeekEvents, nextWeekEvents] = await Promise.all([
    fetchWeekEvents(state.windowStart),
    fetchWeekEvents(state.windowEnd)
  ]);

  const allEvents = [...currentWeekEvents, ...nextWeekEvents].map(event => ({
    name: event.name,
    description: event.description,
    start: moment.unix(event.date.start_timestamp).toDate(),
    end: moment.unix(event.date.end_timestamp).toDate(),
    url: event.url,
    location: event.location,
    imageUrl: event.image_url,
    platform: event.platform,
    venue: event.page_name,
    venueUrl: event.page_url,
    tag: event.tag,
  }));

  return processEvents(allEvents);
}

function processEvents(events) {
  const seenEvents = new Map();

  const filteredEvents = events.filter(event => {
    //If the event is not in the right time window, no need to consider it
    if (moment(event.start).isBefore(moment()) || moment(event.start).isAfter(state.windowEnd)) {
      return false;
    }
    
    const eventDate = moment(event.start).format('YYYY-MM-DD');
    
    // Initialize map for this date if it doesn't exist
    if (!seenEvents.has(eventDate)) {
      seenEvents.set(eventDate, new Map());
      seenEvents.get(eventDate).set(event.name, event);
      return true; // First event for this date is always included
    }

    const dateEvents = seenEvents.get(eventDate);
    if (isDuplicate(event, dateEvents)) {
      return false;
    }

    // Not a duplicate, store and keep
    dateEvents.set(event.name, event);
    return true;
  });

  return filteredEvents.sort((a, b) => a.start - b.start);
}

/*
* Since Events are scraped from different sources, we might have duplicates.
* Some duplicates can have similar titles to a human, but not to a computer,
* so we try to overcome this by checking string similarity if the dates and venues are the same.
*/
function isDuplicate(newEvent, existingEvents) {
  return Array.from(existingEvents.values()).some(existing => {
    if (existing.venue === "Dining Week") return true; //Skipping these for now, they have too many

    // Quick checks first - if time or venue don't match, not a duplicate
    if (existing.start !== newEvent.start) return false;
    if (existing.venue !== newEvent.venue) return false;

    const newEventNormalizedName = normalizeString(newEvent.name);
    const existingEventNormalizedName = normalizeString(existing.name);

    // Check if one name contains the other
    if (newEventNormalizedName(existingEventNormalizedName) || 
      existingEventNormalizedName.includes(newEventNormalizedName)) {
      return true;
    }

    // Finally, check similarity score
    return getSimilarity(newEventNormalizedName, existingEventNormalizedName) > 0.45;
  });
}