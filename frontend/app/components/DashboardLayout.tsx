"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";
import BrandLogo from "../../components/brand/BrandLogo";
import PageTransition from "./PageTransition";

type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

type NavSection = { label: string; items: NavItem[] };

const navigation: NavSection[] = [
  {
    label: "Monitor",
    items: [
      { label: "Overview", href: "/dashboard" },
      { label: "Transactions", href: "/transactions" },
      { label: "Risk queue", href: "/alerts", badge: "41" },
      { label: "Cases", href: "/cases" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Network graph", href: "/graph" },
      { label: "Fraud clusters", href: "/clusters", badge: "4" },
      { label: "Investigation AI", href: "/ai" },
      { label: "Recommendations", href: "/recommendations" },
    ],
  },
  {
    label: "Decisioning",
    items: [
      { label: "Policy rules", href: "/policies" },
      { label: "Risk models", href: "/models" },
      { label: "Attack simulator", href: "/simulator" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Investigations", href: "/investigations" },
      { label: "Audit trail", href: "/audit" },
      { label: "Analytics", href: "/analytics" },
      { label: "Risk impact", href: "/impact" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Developer API", href: "/developer" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

const allNavigation = navigation.flatMap((section) => section.items);

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={`${mobile ? "flex" : "hidden lg:flex"} h-full w-[244px] flex-col border-r border-[#e2e6ef] bg-white`}>
      <div className="flex h-16 items-center border-b border-[#edf0f5] px-5">
        <BrandLogo href="/dashboard" />
      </div>

      <div className="border-b border-[#eef1f5] px-4 py-4">
        <button className="group flex w-full items-center justify-between border-l-2 border-[#245df5] px-3 py-1 text-left transition-colors hover:bg-[#f8faff]">
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-[#17233f]">Acme Payments</span>
            <span className="mt-0.5 block truncate text-[11px] font-medium text-[#8791a4]">Production workspace</span>
          </span>
          <ChevronDown className="h-4 w-4 text-[#9aa3b3] transition-transform group-hover:translate-y-0.5" />
        </button>
        <Link
          href="/investigations"
          onClick={onNavigate}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#245df5] px-3 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(36,93,245,.18)] transition-colors hover:bg-[#1747c9]"
        >
          <Plus className="h-3.5 w-3.5" /> New investigation
        </Link>
      </div>

      <nav className="scrollbar-custom flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
        {navigation.map((section) => (
          <section className="mb-5" key={section.label}>
            <p className="mb-1.5 px-2.5 text-caption font-semibold uppercase text-[#a0a8b7]">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isRouteActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className={`group relative flex h-8 items-center rounded-md px-2.5 text-label-sm font-semibold transition-colors ${active ? "bg-[#edf3ff] text-[#315efb]" : "text-[#5f6b80] hover:bg-[#f5f7fb] hover:text-[#17233f]"}`}
                  >
                    {active && <span className="absolute -left-3 h-5 w-[2px] bg-[#315efb]" />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-caption font-semibold ${active ? "bg-white text-[#255df5]" : "bg-[#eef1f5] text-[#7d8799]"}`}>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-[#eef1f5] p-3">
        <div className="border-t border-[#edf0f5] px-1 py-2">
          <div className="flex items-center gap-2 text-caption font-semibold text-[#344158]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#315efb]" />
            All risk engines operational
          </div>
          <p className="mt-1 pl-4 text-[10px] font-medium text-[#8d958f]">ML · Graph · Policy</p>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mode, setMode] = useState<"Test" | "Prod">("Test");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentRoute = allNavigation.find((item) => isRouteActive(pathname, item.href));
  const filteredRoutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? allNavigation.filter((item) => item.label.toLowerCase().includes(query)) : allNavigation.slice(0, 7);
  }, [searchQuery]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileNavOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const goToRoute = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <div className="rsx-workspace min-h-screen bg-[#f4f6fa] text-[#17233f]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block"><Sidebar /></div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button className="absolute inset-0 bg-[#0b1224]/50 backdrop-blur-[3px]" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />
          <div className="relative h-full w-[284px] max-w-[88vw] shadow-2xl">
            <Sidebar mobile onNavigate={() => setMobileNavOpen(false)} />
            <button aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute right-3 top-4 rounded-lg p-1.5 text-[#768196] hover:bg-[#f0f3f8]"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-[244px]">
        <header className="sticky top-0 z-50 flex h-16 items-center border-b border-[#e2e6ef] bg-white/95 px-4 backdrop-blur-xl sm:px-7">
          <button className="mr-2 rounded-lg p-2 text-[#566177] hover:bg-[#f2f5f9] lg:hidden" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="mr-3 lg:hidden"><BrandLogo compact /></div>

          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className="text-caption font-semibold text-[#8a94a6]">Risk operations</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#bdc3ce]" />
            <span className="truncate text-caption font-semibold text-[#344158]">{currentRoute?.label ?? "Workspace"}</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
            <button onClick={() => setSearchOpen(true)} className="group hidden h-9 w-[300px] items-center gap-2 rounded-lg border border-[#dfe4ed] bg-[#f8fafd] px-3 text-left text-caption text-[#929cad] transition-all hover:border-[#cdd6e5] hover:bg-white xl:flex">
              <Search className="h-4 w-4" />
              <span className="flex-1">Search payments, customers, devices…</span>
              <span className="flex items-center gap-0.5 rounded border border-[#e0e5ed] bg-white px-1.5 py-0.5 text-caption font-semibold text-[#8e98a9]"><Command className="h-2.5 w-2.5" /> K</span>
            </button>
            <button onClick={() => setSearchOpen(true)} className="rounded-lg p-2 text-[#647086] hover:bg-[#f2f5f9] xl:hidden" aria-label="Search"><Search className="h-[18px] w-[18px]" /></button>

            <div className="flex items-center rounded-lg border border-[#e1e6ee] bg-[#f4f6f9] p-0.5">
              {(["Test"] as const).map((item) => (
                <button key={item} onClick={() => setMode(item)} className={`rounded-md px-2 py-1.5 text-caption font-semibold transition-all sm:px-2.5 sm:text-caption ${mode === item ? "bg-white text-[#255df5] shadow-[0_1px_3px_rgba(16,24,40,.1)]" : "text-[#8590a2] hover:text-[#4c5870]"}`}>{item}</button>
              ))}
            </div>

            <div className="relative">
              <button onClick={() => setNotificationsOpen((value) => !value)} className="relative rounded-lg p-2 text-[#647086] hover:bg-[#f2f5f9]" aria-label="Notifications" aria-expanded={notificationsOpen}>
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e5484d] ring-2 ring-white" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-11 w-[320px] max-w-[86vw] overflow-hidden rounded-xl border border-[#e3e8f0] bg-white shadow-[0_18px_50px_rgba(26,36,58,.16)]">
                  <div className="flex items-center justify-between border-b border-[#edf0f5] px-4 py-3"><span className="text-label-sm font-semibold">Notifications</span><span className="text-caption font-semibold text-[#255df5]">3 new</span></div>
                  <div className="space-y-1 p-2">
                    {[
                      ["Critical cluster FRC-0184", "11 linked accounts · ₹4.82L exposure", "danger"],
                      ["Policy change published", "Velocity Guard v12 is now updated", "primary"],
                      ["Daily review complete", "126 decisions verified by Fraud Ops", "success"],
                    ].map(([title, detail, tone]) => (
                      <button key={title} className="flex w-full gap-3 rounded-lg p-2.5 text-left hover:bg-[#f7f9fc]">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone === "danger" ? "bg-[#e5484d]" : tone === "success" ? "bg-[#315efb]" : "bg-[#255df5]"}`} />
                        <span><span className="block text-caption font-semibold text-[#28344c]">{title}</span><span className="mt-0.5 block text-caption leading-4 text-[#7f899b]">{detail}</span></span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="hidden rounded-lg p-2 text-[#647086] hover:bg-[#f2f5f9] sm:block" aria-label="Help"><CircleHelp className="h-[18px] w-[18px]" /></button>
            <Link href="/settings" className="ml-0.5 hidden border-l border-[#e7ebf1] py-0.5 pl-3 text-left sm:block">
              <span className="block text-[12px] font-semibold text-[#2d3950]">Fraud Ops</span>
              <span className="block text-[10px] font-medium text-[#8b95a7]">Administrator</span>
            </Link>
          </div>
        </header>

        <PageTransition>
          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-7 sm:py-7 xl:px-9 xl:py-8">
            {children}
          </main>
        </PageTransition>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0b1224]/45 px-4 pt-[10vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Global search">
          <button className="absolute inset-0" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_26px_80px_rgba(12,20,38,.28)]">
            <div className="flex items-center gap-3 border-b border-[#e8ecf2] px-4">
              <Search className="h-5 w-5 text-[#6f7a8e]" />
              <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search RiskSentinel…" className="h-14 flex-1 bg-transparent text-body font-medium text-[#1b2740] outline-none placeholder:text-[#9ba4b4]" />
              <button onClick={() => setSearchOpen(false)} className="rounded-md border border-[#e3e7ed] px-2 py-1 text-caption font-semibold text-[#8a94a6]">ESC</button>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              <p className="px-2.5 pb-2 pt-1 text-caption font-semibold uppercase text-[#a0a8b7]">Navigate</p>
              {filteredRoutes.map((item) => (
                <button key={item.href} onClick={() => goToRoute(item.href)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#f3f6fb]">
                  <span className="flex-1 text-label-sm font-semibold text-[#344158]">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-[#a7afbd]" />
                </button>
              ))}
              {filteredRoutes.length === 0 && <div className="py-10 text-center"><p className="text-label-sm font-semibold text-[#69758a]">No workspace section matches “{searchQuery}”.</p></div>}
            </div>
            <div className="flex items-center justify-between border-t border-[#edf0f4] bg-[#fafbfc] px-4 py-2.5 text-caption font-semibold text-[#8a94a6]"><span>Search payments and entities from their respective pages</span><span className="text-[#315efb]">● Engines online</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
