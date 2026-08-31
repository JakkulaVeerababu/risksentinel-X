import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandLogo from "../components/brand/BrandLogo";
import LandingNav from "../components/landing/LandingNav";

import ProductSystem from "../components/landing/ProductSystem";
import AnimatedHeading from "../components/landing/AnimatedHeading";
import FeatureCarousel from "../components/landing/FeatureCarousel";
import WorkspacePreview from "../components/landing/WorkspacePreview";
import ShowcaseFrame from "../components/landing/ShowcaseFrame";
import "../styles/landing.css";

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

export default function ProductLandingPage() {
  return (
    <div className="landing-public-page relative min-h-screen overflow-x-hidden bg-[#F5FAFF] text-[#0B1F3A]">
      <div className="login-visual-wash pointer-events-none fixed inset-0 z-0" />
      <div className="login-diagonal-bands blur-[24px] pointer-events-none fixed inset-0 z-0" aria-hidden="true"><span /><span /><span /><span /><span /></div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <LandingNav />

        <main>
          <section className="landing-hero relative overflow-hidden pt-[106px] text-[#10203a]">
            <div className="landing-container relative flex flex-col items-center pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
              <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#2f6bff]">Risk operations, without the noise</p>
              <AnimatedHeading as="h1" text={"From risk signal to final decision.\nIn one workspace."} accentLine={1} className="landing-hero-title mt-6 max-w-[1100px]" />
              <p className="mt-6 max-w-[680px] text-[16px] leading-[1.8] text-[#63748e] sm:text-[17px]">See the payment. Understand the connections. Make the right call—with connected evidence and policy-controlled decisions.</p>
              <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
                <Link href="/login" className="landing-primary-cta group h-12 px-6 text-[14px]">Open risk workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                <a href="#platform" className="group inline-flex items-center gap-2 py-2 text-[14px] font-semibold text-[#52657f] transition-colors hover:text-[#2f6bff]">Explore the platform <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              </div>
              <div className="mt-8 grid w-full max-w-[840px] divide-y divide-[#d5e0ed] border-y border-[#d5e0ed] text-left sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  ["Real-time", "Transaction risk monitoring"],
                  ["Graph-led", "Connected fraud intelligence"],
                  ["Policy-controlled", "Accountable final decisions"],
                ].map(([title, copy]) => <div key={title} className="px-5 py-4 sm:px-6"><p className="text-[12px] font-semibold text-[#304869]">{title}</p><p className="mt-1.5 text-[12px] text-[#7b8da5]">{copy}</p></div>)}
              </div>
              <p className="mt-5 text-[11px] text-[#74849a]">Built for analysts, risk teams and developers.</p>
            </div>
          </section>

          <section id="platform" className="landing-editorial-section">
            <div className="landing-container landing-split-grid">
              <div className="max-w-[480px]">
                <p className="text-[12px] font-semibold text-[#2f6bff]">The decision workspace</p>
                <h2 className="landing-editorial-title mt-4">Built for the moment risk becomes real.</h2>
                <p className="mt-6 max-w-[410px] text-[16px] leading-[1.8] text-[#64758d]">A payment moves through four accountable systems. Each adds evidence. Only policy makes the final call.</p>
                <a href="#outcomes" className="group mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-[#2f6bff]">See the complete workflow <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              </div>
              <div className="min-w-0">
                <ShowcaseFrame compact>
                  <ProductSystem />
                </ShowcaseFrame>
              </div>
            </div>
          </section>

          <section id="intelligence" className="landing-editorial-section relative overflow-hidden">
            <div className="landing-container landing-split-grid relative">
              <div>
                <p className="text-[12px] font-semibold text-[#255df5]">Graph intelligence</p>
                <AnimatedHeading text="Investigate the relationship, not only the payment." className="landing-editorial-title mt-4 max-w-[620px]" />
              </div>

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

          <section className="landing-editorial-section">
            <div className="landing-container landing-split-grid">
              <div>
                <p className="text-[12px] font-semibold text-[#255df5]">Investigation intelligence</p>
                <h2 className="landing-section-title mt-4">AI recommends.<br />Policy decides.</h2>
                <p className="landing-section-copy mt-6 max-w-[470px]">The investigation agent compresses evidence into a reviewable recommendation. It never bypasses the enforcement boundary.</p>
                <div className="mt-8 border-l-2 border-[#315efb] pl-4"><p className="text-[11px] font-semibold text-[#17233b]">Clear ownership by design</p><p className="mt-2 text-[12px] leading-5 text-[#6c788c]">Models detect risk. The agent explains. Deterministic policy allows, reviews or blocks.</p></div>
              </div>

              <ShowcaseFrame tone="pearl">
              <div className="landing-investigation-panel">
                <div className="flex items-center justify-between border-b border-[#dfe5ee] py-4"><div><p className="text-[12px] font-semibold text-[#17233b]">Investigation output</p><p className="mt-1 font-mono text-[9px] text-[#818da0]">CASE-RSX184 · Evidence bundle 04</p></div><span className="text-[9px] font-semibold text-[#255df5]">Policy aware</span></div>
                <div>
                  {observedSignals.map(([label, value, source], index) => <div key={label} className={`grid gap-2 py-4 sm:grid-cols-[1fr_1.25fr_.7fr] sm:items-center ${index < observedSignals.length - 1 ? "border-b border-[#edf0f5]" : ""}`}><span className="text-[10px] font-medium text-[#778398]">{label}</span><span className="text-[12px] font-semibold text-[#263249]">{value}</span><span className="text-left font-mono text-[9px] text-[#8b95a6] sm:text-right">{source}</span></div>)}
                </div>
                <div className="grid border-t border-[#dfe5ee] bg-[#f7f9fc] sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="p-5"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-[#7d889a]">Agent recommendation</p><p className="mt-2 text-[16px] font-semibold text-[#17233b]">Escalate to BLOCK review</p><p className="mt-1 text-[10px] text-[#69758a]">Confidence: High · Evidence sources: 4</p></div>
                  <div className="border-t border-[#dfe5ee] p-5 sm:border-l sm:border-t-0"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-[#7d889a]">Enforcement owner</p><p className="mt-2 font-mono text-[12px] font-bold text-[#255df5]">POLICY ENGINE</p></div>
                </div>
              </div>
              </ShowcaseFrame>
            </div>
          </section>

          <section className="landing-editorial-section relative overflow-hidden">
            <div className="landing-container relative">
              <div className="landing-section-header">
                <div><p className="text-[12px] font-semibold text-[#255df5]">Decision trail</p><AnimatedHeading text="A decision your team can replay." className="landing-section-title mt-4 max-w-[760px]" /></div>
                <div><p className="landing-section-copy max-w-[520px]">Every system contribution is timestamped, attributable and available for review.</p><p className="mt-4 font-mono text-[11px] font-semibold text-[#255df5]">169 ms · payment received to policy enforced</p></div>
              </div>

              <div className="mt-10 sm:mt-12"><ShowcaseFrame compact>
              <div className="landing-trace-panel relative overflow-hidden rounded-[14px] border border-[#d8e1ed] bg-white">
                <div className="grid border-b border-[#e2e7ef] bg-[#f7f9fc] px-5 py-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:px-7"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8792a4]">Elapsed</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.14em] text-[#8792a4] sm:mt-0">System contribution</p><p className="mt-1 font-mono text-[9px] text-[#8792a4] sm:mt-0">TRACE DR-10428</p></div>
                <div className="relative">
                  <div className="absolute bottom-6 left-[124px] top-6 hidden w-px bg-[#dfe5ee] sm:block" />
                  {decisionTrail.map(([time, event, detail], index) => <div key={time} className={`relative grid gap-2 px-5 py-3.5 sm:grid-cols-[96px_16px_1fr] sm:items-center sm:gap-4 sm:px-7 ${index < decisionTrail.length - 1 ? "border-b border-[#edf0f5]" : "bg-[#fff5f4]"}`}><time className="font-mono text-[9px] text-[#7e899b]">{time}</time><span className={`relative z-10 hidden h-2 w-2 border-2 ring-4 ring-white sm:block ${index === decisionTrail.length - 1 ? "border-[#d14338] bg-[#d14338]" : "border-[#2f6bff] bg-white"}`} /><div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"><p className={`text-[11px] font-semibold ${index === decisionTrail.length - 1 ? "text-[#b9342d]" : "text-[#263249]"}`}>{event}</p><p className={`font-mono text-[9px] ${index === decisionTrail.length - 1 ? "font-bold text-[#b9342d]" : "text-[#7b8799]"}`}>{detail}</p></div></div>)}
                </div>
              </div>
              </ShowcaseFrame></div>
            </div>
          </section>

          <section id="capabilities" className="landing-editorial-section relative overflow-hidden">
            <div className="landing-container relative">
              <div className="landing-section-header">
                <div>
                  <p className="text-[12px] font-semibold text-[#2f6bff]">Core capabilities</p>
                  <AnimatedHeading text="Everything your fraud team needs to move from signal to action." className="landing-editorial-title mt-4 max-w-[760px]" />
                </div>
                <p className="max-w-[430px] text-[15px] leading-[1.8] text-[#6a7a91]">From the first alert to the final audit. Explore the tools that bring your risk operations together.</p>
              </div>
              <FeatureCarousel />
            </div>
          </section>

          <section id="outcomes" className="landing-editorial-section relative overflow-hidden">
            <div className="landing-container landing-split-grid relative">
              <div className="max-w-[460px]">
                <p className="text-[12px] font-semibold text-[#2f6bff]">See it in action</p>
                <h2 className="landing-editorial-title mt-4">See a payment become a decision.</h2>
                <p className="mt-6 max-w-[390px] text-[16px] leading-[1.8] text-[#64758d]">Your entire risk operation, in one view. Follow a payment from its first signal to an outcome your team can explain.</p>
                <Link href="/login" className="landing-primary-cta group mt-8 h-12 px-6 text-[13px]">Open workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                <p className="mt-4 text-[11px] text-[#74849a]">Monitoring, investigation and policy, connected.</p>
              </div>
              <div className="min-w-0"><ShowcaseFrame tone="mint"><WorkspacePreview /></ShowcaseFrame></div>
            </div>
          </section>

          <section id="governance" data-navigation-tone="dark" className="landing-governance">
            <div className="landing-container relative">
              <div className="governance-heading-grid">
                <div>
                  <p className="governance-eyebrow">Governed decisioning</p>
                  <AnimatedHeading text="One evidence bundle. One accountable outcome." className="governance-heading" />
                </div>
                <div className="governance-intro">
                  <p>Every contributor remains visible from initial score to final enforcement. Recommendations inform the decision; policy owns it.</p>
                </div>
              </div>

              <ol className="governance-flow" aria-label="Decision evidence flow">
                {[
                  ["Risk model", "94 / 100", "Calibrated risk score"],
                  ["Graph", "High-risk cluster", "11 linked identities"],
                  ["Agent", "Recommend block", "Evidence-backed"],
                  ["Policy", "RS-204", "Rule triggered"],
                  ["Final decision", "BLOCK", "Enforced in 169 ms"],
                ].map(([label, value, detail], index) => (
                  <li key={label} className="governance-step" data-final={index === 4}>
                    <span className="governance-step-number">0{index + 1}</span>
                    <p className="governance-step-label">{label}</p>
                    <p className="governance-step-value">{value}</p>
                    <p className="governance-step-detail">{detail}</p>
                    {index < 4 && <ArrowRight aria-hidden="true" className="governance-step-arrow" />}
                  </li>
                ))}
              </ol>
              <div className="governance-flow-caption"><span>Payment decision workflow · Policy-controlled</span><span>Fully attributable · Ready for audit</span></div>
            </div>
          </section>
        </main>

        <footer className="landing-footer">
          <div className="landing-container">
            <div className="landing-footer-main">
              <div><BrandLogo /><p>Payment risk intelligence. Accountable by design.</p></div>
              <nav aria-label="Footer navigation"><a href="#platform">Platform</a><a href="#intelligence">Intelligence</a><a href="#outcomes">Outcomes</a><Link href="/login" className="landing-footer-demo">Open workspace <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></nav>
            </div>
            <div className="landing-footer-meta"><p>RiskSentinel X · Payment risk intelligence</p><p>Evidence connected. Decisions accountable.</p></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
