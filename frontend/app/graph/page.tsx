"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Filter, Minus, Plus, RotateCcw, Search } from "lucide-react";
import { PageHeader } from "../../components/ui";

type NodeKind = "customer" | "device" | "ip" | "instrument" | "merchant" | "transaction";
type GraphNode = { id: string; label: string; kind: NodeKind; x: number; y: number; risk: number; detail: string };

const nodes: GraphNode[] = [
  { id: "tx-c9000", label: "TX C9000", kind: "transaction", x: 505, y: 300, risk: 94, detail: "₹45,000 · Blocked" },
  { id: "dev-8812", label: "DEV-8812", kind: "device", x: 365, y: 230, risk: 91, detail: "11 linked identities" },
  { id: "cust-aarav", label: "Aarav S.", kind: "customer", x: 205, y: 145, risk: 87, detail: "Account age 2 days" },
  { id: "cust-meera", label: "Meera R.", kind: "customer", x: 195, y: 310, risk: 82, detail: "3 recent disputes" },
  { id: "cust-kabir", label: "Kabir M.", kind: "customer", x: 250, y: 470, risk: 61, detail: "Trusted history" },
  { id: "ip-4937", label: "49.37.18.2", kind: "ip", x: 410, y: 470, risk: 76, detail: "Hosting provider range" },
  { id: "card-8219", label: "Card ••8219", kind: "instrument", x: 675, y: 180, risk: 88, detail: "Used by 6 accounts" },
  { id: "upi-9034", label: "UPI ••9034", kind: "instrument", x: 725, y: 340, risk: 48, detail: "2 linked accounts" },
  { id: "merchant-nova", label: "Nova Store", kind: "merchant", x: 835, y: 250, risk: 72, detail: "Refund rate 4.8%" },
  { id: "merchant-zen", label: "Zen Cart", kind: "merchant", x: 820, y: 475, risk: 32, detail: "Verified merchant" },
  { id: "dev-4420", label: "DEV-4420", kind: "device", x: 590, y: 500, risk: 55, detail: "Emulator signal" },
  { id: "ip-1058", label: "10.58.9.14", kind: "ip", x: 625, y: 75, risk: 42, detail: "Residential network" },
];

const links = [
  ["tx-c9000", "dev-8812"], ["tx-c9000", "card-8219"], ["tx-c9000", "merchant-nova"], ["dev-8812", "cust-aarav"], ["dev-8812", "cust-meera"], ["dev-8812", "cust-kabir"], ["dev-8812", "ip-4937"],
  ["cust-aarav", "ip-1058"], ["cust-meera", "card-8219"], ["card-8219", "merchant-nova"], ["upi-9034", "merchant-nova"], ["upi-9034", "dev-4420"], ["dev-4420", "merchant-zen"], ["ip-4937", "dev-4420"],
];

const kindStyles: Record<NodeKind, { ring: string; fill: string; label: string }> = {
  customer: { ring: "#9ba6b5", fill: "#ffffff", label: "Customer" },
  device: { ring: "#315efb", fill: "#eaf0ff", label: "Device" },
  ip: { ring: "#7558c9", fill: "#f0ecff", label: "IP address" },
  instrument: { ring: "#b46d08", fill: "#fff3dc", label: "Payment instrument" },
  merchant: { ring: "#315efb", fill: "#eef3ff", label: "Merchant" },
  transaction: { ring: "#d5473e", fill: "#fff0ee", label: "Transaction" },
};

export default function GraphExplorerPage() {
  const [selectedId, setSelectedId] = useState("tx-c9000");
  const [query, setQuery] = useState("C9000");
  const [zoom, setZoom] = useState(1);
  const [visibleKinds, setVisibleKinds] = useState<NodeKind[]>(Object.keys(kindStyles) as NodeKind[]);
  const [showFilters, setShowFilters] = useState(false);
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const visibleNodes = useMemo(() => nodes.filter((node) => visibleKinds.includes(node.kind)), [visibleKinds]);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));

  const search = (event: FormEvent) => {
    event.preventDefault();
    const normalized = query.toLowerCase().replace(/\s/g, "");
    const match = nodes.find((node) => `${node.id}${node.label}`.toLowerCase().replace(/\s/g, "").includes(normalized));
    if (match) setSelectedId(match.id);
  };

  const toggleKind = (kind: NodeKind) => setVisibleKinds((kinds) => kinds.includes(kind) ? kinds.filter((item) => item !== kind) : [...kinds, kind]);
  const selectedLinks = links.filter((link) => link.includes(selected.id)).length;

  return (
    <div className="rsx-page space-y-5">
      <PageHeader
        eyebrow="Relationship intelligence"
        title="Network graph"
        description="Trace the connections behind a payment decision without losing the operational context."
        actions={<Link href="/clusters" className="inline-flex h-9 items-center gap-2 rounded-md bg-[#111a2d] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#263047]">Open fraud clusters <ChevronRight className="h-3.5 w-3.5" /></Link>}
      />

      <section className="grid overflow-hidden border border-[#dfe5ee] bg-white sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Entities in view", "12", "6 entity types"],
          ["Relationships", "14", "3 direct to selection"],
          ["Coordinated risk", "94", "Critical"],
          ["Connected exposure", "₹4.82L", "Across 11 identities"],
        ].map(([label, value, note], index) => (
          <div key={label} className={`px-5 py-4 ${index ? "border-t border-[#e6eae7] sm:border-l sm:border-t-0" : ""}`}>
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#88928d]">{label}</p>
            <div className="mt-1.5 flex items-baseline justify-between gap-3"><span className="text-[25px] font-semibold tracking-[-.04em] text-[#111a2d]">{value}</span><span className={`text-[10px] font-semibold ${label === "Coordinated risk" ? "text-[#cf4039]" : "text-[#748079]"}`}>{note}</span></div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[10px] border border-[#dfe5ee] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e3e8f0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><h2 className="text-[13px] font-bold text-[#172237]">Relationship explorer</h2><p className="mt-0.5 text-[10px] font-medium text-[#8b95a7]">Active evidence · select any entity for decision context</p></div>
          <div className="flex flex-1 items-center gap-2 sm:max-w-[480px] sm:justify-end">
            <form onSubmit={search} className="relative flex-1 sm:max-w-[330px]"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8b95a7]"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search entity ID" className="h-9 w-full rounded-md border border-[#dfe5ee] bg-[#fafbff] pl-9 pr-3 text-[11px] font-semibold text-[#172237] outline-none placeholder:text-[#9ca59f] focus:border-[#7997e8] focus:bg-white"/></form>
            <button onClick={()=>setShowFilters((value)=>!value)} className={`flex h-9 items-center gap-2 rounded-md border px-3 text-[10px] font-bold ${showFilters ? "border-[#95a8db] bg-[#eff3ff] text-[#3156b5]" : "border-[#dfe5ee] bg-white text-[#5f6b65]"}`}><Filter className="h-3.5 w-3.5"/>Filter</button>
          </div>
        </div>

        {showFilters && <div className="flex flex-wrap gap-2 border-b border-[#e3e8f0] bg-[#fafbff] px-5 py-3">{(Object.keys(kindStyles) as NodeKind[]).map((kind)=><button key={kind} onClick={()=>toggleKind(kind)} className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[10px] font-semibold ${visibleKinds.includes(kind)?"border-[#cdd5e2] bg-white text-[#344158]":"border-[#e4e8e5] bg-transparent text-[#a1aaa5]"}`}><i className="h-1.5 w-1.5 rounded-full" style={{background:kindStyles[kind].ring}}/>{kindStyles[kind].label}</button>)}</div>}

        <div className="grid min-h-[570px] xl:grid-cols-[minmax(0,1fr)_292px]">
          <div className="rsx-editorial-grid relative min-h-[500px] overflow-hidden border-b border-[#e3e8f0] bg-[#fbfcfa] xl:border-b-0 xl:border-r">
            <svg className="h-full min-h-[570px] w-full" viewBox="0 0 1000 600" role="img" aria-label="Interactive fraud entity relationship graph">
              <g transform={`translate(500 300) scale(${zoom}) translate(-500 -300)`} style={{transition:"transform .25s ease"}}>
                {links.filter(([source,target])=>visibleIds.has(source)&&visibleIds.has(target)).map(([source,target])=>{const a=nodes.find((node)=>node.id===source)!;const b=nodes.find((node)=>node.id===target)!;const active=selectedId===source||selectedId===target;return <line key={`${source}-${target}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active?"#6687dd":"#cbd3d5"} strokeWidth={active?2:1.2} strokeDasharray={a.kind==="ip"||b.kind==="ip"?"5 6":undefined}/>})}
                {visibleNodes.map((node)=>{const style=kindStyles[node.kind];const active=node.id===selectedId;const radius=active?29:node.kind==="transaction"?24:19;return <g key={node.id} role="button" tabIndex={0} aria-label={`${style.label} ${node.label}`} onClick={()=>setSelectedId(node.id)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" ")setSelectedId(node.id)}} className="cursor-pointer outline-none"><circle cx={node.x} cy={node.y} r={radius+9} fill={style.ring} fillOpacity={active?.10:.035}/><circle cx={node.x} cy={node.y} r={radius} fill={active?style.ring:style.fill} stroke={style.ring} strokeWidth={active?3:1.8}/><circle cx={node.x} cy={node.y} r={active?6:4} fill={active?"#fff":style.ring}/><text x={node.x} y={node.y+45} textAnchor="middle" fill="#28364a" fontSize="10" fontWeight="700">{node.label}</text><text x={node.x} y={node.y+58} textAnchor="middle" fill="#84908a" fontSize="8">{node.detail}</text></g>})}
              </g>
            </svg>
            <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-md border border-[#dfe5ee] bg-white p-1 shadow-sm"><button onClick={()=>setZoom((value)=>Math.max(.75,value-.15))} aria-label="Zoom out" className="rounded p-2 text-[#66726c] hover:bg-[#f0f3f0]"><Minus className="h-3.5 w-3.5"/></button><span className="w-10 text-center text-[10px] font-bold text-[#7e8983]">{Math.round(zoom*100)}%</span><button onClick={()=>setZoom((value)=>Math.min(1.45,value+.15))} aria-label="Zoom in" className="rounded p-2 text-[#66726c] hover:bg-[#f0f3f0]"><Plus className="h-3.5 w-3.5"/></button><button onClick={()=>setZoom(1)} aria-label="Reset zoom" className="border-l border-[#e3e8f0] p-2 text-[#66726c] hover:bg-[#f0f3f0]"><RotateCcw className="h-3.5 w-3.5"/></button></div>
            <div className="absolute right-4 top-4 border border-[#dbe3f5] bg-[#edf3ff] px-2.5 py-1.5 text-[9px] font-bold text-[#315efb]"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#315efb]"/>Graph topology</div>
          </div>

          <aside className="bg-[#fbfcff] p-5">
            <div className="flex items-start justify-between border-b border-[#e3e8f0] pb-4"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8a948e]">{kindStyles[selected.kind].label}</p><h3 className="mt-1.5 text-[18px] font-semibold tracking-[-.025em] text-[#111a2d]">{selected.label}</h3><p className="mt-1 text-[10px] font-medium text-[#7a8597]">{selected.detail}</p></div><span className={`border px-2 py-1 text-[9px] font-bold uppercase ${selected.risk>=85?"border-[#f0c7c3] bg-[#fff0ee] text-[#c83c35]":selected.risk>=65?"border-[#ecd9b4] bg-[#fff7e8] text-[#99600c]":"border-[#cdd9f8] bg-[#edf3ff] text-[#315efb]"}`}>{selected.risk>=85?"Critical":selected.risk>=65?"Elevated":"Normal"}</span></div>
            <div className="border-b border-[#e3e8f0] py-5"><div className="flex items-end justify-between"><span className="text-[10px] font-semibold text-[#727e78]">Entity risk</span><span className="text-[32px] font-semibold leading-none tracking-[-.05em] text-[#111a2d]">{selected.risk}</span></div><div className="mt-3 h-1.5 overflow-hidden bg-[#e7ebf1]"><div className={`h-full ${selected.risk>=85?"bg-[#d5473e]":selected.risk>=65?"bg-[#bd7b18]":"bg-[#315efb]"}`} style={{width:`${selected.risk}%`}}/></div></div>
            <dl className="divide-y divide-[#e3e8f0] border-b border-[#e3e8f0]">{[["Direct relationships", String(selectedLinks)], ["Cluster", selected.risk>=70?"FRC-0184":"No critical cluster"], ["First observed", "28 Aug · 21:42"], ["Last activity", "32 seconds ago"]].map(([label,value])=><div key={label} className="flex items-center justify-between gap-3 py-3"><dt className="text-[10px] font-medium text-[#7b8680]">{label}</dt><dd className="text-right text-[10px] font-bold text-[#344158]">{value}</dd></div>)}</dl>
            <div className={`mt-4 border-l-2 px-3 py-2.5 ${selected.risk>=70?"border-[#d5473e] bg-[#fff4f2]":"border-[#315efb] bg-[#edf3ff]"}`}><p className={`text-[10px] font-bold ${selected.risk>=70?"text-[#bd3731]":"text-[#315efb]"}`}>{selected.risk>=70?"Coordinated signal detected":"No critical association"}</p><p className="mt-1 text-[10px] leading-4 text-[#6f7974]">{selected.risk>=70?"Shared infrastructure connects this entity to a known high-risk network.":"No active cluster currently requires review."}</p></div>
            <Link href="/clusters" className="mt-4 flex h-9 items-center justify-between border border-[#ccd3ce] bg-white px-3 text-[10px] font-bold text-[#28342f] hover:bg-[#f4f7ff]">Open cluster details <ChevronRight className="h-3.5 w-3.5"/></Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
