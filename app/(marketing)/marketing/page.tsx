'use client'; // ⬅️ REQUIRED: Marks this file as a Client Component to allow hooks (useState, useEffect)

import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// Define the shape of your data
interface NewsItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  date: string;
  content: string;
}

const MarketingNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming your separate backend server is running on port 8080
        const response: AxiosResponse<NewsItem[]> = await axios.get('http://localhost:8080/news');
        setNews(response.data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news content. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Latest Marketing News & Announcements</h1>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p className='date-info'>Published: {item.date}</p>
            {/* Note: Use relative path for public assets */}
            <img src={item.image} alt={item.title} style={{ maxWidth: '300px' }} />
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketingNewsPage;