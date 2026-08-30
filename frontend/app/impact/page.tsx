"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { fetchCostSimulation } from "@/lib/api";

export default function ImpactPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchCostSimulation();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="rsx-page space-y-5">
        <PageHeader eyebrow="Business outcomes" title="Risk impact" description="Translate risk decisions into protected revenue, customer experience, operational effort, and measurable business value." />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rsx-page space-y-5">
        <PageHeader eyebrow="Business outcomes" title="Risk impact" description="Translate risk decisions into protected revenue, customer experience, operational effort, and measurable business value." />
        <ErrorState title="Data Unavailable" description="Failed to load impact metrics." />
      </div>
    );
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="rsx-page space-y-5">
      <div className="rounded-xl border border-[#b96800]/20 bg-[#fff7e8] p-4 text-[#b96800]">
        <h3 className="text-[12px] font-bold uppercase tracking-wider">Illustrative Business Impact Scenario</h3>
        <p className="mt-1 text-[11px]">{data.disclaimer}</p>
      </div>
      <PageHeader eyebrow="Business outcomes" title="Risk impact" description="Translate risk decisions into protected revenue, customer experience, operational effort, and measurable business value." actions={<button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] font-bold text-[#536078] opacity-75 cursor-not-allowed" disabled><Download className="h-4 w-4" /> Preview report</button>} />

      <section className="rsx-blueprint rsx-editorial-grid relative overflow-hidden rounded-[10px] border border-[#d7ded9] text-[#111a2d]">
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#315efb]">Simulated Operational Cost</p>
            <p className="mt-3 text-[40px] font-semibold tracking-[-.06em] sm:text-[46px]">{formatCurrency(data.total_simulated_cost)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-semibold">
              <span className="border-l-2 border-[#315efb] pl-2 text-[#315efb]">Cost baseline</span>
              <span className="text-[#66726c]">Across {data.fp_count + data.fn_count} simulated errors</span>
            </div>
            <p className="mt-5 max-w-xl text-[11px] leading-5 text-[#5f6b80]">
              This simulation balances the cost of False Positives ({formatCurrency(data.fp_unit_cost)} per FP, affecting good customers) against False Negatives ({formatCurrency(data.fn_unit_cost)} per FN, resulting in direct fraud loss).
            </p>
          </div>
          <div className="grid grid-cols-2 border border-[#cbd4ce] bg-white/75">
            {[
              ["False Positives", data.fp_count.toLocaleString(), "Good payments blocked"], 
              ["False Negatives", data.fn_count.toLocaleString(), "Fraud missed"], 
              ["Total FP Cost", formatCurrency(data.total_fp_cost), "Lost revenue + ops"],
              ["Total FN Cost", formatCurrency(data.total_fn_cost), "Direct fraud loss"]
            ].map(([label,value,helper], index) => (
              <div key={label} className={`p-3.5 ${index % 2 ? "border-l border-[#d7ded9]" : ""} ${index > 1 ? "border-t border-[#d7ded9]" : ""}`}>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#7e8983]">{label}</p>
                <p className="mt-1.5 text-[18px] font-semibold tracking-[-.03em]">{value}</p>
                <p className="mt-1 text-[9px] font-medium text-[#7b8680]">{helper}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rsx-card flex flex-col gap-4 border-l-2 border-l-[#315efb] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#315efb]">Model Validation Brief</p>
          <p className="mt-2 text-[12px] font-bold text-[#2a364e]">Simulation leverages frozen validation metrics.</p>
          <p className="mt-1 max-w-3xl text-[10px] leading-5 text-[#69758a]">
            These figures are calculated based on the holdout test set performance of the ML model, simulating what the economic impact would be under current policy thresholds.
          </p>
        </div>
      </section>
    </div>
  );
}
