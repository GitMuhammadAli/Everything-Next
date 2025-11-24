import Link from "next/link";

export default function ArchiveNewsDefault() {
  const archiveItems = [
    { id: "dawn", label: "Archived: DAWN Headlines (Jun 2024)" },
    { id: "geo", label: "Archived: GEO Top Stories (May 2024)" },
  ];

  return (
    <aside className="p-4 bg-gray-50 border rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">News Archive</h3>
      <ul className="list-disc pl-5 space-y-1">
        {archiveItems.map((item) => (
          <li key={item.id}>
            <Link className="text-blue-600 hover:underline" href={`/news/${item.id}`}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
