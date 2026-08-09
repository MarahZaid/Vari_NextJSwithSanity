import ProductCardSkeleton from "./ProductCardSkeleton";

export default function CategoryPageSkeleton() {
  return (
    <>
      {/* Header row */}
      <div className="flex animate-pulse flex-col items-start justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:px-8 lg:px-10">
        <div className="h-4 w-40 rounded bg-[#eef1f2]" />
        <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
          <div className="h-4 w-24 rounded bg-[#eef1f2]" />
          <div className="h-14 w-full rounded bg-[#eef1f2] md:w-[250px]" />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-10">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden w-72 animate-pulse pr-6 lg:block">
            <hr className="mb-6 border-black/10" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="mb-3 h-4 w-24 rounded bg-[#eef1f2]" />
                <div className="mb-8 space-y-2.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 w-32 rounded bg-[#eef1f2]" />
                  ))}
                </div>
                <hr className="mb-6 border-black/10" />
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}