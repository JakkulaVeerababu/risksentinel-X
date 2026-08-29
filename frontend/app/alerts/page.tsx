"use client";

import React, { useState } from 'react';
import {
  Download,
  Plus,
  AlertTriangle,
  Search,
  ChevronDown,
  X,
  Network,
  Activity,
  ArrowUpRight
} from "lucide-react";

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<string | null>("ALT-RSX9821");

  const metrics = [
    { label: "Alert Engine", value: "Operational", icon: <span className="h-2.5 w-2.5 rounded-full bg-success"></span>, highlight: false },
    { label: "Recent Alerts", value: "18", highlight: false },
    { label: "Critical", value: "4", highlight: true },
    { label: "Avg Latency", value: "186 ms", highlight: false },
  ];

  const alerts = [
    { id: "ALT-RSX9821", severity: "CRITICAL", title: "Coordinated Fraud", entity: "FRC-0184", source: "Graph Intelligence", evidence: "Shared Device Network (11 acc)", exposure: "₹4.82L", status: "Unacknowledged", statusColor: "text-danger", time: "2 min ago", isSelected: true },
    { id: "ALT-RSX9820", severity: "HIGH", title: "Velocity Anomaly", entity: "FRC-0179", source: "Risk Model v2", evidence: "Rapid successive transfers to new payees", exposure: "₹1.25L", status: "Investigating", statusColor: "text-info", time: "15 min ago", isSelected: false },
    { id: "ALT-RSX9819", severity: "MEDIUM", title: "Unusual Location", entity: "USR-8821", source: "Geospatial Rule", evidence: "Login from previously unseen IP (RU)", exposure: "-", status: "Unacknowledged", statusColor: "text-warning", time: "1 hr ago", isSelected: false },
    { id: "ALT-RSX9818", severity: "LOW", title: "Device Mismatch", entity: "USR-4412", source: "Policy Engine", evidence: "New device ID for existing session", exposure: "-", status: "Resolved", statusColor: "text-success", time: "3 hrs ago", isSelected: false },
  ];

  return (
    <div className="flex h-full flex-col gap-7 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-primary">Detection operations</div>
          <h1 className="text-[36px] font-semibold leading-tight tracking-[-.04em] text-text-primary">Risk alerts</h1>
          <p className="text-label-sm text-text-secondary">Monitor and triage processed fraud and policy alerts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <Plus className="h-4 w-4 text-text-muted" />
            Create Alert
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-label-sm font-medium text-text-primary shadow-sm hover:bg-surface-secondary transition-all">
            <Download className="h-4 w-4 text-text-muted" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Operational Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`rounded-[10px] border-t-2 ${m.highlight ? 'border-danger/30 border-t-danger bg-danger-soft/30' : 'border-border border-t-[#80928a] bg-surface'} p-5 shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              {m.icon}
              <span className={`text-caption font-semibold uppercase ${m.highlight ? 'text-danger' : 'text-text-muted'}`}>{m.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-[25px] font-semibold tracking-[-.04em] ${m.highlight ? 'text-danger' : 'text-text-primary'}`}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence Update Banner */}
      <div className="relative flex items-start gap-4 border-l-2 border-primary bg-primary-soft p-5">
        <div className="flex-1 relative z-10">
          <p className="text-label-sm text-primary font-medium leading-relaxed">
            <strong className="font-semibold mr-1">Intelligence Update:</strong> Critical activity increased 28% in the last 30 minutes.
            <a href="#" className="text-mono-sm font-mono font-semibold mx-1.5 hover:underline bg-primary/10 px-1.5 py-0.5 rounded">FRC-0184</a> and
            <a href="#" className="text-mono-sm font-mono font-semibold mx-1.5 hover:underline bg-primary/10 px-1.5 py-0.5 rounded">FRC-0179</a>
            account for 61% of current critical exposure.
          </p>
        </div>
      </div>

      {/* Main Interface Layout */}
      <div className="flex h-full min-h-[600px] flex-col gap-6 2xl:flex-row">

        {/* Left Table Section */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-border px-5 pt-5 overflow-x-auto hide-scrollbar">
            {[
              { id: "all", label: "All Alerts (64)" },
              { id: "unack", label: "Unacknowledged (11)" },
              { id: "investigating", label: "Investigating (18)" },
              { id: "escalated", label: "Escalated (6)" },
              { id: "resolved", label: "Resolved (25)" }
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

          {/* Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-secondary/50">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-text-muted pointer-events-none" />
                <input
                  className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-label-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all placeholder:text-text-muted font-medium"
                  placeholder="Search alert ID..."
                  type="text"
                />
              </div>
              {["Severity", "Type", "Status"].map(filter => (
                <button key={filter} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-caption font-semibold text-text-secondary hover:bg-surface-secondary transition-all shadow-sm">
                  {filter} <ChevronDown className="h-4 w-4 text-text-muted" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-caption text-text-secondary">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 font-semibold text-text-primary hover:text-primary transition-colors">
                Newest First <ChevronDown className="h-4 w-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse whitespace-nowrap text-left">
              <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox" />
                  </th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Alert</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Evidence</th>
                  <th className="p-4 text-right">Exposure</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {alerts.map((alert) => (
                  <tr key={alert.id} onClick={() => setSelectedAlert(alert.id)} className={`group cursor-pointer transition-colors ${selectedAlert === alert.id ? 'bg-primary-soft/50' : 'hover:bg-surface-secondary/50'}`}>
                    <td className={`p-4 text-center border-l-[3px] ${selectedAlert === alert.id ? 'border-l-primary' : 'border-l-transparent group-hover:border-l-border-strong'}`}>
                      <input className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox" />
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-caption font-semibold border ${alert.severity === 'CRITICAL' ? 'text-danger bg-danger-soft border-danger/20' : alert.severity === 'HIGH' ? 'text-warning bg-warning-soft border-warning/20' : alert.severity === 'MEDIUM' ? 'text-warning bg-surface-secondary border-border' : 'text-success bg-success-soft border-success/20'}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-label-sm font-medium text-text-primary">{alert.title}</span>
                        <span className="text-caption text-mono-sm font-mono text-text-secondary">{alert.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <a className="text-label-sm text-mono-sm font-mono font-semibold text-primary hover:underline" href="#">{alert.entity}</a>
                    </td>
                    <td className="p-4 text-label-sm text-text-secondary font-medium">{alert.source}</td>
                    <td className="p-4">
                      <div className="text-label-sm text-text-primary max-w-[200px] truncate" title={alert.evidence}>{alert.evidence}</div>
                    </td>
                    <td className="p-4 text-right text-label-sm text-mono-sm font-mono font-semibold text-text-primary tabular-nums">{alert.exposure}</td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 text-caption font-semibold ${alert.statusColor}`}>
                        <span className={`w-2 h-2 rounded-full ${alert.status === 'Resolved' ? 'bg-success' : alert.status === 'Investigating' ? 'bg-info' : alert.status === 'Unacknowledged' && alert.severity === 'CRITICAL' ? 'bg-danger' : 'bg-warning'}`}></span>
                        {alert.status}
                      </div>
                      <div className="text-caption text-text-muted mt-1 text-mono-sm font-mono">{alert.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Inspector Panel */}
        {selectedAlert && (
          <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm 2xl:w-[450px]">
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface-secondary/50 flex justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-heading-md font-semibold text-text-primary ">Alert Details</h3>
                  <span className="text-caption text-mono-sm font-mono font-semibold text-text-secondary bg-surface border border-border px-2 py-1 rounded shadow-sm">{selectedAlert}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded border border-danger/30 text-caption font-semibold uppercase text-danger bg-danger-soft">Critical</span>
                  <span className="text-border-strong">•</span>
                  <span className="text-caption font-semibold text-danger flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span> Unacknowledged
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface hover:text-text-primary transition-colors border border-transparent hover:border-border">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

              {/* Overview */}
              <div>
                <h4 className="text-body font-semibold text-text-primary mb-2">Coordinated Fraud Cluster Detected</h4>
                <p className="text-label-sm text-text-secondary leading-relaxed mb-6">System detected a high-risk topology pattern associated with coordinated fraud rings. Multiple nodes exhibiting synchronized transaction behavior.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 flex flex-col gap-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Target Entity</span>
                    <a href="#" className="text-label-sm text-mono-sm font-mono font-semibold text-primary hover:underline">FRC-0184</a>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 flex flex-col gap-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Risk Score</span>
                    <span className="text-label-sm text-mono-sm font-mono font-semibold text-danger">96 / 100</span>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 flex flex-col gap-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Exposure</span>
                    <span className="text-label-sm text-mono-sm font-mono font-semibold text-text-primary">₹4.82L</span>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 flex flex-col gap-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Trigger Txn</span>
                    <a href="#" className="text-label-sm text-mono-sm font-mono font-semibold text-text-primary hover:underline truncate">pay_PM71JD29</a>
                  </div>
                </div>
              </div>

              {/* Trigger Evidence */}
              <div>
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-4 border-b border-border pb-2">Trigger Evidence</h4>
                <ul className="flex flex-col gap-5">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 h-8 w-0.5 shrink-0 bg-danger" />
                    <div>
                      <p className="text-label-sm font-semibold text-text-primary">Shared Device Network</p>
                      <p className="text-caption text-text-secondary mt-1.5 leading-relaxed">11 distinct accounts accessed from common device fingerprint <span className="text-mono-sm font-mono bg-surface border border-border px-1.5 py-0.5 rounded shadow-sm text-text-primary">DF-99A1</span>.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 h-8 w-0.5 shrink-0 bg-warning" />
                    <div>
                      <p className="text-label-sm font-semibold text-text-primary">IP Velocity</p>
                      <p className="text-caption text-text-secondary mt-1.5 leading-relaxed">7 transactions originated from IP <span className="text-mono-sm font-mono bg-surface border border-border px-1.5 py-0.5 rounded shadow-sm text-text-primary">192.168.1.1</span> within 4 minutes.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* RazorSense AI */}
              <div className="rounded-xl border border-[#3e455e] bg-[#1e2336] p-5 text-white premium-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-3 mb-4 border-b border-[#3e455e] pb-3 relative z-10">
                  <h4 className="text-label-sm font-semibold">Sentinel AI Assessment</h4>
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-caption text-[#a1a6bb]">Recommendation</span>
                    <span className="text-caption font-semibold uppercase text-white bg-danger border border-danger-hover px-2 py-1 rounded shadow-sm">BLOCK</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-caption text-[#a1a6bb]">Confidence Score</span>
                    <span className="text-label-sm text-mono-sm font-mono font-semibold">94%</span>
                  </div>
                  <p className="text-caption text-[#d4d6e0] mt-2 leading-relaxed border-t border-[#3e455e]/50 pt-4">
                    High probability of account takeover or organized mule ring. Pattern strongly correlates with known <span className="text-mono-sm font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">Model_FRAUD_V2.4</span> signatures.
                  </p>
                </div>
              </div>

              {/* Workflow */}
              <div>
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-4 border-b border-border pb-2">Workflow & Policy</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-text-secondary">Automated Outcome</span>
                    <span className="text-label-sm font-semibold text-danger flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-danger-soft border border-danger/20">
                        <X className="h-3 w-3" />
                      </span>
                      BLOCK (Critical Graph Risk)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-text-secondary">Related Case</span>
                    <a href="#" className="text-label-sm text-mono-sm font-mono font-semibold text-primary hover:underline flex items-center gap-2">
                      CASE-RSX184 <span className="text-caption font-semibold uppercase text-info bg-info-soft border border-info/20 px-2 py-0.5 rounded ml-1">Investigating</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-border bg-surface flex gap-4">
              <button className="flex-1 rounded-xl border border-border bg-surface py-3 text-label-sm font-semibold text-text-primary shadow-sm hover:bg-surface-secondary transition-colors">
                Acknowledge
              </button>
              <button className="flex-1 rounded-xl bg-primary py-3 text-label-sm font-semibold text-white premium-shadow hover:premium-shadow-hover hover:bg-primary-hover transition-all flex items-center justify-center gap-2">
                Investigate Case <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
