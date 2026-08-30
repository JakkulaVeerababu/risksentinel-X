"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/ui";
import { fetchFraudClusters } from "../../lib/api";

const TYPE_COLORS: Record<string, string> = {
  customer: "border-[#aeb9ca] bg-white text-[#334158]",
  device: "border-[#255df5] bg-[#255df5] text-white",
  ip: "border-[#7558c9] bg-white text-[#6748b8]",
  transaction: "border-[#c98925] bg-white text-[#a55f00]"
};

const TYPE_TAGS: Record<string, string> = {
  customer: "ID",
  device: "DEV",
  ip: "IP",
  transaction: "PAY",
  unknown: "UKN"
};

const PRESET_POSITIONS = [
  { x: "50%", y: "44%", size: "h-14 w-14" },
  { x: "21%", y: "23%", size: "h-11 w-11" },
  { x: "78%", y: "20%", size: "h-11 w-11" },
  { x: "18%", y: "72%", size: "h-11 w-11" },
  { x: "82%", y: "70%", size: "h-11 w-11" },
  { x: "50%", y: "80%", size: "h-11 w-11" },
];

export default function FraudClustersPage() {
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [contained, setContained] = useState<string[]>([]);
  
  useEffect(() => {
    fetchFraudClusters().then(data => {
      setClusters(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const selected = clusters.find((cluster) => cluster.id === selectedId) ?? clusters[0];
  const filtered = useMemo(() => clusters.filter((cluster) => `${cluster.id} ${cluster.title}`.toLowerCase().includes(query.toLowerCase())), [clusters, query]);

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading graph clusters...</div>;
  }
  
  if (clusters.length === 0) {
    return <div className="p-8 text-center text-text-secondary">No clusters detected in the network.</div>;
  }

  // Generate node visualizations for selected cluster
  const entityNodes = (selected?.nodes || []).slice(0, PRESET_POSITIONS.length).map((n: any, idx: number) => {
    const pos = PRESET_POSITIONS[idx];
    return {
      label: n.id,
      tag: TYPE_TAGS[n.type] || "UKN",
      x: pos.x,
      y: pos.y,
      tone: TYPE_COLORS[n.type] || "border-[#aeb9ca] bg-white text-[#334158]",
      size: pos.size
    };
  });

  const totalExposure = clusters.reduce((acc, c) => acc + (c.exposure_amount || 0), 0);
  const criticalExposure = clusters.filter(c => c.severity === "Critical").reduce((acc, c) => acc + (c.exposure_amount || 0), 0);
  const containedCount = contained.length;
  const containedExposure = clusters.filter(c => contained.includes(c.id)).reduce((acc, c) => acc + (c.exposure_amount || 0), 0);
  
  const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="rsx-page space-y-5">
      <PageHeader
        eyebrow="Graph intelligence"
        title="Fraud clusters"
        description="Detect coordinated actors across shared devices, payment instruments, identities, IP ranges, and merchants. Live graph detection data."
        actions={<Link href="/graph" className="inline-flex h-9 items-center rounded-lg border border-[#dfe5ee] bg-white px-3.5 text-[11px] font-bold text-[#4d596f] hover:border-[#c9d3e2] hover:bg-[#fafbfc]">Open graph explorer →</Link>}
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Active clusters", clusters.length.toString(), "Detected today", "text-[#255df5]", "bg-[#edf3ff]"],
          ["Linked identities", clusters.reduce((acc, c) => acc + c.accounts, 0).toString(), "Across clusters", "text-[#7446d8]", "bg-[#f3edff]"],
          ["At-risk exposure", formatINR(totalExposure), `${formatINR(criticalExposure)} critical`, "text-[#d14338]", "bg-[#fff0ef]"],
          ["Contained today", containedCount.toString(), `${formatINR(containedExposure)} protected`, "text-[#315efb]", "bg-[#edf3ff]"],
        ].map(([label, value, helper, tone, bg]) => (
          <div key={label} className="rsx-stat-card">
            <p className="rsx-stat-label">{label}</p>
            <p className={`rsx-stat-value ${tone}`}>{value}</p>
            <p className="rsx-stat-helper">{helper}</p>
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
          <div className="divide-y divide-[#edf0f5] h-[540px] overflow-y-auto">
            {filtered.map((cluster) => {
              const active = selectedId === cluster.id;
              return (
                <button key={cluster.id} onClick={() => setSelectedId(cluster.id)} className={`w-full p-4 text-left transition-colors ${active ? "bg-[#f3f7ff]" : "hover:bg-[#fafbfd]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><div className="flex items-center gap-2"><span className="font-mono text-[10px] font-bold text-[#255df5]">{cluster.id}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${cluster.severity === "Critical" ? "bg-[#fff0ef] text-[#cf3c32]" : cluster.severity === "High" ? "bg-[#fff6e9] text-[#b76400]" : "bg-[#edf3ff] text-[#255df5]"}`}>{cluster.severity}</span></div><p className="mt-2 truncate text-[12px] font-bold text-[#27334b]">{cluster.title}</p></div>
                    <span className="text-[18px] font-black" style={{ color: cluster.color }}>{cluster.score}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-[#7c8799]"><span><strong className="block text-[11px] text-[#465268]">{cluster.accounts}</strong>accounts</span><span><strong className="block text-[11px] text-[#465268]">{cluster.transactions}</strong>payments</span><span><strong className="block text-[11px] text-[#465268] truncate">{formatINR(cluster.exposure_amount)}</strong>exposure</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#e8edf5] pt-2.5"><span className="truncate text-[10px] font-medium text-[#7f8a9c]">{cluster.signal}</span><span className="text-[10px] text-[#9ba4b3]">{cluster.updated}</span></div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rsx-data-panel">
          <div className="flex flex-col gap-3 border-b border-[#e6ebf3] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#255df5]">{selected.id}</span>
                <span className="rounded-full border border-[#f4cbc7] bg-[#fff0ef] px-2 py-0.5 text-[10px] font-black uppercase text-[#cf3c32]">{selected.severity}</span>
              </div>
              <h2 className="mt-1.5 text-[16px] font-bold text-[#16213a]">{selected.title}</h2>
            </div>
            <button onClick={() => setContained((items) => items.includes(selected.id) ? items : [...items, selected.id])} className={`inline-flex h-9 items-center justify-center rounded-lg border px-3.5 text-[10px] font-bold transition-colors ${contained.includes(selected.id) ? "border-[#315efb] bg-[#edf3ff] text-[#255df5]" : "border-[#315efb] bg-[#315efb] text-white hover:bg-[#1747c9]"}`}>{contained.includes(selected.id) ? "Cluster contained" : "Contain cluster"}</button>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_272px]">
            <div className="rsx-grid relative min-h-[390px] overflow-hidden border-b border-[#e6ebf3] bg-[#fbfcff] lg:border-b-0 lg:border-r">
              <div className="absolute left-5 top-5 border-l-2 border-[#255df5] pl-2.5 text-[9px] font-bold uppercase tracking-[.12em] text-[#6d7890]">Relationship map</div>
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 390" preserveAspectRatio="none" aria-hidden="true"><line x1="300" y1="170" x2="126" y2="90" stroke="#9ab5f6" strokeWidth="1.5"/><line x1="300" y1="170" x2="468" y2="78" stroke="#9ab5f6" strokeWidth="1.5"/><line x1="300" y1="170" x2="108" y2="280" stroke="#9ab5f6" strokeWidth="1.5"/><line x1="300" y1="170" x2="492" y2="273" stroke="#9ab5f6" strokeWidth="1.5"/><line x1="126" y1="90" x2="108" y2="280" stroke="#b5a6e8" strokeDasharray="5 6"/><line x1="468" y1="78" x2="492" y2="273" stroke="#e6b878" strokeDasharray="5 6"/></svg>
              {entityNodes.map((node: any) => <div key={node.label} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: node.x, top: node.y }}><span className={`mx-auto flex ${node.size} items-center justify-center rounded-full border-2 ring-4 ring-white ${node.tone}`}><span className="font-mono text-[9px] font-bold tracking-[.04em]">{node.tag}</span></span><span className="mt-2 block rounded-md border border-[#e4e9f1] bg-white/95 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#344158] truncate max-w-[80px]" title={node.label}>{node.label}</span></div>)}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-lg border border-[#dfe6f1] bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#68758b] shadow-sm backdrop-blur"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#255df5]" /> Device</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full border border-[#aeb9ca] bg-white" /> Identity</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#7446d8]" /> Network</span></div>
            </div>
            <aside className="bg-[#fbfcff] p-5">
              <p className="rsx-rule-heading">Risk assessment</p>
              <p className="mt-4 text-[12px] leading-5 text-[#4f5c72]">Live graph intelligence detected {selected.accounts} shared accounts communicating across {selected.signal.split(" ")[0]} devices in a coordinated anomaly pattern.</p>
              <div className="mt-5 rounded-xl border border-[#e0e6f0] bg-white p-4 shadow-sm">
                <div className="flex items-end justify-between"><span className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8993a5]">Graph risk confidence</span><span className="text-[24px] font-black tracking-[-.04em]" style={{ color: selected.color }}>{selected.score}%</span></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf0f5]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${selected.score}%`, backgroundColor: selected.color }} /></div>
              </div>
              <div className="mt-4 space-y-3">{[["Potential exposure", formatINR(selected.exposure_amount)], ["Linked payments", String(selected.transactions)], ["Nodes captured", String(selected.nodes?.length || 0)]].map(([label,value]) => <div key={label} className="flex items-center justify-between border-b border-[#e7ebf2] pb-3"><span className="text-[10px] font-semibold text-[#7c8799]">{label}</span><span className="text-[10px] font-bold text-[#263249]">{value}</span></div>)}</div>
              <Link href="/investigations" className="mt-5 flex items-center justify-between rounded-lg border border-[#cddafd] bg-[#edf3ff] px-3 py-2.5 text-[10px] font-bold text-[#255df5] transition-colors hover:border-[#aec3fb] hover:bg-[#e4edff]">Open investigation <span>→</span></Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
