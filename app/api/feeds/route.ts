import { NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/rss";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { articles, sourceStatuses } = await fetchAllFeeds();
    return NextResponse.json({
      articles,
      sourceStatuses,
      fetchedAt: new Date().toISOString(),
      total: articles.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}
