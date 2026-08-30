import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import BrandLogo from "../components/brand/BrandLogo";
import LandingNav from "../components/landing/LandingNav";
import LiveRiskPreview from "../components/landing/LiveRiskPreview";
import ProductSystem from "../components/landing/ProductSystem";

const graphNodes = [
  { kind: "Payment", value: "pay_PM71JD29", x: "48%", y: "48%", tone: "border-[#efaaa6] bg-[#fff2f1] text-[#b9342d]" },
  { kind: "Device", value: "DVC-9821", x: "22%", y: "25%", tone: "border-[#a8bff4] bg-white text-[#255df5]" },
  { kind: "Customer", value: "Aarav S.", x: "14%", y: "72%", tone: "border-[#ccd5e3] bg-white text-[#43516a]" },
  { kind: "IP address", value: "49.37.***.82", x: "49%", y: "14%", tone: "border-[#b8c6e2] bg-white text-[#43516a]" },
  { kind: "Merchant", value: "Nova Electronics", x: "80%", y: "27%", tone: "border-[#ccd5e3] bg-white text-[#43516a]" },
  { kind: "Instrument", value: "Card ••8219", x: "76%", y: "73%", tone: "border-[#e7c994] bg-[#fffaf1] text-[#9a5a00]" },
];

const observedSignals = [
  ["Device relationship", "Linked to 11 accounts", "Graph evidence"],
  ["Transaction velocity", "4.8× account baseline", "Model feature"],
  ["Merchant behavior", "Pattern deviation detected", "Risk model"],
  ["Payment instrument", "Shared across 6 identities", "Graph evidence"],
];

const decisionTrail = [
  ["14:32:18.101", "Payment received", "₹48,900 · Nova Electronics"],
  ["14:32:18.116", "Model risk score", "94 / 100"],
  ["14:32:18.132", "Graph intelligence", "4 linked entities · cluster FRC-0184"],
  ["14:32:18.251", "Agent investigation", "Coordinated payment behavior detected"],
  ["14:32:18.267", "Policy evaluation", "Rule RS-204 triggered"],
  ["14:32:18.270", "Final decision", "BLOCK"],
];

const productProof = [
  ["Real-time scoring", "Models evaluate incoming payment features before enforcement."],
  ["Graph-linked evidence", "Relationships connect identities, devices, merchants and instruments."],
  ["Deterministic enforcement", "Policy—not generative AI—owns every final decision."],
  ["Auditable decisions", "Evidence, recommendations and policy outcomes remain traceable."],
];

export default function ProductLandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#071426]">
      <LandingNav />

      <main>
        <section className="relative overflow-hidden bg-[#071226] pt-[72px] text-white">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute right-[-15%] top-[-20%] h-[780px] w-[780px] rounded-full bg-[#2f6bff]/[.22] blur-[130px]" />
          <svg className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[58%] opacity-20 lg:block" viewBox="0 0 900 880" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="#7da1ff" strokeWidth="1"><path d="M40 180 L260 98 L480 210 L720 112 L870 245"/><path d="M0 540 L220 420 L470 522 L690 398 L900 470"/><path d="M260 98 L220 420"/><path d="M480 210 L470 522"/><path d="M720 112 L690 398"/></g>
          </svg>

          <div className="landing-container relative grid gap-16 pb-20 pt-20 sm:pb-24 sm:pt-24 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:gap-10 lg:pb-28 lg:pt-28">
            <div className="max-w-[650px]">
              <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[.04em] text-[#9eb8f5]"><span className="h-px w-8 bg-[#5b8cff]" />AI-native payment risk intelligence</div>
              <h1 className="mt-8 text-[50px] font-semibold leading-[.96] tracking-[-.062em] sm:text-[66px] lg:text-[78px]">
                Every payment.
                <span className="mt-2 block text-[#84a8ff]">Understood before</span>
                <span className="block">you decide.</span>
              </h1>
              <p className="mt-7 max-w-[580px] text-[18px] leading-8 text-[#c2cde0]">Detect risk. Connect evidence. Investigate instantly. Let deterministic policy make the final call.</p>
              <p className="mt-3 max-w-[560px] text-[14px] leading-6 text-[#8493ad]">One operating surface for payment monitoring, graph investigation and explainable enforcement.</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/login" className="landing-primary-cta group h-12 px-5 text-[13px]">Enter demo workspace <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
                <a href="#platform" className="group inline-flex h-12 items-center justify-center gap-2 px-4 text-[13px] font-semibold text-white/[.76] transition-colors hover:text-white"><Play className="h-3.5 w-3.5 fill-current" />Watch how it works</a>
              </div>

              <div className="mt-10 flex flex-wrap border-y border-white/10 py-4 text-[10px] font-medium text-[#8e9db6]">
                {["No account required", "Seeded demo data", "Policy-controlled decisions"].map((item, index) => <span key={item} className={`py-1 ${index > 0 ? "ml-4 border-l border-white/10 pl-4" : ""}`}>{item}</span>)}
              </div>
            </div>

            <div className="relative lg:-mr-24">
              <div className="absolute inset-x-[12%] bottom-[6%] top-[8%] bg-[#2f6bff]/[.16] blur-[85px]" />
              <div className="relative">
                <LiveRiskPreview />
                <p className="mt-3 text-right text-[9px] font-medium text-[#6f809d]">Interactive seeded scenario · Buildathon demo</p>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-b border-[#e3e8f0] bg-white py-20 sm:py-28">
          <div className="landing-container">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <h2 className="landing-section-title max-w-[700px]">Built for the moment risk becomes real.</h2>
              <div className="lg:justify-self-end"><p className="landing-section-copy max-w-[580px]">A payment moves through four accountable systems. Each step contributes evidence. Only policy returns the final outcome.</p><p className="mt-4 text-[11px] font-semibold text-[#255df5]">Select a stage to inspect the decision path.</p></div>
            </div>
            <div className="mt-14 sm:mt-16"><ProductSystem /></div>
          </div>
        </section>

        <section id="intelligence" className="border-b border-[#e3e8f0] bg-[#f7f9fc] py-20 sm:py-28">
          <div className="landing-container">
            <div className="grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
              <div><p className="text-[12px] font-semibold text-[#255df5]">Graph intelligence</p><h2 className="landing-section-title mt-4 max-w-[760px]">Investigate the relationship, not only the payment.</h2></div>
              <p className="landing-section-copy max-w-[560px] lg:justify-self-end">Risk hides in the connections between identities, infrastructure and commerce. The relationship explorer makes those connections reviewable.</p>
            </div>

            <div className="mt-14 grid border border-[#dce3ed] bg-white lg:grid-cols-[1.28fr_.72fr]">
              <div className="relative min-h-[540px] overflow-hidden border-b border-[#dce3ed] bg-[#fbfcfe] lg:border-b-0 lg:border-r">
                <div className="flex h-16 items-center justify-between border-b border-[#e4e9f0] px-5 sm:px-6"><div><p className="text-[12px] font-semibold text-[#17233b]">Relationship explorer</p><p className="mt-1 text-[9px] text-[#8490a2]">12 entities · 14 relationships · Live graph</p></div><span className="hidden text-[9px] font-semibold text-[#255df5] sm:block">Cluster FRC-0184 selected</span></div>

                <div className="relative hidden h-[474px] landing-risk-grid sm:block">
                  <svg viewBox="0 0 720 474" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <g fill="none" stroke="#afbfdf" strokeWidth="1.2"><path d="M345 225 L158 118"/><path d="M345 225 L108 340"/><path d="M345 225 L352 64"/><path d="M345 225 L575 126"/><path d="M345 225 L548 346"/><path d="M158 118 L352 64" strokeDasharray="4 6"/><path d="M575 126 L548 346" strokeDasharray="4 6"/></g>
                    <path d="M158 118 L345 225 L548 346" fill="none" stroke="#2f6bff" strokeWidth="2" />
                    <rect x="70" y="40" width="580" height="352" fill="none" stroke="#d9a4a0" strokeDasharray="5 6" opacity=".65" />
                  </svg>
                  <div className="absolute left-[7%] top-[7%] text-[8px] font-semibold uppercase tracking-[.1em] text-[#a95a55]">Suspicious relationship boundary</div>
                  {graphNodes.map((node) => <div key={node.kind} className={`group absolute -translate-x-1/2 -translate-y-1/2 border px-3 py-2.5 shadow-[0_4px_14px_rgba(30,52,88,.06)] transition-transform duration-200 hover:-translate-y-[54%] ${node.tone}`} style={{ left: node.x, top: node.y }}><p className="text-[8px] font-semibold uppercase tracking-[.08em] opacity-60">{node.kind}</p><p className="mt-1 whitespace-nowrap font-mono text-[9px] font-semibold">{node.value}</p></div>)}
                  <div className="absolute bottom-5 left-5 flex gap-5 border border-[#dfe5ee] bg-white px-3 py-2 text-[9px] text-[#647188] shadow-sm"><span><i className="mr-1.5 inline-block h-1.5 w-1.5 bg-[#2f6bff]" />Direct link</span><span><i className="mr-1.5 inline-block h-1.5 w-1.5 bg-[#a9b5c8]" />Inferred link</span></div>
                </div>

                <div className="divide-y divide-[#e6eaf1] sm:hidden">
                  {graphNodes.map((node, index) => <div key={node.kind} className="flex items-center gap-3 px-5 py-4"><span className={`h-2 w-2 ${index === 0 ? "bg-[#d14338]" : "bg-[#315efb]"}`} /><div><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-[#8a95a7]">{index === 0 ? "Selected payment" : `Connected ${node.kind.toLowerCase()}`}</p><p className="mt-1 font-mono text-[10px] font-semibold text-[#263249]">{node.value}</p></div></div>)}
                </div>
              </div>

              <aside className="p-6 sm:p-8">
                <div className="flex items-start justify-between border-b border-[#e2e7ef] pb-6"><div><p className="font-mono text-[10px] font-semibold text-[#255df5]">pay_PM71JD29</p><p className="mt-2 text-[20px] font-semibold tracking-[-.025em] text-[#17233b]">₹48,900</p></div><span className="border border-[#f0c9c6] bg-[#fff1f0] px-2 py-1 text-[8px] font-bold text-[#c93830]">CRITICAL</span></div>
                <div className="py-6"><div className="flex items-end justify-between"><span className="text-[11px] font-medium text-[#6f7b90]">Risk score</span><span className="text-[30px] font-semibold tracking-[-.04em] text-[#d14338]">94</span></div><div className="mt-3 h-1 bg-[#edf0f5]"><div className="h-full w-[94%] bg-[#d14338]" /></div></div>
                <dl className="divide-y divide-[#e6eaf1] border-y border-[#e6eaf1]">
                  {[["Linked identities", "11"], ["Shared devices", "4"], ["Merchant connections", "3"], ["Cluster confidence", "High"]].map(([label, value]) => <div key={label} className="flex items-center justify-between py-3.5"><dt className="text-[11px] text-[#6f7b90]">{label}</dt><dd className="font-mono text-[11px] font-semibold text-[#263249]">{value}</dd></div>)}
                </dl>
                <Link href="/investigations/CASE-RSX184" className="group mt-7 inline-flex items-center gap-2 text-[12px] font-semibold text-[#255df5]">Open investigation <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e3e8f0] bg-white py-20 sm:py-28">
          <div className="landing-container grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[12px] font-semibold text-[#255df5]">Investigation intelligence</p>
              <h2 className="landing-section-title mt-4">AI recommends.<br />Policy decides.</h2>
              <p className="landing-section-copy mt-6 max-w-[470px]">The investigation agent compresses evidence into a reviewable recommendation. It never bypasses the enforcement boundary.</p>
              <div className="mt-8 border-l-2 border-[#315efb] pl-4"><p className="text-[11px] font-semibold text-[#17233b]">Clear ownership by design</p><p className="mt-2 text-[12px] leading-5 text-[#6c788c]">Models detect risk. The agent explains. Deterministic policy allows, reviews or blocks.</p></div>
            </div>

            <div className="border-y border-[#dfe5ee]">
              <div className="flex items-center justify-between border-b border-[#dfe5ee] py-4"><div><p className="text-[12px] font-semibold text-[#17233b]">Investigation output</p><p className="mt-1 font-mono text-[9px] text-[#818da0]">CASE-RSX184 · Evidence bundle 04</p></div><span className="text-[9px] font-semibold text-[#255df5]">Policy aware</span></div>
              <div>
                {observedSignals.map(([label, value, source], index) => <div key={label} className={`grid gap-2 py-4 sm:grid-cols-[1fr_1.25fr_.7fr] sm:items-center ${index < observedSignals.length - 1 ? "border-b border-[#edf0f5]" : ""}`}><span className="text-[10px] font-medium text-[#778398]">{label}</span><span className="text-[12px] font-semibold text-[#263249]">{value}</span><span className="text-left font-mono text-[9px] text-[#8b95a6] sm:text-right">{source}</span></div>)}
              </div>
              <div className="grid border-t border-[#dfe5ee] bg-[#f7f9fc] sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="p-5"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-[#7d889a]">Agent recommendation</p><p className="mt-2 text-[16px] font-semibold text-[#17233b]">Escalate to BLOCK review</p><p className="mt-1 text-[10px] text-[#69758a]">Confidence: High · Evidence sources: 4</p></div>
                <div className="border-t border-[#dfe5ee] p-5 sm:border-l sm:border-t-0"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-[#7d889a]">Enforcement owner</p><p className="mt-2 font-mono text-[12px] font-bold text-[#255df5]">POLICY ENGINE</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#071226] py-20 text-white sm:py-24">
          <div className="landing-container">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[12px] font-semibold text-[#84a8ff]">Governed decisioning</p><h2 className="mt-4 max-w-[690px] text-[38px] font-semibold leading-[1.03] tracking-[-.05em] sm:text-[56px]">One evidence bundle. One accountable outcome.</h2></div><p className="max-w-[560px] text-[15px] leading-7 text-[#98a7bf] lg:justify-self-end">Every contributor remains visible from initial score to final enforcement.</p></div>
            <div className="mt-14 grid border-y border-white/[.14] md:grid-cols-5">
              {[
                ["Risk model", "92 / 100", "Calibrated score"],
                ["Graph", "High-risk cluster", "11 linked identities"],
                ["Agent", "Recommend block", "Evidence-backed"],
                ["Policy", "RS-204", "Rule triggered"],
                ["Final decision", "BLOCK", "Enforced"],
              ].map(([label, value, detail], index) => <div key={label} className={`relative px-4 py-6 sm:px-5 md:min-h-[170px] md:py-7 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}><span className="font-mono text-[9px] text-[#6f809b]">0{index + 1}</span><p className="mt-6 text-[10px] font-medium text-[#8797b0]">{label}</p><p className={`mt-2 text-[16px] font-semibold ${index === 4 ? "text-[#ff8d87]" : "text-white"}`}>{value}</p><p className="mt-2 text-[9px] text-[#6f809b]">{detail}</p>{index < 4 && <ArrowRight className="absolute right-[-7px] top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 text-[#5b8cff] md:block" />}</div>)}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e3e8f0] bg-[#f7f9fc] py-20 sm:py-28">
          <div className="landing-container grid gap-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-20">
            <div>
              <p className="text-[12px] font-semibold text-[#255df5]">Decision trail</p>
              <h2 className="landing-section-title mt-4">A decision your team can replay.</h2>
              <p className="landing-section-copy mt-6 max-w-[430px]">Every system contribution is timestamped, attributable and available for review.</p>
              <div className="mt-10 border-t border-[#dce3ed] pt-6"><p className="font-mono text-[44px] font-semibold tracking-[-.06em] text-[#17233b]">169<span className="ml-1 text-[18px] text-[#78869d]">ms</span></p><p className="mt-2 text-[11px] text-[#6f7b90]">Payment received → policy enforced</p></div>
            </div>

            <div className="relative border-y border-[#dce3ed] bg-white">
              <div className="absolute bottom-7 left-[119px] top-7 hidden w-px bg-[#dfe5ee] sm:block" />
              {decisionTrail.map(([time, event, detail], index) => <div key={time} className={`relative grid gap-2 px-5 py-4 sm:grid-cols-[94px_16px_1fr] sm:items-center sm:gap-4 ${index < decisionTrail.length - 1 ? "border-b border-[#edf0f5]" : "bg-[#fff6f5]"}`}><time className="font-mono text-[9px] text-[#7e899b]">{time}</time><span className={`relative z-10 hidden h-2 w-2 border-2 ring-4 ring-white sm:block ${index === decisionTrail.length - 1 ? "border-[#d14338] bg-[#d14338]" : "border-[#7c9eec] bg-white"}`} /><div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"><p className={`text-[11px] font-semibold ${index === decisionTrail.length - 1 ? "text-[#b9342d]" : "text-[#263249]"}`}>{event}</p><p className={`font-mono text-[9px] ${index === decisionTrail.length - 1 ? "font-bold text-[#b9342d]" : "text-[#7b8799]"}`}>{detail}</p></div></div>)}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="landing-container grid border-x border-[#e2e7ef] sm:grid-cols-2 lg:grid-cols-4">
            {productProof.map(([title, copy], index) => <div key={title} className={`min-h-[190px] px-6 py-8 ${index > 0 ? "border-t border-[#e2e7ef] sm:[&:nth-child(odd)]:border-l lg:border-l" : ""} ${index === 2 ? "sm:border-t" : ""}`}><span className="font-mono text-[9px] text-[#9aa4b4]">0{index + 1}</span><h3 className="mt-7 text-[15px] font-semibold text-[#17233b]">{title}</h3><p className="mt-3 text-[12px] leading-5 text-[#68758a]">{copy}</p></div>)}
          </div>
        </section>

        <section id="outcomes" className="border-y border-[#e2e7ef] bg-[#f7f9fc] py-20 sm:py-28">
          <div className="landing-container text-center">
            <h2 className="landing-section-title mx-auto max-w-[840px]">See a payment become a decision.</h2>
            <p className="landing-section-copy mx-auto mt-5 max-w-[610px]">Follow the complete path from incoming payment to enforced outcome in the live workspace.</p>

            <div className="mx-auto mt-12 grid max-w-[1040px] border-y border-[#dce3ed] bg-white sm:grid-cols-3 lg:grid-cols-6">
              {["Payment", "Model", "Graph", "Investigation", "Policy", "Block"].map((step, index) => <div key={step} className={`relative px-3 py-5 text-[10px] font-semibold ${index === 5 ? "text-[#c93830]" : "text-[#39465d]"} ${index > 0 ? "border-t border-[#e5e9f0] sm:border-l sm:[&:nth-child(-n+3)]:border-t-0 lg:border-l lg:border-t-0" : ""}`}><span className="mr-2 font-mono text-[8px] text-[#9aa4b4]">0{index + 1}</span>{step}{index < 5 && <ArrowRight className="absolute right-[-7px] top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 text-[#6f8fd9] lg:block" />}</div>)}
            </div>

            <Link href="/login" className="landing-primary-cta group mx-auto mt-10 h-12 px-6 text-[13px]">Launch live demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <p className="mt-3 text-[10px] text-[#7d899b]">No account required.</p>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="landing-container grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div><BrandLogo /><p className="mt-3 text-[12px] text-[#6f7b90]">AI-native payment risk intelligence.</p></div>
          <div className="sm:text-right"><nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-[#536078]" aria-label="Footer navigation"><a href="#platform" className="hover:text-[#071426]">Platform</a><a href="#intelligence" className="hover:text-[#071426]">Intelligence</a><a href="#outcomes" className="hover:text-[#071426]">Outcomes</a><Link href="/login" className="hover:text-[#071426]">Demo</Link></nav><p className="mt-4 text-[9px] text-[#919bac]">Built for the Razorpay AI Buildathon 2026</p></div>
        </div>
      </footer>
    </div>
  );
}
