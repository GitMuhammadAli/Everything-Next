import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        date: true,
      },
    });

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

