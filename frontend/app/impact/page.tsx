"use client";

import { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "../../components/ui";

const protectedTrend = [
  { month: "Mar", protected: 8.2, loss: 3.8 }, { month: "Apr", protected: 10.7, loss: 3.3 }, { month: "May", protected: 12.1, loss: 2.8 },
  { month: "Jun", protected: 13.9, loss: 2.4 }, { month: "Jul", protected: 15.8, loss: 2.1 }, { month: "Aug", protected: 18.4, loss: 1.7 },
];

const interventions = [
  { control: "Coordinated-device block", events: 43, protected: "₹6.42L", color: "bg-[#255df5]", width: 92 },
  { control: "Velocity policy", events: 128, protected: "₹4.87L", color: "bg-[#7446d8]", width: 76 },
  { control: "Identity anomaly review", events: 67, protected: "₹3.14L", color: "bg-[#e58b22]", width: 57 },
  { control: "High-value step-up", events: 31, protected: "₹2.09L", color: "bg-[#315efb]", width: 42 },
];

export default function ImpactPage() {
  const [period, setPeriod] = useState("30D");

  return (
    <div className="rsx-page space-y-5">
      <div className="rounded-xl border border-[#b96800]/20 bg-[#fff7e8] p-4 text-[#b96800]">
        <h3 className="text-[12px] font-bold uppercase tracking-wider">Illustrative Business Impact Scenario</h3>
        <p className="mt-1 text-[11px]">Based on configurable demo assumptions. Not Razorpay production economics.</p>
      </div>
      <PageHeader eyebrow="Business outcomes" title="Risk impact" description="Translate risk decisions into protected revenue, customer experience, operational effort, and measurable business value." actions={<button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] font-bold text-[#536078] opacity-75 cursor-not-allowed" disabled><Download className="h-4 w-4" /> Preview report</button>} />

      <section className="rsx-blueprint rsx-editorial-grid relative overflow-hidden rounded-[10px] border border-[#d7ded9] text-[#111a2d]">
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div><p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#315efb]">Illustrative scenario · Seeded</p><p className="mt-3 text-[40px] font-semibold tracking-[-.06em] sm:text-[46px]">₹18.4L</p><div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-semibold"><span className="border-l-2 border-[#315efb] pl-2 text-[#315efb]">Scenario metric</span><span className="text-[#66726c]">Across 269 automated interventions</span></div><p className="mt-5 max-w-xl text-[11px] leading-5 text-[#5f6b80]">Illustrative scenario: ₹20.1L attempted exposure while recovering ₹1.7L in trusted payments that legacy rules would have blocked.</p></div>
          <div className="grid grid-cols-2 border border-[#cbd4ce] bg-white/75">{[["Loss rate", "0.17%", "Scenario baseline"], ["Good volume saved", "₹1.7L", "False positives avoided"], ["Illustrative analyst-effort", "94h", "Scenario estimate"]].map(([label,value,helper], index) => <div key={label} className={`p-3.5 ${index % 2 ? "border-l border-[#d7ded9]" : ""} ${index > 1 ? "border-t border-[#d7ded9]" : ""}`}><p className="text-[9px] font-extrabold uppercase tracking-wider text-[#7e8983]">{label}</p><p className="mt-1.5 text-[18px] font-semibold tracking-[-.03em]">{value}</p><p className="mt-1 text-[9px] font-medium text-[#7b8680]">{helper}</p></div>)}</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Fraud prevented", value: "₹20.1L", helper: "Attempted value stopped", tone: "border-t-[#315efb]" },
          { label: "False positives saved", value: "₹1.7L", helper: "Trusted payments recovered", tone: "border-t-[#315efb]" },
          { label: "Illustrative analyst savings", value: "₹3.2L", helper: "Scenario estimate", tone: "border-t-[#b47718]" },
          { label: "Net fraud loss", value: "₹1.7L", helper: "Scenario baseline", tone: "border-t-[#d5473e]" },
        ].map((metric) => <div key={metric.label} className={`rsx-card border-t-2 p-4 sm:p-5 ${metric.tone}`}><p className="text-[9px] font-extrabold uppercase tracking-[.1em] text-[#8b95a7]">{metric.label}</p><p className="mt-3 text-[22px] font-semibold tracking-[-.04em] text-[#17233f]">{metric.value}</p><p className="mt-1 text-[10px] font-semibold text-[#7e899b]">{metric.helper}</p></div>)}
      </section>

      <section className="rsx-card flex flex-col gap-4 border-l-2 border-l-[#315efb] p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#315efb]">Decision brief</p><p className="mt-2 text-[12px] font-bold text-[#2a364e]">Graph-enriched device velocity produced the strongest incremental gain.</p><p className="mt-1 max-w-3xl text-[10px] leading-5 text-[#69758a]">Expanding the control to low-history returning accounts could protect an additional ₹78K monthly with limited customer friction.</p></div><button className="shrink-0 border border-[#d5dbd7] bg-white px-3 py-2 text-[10px] font-bold text-[#536078] opacity-75 cursor-not-allowed" disabled>View recommendation</button></section>
    </div>
  );
}
