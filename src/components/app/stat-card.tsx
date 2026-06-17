import { formatCount, formatCurrency } from "@/lib/utils/format";

type StatCardProps = {
  label: string;
  value: number;
  currency?: boolean;
  tone?: "blue" | "green" | "gold";
};

const toneMap = {
  blue: "from-slate-950 via-blue-900 to-blue-700 text-white shadow-blue-900/25",
  green: "from-emerald-800 via-emerald-700 to-emerald-500 text-white shadow-emerald-900/20",
  gold: "from-amber-300 via-amber-200 to-yellow-100 text-slate-950 shadow-amber-900/15",
};

export function StatCard({ label, value, currency, tone = "blue" }: StatCardProps) {
  return (
    <div className={`rounded-[2rem] border border-white/15 bg-gradient-to-br p-5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.7)] ${toneMap[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-5 text-3xl font-semibold tracking-tight">{currency ? formatCurrency(value) : formatCount(value)}</p>
    </div>
  );
}
