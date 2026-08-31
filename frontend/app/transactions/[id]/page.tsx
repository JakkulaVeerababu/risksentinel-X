"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ChevronDown } from "lucide-react";
import { fetchRiskCase, fetchAuditTimeline, PipelineResponse, AuditEvent } from "@/lib/api";
import { ErrorState, Skeleton } from "../../../components/ui";
import { DecisionBadge } from "../../../components/ui/DecisionBadge";
import { auditSummary, readableCode, riskLevel, scorePercent } from "../../../lib/transaction-presentation";

function recordedAt(value?: string) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TransactionDetailPage() {
  const params = useParams();
  const transactionId = params.id as string;
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [timeline, setTimeline] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [auditError, setAuditError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setAuditError(false);
    async function loadData() {
      try {
        const [caseResult, auditResult] = await Promise.all([
          fetchRiskCase(transactionId),
          fetchAuditTimeline(transactionId).then(result => ({ events: result.events, failed: false })).catch(() => ({ events: [], failed: true })),
        ]);
        if (!active) return;
        if (!caseResult?.transaction || (caseResult as PipelineResponse & { error?: string }).error) throw new Error("Transaction unavailable");
        setData(caseResult);
        setTimeline([...(auditResult.events || [])].sort((a, b) => (Date.parse(a.timestamp) || 0) - (Date.parse(b.timestamp) || 0)));
        setAuditError(auditResult.failed);
      } catch { if (active) setError(true); }
      finally { if (active) setLoading(false); }
    }
    void loadData();
    return () => { active = false; };
  }, [transactionId, retry]);

  const backLink = <Link href="/transactions" className="inline-flex items-center gap-2 text-[12px] font-medium text-[#728096] hover:text-[#263b5b]"><ArrowLeft className="h-3.5 w-3.5" />Back to transactions</Link>;
  if (loading) return <div className="space-y-6">{backLink}<Skeleton className="h-[400px]" /></div>;
  if (error || !data) return <div className="space-y-6">{backLink}<ErrorState title="Transaction details unavailable" description="This payment could not be loaded. Check the connection or return to the transaction list." onRetry={() => setRetry(value => value + 1)} /></div>;

  const { transaction, ml, graph, agent, policy } = data;
  const modelScore = scorePercent(ml?.risk_score, 1);
  const graphScore = scorePercent(graph?.risk_score, 1);
  const decision = policy?.decision || "PENDING";
  const agentState = agent?.status || "NOT_RECORDED";
  const amount = typeof transaction.amount === "number" ? `₹${transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Not recorded";

  return <div className="transaction-detail min-w-0 space-y-6">
    {backLink}
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0"><p className="text-[11px] text-[#8a95a6]">Payment details</p><h1 className="mt-2 break-all font-mono text-[23px] font-semibold tracking-[-.035em] text-[#23344f]">{transaction.id || transactionId}</h1></div>
      <a href="#transaction-audit" className="workspace-button">View audit trail<ArrowDown className="h-3.5 w-3.5" /></a>
    </header>

    <section className="overflow-hidden rounded-xl border border-[#dde3ec] bg-white" aria-label="Payment decision record">
      <div className="decision-record-summary">
        <div><p className="text-[11px] font-medium text-[#8190a3]">Final policy outcome</p><div className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-[#243650]">{readableCode(decision)}</div><p className="mt-3 max-w-xl text-[13px] leading-6 text-[#758399]">{policy?.reason ? readableCode(policy.reason) : "No policy reason was recorded for this payment."}</p></div>
        <dl className="grid grid-cols-2 gap-x-7 gap-y-5 text-[12px]"><div><dt className="text-[#8a95a6]">Payment amount</dt><dd className="mt-1.5 text-[18px] font-medium tabular-nums text-[#34455e]">{amount}</dd></div><div><dt className="text-[#8a95a6]">Customer</dt><dd className="mt-2 break-all font-mono text-[#52627a]">{transaction.customer_id || "Not recorded"}</dd></div><div><dt className="text-[#8a95a6]">Received</dt><dd className="mt-1.5 text-[#607087]">{recordedAt(transaction.timestamp)}</dd></div><div><dt className="text-[#8a95a6]">Policy version</dt><dd className="mt-1.5 break-all font-mono text-[#607087]">{policy?.version || "Not recorded"}</dd></div></dl>
      </div>

      <div className="evidence-columns border-t border-[#e6ebf1]">
        <section className="evidence-section" aria-label="Model evidence"><div className="flex items-start justify-between gap-4"><div><h2 className="text-[13px] font-semibold text-[#40516b]">Model evidence</h2><p className="mt-1.5 text-[11px] text-[#8a95a6]">{riskLevel(ml?.risk_score)}{modelScore !== "—" ? " risk signal" : ""}</p></div><p className="whitespace-nowrap text-[26px] font-medium leading-none tracking-tight text-[#3a4c67]">{modelScore}<span className="ml-1.5 text-[11px] font-normal text-[#9ba5b3]">/ 100</span></p></div><dl className="mt-6 flex flex-wrap justify-between gap-2 text-[11px]"><dt className="text-[#8a95a6]">Model version</dt><dd className="break-all font-mono text-[#67768b]">{ml?.version || "Not recorded"}</dd></dl></section>
        <section className="evidence-section" aria-label="Graph evidence"><div className="flex items-start justify-between gap-4"><div><h2 className="text-[13px] font-semibold text-[#40516b]">Graph evidence</h2><p className="mt-1.5 text-[11px] text-[#8a95a6]">{graphScore === "—" ? "Graph evidence unavailable" : graph?.cluster_detected ? "Cluster flag recorded" : "No cluster flag recorded"}</p></div><p className="whitespace-nowrap text-[26px] font-medium leading-none tracking-tight text-[#3a4c67]">{graphScore}<span className="ml-1.5 text-[11px] font-normal text-[#9ba5b3]">/ 100</span></p></div><p className="mt-6 text-[11px] leading-5 text-[#8a95a6]">Model and graph scores support the decision; policy determines the final outcome.</p></section>
      </div>

      <section className="border-t border-[#e6ebf1] px-6 py-5 sm:px-7" aria-label="Assisted investigation">
        <div className="flex items-center justify-between gap-4"><h2 className="text-[13px] font-semibold text-[#40516b]">Assisted investigation</h2><span className="text-[12px] text-[#8490a2]">{readableCode(agentState)}</span></div>
        {agentState === "SKIPPED" ? <p className="mt-3 text-[12px] leading-6 text-[#7b899e]">No assisted investigation was run for this payment. The outcome was determined by policy.</p> : agentState === "DEGRADED" ? <p className="mt-3 text-[12px] leading-6 text-[#8a7658]">Investigation ran in degraded mode. Review the recorded policy outcome and supporting audit events.</p> : <div className="mt-4"><div className="flex flex-wrap items-center gap-4 text-[12px]"><span className="text-[#8a95a6]">Recommendation</span><DecisionBadge decision={agent?.recommendation || "UNKNOWN"} />{agent?.confidence != null && <span className="text-[#7c899c]">{scorePercent(agent.confidence)}% confidence</span>}</div>{!!agent?.reason_codes?.length && <p className="mt-3 text-[12px] leading-6 text-[#7b899e]">{agent.reason_codes.map(reason => readableCode(reason)).join(" · ")}</p>}</div>}
        {!!agent?.evidence?.length && <details className="mt-4"><summary className="cursor-pointer text-[12px] text-[#63748d]">View investigation evidence</summary><pre className="mt-3 max-h-[220px] overflow-auto bg-[#f7f9fb] p-4 text-[11px] leading-6 text-[#718198]">{JSON.stringify(agent.evidence, null, 2)}</pre></details>}
        {!!policy?.triggered_rules?.length && <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-[#edf0f5] pt-4 text-[11px]"><span className="text-[#8a95a6]">Matched policy rules</span><span className="break-all font-mono text-[#65758d]">{policy.triggered_rules.join(" · ")}</span></div>}
      </section>
    </section>

    <section id="transaction-audit" className="scroll-mt-24 overflow-hidden rounded-xl border border-[#dde3ec] bg-white" aria-label="Audit timeline">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebf1] px-6 py-5 sm:px-7"><div><h2 className="text-[15px] font-semibold text-[#34455f]">Audit timeline</h2><p className="mt-1.5 text-[11px] text-[#8a95a6]">The recorded path from evidence to outcome. Expand an event to inspect its payload.</p></div><span className="text-[11px] text-[#8a95a6]">{timeline.length} {timeline.length === 1 ? "event" : "events"} · oldest first</span></div>
      {auditError ? <div className="px-7 py-8 text-[12px] text-[#897759]"><p>Audit events could not be loaded. The payment details above are still available.</p><button className="workspace-button mt-3" onClick={() => setRetry(value => value + 1)}>Retry audit trail</button></div> : timeline.length ? <ol className="divide-y divide-[#e9edf3]">{timeline.map((event, index) => <li key={event.event_id || index}>
        <details className="audit-event">
          <summary className="audit-event-summary"><span className="pt-0.5 font-mono text-[11px] text-[#a1aaba]">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0"><span className="block text-[13px] font-medium text-[#40516b]">{readableCode(event.event_type)}</span><span className="mt-1.5 block text-[12px] leading-5 text-[#7a889d]">{auditSummary(event.output_summary)}</span><span className="mt-2 block text-[10px] text-[#9aa4b3]">{event.service || "Service not recorded"} · {readableCode(event.status)}</span></span><span className="audit-event-time text-[11px] text-[#98a2b2]">{recordedAt(event.timestamp)}</span><ChevronDown aria-hidden="true" className="audit-chevron mt-0.5 h-4 w-4 text-[#8c98aa]" /></summary>
          <div className="border-t border-[#edf0f4] bg-[#f8fafc] px-6 py-4 sm:px-7"><p className="mb-3 text-[10px] font-medium text-[#8a95a6]">Raw event · {event.event_id}</p><pre tabIndex={0} aria-label={`Payload for ${readableCode(event.event_type)}`} className="max-h-[280px] overflow-auto text-[11px] leading-6 text-[#67788f]">{JSON.stringify(event, null, 2)}</pre></div>
        </details>
      </li>)}</ol> : <p className="px-7 py-10 text-[12px] text-[#8a95a6]">No audit events were recorded for this payment.</p>}
    </section>
  </div>;
}
