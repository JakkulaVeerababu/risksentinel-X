"use client";

import Link from "next/link";
import { PageHeader } from "../../components/ui";

export default function AIHubPage() {
  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Investigation intelligence" title="Investigation AI" description="Move from signal to an evidence-backed decision without leaving the case context." />

      <section className="rsx-data-panel">
        <div className="flex flex-col gap-4 border-b border-[#dfe5ee] bg-white px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#315efb]">Illustrative demo scenario</p><h2 className="mt-2 text-[24px] font-semibold tracking-[-.04em] text-[#111a2d]">Ask the evidence, not another dashboard.</h2></div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-[#657187]"><span className="text-[#255df5]">Graph connected</span><span>Policy aware</span><span>Active evidence</span></div>
        </div>

        <div className="grid min-h-[590px] lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-[#e3e8f0] bg-[#fafbff] p-5 lg:border-b-0 lg:border-r">
            <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8b95a7]">Investigation context</p>
            <h3 className="mt-3 text-[17px] font-semibold text-[#172237]">Cluster FRC-0184</h3><p className="mt-1 text-[11px] leading-5 text-[#69758a]">Coordinated payment-risk activity across a shared device and instrument.</p>
            <dl className="mt-5 divide-y divide-[#dfe5ee] border-y border-[#dfe5ee]">{[["Exposure","₹4,82,000.00"],["Linked identities","11"],["Entity risk","94 / 100"],["Policy confidence","97%"]].map(([label,value])=><div key={label} className="flex items-center justify-between py-3"><dt className="text-[10px] font-medium text-[#7a8597]">{label}</dt><dd className="text-[11px] font-bold text-[#1a2721]">{value}</dd></div>)}</dl>
            <div className="mt-5"><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8b95a7]">Evidence sequence</p><ol className="mt-3 space-y-3">{["Device fingerprint reused", "Payment instrument shared", "Velocity threshold exceeded", "Cluster confidence confirmed"].map((item,index)=><li key={item} className="grid grid-cols-[24px_1fr] gap-2 text-[10px] font-medium leading-4 text-[#5f6b80]"><span className="font-mono text-[#9aa4b4]">{String(index+1).padStart(2,"0")}</span><span>{item}</span></li>)}</ol></div>
            <a href="/clusters" className="mt-6 inline-flex border-b border-[#18251f] pb-0.5 text-[10px] font-bold text-[#18251f]">Review cluster details →</a>
          </aside>

          <div className="min-w-0 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-[#e1e6ee] pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="rsx-section-label">Current assessment</p><h3 className="mt-3 text-[22px] font-semibold tracking-[-.035em] text-[#111a2d]">Coordinated account takeover pattern</h3><p className="mt-2 max-w-[680px] text-[12px] leading-5 text-[#657187]">The strongest signals converge on one shared device and payment instrument. The agent’s role is to assemble the evidence; policy remains the enforcement owner.</p></div>
              <span className="w-fit border border-[#efcbc7] bg-[#fff5f4] px-3 py-2 text-[10px] font-bold uppercase tracking-[.08em] text-[#c33b34]">High confidence · 94%</span>
            </div>

            <div className="mt-6 border-l-2 border-[#d14338] bg-[#fff8f7] px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#c53c34]">Recommended action</p>
              <p className="mt-2 text-[18px] font-semibold text-[#5f211d]">Block the linked high-risk payments and open one coordinated investigation.</p>
              <p className="mt-2 text-[11px] leading-5 text-[#8b514d]">Bounded recommendation only. Rule RS-204 must approve the final outcome.</p>
            </div>

            <div className="mt-7">
              <div className="grid grid-cols-[1fr_.9fr_.55fr] border-b border-[#dfe5ee] pb-2 text-[10px] font-bold uppercase tracking-[.08em] text-[#8b95a7]"><span>Observed signal</span><span>Evidence</span><span className="text-right">Source</span></div>
              {[
                ["Device reuse", "11 linked identities", "Graph"],
                ["Payment instrument", "6 accounts in 17 minutes", "Graph"],
                ["Transaction velocity", "4.8× customer baseline", "Model"],
                ["Policy alignment", "Rule RS-204 matched", "Policy"],
              ].map(([signal,evidence,source]) => <div key={signal} className="grid grid-cols-[1fr_.9fr_.55fr] gap-3 border-b border-[#edf0f5] py-3.5 text-[11px]"><span className="font-semibold text-[#27334b]">{signal}</span><span className="text-[#657187]">{evidence}</span><span className="text-right font-mono text-[#7e899b]">{source}</span></div>)}
            </div>

            <div className="mt-6 flex flex-wrap gap-3"><Link href="/clusters" className="inline-flex h-10 items-center bg-[#245df5] px-4 text-[11px] font-bold text-white hover:bg-[#1747c9]">Review cluster</Link><Link href="/policies" className="inline-flex h-10 items-center border border-[#d4dce8] bg-white px-4 text-[11px] font-bold text-[#46536a] hover:bg-[#f7f9fc]">Inspect policy</Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
