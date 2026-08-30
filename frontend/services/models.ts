const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

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

const FALLBACK_MODEL_DATA: ModelPerformanceData = {
  metrics: {
    total_attempted_fraud_value: 0,
    fraud_value_prevented: 0,
    fraud_value_missed: 0,
    legit_value_blocked: 0,
    false_positive_cost: 0,
    net_protected_value: 0,
    precision: 0.4535,
    recall: 0.4635,
    f1: 0.4585,
    pr_auc: 0.4810,
    tp_count: 1429,
    fp_count: 1722,
    tn_count: 83776,
    fn_count: 1654,
    threshold_used: 0.80,
  },
  graph_metrics: {
    precision: 0.9040,
    recall: 0.9912,
    f1: 0.9456,
    threshold_used: 0.30,
  },
  model_info: {
    model_name: "FraudXGBoost",
    model_version: "v1.2.4",
    training_samples: 0,
    validation_samples: 0,
    test_samples: 88581,
    feature_count: 42,
    training_date: "2026-08-28T12:00:00Z",
  },
  chart_data: {
    pr_curve: [],
    risk_score_distribution: [],
    threshold_vs_fpr: [],
    fraud_over_time: [],
    feature_importance: [],
  },
};

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
