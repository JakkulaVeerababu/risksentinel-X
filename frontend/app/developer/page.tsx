"use client";

import React, { useState } from "react";
import { PageHeader, Card, Badge } from "../../components/ui";
import { Copy, Check, Terminal, Webhook, FileJson } from "lucide-react";

export default function DeveloperPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const API_ENDPOINTS = [
    {
      id: "score",
      method: "POST",
      path: "/api/v1/score",
      title: "Evaluate Transaction Risk",
      description: "Synchronously evaluate a transaction through the complete Sentinel pipeline (ML, Graph, AI, Policy).",
      req: `{
  "transaction_id": "tx_req_8923a",
  "amount": 15000.50,
  "currency": "INR",
  "customer_id": "cust_abc123",
  "merchant_name": "Test Merchant",
  "device_id": "dev_99182",
  "ip_address": "192.168.1.1"
}`,
      res: `{
  "transaction_id": "tx_req_8923a",
  "decision": "BLOCK",
  "risk_score": 0.89,
  "reason": "High fraud probability detected via Graph Analysis and AI Investigator.",
  "status": "COMPLETED",
  "latency_ms": 342.5
}`
    },
    {
      id: "transactions-create",
      method: "POST",
      path: "/api/v1/transactions",
      title: "Log Transaction",
      description: "Asynchronously log a transaction into the Sentinel database. Used for batch ingestion or historical backfilling.",
      req: `{
  "transaction_id": "tx_hist_112",
  "amount": 250.00,
  "currency": "INR",
  "customer_id": "cust_xyz789",
  "merchant_name": "Coffee Shop",
  "device_id": "dev_445",
  "ip_address": "10.0.0.1",
  "policy_decision": "ALLOW"
}`,
      res: `{
  "transaction_id": "tx_hist_112",
  "status": "CREATED",
  "timestamp": "2026-08-28T14:22:00Z"
}`
    },
    {
      id: "transactions-get",
      method: "GET",
      path: "/api/v1/transactions/{id}",
      title: "Retrieve Transaction Details",
      description: "Fetch the stored details and final policy decision for a specific transaction ID.",
      req: `curl -X GET "https://api.risksentinel.io/v1/transactions/tx_hist_112" \\
  -H "Authorization: Bearer sk_test_..."`,
      res: `{
  "transaction_id": "tx_hist_112",
  "amount": 250.0,
  "customer_id": "cust_xyz789",
  "policy_decision": "ALLOW",
  "timestamp": "2026-08-28T14:22:00Z"
}`
    },
    {
      id: "investigations",
      method: "GET",
      path: "/api/v1/investigations",
      title: "List Open Investigations",
      description: "Retrieve a paginated list of automated investigations triggered by the Policy Engine.",
      req: `curl -X GET "https://api.risksentinel.io/v1/investigations?status=OPEN&limit=10" \\
  -H "Authorization: Bearer sk_test_..."`,
      res: `{
  "items": [
    {
      "case_id": "case_1882a",
      "transaction_id": "tx_req_8923a",
      "severity": "CRITICAL",
      "status": "OPEN",
      "assigned_to": null,
      "created_at": "2026-08-28T14:22:05Z"
    }
  ],
  "total": 1
}`
    },
    {
      id: "graph",
      method: "GET",
      path: "/api/v1/graph/{transaction_id}",
      title: "Query Graph Context",
      description: "Retrieve the interconnected entities (shared devices, IPs) surrounding a transaction.",
      req: `curl -X GET "https://api.risksentinel.io/v1/graph/tx_req_8923a" \\
  -H "Authorization: Bearer sk_test_..."`,
      res: `{
  "nodes": [
    {"id": "cust_abc123", "type": "customer", "risk_score": 0.92},
    {"id": "dev_99182", "type": "device", "risk_score": 0.85}
  ],
  "edges": [
    {"source": "cust_abc123", "target": "dev_99182", "relation": "USED_DEVICE"}
  ],
  "cluster_detected": true
}`
    },
    {
      id: "audit",
      method: "GET",
      path: "/api/v1/audit/{transaction_id}",
      title: "Fetch Audit Trail",
      description: "Retrieve the immutable step-by-step execution timeline for a transaction.",
      req: `curl -X GET "https://api.risksentinel.io/v1/audit/tx_req_8923a" \\
  -H "Authorization: Bearer sk_test_..."`,
      res: `{
  "transaction_id": "tx_req_8923a",
  "events": [
    {
      "event_id": "evt_9981",
      "service": "ML Engine",
      "event_type": "ML_SCORE_CREATED",
      "latency": 45.2,
      "timestamp": "2026-08-28T14:22:00.123Z"
    }
  ]
}`
    }
  ];

  const WEBHOOKS = [
    { name: "transaction.allowed", desc: "Fired when a transaction passes all policies and is permitted." },
    { name: "transaction.review", desc: "Fired when a transaction is flagged for manual review." },
    { name: "transaction.blocked", desc: "Fired when a transaction is outright blocked by a policy." },
    { name: "investigation.created", desc: "Fired when the AI Investigator opens a new case file." },
    { name: "cluster.detected", desc: "Fired when the Graph Engine detects a new fraudulent collusion ring." },
  ];

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col">
      <PageHeader 
        title="Developer APIs" 
        description="Integrate Sentinel X intelligence directly into your payment flows and back-office systems." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: API Configuration & Webhooks */}
        <div className="lg:col-span-1 space-y-8">
          
          <Card className="p-6 premium-shadow">
            <h2 className="text-caption font-semibold text-text-muted uppercase flex items-center gap-2 mb-5">
              <Terminal className="w-4 h-4 text-primary" /> 
              Environment
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-caption text-text-secondary font-semibold uppercase mb-2 block">Base URL</label>
                <div className="flex items-center bg-surface-secondary border border-border rounded-xl px-4 py-3 shadow-sm">
                  <code className="text-label-sm text-text-primary text-mono-sm text-mono-sm font-mono flex-1">
                    https://api.risksentinel.io/v1
                  </code>
                  <button 
                    onClick={() => copyToClipboard("https://api.risksentinel.io/v1", "base_url")}
                    className="text-text-muted hover:text-primary transition-colors ml-3 bg-surface p-1.5 rounded border border-border shadow-sm"
                  >
                    {copiedKey === "base_url" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-caption text-text-secondary font-semibold uppercase mb-2 block">Test API Key</label>
                <div className="flex items-center bg-surface-secondary border border-border rounded-xl px-4 py-3 shadow-sm">
                  <code className="text-label-sm text-text-primary text-mono-sm text-mono-sm font-mono flex-1">
                    sk_test_rsx_99a...
                  </code>
                  <button 
                    onClick={() => copyToClipboard("sk_test_rsx_99a8b7c6d5e4f3g2h1", "api_key")}
                    className="text-text-muted hover:text-primary transition-colors ml-3 bg-surface p-1.5 rounded border border-border shadow-sm"
                  >
                    {copiedKey === "api_key" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-label-sm font-semibold text-text-primary">API Status: Operational</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 premium-shadow">
            <h2 className="text-caption font-semibold text-text-muted uppercase flex items-center gap-2 mb-4">
              <Webhook className="w-4 h-4 text-primary" /> 
              Webhook Events
            </h2>
            <p className="text-label-sm text-text-secondary mb-5 leading-relaxed">
              Configure webhooks to receive real-time updates when asynchronous fraud analysis completes.
            </p>
            <div className="space-y-3">
              {WEBHOOKS.map(wh => (
                <div key={wh.name} className="p-4 bg-surface-secondary rounded-xl border border-border hover:border-primary/30 transition-colors shadow-sm">
                  <div className="text-mono-sm text-mono-sm font-mono text-label-sm font-semibold text-primary mb-1">{wh.name}</div>
                  <div className="text-caption text-text-secondary leading-relaxed">{wh.desc}</div>
                </div>
              ))}
            </div>
          </Card>
          
        </div>

        {/* Right Column: API Reference */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 overflow-hidden premium-shadow border border-border">
            <div className="px-6 py-5 border-b border-border bg-surface-secondary flex items-center gap-3">
              <div className="p-2 bg-surface rounded-lg border border-border shadow-sm">
                <FileJson className="w-5 h-5 text-text-primary" />
              </div>
              <h2 className="text-body-lg font-semibold text-text-primary ">API Reference</h2>
            </div>
            
            <div className="divide-y divide-border bg-surface">
              {API_ENDPOINTS.map((endpoint) => (
                <div key={endpoint.id} className="p-6 hover:bg-surface-secondary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded text-caption font-semibold uppercase ${endpoint.method === 'POST' ? 'bg-success-soft text-success border border-success/20' : 'bg-info-soft text-info border border-info/20'}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-label-sm font-semibold text-text-primary text-mono-sm text-mono-sm font-mono">{endpoint.path}</code>
                  </div>
                  <h3 className="text-heading-md font-semibold text-text-primary mb-2">{endpoint.title}</h3>
                  <p className="text-label-sm text-text-secondary mb-6 leading-relaxed max-w-2xl">{endpoint.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-caption font-semibold text-text-muted uppercase mb-2 flex justify-between items-center bg-surface-secondary px-3 py-2 rounded-t-lg border border-border border-b-0">
                        Request
                        <button 
                          onClick={() => copyToClipboard(endpoint.req, `req_${endpoint.id}`)}
                          className="text-text-muted hover:text-primary transition-colors"
                        >
                          {copiedKey === `req_${endpoint.id}` ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="bg-[#1e2336] rounded-b-lg rounded-t-none p-4 overflow-x-auto border border-[#3e455e] h-[200px] shadow-inner">
                        <pre className="text-caption text-[#a8c7fa] text-mono-sm text-mono-sm font-mono whitespace-pre-wrap leading-relaxed">
                          {endpoint.req}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-caption font-semibold text-text-muted uppercase mb-2 flex justify-between items-center bg-surface-secondary px-3 py-2 rounded-t-lg border border-border border-b-0">
                        Response
                        <button 
                          onClick={() => copyToClipboard(endpoint.res, `res_${endpoint.id}`)}
                          className="text-text-muted hover:text-primary transition-colors"
                        >
                          {copiedKey === `res_${endpoint.id}` ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="bg-[#1e2336] rounded-b-lg rounded-t-none p-4 overflow-x-auto border border-[#3e455e] h-[200px] shadow-inner">
                        <pre className="text-caption text-[#b8f5ed] text-mono-sm text-mono-sm font-mono whitespace-pre-wrap leading-relaxed">
                          {endpoint.res}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
