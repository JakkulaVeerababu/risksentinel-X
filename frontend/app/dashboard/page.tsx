"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  PlayCircle,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchDashboardMetrics, fetchRecentTransactions, DashboardMetrics, Transaction } from "@/lib/api";
import { timeAgo } from "@/lib/utils";

function DecisionBadge({ decision }: { decision: string }) {
  const styles = decision === "BLOCK" ? "bg-danger-soft text-danger border border-danger/20" : decision === "REVIEW" ? "bg-warning-soft text-warning border border-warning/20" : "bg-success-soft text-success border border-success/20";
  return <span className={`inline-flex rounded-md px-2 py-0.5 text-caption font-semibold ${styles}`}>{decision}</span>;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState("24H");
  const [chartMetric, setChartMetric] = useState<"volume" | "risk">("volume");
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [metricsData, setMetricsData] = useState<DashboardMetrics | null>(null);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mRes, tRes] = await Promise.all([
          fetchDashboardMetrics(),
          fetchRecentTransactions()
        ]);
        setMetricsData(mRes);
        setTransactionsData(tRes);
        if (mRes.alert?.cluster_detected) {
          setShowCriticalAlert(true);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><p className="text-text-secondary">Loading dashboard...</p></div>;
  }

  if (error) {
    return <div className="p-8 flex justify-center text-danger"><AlertTriangle className="mr-2" /> {error}</div>;
  }

  if (!metricsData) return null;

  const m = metricsData.kpis;
  const metrics = [
    { label: "Transactions analysed", value: m.transactions_analysed.toLocaleString(), helper: "Last 24h", change: "--", direction: "up", tone: "blue" },
    { label: "High-risk detected", value: metricsData.distribution.high + metricsData.distribution.critical, helper: "Critical & High", change: "--", direction: "up", tone: "amber" },
    { label: "Automatically blocked", value: m.blocked.toLocaleString(), helper: `₹${(m.fraud_prevented / 100000).toFixed(1)}L exposure stopped`, change: "--", direction: "up", tone: "red" },
    { label: "Loss prevented", value: `₹${(m.fraud_prevented / 100000).toFixed(1)}L`, helper: `Across ${m.blocked} interventions`, change: "--", direction: "up", tone: "cobalt" },
  ];

  const chartData = metricsData.chart_data || [];
  const total = m.transactions_analysed || 1;
  const allowPct = Math.round((m.allowed / total) * 100);
  const reviewPct = Math.round((m.under_review / total) * 100);
  const blockPct = Math.round((m.blocked / total) * 100);

  return (
    <>
      <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-primary">Illustrative demo scenario</div>
          <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.04em] text-text-primary">Risk overview</h1>
          <p className="mt-1 text-[14px] text-text-secondary">Payment risk, coordinated fraud and automated decisions across Acme Payments (seeded demo data).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <CalendarDays className="h-4 w-4 text-text-muted" />
            24H <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all opacity-75 cursor-not-allowed" disabled>
            <Download className="h-4 w-4 text-text-muted" />
            Preview Export
          </button>
          <div className="hidden sm:block mx-1 h-6 w-px bg-border"></div>
          <Link href="/simulator" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-white shadow-sm hover:bg-primary-hover hover:premium-shadow-hover transition-all duration-200">
            <PlayCircle className="h-4 w-4" />
            Simulate Attack
          </Link>
        </div>
      </section>

      {showCriticalAlert && metricsData.alert && (
        <section className="relative mb-6 overflow-hidden rounded-[18px] border border-[#21365e] bg-[#081a38] px-5 py-5 text-white shadow-[0_18px_50px_rgba(8,26,56,0.14)] sm:px-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(47,102,247,0.22),transparent_34%)]" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9eb4db]">Priority intelligence</p>
                <span className="rounded-full border border-[#ff7681]/25 bg-[#ff5263]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#ff9098]">Critical</span>
              </div>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.025em]">Coordinated cluster FRC-0184 requires review</h3>
              <p className="mt-1 text-[13px] leading-6 text-[#9eacc5]">{metricsData.alert.transaction_count} transactions share devices. The policy engine recommends blocking the linked cluster.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 xl:justify-end">
              <Link href="/cases" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[12px] font-semibold text-[#0b1b37] transition hover:bg-[#edf3ff]">
                Investigate <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button onClick={() => setShowCriticalAlert(false)} className="rounded-lg p-2 text-[#8191ad] hover:bg-white/10 hover:text-white" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          return (
            <article key={metric.label} className="group relative flex flex-col gap-4 overflow-hidden rounded-[16px] border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_38px_rgba(13,34,76,0.09)]">
              <span className={`absolute inset-x-0 top-0 h-0.5 ${metric.tone === "blue" ? "bg-primary" : metric.tone === "amber" ? "bg-warning" : metric.tone === "red" ? "bg-danger" : "bg-success"}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.11em] text-text-muted">{metric.label}</span>
              <div className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-text-primary tabular-nums">{metric.value}</div>
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border-subtle">
                <span className="text-caption text-text-secondary truncate">{metric.helper}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <article className="rounded-xl border border-border bg-surface shadow-sm xl:col-span-8 overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-body font-semibold text-text-primary">Risk Activity</h2>

              </div>
              <p className="mt-1 text-label-sm text-text-secondary">Transactions analysed across all payment methods</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg bg-surface-secondary p-1 border border-border-subtle">
                <button onClick={() => setChartMetric("volume")} className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all ${chartMetric === "volume" ? "bg-surface text-primary shadow-sm border border-border-subtle" : "text-text-secondary hover:text-text-primary"}`}>Volume</button>
                <button onClick={() => setChartMetric("risk")} className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-all ${chartMetric === "risk" ? "bg-surface text-primary shadow-sm border border-border-subtle" : "text-text-secondary hover:text-text-primary"}`}>Risk score</button>
              </div>
            </div>
          </div>
          <div className="p-5">
            {chartData.length > 0 ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="analysedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--info)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} domain={chartMetric === "risk" ? [0, 1] : [0, "auto"]} tickFormatter={(value) => chartMetric === "risk" ? `${value.toFixed(1)}` : value >= 1000 ? `${value / 1000}k` : `${value}`} />
                    <Tooltip cursor={{ stroke: "var(--border-strong)", strokeDasharray: "3 3" }} />
                    {chartMetric === "volume" ? (
                      <>
                        <Area type="monotone" dataKey="volume" stroke="var(--primary)" strokeWidth={3} fill="url(#analysedFill)" activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "var(--primary)" }} />
                        <Area type="monotone" dataKey="reviewed" stroke="var(--warning)" strokeWidth={2} fill="transparent" />
                        <Area type="monotone" dataKey="blocked" stroke="var(--danger)" strokeWidth={2} fill="transparent" />
                      </>
                    ) : (
                      <Area type="monotone" dataKey="risk_score" stroke="var(--info)" strokeWidth={3} fill="url(#riskFill)" activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "var(--info)" }} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] w-full flex items-center justify-center text-text-muted">No chart data available</div>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-surface p-6 shadow-sm xl:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-body font-semibold text-text-primary">Decision Distribution</h2>
                <p className="mt-1 text-caption text-text-secondary">Across {total.toLocaleString()} transactions</p>
              </div>
            </div>
            
            <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-border-subtle shadow-inner">
              <div className="h-full bg-success" style={{ width: `${allowPct}%` }} />
              <div className="h-full bg-warning" style={{ width: `${reviewPct}%` }} />
              <div className="h-full bg-danger" style={{ width: `${blockPct}%` }} />
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Allowed", `${allowPct}%`, "bg-success"], 
                ["Reviewed", `${reviewPct}%`, "bg-warning"], 
                ["Blocked", `${blockPct}%`, "bg-danger"]
              ].map(([label, value, colorClass]) => (
                <div key={label} className="bg-surface-secondary p-3 rounded-lg border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${colorClass}`} />
                    <span className="text-caption font-semibold text-text-secondary uppercase ">{label}</span>
                  </div>
                  <p className="mt-2 text-body-lg font-semibold text-text-primary tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 border-t border-border-subtle pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-caption font-semibold text-text-primary">Policy Engine Coverage</p>
                <p className="mt-0.5 text-caption text-text-secondary">Active policies applied</p>
              </div>
              <span className="text-body-lg font-display-sm text-success">100%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border-subtle">
              <div className="h-full w-[100%] rounded-full bg-success" />
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/20 bg-success-soft p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
              <p className="text-caption leading-relaxed text-success font-medium">All decision services are healthy and synchronized.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:col-span-12 pb-12">
        <article className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm w-full">
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h2 className="text-body font-semibold text-text-primary">Recent transactions</h2>
              <p className="mt-1 text-caption text-text-secondary">Persisted risk activity</p>
            </div>
            <Link href="/transactions" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-caption font-semibold text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {transactionsData.length === 0 ? (
              <div className="p-8 text-center text-text-muted">No transactions found</div>
            ) : (
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-caption font-semibold uppercase text-text-muted">
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">ML Risk</th>
                  <th className="px-4 py-3.5">Graph Risk</th>
                  <th className="px-4 py-3.5">Decision</th>
                  <th className="px-5 py-3.5 text-right">Detected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactionsData.slice(0, 10).map((t) => (
                  <tr key={t.transaction_id} className="transition-colors hover:bg-surface-secondary/50 group">
                    <td className="px-5 py-4">
                      <Link href={`/transactions/${t.transaction_id}`} className="text-mono-sm font-mono text-caption font-semibold text-primary group-hover:underline transition-colors">{t.transaction_id}</Link>
                      <p className="mt-1 text-caption text-text-secondary">{t.customer_id}</p>
                    </td>
                    <td className="px-4 py-4 text-label-sm font-semibold text-text-primary tabular-nums">₹{t.amount.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-caption font-semibold text-mono-sm font-mono ${(t.ml_risk ?? 0) >= 0.8 ? "text-danger" : (t.ml_risk ?? 0) >= 0.3 ? "text-warning" : "text-text-secondary"}`}>{(t.ml_risk ?? 0).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-caption font-semibold text-mono-sm font-mono ${(t.graph_risk ?? 0) >= 0.8 ? "text-danger" : (t.graph_risk ?? 0) >= 0.3 ? "text-warning" : "text-text-secondary"}`}>{(t.graph_risk ?? 0).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4"><DecisionBadge decision={t.decision || "PENDING"} /></td>
                    <td className="px-5 py-4 text-right text-caption text-text-muted text-mono-sm font-mono">{t.timestamp ? timeAgo(t.timestamp) : "Just now"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </article>
      </section>

      {notice && (
        <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4 text-label-sm font-medium text-text-primary shadow-lg animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-5 w-5 text-success" />
          {notice}
        </div>
      )}
    </>
  );
}
