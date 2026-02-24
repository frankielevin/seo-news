export interface Source {
  id: string;
  name: string;
  siteUrl: string;
  feedUrl: string;
  color: string;
  shortName: string;
}

export const SOURCES: Source[] = [
  {
    id: "search-engine-journal",
    name: "Search Engine Journal",
    shortName: "SEJ",
    siteUrl: "https://www.searchenginejournal.com",
    feedUrl: "https://www.searchenginejournal.com/feed/",
    color: "#E8611A",
  },
  {
    id: "search-engine-land",
    name: "Search Engine Land",
    shortName: "SEL",
    siteUrl: "https://searchengineland.com",
    feedUrl: "https://searchengineland.com/feed",
    color: "#1A73E8",
  },
  {
    id: "seroundtable",
    name: "SE Roundtable",
    shortName: "SER",
    siteUrl: "https://www.seroundtable.com",
    feedUrl: "https://www.seroundtable.com/index.rdf",
    color: "#E83232",
  },
  {
    id: "google-search-central",
    name: "Google Search Central",
    shortName: "Google",
    siteUrl: "https://developers.google.com/search/blog",
    feedUrl: "https://feeds.feedburner.com/blogspot/amDG",
    color: "#4285F4",
  },
  {
    id: "ahrefs",
    name: "Ahrefs Blog",
    shortName: "Ahrefs",
    siteUrl: "https://ahrefs.com/blog",
    feedUrl: "https://ahrefs.com/blog/feed/",
    color: "#FF6B35",
  },
  {
    id: "semrush",
    name: "Semrush Blog",
    shortName: "Semrush",
    siteUrl: "https://www.semrush.com/blog",
    feedUrl: "https://www.semrush.com/blog/feed/",
    color: "#FF3D2E",
  },
  {
    id: "moz",
    name: "Moz Blog",
    shortName: "Moz",
    siteUrl: "https://moz.com/blog",
    feedUrl: "https://moz.com/feeds/blog.rss",
    color: "#00ADEF",
  },
  {
    id: "yoast",
    name: "Yoast SEO",
    shortName: "Yoast",
    siteUrl: "https://yoast.com/seo-blog/",
    feedUrl: "https://yoast.com/feed/",
    color: "#A4286A",
  },
  {
    id: "screaming-frog",
    name: "Screaming Frog",
    shortName: "SF",
    siteUrl: "https://www.screamingfrog.co.uk/blog",
    feedUrl: "https://www.screamingfrog.co.uk/feed/",
    color: "#3EC21E",
  },
  {
    id: "hubspot",
    name: "HubSpot Marketing",
    shortName: "HubSpot",
    siteUrl: "https://blog.hubspot.com/marketing",
    feedUrl: "https://blog.hubspot.com/marketing/rss.xml",
    color: "#FF7A59",
  },
];

export const SOURCE_MAP = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
