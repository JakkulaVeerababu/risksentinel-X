"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, Download, Filter } from "lucide-react";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { fetchDashboardMetrics, DashboardMetrics } from "../../lib/api";

const weekly = [
  { day: "Mon", volume: 18200, risky: 420, blocked: 98 }, { day: "Tue", volume: 21500, risky: 510, blocked: 126 }, { day: "Wed", volume: 19800, risky: 448, blocked: 112 },
  { day: "Thu", volume: 24300, risky: 590, blocked: 151 }, { day: "Fri", volume: 26800, risky: 640, blocked: 169 }, { day: "Sat", volume: 22600, risky: 487, blocked: 123 }, { day: "Sun", volume: 24100, risky: 532, blocked: 137 },
];

const reasons = [{ name: "Device velocity", value: 34, color: "#245df5" }, { name: "Network cluster", value: 27, color: "#5f82df" }, { name: "Amount anomaly", value: 21, color: "#90a6da" }, { name: "Identity mismatch", value: 18, color: "#d14338" }];
const hourly = [{ hour: "00", rate: 1.8 }, { hour: "03", rate: 1.5 }, { hour: "06", rate: 2.1 }, { hour: "09", rate: 2.8 }, { hour: "12", rate: 3.4 }, { hour: "15", rate: 2.7 }, { hour: "18", rate: 2.4 }, { hour: "21", rate: 3.1 }];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7D");
  const [notice, setNotice] = useState(false);
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
  }, []);

  return (
    <div className="rsx-page space-y-5">
      <div className="flex items-center justify-between border border-[#dce3ed] border-l-2 border-l-[#245df5] bg-white p-4 text-[#4f5c72]">
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#245df5]">Benchmark analytics mode</h3>
          <p className="mt-1 text-[11px]">Core top-line metrics reflect live backend data. Advanced charts below use synthetic benchmark data for feature demonstration.</p>
        </div>
      </div>
      <PageHeader eyebrow="Performance intelligence" title="Risk analytics" description="Understand payment quality, decision performance, fraud patterns, and customer impact across the full risk funnel." actions={<><button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] font-bold text-[#536078]"><CalendarDays className="h-4 w-4" />Benchmark scenario</button><button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#255df5] px-3.5 text-[11px] font-bold text-white opacity-75 cursor-not-allowed" disabled><Download className="h-4 w-4" /> Preview report</button></>} />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Live Analysed", value: loading ? "..." : metrics?.kpis?.transactions_analysed ?? 0, helper: "Real backend data", positive: true },
          { label: "Live Blocked", value: loading ? "..." : metrics?.kpis?.blocked ?? 0, helper: "Real backend data", positive: true },
          { label: "Synthetic F-P Rate", value: "1.26%", helper: "Benchmark static", positive: true },
          { label: "Median decision time", value: "184 ms", helper: "Simulated processing", positive: false },
        ].map((metric) => <div key={metric.label} className="rsx-stat-card"><p className="rsx-stat-label">{metric.label}</p><p className="rsx-stat-value">{metric.value}</p><p className="rsx-stat-helper">{metric.helper}</p></div>)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
        <div className="rsx-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-[13px] font-bold text-[#253149]">Decision performance (Demo)</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">Processed volume with risky and blocked overlays</p></div><div className="flex items-center gap-1 rounded-lg bg-[#f3f5f8] p-0.5">{["24H","7D","30D"].map((item) => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-extrabold ${period === item ? "bg-white text-[#255df5] shadow-sm" : "text-[#7f899a]"}`}>{item}</button>)}</div></div>
          <div className="h-[330px] p-4 sm:p-5">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly}><defs><linearGradient id="analyticsVolume" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#255df5" stopOpacity={0.24}/><stop offset="100%" stopColor="#255df5" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f5"/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#8a94a6" }}/><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#8a94a6" }} tickFormatter={(value) => `${value/1000}k`}/><Tooltip contentStyle={{ borderRadius: 10, borderColor: "#e1e6ee", fontSize: 11, boxShadow: "0 10px 30px rgba(16,24,40,.1)" }}/><Area type="monotone" dataKey="volume" name="Analysed" stroke="#255df5" strokeWidth={2.5} fill="url(#analyticsVolume)"/><Area type="monotone" dataKey="risky" name="High risk" stroke="#e5484d" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 border-t border-[#edf0f5] bg-[#fafbfd]">{[["Analysed", "157.3K"], ["High risk", "3,627"], ["Blocked", "916"]].map(([label,value]) => <div key={label} className="border-r border-[#edf0f5] px-4 py-3 last:border-r-0"><p className="text-[10px] font-bold uppercase tracking-wider text-[#909aab]">{label}</p><p className="mt-1 text-[14px] font-bold text-[#344158]">{value}</p></div>)}</div>
        </div>

        <div className="rsx-card overflow-hidden">
          <div className="border-b border-[#edf0f5] px-5 py-4"><h2 className="text-[13px] font-bold text-[#253149]">Risk signal mix (Demo)</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">Share of high-risk decisions</p></div>
          <div className="relative h-[220px] p-3"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={reasons} dataKey="value" innerRadius={57} outerRadius={82} paddingAngle={3} stroke="none">{reasons.map((reason) => <Cell key={reason.name} fill={reason.color}/>)}</Pie><Tooltip contentStyle={{ borderRadius: 10, borderColor: "#e1e6ee", fontSize: 10 }}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[22px] font-bold tracking-[-.04em] text-[#17233f]">3,627</span><span className="text-[10px] font-bold uppercase tracking-wider text-[#8b95a7]">signals</span></div></div>
          <div className="space-y-2 px-5 pb-5">{reasons.map((reason) => <div key={reason.name} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{background: reason.color}}/><span className="flex-1 text-[10px] font-semibold text-[#5f6b80]">{reason.name}</span><span className="text-[10px] font-bold text-[#344158]">{reason.value}%</span></div>)}</div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rsx-card overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4"><div><h2 className="text-[13px] font-bold">Risk rate by hour (Demo)</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">High-risk share of analysed payments</p></div><button className="rounded-lg border border-[#e1e6ee] p-2 text-[#7c8799]"><Filter className="h-4 w-4" /></button></div><div className="h-[250px] p-5"><ResponsiveContainer width="100%" height="100%"><BarChart data={hourly}><CartesianGrid vertical={false} stroke="#edf0f5"/><XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{fontSize:9,fill:"#8a94a6"}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:9,fill:"#8a94a6"}} tickFormatter={(value)=>`${value}%`}/><Tooltip contentStyle={{borderRadius:10,borderColor:"#e1e6ee",fontSize:10}}/><Bar dataKey="rate" name="Risk rate" fill="#7446d8" radius={[5,5,0,0]} maxBarSize={28}/></BarChart></ResponsiveContainer></div></div>
        <div className="rsx-card p-5"><div><p className="rsx-section-label">Model evaluation metrics</p><h2 className="mt-2 text-[16px] font-bold text-[#17233f]">IEEE-CIS held-out baseline</h2></div><div className="mt-6 space-y-4">{[["IEEE-CIS Precision", "45.35%", 45], ["IEEE-CIS Recall", "46.35%", 46], ["IEEE-CIS F1", "45.85%", 46]].map(([label,value,width]) => <div key={String(label)}><div className="flex justify-between text-[10px] font-semibold"><span className="text-[#647188]">{label}</span><span className="text-[#17233f]">{value}</span></div><div className="mt-2 h-1.5 overflow-hidden bg-[#edf0f5]"><div className="h-full bg-[#245df5]" style={{width:`${width}%`}}/></div></div>)}</div><p className="mt-6 border-l-2 border-[#245df5] bg-[#f7f9fc] p-3 text-[10px] leading-5 text-[#647188]">These are baseline metrics on the held-out 88,581 samples with a 0.80 decision threshold.</p></div>
      </section>

      {notice && <div className="fixed bottom-5 right-5 z-[120] border border-[#cdd9f8] border-l-2 border-l-[#315efb] bg-white px-4 py-3 text-[11px] font-bold text-[#315efb] shadow-[0_16px_40px_rgba(16,24,40,.15)]">Analytics report exported</div>}
    </div>
  );
}
