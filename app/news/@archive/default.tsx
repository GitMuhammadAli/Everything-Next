import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getArchiveArticles() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
      select: {
        slug: true,
        title: true,
        date: true,
      },
    });
    return articles;
  } catch (error) {
    console.error("Error fetching archive articles:", error);
    return [];
  }
}

export default async function ArchiveNewsDefault() {
  const articles = await getArchiveArticles();

  if (articles.length === 0) {
    return (
      <aside className="p-4 bg-gray-50 border rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Articles</h3>
        <p className="text-sm text-gray-500">No articles available</p>
      </aside>
    );
  }

  return (
    <aside className="p-4 bg-gray-50 border rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Recent Articles
      </h3>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm block"
              href={`/news/${article.slug}`}
            >
              <span className="font-medium">{article.title}</span>
              <span className="block text-xs text-gray-500 mt-1">
                {new Date(article.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
