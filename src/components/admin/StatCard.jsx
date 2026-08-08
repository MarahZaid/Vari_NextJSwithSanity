export default function StatCard({ label, value, icon: Icon, color = "#003349" }) {
  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-[#eee] p-5">
      <div
        style={{ backgroundColor: `${color}1A` }}
        className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl"
      >
        <Icon size={26} style={{ color }} />
      </div>

      <div>
        <p className="text-xl font-bold text-[#1a2b33]">{value}</p>
        <p className="text-sm text-[#6b7c84]">{label}</p>
      </div>
    </div>
  );
}