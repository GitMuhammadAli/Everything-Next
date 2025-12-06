import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 60; // Revalidate every 60 seconds

async function getArticles() {
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
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function NewsPage() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">News</h1>
        <p className="text-gray-600">No articles found. Please seed the database.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Latest News</h1>
        <p className="text-gray-600">Stay updated with our latest articles and stories.</p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <Link href={`/news/${article.slug}`} className="block">
              <div className="md:flex">
                {article.image && (
                  <div className="md:w-1/3 relative h-48 md:h-auto">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className={`p-6 ${article.image ? "md:w-2/3" : "w-full"}`}>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-blue-600 text-sm font-medium hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}