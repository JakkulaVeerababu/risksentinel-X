"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { startSimulation } from "../../lib/api";
import { PageHeader } from "../../components/ui";

const scenarios = [
  { id: "normal_customer", name: "Normal customer", description: "A trusted returning customer with familiar payment behaviour.", profile: "Baseline" },
  { id: "high_value_anomaly", name: "High-value anomaly", description: "An unusually large purchase from a recently created account.", profile: "Elevated" },
  { id: "device_velocity_attack", name: "Device velocity attack", description: "A single device rapidly creating and funding multiple accounts.", profile: "High risk" },
  { id: "coordinated_fraud_ring", name: "Coordinated fraud ring", description: "Linked identities share devices, instruments and network signals.", profile: "Critical" },
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
  const [selected,setSelected]=useState(scenarios[2]);
  const [status,setStatus]=useState<"idle"|"running"|"complete">("idle");
  const [result,setResult]=useState<SimulationResult|null>(null);

  const executeSimulation=async()=>{setStatus("running");setResult(null);const next=await startSimulation(selected.id,8);setResult(next);setStatus("complete");};
  const mlScore=Math.round((result?.ml_risk_avg||0)*100);
  const graphScore=Math.round((result?.graph_risk_avg||0)*100);

  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Decisioning laboratory" title="Attack simulator" description="Generate synthetic payment behaviour and observe how the complete risk stack reaches a decision." actions={<span className="border border-[#edc3c0] bg-[#fff4f2] px-3 py-2 text-[9px] font-extrabold uppercase tracking-[.12em] text-[#c43d36]"><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#dc4b43]"/>Isolated test environment</span>} />

      <section className="overflow-hidden rounded-[10px] border border-[#dfe5ee] bg-white">
        <div className="grid min-h-[600px] lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-b border-[#dfe5ee] bg-[#fafbff] lg:border-b-0 lg:border-r">
            <div className="border-b border-[#dfe5ee] px-5 py-4"><p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#87918c]">Select a scenario</p><p className="mt-1 text-[11px] leading-5 text-[#68736d]">Choose a payment pattern for the isolated run.</p></div>
            <div className="min-h-0 flex-1 divide-y divide-[#e1e6e2] overflow-y-auto">
              {scenarios.map((scenario)=>{const active=selected.id===scenario.id;return <button key={scenario.id} type="button" onClick={()=>{setSelected(scenario);setResult(null);setStatus("idle");}} className={`relative w-full px-5 py-4 text-left transition-colors ${active?"bg-[#edf3ff]":"bg-transparent hover:bg-[#f3f5fa]"}`}>{active&&<span className="absolute inset-y-0 left-0 w-0.5 bg-[#315efb]"/>}<span className="flex items-start justify-between gap-3"><span className={`text-[12px] font-bold ${active?"text-[#174bd4]":"text-[#344158]"}`}>{scenario.name}</span><span className={`text-[8px] font-extrabold uppercase tracking-[.1em] ${active?"text-[#315efb]":"text-[#929b96]"}`}>{scenario.profile}</span></span><span className="mt-1.5 block text-[10px] leading-4 text-[#7c8799]">{scenario.description}</span></button>})}
            </div>
            <div className="border-t border-[#dfe5ee] p-4"><button type="button" disabled={status==="running"} onClick={executeSimulation} className="flex h-11 w-full items-center justify-center gap-2 bg-[#111a2d] text-[11px] font-bold text-white transition-colors hover:bg-[#263047] disabled:cursor-wait disabled:bg-[#6f7989]">{status==="running"&&<LoaderCircle className="h-3.5 w-3.5 animate-spin"/>}{status==="running"?"Running risk pipeline":"Run simulation"}</button></div>
          </aside>

          <div className="rsx-diagonal-wash rsx-editorial-grid relative min-h-[470px] p-5 sm:p-7">
            {status==="running"?<div className="flex h-full min-h-[480px] flex-col items-center justify-center text-center"><LoaderCircle className="h-6 w-6 animate-spin text-[#315efb]"/><h2 className="mt-5 text-[22px] font-semibold tracking-[-.035em] text-[#111a2d]">Evaluating the attack pattern</h2><p className="mt-2 max-w-lg text-[11px] leading-5 text-[#69756f]">Scoring behaviour, enriching relationships and applying policy controls.</p></div>:result?<div className="mx-auto flex h-full max-w-[900px] flex-col">
              <div className="flex flex-col gap-3 border-b border-[#cfd7d2] pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#315efb]">Simulation complete</p><h2 className="mt-2 text-[24px] font-semibold tracking-[-.04em] text-[#111a2d]">{selected.name}</h2><p className="mt-1 text-[11px] text-[#69758a]">Eight synthetic transactions completed the risk decision pipeline.</p></div><span className="w-fit border border-[#cdd9f8] bg-[#f4f7ff] px-3 py-2 text-[9px] font-bold text-[#315efb]">● Pipeline healthy</span></div>
              <div className="grid border-b border-[#cfd7d2] sm:grid-cols-4">{[["Transactions",result.transactions_generated??8],["Customers",result.customers??0],["Devices",result.devices??0],["Network origins",result.ips??0]].map(([label,value],index)=><div key={label} className={`py-4 sm:px-4 ${index?"border-t border-[#dce2eb] sm:border-l sm:border-t-0":""}`}><p className="text-[9px] font-extrabold uppercase tracking-[.1em] text-[#8b95a7]">{label}</p><p className="mt-1.5 text-[25px] font-semibold tracking-[-.04em] text-[#111a2d]">{value}</p></div>)}</div>
              <div className="grid flex-1 gap-5 py-5 md:grid-cols-[1.15fr_.85fr]"><div className="border border-[#d7ddd9] bg-white/80 p-5"><p className="text-[11px] font-bold text-[#17233f]">Risk engine confidence</p>{[["ML behaviour score",mlScore, false],["Graph relationship score",graphScore, result?.graph_risk_avg === null]].map(([label,score,isNull])=><div key={label as string} className="mt-5"><div className="mb-2 flex items-center justify-between text-[10px]"><span className="text-[#69758a]">{label}</span><span className="font-bold text-[#17233f]">{isNull ? "Graph evidence unavailable" : `${score}/100`}</span></div><div className="h-1.5 bg-[#e7ebf1]"><div className="h-full bg-[#315efb]" style={{width:`${isNull ? 0 : score}%`}}/></div></div>)}</div><div className="border border-[#d7ddd9] bg-white/80 p-5"><p className="text-[11px] font-bold text-[#17233f]">Final decisions</p><div className="mt-3 divide-y divide-[#dfe5ee]">{[["Blocked",result.decisions?.BLOCK??0,"text-[#c93d36]"],["Review",result.decisions?.REVIEW??0,"text-[#9b650f]"],["Allowed",result.decisions?.ALLOW??0,"text-[#315efb]"]].map(([label,value,tone])=><div key={label as string} className="flex items-center justify-between py-3"><span className="text-[10px] text-[#69758a]">{label}</span><span className={`text-[19px] font-semibold ${tone}`}>{value}</span></div>)}</div></div></div>
              <div className="flex flex-wrap gap-2"><Link href="/investigations" className="bg-[#111a2d] px-4 py-3 text-[10px] font-bold text-white hover:bg-[#263047]">Open generated case →</Link><button type="button" onClick={executeSimulation} className="border border-[#cbd2ce] bg-white px-4 py-3 text-[10px] font-bold text-[#46536a] hover:bg-[#f6f8fc]">Run again</button></div>
            </div>:<div className="mx-auto flex h-full min-h-[480px] max-w-[900px] flex-col justify-center">
              <div className="max-w-[600px]"><p className="text-[9px] font-extrabold uppercase tracking-[.17em] text-[#315efb]">Selected scenario · {selected.profile}</p><h2 className="mt-4 text-[32px] font-semibold tracking-[-.05em] text-[#111a2d]">Ready to simulate</h2><p className="mt-3 text-[12px] leading-6 text-[#5f6b80]">{selected.description} Run the scenario to see how the complete risk stack responds.</p></div>
              <div className="mt-10 grid border-y border-[#cbd5e1] sm:grid-cols-4">{["ML scoring","Graph enrichment","Policy decision","Case creation"].map((stage,index)=><div key={stage} className={`py-4 sm:px-4 ${index?"border-t border-[#d7dee8] sm:border-l sm:border-t-0":""}`}><p className="text-[9px] font-extrabold text-[#8b95a7]">{String(index+1).padStart(2,"0")}</p><p className="mt-1 text-[10px] font-bold text-[#344158]">{stage}</p></div>)}</div>
            </div>}
          </div>
        </div>
      </section>
    </div>
  );
}
