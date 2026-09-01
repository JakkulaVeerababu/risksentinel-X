"use client";

import { useState, useEffect } from "react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Filter } from "lucide-react";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { fetchDashboardMetrics, DashboardMetrics } from "../../lib/api";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("24H");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
    const interval = setInterval(loadMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = metrics?.chart_data || [];
  const riskDist = [
    { name: "Low Risk", value: metrics?.distribution?.low || 0, color: "#90a6da" },
    { name: "Medium Risk", value: metrics?.distribution?.medium || 0, color: "#5f82df" },
    { name: "High Risk", value: metrics?.distribution?.high || 0, color: "#245df5" },
    { name: "Critical Risk", value: metrics?.distribution?.critical || 0, color: "#d14338" }
  ].filter(d => d.value > 0);
  const totalDist = riskDist.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rsx-page space-y-10">
      <PageHeader 
        eyebrow="Performance intelligence" 
        title="Risk analytics" 
        description="Understand payment quality, decision performance, and evaluation metrics across the risk stack." 
      />

      {/* SECTION 1 - RUNTIME OPERATIONS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="rsx-rule-heading">Runtime operations</h2>
          <span className="text-[10px] font-semibold text-primary">Live API data</span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rsx-card p-5">
            <p className="text-[11px] font-semibold uppercase text-text-muted mb-1">Transactions Analysed</p>
            <p className="text-[28px] font-bold tracking-tight text-text-primary">
              {loading ? "..." : metrics?.kpis?.transactions_analysed ?? 0}
            </p>
          </div>
          <div className="rsx-card p-5">
            <p className="text-[11px] font-semibold uppercase text-text-muted mb-1">Approved Payments</p>
            <p className="text-[28px] font-bold tracking-tight text-success">
              {loading ? "..." : metrics?.kpis?.allowed ?? 0}
            </p>
          </div>
          <div className="rsx-card p-5">
            <p className="text-[11px] font-semibold uppercase text-text-muted mb-1">Sent to Agent Review</p>
            <p className="text-[28px] font-bold tracking-tight text-warning">
              {loading ? "..." : metrics?.kpis?.under_review ?? 0}
            </p>
          </div>
          <div className="rsx-card p-5">
            <p className="text-[11px] font-semibold uppercase text-text-muted mb-1">Blocked Payments</p>
            <p className="text-[28px] font-bold tracking-tight text-danger">
              {loading ? "..." : metrics?.kpis?.blocked ?? 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rsx-card p-5">
            <p className="text-[11px] font-semibold uppercase text-text-muted mb-3">High-Risk Count (ML Score {'>'} 0.7)</p>
            <p className="text-[28px] font-bold tracking-tight text-danger">
              {loading ? "..." : ((metrics?.distribution?.high ?? 0) + (metrics?.distribution?.critical ?? 0))}
            </p>
            <p className="mt-2 text-[11px] text-text-secondary">Current high and critical risk payments identified by the model.</p>
          </div>
          <div className="rsx-card p-5">
            <p className="text-[11px] font-semibold uppercase text-text-muted mb-3">Decision Distribution</p>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-secondary">
              {loading ? (
                 <div className="h-full bg-border w-full animate-pulse" />
              ) : (
                <>
                  <div className="h-full bg-success" style={{ width: `${(metrics?.kpis?.allowed ?? 0) / Math.max(1, (metrics?.kpis?.transactions_analysed ?? 1)) * 100}%` }} />
                  <div className="h-full bg-warning" style={{ width: `${(metrics?.kpis?.under_review ?? 0) / Math.max(1, (metrics?.kpis?.transactions_analysed ?? 1)) * 100}%` }} />
                  <div className="h-full bg-danger" style={{ width: `${(metrics?.kpis?.blocked ?? 0) / Math.max(1, (metrics?.kpis?.transactions_analysed ?? 1)) * 100}%` }} />
                </>
              )}
            </div>
            <div className="mt-3 flex gap-4 text-[11px] font-semibold text-text-secondary">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success"></span>Allow</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning"></span>Review</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger"></span>Block</div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 2 - MODEL QUALITY */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="rsx-rule-heading">Model quality</h2>
          <span className="text-[10px] font-semibold text-primary">Verified benchmark</span>
        </div>

        <div className="rsx-card overflow-hidden">
          <div className="bg-surface-secondary/50 p-5 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-bold text-text-primary">IEEE-CIS held-out evaluation</h3>
              <p className="text-[12px] text-text-secondary mt-1">Benchmark on a static test set to verify ML baseline quality.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-text-muted">Total Rows</p>
              <p className="text-[16px] font-bold text-text-primary font-mono">88,581</p>
            </div>
          </div>
          
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Threshold</p>
              <p className="text-[20px] font-bold text-text-primary">0.80</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Average Precision</p>
              <p className="text-[20px] font-bold text-text-primary">0.4810</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Precision</p>
              <p className="text-[20px] font-bold text-text-primary">0.4535</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Recall</p>
              <p className="text-[20px] font-bold text-text-primary">0.4635</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">F1 Score</p>
              <p className="text-[20px] font-bold text-text-primary">0.4585</p>
            </div>
          </div>
          
          <div className="bg-surface-secondary/30 p-5 border-t border-border grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-3 border border-border bg-white rounded-lg">
              <p className="text-[10px] uppercase font-bold text-text-muted">True Positive</p>
              <p className="text-[18px] font-bold text-success font-mono mt-1">1,429</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border border-border bg-white rounded-lg">
              <p className="text-[10px] uppercase font-bold text-text-muted">False Positive</p>
              <p className="text-[18px] font-bold text-warning font-mono mt-1">1,722</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border border-border bg-white rounded-lg">
              <p className="text-[10px] uppercase font-bold text-text-muted">True Negative</p>
              <p className="text-[18px] font-bold text-text-primary font-mono mt-1">83,776</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border border-border bg-white rounded-lg">
              <p className="text-[10px] uppercase font-bold text-text-muted">False Negative</p>
              <p className="text-[18px] font-bold text-danger font-mono mt-1">1,654</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - GRAPH BENCHMARK */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="rsx-rule-heading">Graph benchmark</h2>
          <span className="text-[10px] font-semibold text-primary">Synthetic graph evaluation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rsx-card p-5">
            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Precision</p>
            <p className="text-[24px] font-bold text-text-primary">0.9040</p>
          </div>
          <div className="rsx-card p-5">
            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Recall</p>
            <p className="text-[24px] font-bold text-text-primary">0.9912</p>
          </div>
          <div className="rsx-card p-5">
            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">F1 Score</p>
            <p className="text-[24px] font-bold text-text-primary">0.9456</p>
          </div>
        </div>
      </section>

      {/* SECTION 4 - DEMO CHARTS */}
      <section className="space-y-4 border-t border-border pt-6">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="rsx-rule-heading">Decision visualization</h2>
          <span className="text-[10px] font-semibold text-text-muted">Live 24H volume</span>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
          <div className="rsx-card overflow-hidden border-[#dce5f1] bg-white shadow-[0_18px_52px_rgba(37,93,245,0.07)]">
            <div className="relative border-b border-[#e9eef6] px-5 py-5 sm:px-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2f6bff] to-transparent opacity-70" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#2f6bff] shadow-[0_0_0_5px_rgba(47,107,255,0.10)]" />
                    <h2 className="text-[15px] font-semibold tracking-[-.015em] text-[#18243a]">Decision activity</h2>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-5 text-[#75839a]">Payment volume and the decisions requiring risk intervention.</p>
                </div>
                <span className="w-fit rounded-full border border-[#dbe6fa] bg-[#f5f8ff] px-3 py-1.5 text-[10px] font-semibold text-[#45617f]">Last 24 hours</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold text-[#5f6f86]" aria-label="Chart legend">
                <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#2f6bff]" />Analysed</span>
                <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f0a020]" />Review</span>
                <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#e5484d]" />Blocked</span>
              </div>
            </div>
            <div className="px-4 pb-5 pt-4 sm:px-6 sm:pt-5">
              <div className="h-[318px] rounded-2xl border border-[#edf1f7] bg-[linear-gradient(180deg,#fbfdff_0%,#ffffff_100%)] px-2 pb-2 pt-4 sm:px-3">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 6, right: 10, bottom: 2, left: -10 }}>
                    <defs>
                      <linearGradient id="analyticsVolume" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f6bff" stopOpacity={0.22}/><stop offset="72%" stopColor="#2f6bff" stopOpacity={0.035}/><stop offset="100%" stopColor="#2f6bff" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#e8edf5" strokeDasharray="3 5" />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={22} tickMargin={12} tick={{ fontSize: 10, fill: "#8491a6" }} />
                    <YAxis tickLine={false} axisLine={false} width={34} tick={{ fontSize: 9, fill: "#96a1b3" }} />
                    <Tooltip cursor={{ stroke: "#b8caff", strokeWidth: 1, strokeDasharray: "4 4" }} contentStyle={{ borderRadius: 12, border: "1px solid #dce5f2", background: "rgba(255,255,255,.97)", padding: "10px 12px", fontSize: 11, boxShadow: "0 14px 36px rgba(25,45,90,.12)" }} labelStyle={{ color: "#738198", fontWeight: 600, marginBottom: 6 }} itemStyle={{ fontWeight: 600 }} />
                    <Area type="monotone" dataKey="volume" name="Analysed" stroke="#2f6bff" strokeWidth={2.5} fill="url(#analyticsVolume)" activeDot={{ r: 4, fill: "#ffffff", stroke: "#2f6bff", strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="reviewed" name="Review" stroke="#f0a020" strokeWidth={2} dot={false} activeDot={{ r: 3.5, fill: "#ffffff", stroke: "#f0a020", strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="blocked" name="Blocked" stroke="#e5484d" strokeWidth={2} dot={false} activeDot={{ r: 3.5, fill: "#ffffff", stroke: "#e5484d", strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 border-t border-[#e9eef6] bg-[#fbfcfe] sm:grid-cols-3">
              {[
                { label: "Analysed", note: "Total processed", value: metrics?.kpis?.transactions_analysed ?? 0, color: "#2f6bff" },
                { label: "Review", note: "Requires attention", value: metrics?.kpis?.under_review ?? 0, color: "#f0a020" },
                { label: "Blocked", note: "Risk prevented", value: metrics?.kpis?.blocked ?? 0, color: "#e5484d" }
              ].map(item => <div key={item.label} className="relative border-b border-[#e9eef6] px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <span className="absolute bottom-4 left-0 top-4 w-0.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8995a8]">{item.label}</p><p className="mt-1 text-[10px] text-[#98a3b4]">{item.note}</p></div>
                  <p className="text-[22px] font-semibold tracking-[-.04em] text-[#1b2a42]">{item.value}</p>
                </div>
              </div>)}
            </div>
          </div>

          <div className="rsx-card overflow-hidden">
            <div className="border-b border-[#edf0f5] px-5 py-4">
              <h2 className="text-[13px] font-bold text-[#253149]">Risk Distribution</h2>
              <p className="mt-0.5 text-[10px] text-[#8b95a7]">Share of transactions by risk level</p>
            </div>
            <div className="relative h-[220px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDist} dataKey="value" innerRadius={57} outerRadius={82} paddingAngle={3} stroke="none">
                    {riskDist.map((reason) => <Cell key={reason.name} fill={reason.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, borderColor: "#e1e6ee", fontSize: 10 }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[22px] font-bold tracking-[-.04em] text-[#17233f]">{totalDist}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b95a7]">signals</span>
              </div>
            </div>
            <div className="space-y-2 px-5 pb-5">
              {riskDist.map((reason) => (
                <div key={reason.name} className="flex items-center gap-2">
                  <i className="h-2 w-2 rounded-full" style={{background: reason.color}}/>
                  <span className="flex-1 text-[10px] font-semibold text-[#5f6b80]">{reason.name}</span>
                  <span className="text-[10px] font-bold text-[#344158]">{Math.round((reason.value / Math.max(1, totalDist)) * 100)}%</span>
                </div>
              ))}
              {riskDist.length === 0 && <div className="text-center text-[10px] text-text-muted py-5">No risk distribution data</div>}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rsx-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4">
              <div>
                <h2 className="text-[13px] font-bold">Average Risk Score by Hour (24H)</h2>
                <p className="mt-0.5 text-[10px] text-[#8b95a7]">Model output distribution over time</p>
              </div>
            </div>
            <div className="h-[250px] p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#edf0f5"/>
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{fontSize:9,fill:"#8a94a6"}}/>
                  <YAxis tickLine={false} axisLine={false} tick={{fontSize:9,fill:"#8a94a6"}} />
                  <Tooltip contentStyle={{borderRadius:10,borderColor:"#e1e6ee",fontSize:10}}/>
                  <Bar dataKey="risk_score" name="Avg Risk Score" fill="#7446d8" radius={[5,5,0,0]} maxBarSize={28}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
