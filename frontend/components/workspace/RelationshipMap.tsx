"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Globe, Monitor, UserRound, CircleHelp, Store, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchGraphContext } from "../../lib/api";
import { connectionPosition, directNeighbors, entityKind, ENTITY_LABELS, RelationshipContext, RelationshipNode } from "../../lib/relationship-presentation";
import "../../styles/relationship-map.css";

export type ClusterEntity = { id: string; type: string };
const entityIcons = { customer: UserRound, device: Monitor, ip: Globe, merchant: Store, payment_instrument: CreditCard, transaction: CreditCard, payment: CreditCard, unknown: CircleHelp };
const PAGE_SIZE = 6;

export default function RelationshipMap({ entities }: { entities: ClusterEntity[] }) {
  const [anchorId, setAnchorId] = useState(() => (entities.find(entity => entity.type === "customer") || entities[0])?.id || "");
  const [context, setContext] = useState<RelationshipContext | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setContext(null);
    setError(false);
    setSelectedId(anchorId);
    setPage(0);
    if (!anchorId) { setLoading(false); return; }
    fetchGraphContext(anchorId).then((result: RelationshipContext) => {
      if (!active) return;
      setContext(result);
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [anchorId, retry]);

  const neighbors = useMemo(() => directNeighbors(context, anchorId), [context, anchorId]);
  const anchor = context?.nodes.find(node => node.id === anchorId) || { id: anchorId, group: entities.find(entity => entity.id === anchorId)?.type };
  const pages = Math.max(1, Math.ceil(neighbors.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages - 1);
  const visible = neighbors.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const positions = new Map<string, { x: number; y: number }>([[anchorId, { x: 50, y: 166 }], ...visible.map((node, index): [string, { x: number; y: number }] => [node.id, connectionPosition(index, visible.length)])]);
  const focused = context?.nodes.find(node => node.id === selectedId);

  function entityNode(node: RelationshipNode, root = false) {
    const position = positions.get(node.id)!;
    const kind = entityKind(node.group);
    const Icon = entityIcons[kind];
    const selected = node.id === selectedId;
    return <button type="button" key={node.id} onClick={() => setSelectedId(node.id)} aria-pressed={selected} aria-label={`${ENTITY_LABELS[kind]} ${node.id}`} className="relationship-vertex" data-root={root} style={{ left: `${position.x}%`, top: position.y }} title={`${ENTITY_LABELS[kind]} · ${node.id}`}>
      <span className="relationship-symbol"><Icon aria-hidden="true" /></span>
      <span className="relationship-vertex-id">{node.id}</span>
      <span className="relationship-vertex-type">{root ? "Focus · " : ""}{ENTITY_LABELS[kind]}</span>
    </button>;
  }

  return <section className="relationship-map" aria-label="Relationship map">
    <div className="relationship-map-header">
      <div><h3>Relationship map</h3><p>Direct connections · Select a node to inspect</p></div>
      <label>Focus entity<select aria-label="Relationship map entity" value={anchorId} onChange={event => setAnchorId(event.target.value)}>{entities.map(entity => <option key={entity.id} value={entity.id}>{entity.id}</option>)}</select></label>
    </div>
    {loading ? <div className="relationship-loading" role="status"><RefreshCw className="h-4 w-4 animate-spin" />Loading connections…</div> : error ? <div className="px-6 py-12 text-center"><h4 className="text-[13px] font-semibold text-[#526177]">Connections could not be loaded</h4><p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-[#7b879a]">Select another entity or retry. No inferred connections are drawn in this view.</p><button className="workspace-button mt-4" onClick={() => setRetry(value => value + 1)}>Retry connections</button></div> : !anchorId ? <p className="p-10 text-[12px] text-[#7b879a]">No entities available for this cluster.</p> : <>
      <div className="relationship-canvas" role="group" aria-label="Connected entities">
        <svg viewBox="0 0 1000 344" preserveAspectRatio="none" aria-hidden="true">
          {visible.map(node => {
            const position = positions.get(node.id)!;
            return <line key={node.id} x1="500" y1="166" x2={position.x * 10} y2={position.y} stroke={selectedId === node.id ? "#4274de" : "#d0d9e5"} strokeWidth={selectedId === node.id ? "1.8" : "1.2"} vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        {entityNode(anchor, true)}
        {visible.map(node => entityNode(node))}
        {!neighbors.length && <p className="relationship-empty">No direct connections were returned for this entity.</p>}
      </div>
      <div className="relationship-map-footer">
        <div className="relationship-selection" aria-live="polite"><strong>{focused ? `${ENTITY_LABELS[entityKind(focused.group)]} · ${focused.id}` : "Select an entity"}</strong><p>{selectedId === anchorId ? "Focus entity · Only recorded connections shown" : `${entities.some(entity => entity.id === selectedId) ? "Cluster member" : "External neighbor"} · Connected to ${anchorId}`}</p></div>
        <div className="relationship-pagination"><span role="status">{neighbors.length ? `${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, neighbors.length)}` : "0"} of {neighbors.length} links</span>{pages > 1 && <><button type="button" aria-label="Previous connections" disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); setSelectedId(anchorId); }}><ChevronLeft /></button><button type="button" aria-label="Next connections" disabled={currentPage === pages - 1} onClick={() => { setPage(currentPage + 1); setSelectedId(anchorId); }}><ChevronRight /></button></>}</div>
      </div>
    </>}
  </section>;
}
