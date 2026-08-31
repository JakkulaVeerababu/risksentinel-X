"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw, Search, X } from "lucide-react";
import { fetchInvestigations, fetchRecentTransactions, Investigation, Transaction } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";

type CombinedCase = Investigation & Partial<Transaction>;
type CaseFilter = "all" | "open" | "investigating" | "resolved" | "review";
const PAGE_SIZE = 15;
const isResolved = (item: CombinedCase) => ["CLOSED", "COMPLETED", "RESOLVED"].includes(item.agent_state?.toUpperCase());
const isInvestigating = (item: CombinedCase) => ["PROCESSING", "INVESTIGATING"].includes(item.agent_state?.toUpperCase());
const isReview = (item: CombinedCase) => ["REVIEW_REQUIRED", "ESCALATED"].includes(item.agent_state?.toUpperCase()) || item.decision === "REVIEW";
const scoreLabel = (value?: number) => value == null || !Number.isFinite(value) ? "—" : value.toFixed(2);

function riskLabel(item: CombinedCase) {
  if (item.ml_risk == null && item.graph_risk == null) return { label: "Not scored", tone: "neutral" };
  const risk = Math.max(item.ml_risk ?? 0, item.graph_risk ?? 0);
  if (risk >= .9) return { label: "Critical", tone: "danger" };
  if (risk >= .7) return { label: "High", tone: "warning" };
  return { label: risk >= .3 ? "Medium" : "Low", tone: "neutral" };
}

function statusLabel(item: CombinedCase) {
  if (isResolved(item)) return { label: "Resolved", tone: "success" };
  if (isInvestigating(item)) return { label: "Investigating", tone: "neutral" };
  if (["REVIEW_REQUIRED", "ESCALATED"].includes(item.agent_state)) return { label: "Needs review", tone: "warning" };
  const state = item.agent_state || "Open";
  return { label: state.charAt(0).toUpperCase() + state.slice(1).toLowerCase().replaceAll("_", " "), tone: "neutral" };
}

export default function CasesPage() {
  const [cases, setCases] = useState<CombinedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CaseFilter>("all");
  const [page, setPage] = useState(1);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const mounted = useRef(true);
  const fetching = useRef(false);

  const loadData = useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);
    try {
      const [invData, txData] = await Promise.all([fetchInvestigations(), fetchRecentTransactions()]);
      const transactions = new Map(txData.map(transaction => [transaction.transaction_id, transaction]));
      if (!mounted.current) return;
      setCases(invData.investigations.map(investigation => ({ ...transactions.get(investigation.transaction_id), ...investigation })));
      setError(false);
      setUpdatedAt(new Date());
    } catch {
      if (mounted.current) setError(true);
    } finally {
      fetching.current = false;
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void loadData();
    const interval = setInterval(() => { if (!document.hidden) void loadData(); }, 10000);
    return () => { mounted.current = false; clearInterval(interval); };
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return cases.filter(item => {
      const matches = !term || `${item.transaction_id} ${item.customer_id ?? ""}`.toLowerCase().includes(term);
      return matches && (filter === "all" || (filter === "open" && !isResolved(item)) || (filter === "investigating" && isInvestigating(item)) || (filter === "resolved" && isResolved(item)) || (filter === "review" && isReview(item)));
    });
  }, [cases, query, filter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageCases = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectFilter = (value: CaseFilter) => { setFilter(value); setPage(1); };

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader eyebrow="Investigation operations" title="Cases" description="Review the evidence, follow the decision, and resolve what needs attention." actions={
        <button type="button" className="workspace-button" onClick={() => void loadData()} disabled={loading}><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh cases</button>
      } />
      {loading && !updatedAt ? <Skeleton className="h-72" /> : error && !updatedAt ? (
        <ErrorState title="Cases could not be loaded" description="Check the backend connection and try again." onRetry={() => void loadData()} />
      ) : <>
        <section className="grid gap-3 sm:grid-cols-3" aria-label="Case summary">
          <button type="button" aria-pressed={filter === "open"} onClick={() => selectFilter(filter === "open" ? "all" : "open")} className="workspace-stat workspace-stat-priority text-left transition-colors hover:!bg-[#1747c9]">
            <div className="flex items-center justify-between"><p className="text-[12px] font-medium">Open cases</p><ArrowRight className="h-4 w-4 text-white/80" /></div>
            <div className="mt-3 flex items-baseline gap-3"><strong className="text-[30px] font-semibold leading-none tracking-tight tabular-nums">{cases.filter(item => !isResolved(item)).length}</strong><p className="text-[11px]">Awaiting resolution</p></div>
          </button>
          <button type="button" aria-pressed={filter === "investigating"} onClick={() => selectFilter(filter === "investigating" ? "all" : "investigating")} className="workspace-stat text-left hover:border-[#aebaca]">
            <p className="text-[12px] font-medium text-[#66748a]">Investigating</p><div className="mt-3 flex items-baseline gap-3"><strong className="text-[30px] font-semibold leading-none tracking-tight tabular-nums">{cases.filter(isInvestigating).length}</strong><span className="text-[11px] text-[#7c889a]">In progress</span></div>
          </button>
          <button type="button" aria-pressed={filter === "resolved"} onClick={() => selectFilter(filter === "resolved" ? "all" : "resolved")} className="workspace-stat text-left hover:border-[#aebaca]">
            <p className="text-[12px] font-medium text-[#66748a]">Resolved</p><div className="mt-3 flex items-baseline gap-3"><strong className="text-[30px] font-semibold leading-none tracking-tight tabular-nums">{cases.filter(isResolved).length}</strong><span className="text-[11px] text-[#7c889a]">Completed or closed</span></div>
          </button>
        </section>
        {error && <p role="status" className="rounded-lg border border-[#eed9b5] bg-[#fffbf4] px-4 py-3 text-[12px] text-[#916627]">Refresh failed. Showing the last loaded cases; your filters have been kept.</p>}
        <section className="min-w-0 overflow-hidden rounded-xl border border-[#dde3ec] bg-white" aria-label="Case list">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7ecf2] px-5 py-4">
            <label className="relative block w-full max-w-[310px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b96a8]" />
              <input aria-label="Search cases" placeholder="Search case or customer ID…" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} className="h-9 w-full border border-[#dce3ec] bg-white pl-9 pr-9 text-[12px] outline-none placeholder:text-[#8b96a8]" />
              {query && <button type="button" onClick={() => { setQuery(""); setPage(1); }} aria-label="Clear case search" className="absolute right-2 top-2 p-0.5 text-[#7b8799]"><X className="h-4 w-4" /></button>}
            </label>
            <select aria-label="Filter cases" value={filter} onChange={event => selectFilter(event.target.value as CaseFilter)} className="h-9 max-w-full border border-[#dce3ec] bg-white px-3 text-[12px] text-[#46546b]">
              <option value="all">All cases</option><option value="open">Open cases</option><option value="investigating">Investigating</option><option value="review">Needs review</option><option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="min-w-0 overflow-x-auto" tabIndex={0} role="region" aria-label="Cases table, scroll horizontally on smaller screens">
            <table className="cases-table">
              <caption className="sr-only">Cases with payment details, investigation status, risk scores and final decisions</caption>
              <colgroup><col style={{ width: "28%" }} /><col style={{ width: "16%" }} /><col style={{ width: "17%" }} /><col style={{ width: "12%" }} /><col style={{ width: "16%" }} /><col style={{ width: "11%" }} /></colgroup>
              <thead><tr>{["Case / payment", "Status", "Risk signals", "Decision", "Updated", ""].map((heading, index) => <th scope="col" key={index}>{heading || <span className="sr-only">Open case</span>}</th>)}</tr></thead>
              <tbody>
                {pageCases.map(item => {
                  const risk = riskLabel(item);
                  const status = statusLabel(item);
                  const decision = item.decision || "PENDING";
                  const date = new Date(item.updated_at || item.created_at || "");
                  const validDate = !Number.isNaN(date.getTime());
                  const href = `/cases/${encodeURIComponent(item.transaction_id)}`;
                  return <tr key={item.transaction_id}>
                    <td><Link href={href} className="case-id font-mono text-[12px] font-medium text-[#26344c]" title={item.transaction_id}>{item.transaction_id}</Link><p className="mt-1 truncate text-[11px] text-[#7b879a]" title={item.customer_id}>{item.amount != null ? `₹${item.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "Amount unavailable"}{item.customer_id ? ` · ${item.customer_id}` : ""}</p></td>
                    <td><span className="workspace-pill" data-tone={status.tone}>{status.label}</span></td>
                    <td><span className="workspace-pill" data-tone={risk.tone}>{risk.label}</span><p className="mt-1.5 whitespace-nowrap text-[10px] text-[#7b879a] tabular-nums">ML {scoreLabel(item.ml_risk)} · Graph {scoreLabel(item.graph_risk)}</p></td>
                    <td><span className="workspace-pill" data-tone={decision === "BLOCK" ? "danger" : decision === "REVIEW" ? "warning" : decision === "ALLOW" ? "success" : "neutral"}>{decision.charAt(0) + decision.slice(1).toLowerCase()}</span></td>
                    <td className="text-[#526177]"><time dateTime={validDate ? date.toISOString() : undefined}>{validDate ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</time><p className="mt-1 text-[11px] text-[#8a95a5]">{validDate ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</p></td>
                    <td><Link href={href} aria-label={`Open case ${item.transaction_id}`} className="inline-flex items-center gap-1.5 py-2 text-[12px] font-medium text-[#526177] hover:text-[#245df5]">Open<ArrowRight className="h-3.5 w-3.5" /></Link></td>
                  </tr>;
                })}
                {!pageCases.length && <tr><td colSpan={6}><div className="py-12 text-center"><h2 className="text-[14px] font-semibold">{cases.length ? "No matching cases" : "No cases yet"}</h2><p className="mt-2 text-[12px] text-[#7b879a]">{cases.length ? "Try another case ID or change your filters." : "Investigations will appear here when payments are processed."}</p>{cases.length > 0 && <button className="workspace-button mt-4" onClick={() => { setQuery(""); selectFilter("all"); }}>Clear filters</button>}</div></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ecf2] px-5 py-3 text-[11px] text-[#758196]">
            <p role="status">{filtered.length ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)}` : "0"} of {filtered.length} cases{updatedAt && <span className="ml-3 hidden xl:inline">Updated {updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}</p>
            <div className="flex items-center gap-3"><button className="workspace-button !min-h-8 !p-1.5" aria-label="Previous cases page" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></button><span>Page {currentPage} of {pageCount}</span><button className="workspace-button !min-h-8 !p-1.5" aria-label="Next cases page" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight className="h-4 w-4" /></button></div>
          </div>
        </section>
      </>}
    </div>
  );
}
