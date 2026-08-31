const examplePayments = [
  ["pay_PM71JD29", "Nova Electronics", "₹48,900", "Block"],
  ["pay_PM71JD30", "Urban Supply", "₹12,450", "Review"],
  ["pay_PM71JD31", "Northstar Retail", "₹2,800", "Allow"],
];

export default function WorkspacePreview() {
  return (
    <div className="workspace-preview overflow-hidden rounded-xl border border-[#dbe3ee] bg-white text-left shadow-[0_30px_70px_-35px_rgba(24,54,102,.3)]" aria-label="Risk workspace product preview">
      <div className="flex h-11 items-center justify-between border-b border-[#e6ebf2] px-5"><span className="text-[13px] font-semibold italic tracking-[-.04em] text-[#17283e]">RiskSentinel<span className="text-[#2f6bff]">X</span></span><span className="rounded border border-[#dce5f4] px-2 py-1 text-[9px] font-medium text-[#6f819b]">Product preview</span></div>
      <div className="flex">
        <div className="workspace-preview-sidebar hidden w-[125px] shrink-0 border-r border-[#e6ebf2] bg-[#fcfdff] px-3 py-5 md:block">
          <p className="px-2 text-[8px] font-semibold uppercase tracking-[.12em] text-[#9aa6b6]">Workspace</p>
          {["Overview", "Transactions", "Risk queue", "Cases", "Graph", "Investigation", "Policies"].map((item, index) => <div key={item} className={"mt-1.5 rounded px-2 py-1.5 text-[10px] " + (index === 0 ? "bg-[#ecf2ff] font-semibold text-[#2f6bff]" : "text-[#8090a5]")}>{item}</div>)}
        </div>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[9px] text-[#8b98aa]">Acme Payments</p><h3 className="mt-1 text-[21px] font-semibold tracking-[-.04em] text-[#1c2d44]">Risk overview</h3></div><span className="text-[9px] text-[#8a98ac]">Payment activity</span></div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-[#e4eaf3] border-y border-[#e4eaf3] py-3">
            {[["Linked payments", "43"], ["Connected identities", "11"], ["Risk score", "94"]].map(([label, value], index) => <div key={label} className={index > 0 ? "pl-3" : ""}><p className="text-[9px] leading-4 text-[#8492a6]">{label}</p><p className={"mt-1 text-[22px] font-semibold tracking-[-.04em] " + (index === 2 ? "text-[#d04a42]" : "text-[#243650]")}>{value}</p></div>)}
          </div>
          <div className="mt-4 rounded-md border border-[#dce7ff] bg-[#f4f7ff] p-3"><div className="flex items-center justify-between gap-2"><p className="text-[11px] font-semibold text-[#284478]">Coordinated activity detected</p><span className="font-mono text-[9px] text-[#2f6bff]">FRC-0184</span></div><p className="mt-1.5 text-[10px] leading-4 text-[#7d8ea9]">Shared device and payment evidence across 11 identities.</p></div>
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold text-[#3c4f6b]">Recent decisions</p>
            {examplePayments.map(([id, merchant, amount, decision]) => <div key={id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-[#edf0f5] py-2.5"><div className="min-w-0"><p className="truncate text-[10px] font-medium text-[#5f718d]">{merchant}</p><p className="mt-0.5 font-mono text-[8px] text-[#99a5b6]">{id}</p></div><span className="text-[10px] font-medium text-[#3e516e]">{amount}</span><span className={"w-12 rounded px-1.5 py-1 text-center text-[9px] font-medium " + (decision === "Block" ? "bg-[#fff0ee] text-[#c34c42]" : decision === "Review" ? "bg-[#fff7e8] text-[#9c7026]" : "bg-[#ecf8f2] text-[#308362]")}>{decision}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
