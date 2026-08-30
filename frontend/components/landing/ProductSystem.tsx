"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const stages = [
  { number: "01", name: "Detect", summary: "Models score the payment against device, velocity and merchant features.", value: "94 / 100", label: "Calibrated risk score" },
  { number: "02", name: "Connect", summary: "Graph intelligence resolves the shared infrastructure behind the payment.", value: "11 identities", label: "Connected evidence" },
  { number: "03", name: "Investigate", summary: "The strongest signals are assembled into one reviewable evidence brief.", value: "High confidence", label: "Analyst recommendation" },
  { number: "04", name: "Decide", summary: "Policy RS-204 evaluates the evidence and returns the final outcome.", value: "BLOCK", label: "Policy-owned decision" },
];

const evidence = [
  ["Device", "DVC-9821", "6 accounts"],
  ["Customer", "Aarav S.", "Identity verified"],
  ["Network", "49.37.***.82", "Shared IP"],
];

export default function ProductSystem() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const stage = stages[active];

  return (
    <div className="relative grid overflow-hidden rounded-[14px] border border-[#d5dfec] bg-[#d8e0ec] shadow-[0_24px_64px_-40px_rgba(13,34,68,.42)] lg:grid-cols-12">
      <span className="absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-[#77a0ff] via-[#2f6bff] to-[#78ebf7]" />
      <section className="relative flex min-h-[440px] flex-col bg-[#f8faff] p-6 sm:p-8 lg:col-span-5 lg:row-span-2 lg:p-9">
        <div className="absolute inset-0 landing-risk-grid opacity-40" />
        <div className="relative flex items-start justify-between border-b border-[#dce3ed] pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#255df5]">Live payment review</p>
            <p className="mt-2 font-mono text-[10px] text-[#7c8799]">CASE-RSX184 · 14:32:08 IST</p>
          </div>
          <span className="border border-[#efb5b1] bg-[#fff5f4] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.08em] text-[#c93830]">Critical</span>
        </div>

        <div className="relative mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#8a95a7]">Transaction under review</p>
          <p className="mt-3 font-mono text-[18px] font-semibold tracking-[-.02em] text-[#17233f]">pay_PM71JD29</p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <p className="text-[31px] font-semibold tracking-[-.05em] text-[#17233f]">₹48,900.00</p>
            <p className="text-right text-[10px] leading-4 text-[#79869a]">Nova Electronics<br />Card payment</p>
          </div>
        </div>

        <dl className="relative mt-7 divide-y divide-[#dfe5ee] border-y border-[#dfe5ee]">
          {evidence.map(([label, value, detail]) => (
            <div key={label} className="grid grid-cols-[82px_1fr_auto] items-center gap-3 py-4">
              <dt className="text-[10px] font-medium text-[#7c8799]">{label}</dt>
              <dd className="font-mono text-[11px] font-semibold text-[#263249]">{value}</dd>
              <dd className="text-right text-[9px] text-[#8792a4]">{detail}</dd>
            </div>
          ))}
        </dl>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={stage.name} initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="relative mt-auto border-t border-[#cfd8e6] pt-6">
            <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#6f7d92]">{stage.label}</p>
            <p className={`mt-2 text-[25px] font-semibold tracking-[-.04em] ${stage.name === "Decide" ? "text-[#c93830]" : "text-[#17233f]"}`}>{stage.value}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="flex min-h-[270px] flex-col bg-[#edf3ff] p-6 sm:p-8 lg:col-span-7 lg:p-9">
        <div className="grid gap-7 sm:grid-cols-[1fr_1.15fr] sm:items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#255df5]">Decision infrastructure</p>
            <h3 className="mt-4 max-w-[390px] text-[28px] font-semibold leading-[1.08] tracking-[-.045em] text-[#12203a] sm:text-[33px]">Evidence moves as one accountable record.</h3>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={stage.summary} initial={reduceMotion ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="border-l border-[#b8c9e8] pl-5 sm:mt-1">
              <p className="font-mono text-[9px] font-semibold text-[#6580b2]">STEP {stage.number}</p>
              <p className="mt-4 text-[18px] font-semibold text-[#17233f]">{stage.name}</p>
              <p className="mt-3 text-[12px] leading-6 text-[#61718a]">{stage.summary}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-auto grid border-y border-[#c7d5ec] sm:grid-cols-4">
          {stages.map((item, index) => {
            const isActive = index === active;
            return (
              <button key={item.name} type="button" onClick={() => setActive(index)} aria-pressed={isActive} className={`relative min-h-[78px] border-b border-[#c7d5ec] px-3 py-4 text-left transition-colors last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${isActive ? "bg-white text-[#17233f]" : "text-[#71809a] hover:bg-white/50"}`}>
                {isActive && <span className="absolute inset-x-0 top-0 h-[2px] bg-[#2f6bff]" />}
                <span className="block font-mono text-[8px] text-[#8090ab]">{item.number}</span>
                <span className="mt-2 block text-[11px] font-semibold">{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="min-h-[180px] bg-white p-6 sm:p-8 lg:col-span-4">
        <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#8490a3]">Connected evidence</p>
        <div className="mt-5 flex items-end justify-between border-b border-[#e1e6ee] pb-5">
          <div><p className="font-mono text-[10px] font-semibold text-[#255df5]">FRC-0184</p><p className="mt-2 text-[17px] font-semibold text-[#17233f]">Coordinated cluster</p></div>
          <p className="text-[36px] font-semibold leading-none tracking-[-.06em] text-[#17233f]">11</p>
        </div>
        <p className="mt-5 text-[11px] leading-5 text-[#6c788c]">One device, four payment instruments and a shared network range connect the identities.</p>
      </section>

      <section className="relative min-h-[180px] overflow-hidden bg-gradient-to-br from-[#2f6bff] to-[#2459e6] p-6 text-white sm:p-8 lg:col-span-3">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[32px] border-white/[.06]" />
        <div className="relative flex h-full flex-col">
          <p className="text-[9px] font-bold uppercase tracking-[.15em] text-white/65">Policy authority</p>
          <p className="mt-5 font-mono text-[10px] text-white/70">RS-204 · Rule matched</p>
          <p className="mt-2 text-[31px] font-semibold tracking-[-.05em]">BLOCK</p>
          <p className="mt-auto border-t border-white/25 pt-4 text-[10px] leading-5 text-white/75">Final enforcement remains deterministic, attributable and ready for audit.</p>
        </div>
      </section>
    </div>
  );
}
