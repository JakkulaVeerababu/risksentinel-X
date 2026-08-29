"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Search,
  ChevronDown,
  Filter,
  MoreVertical,
  Activity,
  AlertTriangle,
  Ban,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ExternalLink,
  X
} from "lucide-react";

export default function CasesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCase, setSelectedCase] = useState<string | null>("CASE-RSX184");
  
  const metrics = [
    { label: "Open", value: "42", highlight: false },
    { label: "Investigating", value: "18", highlight: false },
    { label: "Escalated", value: "6", highlight: false, color: "text-warning" },
    { label: "Awaiting Review", value: "11", highlight: false },
    { label: "Resolved Today", value: "24", highlight: false, color: "text-success" },
    { label: "SLA Breached", value: "3", highlight: true, color: "text-danger" },
  ];

  const cases = [
    { id: "CASE-RSX184", entity: "FRC-0184", type: "Fraud Cluster", risk: "96 CRIT", riskColor: "text-danger bg-danger-soft border border-danger/20", priority: "P1", assignee: "R. Verma", assigneeInitials: "RV", status: "Investigating", statusColor: "text-info", sla: "42 min left", slaColor: "text-warning", created: "28 Aug, 12:40 PM", isSelected: true },
    { id: "CASE-RSX183", entity: "pay_PM71JD29", type: "Transaction", risk: "92 CRIT", riskColor: "text-danger bg-danger-soft border border-danger/20", priority: "P1", assignee: "A. Sharma", assigneeInitials: "AS", status: "Escalated", statusColor: "text-warning", sla: "18 min left", slaColor: "text-danger", created: "28 Aug, 12:38 PM", isSelected: false },
    { id: "CASE-RSX179", entity: "FRC-0179", type: "Fraud Cluster", risk: "88 HIGH", riskColor: "text-warning bg-warning-soft border border-warning/20", priority: "P2", assignee: "Unassigned", assigneeInitials: "--", status: "Open", statusColor: "text-text-secondary", sla: "1 hr 12 min", slaColor: "text-text-primary", created: "28 Aug, 12:14 PM", isSelected: false },
    { id: "CASE-RSX175", entity: "usr_K92M4", type: "Account Takeover", risk: "74 MED", riskColor: "text-warning bg-warning-soft border border-warning/20", priority: "P3", assignee: "R. Verma", assigneeInitials: "RV", status: "Pending", statusColor: "text-text-secondary", sla: "4 hr", slaColor: "text-text-primary", created: "28 Aug, 10:05 AM", isSelected: false },
    { id: "CASE-RSX154", entity: "pay_LP84NM20", type: "Transaction", risk: "42 LOW", riskColor: "text-text-secondary bg-surface-secondary border border-border", priority: "P3", assignee: "A. Sharma", assigneeInitials: "AS", status: "Resolved", statusColor: "text-success", sla: "Completed", slaColor: "text-success", created: "27 Aug, 04:15 PM", isSelected: false, isResolved: true },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-primary">Investigation operations</div>
          <h1 className="text-[36px] font-semibold leading-tight tracking-[-.04em] text-text-primary">Cases</h1>
          <p className="text-label-sm text-text-secondary">Manage fraud investigations, assignments and resolution workflows.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <Download className="h-4 w-4 text-text-muted" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-white premium-shadow hover:premium-shadow-hover hover:bg-primary-hover transition-all">
            <Plus className="h-4 w-4" />
            New Case
          </button>
        </div>
      </div>

      {/* Metric Cells */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((m, i) => (
          <div key={i} className={`rounded-xl border ${m.highlight ? 'border-danger/30 bg-danger-soft/50' : 'border-border bg-surface'} p-5 shadow-sm hover:premium-shadow-hover transition-all`}>
            <div className={`text-caption font-semibold uppercase mb-3 ${m.highlight ? 'text-danger' : 'text-text-muted'}`}>{m.label}</div>
            <div className={`text-display-lg text-display-md tabular-nums ${m.color || (m.highlight ? 'text-danger' : 'text-text-primary')}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Main Layout Area */}
      <div className="flex h-full min-h-[700px] flex-col gap-6 2xl:flex-row">
        
        {/* Left Table Section */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          {/* SLA Banner */}
          <div className="bg-warning-soft border-b border-warning/20 px-5 py-3 flex items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-warning/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <AlertTriangle className="h-5 w-5 text-warning relative z-10 shrink-0" />
            <span className="text-label-sm font-medium text-warning relative z-10">
              <strong className="font-semibold">3 cases require immediate attention</strong> — CASE-RSX183 is within 18 minutes of SLA breach.
            </span>
          </div>
          
          {/* Tabs & Toolbar */}
          <div className="flex flex-col border-b border-border">
            <div className="flex gap-6 px-5 pt-5 border-b border-border overflow-x-auto hide-scrollbar">
              {[
                { id: "all", label: "All Cases (97)" },
                { id: "my", label: "My Cases (18)" },
                { id: "unassigned", label: "Unassigned (9)" },
                { id: "escalated", label: "Escalated (6)" },
                { id: "resolved", label: "Resolved (42)" }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 -mb-[1px] text-label-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-text-secondary border-b-2 border-transparent hover:text-text-primary'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-4 bg-surface-secondary/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex items-center w-full sm:w-auto">
                  <Filter className="absolute left-3 h-4 w-4 text-text-muted pointer-events-none" />
                  <input 
                    className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-label-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all placeholder:text-text-muted font-medium" 
                    placeholder="Filter cases..." 
                    type="text" 
                  />
                </div>
                {["Status", "Priority", "Assignee"].map(filter => (
                  <button key={filter} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-caption font-semibold text-text-secondary hover:bg-surface-secondary transition-all shadow-sm hidden md:flex">
                    {filter} <ChevronDown className="h-4 w-4 text-text-muted" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-caption text-text-secondary">
                <span>Sort by:</span>
                <button className="flex items-center gap-1 font-semibold text-text-primary border border-border bg-surface px-3 py-1.5 rounded-lg hover:bg-surface-secondary transition-colors shadow-sm">
                  Priority (High to Low) <ChevronDown className="h-4 w-4 text-text-muted" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse whitespace-nowrap text-left">
              <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
                <tr>
                  <th className="p-4 w-12 text-center"></th>
                  <th className="p-4">Case ID</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Risk</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">SLA</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {cases.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedCase(c.id)} className={`transition-colors cursor-pointer ${c.isResolved ? 'opacity-60 bg-surface-secondary/30' : ''} ${c.isSelected ? 'bg-primary-soft/50' : 'hover:bg-surface-secondary/50'}`}>
                    <td className={`p-4 text-center border-l-[3px] ${c.isSelected ? 'border-l-primary' : 'border-l-transparent group-hover:border-l-border-strong'}`}>
                      <input className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox" disabled={c.isResolved} />
                    </td>
                    <td className="p-4">
                      <span className={`text-label-sm text-mono-sm text-mono-sm font-mono font-semibold ${c.isResolved ? 'text-text-muted line-through' : 'text-primary'}`}>{c.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-label-sm text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">{c.entity}</span>
                    </td>
                    <td className="p-4 text-label-sm text-text-secondary">{c.type}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-semibold ${c.riskColor}`}>
                        {c.risk}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-caption font-semibold ${c.priority === 'P1' ? 'border-danger/30 text-danger bg-danger-soft' : c.priority === 'P2' ? 'border-warning/30 text-warning bg-warning-soft' : 'border-border text-text-muted bg-surface-secondary'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-caption font-semibold ${c.assignee === 'Unassigned' ? 'bg-surface-secondary border border-dashed border-border text-transparent' : 'bg-primary-soft text-primary'}`}>
                          {c.assigneeInitials}
                        </div>
                        <span className={`text-label-sm ${c.assignee === 'Unassigned' ? 'text-text-muted italic' : 'text-text-primary'}`}>{c.assignee}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 text-caption font-semibold ${c.statusColor}`}>
                        <span className={`w-2 h-2 rounded-full ${c.status === 'Resolved' ? 'bg-success' : c.status === 'Open' || c.status === 'Pending' ? 'border border-text-muted bg-transparent' : c.status === 'Escalated' ? 'bg-warning' : 'bg-info'}`}></span>
                        {c.status}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1.5 text-label-sm text-mono-sm text-mono-sm font-mono font-semibold ${c.slaColor}`}>
                        {c.sla.includes('min') && <Clock className="h-4 w-4" />} {c.sla}
                      </div>
                    </td>
                    <td className="p-4 text-caption text-text-secondary text-mono-sm text-mono-sm font-mono">{c.created}</td>
                    <td className="p-4 text-center">
                      <button className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Drawer: Case Details */}
        {selectedCase && (
          <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm 2xl:w-[470px]">
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface-secondary/50 flex justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-heading-md text-mono-sm text-mono-sm font-mono font-semibold text-text-primary ">CASE-RSX184</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded border border-danger/30 text-danger bg-danger-soft text-caption font-semibold ">P1 CRITICAL</span>
                </div>
                <p className="text-label-sm text-text-secondary flex items-center gap-2 flex-wrap">
                  Fraud Cluster <span className="text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">FRC-0184</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border-strong"></span>
                  Assigned to <span className="font-semibold text-text-primary">R. Verma</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:bg-surface-secondary hover:text-text-primary shadow-sm transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button onClick={() => setSelectedCase(null)} className="h-8 w-8 rounded-lg border border-transparent bg-surface flex items-center justify-center text-text-muted hover:border-border hover:text-text-primary shadow-sm transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-surface-secondary/30">
              
              {/* Summary Card */}
              <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-4">Cluster Summary</h4>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div>
                    <div className="text-caption text-text-muted uppercase font-semibold mb-1">Total Exposure</div>
                    <div className="text-heading-md font-semibold text-mono-sm text-mono-sm font-mono text-danger tabular-nums">₹4.82L</div>
                  </div>
                  <div>
                    <div className="text-caption text-text-muted uppercase font-semibold mb-1">Transactions</div>
                    <div className="text-heading-md font-semibold text-mono-sm text-mono-sm font-mono text-text-primary tabular-nums">43</div>
                  </div>
                  <div>
                    <div className="text-caption text-text-muted uppercase font-semibold mb-1">Entities Linked</div>
                    <div className="text-heading-md font-semibold text-mono-sm text-mono-sm font-mono text-text-primary tabular-nums">18</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="px-2.5 py-1 bg-surface-secondary border border-border rounded-md text-caption text-mono-sm text-mono-sm font-mono font-medium text-text-secondary">IP: 49.37.***.82</span>
                  <span className="px-2.5 py-1 bg-surface-secondary border border-border rounded-md text-caption text-mono-sm text-mono-sm font-mono font-medium text-text-secondary">Device: dev_4F892</span>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-[#1e2336] rounded-xl p-5 text-white premium-shadow border border-[#3e455e] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#3e455e] pb-3 relative z-10">
                  <Activity className="h-5 w-5 text-primary" />
                  <h4 className="text-label-sm font-semibold uppercase ">Sentinel Recommendation</h4>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-[#3e455e] mb-4 flex justify-between items-center relative z-10">
                  <span className="text-danger font-semibold text-label-sm flex items-center gap-2"><Ban className="h-4 w-4" /> BLOCK ENTIRE CLUSTER</span>
                  <span className="text-success text-caption text-mono-sm text-mono-sm font-mono font-semibold bg-success/10 px-2 py-0.5 rounded border border-success/20">94% Confidence</span>
                </div>
                <p className="text-label-sm text-[#a1a6bb] leading-relaxed relative z-10">
                  Pattern matches known synthetic identity ring (Ring-7A). IP <span className="text-mono-sm text-mono-sm font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">49.37.***.82</span> associated with 14 previously blocked accounts. Velocity of transactions across cluster entities exceeds normal thresholds by 400% in last 24h.
                </p>
              </div>

              {/* Related Transactions */}
              <div>
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-3">Key Transactions (43 Total)</h4>
                <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-sm">
                  <table className="w-full text-left text-label-sm">
                    <thead className="bg-surface-secondary border-b border-border text-caption font-semibold text-text-muted uppercase ">
                      <tr>
                        <th className="p-3">Txn ID</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-surface-secondary/50">
                        <td className="p-3 text-mono-sm text-mono-sm font-mono font-semibold text-primary">pay_PM71JD29</td>
                        <td className="p-3 text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">₹12,500</td>
                        <td className="p-3 text-right"><span className="text-caption font-semibold text-danger bg-danger-soft border border-danger/20 px-1.5 py-0.5 rounded">BLOCKED</span></td>
                      </tr>
                      <tr className="hover:bg-surface-secondary/50">
                        <td className="p-3 text-mono-sm text-mono-sm font-mono font-semibold text-primary">pay_QZ18HF63</td>
                        <td className="p-3 text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">₹45,000</td>
                        <td className="p-3 text-right"><span className="text-caption font-semibold text-danger bg-danger-soft border border-danger/20 px-1.5 py-0.5 rounded">BLOCKED</span></td>
                      </tr>
                      <tr className="hover:bg-surface-secondary/50">
                        <td className="p-3 text-mono-sm text-mono-sm font-mono font-semibold text-primary">pay_XT92PL11</td>
                        <td className="p-3 text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">₹8,200</td>
                        <td className="p-3 text-right"><span className="text-caption font-semibold text-warning bg-warning-soft border border-warning/20 px-1.5 py-0.5 rounded">REVIEW</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-3 text-center border-t border-border bg-surface-secondary/50">
                    <a className="text-primary text-caption font-semibold hover:underline" href="#">View all 43 transactions</a>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-5">Activity Timeline</h4>
                <div className="relative pl-5 border-l-2 border-border ml-3 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-surface ring-2 ring-primary/20"></div>
                    <div className="text-caption font-semibold text-text-muted text-mono-sm text-mono-sm font-mono mb-1">12:47 PM</div>
                    <div className="text-label-sm font-semibold text-text-primary">AI Investigation Completed</div>
                    <div className="text-caption text-text-secondary mt-1.5 leading-relaxed">Sentinel compiled cluster insights and recommended Block.</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-text-muted border-2 border-surface ring-2 ring-text-muted/20"></div>
                    <div className="text-caption font-semibold text-text-muted text-mono-sm text-mono-sm font-mono mb-1">12:44 PM</div>
                    <div className="text-label-sm font-semibold text-text-primary">Note Added</div>
                    <div className="text-caption text-text-primary bg-surface border border-border p-3 rounded-xl mt-2 shadow-sm font-medium italic">&quot;Reviewing device velocity history.&quot; - R. Verma</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-text-muted border-2 border-surface ring-2 ring-text-muted/20"></div>
                    <div className="text-caption font-semibold text-text-muted text-mono-sm text-mono-sm font-mono mb-1">12:42 PM</div>
                    <div className="text-label-sm font-semibold text-text-primary">Case Assigned</div>
                    <div className="text-caption text-text-secondary mt-1.5">Assigned to R. Verma (SLA: 1h)</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Note Input & Actions */}
            <div className="border-t border-border bg-surface p-5 flex flex-col gap-4">
              <div className="relative">
                <textarea 
                  className="w-full border border-border rounded-xl bg-surface p-3 text-label-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none placeholder:text-text-muted shadow-sm transition-all" 
                  placeholder="Add an investigation note..." 
                  rows={2}
                ></textarea>
                <button className="absolute bottom-3 right-3 text-primary font-semibold text-caption hover:underline bg-surface px-1">Post Note</button>
              </div>
              <div className="flex justify-between items-center pt-2">
                <button className="text-danger font-semibold text-caption hover:underline flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> Escalate
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-border rounded-lg bg-surface text-text-primary text-caption font-semibold hover:bg-surface-secondary transition-colors shadow-sm">Ready for Review</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-caption font-semibold hover:bg-primary-hover hover:premium-shadow-hover transition-all premium-shadow">Resolve Case</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
