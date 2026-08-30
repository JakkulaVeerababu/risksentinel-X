"use client";

import React, { useState, useEffect } from "react";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { modelsService, ModelPerformanceData } from "../../services/models";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Area, AreaChart
} from "recharts";

export default function ModelsPage() {
  const [data, setData] = useState<ModelPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [threshold, setThreshold] = useState<number>(0.5);

  useEffect(() => {
    loadData(threshold);
  }, [threshold]);

  async function loadData(thresh: number) {
    setLoading(true);
    try {
      const perfData = await modelsService.getPerformance(thresh);
      setData(perfData);
      setError(false);
    } catch (err) {
      console.error("Failed to fetch model performance:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Model Evaluation" description="Analyze fraud detection performance using held-out test data." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error || !data || !data.model_info || !data.metrics || !data.chart_data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Model Evaluation (Demo)" description="Analyze fraud detection performance using held-out test data (seeded demo data)." />
        <ErrorState title="Evaluation Data Unavailable" description="The ML performance metrics could not be fetched. Ensure the backend is running and data is generated." />
      </div>
    );
  }

  const { metrics, model_info, chart_data } = data;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const formatPercent = (val: number) => (val * 100).toFixed(1) + "%";

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <PageHeader 
          title="Model Evaluation (Demo)" 
          description="Analyze fraud detection performance on held-out test data (seeded demo data)." 
        />
        <div className="flex items-center gap-3 bg-white border border-border px-4 py-2 rounded-lg shadow-subtle">
          <label className="text-label-sm font-medium text-text-secondary">Frozen evaluation threshold:</label>
          <span className="text-label-sm font-semibold text-primary tabular-nums">0.80</span>
        </div>
      </div>

      {/* Model Info Header */}
      <div className="bg-white border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 border-l-2 border-[#245df5] pl-4">
          <div>
            <h2 className="text-body-lg font-semibold text-text-primary flex items-center gap-2">
              {model_info.model_name}
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-caption text-mono-sm text-mono-sm font-mono">{model_info.model_version}</span>
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-label-sm text-text-secondary">
              <span>{model_info.test_samples.toLocaleString()} IEEE-CIS held-out samples</span>
              <span>{model_info.feature_count} features</span>
              {model_info.training_date && <span>Trained {new Date(model_info.training_date).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
        <div className="relative z-10 border-l-2 border-[#245df5] pl-3 text-[11px] font-semibold uppercase tracking-[.08em] text-[#245df5]">Active &amp; serving</div>
      </div>

      {/* Grid: Confusion Matrix & Core Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ML Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-subtle h-full">
            <h3 className="rsx-rule-heading mb-6">Machine learning metrics</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span className="text-text-secondary font-medium">Precision (Fraud Accuracy)</span>
                  <span className="font-semibold tabular-nums">{formatPercent(metrics.precision)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${metrics.precision * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span className="text-text-secondary font-medium">Recall (Fraud Detection Rate)</span>
                  <span className="font-semibold tabular-nums">{formatPercent(metrics.recall)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${metrics.recall * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span className="text-text-secondary font-medium">IEEE-CIS Held-out F1</span>
                  <span className="font-semibold tabular-nums">{metrics.f1.toFixed(4)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${metrics.f1 * 100}%` }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-label-sm font-medium text-text-secondary">IEEE-CIS AP</span>
                  <span className="text-body-lg font-semibold text-text-primary tabular-nums">{metrics.pr_auc.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confusion Matrix & Business Impact */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-subtle flex flex-col justify-between">
            <h3 className="text-caption font-semibold text-text-muted uppercase mb-4">Confusion Matrix (At Threshold 0.80)</h3>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-success-soft border border-blue-200 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-caption text-success font-medium mb-1">True Positive</span>
                <span className="text-heading-md font-semibold text-blue-800 tabular-nums">{metrics.tp_count.toLocaleString()}</span>
              </div>
              <div className="bg-danger-soft border border-red-200 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-caption text-danger font-medium mb-1">False Positive</span>
                <span className="text-heading-md font-semibold text-red-800 tabular-nums">{metrics.fp_count.toLocaleString()}</span>
              </div>
              <div className="bg-info-soft border border-blue-200 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-caption text-info font-medium mb-1">False Negative</span>
                <span className="text-heading-md font-semibold text-blue-800 tabular-nums">{metrics.fn_count.toLocaleString()}</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-caption text-gray-500 font-medium mb-1">True Negative</span>
                <span className="text-heading-md font-semibold text-gray-800 tabular-nums">{metrics.tn_count.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-subtle space-y-4">
            <h3 className="text-caption font-semibold text-text-muted uppercase mb-2">Illustrative Cost Simulation</h3>
            <p className="text-[11px] text-text-muted mb-4">Illustrative assumptions only; not Razorpay economics.</p>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="text-label-sm text-text-secondary">False positive unit cost</div>
              <div className="font-semibold text-success tabular-nums">₹150</div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="text-label-sm text-text-secondary">False negative unit cost</div>
              <div className="font-semibold text-danger tabular-nums">₹2,000</div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="text-label-sm text-text-secondary">Total false positive cost</div>
              <div className="font-semibold text-warning tabular-nums">{formatCurrency(metrics.fp_count * 150)}</div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-label-sm font-semibold text-text-primary">Simulated Review Cost</div>
              <div className="font-semibold text-body-lg text-primary tabular-nums">{formatCurrency((metrics.fp_count * 150) + (metrics.fn_count * 2000))}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Synthetic Seeded Graph Benchmark */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-subtle lg:col-span-2 mt-2">
          <h3 className="rsx-rule-heading mb-6">Synthetic seeded graph benchmark</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-label-sm mb-1">
                <span className="text-text-secondary font-medium">Graph Precision</span>
                <span className="font-semibold tabular-nums">{formatPercent(data.graph_metrics.precision)}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${data.graph_metrics.precision * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-sm mb-1">
                <span className="text-text-secondary font-medium">Graph Recall</span>
                <span className="font-semibold tabular-nums">{formatPercent(data.graph_metrics.recall)}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${data.graph_metrics.recall * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-label-sm mb-1">
                <span className="text-text-secondary font-medium">Graph F1</span>
                <span className="font-semibold tabular-nums">{data.graph_metrics.f1.toFixed(4)}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${data.graph_metrics.f1 * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State for Charts */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-subtle lg:col-span-2">
          <div className="flex h-48 flex-col items-center justify-center space-y-3 text-center">
            <p className="rsx-section-label">Curve data unavailable</p>
            <p className="max-w-md text-[13px] text-text-secondary">Detailed curve data is not included in the deployed demo artifact.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
