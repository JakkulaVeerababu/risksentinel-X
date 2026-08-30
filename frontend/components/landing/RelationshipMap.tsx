"use client";

type RelationshipMapProps = {
  compact?: boolean;
  onSelect?: (kind: string) => void;
};

const nodes = [
  { kind: "Device", value: "DVC-9821", meta: "11 linked identities", left: "14%", top: "24%", tone: "default" },
  { kind: "Customer", value: "Aarav S.", meta: "Account age 2 days", left: "14%", top: "70%", tone: "default" },
  { kind: "IP address", value: "49.37.***.82", meta: "Residential network", left: "50%", top: "13%", tone: "default" },
  { kind: "Payment", value: "pay_PM71JD29", meta: "₹48,900 · risk 94", left: "50%", top: "46%", tone: "selected" },
  { kind: "Merchant", value: "Nova Electronics", meta: "Refund rate 4.8%", left: "86%", top: "24%", tone: "default" },
  { kind: "Instrument", value: "Card ••8219", meta: "Used by 6 accounts", left: "86%", top: "70%", tone: "default" },
  { kind: "Cluster", value: "FRC-0184", meta: "11 identities · coordinated", left: "50%", top: "84%", tone: "cluster" },
] as const;

export default function RelationshipMap({ compact = false, onSelect }: RelationshipMapProps) {
  return (
    <div className="relative">
      <div className={`relative hidden overflow-hidden rounded-[8px] border border-[#dbe4f1] bg-[#fbfcff] sm:block ${compact ? "h-[318px]" : "h-[430px]"}`} aria-label="Relationship map linking a payment to associated customer, device, IP, merchant, instrument and fraud cluster">
        <div className="absolute inset-0 landing-relationship-grid" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/70 to-transparent" />

        <svg viewBox="0 0 760 430" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`relationship-line-${compact ? "compact" : "full"}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b8c8e6" />
              <stop offset=".52" stopColor="#5f8cf7" />
              <stop offset="1" stopColor="#b8c8e6" />
            </linearGradient>
          </defs>
          <g fill="none" stroke={`url(#relationship-line-${compact ? "compact" : "full"})`} strokeWidth="1.45" vectorEffect="non-scaling-stroke">
            <path d="M138 103 C230 103 285 166 380 198" />
            <path d="M138 301 C232 301 286 232 380 198" />
            <path d="M380 56 C380 104 380 143 380 198" />
            <path d="M622 103 C530 103 475 166 380 198" />
            <path d="M622 301 C530 301 474 232 380 198" />
            <path d="M380 198 C380 254 380 301 380 360" stroke="#316cff" strokeWidth="2" />
          </g>
          <g fill="none" stroke="#aec2eb" strokeDasharray="4 7" strokeWidth="1" vectorEffect="non-scaling-stroke">
            <path d="M138 103 C250 43 510 43 622 103" />
            <path d="M138 301 C250 363 510 363 622 301" />
          </g>
        </svg>

        <div className="absolute left-4 top-4 flex items-center gap-5 border-b border-[#d9e3f1] bg-white/90 px-2 py-1.5 text-[9px] font-medium text-[#68758a]">
          <span><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#316cff]" />Direct evidence</span>
          <span><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#b5c2d7]" />Inferred link</span>
        </div>

        {nodes.map((node) => (
          <button
            key={node.kind}
            type="button"
            onClick={() => onSelect?.(node.kind)}
            disabled={!onSelect}
            className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-[4px] border text-left transition duration-200 ${onSelect ? "hover:-translate-y-[54%] hover:shadow-[0_10px_24px_rgba(37,70,130,.10)]" : "cursor-default"} ${
              node.tone === "selected"
                ? "w-[164px] border-[#8eafff] bg-white px-4 py-3 shadow-[0_10px_26px_rgba(47,107,255,.12)]"
                : node.tone === "cluster"
                  ? "w-[186px] border-[#bed0fb] bg-[#edf3ff] px-4 py-3"
                  : "w-[138px] border-[#d6e0ed] bg-white px-3.5 py-2.5 shadow-[0_5px_16px_rgba(32,55,96,.06)]"
            }`}
            style={{ left: node.left, top: node.top }}
          >
            {node.tone === "selected" && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#316cff]" />}
            <span className={`block text-[8px] font-bold uppercase tracking-[.12em] ${node.tone === "selected" ? "text-[#255df5]" : node.tone === "cluster" ? "text-[#315cae]" : "text-[#8793a6]"}`}>{node.kind}</span>
            <span className="mt-1.5 block truncate font-mono text-[10px] font-semibold text-[#1c2941]">{node.value}</span>
            <span className="mt-1 block truncate text-[8px] text-[#7c889b]">{node.meta}</span>
          </button>
        ))}
      </div>

      <div className="divide-y divide-[#e7ebf2] rounded-[8px] border border-[#dce3ed] bg-white sm:hidden">
        {nodes.map((node) => (
          <button key={node.kind} type="button" onClick={() => onSelect?.(node.kind)} disabled={!onSelect} className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 text-left disabled:cursor-default ${node.tone === "selected" ? "bg-[#f3f7ff]" : ""}`}>
            <span><span className="block text-[8px] font-bold uppercase tracking-[.1em] text-[#8793a6]">{node.kind}</span><span className="mt-1 block font-mono text-[10px] font-semibold text-[#263249]">{node.value}</span></span>
            <span className="text-[9px] text-[#7c889b]">{node.meta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
