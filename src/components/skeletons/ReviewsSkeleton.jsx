export default function ReviewsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Review slider */}
      <div className="border-t border-black/10 py-20">
        <div className="mx-auto mb-8 h-8 w-64 rounded bg-[#eef1f2]" />
        <div className="flex justify-center gap-2 px-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[200px] w-[200px] shrink-0 rounded bg-[#eef1f2]" />
          ))}
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="mx-auto max-w-4xl px-2 py-10 sm:px-2 md:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="min-w-[160px] text-center">
            <div className="mx-auto h-10 w-16 rounded bg-[#eef1f2]" />
            <div className="mx-auto my-2 h-5 w-32 rounded bg-[#eef1f2]" />
            <div className="mx-auto h-4 w-28 rounded bg-[#eef1f2]" />
          </div>
          <div className="w-full max-w-[500px] flex-1 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-2 w-full rounded-full bg-[#eef1f2]" />
            ))}
          </div>
          <div className="h-11 w-40 rounded-full bg-[#eef1f2]" />
        </div>
      </div>

      {/* Customer reviews list */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 h-6 w-40 rounded bg-[#eef1f2]" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="grid grid-cols-1 gap-6 border-t border-black/10 py-10 md:grid-cols-12">
            <div className="md:col-span-2">
              <div className="h-[55px] w-[55px] rounded-full bg-[#eef1f2]" />
            </div>
            <div className="space-y-2 md:col-span-8">
              <div className="h-4 w-40 rounded bg-[#eef1f2]" />
              <div className="h-4 w-full rounded bg-[#eef1f2]" />
              <div className="h-4 w-2/3 rounded bg-[#eef1f2]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}