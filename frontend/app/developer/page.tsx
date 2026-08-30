"use client";

import React, { useState } from "react";
import { PageHeader, Card, Badge } from "../../components/ui";
import { Copy, Check } from "lucide-react";

export default function DeveloperPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const API_ENDPOINTS = [
    {
      id: "health",
      method: "GET",
      path: "/api/v1/health",
      title: "API Health Check",
      description: "Check the status of the local backend and database connection.",
      req: `curl -X GET "http://localhost:8000/api/v1/health"`,
      res: `{
  "status": "healthy",
  "service": "RiskSentinel X",
  "version": "0.1.0",
  "database": "healthy"
}`
    },
    {
      id: "score",
      method: "POST",
      path: "/api/v1/score",
      title: "Evaluate Transaction Risk",
      description: "Directly score a transaction payload against the IEEE-CIS baseline model without executing the full orchestration pipeline.",
      req: `curl -X POST "http://localhost:8000/api/v1/score" \\
  -H "Content-Type: application/json" \\
  -d '{
    "TransactionID": "tx_req_8923a",
    "TransactionDT": 1000000,
    "TransactionAmt": 15000.50,
    "ProductCD": "W"
  }'`,
      res: `{
  "transaction_id": "tx_req_8923a",
  "risk_score": 0.5459,
  "model_version": "xgb-ieeecis-v1"
}`
    },
    {
      id: "process",
      method: "POST",
      path: "/api/v1/transactions/process",
      title: "Canonical Transaction Processing",
      description: "Synchronously execute a transaction through the complete Sentinel pipeline (ML, Graph, AI, Policy).",
      req: `curl -X POST "http://localhost:8000/api/v1/transactions/process" \\
  -H "Content-Type: application/json" \\
  -d '{
    "TransactionID": "tx_req_8923a",
    "TransactionDT": 1000000,
    "TransactionAmt": 15000.50,
    "ProductCD": "C",
    "customer_id": "cust_123",
    "entity_id": "ent_456"
  }'`,
      res: `{
  "transaction_id": "tx_dev_65c48555",
  "status": "DECIDED",
  "ml": {
    "score": 0.5255,
    "model_version": "xgb-ieeecis-v1"
  },
  "graph": {
    "score": null,
    "community_id": null,
    "signals": {}
  },
  "agent": {
    "state": "SKIPPED",
    "recommendation": "ALLOW",
    "confidence": 1.0
  },
  "policy": {
    "decision": "REVIEW",
    "policy_version": "policy-v1",
    "matched_rules": [
      "GRAPH_EVIDENCE_UNAVAILABLE"
    ]
  }
}`
    },
    {
      id: "graph",
      method: "GET",
      path: "/api/v1/graph/context/{entity_id}",
      title: "Query Graph Context",
      description: "Retrieve the interconnected entities and risk signals for a specific entity ID.",
      req: `curl -X GET "http://localhost:8000/api/v1/graph/context/ent_456"`,
      res: `{
  "detail": "Entity 'ent_456' not found."
}`
    },
    {
      id: "audit",
      method: "GET",
      path: "/api/v1/audit/{transaction_id}",
      title: "Fetch Audit Trail",
      description: "Retrieve the immutable step-by-step execution timeline for a processed transaction.",
      req: `curl -X GET "http://localhost:8000/api/v1/audit/tx_req_8923a"`,
      res: `{
  "transaction_id": "tx_req_8923a",
  "events": [
    {
      "event_id": "dabbd102-ed52-48f8-a86a-b663ab2e1207",
      "timestamp": "2026-08-29T15:45:27.127518",
      "actor": "SYSTEM",
      "service": "RiskOrchestrator",
      "event_type": "TRANSACTION_RECEIVED",
      "status": "SUCCESS"
    }
  ]
}`
    }
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
            <h2 className="rsx-rule-heading mb-5">Environment</h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-caption text-text-secondary font-semibold uppercase mb-2 block">Local demo API</label>
                <div className="flex items-center bg-surface-secondary border border-border rounded-xl px-4 py-3 shadow-sm">
                  <code className="text-label-sm text-text-primary text-mono-sm font-mono flex-1">
                    http://localhost:8000/api/v1
                  </code>
                  <button 
                    onClick={() => copyToClipboard("http://localhost:8000/api/v1", "base_url")}
                    className="text-text-muted hover:text-primary transition-colors ml-3 bg-surface p-1.5 rounded border border-border shadow-sm"
                  >
                    {copiedKey === "base_url" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-caption text-text-secondary font-semibold uppercase mb-2 block">Authentication</label>
                <div className="flex items-center bg-surface-secondary border border-border rounded-xl px-4 py-3 shadow-sm">
                  <span className="text-label-sm text-text-muted flex-1">Not enabled in the local hackathon demo</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(49,94,251,0.5)]"></div>
                  <span className="text-label-sm font-semibold text-text-primary">Local backend connected</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 premium-shadow">
            <h2 className="rsx-rule-heading mb-4">Webhook events</h2>
            <p className="text-label-sm text-text-secondary leading-relaxed">
              Webhook integrations are outside the current MVP.
            </p>
          </Card>
          
        </div>

        {/* Right Column: API Reference */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 overflow-hidden premium-shadow border border-border">
            <div className="border-b border-border bg-surface-secondary px-6 py-5">
              <h2 className="rsx-rule-heading">API reference</h2>
            </div>
            
            <div className="divide-y divide-border bg-surface">
              {API_ENDPOINTS.map((endpoint) => (
                <div key={endpoint.id} className="p-6 hover:bg-surface-secondary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded text-caption font-semibold uppercase ${endpoint.method === 'POST' ? 'bg-success-soft text-success border border-success/20' : 'bg-info-soft text-info border border-info/20'}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-label-sm font-semibold text-text-primary text-mono-sm font-mono">{endpoint.path}</code>
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
                        <pre className="text-caption text-[#a8c7fa] text-mono-sm font-mono whitespace-pre-wrap leading-relaxed">
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
                        <pre className="text-caption text-[#b8f5ed] text-mono-sm font-mono whitespace-pre-wrap leading-relaxed">
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
