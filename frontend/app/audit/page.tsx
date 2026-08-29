"use client";

import React, { useState } from 'react';
import { 
  Download,
  Calendar,
  ChevronDown,
  RefreshCcw,
  Search,
  Filter,
  SortDesc,
  Activity,
  ShieldAlert,
  Gavel,
  Network,
  Settings,
  User,
  X,
  FileJson,
  Copy,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<string | null>("evt_RSX_98214");

  const metrics = [
    { label: "Events Today", value: "28,419" },
    { label: "Decision Events", value: "14,892" },
    { label: "AI Investigations", value: "328", icon: <Activity className="h-4 w-4 text-primary" /> },
    { label: "Manual Actions", value: "184" },
    { label: "Overrides", value: "12", color: "text-danger" }
  ];

  const events = [
    { id: "evt_RSX_98214", time: "12:40:19.214", actor: "Policy Engine", actorType: "policy", action: "Decision Enforced", entity: "pay_PM71JD29", evidence: "Critical Graph Risk matched", decision: "BLOCK", decisionColor: "text-danger bg-danger-soft border border-danger/20", version: "risk-policy-v12", isSelected: true },
    { id: "evt_RSX_98213", time: "12:40:19.175", actor: "Sentinel AI", actorType: "ai", action: "Recommendation Generated", entity: "pay_PM71JD29", evidence: "12 evidence items", decision: "BLOCK (94%)", decisionColor: "text-danger bg-danger-soft border border-danger/20", version: "risk-agent-v3", isSelected: false },
    { id: "evt_RSX_98212", time: "12:40:19.033", actor: "Graph Engine", actorType: "graph", action: "Cluster Association Detected", entity: "pay_PM71JD29", evidence: "FRC-0184 Risk 0.96", decision: "CRITICAL", decisionColor: "text-danger bg-danger-soft border border-danger/20", version: "graph-engine-v4", isSelected: false },
    { id: "evt_RSX_98211", time: "12:40:18.981", actor: "Risk Model", actorType: "model", action: "Risk Score Generated", entity: "pay_PM71JD29", evidence: "94 / 100", decision: "HIGH", decisionColor: "text-warning bg-warning-soft border border-warning/20", version: "risk-model-v7", isSelected: false },
    { id: "evt_RSX_98210", time: "12:40:18.850", actor: "Transaction Gateway", actorType: "system", action: "Transaction Received", entity: "pay_PM71JD29", evidence: "₹48,900 • Card", decision: "Pending", decisionColor: "text-text-secondary bg-surface-secondary border border-border", version: "gateway-v2", isSelected: false },
    { id: "evt_RSX_97801", time: "11:15:02.441", actor: "Case Engine", actorType: "system", action: "Case Created", entity: "FRC-0184", evidence: "CASE-RSX184", decision: "P1", decisionColor: "text-danger bg-danger-soft border border-danger/20", version: "case-engine-v2", isSelected: false },
    { id: "evt_RSX_97855", time: "11:18:45.102", actor: "R. Verma", actorType: "user", action: "Case Assigned", entity: "CASE-RSX184", evidence: "Assigned to R. Verma", decision: "Investigating", decisionColor: "text-info bg-info-soft border border-info/20", version: "User Action", isSelected: false },
    { id: "evt_RSX_91004", time: "09:05:12.883", actor: "Policy Engine", actorType: "policy", action: "Policy Override", entity: "pay_LP84NM20", evidence: "AI REVIEW → Policy ALLOW", decision: "ALLOW", decisionColor: "text-success bg-success-soft border border-success/20", version: "risk-policy-v12", isSelected: false, isOverride: true }
  ];

  const getActorIcon = (type: string) => {
    switch(type) {
      case 'policy': return <Gavel className="h-4 w-4 text-text-secondary" />;
      case 'ai': return <Activity className="h-4 w-4 text-primary" />;
      case 'graph': return <Network className="h-4 w-4 text-text-secondary" />;
      case 'model': return <ShieldAlert className="h-4 w-4 text-info" />;
      case 'system': return <Settings className="h-4 w-4 text-text-secondary" />;
      case 'user': return <User className="h-4 w-4 text-text-secondary" />;
      default: return <Settings className="h-4 w-4 text-text-secondary" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-heading-lg text-heading-lg text-text-primary ">Audit Trail</h1>
          <p className="text-label-sm text-text-secondary">Trace every risk signal, recommendation, policy evaluation and analyst action.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <Calendar className="h-4 w-4 text-text-muted" />
            Last 24 Hours <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>
          <button className="h-10 w-10 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors shadow-sm">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <div className="mx-1 h-6 w-px bg-border"></div>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <Download className="h-4 w-4 text-text-muted" />
            Export
          </button>
        </div>
      </div>

      {/* Audit Status Strip */}
      <div className="flex rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        {metrics.map((m, i) => (
          <div key={i} className={`flex-1 flex flex-col p-5 hover:bg-surface-secondary/50 transition-colors ${i !== metrics.length - 1 ? 'border-r border-border' : ''}`}>
            <div className="flex items-center gap-2 mb-2 text-caption font-semibold uppercase text-text-muted">
              {m.icon}
              <span className={m.color ? m.color : ''}>{m.label}</span>
            </div>
            <div className={`text-display-lg text-display-md tabular-nums ${m.color || 'text-text-primary'}`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border overflow-x-auto hide-scrollbar">
        {[
          { id: "all", label: "All Events" },
          { id: "decisions", label: "Decisions" },
          { id: "ai", label: "AI" },
          { id: "policy", label: "Policy" },
          { id: "analyst", label: "Analyst Actions" },
          { id: "system", label: "System" },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 -mb-[1px] text-label-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-text-secondary border-b-2 border-transparent hover:text-text-primary'}`}
          >
            {tab.label}
          </button>
        ))}
        <button className="pb-4 -mb-[1px] text-label-sm font-semibold text-text-secondary border-b-2 border-transparent hover:text-text-primary flex items-center gap-2 whitespace-nowrap">
          Overrides <span className="bg-danger-soft text-danger px-2 py-0.5 rounded text-caption font-semibold border border-danger/20">12</span>
        </button>
      </div>

      {/* Main Interface Layout */}
      <div className="flex flex-col xl:flex-row gap-6 h-full min-h-[600px]">
        
        {/* Left Table Section */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-secondary/50">
            <div className="relative flex items-center w-full sm:w-80">
              <Search className="absolute left-3 h-4 w-4 text-text-muted pointer-events-none" />
              <input 
                className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-label-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full transition-all placeholder:text-text-muted font-medium" 
                placeholder="Search by ID, Entity, or Action..." 
                type="text" 
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-caption font-semibold text-text-secondary hover:bg-surface-secondary transition-colors shadow-sm">
                <Filter className="h-4 w-4 text-text-muted" /> Filters
                <span className="bg-primary text-white h-5 w-5 rounded-full flex items-center justify-center text-caption ml-1">3</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-caption font-semibold text-text-secondary hover:bg-surface-secondary transition-colors shadow-sm">
                <SortDesc className="h-4 w-4 text-text-muted" /> Newest First
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
                <tr>
                  <th className="p-4 w-32">Timestamp</th>
                  <th className="p-4 w-36">Event ID</th>
                  <th className="p-4 w-48">Actor / Source</th>
                  <th className="p-4">Action</th>
                  <th className="p-4 w-40">Entity</th>
                  <th className="p-4">Evidence / Result</th>
                  <th className="p-4 w-32 text-center">Decision</th>
                  <th className="p-4 w-32">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {events.map((evt) => (
                  <tr key={evt.id} onClick={() => setSelectedEvent(evt.id)} className={`transition-colors cursor-pointer group ${evt.isSelected ? 'bg-primary-soft/50' : 'hover:bg-surface-secondary/50'}`}>
                    <td className={`p-4 border-l-[3px] ${evt.isSelected ? 'border-l-primary' : 'border-l-transparent group-hover:border-l-border-strong'}`}>
                      <span className="text-label-sm text-mono-sm text-mono-sm font-mono text-text-secondary">{evt.time}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-label-sm text-mono-sm text-mono-sm font-mono text-text-secondary">{evt.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${evt.actorType === 'ai' ? 'bg-primary-soft border-primary/20 text-primary' : evt.actorType === 'model' ? 'bg-info-soft border-info/20 text-info' : 'bg-surface-secondary border-border text-text-muted'}`}>
                          {getActorIcon(evt.actorType)}
                        </div>
                        <span className={`text-label-sm font-semibold ${evt.actorType === 'model' ? 'text-info' : 'text-text-primary'}`}>{evt.actor}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-label-sm font-medium ${evt.isOverride ? 'font-semibold text-warning' : evt.actorType === 'model' ? 'text-info' : 'text-text-primary'}`}>{evt.action}</span>
                    </td>
                    <td className="p-4">
                      <a className="text-label-sm text-mono-sm text-mono-sm font-mono font-semibold text-primary hover:underline" href="#">{evt.entity}</a>
                    </td>
                    <td className="p-4 text-label-sm text-text-primary max-w-[200px] truncate" title={evt.evidence}>
                      {evt.actorType === 'model' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-2 bg-surface-secondary border border-border rounded-full overflow-hidden">
                            <div className="h-full bg-danger w-[94%]"></div>
                          </div>
                          <span className="text-mono-sm text-mono-sm font-mono">{evt.evidence}</span>
                        </div>
                      ) : (
                        evt.evidence
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-semibold ${evt.decisionColor}`}>
                        {evt.decision}
                      </span>
                    </td>
                    <td className="p-4 text-label-sm text-mono-sm text-mono-sm font-mono text-text-secondary">{evt.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Inspector Panel */}
        {selectedEvent && (
          <div className="w-full xl:w-[480px] shrink-0 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden animate-in slide-in-duration-300">
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface-secondary/50 flex justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-caption font-semibold uppercase text-text-muted">Audit Event</span>
                  <span className="text-caption text-mono-sm text-mono-sm font-mono font-semibold text-text-secondary bg-surface border border-border px-2 py-1 rounded shadow-sm">evt_RSX_98214</span>
                </div>
                <h2 className="text-heading-lg font-semibold text-text-primary ">Decision Enforced</h2>
                <div className="flex items-center gap-2 text-caption text-text-secondary mt-1">
                  <Calendar className="h-4 w-4" /> 28 Aug 2026 <span className="mx-1">•</span> <span className="text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">12:40:19.214 PM</span>
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface hover:text-text-primary shadow-sm transition-colors border border-transparent hover:border-border">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-surface-secondary/30">
              
              {/* Event Summary */}
              <div>
                <h3 className="text-label-sm font-semibold text-text-primary mb-3">Event Summary</h3>
                <div className="bg-surface border border-border rounded-xl p-5 shadow-sm grid grid-cols-2 gap-5">
                  <div>
                    <span className="block text-caption font-semibold uppercase text-text-muted mb-2">Entity</span>
                    <a href="#" className="text-label-sm text-mono-sm text-mono-sm font-mono font-semibold text-primary hover:underline">pay_PM71JD29</a>
                  </div>
                  <div>
                    <span className="block text-caption font-semibold uppercase text-text-muted mb-2">Policy</span>
                    <span className="text-label-sm text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">risk-policy-v12</span>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-border">
                    <span className="block text-caption font-semibold uppercase text-text-muted mb-2">Matched Rule</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-danger" />
                      <span className="text-label-sm font-semibold text-text-primary">Critical Graph Risk (POL-001)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Trace Timeline */}
              <div>
                <h3 className="text-label-sm font-semibold text-text-primary mb-5">Decision Trace</h3>
                <div className="relative pl-7 space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-[2px] before:bg-border">
                  {/* Trace 1 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-border z-10"></div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-label-sm font-semibold text-text-primary">Risk Score Generated</span>
                      <span className="text-caption text-mono-sm text-mono-sm font-mono text-text-secondary">12:40:18.981</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-text-secondary">
                      <ShieldAlert className="h-4 w-4 text-info" /> Model v7 • Score: 94/100
                    </div>
                  </div>
                  {/* Trace 2 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-border z-10"></div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-label-sm font-semibold text-text-primary">Cluster Association Detected</span>
                      <span className="text-caption text-mono-sm text-mono-sm font-mono text-text-secondary">12:40:19.033</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-text-secondary">
                      <Network className="h-4 w-4 text-text-muted" /> Graph v4 • Risk 0.96
                    </div>
                  </div>
                  {/* Trace 3 */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-primary flex items-center justify-center z-10 ring-2 ring-surface">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-label-sm font-semibold text-primary">Recommendation Generated</span>
                      <span className="text-caption text-mono-sm text-mono-sm font-mono text-primary">12:40:19.175</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-text-secondary bg-surface border border-border p-3 rounded-lg shadow-sm mt-2">
                      <Activity className="h-4 w-4 text-primary" /> Sentinel AI v3 • Recommended BLOCK (94% Conf.)
                    </div>
                  </div>
                  {/* Trace 4 (Current) */}
                  <div className="relative">
                    <div className="absolute -left-[30px] -top-1 w-[22px] h-[22px] rounded-full bg-danger-soft flex items-center justify-center z-10 border border-danger/30 ring-2 ring-surface">
                      <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-label-sm font-semibold text-text-primary">Decision Enforced</span>
                      <span className="text-caption text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">12:40:19.214</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-text-secondary">
                      <Gavel className="h-4 w-4 text-text-muted" /> Policy v12 • Enforced BLOCK
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Snapshot */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-label-sm font-semibold text-text-primary">Evidence Snapshot</h3>
                  <button className="text-caption font-semibold text-primary hover:underline flex items-center gap-1.5">
                    View JSON <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-muted shrink-0">
                    <FileJson className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-label-sm text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">evidence-snapshot-18492</div>
                    <div className="text-caption text-text-secondary mt-1">12 items captured at evaluation</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Meta / Versions */}
            <div className="border-t border-border bg-surface p-5">
              <div className="grid grid-cols-2 gap-y-4 gap-x-5 mb-5">
                {[
                  { label: "Model Version", val: "v7.0.2" },
                  { label: "Graph Version", val: "v4.1.9" },
                  { label: "AI Agent", val: "v3.5.1" },
                  { label: "Policy Engine", val: "v12.0.0" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-border pb-2 last:border-0">
                    <span className="text-caption font-semibold uppercase text-text-muted">{item.label}</span>
                    <span className="text-caption text-mono-sm text-mono-sm font-mono font-semibold text-text-primary">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-surface-secondary border border-border p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-caption font-semibold uppercase text-text-muted">Correlation ID</span>
                  <span className="text-caption text-mono-sm text-mono-sm font-mono font-semibold text-text-primary bg-surface border border-border px-2 py-1 rounded shadow-sm">corr_18492</span>
                </div>
                <button className="text-text-muted hover:text-text-primary transition-colors hover:bg-surface p-1.5 rounded" title="Copy ID">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
