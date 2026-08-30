"use client";

import { PageHeader } from "../../components/ui";

export default function AIHubPage() {
  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Investigation intelligence" title="Investigation AI (Demo)" description="Move from signal to an evidence-backed decision without leaving the case context (seeded demo data)." />

      <section className="overflow-hidden rounded-[10px] border border-[#dfe5ee] bg-white">
        <div className="rsx-diagonal-wash flex flex-col gap-4 border-b border-[#dfe5ee] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#315efb]">Illustrative demo scenario</p><h2 className="mt-2 text-[24px] font-semibold tracking-[-.04em] text-[#111a2d]">Ask the evidence, not another dashboard.</h2></div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-[#657187]"><span><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#315efb]"/>Graph connected</span><span>Policy aware</span><span>Active evidence</span></div>
        </div>

        <div className="grid min-h-[590px] lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-[#e3e8f0] bg-[#fafbff] p-5 lg:border-b-0 lg:border-r">
            <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8b95a7]">Investigation context</p>
            <h3 className="mt-3 text-[17px] font-semibold text-[#172237]">Cluster FRC-0184</h3><p className="mt-1 text-[11px] leading-5 text-[#69758a]">Coordinated payment-risk activity across a shared device and instrument.</p>
            <dl className="mt-5 divide-y divide-[#dfe5ee] border-y border-[#dfe5ee]">{[["Exposure","₹4.82L"],["Linked identities","11"],["Entity risk","94 / 100"],["Policy confidence","97%"]].map(([label,value])=><div key={label} className="flex items-center justify-between py-3"><dt className="text-[10px] font-medium text-[#7a8597]">{label}</dt><dd className="text-[11px] font-bold text-[#1a2721]">{value}</dd></div>)}</dl>
            <div className="mt-5"><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8b95a7]">Evidence sequence</p><ol className="mt-3 space-y-3">{["Device fingerprint reused", "Payment instrument shared", "Velocity threshold exceeded", "Cluster confidence confirmed"].map((item,index)=><li key={item} className="flex gap-3 text-[10px] font-medium leading-4 text-[#5f6b80]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cbd3ce] bg-white text-[9px] font-bold text-[#27352f]">{index+1}</span><span className="pt-0.5">{item}</span></li>)}</ol></div>
            <a href="/clusters" className="mt-6 inline-flex border-b border-[#18251f] pb-0.5 text-[10px] font-bold text-[#18251f]">Review cluster details →</a>
          </aside>

          <div className="flex min-w-0 flex-col items-center justify-center p-10 text-center">
            <h2 className="text-xl font-bold text-[#172237] mb-4">AI chat is not part of the current MVP.</h2>
            <p className="text-[#657187]">Investigations are performed by the bounded backend agent<br/>inside the transaction pipeline.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
