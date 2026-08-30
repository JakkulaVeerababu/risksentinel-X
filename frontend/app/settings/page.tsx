"use client";

import { useState } from "react";
import { Check, ChevronRight, Save } from "lucide-react";
import { PageHeader } from "../../components/ui";

const tabs = [
  { id: "workspace", label: "Workspace" },
  { id: "detection", label: "Detection" },
  { id: "notifications", label: "Notifications" },
  { id: "integrations", label: "Integrations" },
  { id: "access", label: "Access & security" },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-[#255df5]" : "bg-[#cfd5df]"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} /></button>;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("workspace");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ autoBlock: true, graphEnrichment: true, aiReasoning: true, emailCritical: true, emailSummary: true, slackAlerts: false, stepUp: true });
  const toggle = (key: keyof typeof settings) => setSettings((state) => ({ ...state, [key]: !state[key] }));
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); };

  return (
    <div className="rsx-page space-y-5">
      <PageHeader eyebrow="Administration" title="Settings (Demo Workspace)" description="Configure workspace defaults, detection behavior, integrations, notifications, and team access. This is a read-only illustrative view." actions={<button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#255df5] px-3.5 text-[11px] font-bold text-white opacity-75 cursor-not-allowed" disabled><Save className="h-4 w-4" /> Save changes (Demo)</button>} />

      <section className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rsx-card h-fit p-2">
          {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center rounded-md px-3 py-2.5 text-left text-[11px] font-bold transition-colors ${activeTab === tab.id ? "bg-[#edf3ff] text-[#315efb]" : "text-[#657187] hover:bg-[#f6f8fc] hover:text-[#26324a]"}`}><span className="flex-1">{tab.label}</span><ChevronRight className="h-3.5 w-3.5 opacity-60" /></button>)}
          <div className="mt-2 border-l-2 border-[#315efb] bg-[#f4f7ff] p-3"><div className="text-[10px] font-bold text-[#344158]">Workspace protected</div><p className="mt-1.5 text-[10px] leading-4 text-[#708079]">Last security review completed 2 days ago.</p></div>
        </aside>

        <div className="space-y-4">
          {activeTab === "workspace" && <>
            <div className="rsx-card overflow-hidden"><div className="border-b border-[#edf0f5] px-5 py-4"><h2 className="text-[13px] font-bold">Workspace profile</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">Displayed across reports and audit records</p></div><div className="grid gap-4 p-5 sm:grid-cols-2"><label className="text-[10px] font-bold text-[#5f6b80]">Workspace name<input defaultValue="Acme Payments" className="mt-2 h-10 w-full rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] font-medium text-[#27334b] outline-none focus:border-[#7fa6ff]" /></label><label className="text-[10px] font-bold text-[#5f6b80]">Merchant ID<input defaultValue="K8p2xY14" readOnly className="mt-2 h-10 w-full rounded-lg border border-[#e1e6ee] bg-[#f7f9fc] px-3 font-mono text-[11px] text-[#7a8597]" /></label><label className="text-[10px] font-bold text-[#5f6b80]">Default currency<select defaultValue="INR" className="mt-2 h-10 w-full rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] text-[#27334b]"><option>INR</option><option>USD</option><option>EUR</option></select></label><label className="text-[10px] font-bold text-[#5f6b80]">Timezone<select defaultValue="Asia/Kolkata" className="mt-2 h-10 w-full rounded-lg border border-[#dfe5ee] bg-white px-3 text-[11px] text-[#27334b]"><option>Asia/Kolkata</option><option>UTC</option><option>America/New_York</option></select></label></div></div>
            <div className="rsx-card overflow-hidden"><div className="border-b border-[#edf0f5] px-5 py-4"><h2 className="text-[13px] font-bold">Data preferences</h2></div><div className="divide-y divide-[#edf0f5]">{[["Data retention", "Keep investigation evidence and audit events", "365 days"], ["Amount formatting", "Localize currency and large values", "Indian numbering"], ["Default time range", "Initial range used on overview pages", "Last 24 hours"]].map(([title,detail,value]) => <div key={title} className="flex items-center justify-between gap-4 p-5"><div><p className="text-[11px] font-bold text-[#344158]">{title}</p><p className="mt-1 text-[10px] text-[#8791a3]">{detail}</p></div><button className="rounded-lg border border-[#dfe5ee] bg-white px-3 py-2 text-[10px] font-bold text-[#536078]">{value}</button></div>)}</div></div>
          </>}

          {activeTab === "detection" && <div className="rsx-card overflow-hidden"><div className="border-b border-[#edf0f5] px-5 py-4"><h2 className="text-[13px] font-bold">Decision orchestration</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">Controls applied to payment decisions</p></div><div className="divide-y divide-[#edf0f5]">{[
            { key: "autoBlock" as const, title: "Automatic blocking", detail: "Apply BLOCK decisions when policy and confidence thresholds are satisfied", badge: "Recommended" },
            { key: "graphEnrichment" as const, title: "Graph enrichment", detail: "Evaluate shared devices, identities, instruments, and network clusters", badge: "Active" },
            { key: "aiReasoning" as const, title: "Intelligence explanations", detail: "Generate plain-language evidence summaries for analyst review", badge: "Agentic" },
            { key: "stepUp" as const, title: "Trusted-customer step-up", detail: "Prefer additional verification over blocking when trust signals are strong", badge: "Conversion" },
          ].map((item) => <div key={item.key} className="flex items-center justify-between gap-4 p-5"><div><div className="flex flex-wrap items-center gap-2"><p className="text-[11px] font-bold text-[#344158]">{item.title}</p><span className="rounded-full bg-[#edf3ff] px-2 py-0.5 text-[10px] font-extrabold text-[#255df5]">{item.badge}</span></div><p className="mt-1 text-[10px] leading-4 text-[#8791a3]">{item.detail}</p></div><Toggle label={item.title} checked={settings[item.key]} onChange={() => toggle(item.key)} /></div>)}</div><div className="border-t border-[#edf0f5] bg-[#fafbfd] p-5"><label className="text-[10px] font-bold text-[#5f6b80]">Global review threshold <span className="ml-2 text-[#255df5]">0.72</span><input type="range" min="0.1" max="0.95" step="0.01" defaultValue="0.72" className="mt-3 block w-full accent-[#255df5]" /></label></div></div>}

          {activeTab === "notifications" && <div className="rsx-card overflow-hidden"><div className="border-b border-[#edf0f5] px-5 py-4"><h2 className="text-[13px] font-bold">Notification rules</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">Choose when the Fraud Ops team should be notified</p></div><div className="divide-y divide-[#edf0f5]">{[
            { key: "emailCritical" as const, title: "Critical fraud clusters", detail: "Instant email when a new critical cluster is detected" },
            { key: "emailSummary" as const, title: "Daily risk summary", detail: "A concise 9:00 AM overview of decisions and exposure" },
            { key: "slackAlerts" as const, title: "Slack alerts", detail: "Send urgent events to #fraud-operations" },
          ].map((item) => <div key={item.key} className="flex items-center justify-between gap-4 p-5"><div><p className="text-[11px] font-bold text-[#344158]">{item.title}</p><p className="mt-1 text-[10px] text-[#8791a3]">{item.detail}</p></div><Toggle label={item.title} checked={settings[item.key]} onChange={() => toggle(item.key)} /></div>)}</div></div>}

          {activeTab === "integrations" && <div className="grid gap-4 sm:grid-cols-2">{[
            { name: "Payment gateway", detail: "Payment and refund events", status: "Connected" }, { name: "Slack", detail: "Fraud operations alerts", status: "Configure" }, { name: "Email delivery", detail: "Reports and investigation updates", status: "Connected" }, { name: "SIEM webhook", detail: "Forward critical audit events", status: "Configure" },
          ].map((integration) => <div key={integration.name} className="rsx-card rsx-card-interactive border-t-2 border-t-[#315efb] p-5"><div className="flex items-start justify-between"><p className="text-[12px] font-bold text-[#344158]">{integration.name}</p><span className={`px-2 py-0.5 text-[10px] font-extrabold ${integration.status === "Connected" ? "bg-[#edf3ff] text-[#315efb]" : "bg-[#f0f3f7] text-[#69758a]"}`}>{integration.status}</span></div><p className="mt-2 text-[10px] text-[#8791a3]">{integration.detail}</p><button className="mt-4 text-[10px] font-bold text-[#3156b5]">Manage integration →</button></div>)}</div>}

          {activeTab === "access" && <>
            <div className="rsx-card overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4"><div><h2 className="text-[13px] font-bold">Team access</h2><p className="mt-0.5 text-[10px] text-[#8b95a7]">3 members · role-based permissions</p></div><button className="rounded-lg bg-[#255df5] px-3 py-2 text-[10px] font-bold text-white opacity-75 cursor-not-allowed" disabled>Invite member (Demo)</button></div><div className="divide-y divide-[#edf0f5]">{[["Ananya Iyer", "ananya@acme.example", "Administrator"], ["Rohan Shah", "rohan@acme.example", "Fraud analyst"], ["Nisha Menon", "nisha@acme.example", "Viewer"]].map(([name,email,role]) => <div key={email} className="flex items-center gap-3 p-4 sm:px-5"><div className="min-w-0 flex-1"><p className="text-[11px] font-bold text-[#344158]">{name}</p><p className="truncate text-[10px] text-[#8791a3]">{email}</p></div><button className="rounded-lg border border-[#dfe5ee] px-3 py-2 text-[10px] font-bold text-[#536078] opacity-75 cursor-not-allowed" disabled>{role}</button></div>)}</div></div>
            <div className="rsx-card border-l-2 border-l-[#315efb] p-5"><div className="flex items-start gap-3"><div className="flex-1"><p className="text-[12px] font-bold text-[#344158]">Security controls</p><p className="mt-1 text-[10px] leading-4 text-[#8791a3]">Single sign-on, two-factor authentication, and session policies are enabled for administrators.</p></div><span className="bg-[#edf3ff] px-2 py-1 text-[10px] font-black text-[#315efb]">SECURE</span></div></div>
          </>}
        </div>
      </section>

      {saved && <div className="fixed bottom-5 right-5 z-[120] flex items-center gap-2 rounded-xl border border-[#cdd9f8] bg-white px-4 py-3 text-[11px] font-bold text-[#315efb] shadow-[0_16px_40px_rgba(16,24,40,.15)]"><Check className="h-4 w-4" /> Settings saved successfully</div>}
    </div>
  );
}
