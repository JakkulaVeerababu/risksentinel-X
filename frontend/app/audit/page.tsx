"use client";

import React, { useState, useEffect } from 'react';
import { 
  Download, Calendar, ChevronDown, RefreshCcw, Search, Filter, SortDesc,
  Activity, ShieldAlert, Gavel, Network, Settings, User, X, FileJson, Copy, ExternalLink, AlertTriangle
} from "lucide-react";
import { fetchAuditEvents, AuditEvent } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchAuditEvents();
      setEvents(data);
      setError(false);
    } catch (err) {
      console.error("Failed to fetch audit events:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const getActorIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes('policy')) return <Gavel className="h-4 w-4 text-text-secondary" />;
    if (s.includes('agent') || s.includes('ai')) return <Activity className="h-4 w-4 text-primary" />;
    if (s.includes('graph')) return <Network className="h-4 w-4 text-text-secondary" />;
    if (s.includes('model') || s.includes('score')) return <ShieldAlert className="h-4 w-4 text-info" />;
    return <Settings className="h-4 w-4 text-text-secondary" />;
  };

  if (loading && events.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Trail" description="Trace every risk signal, recommendation, policy evaluation and analyst action." />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Trail" description="Trace every risk signal, recommendation, policy evaluation and analyst action." />
        <ErrorState title="Audit Data Unavailable" description="Failed to fetch audit events from the backend." />
      </div>
    );
  }

  const selectedEvent = events.find(e => e.event_id === selectedEventId);

  // Derived metrics
  const totalEvents = events.length;
  const decisionEvents = events.filter(e => e.event_type === "FINAL_DECISION_CREATED").length;
  const aiEvents = events.filter(e => e.service === "investigation_agent").length;

  return (
    <div className="flex flex-col gap-8 pb-12 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-heading-lg text-text-primary ">Audit Trail</h1>
            <span className="px-2 py-0.5 bg-success-soft text-success rounded text-caption font-semibold border border-success/20">BACKEND DATA</span>
          </div>
          <p className="text-label-sm text-text-secondary">Trace every risk signal, recommendation, policy evaluation and analyst action.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <Calendar className="h-4 w-4 text-text-muted" />
            Last 24 Hours <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>
          <button onClick={loadData} className="h-10 w-10 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors shadow-sm">
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="flex-1 flex flex-col p-5 border-r border-border">
          <div className="text-caption font-semibold uppercase text-text-muted mb-2">Total Events</div>
          <div className="text-[25px] font-semibold tabular-nums">{totalEvents}</div>
        </div>
        <div className="flex-1 flex flex-col p-5 border-r border-border">
          <div className="text-caption font-semibold uppercase text-text-muted mb-2">Decisions</div>
          <div className="text-[25px] font-semibold tabular-nums">{decisionEvents}</div>
        </div>
        <div className="flex-1 flex flex-col p-5">
          <div className="flex items-center gap-2 mb-2 text-caption font-semibold uppercase text-text-muted">
            <Activity className="h-4 w-4 text-primary" /> AI Investigations
          </div>
          <div className="text-[25px] font-semibold tabular-nums">{aiEvents}</div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full min-h-[600px]">
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
                <tr>
                  <th className="p-4 w-48">Timestamp</th>
                  <th className="p-4 w-36">Event ID</th>
                  <th className="p-4 w-48">Service</th>
                  <th className="p-4">Event Type</th>
                  <th className="p-4 w-40">Resource ID</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {events.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-text-secondary">No audit events found.</td></tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt.event_id} onClick={() => setSelectedEventId(evt.event_id)} className={`transition-colors cursor-pointer group ${selectedEventId === evt.event_id ? 'bg-primary-soft/50' : 'hover:bg-surface-secondary/50'}`}>
                      <td className={`p-4 border-l-[3px] ${selectedEventId === evt.event_id ? 'border-l-primary' : 'border-l-transparent group-hover:border-l-border-strong'}`}>
                        <span className="text-label-sm text-mono-sm font-mono text-text-secondary">{new Date(evt.timestamp).toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-label-sm text-mono-sm font-mono text-text-secondary">{evt.event_id.substring(0, 12)}...</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-surface-secondary border-border text-text-muted">
                            {getActorIcon(evt.service)}
                          </div>
                          <span className="text-label-sm font-semibold text-text-primary">{evt.service}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-label-sm font-medium text-text-primary">{evt.event_type}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-label-sm text-mono-sm font-mono font-semibold text-primary">{evt.resource_id}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-semibold ${evt.status === 'SUCCESS' ? 'text-success bg-success-soft border border-success/20' : 'text-danger bg-danger-soft border border-danger/20'}`}>
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedEvent && (
          <div className="w-full xl:w-[480px] shrink-0 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden animate-in slide-in-duration-300">
            <div className="p-6 border-b border-border bg-surface-secondary/50 flex justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-caption font-semibold uppercase text-text-muted">Audit Event</span>
                  <span className="text-caption text-mono-sm font-mono font-semibold text-text-secondary bg-surface border border-border px-2 py-1 rounded shadow-sm">{selectedEvent.event_id.substring(0, 12)}</span>
                </div>
                <h2 className="text-heading-lg font-semibold text-text-primary ">{selectedEvent.event_type}</h2>
                <div className="flex items-center gap-2 text-caption text-text-secondary mt-1">
                  <Calendar className="h-4 w-4" /> {new Date(selectedEvent.timestamp).toLocaleString()}
                </div>
              </div>
              <button onClick={() => setSelectedEventId(null)} className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface hover:text-text-primary shadow-sm transition-colors border border-transparent hover:border-border">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-surface-secondary/30">
              <div>
                <h3 className="text-label-sm font-semibold text-text-primary mb-3">Input Summary</h3>
                <pre className="bg-surface border border-border rounded-xl p-4 text-mono-sm font-mono text-text-secondary overflow-x-auto">
                  {JSON.stringify(selectedEvent.input_summary, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-label-sm font-semibold text-text-primary mb-3">Output Summary</h3>
                <pre className="bg-surface border border-border rounded-xl p-4 text-mono-sm font-mono text-text-secondary overflow-x-auto">
                  {JSON.stringify(selectedEvent.output_summary, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="border-t border-border bg-surface p-5">
               <div className="grid grid-cols-2 gap-y-4 gap-x-5 mb-5">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Actor</span>
                    <span className="text-caption text-mono-sm font-mono font-semibold text-text-primary">{selectedEvent.actor}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Status</span>
                    <span className="text-caption text-mono-sm font-mono font-semibold text-text-primary">{selectedEvent.status}</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
