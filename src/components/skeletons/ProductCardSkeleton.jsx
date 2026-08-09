export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-[#eef1f2]" />
      <div className="mt-3 h-4 w-3/4 rounded bg-[#eef1f2]" />
      <div className="mt-2 h-4 w-1/3 rounded bg-[#eef1f2]" />
    </div>
  );
}