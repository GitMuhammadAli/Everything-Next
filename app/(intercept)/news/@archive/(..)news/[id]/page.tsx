import Image from 'next/image';

export default function InterceptedNewsDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <h3>Intercepted detail: {id}</h3>
      <p>This view is intercepted into the @archive slot while the main list stays visible.</p>
      <div style={{position: 'relative', width: '100%', height: 160, background: '#fafafa'}}>
        <Image src={`/images/news/${id}.jpg`} alt={id} fill style={{objectFit: 'cover'}} />
      </div>
    </div>
  );
}
