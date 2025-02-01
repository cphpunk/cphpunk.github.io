/*
* These tags are set by openai's embedding model during scraping.
* Each event MUST have one of these and one only.
*/
export const EVENT_TAGS = [
  "MUSIC", "MOVIE", "ACTIVISM", "COMMUNITY", "THEATRE", "CULTURE",
  "LGBTQ+", "YOGA", "SPORTS", "ART", "COMEDY", "SHOPPING", "GAMES", "QUIZ"
];

/*
* Used this to create filters.
* Currently disabled filters, so, not using them, but they look nice.
*/
export const TAG_EMOJIS = {
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


/*
* How many hours need to have passed from the event start to right now before we stop showing the event.
*/
export const EVENT_VISIBILITY_HOURS_AFTER_START = 4; 

/*
* File path constants for event data
*/
export const EVENT_FOLDER_BASE = 'events/';
export const EVENT_FOLDER_LIGHT = 'events/light/';
export const EVENT_FILE_SUFFIX_LIGHT = '_LIGHT';

/*
* Similarity threshold for duplicate event detection
*/
export const EVENT_NAME_SIMILARITY_THRESHOLD = 0.45;

/*
* Special venue names that need specific handling
*/
export const EXCLUDED_VENUES = ['Dining Week'];

/*
* The amount of exact characters in a sequence two event names have to share to be considered duplicates.
*/
export const DUPLICATE_STRING_MIN_SUBSTRING_CHAR_LENGTH = 10;

/*
* Keys used for localStorage
*/
export const STORAGE_KEYS = {
  FILTERS: 'filters',
  PAGE_FILTERS: 'pageFilters'
};

/*
* DOM element IDs and CLASSES used for lookups
*/
export const DOM_CLASSES = {
  MODAL_CLOSE: 'close',
  MODAL_CONTENT: 'modal-content'
};


/*
* DOM element IDs and CLASSES used for lookups
*/
export const DOM_IDS = {
  INFO_BUTTON: 'infoButton',  // Note: this was duplicated before
  INFO_MODAL: 'infoModal',
  VENUE_LIST: 'venueList',
  ENABLE_ALL_VENUES: 'enableAllVenues',
  DISABLE_ALL_VENUES: 'disableAllVenues',
  EVENT_LIST: 'eventList'  // Added from render.js
};

/*
* Date and time format patterns
*/
export const DATE_FORMATS = {
  EVENT_DATE: 'MMMM D, YYYY',
  EVENT_TIME: 'h:mm A'
};

/*
* Default values and fallbacks
*/
export const DEFAULTS = {
  PLACEHOLDER_IMAGE: 'placeholder.jpg'
};

/*
* Event display related constants
*/
export const EVENT_DISPLAY = {
  ICONS: {
    DATE: '📆',
    LOCATION: '📍'
  }
};