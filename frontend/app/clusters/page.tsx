"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, RefreshCw } from "lucide-react";
import { PageHeader, ErrorState, Skeleton } from "../../components/ui";
import { fetchFraudClusters } from "../../lib/api";
import RelationshipMap, { ClusterEntity } from "../../components/workspace/RelationshipMap";
import SeverityLabel from "../../components/ui/SeverityLabel";

type FraudCluster = { id: string; title: string; severity: string; score: number; accounts: number; transactions: number; exposure_amount: number; signal: string; nodes: ClusterEntity[] };
const currency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(amount || 0);

export default function FraudClustersPage() {
  const [clusters, setClusters] = useState<FraudCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetchFraudClusters().then(data => {
      if (!active) return;
      setClusters(data);
      setSelectedId(current => data.some(cluster => cluster.id === current) ? current : data[0]?.id || "");
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);

  const selected = clusters.find(cluster => cluster.id === selectedId) || clusters[0];
  const filtered = useMemo(() => clusters.filter(cluster => `${cluster.id} ${cluster.title} ${cluster.signal}`.toLowerCase().includes(query.toLowerCase())), [clusters, query]);
  const exposure = clusters.reduce((total, cluster) => total + (cluster.exposure_amount || 0), 0);

  return <div className="min-w-0 space-y-5">
    <PageHeader eyebrow="Graph intelligence" title="Fraud clusters" description="Connect the entities, inspect the evidence, and find a clear starting point for investigation." actions={<Link href="/graph" className="workspace-button">Open graph explorer<ArrowRight className="h-3.5 w-3.5" /></Link>} />
    {loading ? <Skeleton className="h-[450px]" /> : error ? <ErrorState title="Clusters could not be loaded" description="The graph service may be unavailable. Check the connection and try again." onRetry={() => setReload(value => value + 1)} /> : !selected ? <div className="rounded-xl border border-[#dde3ec] bg-white px-6 py-14 text-center"><h2 className="text-[15px] font-semibold">No clusters available</h2><p className="mt-2 text-[12px] text-[#7b879a]">Clusters will appear when graph data is loaded.</p><button className="workspace-button mt-4" onClick={() => setReload(value => value + 1)}><RefreshCw className="h-3.5 w-3.5" />Refresh</button></div> : <>
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Cluster summary">
        {[["Clusters", String(clusters.length), "Returned by the graph service"], ["Linked identities", String(clusters.reduce((sum, cluster) => sum + cluster.accounts, 0)), "Across these clusters"], ["Critical clusters", String(clusters.filter(cluster => cluster.severity === "Critical").length), "Prioritize for review"], ["Estimated exposure", currency(exposure), "Uncalibrated estimate"]].map(([label, value, helper]) => <div className="workspace-stat !px-5" key={label}><p className="text-[12px] font-medium text-[#7a879b]">{label}</p><strong className={`mt-3 block text-[27px] font-semibold leading-none tracking-tight tabular-nums ${label === "Critical clusters" ? "text-[#bf493f]" : "text-[#273750]"}`}>{value}</strong><p className="mt-2 text-[10px] text-[#8b95a5]">{helper}</p></div>)}
      </section>
      <section className="grid min-w-0 items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-[#dde3ec] bg-white">
          <div className="border-b border-[#e7ecf2] p-4"><label className="relative block"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8b96a8]" /><input aria-label="Search clusters" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search clusters…" className="h-9 w-full border border-[#dce3ec] bg-white pl-9 pr-3 text-[12px] outline-none" /></label></div>
          <div className="max-h-[320px] divide-y divide-[#edf0f5] overflow-y-auto xl:max-h-[670px]">
            {filtered.map(cluster => <button type="button" key={cluster.id} aria-pressed={selectedId === cluster.id} aria-label={`Inspect cluster ${cluster.id}`} onClick={() => setSelectedId(cluster.id)} className={`w-full !rounded-none border-l-2 p-4 text-left transition-colors ${selectedId === cluster.id ? "border-l-[#245df5] bg-[#f2f6ff]" : "border-l-transparent hover:bg-[#fafbfd]"}`}>
              <div className="flex items-center justify-between gap-2"><span className="font-mono text-[11px] font-medium text-[#526177]">{cluster.id}</span><SeverityLabel severity={cluster.severity} /></div>
              <p className="mt-3 text-[13px] font-semibold leading-5 text-[#32425b]">{cluster.title}</p>
              <p className="mt-1.5 text-[11px] text-[#8290a2]">{cluster.signal}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[#e5eaf2] pt-3 text-[11px]"><span className="text-[#8290a2]">Estimated exposure</span><strong className="font-medium text-[#526177]">{currency(cluster.exposure_amount)}</strong></div>
            </button>)}
            {!filtered.length && <p className="px-4 py-10 text-center text-[12px] text-[#8290a2]">No matching clusters. Try another ID.</p>}
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-[#dde3ec] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7ecf2] px-5 py-5">
            <div><div className="flex items-center gap-3"><span className="font-mono text-[11px] text-[#8290a2]">{selected.id}</span><SeverityLabel severity={selected.severity} /></div><h2 className="mt-2 text-[17px] font-semibold tracking-tight text-[#273750]">{selected.title}</h2></div>
            <Link href="/investigation" className="workspace-button workspace-button-primary">Open investigation<ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <RelationshipMap key={selected.id} entities={selected.nodes || []} />
          <div className="border-t border-[#e7ecf2] bg-[#fcfdff] px-5 py-5">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">{[["Cluster risk estimate", `${selected.score} / 100`], ["Linked payments", String(selected.transactions)], ["Cluster entities shown", String(selected.nodes?.length || 0)], ["Estimated exposure", currency(selected.exposure_amount)]].map(([label, value]) => <div key={label}><p className="text-[10px] text-[#8490a2]">{label}</p><strong className="mt-2 block text-[16px] font-semibold text-[#45546c]">{value}</strong></div>)}</div>
            <p className="mt-5 border-t border-[#e7ecf2] pt-3 text-[10px] leading-5 text-[#8b96a7]">Connections come from the loaded graph. Cluster risk scores and exposure are estimates, not calibrated financial measurements.</p>
          </div>
        </div>
      </section>
    </>}
  </div>;
}
