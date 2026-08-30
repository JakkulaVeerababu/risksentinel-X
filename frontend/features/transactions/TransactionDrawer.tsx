import React from "react";
import { Drawer } from "../../components/ui/Drawer";

import { DecisionBadge, RiskBadge } from "../../components/ui";
import { ArrowUpRight, Copy, ShieldAlert, Cpu, Network, Clock, CheckCircle2 } from "lucide-react";

interface TransactionDrawerProps {
  transaction: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDrawer({ transaction, isOpen, onClose }: TransactionDrawerProps) {
  if (!transaction) return null;

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Transaction Details`}
      width="w-full sm:w-[520px]"
    >
      <div className="space-y-4">
        
        {/* Header / ID */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-label-sm">
            <span className="text-text-muted">ID</span>
            <span className="text-mono-sm text-mono-sm font-mono font-semibold text-text-primary bg-surface-secondary px-2 py-0.5 rounded">{transaction.transaction_id}</span>
            <button className="text-text-muted hover:text-text-primary transition-colors"><Copy className="w-3.5 h-3.5" /></button>
          </div>
          <a href="#" className="text-caption font-semibold text-primary flex items-center gap-1 hover:underline">
            View in Stripe <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Final Decision Section */}
        <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-text-secondary" />
              <h3 className="text-caption font-semibold text-text-secondary uppercase ">Final Decision</h3>
            </div>
            <DecisionBadge decision={transaction.policy_decision || "UNKNOWN"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-caption font-semibold text-text-muted uppercase mb-1">Amount</p>
              <p className="font-semibold text-heading-lg text-text-primary tabular-nums">₹{(transaction.amount * 82).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-caption font-semibold text-text-muted uppercase mb-1">Date & Time</p>
              <p className="font-medium text-label-sm text-text-primary tabular-nums mt-1">{new Date(transaction.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Transaction Summary */}
        <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle">
          <h3 className="text-body-sm font-semibold text-text-primary mb-4 border-b border-border pb-2">Context</h3>
          <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-body-sm">
            <div>
              <p className="text-text-muted text-caption font-semibold uppercase mb-1">Customer</p>
              <p className="font-semibold text-text-primary">{transaction.customer_id}</p>
              <p className="text-caption text-text-secondary mt-0.5">Account age: {transaction.customer_age_days} days</p>
            </div>
            <div>
              <p className="text-text-muted text-caption font-semibold uppercase mb-1">Merchant</p>
              <p className="font-semibold text-text-primary">{transaction.merchant_name}</p>
              <p className="text-caption text-text-secondary text-mono-sm text-mono-sm font-mono mt-0.5">{transaction.merchant_id}</p>
            </div>
            <div>
              <p className="text-text-muted text-caption font-semibold uppercase mb-1">Payment Method</p>
              <p className="font-semibold text-text-primary">{transaction.payment_method}</p>
            </div>
            <div>
              <p className="text-text-muted text-caption font-semibold uppercase mb-1">Location & IP</p>
              <p className="font-semibold text-text-primary">{transaction.city}, {transaction.country}</p>
              <p className="text-caption text-mono-sm text-mono-sm font-mono text-text-secondary mt-0.5">{transaction.ip_address}</p>
            </div>
            <div className="col-span-2">
              <p className="text-text-muted text-caption font-semibold uppercase mb-1">Device ID</p>
              <p className="text-mono-sm text-mono-sm font-mono text-label-sm bg-surface-secondary px-2 py-1 rounded border border-border inline-block text-text-primary">{transaction.device_id}</p>
            </div>
          </div>
        </section>

        {/* Intelligence Models */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
            <h3 className="text-label-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> ML Model
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-label-sm text-text-secondary">Risk Score</span>
              <span className="font-semibold text-body-sm tabular-nums">
                {transaction.ml_risk_score !== undefined ? (transaction.ml_risk_score * 100).toFixed(0) + " / 100" : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-sm text-text-secondary">Deviation</span>
              <span className="font-medium text-label-sm text-mono-sm text-mono-sm font-mono bg-surface-secondary px-1.5 py-0.5 rounded border border-border">
                {transaction.amount_deviation?.toFixed(2)}x
              </span>
            </div>
            {transaction.ml_risk_score !== undefined && (
              <RiskBadge level={transaction.ml_risk_score > 0.7 ? "HIGH" : transaction.ml_risk_score > 0.4 ? "MEDIUM" : "LOW"} />
            )}
          </div>
          
          <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
            <h3 className="text-label-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" /> Graph Engine
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-label-sm text-text-secondary">Risk Score</span>
              <span className="font-semibold text-body-sm tabular-nums">
                {transaction.graph_risk_score !== undefined ? (transaction.graph_risk_score * 100).toFixed(0) + " / 100" : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-sm text-text-secondary">Cluster ID</span>
              <span className="font-medium text-label-sm text-mono-sm text-mono-sm font-mono bg-surface-secondary px-1.5 py-0.5 rounded border border-border">
                {transaction.graph_cluster_id || "None"}
              </span>
            </div>
            {transaction.graph_risk_score !== undefined && (
              <RiskBadge level={transaction.graph_risk_score > 0.7 ? "HIGH" : transaction.graph_risk_score > 0.4 ? "MEDIUM" : "LOW"} />
            )}
          </div>
        </section>

        {/* Agent Investigation */}
        <section className="bg-ai-surface border border-ai-border rounded-xl p-5 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-body-sm font-semibold text-ai-text-primary mb-4 flex items-center gap-2">
              <span className="text-primary font-semibold">✧</span> Agent Investigation
            </h3>
            
            <div className="bg-ai-background border border-ai-border rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-caption font-semibold text-ai-text-secondary uppercase">Recommendation</span>
                <span className={`text-label-sm font-semibold ${transaction.ai_recommendation === 'BLOCK' ? 'text-danger' : transaction.ai_recommendation === 'REVIEW' ? 'text-warning' : 'text-success'}`}>
                  {transaction.ai_recommendation || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-ai-border">
                <span className="text-caption font-semibold text-ai-text-secondary uppercase">Confidence</span>
                <span className="text-label-sm font-semibold text-ai-text-primary tabular-nums">
                  {transaction.ai_confidence ? (transaction.ai_confidence * 100).toFixed(1) + "%" : "N/A"}
                </span>
              </div>
            </div>

            {transaction.reason_codes && transaction.reason_codes.codes && (
              <div>
                <p className="text-caption font-semibold text-ai-text-secondary mb-2 uppercase">Identified Signals</p>
                <div className="flex flex-wrap gap-2">
                  {transaction.reason_codes.codes.map((code: string) => (
                    <span key={code} className="bg-white/5 border border-white/10 text-caption text-mono-sm text-mono-sm font-mono px-2 py-1 rounded text-ai-text-primary">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Audit History */}
        <section className="bg-surface border border-border rounded-xl p-5 shadow-subtle mb-6">
          <h3 className="text-body-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-secondary" /> Audit Trail
          </h3>
          <div className="text-label-sm text-text-secondary space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-border">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Decision Latency</span>
              <span className="text-mono-sm text-mono-sm font-mono font-medium text-text-primary">{transaction.decision_latency_ms}ms</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> ML Model Version</span>
              <span className="text-mono-sm text-mono-sm font-mono font-medium text-text-primary">{transaction.model_version}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Policy Version</span>
              <span className="text-mono-sm text-mono-sm font-mono font-medium text-text-primary">{transaction.policy_version}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Graph Sync Status</span>
              <span className="text-mono-sm text-mono-sm font-mono font-medium text-text-primary">SYNCED</span>
            </div>
          </div>
        </section>

      </div>
    </Drawer>
  );
}
