import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Gauge,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import BrandLogo from "../components/brand/BrandLogo";

const capabilities = [
  {
    icon: Network,
    eyebrow: "Graph intelligence",
    title: "See the fraud ring, not just the payment.",
    copy: "Connect transactions, devices, identities, IPs and merchants in one explainable investigation surface.",
    metric: "14 relationships",
    detail: "resolved per investigation",
    tone: "from-[#07142f] via-[#0a1c45] to-[#112866]",
  },
  {
    icon: Bot,
    eyebrow: "Investigation copilot",
    title: "Turn evidence into an answer your team can act on.",
    copy: "AI-guided summaries surface the strongest signals, recommended actions and supporting evidence without hiding the reasoning.",
    metric: "94% confidence",
    detail: "policy-aligned response",
    tone: "from-[#17104a] via-[#29176c] to-[#4b24a9]",
  },
  {
    icon: Gauge,
    eyebrow: "Evidence-based decisioning",
    title: "Make high-stakes decisions with full evidence.",
    copy: "Combine risk models, graph signals and policy controls to allow, review or block every transaction consistently.",
    metric: "163 ms",
    detail: "median skip-path latency",
    tone: "from-[#07142f] via-[#163675] to-[#315efb]",
  },
];

const trustPoints = ["Credential-free demo", "17 operational workspaces", "Explainable decisioning"];

export default function ProductLandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f9ff] text-[#071632]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071229]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
          <BrandLogo inverse />
          <nav className="ml-10 hidden items-center gap-8 lg:flex" aria-label="Product navigation">
            <a href="#platform" className="text-[13px] font-semibold text-white/70 transition hover:text-white">Platform</a>
            <a href="#intelligence" className="text-[13px] font-semibold text-white/70 transition hover:text-white">Intelligence</a>
            <a href="#outcomes" className="text-[13px] font-semibold text-white/70 transition hover:text-white">Outcomes</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="hidden h-10 items-center rounded-xl border border-white/20 px-4 text-[13px] font-semibold text-white transition hover:border-white/40 hover:bg-white/10 sm:flex">
              Log in
            </Link>
            <Link href="/login" className="group flex h-10 items-center gap-2 whitespace-nowrap rounded-xl bg-white px-4 text-[13px] font-bold text-[#174bd4] shadow-[0_8px_24px_rgba(35,91,255,.24)] transition hover:-translate-y-0.5 hover:bg-[#eef3ff]">
              Open demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[840px] overflow-hidden bg-[#071229] pt-[76px] text-white">
          <div className="absolute inset-0 opacity-90 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:80px_80px]" />
          <div className="absolute -right-[16%] top-[-12%] h-[850px] w-[850px] rounded-full bg-[#245dff]/35 blur-[120px]" />
          <div className="absolute -bottom-[45%] left-[24%] h-[700px] w-[700px] rounded-full bg-[#6b35ff]/30 blur-[130px]" />
          <div className="absolute inset-y-0 right-[8%] hidden w-[52%] skew-x-[-18deg] bg-gradient-to-b from-[#2e6bff]/25 via-[#1742bb]/10 to-transparent lg:block" />

          <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 pb-20 pt-20 sm:px-8 sm:pt-24 lg:grid-cols-[.92fr_1.08fr] lg:px-12 lg:pb-28 lg:pt-28">
            <div className="flex flex-col justify-center">
              <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-[#5b81ff]/30 bg-[#2145a2]/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-[#bcd0ff] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> AI-native payment risk
              </div>
              <h1 className="balance max-w-[760px] text-[48px] font-semibold leading-[.98] tracking-[-.055em] sm:text-[64px] lg:text-[76px]">
                Every payment.
                <span className="block bg-gradient-to-r from-[#72a1ff] via-[#d2ddff] to-[#8d79ff] bg-clip-text text-transparent">Understood before you decide.</span>
              </h1>
              <p className="mt-7 max-w-[620px] text-[17px] leading-7 text-[#aebbd4] sm:text-[19px] sm:leading-8">
                RiskSentinel X unifies graph intelligence, agentic investigation and policy-grade decisions in one command surface for modern fraud teams.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#2e63ff] px-6 text-[14px] font-bold text-white shadow-[0_16px_40px_rgba(46,99,255,.35)] transition hover:-translate-y-0.5 hover:bg-[#4775ff]">
                  Enter demo workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href="#platform" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-6 text-[14px] font-semibold text-white transition hover:border-white/30 hover:bg-white/[.1]">
                  <Play className="h-4 w-4 fill-current" /> Explore the platform
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3">
                {trustPoints.map((item) => (
                  <span key={item} className="flex items-center gap-2 text-[12px] font-semibold text-[#94a4c1]"><Check className="h-3.5 w-3.5 text-[#7fa4ff]" />{item}</span>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[530px] items-center justify-center lg:min-h-[620px]">
              <div className="absolute inset-x-[8%] inset-y-[9%] rotate-[-7deg] rounded-[36px] border border-[#5578ff]/30 bg-[#1643cc]/15 backdrop-blur-sm" />
              <div className="relative w-full max-w-[700px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0b1833]/95 shadow-[0_36px_100px_rgba(0,0,0,.48)]">
                <div className="flex h-14 items-center border-b border-white/10 px-5">
                  <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ffc145]" /><span className="h-2.5 w-2.5 rounded-full bg-[#315efb]" /></div>
                  <span className="ml-5 text-[11px] font-bold uppercase tracking-[.16em] text-[#7f91b2]">Risk command center</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#19366f] px-2.5 py-1 text-[10px] font-bold text-[#7fa4ff]"><span className="h-1.5 w-1.5 rounded-full bg-[#6f95ff]" />Operational</span>
                </div>
                <div className="grid gap-px bg-white/10 sm:grid-cols-[1fr_220px]">
                  <div className="bg-[#0a152d] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#7789aa]">Coordinated exposure</p><p className="mt-2 text-[34px] font-semibold tracking-[-.04em]">₹4.82L</p></div>
                      <span className="rounded-lg border border-[#ff6b6b]/25 bg-[#4c1f2b] px-2.5 py-1 text-[10px] font-bold text-[#ff8d93]">Critical</span>
                    </div>
                    <div className="relative mt-7 h-[278px] overflow-hidden rounded-2xl border border-white/10 bg-[#071126] [background-image:linear-gradient(rgba(91,129,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(91,129,255,.06)_1px,transparent_1px)] [background-size:32px_32px]">
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 280" aria-hidden="true">
                        <g stroke="#31599f" strokeWidth="1.4" opacity=".8"><line x1="255" y1="145" x2="105" y2="70" /><line x1="255" y1="145" x2="115" y2="225" /><line x1="255" y1="145" x2="405" y2="65" /><line x1="255" y1="145" x2="410" y2="218" /><line x1="105" y1="70" x2="405" y2="65" strokeDasharray="5 7" /></g>
                        <g><circle cx="255" cy="145" r="34" fill="#e74440" stroke="#ffc7c4" strokeWidth="4" /><circle cx="105" cy="70" r="22" fill="#356df0" stroke="#a9c0ff" strokeWidth="3" /><circle cx="115" cy="225" r="22" fill="#315efb" stroke="#bfd0ff" strokeWidth="3" /><circle cx="405" cy="65" r="22" fill="#7b4ee8" stroke="#cbb7ff" strokeWidth="3" /><circle cx="410" cy="218" r="22" fill="#d68516" stroke="#ffd18a" strokeWidth="3" /></g>
                      </svg>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 text-center"><p className="text-[11px] font-bold text-white">TX C9000</p><p className="text-[10px] text-[#9aa9c4]">Blocked · score 94</p></div>
                      <div className="absolute left-[10%] top-[7%] text-[10px] font-semibold text-[#bac7dc]">Device 8812</div>
                      <div className="absolute bottom-[7%] right-[7%] text-[10px] font-semibold text-[#bac7dc]">Card •8219</div>
                    </div>
                  </div>
                  <div className="bg-[#101d38] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7183a6]">Decision brief</p>
                    <div className="mt-4 rounded-xl border border-[#ff6f6f]/20 bg-[#381d29] p-3"><div className="flex items-center gap-2 text-[11px] font-bold text-[#ff8e92]"><ShieldCheck className="h-4 w-4" />Block cluster</div><p className="mt-2 text-[10px] leading-4 text-[#bba3ab]">Shared device and payment instrument across 11 accounts.</p></div>
                    <div className="mt-5 space-y-4">
                      {[['Entity risk','94'],['Linked identities','11'],['Policy confidence','97%']].map(([label,value]) => <div key={label} className="border-b border-white/10 pb-3"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#6f81a2]">{label}</p><p className="mt-1 text-[15px] font-semibold text-white">{value}</p></div>)}
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#72a1ff]"><CircleDot className="h-3.5 w-3.5" />Evidence synchronized</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[2%] left-0 hidden w-[220px] rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a7b5ce]">Loss prevented today</p><p className="mt-2 text-[26px] font-semibold tracking-[-.035em]">₹18.4L</p><p className="mt-1 text-[10px] font-semibold text-[#7fa4ff]">↑ 16.8% vs yesterday</p>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-b border-[#dce4f2] bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div><p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#255df5]">One connected platform</p><h2 className="balance mt-4 text-[39px] font-semibold leading-[1.05] tracking-[-.045em] sm:text-[54px]">Built for the moment risk becomes real.</h2></div>
              <p className="max-w-[640px] text-[17px] leading-7 text-[#61708a] lg:ml-auto">Replace fragmented tools with one operating system for monitoring, investigating, deciding and proving every high-risk action.</p>
            </div>
            <div className="mt-14 grid overflow-hidden rounded-[28px] border border-[#dbe3f1] bg-[#f5f8ff] md:grid-cols-3">
              {capabilities.map((item, index) => (
                <article key={item.title} className={`group relative min-h-[430px] overflow-hidden bg-gradient-to-br ${item.tone} p-7 text-white md:p-8 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}>
                  <div className="absolute -right-16 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex h-full flex-col">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10"><item.icon className="h-5 w-5" /></span>
                    <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[.18em] text-white/55">{item.eyebrow}</p>
                    <h3 className="balance mt-3 text-[28px] font-medium leading-[1.08] tracking-[-.035em]">{item.title}</h3>
                    <p className="mt-4 text-[14px] leading-6 text-white/62">{item.copy}</p>
                    <div className="mt-auto border-t border-white/15 pt-6"><p className="text-[27px] font-semibold tracking-[-.035em]">{item.metric}</p><p className="mt-1 text-[11px] font-semibold text-white/50">{item.detail}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="intelligence" className="relative overflow-hidden bg-[#f4f7ff] py-20 sm:py-28">
          <div className="absolute inset-y-0 left-[45%] w-[70%] -skew-x-12 bg-gradient-to-r from-[#dce8ff]/20 via-[#a8c5ff]/28 to-[#ede6ff]/45" />
          <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#255df5]">Explainability by design</p>
              <h2 className="balance mt-4 text-[39px] font-semibold leading-[1.05] tracking-[-.045em] sm:text-[54px]">A decision trail your team can trust.</h2>
              <p className="mt-6 max-w-[520px] text-[16px] leading-7 text-[#60708a]">Every recommendation is paired with evidence, policy context and a clear owner—so the handoff from machine speed to human judgment feels natural.</p>
              <Link href="/login" className="group mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#245df5]">Explore the workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#dce4f1] bg-white p-6 shadow-[0_18px_60px_rgba(38,65,120,.08)] sm:translate-y-8"><Waypoints className="h-6 w-6 text-[#255df5]" /><p className="mt-7 text-[11px] font-bold uppercase tracking-[.13em] text-[#8b97aa]">Signal convergence</p><p className="mt-2 text-[38px] font-semibold tracking-[-.05em] text-[#10203e]">11 linked</p><p className="mt-2 text-[13px] leading-5 text-[#6c7890]">accounts identified across shared device, IP and payment instrument.</p></div>
              <div className="rounded-[24px] border border-[#202f52] bg-[#0a1730] p-6 text-white shadow-[0_22px_70px_rgba(10,23,48,.18)]"><BadgeCheck className="h-6 w-6 text-[#7fa4ff]" /><p className="mt-7 text-[11px] font-bold uppercase tracking-[.13em] text-[#7f91b2]">Recommended action</p><p className="mt-2 text-[29px] font-semibold tracking-[-.04em]">Block entire cluster</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#2f6bff] to-[#8a6df0]" /></div><p className="mt-3 text-[12px] font-semibold text-[#9fb0cc]">94% confidence · Policy aligned</p></div>
            </div>
          </div>
        </section>

        <section id="outcomes" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="rounded-[32px] bg-[#071229] px-6 py-14 text-center text-white shadow-[0_30px_90px_rgba(7,18,41,.22)] sm:px-12 sm:py-20">
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#80a4ff]">Built for the hackathon. Ready for the room.</p>
              <h2 className="balance mx-auto mt-5 max-w-[850px] text-[39px] font-semibold leading-[1.04] tracking-[-.05em] sm:text-[58px]">Enter the complete RiskSentinel X experience.</h2>
              <p className="mx-auto mt-5 max-w-[620px] text-[16px] leading-7 text-[#9facc4]">No credentials. No setup. Start from the operations dashboard and explore every workflow.</p>
              <Link href="/login" className="group mx-auto mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#2d63ff] px-7 text-[14px] font-bold shadow-[0_16px_40px_rgba(45,99,255,.34)] transition hover:-translate-y-0.5 hover:bg-[#4777ff]">Continue to demo <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dce4f1] bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"><BrandLogo /><p className="text-[12px] font-medium text-[#7d899e]">AI-native payment risk intelligence · 2026</p></div>
      </footer>
    </div>
  );
}
