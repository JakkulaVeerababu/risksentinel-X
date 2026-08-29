const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const FETCH_TIMEOUT_MS = 15000;

export interface Transaction {
  transaction_id: string;
  amount: number;
  ml_risk: number;
  graph_risk: number;
  decision: string;
  timestamp: string;
  customer_id: string;
}

export interface MLRiskResult {
  risk_score: number;
  version: string;
}

export interface GraphRiskResult {
  risk_score: number;
  cluster_detected: boolean;
  shared_devices: number;
  connected_customers: number;
}

export interface AgentInvestigation {
  status: string;
  recommendation: string | null;
  confidence: number | null;
  reason_codes: string[];
  evidence: any[];
}

export interface PolicyDecision {
  decision: string;
  reason: string | null;
  version: string;
  triggered_rules: string[];
}

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  actor: string;
  service: string;
  event_type: string;
  resource_id: string;
  input_summary: any;
  output_summary: any;
  model_version?: string;
  policy_version?: string;
  latency?: number;
  status: string;
}

export interface PipelineResponse {
  transaction: any;
  ml: MLRiskResult;
  graph: GraphRiskResult;
  agent: AgentInvestigation;
  policy: PolicyDecision;
}

export interface DashboardMetrics {
  kpis: {
    transactions_analysed: number;
    allowed: number;
    under_review: number;
    blocked: number;
    fraud_prevented: number;
  };
  critical_action: {
    review_count: number;
    total_exposure: number;
  };
  distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  alert?: any;
  top_signals?: any[];
  chart_data?: any[];
}

export interface Policy {
  policy_id: string;
  name: string;
  priority: number;
  conditions: any;
  action: string;
  reason_code: string;
  enabled: boolean;
  version: string;
  updated_at: string;
}

export interface Investigation {
  transaction_id: string;
  agent_state: string;
  recommendation?: string;
  confidence?: number;
  reason_codes?: string[];
  evidence?: any;
  created_at?: string;
  updated_at?: string;
}

async function apiFetch(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...init, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  const response = await apiFetch("/dashboard/transactions");
  const data = await response.json();
  return data.transactions || [];
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await apiFetch("/dashboard/metrics");
  return await response.json();
}

export async function fetchRiskCase(transactionId: string): Promise<PipelineResponse> {
  const response = await apiFetch(`/dashboard/transactions/${transactionId}/case`);
  return await response.json();
}

export async function startSimulation(scenario_type: string, transaction_count = 5): Promise<any> {
  const mapping: Record<string, string> = {
    "normal_customer": "Normal Customer",
    "high_value_anomaly": "High-Value Anomaly",
    "device_velocity_attack": "Device Velocity Attack",
    "coordinated_fraud_ring": "Coordinated Fraud Ring"
  };
  const backendScenarioType = mapping[scenario_type] || scenario_type;
  const response = await apiFetch("/simulations/run_scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario_type: backendScenarioType, transaction_count })
  });
  return await response.json();
}

export async function fetchPolicies(): Promise<Policy[]> {
  const response = await apiFetch("/policies/");
  const payload = await response.json();
  return Array.isArray(payload) ? payload : (payload.policies || []);
}

export async function createPolicy(policyData: any): Promise<Policy> {
  const response = await apiFetch("/policies/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policyData)
  });
  return await response.json();
}

export async function togglePolicy(policyId: string): Promise<any> {
  const response = await apiFetch(`/policies/${policyId}/toggle`, { method: "PUT" });
  return await response.json();
}

export async function deletePolicy(policyId: string): Promise<any> {
  const response = await apiFetch(`/policies/${policyId}`, { method: "DELETE" });
  return await response.json();
}

export async function fetchInvestigations(): Promise<{investigations: Investigation[]}> {
  const response = await apiFetch("/investigations/");
  const payload = await response.json();
  return payload?.investigations ? payload : { investigations: Array.isArray(payload) ? payload : [] };
}

export async function fetchInvestigation(caseId: string): Promise<Investigation> {
  const response = await apiFetch(`/investigations/${caseId}`);
  return await response.json();
}

export async function updateInvestigationStatus(caseId: string, status: string): Promise<any> {
  const response = await apiFetch(`/investigations/${caseId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return await response.json();
}

export async function updateInvestigationAssignee(caseId: string, assignee: string): Promise<any> {
  const response = await apiFetch(`/investigations/${caseId}/assignee`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignee })
  });
  return await response.json();
}

export async function fetchAuditTimeline(transactionId: string): Promise<{ transaction_id: string, events: AuditEvent[] }> {
  const response = await apiFetch(`/audit/${transactionId}`);
  return await response.json();
}

export async function fetchAuditEvents(params?: URLSearchParams): Promise<AuditEvent[]> {
  const queryString = params ? `?${params.toString()}` : '';
  const response = await apiFetch(`/audit/${queryString}`);
  return await response.json();
}

export async function processTransaction(txData: any): Promise<any> {
  const response = await apiFetch("/transactions/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(txData)
  });
  return await response.json();
}

export async function aiChatStream(messages: any[], onChunk: (chunk: string) => void): Promise<void> {
  const msg = "AI chat is not part of the current MVP";
  onChunk(msg);
  return Promise.resolve();
}
