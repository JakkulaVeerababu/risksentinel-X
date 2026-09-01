"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ArrowUpRight } from "lucide-react";
import { fetchRiskCase, fetchAuditTimeline, resolveRiskCase, type PipelineResponse, type AuditEvent } from "@/lib/api";
import { Skeleton, ErrorState, DecisionBadge } from "../../../components/ui";
import AuditTimeline from "../../../components/workspace/AuditTimeline";
import InvestigationEvidence from "../../../components/workspace/InvestigationEvidence";
import { money, recordedAt, reasonText, policyExplanation } from "../../../lib/audit-presentation";
import { readableCode, riskLevel, scorePercent } from "../../../lib/transaction-presentation";

export default function CaseDetailPage() {
  const caseId = useParams().id as string;
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [auditError, setAuditError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [resolvingDecision, setResolvingDecision] = useState<"ALLOW" | "BLOCK" | null>(null);

  const handleResolve = async (finalDecision: "ALLOW" | "BLOCK") => {
    setResolvingDecision(finalDecision);
    try {
      await resolveRiskCase(caseId, finalDecision);
      setData(prev => prev ? { ...prev, policy: { ...prev.policy, decision: finalDecision } } : prev);
      const audit = await fetchAuditTimeline(caseId).catch(() => ({ events: [] }));
      if (audit.events) setEvents(audit.events);
    } catch (err) {
      alert("Failed to resolve case.");
    } finally {
      setResolvingDecision(null);
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    async function load() {
      try {
        const [result, audit] = await Promise.all([
          fetchRiskCase(caseId),
          fetchAuditTimeline(caseId).then(value => ({ events: value.events, failed: false })).catch(() => ({ events: [], failed: true })),
        ]);
        if (!active) return;
        if (!result?.transaction) throw new Error("Case unavailable");
        setData(result);
        setEvents(audit.events || []);
        setAuditError(audit.failed);
        setError(false);
      } catch { if (active) setError(true); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [caseId, retry]);

  const back = <Link href="/cases" className="record-text-link inline-flex items-center gap-2"><ArrowLeft size={14} />Back to cases</Link>;
  if (loading) return <div className="review-workspace case-evidence">{back}<Skeleton className="h-80" /></div>;
  if (error || !data) return <div className="review-workspace case-evidence">{back}<ErrorState title="Case unavailable" description="This payment's evidence could not be loaded." onRetry={() => setRetry(value => value + 1)} /></div>;

  const { transaction, ml, graph, agent, policy } = data;
  const decision = policy?.decision || "PENDING";
  const status = agent?.status || "NOT_RECORDED";
  const reason = reasonText(policy?.reason);
  const modelScore = scorePercent(ml?.risk_score, 1);
  const graphScore = scorePercent(graph?.risk_score, 1);
  const rules = policy?.triggered_rules || [];
  return <div className="review-workspace case-evidence">
    {back}
    <header className="case-heading"><div><p>Case evidence</p><h1>{transaction.id || caseId}</h1></div><a href="#case-audit" className="workspace-button">View audit trail <ArrowDown size={14} /></a></header>

    {(decision === "PENDING" || decision === "REVIEW") && (
      <section className="record-card case-action-banner" aria-labelledby="case-resolution-heading">
        <div>
          <h3 id="case-resolution-heading">Manual resolution required</h3>
          <p>Review the evidence below and record the final payment decision.</p>
        </div>
        <div className="case-action-buttons" aria-label="Manual resolution actions">
          <button type="button" className="case-action-button case-action-button-approve" disabled={resolvingDecision !== null} aria-busy={resolvingDecision === "ALLOW"} onClick={() => handleResolve("ALLOW")}>
            {resolvingDecision === "ALLOW" ? "Recording…" : "Approve payment"}
          </button>
          <button type="button" className="case-action-button case-action-button-decline" disabled={resolvingDecision !== null} aria-busy={resolvingDecision === "BLOCK"} onClick={() => handleResolve("BLOCK")}>
            {resolvingDecision === "BLOCK" ? "Recording…" : "Decline payment"}
          </button>
        </div>
      </section>
    )}

    <section className="record-card case-decision" aria-label="Final policy outcome">
      <div className="case-decision-top">
        <div><p className="case-decision-label">Final policy outcome</p><h2>{readableCode(decision)}</h2><p className="case-decision-reason">{reason || "No policy reason recorded"}</p><p className="record-note case-explanation">{policyExplanation(decision, agent?.recommendation, policy?.reason)}</p></div>
        <dl className="record-fields"><div><dt>Payment amount</dt><dd>{money(transaction.amount)}</dd></div><div><dt>Customer</dt><dd className="record-code">{transaction.customer_id || "Not recorded"}</dd></div><div><dt>Received</dt><dd>{recordedAt(transaction.timestamp)}</dd></div></dl>
      </div>
      <div className="case-policy-meta"><span>Policy version <strong className="record-code">{policy?.version || "Not recorded"}</strong></span><span>Matched rules <strong className="record-code">{rules.length ? rules.join(" · ") : "No rule IDs recorded"}</strong></span></div>
    </section>

    <div className="case-evidence-grid">
      <section className="record-card" aria-label="Model evidence"><h2>Model evidence</h2><div className="case-score"><strong>{modelScore}</strong><span>/ 100</span></div><p className="record-note">{riskLevel(ml?.risk_score)}{modelScore !== "—" ? " model risk" : ""}</p><dl className="record-fields mt-4"><div><dt>Model version</dt><dd className="record-code">{ml?.version || "Not recorded"}</dd></div></dl></section>
      <section className="record-card" aria-label="Graph evidence"><h2>Graph evidence</h2><div className="case-score"><strong>{graphScore}</strong><span>/ 100</span></div><p className="record-note">{graphScore === "—" ? "Graph evidence unavailable" : graph?.cluster_detected ? "Cluster flag recorded" : "No cluster flag recorded"}</p><p className="record-note">Graph and model scores are separate signals. Policy evaluates them together.</p><Link href="/graph" className="record-text-link mt-4 inline-flex items-center gap-2">Explore network evidence <ArrowUpRight size={13} /></Link></section>
    </div>

    <section className="record-card case-investigation case-investigation-highlight" aria-label="Assisted investigation">
      <div className="case-investigation-heading"><div className="case-investigation-title"><p>Evidence-backed analysis</p><h2>Assisted investigation</h2></div><span className="case-investigation-status">{readableCode(status)}</span></div>
      {status === "SKIPPED" ? <p className="record-note">No assisted investigation was run for this payment. The outcome was determined by policy.</p> : <><dl className="case-agent-metrics"><div><dt>Advisory recommendation</dt><dd>{agent?.recommendation ? <DecisionBadge decision={agent.recommendation} /> : "Not recorded"}</dd></div><div><dt>Confidence</dt><dd>{agent?.confidence != null ? `${scorePercent(agent.confidence, 1)}%` : "Not recorded"}</dd></div></dl><p className="record-note">{reasonText(agent?.reason_codes) || "No investigation reason recorded."}</p></>}
      {status === "DEGRADED" && <p className="record-inline-error">Investigation ran in degraded mode. Review the policy outcome and audit evidence.</p>}
      <InvestigationEvidence evidence={agent?.evidence} />
    </section>
    <AuditTimeline id="case-audit" events={events} error={auditError} onRetry={() => setRetry(value => value + 1)} />
  </div>;
}
