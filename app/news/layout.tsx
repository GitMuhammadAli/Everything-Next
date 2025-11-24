import type { ReactNode } from "react";

export default function NewsLayout({
  children,
  archive,
}: {
  children: ReactNode;
  archive: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4 items-start">
      <div>{children}</div>
      <aside>{archive}</aside>
    </div>
  );
}
