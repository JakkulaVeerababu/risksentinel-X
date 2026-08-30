"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
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

  const nodePosition = (nodeId: string) => {
    if (!graphData?.nodes?.length || nodeId === graphData.entity_id) return { x: 500, y: 300 };
    const peripheral = graphData.nodes.filter((node: any) => node.id !== graphData.entity_id);
    const index = Math.max(0, peripheral.findIndex((node: any) => node.id === nodeId));
    const angle = -Math.PI / 2 + (index / Math.max(1, peripheral.length)) * Math.PI * 2;
    return { x: 500 + Math.cos(angle) * 250, y: 300 + Math.sin(angle) * 180 };
  };

  useEffect(() => {
    const initialEntity = "TX-C9000";
    setQuery(initialEntity);
    setLoading(true);
    fetchGraphContext(initialEntity)
      .then((data) => {
        setGraphData(data);
        setSelectedId(initialEntity);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  
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
        actions={<Link href="/clusters" className="inline-flex h-9 items-center border border-primary bg-primary px-4 text-caption font-bold text-white transition-colors hover:bg-primary-hover">Open fraud clusters →</Link>}
      />

      <section className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="flex flex-col gap-3 border-b border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><h2 className="text-body-sm font-bold text-text-primary">Relationship explorer</h2><p className="mt-0.5 text-caption font-medium text-text-muted">Enter a transaction ID to explore context</p></div>
          <div className="flex flex-1 items-center gap-2 sm:max-w-[480px] sm:justify-end">
            <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-[330px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"/>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search entity ID" className="h-9 w-full rounded-md border border-border bg-surface-secondary pl-9 pr-3 text-caption font-semibold text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50 focus:bg-white"/>
            </form>
          </div>
        </div>

        {!graphData && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
            <p className="rsx-section-label">No relationship selected</p>
            <p className="max-w-md text-body text-text-secondary">
              {error ? "No graph context is available for this transaction." : "Search for a transaction ID or customer ID to explore relationship context."}
            </p>
            {error && <p className="text-danger text-sm font-medium mt-2">Failed to load graph or entity not found.</p>}
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
             <p className="text-body-md text-text-secondary max-w-md">Loading graph data...</p>
          </div>
        )}

        {graphData && !loading && (
          <div className="grid grid-cols-1 min-h-[570px] lg:grid-cols-[minmax(0,1fr)_292px]">
            <div className="rsx-editorial-grid relative min-h-[500px] overflow-hidden border-b border-border-subtle bg-surface lg:border-b-0 lg:border-r">
               {/* Simplified graph view - nodes placed in a circle for demo purposes */}
               <svg className="h-full min-h-[570px] w-full" viewBox="0 0 1000 600">
                <g transform={`translate(500 300) scale(${zoom}) translate(-500 -300)`}>
                  {graphData.links?.map((link: any, i: number) => {
                     const source = nodePosition(link.source);
                     const target = nodePosition(link.target);
                     return <line key={i} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#9eb4df" strokeWidth={1.5} />
                  })}
                  {graphData.nodes?.map((node: any, i: number) => {
                     const isCenter = node.id === graphData.entity_id;
                     const { x, y } = nodePosition(node.id);
                     const style = kindStyles[node.group as NodeKind] || kindStyles.unknown;
                     const active = node.id === selectedId;
                     return (
                        <g key={node.id} onClick={() => setSelectedId(node.id)} className="cursor-pointer">
                           <rect x={x - 66} y={y - 26} width="132" height="52" rx="3" fill="#ffffff" stroke={style.ring} strokeWidth={active ? 2.5 : 1.4} />
                           {isCenter && <rect x={x - 66} y={y - 26} width="3" height="52" fill="#d5473e" />}
                           <text x={x - 52} y={y - 6} fill="#8792a6" fontSize="9" fontWeight="600" letterSpacing=".7">{style.label.toUpperCase()}</text>
                           <text x={x - 52} y={y + 13} fill="#263249" fontSize="11" fontWeight="700">{node.id}</text>
                        </g>
                     )
                  })}
                </g>
               </svg>
            </div>

            <aside className="bg-surface-secondary p-5">
              <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                <div>
                  <h3 className="text-body-lg font-semibold tracking-[-.025em] text-text-primary">{selectedId || graphData.entity_id}</h3>
                  <p className="mt-1 text-caption font-medium text-text-secondary">Graph Risk: {Number(graphData.graph_score).toFixed(2)}</p>
                </div>
              </div>
              <div className="border-b border-border-subtle py-5">
                <div className="flex items-end justify-between"><span className="text-caption font-semibold text-text-secondary">Graph score</span><span className="text-display-lg font-semibold leading-none tracking-[-.05em] text-text-primary">{Number(graphData.graph_score).toFixed(2)}</span></div>
                <div className="mt-3 h-1.5 overflow-hidden bg-border-subtle"><div className={`h-full ${graphData.graph_score>=0.85?"bg-danger":graphData.graph_score>=0.65?"bg-warning":"bg-primary"}`} style={{width:`${graphData.graph_score * 100}%`}}/></div>
              </div>
              <dl className="divide-y divide-[#e3e8f0] border-b border-border-subtle">
                {[["Community ID", graphData.community_id || "None"], ["Related entities", typeof graphData.related_entities === "number" ? graphData.related_entities : graphData.related_entities?.length || 0]].map(([label,value])=><div key={label} className="flex items-center justify-between gap-3 py-3"><dt className="text-caption font-medium text-text-secondary">{label}</dt><dd className="text-right text-caption font-bold text-text-primary">{value}</dd></div>)}
              </dl>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
