"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchInvestigation, updateInvestigationStatus, updateInvestigationAssignee } from "../../../lib/api";
import { ArrowLeft, ArrowRight, Clock, History, AlertTriangle, Network, Search, Filter, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ErrorState, Skeleton } from "../../../components/ui";

export default function InvestigationDetail() {
  const params = useParams();
  const caseId = params.id as string;
  const [inv, setInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (caseId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const loadData = async () => {
    setError(false);
    try {
      const data = await fetchInvestigation(caseId);
      setInv(data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateInvestigationStatus(caseId, newStatus);
      await loadData();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleAssigneeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAssignee = e.target.value;
    try {
      setInv({...inv, assignee: newAssignee});
      await updateInvestigationAssignee(caseId, newAssignee);
    } catch (e) {
      alert("Failed to update assignee");
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-danger-soft text-danger border border-danger/20 flex items-center gap-1.5 w-fit shadow-sm"><ShieldAlert className="w-3 h-3" /> CRITICAL</span>;
      case "HIGH": return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-warning-soft text-warning border border-warning/20 flex items-center gap-1.5 w-fit shadow-sm"><ShieldAlert className="w-3 h-3" /> HIGH</span>;
      case "MEDIUM": return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-info-soft text-info border border-info/20 flex items-center gap-1.5 w-fit shadow-sm"><ShieldAlert className="w-3 h-3" /> MEDIUM</span>;
      default: return <span className="px-2.5 py-1 text-caption font-semibold rounded-md uppercase bg-surface-secondary text-text-secondary border border-border flex items-center gap-1.5 w-fit shadow-sm"><ShieldAlert className="w-3 h-3" /> LOW</span>;
    }
  };

  if (loading) return <div className="p-8 text-text-muted text-label-sm font-medium">Loading case details...</div>;
  if (!inv) return <div className="p-8 text-danger font-semibold text-label-sm bg-danger-soft/20 rounded-xl m-8 border border-danger/20">Investigation not found.</div>;

  return (
    <div className="flex flex-col gap-6 pb-12 h-full">
      
      <Link href="/investigations" className="inline-flex items-center gap-2 text-label-sm font-semibold text-text-secondary hover:text-text-primary transition-colors w-fit p-1 -ml-1 rounded-lg hover:bg-surface-secondary">
        <ArrowLeft className="w-4 h-4" /> Back to Investigations
      </Link>

      {/* HEADER */}
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm premium-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {getSeverityBadge(inv.severity)}
            <h1 className="text-heading-lg text-mono-sm text-mono-sm font-mono font-semibold text-primary ">{inv.case_id}</h1>
          </div>
          <p className="text-text-primary text-heading-md font-semibold mb-3 max-w-2xl">{inv.title}</p>
          <div className="text-label-sm text-text-secondary flex items-center gap-2 font-medium bg-surface-secondary px-3 py-1.5 rounded-lg w-fit border border-border">
            <Clock className="w-3.5 h-3.5" /> Created: {new Date(inv.created_at).toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-secondary/50 p-5 rounded-xl border border-border relative z-10 shadow-sm w-full md:w-auto">
          <div className="w-full sm:w-auto">
            <label className="block text-caption font-semibold text-text-secondary uppercase mb-2">Assignee</label>
            <input 
              type="text" 
              defaultValue={inv.assignee || ""} 
              onBlur={handleAssigneeChange}
              placeholder="Unassigned"
              className="bg-surface border border-border text-text-primary rounded-lg px-4 py-2 text-label-sm font-semibold w-full sm:w-48 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-sm transition-all"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-caption font-semibold text-text-secondary uppercase mb-2">Status</label>
            <select 
              value={inv.status} 
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`w-full sm:w-48 rounded-lg px-4 py-2 text-label-sm font-semibold shadow-sm focus:outline-none cursor-pointer border ${
                inv.status === "OPEN" ? "bg-surface text-text-primary border-border" :
                inv.status === "INVESTIGATING" ? "bg-primary-soft text-primary border-primary/30" :
                inv.status === "ESCALATED" ? "bg-warning-soft text-warning border-warning/30" :
                inv.status === "RESOLVED" ? "bg-success-soft text-success border-success/30" :
                "bg-surface-secondary text-text-muted border-border border-dashed"
              }`}
            >
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="DISMISSED">DISMISSED</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Summary & Evidence */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
            
            <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
            
            <h3 className="text-caption font-semibold text-text-primary uppercase mb-5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Summary
            </h3>
            <p className="text-text-secondary text-label-sm leading-relaxed max-w-3xl">
              This case was auto-generated by the Risk Policy Engine due to a high-risk event trigger: <strong className="text-text-primary bg-surface-secondary px-2 py-1 rounded-md border border-border text-mono-sm text-mono-sm font-mono">{inv.trigger}</strong>. 
              The total financial exposure associated with the linked transactions is <strong className="text-danger text-mono-sm text-mono-sm font-mono font-semibold tabular-nums bg-danger-soft px-2 py-1 rounded-md border border-danger/20">₹{(inv.exposure || 0).toLocaleString()}</strong>.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
            <div className="flex items-center justify-between border-b border-border p-5 bg-surface-secondary/50">
              <h3 className="text-caption font-semibold text-text-primary uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" /> Linked Transactions
              </h3>
              <span className="text-caption font-semibold text-primary bg-primary-soft border border-primary/20 px-2.5 py-1 rounded-md">{inv.transactions?.length || 0} Transactions</span>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-3 bg-surface-secondary/30">
              {inv.transactions && inv.transactions.map((txId: string) => (
                <div key={txId} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-surface border border-border rounded-xl hover:border-primary/30 transition-colors shadow-sm gap-3">
                  <div className="text-mono-sm text-mono-sm font-mono text-label-sm text-primary font-semibold">{txId}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-caption font-semibold text-warning uppercase bg-warning-soft px-2.5 py-1 rounded-md border border-warning/20">Pending Review</span>
                    <button className="text-caption font-semibold text-text-secondary hover:text-primary transition-colors bg-surface-secondary px-3 py-1.5 rounded-lg border border-border hover:border-primary/30">View</button>
                  </div>
                </div>
              ))}
              {(!inv.transactions || inv.transactions.length === 0) && (
                <div className="text-center p-8 text-text-muted text-label-sm font-medium border border-dashed border-border rounded-xl bg-surface">No linked transactions found.</div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
            <h3 className="text-caption font-semibold text-text-primary uppercase mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2"><Network className="w-4 h-4 text-primary" /> Graph Context</span>
              <span className="text-caption font-semibold bg-surface-secondary text-text-secondary px-2 py-1 rounded-md border border-border">Read-Only View</span>
            </h3>
            <div className="h-56 bg-surface-secondary border border-border rounded-xl flex items-center justify-center relative overflow-hidden group-hover:bg-primary-soft/10 transition-colors">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="text-center z-10 p-6 bg-surface/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary-soft border border-primary/20 mx-auto mb-4 flex items-center justify-center text-primary shadow-sm">
                  <Network className="w-7 h-7" />
                </div>
                <div className="text-text-primary text-label-sm font-semibold mb-1">Neighborhood Analysis Ready</div>
                <div className="text-text-secondary text-caption mb-4">Full interactive cluster analysis available in the primary Visualizer.</div>
                <Link href="/graph" className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-hover px-5 py-2.5 rounded-xl text-caption font-semibold transition-all shadow-sm premium-shadow">Open Graph Intelligence <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Action & Audit Panel */}
        <div className="space-y-6">
          
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm premium-shadow relative overflow-hidden">
             {/* decorative blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-2xl rounded-full pointer-events-none"></div>

            <h3 className="text-caption font-semibold text-text-primary uppercase mb-5 border-b border-border pb-3 relative z-10">Actions</h3>
            <div className="space-y-3 relative z-10">
              <button 
                onClick={() => handleStatusChange('RESOLVED')}
                className="w-full bg-success hover:bg-[#0ea371] text-white font-semibold text-label-sm py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Resolve Case
              </button>
              <button 
                onClick={() => handleStatusChange('ESCALATED')}
                className="w-full bg-warning hover:bg-[#d97706] text-white font-semibold text-label-sm py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> Escalate
              </button>
              <button 
                onClick={() => handleStatusChange('DISMISSED')}
                className="w-full bg-surface hover:bg-surface-secondary border border-border text-text-primary font-semibold text-label-sm py-3 rounded-xl transition-all shadow-sm"
              >
                Dismiss (False Positive)
              </button>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col max-h-[600px]">
            <h3 className="text-caption font-semibold text-text-primary uppercase p-5 border-b border-border bg-surface-secondary/50 flex items-center gap-2 shrink-0">
              <History className="w-4 h-4 text-primary" /> Audit History
            </h3>
            
            <div className="p-6 overflow-y-auto bg-surface-secondary/20 flex-1">
              <div className="relative border-l-2 border-border/50 ml-3 space-y-8">
                
                <div className="relative">
                  <div className="absolute -left-[23px] bg-surface border-2 border-primary w-5 h-5 rounded-full mt-0 shadow-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="pl-5">
                    <div className="text-label-sm font-semibold text-text-primary">Case Auto-Created</div>
                    <div className="text-caption font-medium text-text-muted mt-1">{new Date(inv.created_at).toLocaleString()}</div>
                    <div className="text-caption text-text-secondary mt-3 bg-surface border border-border p-3.5 rounded-xl shadow-sm leading-relaxed">
                      Policy Engine triggered creation due to <strong className="text-text-primary text-mono-sm text-mono-sm font-mono bg-surface-secondary px-1.5 py-0.5 rounded border border-border/50 ml-1">{inv.trigger}</strong>
                    </div>
                  </div>
                </div>

                {inv.updated_at !== inv.created_at && (
                  <div className="relative">
                    <div className="absolute -left-[23px] bg-surface border-2 border-border-strong w-5 h-5 rounded-full mt-0 shadow-sm"></div>
                    <div className="pl-5">
                      <div className="text-label-sm font-semibold text-text-primary">Status Updated</div>
                      <div className="text-caption font-medium text-text-muted mt-1">{new Date(inv.updated_at).toLocaleString()}</div>
                      <div className="text-caption text-text-secondary mt-3 bg-surface border border-border p-3.5 rounded-xl shadow-sm flex items-center gap-2">
                        Status changed to 
                        <span className="font-semibold text-text-primary bg-surface-secondary px-2 py-1 rounded-md border border-border">{inv.status}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}