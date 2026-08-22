export type DecisionType = "ALLOW" | "REVIEW" | "BLOCK";

export interface TransactionSummary {
  transaction_id: string;
  amount: number;
  ml_risk: number;
  graph_risk: number;
  decision: DecisionType | "PENDING";
  timestamp: string;
  is_synthetic?: boolean;
}

export interface ToolCall {
  tool: string;
  status: "success" | "error";
  duration_ms?: number;
}

export interface EvidenceItem {
  signal: string;
  observed: string;
  source: string;
}

export interface RiskCase {
  transaction: {
    id: string;
    amount: number;
    customer_id: string;
    timestamp: string;
  };
  ml: {
    risk_score: number;
    version: string;
  };
  graph: {
    risk_score: number;
    cluster_detected: boolean;
    shared_devices?: number;
    connected_customers?: number;
  };
  agent: {
    status: "COMPLETED" | "DEGRADED" | "FAILED_VALIDATION";
    tool_calls: ToolCall[];
    recommendation: DecisionType;
    confidence: number;
    reason_codes: string[];
    evidence: EvidenceItem[];
  };
  policy: {
    decision: DecisionType;
    reason: string;
    version: string;
    triggered_rules: string[];
    trace: Record<string, boolean>;
  };
}

export interface RealtimeEvent {
  event: "transaction_received" | "ml_scored" | "graph_completed" | "investigation_completed" | "policy_decision";
  id: string;
  data: any;
}
