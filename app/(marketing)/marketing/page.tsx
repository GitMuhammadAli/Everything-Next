"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  date: string;
}

const MarketingNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading news...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error loading news</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Latest Marketing News & Announcements</h1>
        <p className="text-gray-600">No articles available. Please seed the database.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Latest Marketing News & Announcements</h1>
      <p className="text-gray-600 mb-8">Stay updated with our latest articles and marketing insights.</p>

      <div className="space-y-6">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <Link href={`/news/${item.slug}`} className="block">
              <div className="md:flex">
                {item.image && (
                  <div className="md:w-1/3 relative h-48 md:h-auto">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className={`p-6 ${item.image ? "md:w-2/3" : "w-full"}`}>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString("en-US", {
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
};

export default MarketingNewsPage;