"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "../../components/ui";
import { LoaderCircle, BrainCircuit, ShieldAlert, Search } from "lucide-react";

interface EvidenceItem {
  signal: string;
  observed: string;
  source: string;
}

interface InvestigationResult {
  recommendation: string;
  confidence: number;
  reason_codes: string[];
  evidence: EvidenceItem[];
}

interface InvestigationResponse {
  transaction_id: string;
  status: string;
  provider_info: string;
  investigation: InvestigationResult;
}

export default function AIHubPage() {
  const [transactionId, setTransactionId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [graphEntityId, setGraphEntityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<InvestigationResponse | null>(null);

  const runInvestigation = async () => {
    if (!transactionId || !customerId || !graphEntityId) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: transactionId,
          customer_id: customerId,
          graph_entity_id: graphEntityId,
          amount: 5000,
          ml_risk_score: 0.8,
          graph_risk_score: 0.75
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the local LLM agent.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "ALLOW": return "border-[#cce8d6] bg-[#f0f9f3] text-[#2c7a4b]";
      case "REVIEW": return "border-[#fcebc4] bg-[#fffaf0] text-[#b87508]";
      case "BLOCK": return "border-[#efcbc7] bg-[#fff5f4] text-[#c33b34]";
      default: return "border-[#dce6f5] bg-[#f5f8fe] text-[#687d99]";
    }
  };

  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Investigation intelligence" title="Real-Time Investigation AI" description="Powered by your local Ollama LLM to analyze signals and make evidence-backed decisions." />

      <section className="rsx-data-panel">
        <div className="flex flex-col gap-4 border-b border-[#dfe5ee] bg-white px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#315efb]">Active Investigation</p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-.04em] text-[#111a2d]">Ask the evidence, not another dashboard.</h2>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-[#657187]">
            <span className="text-[#255df5] flex items-center gap-1">Local LLM Connected</span>
            <span className="flex items-center gap-1">Graph aware</span>
            <span className="flex items-center gap-1">Live evidence</span>
          </div>
        </div>

        <div className="grid min-h-[590px] lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-[#e3e8f0] bg-[#fafbff] p-5 lg:border-b-0 lg:border-r">
            <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#8b95a7]">Investigation Target</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#596a80] mb-1">Transaction ID</label>
                <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full rounded-md border border-[#c4d0df] px-3 py-2 text-[12px] text-[#1a2533] outline-none focus:border-[#2f6bff] focus:ring-1 focus:ring-[#2f6bff]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#596a80] mb-1">Customer ID</label>
                <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-md border border-[#c4d0df] px-3 py-2 text-[12px] text-[#1a2533] outline-none focus:border-[#2f6bff] focus:ring-1 focus:ring-[#2f6bff]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#596a80] mb-1">Graph Entity ID</label>
                <input type="text" value={graphEntityId} onChange={(e) => setGraphEntityId(e.target.value)} className="w-full rounded-md border border-[#c4d0df] px-3 py-2 text-[12px] text-[#1a2533] outline-none focus:border-[#2f6bff] focus:ring-1 focus:ring-[#2f6bff]" />
              </div>
              
              <button 
                onClick={runInvestigation}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-md bg-[#2f6bff] py-2.5 text-[11px] font-bold text-white hover:bg-[#1a4acc] disabled:opacity-50 transition-colors"
              >
                {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Analyzing Context..." : "Run AI Investigation"}
              </button>
            </div>
            
            {error && (
              <div className="mt-5 rounded-md border border-[#efcbc7] bg-[#fff5f4] p-3 text-[11px] text-[#c33b34] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </aside>

          <div className="min-w-0 p-5 sm:p-7 lg:p-8 relative">
            {!result && !loading && (
              <div className="absolute inset-0 flex items-center justify-center text-[#8b95a7] flex-col gap-3">
                <Search className="w-12 h-12 text-[#d3dce6]" />
                <p className="text-[12px] font-medium">Ready to investigate. Enter targets and run.</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10 flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-md bg-[#2f6bff]/30 animate-pulse"></div>
                  <LoaderCircle className="w-10 h-10 text-[#2f6bff] animate-spin relative z-10" />
                </div>
                <p className="text-[13px] font-semibold text-[#1a2533] animate-pulse">LLM Agent is fetching context and analyzing evidence...</p>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col gap-4 border-b border-[#e1e6ee] pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="rsx-section-label">Current assessment (Provided by: <span className="font-mono text-[#2f6bff]">{result.provider_info}</span>)</p>
                    <h3 className="mt-3 text-[22px] font-semibold tracking-[-.035em] text-[#111a2d]">Transaction {result.transaction_id}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.investigation.reason_codes.map(code => (
                        <span key={code} className="rounded-full bg-[#f1f4f8] border border-[#dce6f5] px-2.5 py-1 text-[9px] font-bold text-[#596a80]">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`w-fit border px-3 py-2 text-[10px] font-bold uppercase tracking-[.08em] ${getRecommendationColor(result.investigation.recommendation)}`}>
                    Confidence · {Math.round(result.investigation.confidence * 100)}%
                  </span>
                </div>

                <div className={`mt-6 border-l-2 px-5 py-4 ${result.investigation.recommendation === 'BLOCK' ? 'border-[#d14338] bg-[#fff8f7]' : result.investigation.recommendation === 'REVIEW' ? 'border-[#d98b0f] bg-[#fffaf0]' : 'border-[#38a169] bg-[#f0f9f3]'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-[.13em] ${result.investigation.recommendation === 'BLOCK' ? 'text-[#c53c34]' : result.investigation.recommendation === 'REVIEW' ? 'text-[#b87508]' : 'text-[#2c7a4b]'}`}>
                    Recommended action
                  </p>
                  <p className={`mt-2 text-[18px] font-semibold ${result.investigation.recommendation === 'BLOCK' ? 'text-[#5f211d]' : result.investigation.recommendation === 'REVIEW' ? 'text-[#7a4e05]' : 'text-[#1c4d2f]'}`}>
                    {result.investigation.recommendation} this transaction immediately.
                  </p>
                  <p className={`mt-2 text-[11px] leading-5 ${result.investigation.recommendation === 'BLOCK' ? 'text-[#8b514d]' : result.investigation.recommendation === 'REVIEW' ? 'text-[#8a5d11]' : 'text-[#23633b]'}`}>
                    Based on LLM analysis. Human verification may still be required.
                  </p>
                </div>

                <div className="mt-7">
                  <div className="grid grid-cols-[1fr_.9fr_.55fr] border-b border-[#dfe5ee] pb-2 text-[10px] font-bold uppercase tracking-[.08em] text-[#8b95a7]">
                    <span>Observed signal</span>
                    <span>Evidence</span>
                    <span className="text-right">Source</span>
                  </div>
                  {result.investigation.evidence.length === 0 && (
                    <div className="py-4 text-[12px] text-[#8b95a7] italic">No specific evidence items were isolated by the agent.</div>
                  )}
                  {result.investigation.evidence.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_.9fr_.55fr] gap-3 border-b border-[#edf0f5] py-3.5 text-[11px]">
                      <span className="font-semibold text-[#27334b]">{item.signal}</span>
                      <span className="text-[#657187]">{item.observed}</span>
                      <span className="text-right font-mono text-[#7e899b]">{item.source}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/clusters" className="inline-flex h-10 items-center bg-[#245df5] px-4 text-[11px] font-bold text-white hover:bg-[#1747c9]">
                    Review cluster context
                  </Link>
                  <Link href="/transactions" className="inline-flex h-10 items-center border border-[#d4dce8] bg-white px-4 text-[11px] font-bold text-[#46536a] hover:bg-[#f7f9fc]">
                    Back to queue
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
