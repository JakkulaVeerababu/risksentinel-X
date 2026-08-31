"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const stages = [
  { name: "Detect", summary: "Device, velocity and merchant signals are scored together.", value: "94 / 100", label: "Calibrated risk score", evidence: ["Unusual transaction velocity", "New account, high-value payment", "Device reused across accounts"] },
  { name: "Connect", summary: "Shared infrastructure reveals a coordinated payment cluster.", value: "11 identities", label: "Connected to this cluster", evidence: ["Device DVC-9821 shared", "Payment instrument reused", "Shared residential IP range"] },
  { name: "Investigate", summary: "The strongest signals form one analyst-ready evidence brief.", value: "High confidence", label: "Investigation recommendation", evidence: ["Coordinated activity identified", "Four evidence sources reviewed", "Recommend block for policy review"] },
  { name: "Decide", summary: "Deterministic policy evaluates the evidence and owns the outcome.", value: "BLOCK", label: "Policy-owned decision", evidence: ["Policy version 12 evaluated", "Rule RS-204 matched", "Decision recorded for audit"] },
];

export default function ProductSystem() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const stage = stages[active];

  return (
    <div className="product-preview overflow-hidden rounded-xl border border-[#dce3ec] bg-white shadow-[0_24px_65px_-35px_rgba(31,63,116,.32)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#e5eaf1] px-5 py-4">
        <div className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-[#2f6bff]" /><p className="text-[12px] font-semibold text-[#26364d]">Payment review</p></div>
        <span className="text-right font-mono text-[10px] text-[#8a96a8]">PREVIEW / CASE-RSX184</span>
      </div>
      <div className="grid grid-cols-4 border-b border-[#e5eaf1]" role="tablist" aria-label="Payment decision stages">
        {stages.map((item, index) => (
          <button key={item.name} id={"stage-" + index} type="button" role="tab" aria-selected={index === active} aria-controls="payment-stage-panel" tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
            let next = index;
            if (event.key === "ArrowRight") next = (index + 1) % stages.length;
            else if (event.key === "ArrowLeft") next = (index + stages.length - 1) % stages.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = stages.length - 1;
            else return;
            event.preventDefault();
            setActive(next);
            document.getElementById("stage-" + next)?.focus();
          }} className={"relative px-2 py-3.5 text-[11px] font-semibold transition-colors " + (index === active ? "bg-[#f2f6ff] text-[#2f6bff]" : "text-[#7b889d] hover:bg-[#fafbfe]")}>
            <span className="mr-1.5 hidden font-mono text-[9px] opacity-60 sm:inline">0{index + 1}</span>{item.name}
            {index === active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#2f6bff]" />}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-[1.04fr_1fr]">
        <div className="px-5 py-6 sm:border-r sm:border-[#e5eaf1]">
          <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#8491a4]">Transaction</p><span className="rounded bg-[#fff1ef] px-2 py-1 text-[9px] font-semibold text-[#ca4338]">Critical</span></div>
          <p className="mt-3 text-[32px] font-semibold leading-none tracking-[-.05em] text-[#17283e]">₹48,900<span className="text-[20px] text-[#9aa5b4]">.00</span></p>
          <p className="mt-2 font-mono text-[10px] text-[#7c8a9f]">pay_PM71JD29</p>
          <dl className="mt-5 divide-y divide-[#e9edf3] border-t border-[#e9edf3]">
            {[["Merchant", "Nova Electronics"], ["Customer", "Aarav S."], ["Device", "DVC-9821"], ["Network", "49.37.***.82"]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-2.5"><dt className="text-[11px] text-[#8290a3]">{label}</dt><dd className="text-[11px] font-medium text-[#3a4b63]">{value}</dd></div>
            ))}
          </dl>
        </div>
        <div id="payment-stage-panel" role="tabpanel" aria-labelledby={"stage-" + active} className="border-t border-[#e5eaf1] bg-[#f8faff] px-5 py-6 sm:border-t-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduceMotion ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : .18 }}>
              <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#8491a4]">{stage.label}</p>
              <p className={"mt-4 text-[28px] font-semibold leading-tight tracking-[-.04em] " + (active === 3 ? "text-[#2f6bff]" : "text-[#17283e]")}>{stage.value}</p>
              <p className="mt-3 min-h-[42px] text-[12px] leading-[1.7] text-[#697990]">{stage.summary}</p>
              <ul className="mt-5 space-y-3">
                {stage.evidence.map(item => <li key={item} className="flex items-start gap-2 text-[11px] leading-4 text-[#51637c]"><span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[#2f6bff]" />{item}</li>)}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[#e1e7f0] bg-[#f1f5ff] px-5 py-3.5">
        <span className="text-[10px] text-[#6d7f99]">One payment. One accountable record.</span>
        <span className="whitespace-nowrap text-[10px] font-semibold text-[#2f6bff]">Policy owns the outcome</span>
      </div>
    </div>
  );
}
