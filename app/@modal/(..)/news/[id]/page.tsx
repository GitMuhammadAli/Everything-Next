import { useRouter, usePathname } from "next/navigation";

export default function NewsModalIntercepted({ params }: { params: { id: string } }) {
const router = useRouter();

  const close = () => {
    // Try to go back; if there's no history entry, navigate to the news list
    try {
      router.back();
    } catch {
      router.push("/news");
    }
  };

  // Using usePathname for a more accurate check (requires separate import)
  
  const pathname = usePathname();
  const isInterceptedRoute = pathname === `/news/${params.id}`;
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {isInterceptedRoute && (
        <>
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10">
            <h2 className="text-lg font-semibold mb-2">Intercepted: {params.id}</h2>
            <p className="text-sm text-neutral-700 mb-4">
              This route intercepts /news/{params.id} and renders it as a modal while preserving the current page context.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={close}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}