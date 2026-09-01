"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function RecordInspector({ recordId, title, subtitle, onClose, children }: { recordId: string; title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const panel = heading.current?.closest("aside");
    if (panel && getComputedStyle(panel).position !== "sticky") heading.current?.scrollIntoView({ block: "center" });
  }, [recordId]);
  return <aside id="record-inspector" className="record-card record-inspector" aria-labelledby="inspector-heading" onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); close.current(); } }}>
    <header className="inspector-heading"><div><p>{subtitle}</p><h2 id="inspector-heading" tabIndex={-1} ref={heading}>{title}</h2></div><button className="record-icon-button" type="button" aria-label="Close details" onClick={onClose}><X size={18} /></button></header>
    {children}
  </aside>;
}
