"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import BrandLogo from "../../../components/brand/BrandLogo";

const accessPoints = [
  ["Policy decisions", "Monitor allow, review and block outcomes"],
  ["Graph evidence", "Trace devices, identities and payment links"],
  ["AI investigations", "Turn complex signals into clear next actions"],
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const enterWorkspace = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      router.push("/dashboard", { scroll: true });
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 120);
    }, 520);
  };

  return (
    <main className="min-h-[100dvh] w-full overflow-x-hidden bg-[#06132c] p-0 sm:p-4 lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden xl:p-6">
      <div className="grid min-h-[100dvh] w-full overflow-hidden bg-white sm:min-h-[calc(100dvh-32px)] sm:rounded-[28px] sm:border sm:border-white/15 sm:shadow-[0_36px_110px_rgba(0,0,0,.4)] lg:h-full lg:min-h-0 lg:grid-cols-[1.16fr_.84fr]">
        <section className="relative hidden min-h-0 overflow-hidden bg-[#071633] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-11 2xl:px-16">
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:76px_76px]" />
          <div className="absolute -right-[12%] -top-[28%] h-[720px] w-[720px] rounded-full bg-[#245dff]/35 blur-[125px]" />
          <div className="absolute -bottom-[45%] left-[12%] h-[620px] w-[620px] rounded-full bg-[#6a36ff]/28 blur-[120px]" />
          <div className="absolute inset-y-0 right-[3%] w-[56%] -skew-x-12 bg-gradient-to-b from-[#315fff]/22 via-[#21449d]/8 to-transparent" />

          <div className="relative z-10 inline-flex w-fit"><BrandLogo inverse /></div>

          <div className="relative z-10 my-auto max-w-[760px] py-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#8eabf5]">Payment risk command center</p>
            <h1 className="balance mt-5 text-[48px] font-semibold leading-[.98] tracking-[-.055em] xl:text-[58px] 2xl:text-[66px]">One clear view from signal to decision.</h1>
            <p className="mt-5 max-w-[650px] text-[15px] leading-7 text-[#aab9d4] xl:text-[17px]">Investigate coordinated fraud, understand every recommendation and act before payment risk turns into loss.</p>

            <div className="mt-8 overflow-hidden rounded-[22px] border border-white/12 bg-[#0b1b3b]/86 shadow-[0_24px_70px_rgba(0,0,0,.28)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#788baD]">Active intelligence</p><p className="mt-1 text-[14px] font-bold">Coordinated cluster FRC-0184</p></div>
                <span className="rounded-full border border-[#ff7c83]/25 bg-[#4a2130] px-2.5 py-1 text-[10px] font-bold text-[#ff9ca2]">Critical · 96</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/10">
                {[["Exposure stopped", "₹4.82L"], ["Linked identities", "18"], ["Decision time", "42 ms"]].map(([label, value]) => (
                  <div key={label} className="px-5 py-5"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#7789aa]">{label}</p><p className="mt-2 text-[24px] font-semibold tracking-[-.04em] text-white xl:text-[28px]">{value}</p></div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 text-[11px] font-semibold text-[#8fa1c1]"><span>Graph + ML + policy evidence synchronized</span><span className="text-[#7fa4ff]">Operational</span></div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-semibold text-[#7082a3]"><span>RiskSentinel X · Demo environment</span><span>No customer data</span></div>
        </section>

        <section className="relative flex min-h-[100dvh] min-w-0 flex-col bg-[#fbfcff] px-6 py-6 sm:min-h-[calc(100dvh-32px)] sm:px-10 sm:py-8 lg:h-full lg:min-h-0 xl:px-14 2xl:px-16">
          <div className="flex items-center justify-between">
            <div className="lg:hidden"><BrandLogo /></div>
            <Link href="/" className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold text-[#647188] transition hover:bg-[#f0f4fb] hover:text-[#17233f]"><ArrowLeft className="h-4 w-4" />Back to product</Link>
          </div>

          <div className="my-auto mx-auto w-full max-w-[500px] py-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#255df5]">Credential-free access</p>
            <h2 className="balance mt-4 text-[38px] font-semibold leading-[1.04] tracking-[-.05em] text-[#071936] sm:text-[46px] xl:text-[52px]">Enter the risk workspace.</h2>
            <p className="mt-5 max-w-[460px] text-[14px] leading-6 text-[#69768b]">No email, password or setup is required. The complete platform is preloaded for your demo.</p>

            <div className="mt-7 divide-y divide-[#e8ecf2] rounded-2xl border border-[#e0e6ef] bg-white px-5 shadow-[0_16px_50px_rgba(31,51,92,.07)]">
              {accessPoints.map(([title, detail]) => (
                <div key={title} className="flex gap-3 py-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#255df5]" />
                  <div><p className="text-[13px] font-bold text-[#27344c]">{title}</p><p className="mt-1 text-[11px] leading-5 text-[#7b8698]">{detail}</p></div>
                </div>
              ))}
            </div>

            <button onClick={enterWorkspace} disabled={loading} className="group mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#255df5] px-5 text-[14px] font-bold text-white shadow-[0_16px_34px_rgba(37,93,245,.28)] transition hover:-translate-y-0.5 hover:bg-[#174bd4] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-75">
              {loading ? <><LoaderCircle className="h-4 w-4 animate-spin" />Preparing workspace</> : <>Enter demo workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
            </button>
            <div className="mt-5 flex items-center justify-between gap-4 text-[10px] font-semibold text-[#8a95a7]"><span>17 operational workspaces</span><span className="text-[#315efb]">All engines online</span></div>
          </div>

          <p className="text-center text-[10px] font-medium text-[#9aa4b4]">Local hackathon demo · Built for secure evaluation</p>
        </section>
      </div>
    </main>
  );
}
