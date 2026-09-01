"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { RefreshCw, Search, ArrowUpRight } from "lucide-react";
import { fetchRecentTransactions, fetchRiskCase, type Transaction } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState, DecisionBadge } from "../../components/ui";
import SeverityLabel from "../../components/ui/SeverityLabel";
import RecordInspector from "../../components/workspace/RecordInspector";
import { money, recordedAt } from "../../lib/audit-presentation";
import { scorePercent } from "../../lib/transaction-presentation";

export default function AlertsPage() {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [policyRecord, setPolicyRecord] = useState<{ id: string; decision: string | null; failed: boolean } | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const busy = useRef(false);
  async function loadData() {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    try { setPayments(await fetchRecentTransactions()); setError(false); }
    catch { setError(true); }
    finally { setLoading(false); busy.current = false; }
  }
  useEffect(() => { void loadData(); }, []);

  useEffect(() => {
    let active = true;
    setPolicyRecord(null);
    if (selectedId) {
      fetchRiskCase(selectedId).then(data => {
        if (active) setPolicyRecord({ id: selectedId, decision: data.policy?.decision || null, failed: false });
      }).catch(() => {
        if (active) setPolicyRecord({ id: selectedId, decision: null, failed: true });
      });
    }
    return () => { active = false; };
  }, [selectedId, payments]);

  const flagged = payments.filter(payment => ["BLOCK", "REVIEW"].includes(payment.decision));
  const visible = flagged.filter(payment => (filter === "all" || payment.decision === filter) && `${payment.transaction_id} ${payment.customer_id}`.toLowerCase().includes(search.trim().toLowerCase()));
  const selected = visible.find(payment => payment.transaction_id === selectedId);
  const closeDetails = () => { setSelectedId(null); trigger.current?.focus({ preventScroll: true }); };

  return <div className="review-workspace">
    <PageHeader eyebrow="Payment monitoring" title="Risk queue" description="Review the payments that need a closer look." actions={<button className="workspace-button" onClick={loadData} disabled={loading}><RefreshCw size={14} className={loading ? "animate-spin" : ""} />{loading ? "Refreshing…" : "Refresh"}</button>} />
    {error && !payments.length ? <ErrorState title="Risk queue unavailable" description="Recent payments could not be loaded." onRetry={loadData} /> : <>
      <div className="record-metrics queue-metrics-highlight" aria-label="Queue summary"><div><span>Flagged payments</span><strong>{loading && !payments.length ? "—" : flagged.length}</strong></div><div><span>Recorded reviews</span><strong>{loading && !payments.length ? "—" : flagged.filter(p => p.decision === "REVIEW").length}</strong></div><div><span>Recorded blocks</span><strong>{loading && !payments.length ? "—" : flagged.filter(p => p.decision === "BLOCK").length}</strong></div></div>
      <p className="record-scope">From the latest {payments.length} loaded payments. Queue entries reflect payment-list status; inspect the case for the policy decision.</p>
      {error && <p className="record-inline-error" role="alert">Refresh failed. Previously loaded payments are still shown.</p>}
      <div className="record-toolbar"><div className="record-filters" role="group" aria-label="Queue filter">{[["all", "All flagged"], ["REVIEW", "Needs review"], ["BLOCK", "Blocked"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setFilter(value); setSelectedId(null); }}>{label}</button>)}</div><label className="record-search"><Search size={15} aria-hidden="true" /><input aria-label="Search risk queue" placeholder="Search payment or customer…" value={search} onChange={event => { setSearch(event.target.value); setSelectedId(null); }} /></label></div>
      {loading && !payments.length ? <Skeleton className="h-64" /> : <div className={`record-layout ${selected ? "has-inspector" : ""}`}>
        <section className="record-card record-list" aria-label="Flagged payments" aria-busy={loading}>
          <header className="record-list-heading"><h2>Flagged payments <span>{visible.length}</span></h2><span>Newest first</span></header>
          <table className="records-table queue-records-table"><caption className="sr-only">Flagged payments. Select a payment to inspect its risk signals.</caption><colgroup><col style={{ width: "17%" }} /><col style={{ width: "37%" }} /><col style={{ width: "23%" }} /><col style={{ width: "23%" }} /></colgroup><thead><tr><th scope="col">Priority</th><th scope="col">Payment / customer</th><th scope="col">Amount</th><th scope="col">Recorded status</th></tr></thead><tbody>{visible.map(payment => <tr key={payment.transaction_id} data-selected={selected?.transaction_id === payment.transaction_id} onClick={event => { trigger.current = event.currentTarget.querySelector("button"); setSelectedId(payment.transaction_id); }}>
            <td data-label="Priority"><SeverityLabel severity={payment.decision === "BLOCK" ? "CRITICAL" : "HIGH"} /></td>
            <td><button className="record-row-button record-code" aria-label={`Inspect payment ${payment.transaction_id}`} aria-expanded={selected?.transaction_id === payment.transaction_id} aria-controls={selected?.transaction_id === payment.transaction_id ? "record-inspector" : undefined}>{payment.transaction_id}</button><span className="record-cell-secondary">{payment.customer_id || "Customer not recorded"}</span></td>
            <td data-label="Amount" className="record-amount">{money(payment.amount)}</td>
            <td data-label="Recorded status"><DecisionBadge decision={payment.decision} /><time className="record-cell-secondary" dateTime={payment.timestamp}>{recordedAt(payment.timestamp, true)}</time></td>
          </tr>)}</tbody></table>
          {!visible.length && <div className="record-empty"><h3>No matching payments</h3><p>{search ? "Try another payment or customer reference." : "No loaded payments match this queue filter."}</p>{(search || filter !== "all") && <button className="workspace-button" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>}</div>}
        </section>
        {selected && <RecordInspector recordId={selected.transaction_id} title={selected.decision === "BLOCK" ? "Blocked by policy" : "Payment needs review"} subtitle="Payment details" onClose={closeDetails}>
          <div className="event-detail-content"><div className="queue-payment-amount"><span>Payment amount</span><strong>{money(selected.amount)}</strong><DecisionBadge decision={selected.decision} /></div>
            {policyRecord?.id === selected.transaction_id ? policyRecord.decision ? <div className="queue-policy-check"><span>Policy record</span><DecisionBadge decision={policyRecord.decision} />{policyRecord.decision !== selected.decision && <p role="status">The payment-list status differs from the policy record. Verify the decision history before taking action.</p>}</div> : <p className="record-note">{policyRecord.failed ? "The policy record could not be checked. Open the case to retry." : "No policy decision was returned for this payment."}</p> : <p className="record-note" role="status">Checking the policy record…</p>}
            <dl className="record-fields"><div><dt>Payment</dt><dd className="record-code">{selected.transaction_id}</dd></div><div><dt>Customer</dt><dd className="record-code">{selected.customer_id || "Not recorded"}</dd></div><div><dt>Received</dt><dd>{recordedAt(selected.timestamp)}</dd></div></dl>
            <section className="queue-signals" aria-label="Recorded risk signals"><h3>Recorded risk signals</h3><div><span>Model risk</span><strong>{scorePercent(selected.ml_risk, 1)} <small>/ 100</small></strong></div><div><span>Graph risk</span><strong>{scorePercent(selected.graph_risk, 1)} <small>/ 100</small></strong></div><p className="record-note">These scores support {selected.decision === "BLOCK" ? "blocking the payment" : "a manual review"}. Open the payment to inspect matched policy rules and investigation evidence.</p></section>
          </div>
          <div className="inspector-actions"><Link className="workspace-button workspace-button-primary" href={`/transactions/${encodeURIComponent(selected.transaction_id)}`}>Review payment <ArrowUpRight size={14} /></Link><Link className="record-text-link" href={`/cases/${encodeURIComponent(selected.transaction_id)}`}>Open case evidence</Link></div>
        </RecordInspector>}
      </div>}
    </>}
  </div>;
}
