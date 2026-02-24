import Parser from "rss-parser";
import { SOURCES, Source } from "./feeds";

export interface Article {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  sourceId: string;
  sourceName: string;
  sourceShortName: string;
  sourceColor: string;
  author?: string;
}

type CustomItem = {
  "media:content"?: { $?: { url?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
  creator?: string;
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: {
    item: [
      ["media:content", "media:content", { keepArray: false }],
      ["media:thumbnail", "media:thumbnail", { keepArray: false }],
    ],
  },
  timeout: 8000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "application/rss+xml, application/atom+xml, application/xml, text/xml",
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, length = 160): string {
  if (text.length <= length) return text;
  return text.slice(0, length).replace(/\s+\S*$/, "") + "…";
}

async function fetchFeed(source: Source): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return feed.items.slice(0, 15).map((item) => {
      const rawSummary =
        item.contentSnippet ||
        item.summary ||
        (item.content ? stripHtml(item.content) : "");
      return {
        id: `${source.id}::${item.guid || item.link || item.title || Math.random()}`,
        title: item.title ? stripHtml(item.title) : "Untitled",
        link: item.link || source.siteUrl,
        summary: truncate(stripHtml(rawSummary)),
        publishedAt:
          item.pubDate || item.isoDate || new Date().toISOString(),
        sourceId: source.id,
        sourceName: source.name,
        sourceShortName: source.shortName,
        sourceColor: source.color,
        author: item.creator || (item as Record<string, unknown>)["author"] as string | undefined,
      };
    });
  } catch {
    return [];
  }
}

export async function fetchAllFeeds(): Promise<{
  articles: Article[];
  sourceStatuses: Record<string, number>;
}> {
  const results = await Promise.allSettled(SOURCES.map(fetchFeed));

  const sourceStatuses: Record<string, number> = {};
  const allArticles: Article[] = [];

  results.forEach((result, index) => {
    const source = SOURCES[index];
    if (result.status === "fulfilled") {
      sourceStatuses[source.id] = result.value.length;
      allArticles.push(...result.value);
    } else {
      sourceStatuses[source.id] = 0;
    }
  });

  const articles = allArticles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return { articles, sourceStatuses };
}
