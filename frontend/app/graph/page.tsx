"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight, Crosshair, Filter, Focus, Globe2, Minus, Network, Plus, RotateCcw, Search, ShieldAlert, Smartphone, UsersRound, WalletCards } from "lucide-react";
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

const kindStyles: Record<NodeKind, { color: string; fill: string; label: string; icon: typeof UsersRound }> = {
  customer: { color: "#f8fafc", fill: "#334158", label: "Customer", icon: UsersRound },
  device: { color: "#8eb0ff", fill: "#255df5", label: "Device", icon: Smartphone },
  ip: { color: "#bb9cff", fill: "#7446d8", label: "IP address", icon: Globe2 },
  instrument: { color: "#ffc06b", fill: "#c76b00", label: "Payment instrument", icon: WalletCards },
  merchant: { color: "#6ee7b7", fill: "#07845a", label: "Merchant", icon: ShieldAlert },
  transaction: { color: "#ff8c84", fill: "#d14338", label: "Transaction", icon: Crosshair },
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

  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Graph intelligence" title="Network graph" description="Explore hidden relationships across transactions, customers, devices, IPs, payment instruments and merchants in real time." actions={<Link href="/clusters" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#255df5] px-4 text-[12px] font-bold text-white shadow-[0_9px_22px_rgba(37,93,245,.24)] hover:bg-[#174bd4]"><UsersRound className="h-4 w-4" /> View fraud clusters</Link>} />

      <section className="overflow-hidden rounded-2xl border border-[#1e2a48] bg-[#0a1020] shadow-[0_18px_50px_rgba(13,21,39,.16)]">
        <div className="flex flex-col gap-3 border-b border-white/10 bg-[#0f172a]/95 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#255df5]/15 text-[#7fa4ff]"><Network className="h-4 w-4" /></span><div><h2 className="text-[13px] font-bold text-white">Relationship explorer</h2><p className="mt-0.5 text-[10px] font-semibold text-[#788aa9]">12 entities · 14 relationships · Live graph active</p></div></div>
          <div className="flex flex-1 items-center gap-2 sm:max-w-[520px] sm:justify-end">
            <form onSubmit={search} className="relative flex-1 sm:max-w-[340px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7183a3]"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search entity ID…" className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-[10px] font-semibold text-white outline-none placeholder:text-[#657794] focus:border-[#527bef]"/></form>
            <button onClick={()=>setShowFilters((value)=>!value)} className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-[9px] font-bold ${showFilters ? "border-[#527bef] bg-[#255df5]/15 text-[#8eaeff]" : "border-white/10 bg-white/5 text-[#a7b5cc]"}`}><Filter className="h-3.5 w-3.5"/>Filters</button>
          </div>
        </div>

        {showFilters && <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#0c1427] px-5 py-3">{(Object.keys(kindStyles) as NodeKind[]).map((kind)=><button key={kind} onClick={()=>toggleKind(kind)} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] font-bold ${visibleKinds.includes(kind)?"border-white/15 bg-white/10 text-white":"border-white/5 bg-transparent text-[#5f708f]"}`}><i className="h-2 w-2 rounded-full" style={{background:kindStyles[kind].fill}}/>{kindStyles[kind].label}</button>)}</div>}

        <div className="grid min-h-[610px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rsx-grid relative min-h-[500px] overflow-hidden border-b border-white/10 xl:border-b-0 xl:border-r">
            <svg className="h-full min-h-[610px] w-full" viewBox="0 0 1000 600" role="img" aria-label="Interactive fraud entity relationship graph">
              <defs><filter id="nodeGlow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="graphFade" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#17233f"/><stop offset="1" stopColor="#0a1020"/></linearGradient></defs>
              <rect width="1000" height="600" fill="url(#graphFade)" opacity=".14"/>
              <g transform={`translate(500 300) scale(${zoom}) translate(-500 -300)`} style={{transition:"transform .25s ease"}}>
                {links.filter(([source,target])=>visibleIds.has(source)&&visibleIds.has(target)).map(([source,target])=>{const a=nodes.find((node)=>node.id===source)!;const b=nodes.find((node)=>node.id===target)!;return <line key={`${source}-${target}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={selectedId===source||selectedId===target?"#557be0":"#263754"} strokeWidth={selectedId===source||selectedId===target?2:1.2} strokeDasharray={a.kind==="ip"||b.kind==="ip"?"5 6":undefined}/>})}
                {visibleNodes.map((node)=>{const style=kindStyles[node.kind];const active=node.id===selectedId;return <g key={node.id} role="button" tabIndex={0} aria-label={`${style.label} ${node.label}`} onClick={()=>setSelectedId(node.id)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" ")setSelectedId(node.id)}} className="cursor-pointer outline-none"><circle cx={node.x} cy={node.y} r={active?31:node.kind==="transaction"?25:20} fill={style.fill} fillOpacity={active?1:.86} stroke={active?"#dbe6ff":style.color} strokeWidth={active?3:1.4} filter={active?"url(#nodeGlow)":undefined}/><circle cx={node.x} cy={node.y} r={active?42:29} fill="none" stroke={style.fill} strokeOpacity={active ? .36 : .1} strokeWidth={2}/><text x={node.x} y={node.y+(node.kind==="transaction"?48:43)} textAnchor="middle" fill="#e6edf9" fontSize="10" fontWeight="700">{node.label}</text><text x={node.x} y={node.y+(node.kind==="transaction"?61:56)} textAnchor="middle" fill="#7183a3" fontSize="8">{node.detail}</text></g>})}
              </g>
            </svg>
            <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-lg border border-white/10 bg-[#10182b]/90 p-1 shadow-xl backdrop-blur"><button onClick={()=>setZoom((value)=>Math.max(.75,value-.15))} aria-label="Zoom out" className="rounded-md p-2 text-[#a8b6ce] hover:bg-white/10 hover:text-white"><Minus className="h-4 w-4"/></button><span className="w-10 text-center text-[8px] font-bold text-[#7e8fab]">{Math.round(zoom*100)}%</span><button onClick={()=>setZoom((value)=>Math.min(1.45,value+.15))} aria-label="Zoom in" className="rounded-md p-2 text-[#a8b6ce] hover:bg-white/10 hover:text-white"><Plus className="h-4 w-4"/></button><button onClick={()=>setZoom(1)} aria-label="Reset zoom" className="rounded-md border-l border-white/10 p-2 text-[#a8b6ce] hover:bg-white/10 hover:text-white"><RotateCcw className="h-4 w-4"/></button></div>
            <div className="absolute right-4 top-4 rounded-lg border border-[#4c6dc0]/30 bg-[#18274c]/80 px-3 py-2 text-[8px] font-bold text-[#a6bcf0] backdrop-blur"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#6f95ff]"/>Native graph renderer active</div>
          </div>

          <aside className="bg-[#0d1528] p-5">
            <div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:`${kindStyles[selected.kind].fill}22`,color:kindStyles[selected.kind].color}}>{(() => { const Icon=kindStyles[selected.kind].icon; return <Icon className="h-5 w-5"/>; })()}</span><span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase ${selected.risk>=85?"bg-[#e5484d]/15 text-[#ff8981]":selected.risk>=65?"bg-[#f59e0b]/15 text-[#ffc368]":"bg-[#16a675]/15 text-[#5ed7a9]"}`}>{selected.risk>=85?"Critical":selected.risk>=65?"Elevated":"Normal"}</span></div>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[.14em] text-[#6f82a3]">{kindStyles[selected.kind].label}</p><h3 className="mt-1.5 text-[17px] font-bold text-white">{selected.label}</h3><p className="mt-1 text-[9px] font-semibold text-[#8596b5]">{selected.detail}</p>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between"><span className="text-[9px] font-semibold text-[#8ea0bf]">Entity risk</span><span className="text-[23px] font-bold text-white">{selected.risk}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${selected.risk>=85?"bg-[#e5484d]":selected.risk>=65?"bg-[#f59e0b]":"bg-[#16a675]"}`} style={{width:`${selected.risk}%`}}/></div></div>
            <div className="mt-5 space-y-3">{[["Direct relationships", String(links.filter((link)=>link.includes(selected.id)).length)], ["Cluster", selected.risk>=70?"FRC-0184":"No critical cluster"], ["First observed", "28 Aug · 21:42"], ["Last activity", "32 seconds ago"]].map(([label,value])=><div key={label} className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-[8px] font-semibold text-[#7183a3]">{label}</span><span className="text-[9px] font-bold text-[#dce5f5]">{value}</span></div>)}</div>
            {selected.risk>=70?<div className="mt-5 rounded-xl border border-[#e5484d]/20 bg-[#e5484d]/8 p-3"><div className="flex items-center gap-2 text-[9px] font-bold text-[#ff918a]"><AlertTriangle className="h-4 w-4"/>Coordinated signal detected</div><p className="mt-1.5 text-[8px] leading-4 text-[#b6a0a5]">This entity shares infrastructure with a known high-risk network.</p></div>:<div className="mt-5 rounded-xl border border-[#16a675]/20 bg-[#16a675]/8 p-3"><div className="flex items-center gap-2 text-[9px] font-bold text-[#63d9ad]"><CheckCircle2 className="h-4 w-4"/>No critical association</div></div>}
            <Link href="/clusters" className="mt-5 flex h-9 items-center justify-between rounded-lg border border-[#4d6eba]/30 bg-[#1a2a50] px-3 text-[9px] font-bold text-[#abc0f2] hover:bg-[#203462]">Open cluster details <ChevronRight className="h-3.5 w-3.5"/></Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
