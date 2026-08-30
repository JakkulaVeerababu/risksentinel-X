"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const stages = [
  { number: "01", name: "Detect", summary: "Models score the payment in real time.", detail: "Risk model v2 resolves device, velocity and merchant features into a calibrated score.", value: "94 / 100", label: "Risk score" },
  { number: "02", name: "Connect", summary: "Graph intelligence links the evidence.", detail: "Shared device, IP and payment instrument reveal a coordinated cluster across 11 identities.", value: "11", label: "Linked identities" },
  { number: "03", name: "Investigate", summary: "The agent assembles the strongest signals.", detail: "Observed behavior is summarized with source evidence and a bounded recommendation for the analyst.", value: "High", label: "Recommendation confidence" },
  { number: "04", name: "Decide", summary: "Deterministic policy makes the final call.", detail: "Rule RS-204 evaluates the evidence bundle and returns an auditable enforcement outcome.", value: "BLOCK", label: "Final policy result" },
];

export default function ProductSystem() {
  const [active, setActive] = useState(1);
  const reduceMotion = useReducedMotion();
  const stage = stages[active];

  return (
    <div className="grid overflow-hidden border border-[#dce3ed] bg-white lg:grid-cols-[1.18fr_.82fr]">
      <div className="relative min-h-[520px] overflow-hidden border-b border-[#dce3ed] bg-[#f7f9fc] p-5 sm:p-8 lg:border-b-0 lg:border-r">
        <div className="absolute inset-0 landing-risk-grid opacity-70" />
        <div className="relative flex items-center justify-between border-b border-[#dfe5ee] pb-4">
          <div><p className="text-[12px] font-semibold text-[#17233b]">Transaction evidence</p><p className="mt-1 font-mono text-[9px] text-[#7e899b]">pay_PM71JD29 · ₹48,900 · Nova Electronics</p></div>
          <span className="border border-[#f0cbc8] bg-[#fff1f0] px-2 py-1 text-[8px] font-bold text-[#c93830]">CRITICAL</span>
        </div>

        <div className="relative mt-7 h-[292px]" aria-label="Relationship graph linking a payment to device, identity, merchant, IP and payment instrument">
          <svg viewBox="0 0 620 292" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <g fill="none" stroke="#a9bce9" strokeWidth="1.3"><path d="M310 143 L102 65"/><path d="M310 143 L115 235"/><path d="M310 143 L505 60"/><path d="M310 143 L515 226"/><path d="M102 65 L505 60" strokeDasharray="4 6"/><path d="M115 235 L515 226" strokeDasharray="4 6"/></g>
            <motion.path d="M102 65 L310 143 L515 226" fill="none" stroke="#2f6bff" strokeWidth="2" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: active >= 1 ? 1 : .12 }} transition={{ duration: .55, ease: "easeOut" }} />
          </svg>
          {[
            ["Payment", "₹48,900", "50%", "49%", "border-[#efaaa6] bg-[#fff3f2] text-[#b9342d]"],
            ["Device", "DVC-9821", "12%", "20%", "border-[#9db8f8] bg-white text-[#255df5]"],
            ["Customer", "Aarav S.", "14%", "81%", "border-[#ccd5e3] bg-white text-[#43516a]"],
            ["Merchant", "Nova", "84%", "18%", "border-[#ccd5e3] bg-white text-[#43516a]"],
            ["Shared IP", "49.37.***.82", "86%", "78%", "border-[#b8a9e8] bg-white text-[#6245b6]"],
          ].map(([kind, value, left, top, tone]) => <button key={kind} type="button" onClick={() => setActive(kind === "Payment" ? 0 : 1)} className={`absolute -translate-x-1/2 -translate-y-1/2 border px-3 py-2 text-left shadow-[0_3px_12px_rgba(32,51,84,.06)] transition-transform hover:-translate-y-[54%] ${tone}`} style={{ left, top }}><span className="block text-[8px] font-semibold uppercase tracking-[.08em] opacity-60">{kind}</span><span className="mt-1 block whitespace-nowrap font-mono text-[9px] font-semibold">{value}</span></button>)}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-[#315efb] bg-white px-4 py-2.5 shadow-[0_4px_15px_rgba(30,55,95,.07)]"><p className="text-[8px] font-semibold text-[#7d8899]">COORDINATED CLUSTER</p><p className="mt-1 font-mono text-[10px] font-bold text-[#1d2a43]">FRC-0184 · 11 identities</p></div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={stage.name} initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} className="relative mt-6 flex items-end justify-between border-t border-[#dfe5ee] pt-5">
            <div><p className="text-[10px] font-medium text-[#7a8699]">{stage.label}</p><p className={`mt-1 text-[27px] font-semibold tracking-[-.04em] ${stage.name === "Decide" ? "text-[#c93830]" : "text-[#17233b]"}`}>{stage.value}</p></div>
            <p className="max-w-[280px] text-right text-[10px] leading-4 text-[#6f7b90]">{stage.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white">
        {stages.map((item, index) => (
          <button key={item.name} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`group grid w-full grid-cols-[44px_1fr] gap-4 border-b border-[#e5e9f0] px-5 py-6 text-left transition-colors last:border-b-0 sm:px-7 ${active === index ? "bg-[#f7f9ff]" : "hover:bg-[#fbfcfe]"}`}>
            <span className={`font-mono text-[10px] font-semibold transition-colors ${active === index ? "text-[#255df5]" : "text-[#99a3b3]"}`}>{item.number}</span>
            <span><span className="flex items-center justify-between"><span className="text-[17px] font-semibold tracking-[-.02em] text-[#17233b]">{item.name}</span><span className={`h-1.5 w-1.5 bg-[#315efb] transition-opacity ${active === index ? "opacity-100" : "opacity-0"}`} /></span><span className="mt-2 block text-[12px] leading-5 text-[#647188]">{item.summary}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
