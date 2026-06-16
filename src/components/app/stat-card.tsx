import { formatCount, formatCurrency } from "@/lib/utils/format";

type StatCardProps = {
  label: string;
  value: number;
  currency?: boolean;
  tone?: "blue" | "green" | "gold";
};

const toneMap = {
  blue: "from-blue-950 to-blue-800 text-white",
  green: "from-emerald-700 to-emerald-600 text-white",
  gold: "from-amber-400 to-amber-300 text-slate-950",
};

export function StatCard({ label, value, currency, tone = "blue" }: StatCardProps) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br p-5 shadow-lg shadow-slate-200/60 ${toneMap[tone]}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{currency ? formatCurrency(value) : formatCount(value)}</p>
    </div>
  );
}
