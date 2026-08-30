"use client";

import { useEffect, useState } from "react";
import { fetchDashboardMetrics, DashboardMetrics } from "../../lib/api";

export default function LandingMetrics() {
  const [metrics, setMetrics] = useState<{
    monitored: string;
    prevented: string;
  }>({
    monitored: "14,892",
    prevented: "₹18,40,000.00",
  });

  useEffect(() => {
    fetchDashboardMetrics().then((data: DashboardMetrics) => {
      if (data && data.kpis) {
        setMetrics({
          monitored: data.kpis.transactions_analysed.toLocaleString(),
          prevented: `₹${data.kpis.fraud_prevented.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        });
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="border-t border-[#dce5f2] bg-white/90">
      <div className="landing-container grid sm:grid-cols-3">
        {[
          [metrics.monitored, "payments monitored"], 
          [metrics.prevented, "loss prevented"]
        ].map(([value, label], index) => (
          <div key={label} className={`flex items-baseline gap-3 py-5 ${index > 0 ? "border-t border-[#e2e7ef] sm:border-l sm:border-t-0 sm:pl-7" : ""}`}>
            <span className="text-[23px] font-semibold tracking-[-.035em] text-[#17233b]">{value}</span>
            <span className="text-[11px] font-medium text-[#78849a]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
