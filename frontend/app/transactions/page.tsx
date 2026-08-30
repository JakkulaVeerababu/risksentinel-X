"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  PlayCircle,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X,
  Check
} from "lucide-react";
import { fetchRecentTransactions, Transaction } from "@/lib/api";
import { timeAgo } from "@/lib/utils";

type RiskLevel = "Critical" | "High" | "Medium" | "Low";

function getRiskLevel(score: number): RiskLevel {
  if (score >= 0.8) return "Critical";
  if (score >= 0.6) return "High";
  if (score >= 0.3) return "Medium";
  return "Low";
}

function riskStyle(level: RiskLevel) {
  if (level === "Critical") return "border-[#ffd2d4] bg-[#fff0f1] text-[#d72b36]";
  if (level === "High") return "border-[#ffe0aa] bg-[#fff7e7] text-[#b56a08]";
  if (level === "Medium") return "border-[#d7e3ff] bg-[#edf3ff] text-[#2a5dcc]";
  return "border-[#dfe5ec] bg-[#f5f7fa] text-[#667287]";
}

function decisionStyle(decision: string) {
  if (decision === "BLOCK") return "border-[#ffd0d4] bg-[#fff0f1] text-[#d52d39]";
  if (decision === "REVIEW") return "border-[#d6e3ff] bg-[#eef4ff] text-[#255df5]";
  return "border-[#cdd9f8] bg-[#edf3ff] text-[#315efb]";
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"Elevated" | "All">("All");
  const [notice, setNotice] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecentTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2400);
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      const decisionMap: any = { "BLOCK": "Blocked", "REVIEW": "Review", "ALLOW": "Allowed" };
      const txDec = decisionMap[tx.decision] || "Allowed";
      const matchesTab = activeTab === "all" || txDec === activeTab;
      const level = getRiskLevel(tx.ml_risk || 0);
      const matchesRisk = riskFilter === "All" || ["Critical", "High"].includes(level);
      const matchesQuery = !needle || [tx.transaction_id, tx.customer_id].some((value) => value.toLowerCase().includes(needle));
      return matchesTab && matchesRisk && matchesQuery;
    });
  }, [activeTab, query, riskFilter, transactions]);

  const tabs = [
    { id: "all", label: "All", count: transactions.length },
    { id: "Review", label: "In review", count: transactions.filter(t => t.decision === "REVIEW").length },
    { id: "Blocked", label: "Blocked", count: transactions.filter(t => t.decision === "BLOCK").length },
    { id: "Allowed", label: "Allowed", count: transactions.filter(t => t.decision === "ALLOW").length },
  ];

  return (
    <div className="pb-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#255df5]">Illustrative demo scenario</div>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-[34px] font-semibold leading-tight tracking-[-.04em] text-[#0c1d3a] sm:text-[40px]">Transactions</h1></div>
          <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-[#67748b]">Monitor every payment decision, isolate elevated risk and open the full evidence trail without losing context (seeded demo data).</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ed] bg-white px-4 text-[12px] font-bold text-[#4b5870] shadow-sm transition hover:border-[#c8d3e2] opacity-75 cursor-not-allowed" disabled><ArrowDownToLine className="h-4 w-4" />Preview Export</button>
          <button onClick={loadData} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ed] bg-white px-4 text-[12px] font-bold text-[#4b5870] shadow-sm transition hover:border-[#c8d3e2] hover:bg-[#f9fbff]"><RefreshCcw className="h-4 w-4" />Refresh</button>
          <Link href="/simulator" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#255df5] px-4 text-[12px] font-bold text-white shadow-[0_9px_22px_rgba(37,93,245,.24)] transition hover:-translate-y-0.5 hover:bg-[#174bd4]"><PlayCircle className="h-4 w-4" />Simulate transaction</Link>
        </div>
      </section>

      {error && (
        <div className="mt-6 border border-danger/20 border-l-2 border-l-danger bg-danger-soft p-4 text-danger">
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#dce3ed] bg-white shadow-[0_14px_40px_rgba(28,49,87,.055)]">
        <div className="border-b border-[#e7ebf1] px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="hide-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#f3f6fa] p-1">
              {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] font-bold transition ${activeTab === tab.id ? "bg-white text-[#255df5] shadow-[0_2px_8px_rgba(31,52,94,.08)]" : "text-[#6f7b8f] hover:text-[#25334c]"}`}>{tab.label}<span className={`rounded-md px-1.5 py-0.5 text-[10px] ${activeTab === tab.id ? "bg-[#edf3ff] text-[#255df5]" : "bg-[#e8ecf2] text-[#8791a3]"}`}>{tab.count}</span></button>)}
            </div>
            <div className="relative w-full xl:w-[360px]"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909aab]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border border-[#dde4ed] bg-[#f9fbfd] pl-10 pr-4 text-[12px] font-medium text-[#25334c] outline-none transition placeholder:text-[#9ba5b5] focus:border-[#7fa0ff] focus:bg-white focus:ring-4 focus:ring-[#255df5]/10" placeholder="Search payment or customer" /></div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0f4] py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="hide-scrollbar flex max-w-full items-center gap-2 overflow-x-auto">
              <button className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] font-bold text-[#566278]"><CalendarDays className="h-3.5 w-3.5 text-[#7d899b]" />All time<ChevronDown className="h-3.5 w-3.5" /></button>
              <button onClick={() => setRiskFilter((value) => value === "Elevated" ? "All" : "Elevated")} className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-[11px] font-bold ${riskFilter === "Elevated" ? "border-[#cddcff] bg-[#edf3ff] text-[#255df5]" : "border-[#dfe5ee] bg-white text-[#566278]"}`}><SlidersHorizontal className="h-3.5 w-3.5" />{riskFilter === "Elevated" ? "High + Critical risk" : "All risk levels"}</button>
            </div>
            <button className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed border-[#cbd5e4] px-3 text-[11px] font-bold text-[#255df5] hover:bg-[#f4f7ff] opacity-75 cursor-not-allowed" disabled><Filter className="h-3.5 w-3.5" />More filters</button>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full py-20 text-[#6f7b8f]">Loading transactions...</div>
          ) : (
          <table className="w-full min-w-[1060px] table-fixed border-collapse text-left">
            <colgroup><col className="w-[19%]" /><col className="w-[19%]" /><col className="w-[13%]" /><col className="w-[15%]" /><col className="w-[13%]" /><col className="w-[14%]" /><col className="w-[7%]" /></colgroup>
            <thead><tr className="border-b border-[#e7ebf1] bg-[#f8fafc] text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8b96a8]"><th className="px-5 py-3.5">Transaction</th><th className="px-4 py-3.5">Customer</th><th className="px-4 py-3.5">Amount</th><th className="px-4 py-3.5">ML Risk</th><th className="px-4 py-3.5">Graph Risk</th><th className="px-4 py-3.5">Decision</th><th className="px-4 py-3.5 text-right">Time</th></tr></thead>
            <tbody className="divide-y divide-[#e8ecf2]">
              {filtered.map((tx) => {
                const level = getRiskLevel(tx.ml_risk || 0);
                const scorePct = Math.round((tx.ml_risk || 0) * 100);
                return (
                <tr key={tx.transaction_id} className="group transition hover:bg-[#fafcff]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`h-8 w-1 rounded-full ${level === "Critical" ? "bg-[#e5484d]" : level === "High" ? "bg-[#f2a11a]" : level === "Medium" ? "bg-[#4d7ff2]" : "bg-[#d7dee8]"}`} /><div className="min-w-0"><Link href={`/transactions/${tx.transaction_id}`} className="truncate font-mono text-[11px] font-bold text-[#255df5] hover:underline">{tx.transaction_id}</Link></div></div></td>
                  <td className="px-4 py-4"><div className="flex min-w-0 items-center gap-3"><div className="min-w-0"><p className="truncate text-[12px] font-bold text-[#26334b]">{tx.customer_id}</p></div></div></td>
                  <td className="px-4 py-4"><p className="text-[12px] font-bold text-[#182641] tabular-nums">₹{tx.amount?.toLocaleString()}</p></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2.5"><span className={`text-[16px] font-bold tabular-nums ${scorePct >= 80 ? "text-[#d72d38]" : scorePct >= 60 ? "text-[#bd7209]" : "text-[#315efb]"}`}>{scorePct}</span><div className="min-w-0"><span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase ${riskStyle(level)}`}>{level}</span><div className="mt-1.5 h-1 w-16 overflow-hidden rounded-full bg-[#e7ebf1]"><div className={`h-full rounded-full ${scorePct >= 80 ? "bg-[#e5484d]" : scorePct >= 60 ? "bg-[#f0a11c]" : "bg-[#4d7ff2]"}`} style={{ width: `${scorePct}%` }} /></div></div></div></td>
                  <td className="px-4 py-4">
                    {tx.graph_risk === null ? (
                      <span className="text-[12px] font-bold text-[#8e98a9] italic">N/A</span>
                    ) : (
                      <span className={`text-[16px] font-bold tabular-nums ${tx.graph_risk >= 0.8 ? "text-[#d72d38]" : tx.graph_risk >= 0.3 ? "text-[#bd7209]" : "text-[#315efb]"}`}>{Math.round(tx.graph_risk * 100)}</span>
                    )}
                  </td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center rounded-md border px-2.5 py-1.5 text-[10px] font-extrabold uppercase ${decisionStyle(tx.decision || "PENDING")}`}>{tx.decision || "PENDING"}</span></td>
                  <td className="px-4 py-4 text-right"><p className="font-mono text-[10px] font-semibold text-[#778399]">{tx.timestamp ? timeAgo(tx.timestamp) : ""}</p><Link href={`/transactions/${tx.transaction_id}`} aria-label={`Open ${tx.transaction_id}`} className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-[#8e98a9] opacity-0 transition hover:bg-[#eaf0fa] group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Link></td>
                </tr>
              )})}
            </tbody>
          </table>
          )}
        </div>

        {!loading && filtered.length === 0 && <div className="px-5 py-16 text-center"><Search className="mx-auto h-6 w-6 text-[#a0a9b8]" /><p className="mt-3 text-[13px] font-bold text-[#4b5870]">No transactions match these filters.</p><button onClick={() => { setQuery(""); setActiveTab("all"); setRiskFilter("All"); }} className="mt-3 text-[12px] font-bold text-[#255df5]">Clear filters</button></div>}

        <div className="flex flex-col gap-3 border-t border-[#e6eaf0] bg-[#fbfcfe] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p className="text-[11px] font-semibold text-[#778399]">Showing {filtered.length} transactions</p><div className="flex items-center gap-2"><button disabled className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe5ed] bg-white text-[#a1a9b6] disabled:opacity-60"><ChevronLeft className="h-4 w-4" /></button><span className="px-2 text-[11px] font-bold text-[#46536a]">Page 1</span><button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe5ed] bg-white text-[#536178] transition hover:bg-[#f3f6fa] disabled:opacity-60" disabled><ChevronRight className="h-4 w-4" /></button></div></div>
      </section>

      {notice && <div className="fixed bottom-6 right-6 z-[140] flex items-center gap-3 rounded-xl border border-[#dce3ed] bg-white px-5 py-3.5 text-[12px] font-bold text-[#2e3b53] shadow-[0_18px_50px_rgba(22,40,74,.18)]"><Check className="h-4 w-4 text-[#315efb]" />{notice}</div>}
    </div>
  );
}
