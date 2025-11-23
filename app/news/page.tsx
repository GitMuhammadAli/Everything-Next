import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
    const articles = [
        { id: 'dawn', title: 'DAWN — Breaking News', excerpt: 'Latest headlines and analysis from DAWN.', image: 'ai-robot.jpg' },
        { id: 'geo', title: 'GEO — Headlines', excerpt: 'Top stories and updates from GEO.', image: 'beaver.jpg' },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h1>News</h1>
            <p>Welcome to the news section. Choose an outlet to read more.</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {articles.map((a) => (
                    <li key={a.id} style={{ margin: '12px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Link href={`/news/${a.id}`} style={{ display: 'inline-block' }}>
                            <Image
                                src={`/images/news/${a.image}`}
                                alt={a.title}
                                width={180}
                                height={120}
                                style={{ borderRadius: 8, objectFit: 'cover' }}
                            />
                        </Link>
                        <div>
                            <h2 style={{ margin: 0 }}>
                                <Link href={`/news/${a.id}`}>{a.title}</Link>
                            </h2>
                            <p style={{ margin: '6px 0 0' }}>{a.excerpt}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}