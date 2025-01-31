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