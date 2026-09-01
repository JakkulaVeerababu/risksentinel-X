"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { fetchAuditEvents, type AuditEvent } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { auditCounts, eventLabel, filterAuditEvents, recordedAt, type AuditCategory } from "../../lib/audit-presentation";
import { readableCode } from "../../lib/transaction-presentation";
import AuditEventDetails from "../../components/workspace/AuditEventDetails";
import RecordInspector from "../../components/workspace/RecordInspector";

const PAGE_SIZE = 50;

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState<AuditCategory>("all");
  const [search, setSearch] = useState("");
  const [hours, setHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [asOf, setAsOf] = useState(Date.now());
  const trigger = useRef<HTMLButtonElement | null>(null);
  const busy = useRef(false);

  async function loadData(append = false) {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    try {
      const start = append ? offset : 0;
      const data = await fetchAuditEvents(new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(start) }));
      if (!Array.isArray(data)) throw new Error("Invalid audit response");
      setEvents(previous => Array.from(new Map([...(append ? previous : []), ...data].map(event => [event.event_id, event])).values()));
      setOffset(start + data.length);
      setHasMore(data.length === PAGE_SIZE);
      setAsOf(Date.now());
      setError(false);
    } catch { setError(true); }
    finally { setLoading(false); busy.current = false; }
  }
  useEffect(() => { void loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = filterAuditEvents(events, category, search, hours, asOf);
  const selected = visible.find(event => event.event_id === selectedId);
  const counts = auditCounts(filterAuditEvents(events, "all", search, hours, asOf));
  const closeDetails = () => { setSelectedId(null); trigger.current?.focus({ preventScroll: true }); };

  return <div className="review-workspace">
    <PageHeader eyebrow="Evidence & accountability" title="Audit trail" description="Follow every contribution to a payment decision." actions={<button className="workspace-button" onClick={() => loadData()} disabled={loading}><RefreshCw size={14} className={loading ? "animate-spin" : ""} />{loading ? "Refreshing…" : "Refresh"}</button>} />
    {error && !events.length ? <ErrorState title="Audit trail unavailable" description="The recorded events could not be loaded." onRetry={() => loadData()} /> : <>
      <div className="record-metrics" aria-label="Audit event counts"><div><span>Loaded events</span><strong>{loading && !events.length ? "—" : counts.total}</strong></div><div><span>Decision events</span><strong>{loading && !events.length ? "—" : counts.decisions}</strong></div><div><span>Investigation events</span><strong>{loading && !events.length ? "—" : counts.investigations}</strong></div></div>
      <p className="record-scope">Counts reflect loaded records matching your search and time range, not unique payments or investigations.</p>
      {error && <p className="record-inline-error" role="alert">Could not update the trail. Previously loaded events are still shown. Try refreshing again.</p>}
      <div className="record-toolbar">
        <div className="record-filters" role="group" aria-label="Event category">{([["all", "All events"], ["decisions", "Decisions"], ["investigations", "Investigations"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setSelectedId(null); }}>{label}</button>)}</div>
        <div className="record-search-controls"><label className="record-search"><Search size={15} aria-hidden="true" /><input aria-label="Search audit events" placeholder="Search event, resource or reason…" value={search} onChange={event => { setSearch(event.target.value); setSelectedId(null); }} /></label><select aria-label="Time range within loaded events" value={hours ?? "all"} onChange={event => { setHours(event.target.value === "all" ? null : Number(event.target.value)); setSelectedId(null); }}><option value="all">Any time</option><option value="24">Last 24 hours</option><option value="168">Last 7 days</option></select></div>
      </div>
      {loading && !events.length ? <Skeleton className="h-64" /> : <div className={`record-layout ${selected ? "has-inspector" : ""}`}>
        <section className="record-card record-list" aria-label="Recorded events" aria-busy={loading}>
          <header className="record-list-heading"><h2>Recorded events <span>{visible.length}</span></h2><span>Newest first</span></header>
          <table className="records-table audit-records-table"><caption className="sr-only">Recorded audit events. Select an event to inspect its details.</caption><colgroup><col style={{ width: "38%" }} /><col style={{ width: "25%" }} /><col style={{ width: "23%" }} /><col style={{ width: "14%" }} /></colgroup><thead><tr><th scope="col">Event / service</th><th scope="col">Resource</th><th scope="col">Recorded</th><th scope="col">Status</th></tr></thead>
            <tbody>{visible.map(event => <tr key={event.event_id} data-selected={selected?.event_id === event.event_id} onClick={e => { trigger.current = e.currentTarget.querySelector("button"); setSelectedId(event.event_id); }}>
              <td><button className="record-row-button" aria-label={`Inspect ${eventLabel(event.event_type)} ${event.event_id}`} aria-expanded={selected?.event_id === event.event_id} aria-controls={selected?.event_id === event.event_id ? "record-inspector" : undefined}>{eventLabel(event.event_type)}</button><span className="record-cell-secondary">{event.service}</span></td>
              <td data-label="Resource"><span className="record-code">{event.resource_id || "Not recorded"}</span></td>
              <td data-label="Recorded"><time dateTime={event.timestamp}>{recordedAt(event.timestamp, true)}</time></td>
              <td data-label="Status"><span className="record-status" data-status={event.status}>{readableCode(event.status)}</span></td>
            </tr>)}</tbody>
          </table>
          {!visible.length && <div className="record-empty"><h3>No matching events</h3><p>{events.length ? "Try another search or load older records." : "No audit events have been returned."}</p>{(search || hours !== null || category !== "all") && <button className="workspace-button" onClick={() => { setSearch(""); setHours(null); setCategory("all"); }}>Clear filters</button>}</div>}
          <footer className="record-list-footer"><span>{events.length} records loaded{hasMore ? " · older records available" : " · end of results"}</span>{hasMore && <button className="workspace-button" disabled={loading} onClick={() => loadData(true)}>{loading ? "Loading…" : "Load older events"}</button>}</footer>
        </section>
        {selected && <RecordInspector key={selected.event_id} recordId={selected.event_id} title={eventLabel(selected.event_type)} subtitle={recordedAt(selected.timestamp)} onClose={closeDetails}>
          <AuditEventDetails event={selected} />
          {selected.resource_id && <div className="inspector-actions"><Link className="workspace-button" href={`/transactions/${encodeURIComponent(selected.resource_id)}`}>View payment <ArrowUpRight size={14} /></Link></div>}
        </RecordInspector>}
      </div>}
    </>}
  </div>;
}
