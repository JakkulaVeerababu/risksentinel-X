import React from "react";
import { RefreshCw } from "lucide-react";

export const PageHeader = ({ title, description, eyebrow = "Risk operations", actions }: { title: string; description: string; eyebrow?: string; actions?: React.ReactNode }) => (
  <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
    <div>
      <p className="rsx-eyebrow mb-2">{eyebrow}</p>
      <h1 className="balance text-[29px] font-semibold leading-[1.1] tracking-[-0.038em] text-[#0b1739] sm:text-[34px]">{title}</h1>
      <p className="mt-2 max-w-3xl text-[13px] leading-5 text-[#657187] sm:text-[14px] sm:leading-6">{description}</p>
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl border border-[#e7ebf1] bg-gradient-to-r from-[#f0f3f8] via-[#f8f9fb] to-[#f0f3f8] ${className ?? ""}`} />
);

export const ErrorState = ({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-[#f4cfca] border-t-2 border-t-[#d14338] bg-white px-6 py-12 text-center">
    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#c34138]">Data unavailable</p>
    <h3 className="mt-3 text-[15px] font-bold text-[#8f2722]">{title}</h3>
    <p className="mt-1.5 max-w-lg text-[12px] leading-5 text-[#9b514d]">{description}</p>
    {onRetry && <button onClick={onRetry} className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-[#ebbbb6] bg-white px-3 text-[11px] font-bold text-[#b9362e] hover:bg-[#fffafa]"><RefreshCw className="h-3.5 w-3.5" /> Try again</button>}
  </div>
);

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rsx-card ${className}`}>{children}</div>
);

export { Badge } from "./Badge";
export { DecisionBadge } from "./DecisionBadge";
export { RiskBadge } from "./RiskBadge";

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#d8dee8] bg-[#fafbfd] px-6 py-12 text-center">
    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a95a8]">No results</p>
    <h3 className="mt-3 text-[15px] font-bold text-[#344158]">{title}</h3>
    <p className="mt-1.5 max-w-lg text-[12px] leading-5 text-[#7c8799]">{description}</p>
  </div>
);
