"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchRiskCase, fetchAuditTimeline, PipelineResponse, AuditEvent } from "@/lib/api";
import { timeAgo } from "@/lib/utils";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const [data, setData] = useState<PipelineResponse | null>(null);
  const [timeline, setTimeline] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [caseRes, auditRes] = await Promise.all([
          fetchRiskCase(transactionId),
          fetchAuditTimeline(transactionId).catch(() => ({ events: [] }))
        ]);

        if (!caseRes || (caseRes as any).error) {
          throw new Error((caseRes as any).error || "Failed to load transaction data");
        }

        setData(caseRes);
        setTimeline(auditRes.events || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [transactionId]);

  if (loading) {
    return <div className="p-8 flex justify-center"><p className="text-text-secondary">Loading transaction details...</p></div>;
  }

  if (error || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.14em] text-danger">Data unavailable</p>
        <h2 className="text-xl font-bold text-text-primary mb-2">Transaction Not Found</h2>
        <p className="text-text-secondary mb-6">{error}</p>
        <button onClick={() => router.push("/transactions")} className="px-4 py-2 bg-surface border border-border rounded-lg shadow-sm hover:bg-surface-secondary">
          Return to Transactions
        </button>
      </div>
    );
  }

  const { transaction, ml, graph, agent, policy } = data;

  // Helpers
  const decisionColor = (dec: string) => {
    if (dec === "BLOCK") return "text-danger bg-danger-soft border-danger/20";
    if (dec === "REVIEW") return "text-warning bg-warning-soft border-warning/20";
    return "text-success bg-success-soft border-success/20";
  };

  const riskColor = (score: number, threshold: number) => {
    if (score >= threshold) return "text-danger";
    if (score >= threshold * 0.7) return "text-warning";
    return "text-success";
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/transactions" className="inline-flex items-center text-text-secondary hover:text-text-primary text-sm font-medium mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to transactions
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-mono">{transaction.id}</h1>
            <p className="text-text-secondary mt-1">
              Customer: <span className="font-semibold text-text-primary">{transaction.customer_id}</span> • Amount: <span className="font-semibold text-text-primary tabular-nums">₹{transaction.amount?.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-md text-sm font-bold uppercase border ${decisionColor(policy.decision)}`}>
              Final Decision: {policy.decision}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ML SECTION */}
        <div className="border border-border rounded-xl bg-surface shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-border bg-surface-secondary px-5 py-4">
            <h2 className="rsx-rule-heading">1. ML analysis</h2>
          </div>
          <div className="p-5 flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-text-secondary">Risk Score</span>
              <span className={`text-3xl font-bold tabular-nums ${riskColor(ml.risk_score, 0.8)}`}>
                {(ml.risk_score * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden mb-6">
              <div
                className={`h-full ${ml.risk_score >= 0.8 ? 'bg-danger' : ml.risk_score >= 0.4 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min(100, Math.max(0, ml.risk_score * 100))}%` }}
              />
            </div>
            <div className="text-sm space-y-2 text-text-secondary">
              <p>Model Version: <span className="font-mono text-text-primary">{ml.version}</span></p>
              <p>Threshold: <span className="font-mono text-text-primary">80.0%</span></p>
            </div>
          </div>
        </div>

        {/* GRAPH SECTION */}
        <div className="border border-border rounded-xl bg-surface shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-border bg-surface-secondary px-5 py-4">
            <h2 className="rsx-rule-heading">2. Graph intelligence</h2>
          </div>
          <div className="p-5 flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-text-secondary">Graph Score</span>
              {graph.risk_score === null ? (
                <span className="text-sm font-bold text-text-muted italic">Unavailable</span>
              ) : (
                <span className={`text-3xl font-bold tabular-nums ${riskColor(graph.risk_score, 0.3)}`}>
                  {(graph.risk_score * 100).toFixed(1)}%
                </span>
              )}
            </div>
            {graph.risk_score !== null && (
              <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full ${graph.risk_score >= 0.3 ? 'bg-danger' : 'bg-success'}`}
                  style={{ width: `${Math.min(100, Math.max(0, graph.risk_score * 100))}%` }}
                />
              </div>
            )}
            <div className="text-sm space-y-2 text-text-secondary">
              <p>Cluster Detected: <span className={`font-semibold ${graph.cluster_detected ? 'text-danger' : 'text-success'}`}>{graph.cluster_detected ? "Yes" : "No"}</span></p>
              {graph.cluster_detected && (
                <p>Signal: Shared attributes detected across multiple entities.</p>
              )}
              <p>Threshold: <span className="font-mono text-text-primary">30.0%</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* AGENT SECTION */}
        <div className="border border-border rounded-xl bg-surface shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-border bg-surface-secondary px-5 py-4 flex justify-between items-center">
            <h2 className="rsx-rule-heading">3. Agent investigation</h2>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${agent.status === 'COMPLETED' ? 'bg-success-soft text-success' : agent.status === 'DEGRADED' ? 'bg-warning-soft text-warning' : 'bg-surface-secondary text-text-muted'}`}>
              {agent.status}
            </span>
          </div>
          <div className="p-5 flex-1">
            {agent.status === "SKIPPED" ? (
              <div className="h-full flex items-center justify-center text-center p-4">
                <p className="text-text-muted text-sm font-medium italic">Investigation skipped — machine evidence below investigation thresholds.</p>
              </div>
            ) : agent.status === "DEGRADED" ? (
              <div className="h-full flex items-center justify-center text-center p-4">
                <p className="text-warning text-sm font-medium">Provider unavailable. Running in degraded mode. Deterministic policy will apply safely.</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-text-secondary mb-1">Recommendation:</p>
                  <span className={`px-3 py-1 rounded-md text-sm font-bold uppercase border ${decisionColor(agent.recommendation || "")}`}>
                    {agent.recommendation}
                  </span>
                  {agent.confidence && (
                    <span className="ml-3 text-sm font-semibold tabular-nums text-text-primary">
                      {Math.round(agent.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
                {agent.reason_codes && agent.reason_codes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-text-secondary mb-1">Reason Codes:</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.reason_codes.map((code, idx) => (
                        <span key={idx} className="bg-surface-secondary border border-border px-2 py-0.5 rounded text-xs font-mono text-text-primary">{code}</span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-text-muted mt-6">Agent recommendation is strictly advisory.</p>
              </div>
            )}
          </div>
        </div>

        {/* POLICY SECTION */}
        <div className="border border-border rounded-xl bg-surface shadow-sm overflow-hidden flex flex-col border-l-4 border-l-primary">
          <div className="border-b border-border bg-surface-secondary px-5 py-4">
            <h2 className="rsx-rule-heading">4. Policy decision</h2>
          </div>
          <div className="p-5 flex-1">
            <div className="mb-5">
              <p className="text-sm text-text-secondary mb-2 uppercase tracking-wide font-bold">Final Deterministic Authority</p>
              <div className={`inline-block px-4 py-2 rounded-lg text-lg font-black uppercase border-2 ${decisionColor(policy.decision)}`}>
                {policy.decision}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-secondary">Policy Version:</p>
                <p className="font-mono text-text-primary bg-surface-secondary px-2 py-0.5 rounded inline-block mt-1">{policy.version}</p>
              </div>
              {policy.reason && (
                <div>
                  <p className="text-text-secondary">Reason:</p>
                  <p className="font-medium text-text-primary">{policy.reason}</p>
                </div>
              )}
              {policy.triggered_rules && policy.triggered_rules.length > 0 && (
                <div>
                  <p className="text-text-secondary">Triggered Rules:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {policy.triggered_rules.map((rule, idx) => (
                      <li key={idx} className="font-mono text-xs text-text-primary">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AUDIT TIMELINE */}
      <div className="border border-border rounded-xl bg-surface shadow-sm overflow-hidden">
        <div className="border-b border-border bg-surface-secondary px-5 py-4">
          <h2 className="rsx-rule-heading">Audit timeline</h2>
        </div>
        <div className="p-5">
          {timeline.length === 0 ? (
            <p className="text-sm text-text-muted">No audit events available.</p>
          ) : (
            <div className="relative border-l border-border ml-3 space-y-6">
              {timeline.map((event, idx) => (
                <div key={event.event_id || idx} className="relative pl-6">
                  <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-border border-[3px] border-surface" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                    <h3 className="text-sm font-bold text-text-primary">{event.event_type}</h3>
                    <span className="text-xs text-text-muted font-mono">{new Date(event.timestamp).toLocaleTimeString()} ({timeAgo(event.timestamp)})</span>
                  </div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{event.service}</p>
                  <div className="text-sm text-text-secondary bg-surface-secondary p-3 rounded-md border border-border-subtle">
                    {typeof event.output_summary === 'object' ? (
                      <pre className="text-[10px] font-mono overflow-x-auto">
                        {JSON.stringify(event.output_summary, null, 2)}
                      </pre>
                    ) : (
                      <p>{event.output_summary}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
