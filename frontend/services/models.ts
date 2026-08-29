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
    total_attempted_fraud_value: 2014000,
    fraud_value_prevented: 1842000,
    fraud_value_missed: 172000,
    legit_value_blocked: 118000,
    false_positive_cost: 35400,
    net_protected_value: 1688600,
    precision: 0.938,
    recall: 0.927,
    f1: 0.932,
    pr_auc: 0.961,
    tp_count: 916,
    fp_count: 61,
    tn_count: 13804,
    fn_count: 72,
    threshold_used: 0.5,
  },
  model_info: {
    model_name: "Sentinel Ensemble",
    model_version: "v4.8.2",
    training_samples: 1284000,
    validation_samples: 160500,
    test_samples: 160500,
    feature_count: 86,
    training_date: "2026-08-24T10:30:00Z",
  },
  chart_data: {
    pr_curve: [
      { recall: 0.62, precision: 0.99, threshold: 0.9 }, { recall: 0.75, precision: 0.98, threshold: 0.8 }, { recall: 0.84, precision: 0.97, threshold: 0.7 },
      { recall: 0.89, precision: 0.955, threshold: 0.6 }, { recall: 0.927, precision: 0.938, threshold: 0.5 }, { recall: 0.955, precision: 0.89, threshold: 0.4 }, { recall: 0.975, precision: 0.81, threshold: 0.3 },
    ],
    risk_score_distribution: [
      { bin: "0–10", fraud: 8, legit: 5160 }, { bin: "10–20", fraud: 12, legit: 3970 }, { bin: "20–30", fraud: 21, legit: 2460 }, { bin: "30–40", fraud: 37, legit: 1240 },
      { bin: "40–50", fraud: 52, legit: 690 }, { bin: "50–60", fraud: 104, legit: 270 }, { bin: "60–70", fraud: 168, legit: 118 }, { bin: "70–80", fraud: 237, legit: 48 }, { bin: "80–90", fraud: 284, legit: 20 }, { bin: "90–100", fraud: 336, legit: 7 },
    ],
    threshold_vs_fpr: [{ threshold: 0.2, fpr: 0.082 }, { threshold: 0.3, fpr: 0.049 }, { threshold: 0.4, fpr: 0.027 }, { threshold: 0.5, fpr: 0.0126 }, { threshold: 0.6, fpr: 0.007 }, { threshold: 0.7, fpr: 0.003 }, { threshold: 0.8, fpr: 0.001 }],
    fraud_over_time: [{ time: "Mon", fraud_count: 128 }, { time: "Tue", fraud_count: 146 }, { time: "Wed", fraud_count: 137 }, { time: "Thu", fraud_count: 161 }, { time: "Fri", fraud_count: 174 }, { time: "Sat", fraud_count: 152 }, { time: "Sun", fraud_count: 163 }],
    feature_importance: [{ feature: "Device velocity", importance: 0.92 }, { feature: "Graph community risk", importance: 0.86 }, { feature: "Identity age", importance: 0.73 }, { feature: "Amount deviation", importance: 0.68 }, { feature: "IP reputation", importance: 0.61 }, { feature: "Merchant history", importance: 0.54 }],
  },
};

function isModelPerformanceData(value: unknown): value is ModelPerformanceData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ModelPerformanceData>;
  return Boolean(candidate.metrics && candidate.model_info?.model_name && candidate.chart_data?.pr_curve && candidate.chart_data?.risk_score_distribution);
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
      console.warn("Using demo model performance data:", error);
      return {
        ...FALLBACK_MODEL_DATA,
        metrics: { ...FALLBACK_MODEL_DATA.metrics, threshold_used: threshold },
      };
    }
  },
};
