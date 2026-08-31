"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const payments = [
  {
    id: "pay_PM71JD29",
    merchant: "Nova Electronics",
    amount: "₹48,900.00",
    score: 94,
    risk: "Critical",
    decision: "BLOCK",
    decisionTone: "border-[#f2cbc8] bg-[#fff1f0] text-[#c93830]",
    device: "dev_4F892",
    ip: "49.37.***.82",
    links: "11 identities",
    policy: "RS-204",
    recommendation: "Escalate for block review",
  },
  {
    id: "pay_NX82KL81",
    merchant: "UrbanCart",
    amount: "₹12,840.00",
    score: 87,
    risk: "High",
    decision: "REVIEW",
    decisionTone: "border-[#f2ddb9] bg-[#fff8e9] text-[#a85a00]",
    device: "dev_8B170",
    ip: "103.24.***.16",
    links: "4 entities",
    policy: "RS-118",
    recommendation: "Route to analyst review",
  },
  {
    id: "pay_KL92PQ44",
    merchant: "Zomato",
    amount: "₹840.00",
    score: 12,
    risk: "Low",
    decision: "ALLOW",
    decisionTone: "border-[#cbd9fb] bg-[#edf3ff] text-[#255df5]",
    device: "dev_3A921",
    ip: "106.51.***.40",
    links: "No risky links",
    policy: "RS-012",
    recommendation: "No intervention required",
  },
  {
    id: "pay_LP84MN20",
    merchant: "CloudStore",
    amount: "₹24,800.00",
    score: 79,
    risk: "High",
    decision: "REVIEW",
    decisionTone: "border-[#f2ddb9] bg-[#fff8e9] text-[#a85a00]",
    device: "dev_6C244",
    ip: "117.98.***.72",
    links: "3 merchants",
    policy: "RS-118",
    recommendation: "Verify merchant relationship",
  },
];

export default function LiveRiskPreview() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [processed, setProcessed] = useState(14892);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setSelected((value) => (value + 1) % payments.length);
      setProcessed((value) => value + 1);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const active = payments[selected];

  return (
    <div className="landing-product-frame relative w-full overflow-hidden text-[#17213a]">
      <div className="flex h-[58px] items-center border-b border-[#e5eaf2] px-4 sm:px-5">
        <div>
          <p className="text-[12px] font-semibold text-[#17213a]">Payment risk operations</p>
          <p className="mt-3 text-right text-[9px] font-medium text-[#6f809d]">PRODUCT PREVIEW · Payment decision workflow</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[9px] font-semibold text-[#536078]"><span className="landing-live-dot" />Live monitoring</div>
      </div>

      <div className="grid grid-cols-3 border-b border-[#e5eaf2] bg-[#fbfcfe]">
        {[
          ["Payment volume", "₹1,24,00,000.00", "Today"],
          ["Transactions", processed.toLocaleString("en-IN"), "Processed"],
          ["Loss prevented", "₹18,40,000.00", "269 interventions"],
        ].map(([label, value, helper], index) => (
          <div key={label} className={`px-3 py-3.5 sm:px-5 sm:py-4 ${index < 2 ? "border-r border-[#e5eaf2]" : ""}`}>
            <p className="text-[8px] font-semibold uppercase tracking-[.08em] text-[#8994a6] sm:text-[9px]">{label}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={value} initial={reduceMotion ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} className="mt-1 text-[16px] font-semibold tracking-[-.035em] text-[#17213a] sm:text-[21px] tabular-nums">{value}</motion.p>
            </AnimatePresence>
            <p className="mt-0.5 hidden text-[9px] text-[#929cad] sm:block">{helper}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-[minmax(0,1fr)_224px]">
        <div className="min-w-0 border-b border-[#e5eaf2] sm:border-b-0 sm:border-r">
          <div className="flex h-12 items-center justify-between border-b border-[#e5eaf2] px-4 sm:px-5">
            <div><p className="text-[11px] font-semibold text-[#263149]">Live transaction stream</p><p className="mt-0.5 text-[8px] text-[#8c96a7]">Model, graph and policy outcomes</p></div>
            <span className="border-b border-[#315efb] pb-1 text-[9px] font-semibold text-[#255df5]">All payments</span>
          </div>
          <div className="grid grid-cols-[1.25fr_.65fr_.55fr] border-b border-[#edf0f5] bg-[#fafbfd] px-4 py-2 text-[8px] font-semibold uppercase tracking-[.08em] text-[#929cad] sm:px-5"><span>Payment</span><span>Risk</span><span className="text-right">Decision</span></div>
          {payments.map((payment, index) => (
            <button key={payment.id} type="button" onClick={() => setSelected(index)} className={`relative grid w-full grid-cols-[1.25fr_.65fr_.55fr] items-center px-4 py-3 text-left transition-colors sm:px-5 ${index < payments.length - 1 ? "border-b border-[#edf0f5]" : ""} ${selected === index ? "bg-[#f4f7ff]" : "hover:bg-[#fafbfd]"}`}>
              {selected === index && <motion.span layoutId="landing-row" className="absolute inset-y-0 left-0 w-0.5 bg-[#315efb]" transition={{ duration: .22 }} />}
              <span className="min-w-0"><span className="block truncate font-mono text-[8px] font-semibold text-[#255df5] sm:text-[9px]">{payment.id}</span><span className="mt-0.5 block truncate text-[8px] text-[#748095] sm:text-[9px]">{payment.merchant} · {payment.amount}</span></span>
              <span className={`text-[9px] font-semibold tabular-nums ${payment.score >= 90 ? "text-[#d14338]" : payment.score >= 70 ? "text-[#a85a00]" : "text-[#255df5]"}`}>{payment.score} · {payment.risk}</span>
              <span className={`justify-self-end border px-1.5 py-1 text-[7px] font-bold sm:px-2 sm:text-[8px] ${payment.decisionTone}`}>{payment.decision}</span>
            </button>
          ))}
        </div>

        <aside className="bg-[#fbfcff] p-4 sm:p-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active.id} initial={reduceMotion ? false : { opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }} transition={{ duration: .22 }}>
              <div className="flex items-center justify-between"><p className="font-mono text-[9px] font-semibold text-[#255df5]">{active.id}</p><span className={`border px-2 py-1 text-[8px] font-bold ${active.decisionTone}`}>{active.risk}</span></div>
              <p className="mt-4 text-[13px] font-semibold leading-5 text-[#202b43]">Selected payment investigation</p>
              <p className="mt-2 text-[10px] leading-4 text-[#657188]">{active.recommendation}. Evidence remains visible before policy enforcement.</p>
              <dl className="mt-4 divide-y divide-[#e5e9f1] border-y border-[#e5e9f1]">
                {[["Device", active.device], ["Shared IP", active.ip], ["Graph", active.links], ["Policy", active.policy]].map(([label, value]) => <div key={label} className="flex items-center justify-between py-2.5"><dt className="text-[9px] text-[#7d889a]">{label}</dt><dd className="max-w-[120px] truncate font-mono text-[9px] font-semibold text-[#273249]">{value}</dd></div>)}
              </dl>
              <div className="mt-4 flex items-center justify-between border-l-2 border-[#315efb] bg-[#edf3ff] px-3 py-2.5"><span className="text-[9px] font-medium text-[#53698f]">Policy result</span><span className="text-[10px] font-bold text-[#255df5]">{active.decision}</span></div>
              <Link href={`/transactions/${active.id}`} className="group mt-4 inline-flex items-center gap-1 text-[9px] font-semibold text-[#255df5]">Open payment <span className="transition-transform group-hover:translate-x-0.5">→</span></Link>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
