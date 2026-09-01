"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { fetchRecentTransactions, Transaction } from "@/lib/api";
import { PageHeader } from "../../components/ui";
import { DecisionBadge } from "../../components/ui/DecisionBadge";
import { riskLevel, scorePercent } from "../../lib/transaction-presentation";
import PriorityBrief from "../../components/workspace/PriorityBrief";
import "../../styles/workspace-refinements.css";

const PAGE_SIZE = 15;
const filters = [{ id: "all", label: "All payments" }, { id: "REVIEW", label: "In review" }, { id: "BLOCK", label: "Blocked" }, { id: "ALLOW", label: "Allowed" }];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mounted = useRef(true);
  const fetching = useRef(false);

  async function loadData() {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);
    try {
      const data = await fetchRecentTransactions();
      if (mounted.current) { setTransactions(data); setError(false); }
    } catch { if (mounted.current) setError(true); }
    finally { fetching.current = false; if (mounted.current) setLoading(false); }
  }
  useEffect(() => { mounted.current = true; void loadData(); return () => { mounted.current = false; }; }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return transactions.filter(transaction => (activeTab === "all" || transaction.decision === activeTab)
      && (riskFilter === "all" || ["High", "Critical"].includes(riskLevel(transaction.ml_risk)))
      && (!needle || [transaction.transaction_id, transaction.customer_id].some(value => value?.toLowerCase().includes(needle))));
  }, [activeTab, query, riskFilter, transactions]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const inReview = transactions.filter(transaction => transaction.decision === "REVIEW").length;
  const critical = transactions.filter(transaction => riskLevel(transaction.ml_risk) === "Critical").length;
  const blocked = transactions.filter(transaction => transaction.decision === "BLOCK").length;
  const resetFilters = () => { setQuery(""); setActiveTab("all"); setRiskFilter("all"); setPage(1); };

  return <div className="transactions-page min-w-0 space-y-5">
    <PageHeader eyebrow="Payment monitoring" title="Transactions" description="Review recent payments and follow the evidence behind each decision." actions={<><button className="workspace-button" onClick={() => void loadData()} disabled={loading}><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh</button><Link href="/simulator" className="workspace-button">Simulate transaction<ArrowRight className="h-3.5 w-3.5" /></Link></>} />
    {error && <p role="alert" className="border-l-2 border-[#c5685e] bg-white px-4 py-3 text-[12px] text-[#9a514a]">Transactions could not be refreshed. {transactions.length ? "Showing the last loaded data." : "Check the backend connection and try again."}</p>}
    {transactions.length > 0 && <PriorityBrief
      eyebrow="Payment priorities"
      title={`${inReview} ${inReview === 1 ? "payment awaiting" : "payments awaiting"} review.`}
      description={`Latest ${transactions.length} payments`}
      stats={[{ label: "In review", value: inReview }, { label: "Critical model risk", value: critical }, { label: "Blocked", value: blocked }]}
      action={<a href="#payments-list" onClick={() => { setActiveTab(inReview ? "REVIEW" : "all"); setQuery(""); setRiskFilter("all"); setPage(1); }}>{inReview ? "Review these payments" : "View payments"}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>}
    />}
    <section id="payments-list" className="min-w-0 overflow-hidden rounded-xl border border-[#dde3ec] bg-white" aria-label="Transactions list">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5eaf0] px-5 pt-4">
        <div className="flex max-w-full gap-5 overflow-x-auto" aria-label="Filter by decision">{filters.map(tab => <button type="button" aria-pressed={activeTab === tab.id} key={tab.id} onClick={() => { setActiveTab(tab.id); setPage(1); }} className={`flex shrink-0 items-center gap-2 !rounded-none border-b-2 pb-4 text-[12px] font-medium ${activeTab === tab.id ? "border-[#245df5] text-[#263b5b]" : "border-transparent text-[#7b879b] hover:text-[#34445c]"}`}>{tab.label}<span className="text-[11px] font-normal text-[#99a3b2]">{tab.id === "all" ? transactions.length : transactions.filter(item => item.decision === tab.id).length}</span></button>)}</div>
        <span className="pb-4 text-[11px] text-[#8a95a6]">Latest {transactions.length} payments</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5eaf0] px-5 py-4">
        <label className="transaction-search relative w-full max-w-[420px]"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8b97a8]" /><input aria-label="Search transactions" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search payment or customer…" className="h-9 w-full rounded-lg border border-[#dce3ec] bg-white pl-9 pr-3 text-[12px] outline-none" /></label>
        {(query || riskFilter !== "all" || activeTab !== "all") && <button type="button" onClick={resetFilters} className="transaction-reset">Reset filters</button>}
        <select aria-label="Filter transaction risk" value={riskFilter} onChange={event => { setRiskFilter(event.target.value); setPage(1); }} className="h-9 max-w-full border border-[#dce3ec] bg-white px-3 text-[12px] text-[#58667b]"><option value="all">All risk levels</option><option value="elevated">High + critical risk</option></select>
      </div>
      <div className="min-w-0 overflow-x-auto" role="region" tabIndex={0} aria-label="Payments table, scroll horizontally on small screens">
        <table className="transaction-table w-full min-w-[880px] table-fixed text-left">
          <caption className="sr-only">Recent payments with model and graph scores out of 100</caption>
          <colgroup><col style={{ width: "29%" }} /><col style={{ width: "14%" }} /><col style={{ width: "16%" }} /><col style={{ width: "14%" }} /><col style={{ width: "13%" }} /><col style={{ width: "14%" }} /></colgroup>
          <thead><tr>{["Payment / customer", "Amount", "Model risk", "Graph risk", "Decision", "Received"].map(heading => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
          <tbody>
            {loading && !transactions.length ? <tr><td colSpan={6} className="!py-16 !text-center text-[#8b97a8]">Loading payments…</td></tr> : visible.map(transaction => {
              const level = riskLevel(transaction.ml_risk);
              const date = new Date(transaction.timestamp || "");
              const validDate = !Number.isNaN(date.getTime());
              return <tr key={transaction.transaction_id}>
                <td><Link className="block truncate font-mono text-[12px] font-medium text-[#34445d] hover:text-[#245df5] hover:underline" href={`/transactions/${encodeURIComponent(transaction.transaction_id)}`} title={transaction.transaction_id}>{transaction.transaction_id}</Link><p className="mt-1 truncate text-[11px] text-[#8a95a6]">{transaction.customer_id || "Customer not recorded"}</p></td>
                <td className="font-medium tabular-nums text-[#3c4c63]">{transaction.amount == null ? "—" : `₹${transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td><span className="text-[14px] font-medium tabular-nums text-[#3c4c63]">{scorePercent(transaction.ml_risk)}</span><span className="ml-1 text-[10px] text-[#758398]">/ 100</span><p className="risk-level mt-1 text-[11px] font-semibold" data-risk={level.toUpperCase()}>{level}</p></td>
                <td><span className="text-[14px] font-medium tabular-nums text-[#3c4c63]">{scorePercent(transaction.graph_risk)}</span>{transaction.graph_risk != null && <span className="ml-1 text-[10px] text-[#99a3b2]">/ 100</span>}</td>
                <td><DecisionBadge decision={transaction.decision || "PENDING"} /></td>
                <td><time className="text-[11px] text-[#66758b]" dateTime={validDate ? date.toISOString() : undefined}>{validDate ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}</time><p className="mt-1 text-[10px] text-[#98a2b1]">{validDate ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</p></td>
              </tr>;
            })}
            {!loading && !visible.length && <tr><td colSpan={6} className="!py-14 !text-center"><p className="text-[13px] font-medium text-[#58677d]">No matching payments</p><p className="mt-2 text-[12px] text-[#8a95a6]">Try a different ID or clear your filters.</p><button className="workspace-button mt-4" onClick={() => { setQuery(""); setActiveTab("all"); setRiskFilter("all"); setPage(1); }}>Clear filters</button></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5eaf0] px-5 py-3 text-[11px] text-[#8490a2]"><p role="status">{filtered.length ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)}` : "0"} of {filtered.length} payments</p><div className="flex items-center gap-3"><button aria-label="Previous payments page" className="workspace-button !min-h-8 !p-1.5" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></button><span>{currentPage} / {pages}</span><button aria-label="Next payments page" className="workspace-button !min-h-8 !p-1.5" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight className="h-4 w-4" /></button></div></div>
    </section>
  </div>;
}
