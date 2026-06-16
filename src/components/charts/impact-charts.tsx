"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { XAxisProps } from "recharts";

const colors = ["#123873", "#1f5aa6", "#19a974", "#f2bb46", "#73a6df", "#1f7a8c"];

type ChartPoint = {
  label: string;
  value?: number;
  cases?: number;
  beneficiaries?: number;
};

type AxisTickPayload = {
  value: string;
};

type WrappedTickProps = {
  x?: number;
  y?: number;
  payload?: AxisTickPayload;
};

const stateAbbreviations: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TS",
  Tripura: "TR",
  Uttarakhand: "UK",
  "Uttar Pradesh": "UP",
  "West Bengal": "WB",
  Delhi: "DL",
};

function normalizeAxisLabel(label: string) {
  const [city, state] = label.split(",").map((part) => part.trim());

  if (!city || !state) {
    return label;
  }

  const abbreviatedState = stateAbbreviations[state];

  if (!abbreviatedState) {
    return label;
  }

  return `${city}, ${abbreviatedState}`;
}

function wrapTickLabel(label: string, maxLineLength = 12) {
  const normalizedLabel = normalizeAxisLabel(label);
  const words = normalizedLabel.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxLineLength || currentLine.length === 0) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;

    if (lines.length === 2) {
      break;
    }
  }

  if (currentLine && lines.length < 2) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return [normalizedLabel];
  }

  if (words.length > lines.join(" ").split(/\s+/).filter(Boolean).length) {
    const lastLineIndex = lines.length - 1;
    lines[lastLineIndex] = `${lines[lastLineIndex].slice(0, maxLineLength - 1).trimEnd()}…`;
  }

  return lines.slice(0, 2);
}

function WrappedXAxisTick({ x = 0, y = 0, payload }: WrappedTickProps) {
  const lines = wrapTickLabel(payload?.value ?? "");

  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={16} textAnchor="middle" fill="#475569" fontSize={11}>
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={0} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function TrendChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="flex h-80 flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 shrink-0">
        <p className="text-lg font-semibold text-slate-950">Month-wise trend</p>
        <p className="text-sm text-slate-500">Approved seva cases and value over time</p>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="label" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#123873" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="cases" stroke="#19a974" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BreakdownBarChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: ChartPoint[];
}) {
  return (
    <div className="flex h-80 flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 shrink-0">
        <p className="text-lg font-semibold text-slate-950">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 34 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tick={WrappedXAxisTick as XAxisProps["tick"]}
              interval={0}
              height={60}
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              padding={{ left: 18, right: 18 }}
            />
            <YAxis fontSize={12} tickLine={false} axisLine={false} width={52} />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`${entry.label}-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SharePieChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="flex min-h-[34rem] flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm lg:h-[24rem] lg:min-h-0 xl:h-[26rem]">
      <div className="mb-4 shrink-0">
        <p className="text-lg font-semibold text-slate-950">Top categories</p>
        <p className="text-sm text-slate-500">Share of total approved seva value</p>
      </div>
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div className="h-56 lg:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={58} outerRadius={94}>
                {data.map((entry, index) => (
                  <Cell key={`${entry.label}-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid content-start gap-2 self-start">
          {data.slice(0, 5).map((entry, index) => (
            <div key={entry.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="font-medium leading-snug text-slate-700">{entry.label}</span>
              </div>
              <span className="shrink-0 text-slate-500">{entry.value?.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
