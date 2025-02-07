/**
 * @fileoverview Holds constants (shocker), to try to make sense of JavaScript magic strings stupidity.
 * @description Some of these might need to be loaded in dynamically in the future.
 * @author Mattia
 */

/*
* These tags are set by openai's embedding model during scraping.
* Each event MUST have one of these and one only.
*/
export const ALL_EVENT_CATEGORIES = [
  "MUSIC", "MOVIE", "ACTIVISM", "COMMUNITY", "THEATRE", "CULTURE",
  "LGBTQ+", "YOGA", "SPORTS", "ART", "COMEDY", "SHOPPING", "GAMES", "QUIZ"
];


/* 
* Missing Frederiskberg but nobody likes Frederiskberg.
*/
export const ALL_COPENHAGEN_DISTRICTS = ['Amager Vest', 'Vesterbro-Kongens Enghave', 
  'Østerbro', 'Valby', 'Brønshøj-Husum', 'Vanløse', 'Indre By', 
  'Nørrebro', 'Bispebjerg', 'Amager Øst', 'Frederiksberg', 'Anywhere Else']

/*
* This equates to "Anywhere Else". Sometimes in the JSON we set this instead.
*/
export const UNKNOWN_COPENHAGEN_DISTRICT = "Unknown / Not Copenhagen";

/*
* This should and was loaded at runtime. But it was loaded by api and set into state, which felt wrong. There should probably be another file for this.
*/
export const ALL_COPENHAGEN_SOURCES = {
  "Extinction Rebellion Danmark": "https://www.facebook.com/ExtinctionRebellionDK/events",
  "Olla Común Folkekøkken": "https://www.facebook.com/profile.php?id=100086132768380&sk=events",
  "Nørrebrohallen og Nørrebro Bibliotek": "https://www.facebook.com/Noerrebrohallen/events",
  "Sydhavnens Bibliotek": "https://www.facebook.com/sydhavnensbibliotek/events",
  "KraftWerket": "https://kraftwerket.kk.dk/en/events",
  "Kulturhuset Islands Brygge": "https://kulturhusetislandsbrygge.kk.dk/koncerter",
  "HUSET": "https://huset.kk.dk/en/events",
  "Mayhem": "https://mayhemkbh.dk",
  "Villa Kultur": "https://www.facebook.com/villakultur/events",
  "Råhuset": "https://www.facebook.com/Raahuset/events",
  "Spillestedet Stengade": "https://www.facebook.com/spillestedetstengade/events",
  "Mayhem KBH": "https://www.facebook.com/mayhemkbh/events",
  "ALICE cph": "https://www.facebook.com/alicecphcom/events",
  "Musik Loppen": "https://www.facebook.com/musikloppen/events",
  "KoncertKirken": "https://www.facebook.com/koncertkirken/events",
  "RUST": "https://www.facebook.com/RUSTkbh/events",
  "Pumpehuset": "https://www.facebook.com/Pumpehuset/events/",
  "HUSET  (Huset i Magstræde)": "https://www.facebook.com/Huset.Koebenhavn/events",
  "Basement CPH": "https://www.facebook.com/BasementKBH/events",
  "VEGA": "https://www.facebook.com/VEGAcph/events",
  "Operaen Christiania": "https://www.facebook.com/operaenscafe/events",
  "Punks Undead": "https://www.facebook.com/PunksUndeadCPH/events",
  "Ungdomshuset": "https://www.facebook.com/UngdomshusetD61/events",
  "Radar": "https://www.facebook.com/radarlive/events",
  "DROP INN": "https://www.facebook.com/dropinnmusic/events",
  "Haven CPH": "https://www.facebook.com/havencph/events",
  "Hangaren": "https://www.facebook.com/HangarenCopenhagen/events",
  "Hotel Cecil": "https://www.facebook.com/hotelcecilcph/events",
  "Ukirke": "https://www.facebook.com/uKirke/events",
  "BETA2300": "https://www.facebook.com/beta2300/events",
  "Polychrome": "https://www.facebook.com/profile.php?id=100057501157471&sk=events",
  "LiteraturHaus": "https://www.facebook.com/literaturhauskbh/events",
  "Lygtens Kro": "https://www.facebook.com/lygtenskro/events",
  "Amager Bio": "https://www.facebook.com/amagerbio/events",
  "Klub Werkstatt": "https://www.facebook.com/klubwerkstatt/events",
  "Støddæmperen": "https://www.facebook.com/StoedNV/events",
  "Bolsjefabrikken": "https://www.facebook.com/Bolsjefabrikkerne/events",
  "Den Anden Side": "https://www.facebook.com/KlubDenAndenSide/events",
  "CPH ZINE FEST": "https://www.facebook.com/cphzinefest/events",
  "Jægersborggade": "https://www.facebook.com/Jaegersborggade/events",
  "Musikcaféen": "https://www.facebook.com/musikcafeenihuset/events",
  "Madboks": "https://www.facebook.com/Madboks/events",
  "MarmeladeCulture": "https://www.facebook.com/JamCultureMusic/events",
  "ICC Theatre - Improv Comedy Copenhagen": "https://www.facebook.com/improvcomedycph/events",
  "Bøssehuset": "https://www.facebook.com/boessehuset/events",
  "Den Frie Udstillingsbygning": "https://www.facebook.com/denfrieudstillingsbygning/events",
  "Amager Records": "https://www.facebook.com/amagerrecords/events",
  "Centre Stage CPH": "https://www.facebook.com/profile.php?id=61560772023333&sk=events",
  "K.B. Hallen": "https://www.facebook.com/kbhallen/events",
  "Module": "https://www.facebook.com/modulecph/events",
  "Cph Listening Room": "https://www.facebook.com/CopenhagenSundayOpenStageListeningRoom/events",
  "Empire Bio": "https://www.facebook.com/empirebio.dk/events",
  "Grand Teatret": "https://www.facebook.com/grandteatret/events",
  "Cinemateket": "https://www.facebook.com/cinemateket/events",
  "Bastard Café - Board Games & Coffee": "https://www.facebook.com/BastardCafe/events",
  "Next House Copenhagen": "https://www.facebook.com/nexthousecopenhagen/events",
  "FLINT kbh": "https://www.facebook.com/flintkbh/events",
  "LGBT+ Medborgerhuset i København": "https://www.facebook.com/LGBTmedborgerhuset/events",
  "Ricco's Kaffebar": "https://www.facebook.com/Riccos.Kaffebar/events",
  "Sorte René": "https://www.facebook.com/sorterene/events",
  "TechBBQ": "https://www.facebook.com/TechBBQ/events",
  "DISTORTION": "https://www.facebook.com/cphdistortion/events",
  "MIX COPENHAGEN": "https://www.facebook.com/mixcph/events",
  "Copenhagen Jazz Festival": "https://www.facebook.com/cphjazzfestival/events",
  "CPH:DOX": "https://www.facebook.com/cphdox/events",
  "Copenhagen Short Film Festival": "https://www.facebook.com/CopenhagenShortFilmFestival/events",
  "VOID - International Animation Film Festival": "https://www.facebook.com/voidfilmfestival/events",
  "Copenhagen Half Marathon": "https://www.facebook.com/cphhalf/events",
  "Nordic Adventure Film Festival - NAFF": "https://www.facebook.com/nordicadventurefilmfestival/events",
  "Musikfilm Festivalen": "https://www.facebook.com/musikfilmfestivalen/events",
  "Resonans Fringe": "https://www.facebook.com/resonans.fringe/events",
  "CPH STAGE": "https://www.facebook.com/cphstagedk/events",
  "COPENHELL": "https://www.facebook.com/copenhell/events",
  "Copenhagen Photo Festival": "https://www.facebook.com/CopenhagenPhotoFestival/events",
  "BUSTER Filmfestival": "https://www.facebook.com/busterfilmfestival/events",
  "Annual Copenhagen Film Festival": "https://www.facebook.com/cphfestival/events",
  "Copenhagen Catalan Film Festival": "https://www.facebook.com/catalanfilmfestivaldk/events",
  "3daysofdesign": "https://www.facebook.com/3daysofdesign.dk/events",
  "Copenhagen Sakura Festival": "https://www.facebook.com/copenhagensakurafestival/events",
  "Copenhagen International Improv Festival - CIIF": "https://www.facebook.com/cphimprofestival/events",
  "Carpark Festival": "https://www.facebook.com/carparkfestival/events",
  "Kulturnatten": "https://www.facebook.com/Kulturnatten/events",
  "Dining Week": "https://www.facebook.com/diningweek/events/",
  "Folkets Hus": "https://www.facebook.com/folketshus50/events",
  "Absalon": "https://www.facebook.com/absaloncph/events",
  "Søhesten": "https://www.facebook.com/Sohestenbar/events/",
  "Husets Biograf": "https://www.facebook.com/HusetsBiograf/events",
  "Kvarterhuset": "https://www.facebook.com/Kvarterhusetamagerbro/events/",
  "Fablab Nordvest": "https://www.facebook.com/fablabnordvest/events",
  "FABRIKKEN for Kunst og Design": "https://www.facebook.com/FABRIKKENforkunstogdesign/events",
  "Art Hub Copenhagen": "https://www.facebook.com/arthubcopenhagen/events",
  "Glyptoteket": "https://www.facebook.com/glyptotek/events/",
  "Red Door": "https://www.facebook.com/reddoordk/events",
  "2730 Demoteket": "https://www.facebook.com/2730.Demoteket/events/",
  "Science & Cocktails": "https://www.facebook.com/groups/161834943877755/events",
  "Metronomen": "https://www.facebook.com/metronomenfrb/events"
};

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
export const EXCLUDED_VENUES = ['Dining Week', 'VEGA'];

/*
* The amount of exact characters in a sequence two event names have to share to be considered duplicates.
*/
export const DUPLICATE_STRING_MIN_SUBSTRING_CHAR_LENGTH = 13;

/*
* Events used throughout the site
*/
export const EVENTS_KEYS = {
  FILTERS_CHANGED: 'filtersChanged'
}

/*
* Keys used for localStorage
*/
export const STORAGE_KEYS = {
  FILTERS: 'filters',
  PAGE_FILTERS: 'pageFilters',
  TAG_FILTERS: 'tagFilters',
  DISTRICT_FILTERS: 'districtFilters'
};

/*
* DOM element IDs and CLASSES used for lookups
*/
export const DOM_IDS = {
  INFO_BUTTON: 'infoButton',
  INFO_MODAL: 'infoModal',
  VENUE_LIST: 'venueList',
  ENABLE_ALL_VENUES: 'enableAllVenues',
  DISABLE_ALL_VENUES: 'disableAllVenues',
  EVENT_LIST: 'eventList',
  VENUE_CONTROLS: 'venueControls',
  TAG_LIST: 'tagList',
  FILTER_LIST: "filterList",
  TAG_CONTROLS: 'tagControls'
};

export const DOM_CLASSES = {
  MODAL_CLOSE: 'close',
  MODAL_CONTENT: 'modal-content',
  VENUE_ITEM: 'venue-item',
  VENUE_INFO: 'venue-info', 
  VENUE_TOGGLE: 'venue-toggle',
  SLIDER: 'slider',
  EVENTBOX: 'event-box'
};

/*
* Date and time format patterns
*/
export const DATE_FORMATS = {
  EVENT_DATE: 'dddd, MMMM D, YYYY',
  EVENT_TIME: 'h:mm A'
};

/*
* Default values and fallbacks
*/
export const DEFAULTS = {
  PLACEHOLDER_IMAGE: 'https://picsum.photos/400/300',
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