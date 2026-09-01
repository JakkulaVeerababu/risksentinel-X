"use client";

import { ChevronDown } from "lucide-react";
import type { AuditEvent } from "../../lib/api";
import { eventLabel, eventSummary, recordedAt } from "../../lib/audit-presentation";
import AuditEventDetails from "./AuditEventDetails";

export default function AuditTimeline({ events, error = false, onRetry, id = "record-audit" }: { events: AuditEvent[]; error?: boolean; onRetry?: () => void; id?: string }) {
  const sorted = [...events].sort((a, b) => (Date.parse(a.timestamp) || 0) - (Date.parse(b.timestamp) || 0));
  return <section id={id} className="record-card record-timeline" aria-label="Audit timeline">
    <header className="record-section-header"><div><h2>Audit timeline</h2><p>Evidence, investigation and policy, in recorded order.</p></div><span>{events.length} {events.length === 1 ? "event" : "events"} · oldest first</span></header>
    {error ? <div className="record-empty"><p>Audit events could not be loaded. The decision details remain available.</p>{onRetry && <button className="workspace-button" onClick={onRetry}>Retry audit trail</button>}</div> : !events.length ? <p className="record-empty">No audit events were recorded for this payment.</p> : <ol className="record-event-list">{sorted.map((event, index) => <li key={event.event_id}>
      <details className="record-timeline-event">
        <summary><span className="timeline-index">{String(index + 1).padStart(2, "0")}</span><span className="timeline-description"><strong>{eventLabel(event.event_type)}</strong><span>{eventSummary(event)}</span></span><time dateTime={event.timestamp}>{recordedAt(event.timestamp)}</time><ChevronDown size={15} className="timeline-chevron" aria-hidden="true" /></summary>
        <div className="timeline-event-body"><AuditEventDetails event={event} /></div>
      </details>
    </li>)}</ol>}
  </section>;
}
