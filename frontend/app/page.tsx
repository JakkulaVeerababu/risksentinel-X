import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import BrandLogo from "../components/brand/BrandLogo";
import LandingNav from "../components/landing/LandingNav";

import ProductSystem from "../components/landing/ProductSystem";
import ScrollFadeIn from "../components/landing/ScrollFadeIn";

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

const coreFeatures = [
  {
    label: "Real-time risk engine",
    accent: "Score every payment before money moves. ",
    headline: "Calibrated models return an explainable outcome in under 200 milliseconds.",
    copy: "Evaluate device, velocity, merchant and payment features against active controls without slowing checkout.",
    proof: "186 ms average decision latency",
    href: "/dashboard",
  },
  {
    label: "Graph intelligence",
    accent: "Expose coordinated fraud rings, ",
    headline: "not only isolated high-risk payments.",
    copy: "Connect accounts, devices, IPs, instruments and merchants into one reviewable relationship map.",
    proof: "11 identities resolved in FRC-0184",
    href: "/graph",
  },
  {
    label: "Investigation and policy",
    accent: "Turn connected evidence into one accountable case. ",
    headline: "AI explains the risk; deterministic policy owns the decision.",
    copy: "Compress the strongest signals into an analyst-ready brief, apply the active rule version and preserve the complete decision trail for audit.",
    proof: "Evidence → recommendation → enforced outcome",
    href: "/investigation",
  },
];

export default function ProductLandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5FAFF] text-[#0B1F3A]">
      <div className="login-visual-wash pointer-events-none fixed inset-0 z-0" />
      <div className="login-diagonal-bands blur-[24px] pointer-events-none fixed inset-0 z-0" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      
      <div className="relative z-10 flex min-h-screen flex-col">
        <LandingNav />

        <main>
          <section className="relative overflow-hidden pt-[72px] text-[#10203a]">
            <div className="landing-container relative flex flex-col items-center text-center pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-32 lg:pt-16">
              <div className="max-w-[900px] mx-auto flex flex-col items-center">
                <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#1364F1]">Risk operations, without the noise</p>
                
                <h1 className="mt-5 text-[42px] font-bold leading-[1.02] tracking-[-.04em] text-[#0B1F3A] sm:text-[56px] xl:text-[68px]">
                  From risk signal to final decision.<br />In one workspace.
                </h1>
                
                <p className="mt-6 max-w-[760px] text-[17px] leading-[1.55] text-[#61718D] sm:text-[18px]">
                  Trace every payment from its first risk signal through connected evidence, AI-assisted investigation, and deterministic policy enforcement.
                </p>

                <div className="mt-[34px] flex flex-col gap-6 sm:flex-row sm:items-center justify-center">
                  <Link href="/login" className="group flex h-[50px] items-center justify-center rounded-[6px] bg-[#1364F1] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#0E54CD]">
                    Open Risk Workspace <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                  <a href="#platform" className="group inline-flex items-center justify-center gap-2 text-[15px] font-semibold text-[#61718D] transition-colors hover:text-[#1364F1]">
                    <Play className="h-4 w-4 fill-current" />Watch how it works
                  </a>
                </div>

                <div className="mt-16 grid max-w-[760px] border-y border-[#c7d6ea] sm:grid-cols-3 w-full text-left divide-y sm:divide-y-0 sm:divide-x divide-[#c7d6ea]">
                  {[
                    ["REAL-TIME", "Transaction risk monitoring"],
                    ["GRAPH-LED", "Connected fraud intelligence"],
                    ["POLICY-CONTROLLED", "Deterministic final decisions"],
                  ].map(([value, label], index) => (
                    <div key={label} className={`py-4 ${index > 0 ? "sm:pl-6" : "sm:pr-6"}`}>
                      <p className="text-[11px] font-semibold tracking-wide text-[#17345f] uppercase">{value}</p>
                      <p className="mt-1.5 text-[13.5px] text-[#6f7f97]">{label}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-5 flex w-full max-w-[760px] items-center justify-between text-[11.5px] text-[#8190A6]">
                  <span>RiskSentinel X · AI Risk Intelligence Platform</span>
                  <span>Seeded fraud-demo environment</span>
                </div>
              </div>
            </div>
          </section>

        <section id="platform" className="scroll-mt-[112px] border-b border-[#e3e8f0]/40 py-16 sm:py-20">
          <div className="landing-container">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <h2 className="landing-section-title max-w-[700px]">Built for the moment risk becomes real.</h2>
              <div className="lg:justify-self-end"><p className="landing-section-copy max-w-[580px]">A payment moves through four accountable systems. Each step contributes evidence. Only policy returns the final outcome.</p><p className="mt-4 text-[11px] font-semibold text-[#255df5]">Select a stage to inspect the decision path.</p></div>
            </div>
            <div className="mt-10 sm:mt-12"><ProductSystem /></div>
          </div>
        </section>

        <section id="intelligence" className="relative scroll-mt-[112px] overflow-hidden border-b border-[#e3e8f0]/40 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(224,236,255,.55),transparent_44%,rgba(197,249,248,.48))]" />
          <div className="landing-container relative grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-20">
            <ScrollFadeIn>
              <p className="text-[12px] font-semibold text-[#255df5]">Graph intelligence</p>
              <h2 className="landing-section-title mt-4 max-w-[760px]">Investigate the relationship, not only the payment.</h2>
            </ScrollFadeIn>

            <div>
              <p className="landing-section-copy max-w-[520px]">Risk hides in the connections between identities, infrastructure and commerce. Graph intelligence turns those relationships into reviewable evidence.</p>
              <div className="mt-8 border-y border-[#cbd8e8]">
                {[
                  ["01", "Shared infrastructure", "Device, network and instrument evidence"],
                  ["02", "Coordinated identities", "Eleven accounts resolved into one cluster"],
                  ["03", "Reviewable context", "Every direct and inferred link remains visible"],
                ].map(([number, title, detail], index) => <div key={title} className={`grid grid-cols-[34px_1fr] gap-3 py-4 ${index < 2 ? "border-b border-[#d8e2ef]" : ""} ${index === 1 ? "border-l-2 border-l-[#2f6bff] bg-white/55 pl-3" : ""}`}><span className="font-mono text-[8px] text-[#8896aa]">{number}</span><span><span className="block text-[11px] font-semibold text-[#1c2941]">{title}</span><span className="mt-1 block text-[9px] leading-4 text-[#738198]">{detail}</span></span></div>)}
              </div>
              <Link href="/graph" className="group mt-7 inline-flex items-center gap-2 self-start text-[11px] font-semibold text-[#255df5]">Open graph workspace <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e3e8f0]/40 py-20 sm:py-28">
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

        <section className="relative overflow-hidden border-b border-[#e3e8f0]/40 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(232,240,255,.52),transparent_45%,rgba(223,250,249,.45))]" />
          <div className="landing-container relative">
            <div className="grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
              <div><p className="text-[12px] font-semibold text-[#255df5]">Decision trail</p><h2 className="landing-section-title mt-4 max-w-[760px]">A decision your team can replay.</h2></div>
              <div className="lg:justify-self-end"><p className="landing-section-copy max-w-[520px]">Every system contribution is timestamped, attributable and available for review.</p><p className="mt-4 font-mono text-[11px] font-semibold text-[#255df5]">169 ms · payment received to policy enforced</p></div>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-[14px] border border-[#d8e1ed] bg-white shadow-[0_22px_60px_-44px_rgba(18,45,87,.34)] sm:mt-12">
              <div className="grid border-b border-[#e2e7ef] bg-[#f7f9fc] px-5 py-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:px-7"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8792a4]">Elapsed</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.14em] text-[#8792a4] sm:mt-0">System contribution</p><p className="mt-1 font-mono text-[9px] text-[#8792a4] sm:mt-0">TRACE DR-10428</p></div>
              <div className="relative">
                <div className="absolute bottom-6 left-[124px] top-6 hidden w-px bg-[#dfe5ee] sm:block" />
                {decisionTrail.map(([time, event, detail], index) => <div key={time} className={`relative grid gap-2 px-5 py-3.5 sm:grid-cols-[96px_16px_1fr] sm:items-center sm:gap-4 sm:px-7 ${index < decisionTrail.length - 1 ? "border-b border-[#edf0f5]" : "bg-[#fff5f4]"}`}><time className="font-mono text-[9px] text-[#7e899b]">{time}</time><span className={`relative z-10 hidden h-2 w-2 border-2 ring-4 ring-white sm:block ${index === decisionTrail.length - 1 ? "border-[#d14338] bg-[#d14338]" : "border-[#2f6bff] bg-white"}`} /><div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"><p className={`text-[11px] font-semibold ${index === decisionTrail.length - 1 ? "text-[#b9342d]" : "text-[#263249]"}`}>{event}</p><p className={`font-mono text-[9px] ${index === decisionTrail.length - 1 ? "font-bold text-[#b9342d]" : "text-[#7b8799]"}`}>{detail}</p></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-[#dce4ef] bg-[#eef3f9] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(217,232,255,.58),transparent_42%,rgba(205,248,247,.45))]" />
          <div className="landing-container relative">
            <div className="grid gap-7 lg:grid-cols-[1fr_.75fr] lg:items-end">
              <div><p className="text-[12px] font-semibold text-[#255df5]">Core capabilities</p><h2 className="landing-section-title mt-4 max-w-[860px]">Everything your fraud team needs to move from signal to action.</h2></div>
              <p className="landing-section-copy max-w-[500px] lg:justify-self-end">One operating layer for real-time detection, connected evidence, assisted investigation and policy-owned enforcement.</p>
            </div>

            <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-12">
              {coreFeatures.map((feature, index) => (
                <article key={feature.label} className={`group flex min-h-[410px] flex-col overflow-hidden rounded-[10px] border border-[#dce3ed] bg-white p-7 shadow-[0_16px_40px_-34px_rgba(18,42,80,.38)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-34px_rgba(18,42,80,.42)] sm:p-8 ${index < 2 ? "lg:col-span-3" : "lg:col-span-6"}`}>
                  <div className="flex items-start justify-between gap-4"><p className="text-[12px] font-semibold text-[#334158]">{feature.label}</p><span className="font-mono text-[9px] text-[#98a3b4]">0{index + 1}</span></div>
                  <h3 className={`mt-8 font-semibold leading-[1.2] tracking-[-.04em] text-[#17233b] ${index === 2 ? "text-[29px] sm:text-[36px]" : "text-[22px] sm:text-[25px]"}`}><span className="text-[#2f6bff]">{feature.accent}</span>{feature.headline}</h3>
                  <div className="mt-auto pt-10"><p className="text-[11px] leading-5 text-[#68758a]">{feature.copy}</p><p className="mt-5 border-t border-[#e2e7ef] pt-4 font-mono text-[9px] font-semibold text-[#536078]">{feature.proof}</p><Link href={feature.href} className="group/link mt-6 inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#2f6bff] px-4 text-[11px] font-semibold text-white transition-colors hover:bg-[#2459e6]">Explore feature <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" /></Link></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="outcomes" className="scroll-mt-[112px] border-y border-[#e2e7ef]/40 py-20 sm:py-28">
          <div className="landing-container text-center">
            <h2 className="landing-section-title mx-auto max-w-[840px]">See a payment become a decision.</h2>
            <p className="landing-section-copy mx-auto mt-5 max-w-[610px]">Follow the complete path from incoming payment to enforced outcome in the live workspace.</p>

            <Link href="/login" className="landing-primary-cta group mx-auto mt-10 h-12 px-6 text-[13px]">Launch live demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <p className="mt-3 text-[10px] text-[#7d899b]">No account required.</p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#2f6bff] py-14 text-white sm:py-16">
          <div className="pointer-events-none absolute inset-0 landing-risk-grid opacity-[.10]" />
          <div className="pointer-events-none absolute -right-28 -top-56 h-[680px] w-[220px] rotate-[17deg] bg-white/[.07]" />
          <div className="pointer-events-none absolute -bottom-52 right-[22%] h-[620px] w-[150px] rotate-[17deg] bg-[#77e8ff]/[.11]" />
          <div className="landing-container relative">
            <div className="grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] font-semibold text-white/72">Governed decisioning</p>
                <h2 className="mt-4 max-w-[680px] text-[38px] font-semibold leading-[1.03] tracking-[-.052em] sm:text-[52px]">One evidence bundle. One accountable outcome.</h2>
              </div>
              <p className="max-w-[540px] text-[13px] leading-7 text-white/72 lg:justify-self-end">Every contributor remains visible from initial score to final enforcement. Recommendations inform the decision; policy owns it.</p>
            </div>

            <div className="mt-12 grid border-y border-white/30 md:grid-cols-5">
              {[
                ["Risk model", "92 / 100", "Calibrated score"],
                ["Graph", "High-risk cluster", "11 linked identities"],
                ["Agent", "Recommend block", "Evidence-backed"],
                ["Policy", "RS-204", "Rule triggered"],
                ["Final decision", "BLOCK", "Enforced in 169 ms"],
              ].map(([label, value, detail], index) => (
                <div key={label} className={`relative min-h-[136px] px-4 py-5 sm:px-5 ${index > 0 ? "border-t border-white/20 md:border-l md:border-t-0" : ""} ${index === 4 ? "bg-white/[.11]" : ""}`}>
                  <span className="font-mono text-[8px] text-white/55">0{index + 1}</span>
                  <p className="mt-6 text-[9px] font-medium text-white/65">{label}</p>
                  <p className="mt-2 text-[15px] font-semibold text-white">{value}</p>
                  <p className="mt-2 text-[9px] text-white/55">{detail}</p>
                  {index < 4 && <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-[15px] text-white/80 md:block">→</span>}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-2 text-[9px] font-medium text-white/65 sm:flex-row sm:items-center sm:justify-between"><span>Decision record DR-10428 · Policy version 12</span><span>Fully attributable · Ready for audit</span></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e3e8f0]/40 bg-transparent">
        <div className="landing-container grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div><BrandLogo /><p className="mt-3 text-[12px] text-[#6f7b90]">AI-native payment risk intelligence.</p></div>
          <div className="sm:text-right"><nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-[#536078]" aria-label="Footer navigation"><a href="#platform" className="hover:text-[#071426]">Platform</a><a href="#intelligence" className="hover:text-[#071426]">Intelligence</a><a href="#outcomes" className="hover:text-[#071426]">Outcomes</a><Link href="/login" className="hover:text-[#071426]">Demo</Link></nav><p className="mt-4 text-[9px] text-[#919bac]">Built for the Razorpay AI Buildathon 2026</p></div>
        </div>
      </footer>
      </div>
    </div>
  );
}
