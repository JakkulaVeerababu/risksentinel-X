"use client";

import React, { useState, useEffect } from 'react';
import {
  Download, Plus, AlertTriangle, Search, ChevronDown, X, Network, Activity, ArrowUpRight
} from "lucide-react";
import { fetchRecentTransactions, Transaction } from "@/lib/api";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const txs = await fetchRecentTransactions();
      // Derive alerts from blocked or review transactions
      const derivedAlerts = txs
        .filter(t => t.decision === 'BLOCK' || t.decision === 'REVIEW')
        .map(t => ({
          id: `ALT-${t.transaction_id}`,
          tx_id: t.transaction_id,
          severity: t.decision === 'BLOCK' ? 'CRITICAL' : 'HIGH',
          title: t.decision === 'BLOCK' ? 'Policy Block' : 'Risk Review',
          entity: t.customer_id,
          source: 'Risk Engine',
          evidence: `ML Risk: ${t.ml_risk}, Graph Risk: ${t.graph_risk}`,
          exposure: `₹${t.amount.toLocaleString()}`,
          status: 'Unacknowledged',
          statusColor: 'text-warning',
          time: new Date(t.timestamp).toLocaleString(),
          isCritical: t.decision === 'BLOCK'
        }));
      setAlerts(derivedAlerts);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading && alerts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Risk Alerts" description="Monitor and triage processed fraud and policy alerts." />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Risk Alerts" description="Monitor and triage processed fraud and policy alerts." />
        <ErrorState title="Alerts Data Unavailable" description="Failed to fetch transactions from the backend." />
      </div>
    );
  }

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);
  
  const metrics = [
    { label: "Alert Engine", value: "Operational", icon: <span className="h-2.5 w-2.5 rounded-full bg-success"></span>, highlight: false },
    { label: "Recent Alerts", value: alerts.length, highlight: false },
    { label: "Critical", value: alerts.filter(a => a.severity === 'CRITICAL').length, highlight: true },
  ];

  return (
    <div className="flex h-full flex-col gap-7 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[36px] font-semibold leading-tight tracking-[-.04em] text-text-primary">Risk alerts</h1>
            <span className="px-2 py-0.5 bg-success-soft text-success rounded text-caption font-semibold border border-success/20">BACKEND DATA</span>
          </div>
          <p className="text-label-sm text-text-secondary">Monitor and triage processed fraud and policy alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      <div className="flex h-full min-h-[600px] flex-col gap-6 2xl:flex-row">
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse whitespace-nowrap text-left">
              <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
                <tr>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Alert</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Exposure</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {alerts.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No alerts found.</td></tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id} onClick={() => setSelectedAlertId(alert.id)} className={`group cursor-pointer transition-colors ${selectedAlertId === alert.id ? 'bg-primary-soft/50' : 'hover:bg-surface-secondary/50'}`}>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-caption font-semibold border ${alert.severity === 'CRITICAL' ? 'text-danger bg-danger-soft border-danger/20' : 'text-warning bg-warning-soft border-warning/20'}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-label-sm font-medium text-text-primary">{alert.title}</span>
                          <span className="text-caption text-mono-sm font-mono text-text-secondary">{alert.id.substring(0, 16)}...</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <a className="text-label-sm text-mono-sm font-mono font-semibold text-primary hover:underline" href="#">{alert.entity}</a>
                      </td>
                      <td className="p-4 text-label-sm text-mono-sm font-mono font-semibold text-text-primary tabular-nums">{alert.exposure}</td>
                      <td className="p-4">
                        <div className={`flex items-center gap-2 text-caption font-semibold ${alert.statusColor}`}>
                          <span className={`w-2 h-2 rounded-full bg-warning`}></span>
                          {alert.status}
                        </div>
                        <div className="text-caption text-text-muted mt-1 text-mono-sm font-mono">{alert.time}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedAlert && (
          <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm 2xl:w-[450px]">
            <div className="p-6 border-b border-border bg-surface-secondary/50 flex justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-heading-md font-semibold text-text-primary ">Alert Details</h3>
                </div>
              </div>
              <button onClick={() => setSelectedAlertId(null)} className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface hover:text-text-primary transition-colors border border-transparent hover:border-border">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              <div>
                <h4 className="text-body font-semibold text-text-primary mb-2">{selectedAlert.title}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 flex flex-col gap-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Target Entity</span>
                    <span className="text-label-sm text-mono-sm font-mono font-semibold text-primary">{selectedAlert.entity}</span>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 flex flex-col gap-2">
                    <span className="text-caption font-semibold uppercase text-text-muted">Exposure</span>
                    <span className="text-label-sm text-mono-sm font-mono font-semibold text-text-primary">{selectedAlert.exposure}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-caption font-semibold uppercase text-text-muted mb-4 border-b border-border pb-2">Trigger Evidence</h4>
                <p className="text-label-sm text-text-secondary">{selectedAlert.evidence}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
