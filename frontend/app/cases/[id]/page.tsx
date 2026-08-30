"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";
import { fetchRiskCase, fetchAuditTimeline, PipelineResponse, AuditEvent } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../../components/ui";

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [caseData, auditData] = await Promise.all([
          fetchRiskCase(caseId),
          fetchAuditTimeline(caseId).catch(() => ({ events: [] }))
        ]);
        if ((caseData as any).error) throw new Error((caseData as any).error);
        setData(caseData);
        setAuditEvents(auditData.events || []);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch case details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (caseId) loadData();
  }, [caseId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Case Detail" description="Loading case evidence hierarchy..." />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Case Detail" description="Manage fraud investigation." />
        <ErrorState title="Case Not Found" description={`Failed to load case data for ID: ${caseId}`} />
        <button onClick={() => router.push('/cases')} className="text-primary font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Cases
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col gap-8 pb-16">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/cases')} className="p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-display-lg font-semibold leading-tight tracking-[-.04em] text-text-primary">Case: {caseId}</h1>
          <p className="text-label-sm text-text-secondary">Evidence Hierarchy</p>
        </div>
      </div>

      <div className="relative flex flex-col gap-4">
        
        {/* 1. Transaction */}
        <div className="flex gap-4 relative">
          <div className="w-12 shrink-0 pt-2 text-right font-mono text-[10px] font-semibold text-text-muted">01</div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex-1">
            <h2 className="text-label-md font-semibold text-text-primary mb-4 uppercase tracking-widest">Transaction Context</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">AMOUNT</p>
                <div className="text-label-lg font-bold tabular-nums text-text-primary">
                  ₹{data.transaction.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">CUSTOMER ID</p>
                <div className="text-label-sm text-mono-sm font-mono text-primary font-medium truncate">
                  {data.transaction.customer_id}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-caption font-semibold text-text-muted mb-1">TIMESTAMP</p>
                <div className="text-label-sm text-text-secondary">
                  {data.transaction.timestamp ? new Date(data.transaction.timestamp).toLocaleString() : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Machine Risk */}
        <div className="flex gap-4 relative">
          <div className="w-12 shrink-0 pt-2 text-right font-mono text-[10px] font-semibold text-text-muted">02</div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex-1">
            <h2 className="text-label-md font-semibold text-text-primary mb-4 uppercase tracking-widest">Machine Risk (ML)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">RISK SCORE</p>
                <div className="text-2xl font-bold tabular-nums text-text-primary">
                  {data.ml.risk_score.toFixed(3)}
                </div>
              </div>
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">MODEL VERSION</p>
                <div className="text-label-sm text-text-secondary font-mono bg-surface-secondary px-2 py-1 rounded border border-border w-fit">
                  {data.ml.version}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Graph Context */}
        <div className="flex gap-4 relative">
          <div className="w-12 shrink-0 pt-2 text-right font-mono text-[10px] font-semibold text-text-muted">03</div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex-1">
            <h2 className="text-label-md font-semibold text-text-primary mb-4 uppercase tracking-widest">Graph Context</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">GRAPH SCORE</p>
                <div className="text-2xl font-bold tabular-nums text-text-primary">
                  {data.graph.risk_score ? data.graph.risk_score.toFixed(3) : '0.000'}
                </div>
              </div>
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">CLUSTER</p>
                <div className={`text-label-sm font-semibold ${data.graph.cluster_detected ? 'text-warning' : 'text-success'}`}>
                  {data.graph.cluster_detected ? 'YES' : 'NO'}
                </div>
              </div>
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">SHARED DEVICES</p>
                <p className="text-label-sm font-medium text-text-primary">{data.graph.shared_devices}</p>
              </div>
              <div>
                <p className="text-caption font-semibold text-text-muted mb-1">CONNECTIONS</p>
                <p className="text-label-sm font-medium text-text-primary">{data.graph.connected_customers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Agent Investigation */}
        <div className="flex gap-4 relative">
          <div className="w-12 shrink-0 pt-2 text-right font-mono text-[10px] font-semibold text-text-muted">04</div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex-1">
            <h2 className="text-label-md font-semibold text-text-primary mb-4 uppercase tracking-widest">Agent Recommendation (Advisory)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-surface-secondary rounded-lg p-3 border border-border-subtle">
                <p className="text-caption font-semibold text-text-muted mb-1">RECOMMENDATION</p>
                <div className={`text-label-lg font-bold ${data.agent.recommendation === 'BLOCK' ? 'text-danger' : data.agent.recommendation === 'REVIEW' ? 'text-warning' : data.agent.recommendation === 'ALLOW' ? 'text-success' : 'text-text-primary'}`}>
                  {data.agent.recommendation || 'PENDING'}
                </div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-3 border border-border-subtle">
                <p className="text-caption font-semibold text-text-muted mb-1">CONFIDENCE</p>
                <div className="text-label-lg font-bold text-text-primary">
                  {data.agent.confidence ? `${(data.agent.confidence * 100).toFixed(1)}%` : '--'}
                </div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-3 border border-border-subtle">
                <p className="text-caption font-semibold text-text-muted mb-1">STATUS</p>
                <div className="text-label-lg font-bold text-text-primary">
                  {data.agent.status}
                </div>
              </div>
            </div>
            <div>
              <p className="text-caption font-semibold text-text-muted mb-2">REASON CODES</p>
              <ul className="list-disc pl-5 text-label-sm text-text-secondary">
                {data.agent.reason_codes && data.agent.reason_codes.length > 0 ? (
                  data.agent.reason_codes.map((rc, idx) => <li key={idx} className="mb-1">{rc}</li>)
                ) : (
                  <li>None provided.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Policy Decision */}
        <div className="flex gap-4 relative">
          <div className="w-12 shrink-0 pt-2 text-right font-mono text-[10px] font-bold text-primary">05</div>
          <div className="rounded-xl border-2 border-primary bg-primary-soft p-6 shadow-md flex-1">
            <h2 className="text-label-lg font-bold text-primary mb-4 uppercase tracking-widest">Final Policy Enforcement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4 border border-border-strong">
                <p className="text-caption font-semibold text-text-muted mb-1">DECISION</p>
                <div className={`text-2xl font-bold ${data.policy.decision === 'BLOCK' ? 'text-danger' : data.policy.decision === 'REVIEW' ? 'text-warning' : 'text-success'}`}>
                  {data.policy.decision || 'PENDING'}
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 border border-border-strong">
                <p className="text-caption font-semibold text-text-muted mb-1">REASON</p>
                <div className="text-label-sm font-medium text-text-primary">
                  {data.policy.reason || 'N/A'}
                </div>
              </div>
            </div>
            <div className="mt-4 bg-surface rounded-lg p-4 border border-border-strong">
              <p className="text-caption font-semibold text-text-muted mb-2">TRIGGERED RULES</p>
              <div className="flex flex-wrap gap-2">
                {data.policy.triggered_rules && data.policy.triggered_rules.length > 0 ? (
                  data.policy.triggered_rules.map((rule, idx) => (
                    <span key={idx} className="px-2 py-1 bg-surface-secondary text-text-primary text-mono-sm font-mono rounded border border-border">
                      {rule}
                    </span>
                  ))
                ) : (
                  <span className="text-label-sm text-text-muted">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 6. Audit Trail */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="mb-6 flex items-center gap-2 text-text-primary">
          <h2 className="rsx-rule-heading">Recorded audit trail</h2>
        </div>
        
        <div className="overflow-y-auto max-h-[400px] border border-border rounded-xl bg-surface shadow-sm">
          {auditEvents.length === 0 ? (
            <div className="text-label-sm text-text-muted text-center py-8">No audit events found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-secondary sticky top-0 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-caption font-semibold text-text-muted uppercase">Time</th>
                  <th className="px-4 py-3 text-caption font-semibold text-text-muted uppercase">Service</th>
                  <th className="px-4 py-3 text-caption font-semibold text-text-muted uppercase">Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {auditEvents.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 text-mono-sm font-mono text-text-secondary w-32">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-3 text-caption font-bold uppercase text-text-primary w-32">{evt.service}</td>
                    <td className="px-4 py-3 text-label-sm text-text-secondary">{evt.event_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
