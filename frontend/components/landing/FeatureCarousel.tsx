"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const features = [
  { label: "Real-time monitoring", accent: "Understand every payment. ", headline: "Act on the risk that matters.", copy: "Review transaction signals, risk scores and policy outcomes from one live operating view.", detail: "Monitoring · Transactions · Risk queue", href: "/transactions" },
  { label: "Graph intelligence", accent: "Connect the evidence. ", headline: "Uncover the bigger pattern.", copy: "Follow the relationships between identities, devices, networks, merchants and payment instruments.", detail: "Shared infrastructure · Linked identities", href: "/graph" },
  { label: "Assisted investigation", accent: "From scattered signals to a clear recommendation. ", headline: "Give your analysts the full picture.", copy: "Bring the strongest evidence into a reviewable investigation brief, with policy retaining control of the final decision.", detail: "Evidence-led · Analyst-ready · Policy-aware", href: "/investigation" },
  { label: "Case management", accent: "Keep the whole case together. ", headline: "Nothing lost between teams.", copy: "Review flagged cases, inspect their evidence and follow the decision history in one place.", detail: "Cases · Evidence · Decision history", href: "/cases" },
  { label: "Policy controls", accent: "Your rules. ", headline: "An accountable final decision.", copy: "Create and review the rules that determine when to allow, review or block a payment.", detail: "Rule conditions · Versions · Enforcement", href: "/policies" },
  { label: "Attack simulator", accent: "Test the attack before it reaches your business. ", headline: "See how the entire risk stack responds.", copy: "Run synthetic payment scenarios through models, graph evidence, investigation and policy in an isolated environment.", detail: "Synthetic scenarios · End-to-end evaluation", href: "/simulator" },
  { label: "Risk analytics", accent: "See what is changing. ", headline: "Know where to look next.", copy: "Explore payment quality, risk distributions and decision performance across the operating stack.", detail: "Trends · Distributions · Operations", href: "/analytics" },
  { label: "Model evaluation", accent: "Understand model quality. ", headline: "Beyond a single score.", copy: "Inspect held-out evaluation metrics and review how the fraud detection model performs.", detail: "Held-out data · Precision · Recall", href: "/models" },
  { label: "Audit trail", accent: "Every action leaves a record. ", headline: "Replay how a decision was reached.", copy: "Trace risk signals, investigation recommendations, policy evaluations and analyst actions with attributable events.", detail: "Timestamped · Traceable · Reviewable", href: "/audit" },
  { label: "Fraud clusters", accent: "Find coordinated activity. ", headline: "Not just individual alerts.", copy: "Inspect linked identities and shared infrastructure behind suspicious payment clusters.", detail: "Cluster evidence · Exposure · Identities", href: "/clusters" },
  { label: "Recommendations", accent: "Put the next action in focus. ", headline: "With evidence behind it.", copy: "Review investigation guidance and the recommended next steps for flagged scenarios.", detail: "Evidence-backed · Human review", href: "/recommendations" },
  { label: "Developer workspace", accent: "Bring the risk stack into your workflow. ", headline: "Start with clear, practical API examples.", copy: "Explore transaction scoring, end-to-end processing, graph context and service health from the developer workspace.", detail: "Request examples · Responses · API health", href: "/developer" },
];

export default function FeatureCarousel() {
  const [count, setCount] = useState(3);
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 640px)");
    const update = () => {
      const nextCount = desktop.matches ? 3 : tablet.matches ? 2 : 1;
      setCount(nextCount);
      setStart(previous => Math.min(previous, features.length - nextCount));
    };
    update();
    desktop.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);

  const move = (delta: number) => {
    setDirection(delta);
    setStart(previous => Math.max(0, Math.min(features.length - count, previous + delta)));
  };
  const featuredIndex = [2, 0, 1][start % 3];
  const columns = count === 3
    ? [0, 1, 2].map(index => index === featuredIndex ? "1.6fr" : "1fr").join(" ")
    : "repeat(" + count + ", minmax(0, 1fr))";
  const position = String(start + 1).padStart(2, "0") + "–" + String(start + count).padStart(2, "0");

  return (
    <div className="feature-carousel mt-8 sm:mt-10" role="region" aria-roledescription="carousel" aria-label="Core capabilities" tabIndex={0} onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); move(-1); }
    }}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-[12px] text-[#65748a]">One platform. <span className="font-semibold text-[#25354b]">12 connected capabilities.</span></p>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#7f8a9c]" aria-live="polite" aria-atomic="true"><span className="sr-only">Showing features </span>{position}<span className="mx-2 text-[#b7c2d0]">/</span>12</span>
      </div>

      <div className="relative">
        <div className="overflow-hidden p-1 -m-1" id="feature-slides">
          <div className="relative grid items-stretch gap-4" style={{ gridTemplateColumns: columns }}>
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              {features.slice(start, start + count).map((feature, index) => (
                <motion.article
                  key={feature.label}
                  layout={reduceMotion ? false : "position"}
                  custom={direction}
                  variants={{
                    enter: (value: number) => ({ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : value * 48 }),
                    active: { opacity: 1, x: 0 },
                    exit: (value: number) => ({ opacity: 0, x: reduceMotion ? 0 : value * -48 }),
                  }}
                  initial="enter"
                  animate="active"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : .38, ease: [.22, 1, .36, 1], opacity: { duration: reduceMotion ? 0 : .18 } }}
                  aria-roledescription="slide"
                  aria-label={(start + index + 1) + " of " + features.length + ": " + feature.label}
                  data-featured={count === 3 && index === featuredIndex}
                  className="feature-card"
                >
                  <div className="feature-card-surface">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[13px] font-semibold text-[#465369]">{feature.label}</p>
                    <span className="font-mono text-[10px] text-[#99a3b2]">{String(start + index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className={"mt-7 font-semibold leading-[1.2] tracking-[-.045em] text-[#17283e] " + (count === 3 && index === featuredIndex ? "text-[30px] xl:text-[34px]" : "text-[25px]")}>
                    <span className="text-[#2f6bff]">{feature.accent}</span>{feature.headline}
                  </h3>
                  <div className="mt-auto pt-8">
                    <p className="text-[13px] leading-[1.7] text-[#68768a]">{feature.copy}</p>
                    <p className="mt-5 border-t border-[#e7ebf1] pt-4 text-[10px] leading-5 text-[#8290a3]">{feature.detail}</p>
                    <Link href={feature.href} aria-label={"Explore " + feature.label.toLowerCase()} className="group mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#2f6bff]">Explore feature <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                  </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <button type="button" onClick={() => move(-1)} disabled={start === 0} aria-label="Previous feature" aria-controls="feature-slides" className="carousel-arrow carousel-arrow-previous"><ArrowLeft className="h-[18px] w-[18px]" /></button>
        <button type="button" onClick={() => move(1)} disabled={start + count >= features.length} aria-label="Next feature" aria-controls="feature-slides" className="carousel-arrow carousel-arrow-next"><ArrowRight className="h-[18px] w-[18px]" /></button>
      </div>

      <div className="relative mt-6 h-[3px] overflow-hidden rounded-full bg-[#dbe3ee]" aria-hidden="true">
        <motion.span className="absolute inset-y-0 rounded-full bg-[#2f6bff]" animate={{ left: (start / features.length * 100) + "%", width: (count / features.length * 100) + "%" }} transition={{ duration: reduceMotion ? 0 : .38, ease: [.22, 1, .36, 1] }} />
      </div>
    </div>
  );
}
