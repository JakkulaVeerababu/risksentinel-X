"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronRight, X, Loader2 } from "lucide-react";
import { PageHeader, Skeleton, ErrorState } from "../../components/ui";
import { fetchInvestigations, Investigation } from "@/lib/api";
import "../../styles/recommendations.css";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [resolved, setResolved] = useState<Record<string, "applied" | "dismissed">>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInvestigations();
        const valid = (data.investigations || [])
          .filter(i => i.agent_state === 'COMPLETED' && i.recommendation)
          .map(i => ({
            id: i.transaction_id,
            title: `Recommend ${i.recommendation} for Transaction ${i.transaction_id}`,
            detail: i.reason_codes?.length ? `Based on: ${i.reason_codes.join(', ')}` : 'Investigation complete. Review transaction for details.',
            type: "Investigation AI",
            impact: "Transaction specific",
            confidence: Math.round((i.confidence || 0.8) * 100),
            urgency: i.recommendation === 'BLOCK' ? 'High' : (i.recommendation === 'REVIEW' ? 'Medium' : 'Low'),
            evidence: i.evidence ? `${i.evidence.length} data points` : 'No extra evidence'
          }));
        setRecommendations(valid);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const pending = recommendations.filter((item) => !resolved[item.id]);

  if (loading && recommendations.length === 0) {
    return (
      <div className="rsx-page space-y-5">
        <PageHeader eyebrow="Investigation guidance" title="Recommendations" description="Review evidence-backed next actions for flagged scenarios." actions={<Link href="/investigation" className="inline-flex h-9 items-center bg-[#245df5] px-3.5 text-[11px] font-bold text-white hover:bg-[#1747c9]">Open Investigation →</Link>} />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Investigation guidance" title="Recommendations" description="Review evidence-backed next actions for flagged scenarios." actions={<Link href="/investigation" className="inline-flex h-9 items-center bg-[#245df5] px-3.5 text-[11px] font-bold text-white hover:bg-[#1747c9]">Open Investigation →</Link>} />

      <section className="recommendations-brief" aria-labelledby="recommendations-brief-title">
        <div className="recommendations-brief-content">
          <div className="recommendations-brief-copy">
            <p className="recommendations-brief-eyebrow">Operations intelligence brief</p>
            <h2 id="recommendations-brief-title">
              {pending.length} {pending.length === 1 ? "recommendation" : "recommendations"} ready for review.
            </h2>
            <p className="recommendations-brief-description">
              Evidence-backed guidance from your active cases. Review the context before taking action.
            </p>
          </div>
          <dl className="recommendations-brief-stats">
            {[
              ["Pending", String(pending.length)], 
              ["Applied", String(Object.values(resolved).filter((v) => v === "applied").length)], 
              ["Avg. confidence", pending.length ? `${Math.round(pending.reduce((acc, curr) => acc + curr.confidence, 0) / pending.length)}%` : "N/A"]
            ].map(([label,value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#e2e7ef] rounded-xl text-[#526078] text-sm">
            No AI recommendations available at this time.
          </div>
        ) : (
          recommendations.map((item) => {
            const status = resolved[item.id];
            return (
              <article key={item.id} className={`rsx-card overflow-hidden transition-all ${status ? "opacity-70" : "rsx-card-interactive"}`}>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="min-w-0 flex-1 border-l-2 border-[#315efb] pl-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#8792a5]">{item.id.slice(0, 8)}...</span>
                          <span className="rounded-full bg-[#f0f3f7] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#647086]">{item.type}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${item.urgency === "High" ? "bg-[#fff0ef] text-[#cf3c32]" : "bg-[#fff7e8] text-[#b96800]"}`}>{item.urgency} priority</span>
                          {status && <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${status === "applied" ? "bg-[#edf3ff] text-[#315efb]" : "bg-[#f0f2f5] text-[#738096]"}`}>{status}</span>}
                        </div>
                        <h2 className="mt-2.5 text-[15px] font-bold tracking-[-.02em] text-[#26324a]">{item.title}</h2>
                        <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-[#69758a]">{item.detail}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold text-[#7e899c]">
                          <span>{item.evidence}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <aside className="flex flex-col justify-between border-t border-[#edf0f5] bg-[#fafbfd] p-5 lg:border-l lg:border-t-0">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8b95a7]">Action scope</p>
                      <p className="mt-1.5 text-[16px] font-bold tracking-[-.03em] text-[#17233f]">{item.impact}</p>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-[#7a8598]">
                        <span>AI Confidence</span>
                        <span>{item.confidence}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e7ebf1]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#255df5] to-[#7446d8]" style={{ width: `${item.confidence}%` }} />
                      </div>
                    </div>
                    {!status && (
                      <div className="mt-5 flex gap-2">
                        <button onClick={() => setResolved((state) => ({ ...state, [item.id]: "dismissed" }))} aria-label={`Dismiss ${item.title}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe5ee] bg-white text-[#7c8799] hover:bg-[#f5f7fa]">
                          <X className="h-4 w-4" />
                        </button>
                        <Link href={`/cases/${item.id}`} className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#255df5] px-3 text-[10px] font-bold text-white hover:bg-[#174bd4]">
                          View Case
                        </Link>
                      </div>
                    )}
                  </aside>
                </div>
              </article>
            );
          })
        )}
      </section>

      <Link href="/audit" className="flex items-center justify-between rounded-xl border border-[#e2e7ef] bg-white px-4 py-3 text-[10px] font-bold text-[#526078] hover:border-[#cfd9ea]">
        <span>All automated actions are recorded in the immutable audit log.</span>
        <span className="flex items-center gap-1 text-[#255df5]">View audit trail <ChevronRight className="h-3.5 w-3.5" /></span>
      </Link>
    </div>
  );
}
