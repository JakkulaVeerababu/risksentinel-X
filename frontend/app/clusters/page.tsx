"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Ban, CheckCircle2, ChevronRight, Clock3, Fingerprint, Globe2, Network, Search, ShieldAlert, Smartphone, UsersRound } from "lucide-react";
import { PageHeader } from "../../components/ui";

const clusters = [
  { id: "FRC-0184", title: "Shared device takeover ring", severity: "Critical", score: 94, accounts: 11, transactions: 43, exposure: "₹4.82L", signal: "1 device · 6 cards · 4 IPs", updated: "32 sec ago", color: "#e5484d" },
  { id: "FRC-0179", title: "Merchant refund cycling", severity: "High", score: 86, accounts: 8, transactions: 27, exposure: "₹2.18L", signal: "2 merchants · 8 accounts", updated: "4 min ago", color: "#ed8a22" },
  { id: "FRC-0172", title: "Synthetic identity mesh", severity: "High", score: 81, accounts: 14, transactions: 62, exposure: "₹3.04L", signal: "5 devices · 3 PAN patterns", updated: "19 min ago", color: "#ed8a22" },
  { id: "FRC-0168", title: "Card testing micro-burst", severity: "Medium", score: 67, accounts: 5, transactions: 118, exposure: "₹78K", signal: "1 IP range · 17 cards", updated: "1 hr ago", color: "#255df5" },
];

const entityNodes = [
  { label: "DEV-8812", icon: Smartphone, x: "50%", y: "44%", tone: "bg-[#255df5] text-white", size: "h-14 w-14" },
  { label: "A. Sharma", icon: UsersRound, x: "21%", y: "23%", tone: "bg-white text-[#334158]", size: "h-11 w-11" },
  { label: "M. Rao", icon: UsersRound, x: "78%", y: "20%", tone: "bg-white text-[#334158]", size: "h-11 w-11" },
  { label: "49.37.18.2", icon: Globe2, x: "18%", y: "72%", tone: "bg-[#f1eafe] text-[#7446d8]", size: "h-11 w-11" },
  { label: "Card •• 8219", icon: Fingerprint, x: "82%", y: "70%", tone: "bg-[#fff3e8] text-[#c76b00]", size: "h-11 w-11" },
];

export default function FraudClustersPage() {
  const [selectedId, setSelectedId] = useState(clusters[0].id);
  const [query, setQuery] = useState("");
  const [contained, setContained] = useState<string[]>([]);
  const selected = clusters.find((cluster) => cluster.id === selectedId) ?? clusters[0];
  const filtered = useMemo(() => clusters.filter((cluster) => `${cluster.id} ${cluster.title}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="rsx-page space-y-5">
      <PageHeader
        eyebrow="Graph intelligence"
        title="Fraud clusters"
        description="Detect coordinated actors across shared devices, payment instruments, identities, IP ranges, and merchants."
        actions={<Link href="/graph" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] font-bold text-[#4d596f] shadow-sm hover:bg-[#fafbfc]"><Network className="h-4 w-4" /> Open graph explorer</Link>}
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Active clusters", "4", "+2 today", "text-[#255df5]", "bg-[#edf3ff]"],
          ["Linked identities", "38", "Across 17 devices", "text-[#7446d8]", "bg-[#f3edff]"],
          ["At-risk exposure", "₹10.8L", "₹4.82L critical", "text-[#d14338]", "bg-[#fff0ef]"],
          ["Contained today", "7", "₹6.24L protected", "text-[#07845a]", "bg-[#ebfaf4]"],
        ].map(([label, value, helper, tone, surface]) => (
          <div key={label} className="rsx-card p-4 sm:p-5">
            <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${surface} ${tone}`}><ShieldAlert className="h-4 w-4" /></div>
            <p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#8993a4]">{label}</p>
            <p className="mt-1.5 text-[23px] font-bold tracking-[-.04em] text-[#17233f]">{value}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#7d8798]">{helper}</p>
          </div>
        ))}
      </section>

      <section className="grid min-h-[620px] gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rsx-card overflow-hidden">
          <div className="border-b border-[#edf0f5] p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96a0b1]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clusters" className="h-9 w-full rounded-lg border border-[#dfe5ee] bg-[#fafbfc] pl-9 pr-3 text-[11px] outline-none focus:border-[#7fa6ff] focus:bg-white" />
            </div>
          </div>
          <div className="divide-y divide-[#edf0f5]">
            {filtered.map((cluster) => {
              const active = selectedId === cluster.id;
              return (
                <button key={cluster.id} onClick={() => setSelectedId(cluster.id)} className={`w-full p-4 text-left transition-colors ${active ? "bg-[#f3f7ff]" : "hover:bg-[#fafbfd]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><div className="flex items-center gap-2"><span className="font-mono text-[10px] font-bold text-[#255df5]">{cluster.id}</span><span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase ${cluster.severity === "Critical" ? "bg-[#fff0ef] text-[#cf3c32]" : cluster.severity === "High" ? "bg-[#fff6e9] text-[#b76400]" : "bg-[#edf3ff] text-[#255df5]"}`}>{cluster.severity}</span></div><p className="mt-2 truncate text-[12px] font-bold text-[#27334b]">{cluster.title}</p></div>
                    <span className="text-[18px] font-black" style={{ color: cluster.color }}>{cluster.score}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[9px] text-[#7c8799]"><span><strong className="block text-[11px] text-[#465268]">{cluster.accounts}</strong>accounts</span><span><strong className="block text-[11px] text-[#465268]">{cluster.transactions}</strong>payments</span><span><strong className="block text-[11px] text-[#465268]">{cluster.exposure}</strong>exposure</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#e8edf5] pt-2.5"><span className="truncate text-[9px] font-medium text-[#7f8a9c]">{cluster.signal}</span><span className="flex items-center gap-1 text-[8px] text-[#9ba4b3]"><Clock3 className="h-3 w-3" />{cluster.updated}</span></div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#1e2b49] bg-[#0b1020] shadow-[0_16px_45px_rgba(13,21,39,.14)]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex items-center gap-2"><span className="font-mono text-[10px] font-bold text-[#7ca3ff]">{selected.id}</span><span className="rounded-full border border-[#e5484d]/30 bg-[#e5484d]/10 px-2 py-0.5 text-[8px] font-black uppercase text-[#ff7d75]">{selected.severity}</span></div><h2 className="mt-1.5 text-[16px] font-bold text-white">{selected.title}</h2></div>
            <button onClick={() => setContained((items) => items.includes(selected.id) ? items : [...items, selected.id])} className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-[10px] font-bold transition-colors ${contained.includes(selected.id) ? "bg-[#0f8a61] text-white" : "bg-white text-[#17233f] hover:bg-[#eef3ff]"}`}>{contained.includes(selected.id) ? <><CheckCircle2 className="h-4 w-4" /> Cluster contained</> : <><Ban className="h-4 w-4" /> Contain cluster</>}</button>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rsx-grid relative min-h-[390px] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
              <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 600 390" preserveAspectRatio="none" aria-hidden="true"><line x1="300" y1="170" x2="126" y2="90" stroke="#6c8fea"/><line x1="300" y1="170" x2="468" y2="78" stroke="#6c8fea"/><line x1="300" y1="170" x2="108" y2="280" stroke="#6c8fea"/><line x1="300" y1="170" x2="492" y2="273" stroke="#6c8fea"/><line x1="126" y1="90" x2="108" y2="280" stroke="#523dac" strokeDasharray="5 6"/><line x1="468" y1="78" x2="492" y2="273" stroke="#b86d27" strokeDasharray="5 6"/></svg>
              {entityNodes.map((node) => <div key={node.label} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: node.x, top: node.y }}><span className={`mx-auto flex ${node.size} items-center justify-center rounded-full border border-white/15 shadow-[0_0_26px_rgba(80,115,255,.22)] ${node.tone}`}><node.icon className="h-5 w-5" /></span><span className="mt-2 block rounded bg-[#0b1020]/75 px-1.5 py-0.5 font-mono text-[8px] font-bold text-[#d9e1f2] backdrop-blur">{node.label}</span></div>)}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-lg border border-white/10 bg-[#11182b]/85 px-3 py-2 text-[8px] font-semibold text-[#98a7c2] backdrop-blur"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#255df5]" /> Device</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-white" /> Identity</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#7446d8]" /> Network</span></div>
            </div>
            <aside className="p-5">
              <p className="text-[9px] font-black uppercase tracking-[.14em] text-[#6f82a5]">AI assessment</p>
              <p className="mt-3 text-[12px] leading-5 text-[#c9d4e9]">The same device fingerprint authenticated 11 accounts before attempting high-value payments within a 17-minute window.</p>
              <div className="mt-5 space-y-3">{[["Risk confidence", `${selected.score}%`], ["Potential exposure", selected.exposure], ["Linked payments", String(selected.transactions)], ["First observed", "28 Aug · 21:42"]].map(([label,value]) => <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-[9px] font-semibold text-[#7587a8]">{label}</span><span className="text-[10px] font-bold text-white">{value}</span></div>)}</div>
              <Link href="/investigations" className="mt-5 flex items-center justify-between rounded-lg border border-[#4668bd]/40 bg-[#1b2b55]/60 px-3 py-2.5 text-[10px] font-bold text-[#a9c0ff] hover:bg-[#23376b]">Open investigation <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
