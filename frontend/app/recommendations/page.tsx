"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, CircleDollarSign, Clock3, Lightbulb, Network, ShieldCheck, Sparkles, X } from "lucide-react";
import { PageHeader } from "../../components/ui";

const recommendations = [
  { id: "REC-204", title: "Tighten device velocity for new accounts", detail: "Block more than 4 payment attempts from one device across newly created accounts within 15 minutes.", type: "Policy", impact: "₹2.1L / month", confidence: 94, urgency: "High", evidence: "18 incidents · 72 payments", icon: ShieldCheck },
  { id: "REC-203", title: "Escalate cluster-linked refunds", detail: "Send refunds associated with a known identity cluster to manual review before settlement.", type: "Workflow", impact: "₹86K / month", confidence: 89, urgency: "High", evidence: "7 clusters · 23 refunds", icon: Network },
  { id: "REC-198", title: "Adjust high-value review threshold", detail: "Raise the review threshold for trusted returning customers to reduce unnecessary friction.", type: "Model", impact: "+1.4% conversion", confidence: 81, urgency: "Medium", evidence: "1,840 good payments", icon: CircleDollarSign },
];

export default function RecommendationsPage() {
  const [resolved, setResolved] = useState<Record<string, "applied" | "dismissed">>({});
  const pending = recommendations.filter((item) => !resolved[item.id]);

  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Agentic intelligence" title="Recommendations" description="Prioritized controls generated from live transaction signals, investigator decisions, and model drift." actions={<Link href="/ai" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#255df5] px-3.5 text-[11px] font-bold text-white shadow-[0_7px_16px_rgba(37,93,245,.2)] hover:bg-[#174bd4]"><Sparkles className="h-4 w-4" /> Ask Investigation AI</Link>} />

      <section className="rsx-blueprint rsx-grid relative overflow-hidden rounded-2xl px-5 py-6 text-white shadow-[0_18px_45px_rgba(37,76,190,.18)] sm:px-7">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/15" /><div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-white/10" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl"><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#c9d7ff]">Today’s intelligence brief</p><h2 className="mt-2 balance text-[21px] font-bold tracking-[-.035em] sm:text-[25px]">Three changes can reduce fraud exposure while protecting ₹1.7L in good payment volume.</h2><p className="mt-2 text-[11px] leading-5 text-[#d7e1ff]">Recommendations are ranked by estimated financial impact and confidence. Every change remains under your control.</p></div>
          <div className="grid shrink-0 grid-cols-3 gap-2 md:w-[315px]">{[["Pending", String(pending.length)], ["Applied", String(Object.values(resolved).filter((v) => v === "applied").length)], ["Confidence", "88%"]].map(([label,value]) => <div key={label} className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur"><p className="text-[8px] font-bold uppercase tracking-wider text-[#cbd7f8]">{label}</p><p className="mt-1 text-[18px] font-bold">{value}</p></div>)}</div>
        </div>
      </section>

      <section className="space-y-3">
        {recommendations.map((item) => {
          const status = resolved[item.id];
          return (
            <article key={item.id} className={`rsx-card overflow-hidden transition-all ${status ? "opacity-70" : "rsx-card-interactive"}`}>
              <div className="grid lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-[#255df5]"><item.icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[9px] font-bold text-[#8792a5]">{item.id}</span><span className="rounded-full bg-[#f0f3f7] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#647086]">{item.type}</span><span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${item.urgency === "High" ? "bg-[#fff0ef] text-[#cf3c32]" : "bg-[#fff7e8] text-[#b96800]"}`}>{item.urgency} priority</span>{status && <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${status === "applied" ? "bg-[#eafaf3] text-[#07845a]" : "bg-[#f0f2f5] text-[#738096]"}`}>{status}</span>}</div>
                      <h2 className="mt-2.5 text-[15px] font-bold tracking-[-.02em] text-[#26324a]">{item.title}</h2><p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-[#69758a]">{item.detail}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-semibold text-[#7e899c]"><span className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5 text-[#8a5cf5]" />{item.evidence}</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />Generated 12 minutes ago</span></div>
                    </div>
                  </div>
                </div>
                <aside className="flex flex-col justify-between border-t border-[#edf0f5] bg-[#fafbfd] p-5 lg:border-l lg:border-t-0">
                  <div><p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8b95a7]">Estimated impact</p><p className="mt-1.5 text-[20px] font-bold tracking-[-.03em] text-[#17233f]">{item.impact}</p><div className="mt-3 flex items-center justify-between text-[9px] font-semibold text-[#7a8598]"><span>AI confidence</span><span>{item.confidence}%</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e7ebf1]"><div className="h-full rounded-full bg-gradient-to-r from-[#255df5] to-[#7446d8]" style={{ width: `${item.confidence}%` }} /></div></div>
                  {!status && <div className="mt-5 flex gap-2"><button onClick={() => setResolved((state) => ({ ...state, [item.id]: "dismissed" }))} aria-label={`Dismiss ${item.title}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe5ee] bg-white text-[#7c8799] hover:bg-[#f5f7fa]"><X className="h-4 w-4" /></button><button onClick={() => setResolved((state) => ({ ...state, [item.id]: "applied" }))} className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#255df5] px-3 text-[10px] font-bold text-white hover:bg-[#174bd4]"><Check className="h-4 w-4" /> Apply safely</button></div>}
                </aside>
              </div>
            </article>
          );
        })}
      </section>

      <Link href="/audit" className="flex items-center justify-between rounded-xl border border-[#e2e7ef] bg-white px-4 py-3 text-[10px] font-bold text-[#526078] hover:border-[#cfd9ea]"><span>Every applied recommendation is versioned and recorded in your audit trail.</span><span className="flex items-center gap-1 text-[#255df5]">View audit trail <ChevronRight className="h-3.5 w-3.5" /></span></Link>
    </div>
  );
}
