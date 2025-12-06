import { prisma } from "@/lib/prisma";

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
      select: {
        title: true,
        excerpt: true,
        date: true,
      },
    });
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export default async function ArchiveNewsDetail({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return (
      <aside className="p-4 bg-gray-50 border rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Article Preview</h3>
        <p className="text-sm text-gray-500">Article not found</p>
      </aside>
    );
  }

  return (
    <aside className="p-4 bg-gray-50 border rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Article Preview
      </h3>
      <h4 className="font-medium text-gray-900">{article.title}</h4>
      {article.excerpt && (
        <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
      )}
      <p className="text-xs text-gray-500">
        {new Date(article.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </aside>
  );
}
