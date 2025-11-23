import { notFound } from 'next/navigation';

type Props = {
	params: { id: string };
};

import Image from 'next/image';

export default function Page({ params }: Props) {
	const { id } = params;

	const articles: Record<string, { title: string; content: string; image?: string }> = {
		dawn: {
			title: 'DAWN — Breaking News',
			content:
				'DAWN provides breaking news, in-depth reporting and analysis across politics, business and society. This is sample content for the DAWN feed.',
			image: 'ai-robot.jpg',
		},
		geo: {
			title: 'GEO — Headlines',
			content:
				'GEO covers national and international headlines with live updates and expert commentary. This is sample content for the GEO feed.',
			image: 'beaver.jpg',
		},
	};

	const article = articles[id];
	if (!article) return notFound();

	return (
		<div style={{ padding: 20 }}>
			{article.image && (
				<div style={{ marginBottom: 16 }}>
					<Image src={`/images/news/${article.image}`} alt={article.title} width={360} height={360} style={{ borderRadius: 8 }} />
				</div>
			)}
			<h1>{article.title}</h1>
			<p>{article.content}</p>
			<p>
				<a href="/news">← Back to News</a>
			</p>
		</div>
	);
}
