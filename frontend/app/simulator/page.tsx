"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Play } from "lucide-react";
import { startSimulation } from "../../lib/api";

const scenarios = [
  {
    id: "normal_customer",
    name: "Normal customer",
    description: "A trusted returning customer with familiar payment behaviour.",
    profile: "Baseline",
  },
  {
    id: "high_value_anomaly",
    name: "High-value anomaly",
    description: "An unusually large purchase from a recently created account.",
    profile: "Elevated",
  },
  {
    id: "device_velocity_attack",
    name: "Device velocity attack",
    description: "A single device rapidly creating and funding multiple accounts.",
    profile: "High risk",
  },
  {
    id: "coordinated_fraud_ring",
    name: "Coordinated fraud ring",
    description: "Linked identities share devices, instruments and network signals.",
    profile: "Critical",
  },
];

type SimulationResult = {
  scenario?: string;
  transactions_generated?: number;
  customers?: number;
  devices?: number;
  ips?: number;
  ml_risk_avg?: number;
  graph_risk_avg?: number;
  decisions?: { ALLOW?: number; REVIEW?: number; BLOCK?: number };
  investigation_id?: string | null;
};

export default function SimulatorPage() {
  const [selected, setSelected] = useState(scenarios[2]);
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const executeSimulation = async () => {
    setStatus("running");
    setResult(null);
    const next = await startSimulation(selected.id, 8);
    setResult(next);
    setStatus("complete");
  };

  const mlScore = Math.round((result?.ml_risk_avg || 0) * 100);
  const graphScore = Math.round((result?.graph_risk_avg || 0) * 100);

  return (
    <section className="relative flex h-[calc(100dvh-132px)] min-h-[680px] max-h-[900px] flex-col overflow-hidden rounded-[24px] border border-[#1d2d4d] bg-[#071225] text-white shadow-[0_24px_80px_rgba(6,18,37,0.16)]">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_78%_22%,rgba(47,102,247,0.22),transparent_28%),radial-gradient(circle_at_56%_108%,rgba(65,225,183,0.12),transparent_35%)]" />

      <header className="relative flex flex-col gap-4 border-b border-white/10 px-7 py-6 sm:flex-row sm:items-end sm:justify-between lg:px-9">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7ea6ff]">Decisioning laboratory</p>
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.035em] sm:text-[34px]">Attack simulator</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#9eacc5]">
            Generate synthetic payment patterns and watch every risk engine reach a decision in real time.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ff6d77]/25 bg-[#ff4d5e]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff8d96]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6572] shadow-[0_0_12px_#ff6572]" />
          Isolated test environment
        </div>
      </header>

      <div className="relative grid min-h-0 flex-1 gap-5 p-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:p-6">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#0c1931]/90">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8f9db7]">Select a scenario</p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {scenarios.map((scenario) => {
              const active = selected.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => {
                    setSelected(scenario);
                    setResult(null);
                    setStatus("idle");
                  }}
                  className={`relative w-full rounded-[14px] border px-4 py-4 text-left transition ${
                    active
                      ? "border-[#4c7dff] bg-[#17366f] shadow-[0_12px_30px_rgba(32,91,222,0.2)]"
                      : "border-transparent bg-white/[0.035] hover:border-white/10 hover:bg-white/[0.06]"
                  }`}
                >
                  {active && <span className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-[#5a86ff]" />}
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-semibold text-white">{scenario.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${active ? "text-[#a9c0ff]" : "text-[#71809c]"}`}>
                      {scenario.profile}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[12px] leading-5 text-[#8998b3]">{scenario.description}</span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              disabled={status === "running"}
              onClick={executeSimulation}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f66f7] text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(47,102,247,0.3)] transition hover:bg-[#3b72ff] disabled:cursor-wait disabled:opacity-70"
            >
              {status === "running" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              {status === "running" ? "Running pipeline" : "Execute simulation"}
            </button>
          </div>
        </aside>

        <div className="relative min-h-[430px] overflow-hidden rounded-[18px] border border-white/10 bg-[#09152b] [background-image:linear-gradient(rgba(92,126,188,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(92,126,188,0.07)_1px,transparent_1px)] [background-size:42px_42px]">
          {status === "running" ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <LoaderCircle className="h-7 w-7 animate-spin text-[#5d8bff]" />
              <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.025em]">Risk engines are evaluating the attack</h2>
              <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#8f9db7]">Scoring behaviour, enriching relationships and applying policy controls.</p>
            </div>
          ) : result ? (
            <div className="flex h-full flex-col p-6 lg:p-8">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#55dfb2]">Simulation complete</p>
                  <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em]">{selected.name}</h2>
                  <p className="mt-1 text-[13px] text-[#8f9db7]">Eight synthetic transactions passed through the live decision pipeline.</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#55dfb2]/20 bg-[#55dfb2]/10 px-3 py-2 text-[11px] font-semibold text-[#69e6bd]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Pipeline healthy
                </span>
              </div>

              <div className="grid gap-3 py-6 sm:grid-cols-4">
                {[
                  ["Transactions", result.transactions_generated ?? 8],
                  ["Customers", result.customers ?? 0],
                  ["Devices", result.devices ?? 0],
                  ["Network origins", result.ips ?? 0],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[14px] border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7686a3]">{label}</p>
                    <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[16px] border border-white/10 bg-[#0c1931]/80 p-5">
                  <p className="text-[11px] font-semibold text-white">Risk engine confidence</p>
                  {[["ML behaviour score", mlScore], ["Graph relationship score", graphScore]].map(([label, score]) => (
                    <div key={label} className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-[11px]">
                        <span className="text-[#9caac1]">{label}</span>
                        <span className="font-semibold text-white">{score}/100</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#4b78ff] to-[#62deb9]" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[16px] border border-white/10 bg-[#0c1931]/80 p-5">
                  <p className="text-[11px] font-semibold text-white">Final decisions</p>
                  <div className="mt-4 space-y-3">
                    {[
                      ["Blocked", result.decisions?.BLOCK ?? 0, "text-[#ff7e88]"],
                      ["Review", result.decisions?.REVIEW ?? 0, "text-[#ffc562]"],
                      ["Allowed", result.decisions?.ALLOW ?? 0, "text-[#61dfb6]"],
                    ].map(([label, value, tone]) => (
                      <div key={label} className="flex items-center justify-between border-b border-white/[0.07] pb-3 last:border-0">
                        <span className="text-[12px] text-[#95a3bb]">{label}</span>
                        <span className={`text-[20px] font-semibold ${tone}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href="/investigations" className="inline-flex items-center gap-2 rounded-xl bg-[#2f66f7] px-4 py-3 text-[12px] font-semibold text-white hover:bg-[#3b72ff]">
                  Open generated case <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button type="button" onClick={executeSimulation} className="rounded-xl border border-white/15 px-4 py-3 text-[12px] font-semibold text-[#c2cce0] hover:bg-white/[0.05]">
                  Run again
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f94ed]">Selected scenario · {selected.profile}</p>
              <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.035em]">Ready to simulate</h2>
              <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#8f9db7]">{selected.description} Execute the scenario to see how the full risk stack responds.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["ML scoring", "Graph enrichment", "Policy decision", "Case creation"].map((stage, index) => (
                  <span key={stage} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-semibold text-[#9cabc2]">
                    {String(index + 1).padStart(2, "0")} · {stage}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
