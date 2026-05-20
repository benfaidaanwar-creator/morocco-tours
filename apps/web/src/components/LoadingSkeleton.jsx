export function OfferCardSkeleton() {
  return (
    <div className="rounded-xl border dark:border-white/10 border-gray-200 overflow-hidden dark:bg-[#1A1A1A]/80 bg-white animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="p-8 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A]/50 bg-white animate-pulse">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-gray-200 dark:bg-white/10 rounded"
          />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-24" />
          <div className="h-2 bg-gray-200 dark:bg-white/10 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
