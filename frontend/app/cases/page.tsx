"use client";

import React, { useState, useEffect } from 'react';
import { 
  Download, Plus, Search, ChevronDown, Filter, MoreVertical,
  Activity, AlertTriangle, Ban, Clock, ArrowUpRight, ShieldAlert, ExternalLink, X
} from "lucide-react";
import { fetchInvestigations, Investigation } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";

export default function CasesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [cases, setCases] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchInvestigations();
      setCases(data.investigations || []);
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

  const selectedCase = cases.find(c => c.transaction_id === selectedCaseId);
  const openCasesCount = cases.filter(c => c.agent_state !== 'CLOSED').length;
  const metrics = [
    { label: "Open", value: openCasesCount, highlight: false },
    { label: "Investigating", value: cases.filter(c => c.agent_state === 'PROCESSING').length, highlight: false },
    { label: "Resolved", value: cases.filter(c => c.agent_state === 'CLOSED').length, highlight: false, color: "text-success" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[36px] font-semibold leading-tight tracking-[-.04em] text-text-primary">Cases</h1>
            <span className="px-2 py-0.5 bg-success-soft text-success rounded text-caption font-semibold border border-success/20">BACKEND DATA</span>
          </div>
          <p className="text-label-sm text-text-secondary">Manage fraud investigations, assignments and resolution workflows.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {metrics.map((m, i) => (
          <div key={i} className={`rounded-xl border ${m.highlight ? 'border-danger/30 bg-danger-soft/50' : 'border-border bg-surface'} p-5 shadow-sm hover:premium-shadow-hover transition-all`}>
            <div className={`text-caption font-semibold uppercase mb-3 ${m.highlight ? 'text-danger' : 'text-text-muted'}`}>{m.label}</div>
            <div className={`text-[25px] font-semibold tracking-[-.04em] tabular-nums ${m.color || (m.highlight ? 'text-danger' : 'text-text-primary')}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="flex h-full min-h-[700px] flex-col gap-6 2xl:flex-row">
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse whitespace-nowrap text-left">
              <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Recommendation</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {cases.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No cases found.</td></tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.transaction_id} onClick={() => setSelectedCaseId(c.transaction_id)} className={`transition-colors cursor-pointer ${selectedCaseId === c.transaction_id ? 'bg-primary-soft/50' : 'hover:bg-surface-secondary/50'}`}>
                      <td className="p-4">
                        <span className="text-label-sm text-mono-sm font-mono font-semibold text-primary">{c.transaction_id}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-semibold ${c.recommendation === 'BLOCK' ? 'text-danger bg-danger-soft border border-danger/20' : c.recommendation === 'REVIEW' ? 'text-warning bg-warning-soft border border-warning/20' : 'text-success bg-success-soft border border-success/20'}`}>
                          {c.recommendation || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4 text-label-sm text-text-secondary">
                        {c.confidence ? `${(c.confidence * 100).toFixed(1)}%` : '--'}
                      </td>
                      <td className="p-4">
                        <span className="text-label-sm font-medium text-text-primary">{c.agent_state}</span>
                      </td>
                      <td className="p-4 text-caption text-text-secondary text-mono-sm font-mono">
                        {c.created_at ? new Date(c.created_at).toLocaleString() : '--'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedCase && (
          <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm 2xl:w-[470px]">
            <div className="p-6 border-b border-border bg-surface-secondary/50 flex justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-heading-md text-mono-sm font-mono font-semibold text-text-primary ">{selectedCase.transaction_id.substring(0, 16)}...</h3>
                </div>
                <p className="text-label-sm text-text-secondary flex items-center gap-2 flex-wrap">
                  Status: <span className="font-semibold text-text-primary">{selectedCase.agent_state}</span>
                </p>
              </div>
              <button onClick={() => setSelectedCaseId(null)} className="h-8 w-8 rounded-lg border border-transparent bg-surface flex items-center justify-center text-text-muted hover:border-border hover:text-text-primary shadow-sm transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-surface-secondary/30">
              <div className="bg-[#1e2336] rounded-xl p-5 text-white premium-shadow border border-[#3e455e] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#3e455e] pb-3 relative z-10">
                  <Activity className="h-5 w-5 text-primary" />
                  <h4 className="text-label-sm font-semibold uppercase ">Sentinel Recommendation</h4>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-[#3e455e] mb-4 flex justify-between items-center relative z-10">
                  <span className={`font-semibold text-label-sm flex items-center gap-2 ${selectedCase.recommendation === 'BLOCK' ? 'text-danger' : selectedCase.recommendation === 'REVIEW' ? 'text-warning' : 'text-success'}`}>
                    {selectedCase.recommendation === 'BLOCK' && <Ban className="h-4 w-4" />} {selectedCase.recommendation || 'PENDING'}
                  </span>
                  <span className="text-text-muted text-caption text-mono-sm font-mono font-semibold px-2 py-0.5 rounded border border-[#3e455e]">
                    {selectedCase.confidence ? `${(selectedCase.confidence * 100).toFixed(1)}% Confidence` : 'Running...'}
                  </span>
                </div>
                <div className="text-label-sm text-[#a1a6bb] leading-relaxed relative z-10">
                  <span className="block font-semibold mb-2">Reason Codes:</span>
                  <ul className="list-disc pl-5">
                    {selectedCase.reason_codes?.map((rc: string) => <li key={rc}>{rc}</li>) || <li>None</li>}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-3">Evidence Data</h4>
                <pre className="bg-surface border border-border rounded-xl p-4 text-mono-sm font-mono text-text-secondary overflow-x-auto max-h-[300px]">
                  {JSON.stringify(selectedCase.evidence || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
