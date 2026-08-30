"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Download, Plus, Search, ChevronDown, Filter, MoreVertical,
  AlertTriangle, Clock, ArrowUpRight, ShieldAlert, ExternalLink, X, ArrowRight
} from "lucide-react";
import { fetchInvestigations, fetchRecentTransactions, Investigation, Transaction } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";

type CombinedCase = Investigation & Partial<Transaction>;

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CombinedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [invData, txData] = await Promise.all([
        fetchInvestigations(),
        fetchRecentTransactions()
      ]);
      
      const investigations = invData.investigations || [];
      const transactions = txData || [];
      
      // Join on transaction_id
      const combined = investigations.map(inv => {
        const tx = transactions.find(t => t.transaction_id === inv.transaction_id);
        return {
          ...inv,
          ...tx
        };
      });
      
      setCases(combined);
      setError(false);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && cases.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cases" description="Manage fraud investigations, assignments and resolution workflows." />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cases" description="Manage fraud investigations, assignments and resolution workflows." />
        <ErrorState title="Cases Data Unavailable" description="Failed to fetch cases from the backend." />
      </div>
    );
  }

  const openCasesCount = cases.filter(c => c.agent_state !== 'CLOSED' && c.agent_state !== 'COMPLETED').length;
  const metrics = [
    { label: "Open", value: openCasesCount, highlight: false },
    { label: "Investigating", value: cases.filter(c => c.agent_state === 'PROCESSING').length, highlight: false },
    { label: "Resolved", value: cases.filter(c => c.agent_state === 'CLOSED' || c.agent_state === 'COMPLETED').length, highlight: false, color: "text-success" },
  ];

  const getRiskLevelBadge = (mlScore: number | undefined, graphScore: number | undefined) => {
    const ml = mlScore ?? 0;
    const graph = graphScore ?? 0;
    const maxScore = Math.max(ml, graph);
    
    if (maxScore >= 0.9) return <span className="w-fit rounded-md border border-danger/20 bg-danger-soft px-2.5 py-1 text-caption font-semibold uppercase text-danger">CRITICAL</span>;
    if (maxScore >= 0.7) return <span className="w-fit rounded-md border border-warning/20 bg-warning-soft px-2.5 py-1 text-caption font-semibold uppercase text-warning">HIGH</span>;
    if (maxScore >= 0.3) return <span className="w-fit rounded-md border border-info/20 bg-info-soft px-2.5 py-1 text-caption font-semibold uppercase text-info">MEDIUM</span>;
    return <span className="w-fit rounded-md border border-border bg-surface-secondary px-2.5 py-1 text-caption font-semibold uppercase text-text-secondary">LOW</span>;
  };

  const getStatusBadge = (status: string | undefined) => {
    const s = status || 'OPEN';
    switch (s.toUpperCase()) {
      case "PENDING":
      case "OPEN": 
        return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-surface-secondary text-text-primary border border-border">OPEN</span>;
      case "PROCESSING":
      case "INVESTIGATING": 
        return <span className="w-fit rounded-md border border-primary/20 bg-primary-soft px-2.5 py-1 text-caption font-semibold uppercase text-primary">INVESTIGATING</span>;
      case "REVIEW_REQUIRED":
      case "ESCALATED": 
        return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-warning-soft text-warning border border-warning/20">REVIEW_REQUIRED</span>;
      case "CLOSED":
      case "COMPLETED": 
      case "RESOLVED": 
        return <span className="w-fit rounded-md border border-success/20 bg-success-soft px-2.5 py-1 text-caption font-semibold uppercase text-success">RESOLVED</span>;
      case "FAILED":
      case "DISMISSED": 
        return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-surface-secondary text-text-muted border border-border border-dashed">FAILED</span>;
      default: 
        return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-surface-secondary text-text-primary border border-border">{s}</span>;
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 pb-12">
      <PageHeader eyebrow="Investigation operations" title="Cases" description="Manage fraud investigations, assignments and resolution workflows." actions={<span className="border-l-2 border-primary pl-3 text-[10px] font-semibold text-primary">Live API data</span>} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {metrics.map((m, i) => (
          <div key={i} className="rsx-stat-card">
            <div className="rsx-stat-label">{m.label}</div>
            <div className={`rsx-stat-value tabular-nums ${m.color || ''}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full min-h-[600px] min-w-0">
        <div className="flex-1 overflow-x-auto min-w-0">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-full md:min-w-[1200px] table-fixed">
            <colgroup>
              <col className="w-48" />
              <col className="w-auto hidden md:table-column" />
              <col className="w-32" />
              <col className="w-36" />
              <col className="w-24 hidden md:table-column" />
              <col className="w-28 hidden md:table-column" />
              <col className="w-36" />
              <col className="w-40 hidden md:table-column" />
              <col className="w-32 hidden lg:table-column" />
            </colgroup>
            <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4 hidden md:table-cell">Transaction</th>
                <th className="p-4">Risk level</th>
                <th className="p-4">Status</th>
                <th className="p-4 hidden md:table-cell">ML score</th>
                <th className="p-4 hidden md:table-cell">Graph score</th>
                <th className="p-4">Final decision</th>
                <th className="p-4 hidden md:table-cell">Updated</th>
                <th className="p-4 text-right hidden lg:table-cell">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {cases.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-text-secondary">No cases found.</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.transaction_id} onClick={() => router.push(`/cases/${c.transaction_id}`)} className="transition-colors cursor-pointer hover:bg-surface-secondary/50 group">
                    <td className="p-4">
                      <span className="text-label-sm text-mono-sm font-mono font-semibold text-primary group-hover:underline">{c.transaction_id}</span>
                    </td>
                    <td className="p-4 text-label-sm text-text-primary font-medium hidden md:table-cell truncate max-w-[200px]">
                      {c.amount ? `₹${c.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'} {c.customer_id ? `(${c.customer_id})` : ''}
                    </td>
                    <td className="p-4">
                      {getRiskLevelBadge(c.ml_risk, c.graph_risk)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(c.agent_state)}
                    </td>
                    <td className="p-4 text-label-sm text-text-secondary tabular-nums hidden md:table-cell">
                      {c.ml_risk ? c.ml_risk.toFixed(2) : '--'}
                    </td>
                    <td className="p-4 text-label-sm text-text-secondary tabular-nums hidden md:table-cell">
                      {c.graph_risk ? c.graph_risk.toFixed(2) : '--'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-semibold ${c.decision === 'BLOCK' ? 'text-danger bg-danger-soft border border-danger/20' : c.decision === 'REVIEW' ? 'text-warning bg-warning-soft border border-warning/20' : c.decision === 'ALLOW' ? 'text-success bg-success-soft border border-success/20' : 'text-text-muted bg-surface-secondary border border-border'}`}>
                        {c.decision || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-caption text-text-secondary text-mono-sm font-mono hidden md:table-cell">
                      {c.updated_at ? new Date(c.updated_at).toLocaleString() : c.created_at ? new Date(c.created_at).toLocaleString() : '--'}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right hidden lg:table-cell">
                      <Link href={`/cases/${c.transaction_id}`} className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg text-caption font-semibold transition-all shadow-sm group-hover:premium-shadow-hover" onClick={(e) => e.stopPropagation()}>
                        Open Case <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
