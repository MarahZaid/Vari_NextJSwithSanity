export default function ProductPageSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-10 md:grid-cols-2">
      <div className="aspect-square rounded-2xl bg-[#eef1f2]" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 rounded bg-[#eef1f2]" />
        <div className="h-4 w-full rounded bg-[#eef1f2]" />
        <div className="h-4 w-1/2 rounded bg-[#eef1f2]" />
        <div className="h-6 w-24 rounded bg-[#eef1f2]" />
        <div className="h-11 w-full rounded bg-[#eef1f2]" />
      </div>
    </div>
  );
}