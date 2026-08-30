const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend";

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  actor: string;
  service: string;
  event_type: string;
  resource_id: string;
  input_summary: Record<string, any>;
  output_summary: Record<string, any>;
  model_version?: string;
  policy_version?: string;
  latency?: number;
  status: string;
}

export const auditService = {
  getEvents: async (params?: { 
    transaction_id?: string;
    decision?: string;
    reason_code?: string;
    is_synthetic?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<AuditEvent[]> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_URL}/audit/?${searchParams.toString()}`);
    return await response.json();
  },
  
  getTimeline: async (transaction_id: string): Promise<{ transaction_id: string, events: AuditEvent[] }> => {
    const response = await fetch(`${API_URL}/audit/${transaction_id}`);
    return await response.json();
  }
};
