import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;

async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug,
        published: true,
      },
    });
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/news"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <span className="mr-2">←</span>
        <span>Back to News</span>
      </Link>

      {article.image && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{article.title}</h1>
        <div className="flex items-center text-gray-600 text-sm">
          <time dateTime={article.date.toISOString()}>
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {article.excerpt && (
        <p className="text-xl text-gray-700 mb-6 font-medium">{article.excerpt}</p>
      )}

      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }}
      />

      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="mr-2">←</span>
          <span>Back to All News</span>
        </Link>
      </div>
    </article>
  );
}
