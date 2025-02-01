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