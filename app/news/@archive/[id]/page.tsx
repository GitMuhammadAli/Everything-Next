type Props = {
  params: { id: string };
};

export default function ArchiveNewsDetail({ params }: Props) {
  const { id } = params;
  const content: Record<string, string> = {
    dawn:
      "Archive: DAWN coverage summary from June 2024 with curated highlights and key updates.",
    geo:
      "Archive: GEO monthly roundup from May 2024 including top features and editor picks.",
  };

  const copy = content[id] ?? "No archived content for this item.";

  return (
    <aside className="p-4 bg-gray-50 border rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">News Archive Detail</h3>
      <p className="text-sm text-gray-600">{copy}</p>
    </aside>
  );
}
