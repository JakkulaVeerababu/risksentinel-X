"use client";

import React, { useState, useEffect } from "react";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { modelsService, ModelPerformanceData } from "../../services/models";
import { 
  CheckCircle2, 
  BrainCircuit, 
  Database, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  FileSearch,
  Activity,
  Layers
} from "lucide-react";
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
        <PageHeader title="Model Evaluation" description="Analyze fraud detection performance using held-out test data." />
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
          title="Model Evaluation" 
          description="Analyze fraud detection performance on held-out test data." 
        />
        <div className="flex items-center gap-3 bg-white border border-border px-4 py-2 rounded-lg shadow-subtle">
          <label className="text-label-sm font-medium text-text-secondary">Decision Threshold:</label>
          <input 
            type="range" 
            min="0.1" max="0.9" step="0.1" 
            value={threshold} 
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-32 accent-primary"
          />
          <span className="text-label-sm font-semibold text-primary tabular-nums">{threshold.toFixed(2)}</span>
        </div>
      </div>

      {/* Model Info Header */}
      <div className="bg-white border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-primary-soft rounded-lg">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-body-lg font-semibold text-text-primary flex items-center gap-2">
              {model_info.model_name}
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-caption text-mono-sm text-mono-sm font-mono">{model_info.model_version}</span>
            </h2>
            <div className="flex items-center gap-4 mt-2 text-label-sm text-text-secondary">
              <span className="flex items-center gap-1.5"><Database className="w-4 h-4" /> {model_info.test_samples.toLocaleString()} Test Samples</span>
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> {model_info.feature_count} Features</span>
              {model_info.training_date && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(model_info.training_date).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-success-soft text-success border border-blue-200 rounded-md font-semibold text-label-sm">
          <CheckCircle2 className="w-4 h-4" />
          ACTIVE & SERVING
        </div>
      </div>

      {/* Grid: Confusion Matrix & Core Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ML Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-subtle h-full">
            <h3 className="text-caption font-semibold text-text-muted uppercase mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Machine Learning Metrics
            </h3>
            
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
                  <span className="text-text-secondary font-medium">Synthetic Graph F1</span>
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
            <h3 className="text-caption font-semibold text-text-muted uppercase mb-4">Confusion Matrix (At Threshold {threshold.toFixed(2)})</h3>
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
            <h3 className="text-caption font-semibold text-text-muted uppercase mb-2">Business Impact Metrics</h3>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center gap-2 text-label-sm text-text-secondary"><ShieldCheck className="w-4 h-4 text-success" /> Fraud Prevented</div>
              <div className="font-semibold text-success tabular-nums">{formatCurrency(metrics.fraud_value_prevented)}</div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center gap-2 text-label-sm text-text-secondary"><AlertTriangle className="w-4 h-4 text-danger" /> Fraud Missed</div>
              <div className="font-semibold text-danger tabular-nums">{formatCurrency(metrics.fraud_value_missed)}</div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center gap-2 text-label-sm text-text-secondary"><FileSearch className="w-4 h-4 text-warning" /> False Positive Cost</div>
              <div className="font-semibold text-warning tabular-nums">{formatCurrency(metrics.false_positive_cost)}</div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-label-sm font-semibold text-text-primary">Net Protected Value</div>
              <div className="font-semibold text-body-lg text-primary tabular-nums">{formatCurrency(metrics.net_protected_value)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Precision-Recall Curve */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-subtle">
          <h3 className="text-label-sm font-semibold text-text-primary mb-6">Precision-Recall Curve</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart_data.pr_curve}>
                <defs>
                  <linearGradient id="colorPr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="recall" type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', fontSize: '12px' }}
                  formatter={(val: any) => [Number(val).toFixed(3), '']}
                  labelFormatter={(label) => `Recall: ${Number(label).toFixed(3)}`}
                />
                <Area type="monotone" dataKey="precision" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorPr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Score Distribution */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-subtle">
          <h3 className="text-label-sm font-semibold text-text-primary mb-6">Risk Score Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart_data.risk_score_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="bin" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', fontSize: '12px' }}
                  cursor={{ fill: 'var(--surface-secondary)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="legit" name="Legitimate" fill="var(--success)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                <Bar dataKey="fraud" name="Fraudulent" fill="var(--danger)" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-subtle">
          <h3 className="text-label-sm font-semibold text-text-primary mb-6">Feature Importance (Top 15)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart_data.feature_importance} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-subtle)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', fontSize: '12px' }}
                  cursor={{ fill: 'var(--surface-secondary)' }}
                />
                <Bar dataKey="importance" name="Importance Score" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threshold vs FPR */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-subtle">
          <h3 className="text-label-sm font-semibold text-text-primary mb-6">Threshold vs False Positive Rate</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart_data.threshold_vs_fpr}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="threshold" type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', fontSize: '12px' }}
                  formatter={(val: any) => [(Number(val) * 100).toFixed(2) + "%", 'FPR']}
                  labelFormatter={(label) => `Threshold: ${label}`}
                />
                <Line type="monotone" dataKey="fpr" name="False Positive Rate" stroke="var(--warning)" strokeWidth={2} dot={{ r: 4, fill: "var(--warning)", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
