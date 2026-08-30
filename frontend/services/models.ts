const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend";

export interface ModelPerformanceData {
  metrics: {
    total_attempted_fraud_value: number;
    fraud_value_prevented: number;
    fraud_value_missed: number;
    legit_value_blocked: number;
    false_positive_cost: number;
    net_protected_value: number;
    precision: number;
    recall: number;
    f1: number;
    pr_auc: number;
    tp_count: number;
    fp_count: number;
    tn_count: number;
    fn_count: number;
    threshold_used: number;
  };
  graph_metrics: {
    precision: number;
    recall: number;
    f1: number;
    threshold_used: number;
  };
  model_info: {
    model_name: string;
    model_version: string;
    training_samples: number;
    validation_samples: number;
    test_samples: number;
    feature_count: number;
    training_date: string | null;
  };
  chart_data: {
    pr_curve: Array<{ recall: number; precision: number; threshold: number }>;
    risk_score_distribution: Array<{ bin: string; fraud: number; legit: number }>;
    threshold_vs_fpr: Array<{ threshold: number; fpr: number }>;
    fraud_over_time: Array<{ time: string; fraud_count: number }>;
    feature_importance: Array<{ feature: string; importance: number }>;
  };
}



function isModelPerformanceData(value: unknown): value is ModelPerformanceData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ModelPerformanceData>;
  return Boolean(candidate.metrics && candidate.model_info?.model_name && candidate.graph_metrics);
}

export const modelsService = {
  getPerformance: async (threshold = 0.5): Promise<ModelPerformanceData> => {
    try {
      const response = await fetch(`${API_URL}/evaluation/model-performance?threshold=${threshold}`, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) throw new Error(`Model endpoint returned ${response.status}`);
      const payload: unknown = await response.json();
      if (!isModelPerformanceData(payload)) throw new Error("Model endpoint returned an incomplete payload");
      return payload;
    } catch (error) {
      console.warn("Evaluation API failed, throwing error to surface empty state:", error);
      throw error;
    }
  },
};
