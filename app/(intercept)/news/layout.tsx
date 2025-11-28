export default function NewsInterceptLayout({ children, archive }: { children: React.ReactNode, archive: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <div>
        {children}
      </div>
      <aside style={{ borderLeft: '1px solid #ddd', paddingLeft: 16 }}>
        {archive}
      </aside>
    </div>
  );
}
