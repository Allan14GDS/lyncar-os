export function SkeletonCard() {
  return (
    <div className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse p-6">
      <div className="flex justify-between mb-4">
        <div className="h-6 w-32 bg-zinc-800 rounded"></div>
        <div className="h-5 w-16 bg-zinc-800 rounded-full"></div>
      </div>
      <div className="h-4 w-full bg-zinc-800 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-zinc-800 rounded"></div>
    </div>
  );
}
