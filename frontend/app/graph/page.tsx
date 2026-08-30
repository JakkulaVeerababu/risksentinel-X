"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { PageHeader, ErrorState } from "../../components/ui";
import { fetchGraphContext } from "../../lib/api";

type NodeKind = "customer" | "device" | "ip" | "instrument" | "merchant" | "transaction" | "unknown";

const kindStyles: Record<NodeKind, { ring: string; fill: string; label: string }> = {
  customer: { ring: "#9ba6b5", fill: "#ffffff", label: "Customer" },
  device: { ring: "#315efb", fill: "#eaf0ff", label: "Device" },
  ip: { ring: "#7558c9", fill: "#f0ecff", label: "IP address" },
  instrument: { ring: "#b46d08", fill: "#fff3dc", label: "Payment instrument" },
  merchant: { ring: "#315efb", fill: "#eef3ff", label: "Merchant" },
  transaction: { ring: "#d5473e", fill: "#fff0ee", label: "Transaction" },
  unknown: { ring: "#cbd3d5", fill: "#f0f3f0", label: "Unknown" },
};

export default function GraphExplorerPage() {
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // In a real app, we'd start with a specific transaction ID from URL params. 
  // For the demo, we'll try to fetch a known entity or wait for search.
  
  const handleSearch = async (event?: FormEvent) => {
    if (event) event.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const data = await fetchGraphContext(query);
      setGraphData(data);
      setSelectedId(query);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setGraphData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rsx-page space-y-5">
      <PageHeader
        eyebrow="Relationship intelligence"
        title="Network graph"
        description="Trace the connections behind a payment decision without losing the operational context."
        actions={<Link href="/clusters" className="inline-flex h-9 items-center gap-2 rounded-md bg-[#111a2d] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#263047]">Open fraud clusters <ChevronRight className="h-3.5 w-3.5" /></Link>}
      />

      <section className="overflow-hidden rounded-[10px] border border-[#dfe5ee] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e3e8f0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><h2 className="text-[13px] font-bold text-[#172237]">Relationship explorer</h2><p className="mt-0.5 text-[10px] font-medium text-[#8b95a7]">Enter a transaction ID to explore context</p></div>
          <div className="flex flex-1 items-center gap-2 sm:max-w-[480px] sm:justify-end">
            <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-[330px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8b95a7]"/>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search entity ID (e.g., SIM-TX-...)" className="h-9 w-full rounded-md border border-[#dfe5ee] bg-[#fafbff] pl-9 pr-3 text-[11px] font-semibold text-[#172237] outline-none placeholder:text-[#9ca59f] focus:border-[#7997e8] focus:bg-white"/>
            </form>
          </div>
        </div>

        {!graphData && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
            <p className="rsx-section-label">Relationship explorer</p>
            <p className="max-w-md text-[14px] text-text-secondary">No graph context is available for this transaction.</p>
            {error && <p className="text-danger text-sm">Failed to load graph or entity not found.</p>}
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
             <p className="text-body-md text-text-secondary max-w-md">Loading graph data...</p>
          </div>
        )}

        {graphData && !loading && (
          <div className="grid min-h-[570px] xl:grid-cols-[minmax(0,1fr)_292px]">
            <div className="rsx-editorial-grid relative min-h-[500px] overflow-hidden border-b border-[#e3e8f0] bg-[#fbfcfa] xl:border-b-0 xl:border-r">
               {/* Simplified graph view - nodes placed in a circle for demo purposes */}
               <svg className="h-full min-h-[570px] w-full" viewBox="0 0 1000 600">
                <g transform={`translate(500 300) scale(${zoom}) translate(-500 -300)`}>
                  {graphData.links?.map((link: any, i: number) => {
                     // very basic layout: center node at 500, 300, others in circle
                     const isSourceCenter = link.source === graphData.entity_id;
                     const targetIndex = graphData.nodes.findIndex((n: any) => n.id === link.target);
                     const angle = (targetIndex / (graphData.nodes.length - 1)) * Math.PI * 2;
                     const x1 = isSourceCenter ? 500 : 500 + Math.cos(angle) * 150;
                     const y1 = isSourceCenter ? 300 : 300 + Math.sin(angle) * 150;
                     const x2 = !isSourceCenter ? 500 : 500 + Math.cos(angle) * 150;
                     const y2 = !isSourceCenter ? 300 : 300 + Math.sin(angle) * 150;
                     return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd3d5" strokeWidth={2} />
                  })}
                  {graphData.nodes?.map((node: any, i: number) => {
                     const isCenter = node.id === graphData.entity_id;
                     let x = 500, y = 300;
                     if (!isCenter) {
                        const idx = i > 0 ? i - 1 : 0;
                        const angle = (idx / Math.max(1, graphData.nodes.length - 1)) * Math.PI * 2;
                        x = 500 + Math.cos(angle) * 150;
                        y = 300 + Math.sin(angle) * 150;
                     }
                     const style = kindStyles[node.group as NodeKind] || kindStyles.unknown;
                     const active = node.id === selectedId;
                     return (
                        <g key={node.id} onClick={() => setSelectedId(node.id)} className="cursor-pointer">
                           <circle cx={x} cy={y} r={isCenter ? 24 : 19} fill={style.fill} stroke={style.ring} strokeWidth={active ? 3 : 1.8} />
                           <text x={x} y={y + 40} textAnchor="middle" fill="#28364a" fontSize="10">{node.id}</text>
                        </g>
                     )
                  })}
                </g>
               </svg>
            </div>

            <aside className="bg-[#fbfcff] p-5">
              <div className="flex items-start justify-between border-b border-[#e3e8f0] pb-4">
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-.025em] text-[#111a2d]">{selectedId || graphData.entity_id}</h3>
                  <p className="mt-1 text-[10px] font-medium text-[#7a8597]">Graph Risk: {graphData.graph_score}</p>
                </div>
              </div>
              <div className="border-b border-[#e3e8f0] py-5">
                <div className="flex items-end justify-between"><span className="text-[10px] font-semibold text-[#727e78]">Graph score</span><span className="text-[32px] font-semibold leading-none tracking-[-.05em] text-[#111a2d]">{graphData.graph_score}</span></div>
                <div className="mt-3 h-1.5 overflow-hidden bg-[#e7ebf1]"><div className={`h-full ${graphData.graph_score>=0.85?"bg-[#d5473e]":graphData.graph_score>=0.65?"bg-[#bd7b18]":"bg-[#315efb]"}`} style={{width:`${graphData.graph_score * 100}%`}}/></div>
              </div>
              <dl className="divide-y divide-[#e3e8f0] border-b border-[#e3e8f0]">
                {[["Community ID", graphData.community_id || "None"], ["Related Entities", graphData.related_entities?.length || 0]].map(([label,value])=><div key={label} className="flex items-center justify-between gap-3 py-3"><dt className="text-[10px] font-medium text-[#7b8680]">{label}</dt><dd className="text-right text-[10px] font-bold text-[#344158]">{value}</dd></div>)}
              </dl>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
