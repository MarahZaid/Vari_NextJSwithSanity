import { Star } from "lucide-react";

const POINTS_LABELS = {
  signup: "Signup bonus",
  order: "Order reward",
  redeem: "Redeemed at checkout",
};

export default function PointsTab({ points, history }) {
  return (
    <div>
      <h2 className="mb-6 text-lg font-extrabold text-[#003349]">
        My Points
      </h2>

      <div className="mb-6 rounded-[14px] bg-gradient-to-br from-[#003349] to-[#007fad] p-6 text-white">
        <div className="flex items-center gap-3">
          <Star size={32} />
          <div>
            <p className="text-2xl font-extrabold leading-tight">
              {points || 0} points
            </p>
            <p className="text-sm text-white/85">
              ≈ ${((points || 0) / 100).toFixed(2)} in discounts
            </p>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-14">
          <Star size={36} className="text-black/10" />
          <p className="text-[#6b7c84]">No points activity yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((entry) => {
            const isPositive = entry.amount > 0;
            return (
              <div
                key={entry._id}
                className="flex items-center justify-between rounded-[10px] border border-black/[0.08] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1a2b33]">
                    {POINTS_LABELS[entry.type] || entry.type}
                    {entry.orderId ? ` · Order #${entry.orderId.slice(-6)}` : ""}
                  </p>
                  <p className="text-xs text-[#6b7c84]">
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <span
                  className={`font-bold ${
                    isPositive ? "text-[#2e7d32]" : "text-red-700"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {entry.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}