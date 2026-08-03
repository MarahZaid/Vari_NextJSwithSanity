import RatingStars from "../ui/RatingStars";

export default function RatingBreakdown({ product }) {
  if (!product) return null;

  const breakdown = product.reviewsBreakdown || {};
  const total = product.reviewsCount || 0;

  const rows = [
    { star: 5, count: breakdown.star5 || 0 },
    { star: 4, count: breakdown.star4 || 0 },
    { star: 3, count: breakdown.star3 || 0 },
    { star: 2, count: breakdown.star2 || 0 },
    { star: 1, count: breakdown.star1 || 0 },
  ];

  return (
    <div className="px-2 py-10 sm:px-2 md:px-8">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="min-w-[160px] text-center">
          <p className="text-4xl font-bold text-[#003b57]">
            {Number(product.rating || 0).toFixed(1)}
          </p>
          <div className="my-2 flex justify-center">
            <RatingStars rating={product.rating} size="medium" />
          </div>
          <p className="text-sm text-[#666]">Based on {total} reviews</p>
        </div>

        <div className="w-full max-w-[500px] flex-1">
          {rows.map(({ star, count }) => {
            const pct = total ? (count / total) * 100 : 0;
            return (
              <div key={star} className="mb-3 flex items-center gap-3">
                <span className="w-[55px] text-sm">{star} star</span>
                <div className="h-2 flex-1 rounded-full bg-[#ececec]">
                  <div
                    className="h-2 rounded-full bg-[#003b57]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-[30px] text-right text-sm">{count}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="whitespace-nowrap rounded-full bg-[#003b57] px-6 py-3 font-semibold text-white hover:bg-[#002c43]"
        >
          Write A Review
        </button>
      </div>
    </div>
  );
}