"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import BrandLogo from "../../../components/brand/BrandLogo";

const proof = [
  ["186 ms", "average decisions"],
  ["Graph-linked", "connected evidence"],
  ["Policy-owned", "final outcomes"],
];

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-1.99 3.02v2.54h3.23c1.89-1.74 2.98-4.31 2.98-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.62-2.41l-3.23-2.54c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.13H3.07v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.87A6 6 0 0 1 6.09 12c0-.65.11-1.28.31-1.87V7.51H3.07A10 10 0 0 0 2 12c0 1.61.38 3.14 1.07 4.49l3.33-2.62Z" />
      <path fill="#EA4335" d="M12 6c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.33 2.62C7.19 7.76 9.4 6 12 6Z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-[#111827]" aria-hidden="true">
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.42c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.3-5.27-1.29-5.27-5.69 0-1.26.45-2.28 1.2-3.09-.12-.29-.52-1.47.11-3.05 0 0 .98-.31 3.17 1.18a10.96 10.96 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.76.11 3.05.75.81 1.2 1.83 1.2 3.09 0 4.41-2.71 5.39-5.29 5.68.42.36.78 1.07.78 2.16v3.04c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const enterWorkspace = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => router.push("/dashboard", { scroll: true }), 420);
  };

  return (
    <main className="min-h-[100dvh] w-full overflow-x-hidden bg-white text-[#071426]">
      <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1.9fr)_minmax(420px,1fr)]">
        <section className="relative hidden overflow-hidden border-r border-[#d8e1ef] bg-[#eef6ff] px-12 py-9 lg:flex lg:flex-col xl:px-16 2xl:px-20">
          <div className="login-visual-wash pointer-events-none absolute inset-0" />
          <div className="login-diagonal-bands pointer-events-none absolute inset-0 opacity-90" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <div className="pointer-events-none absolute -bottom-44 -right-20 h-[520px] w-[180px] rotate-[17deg] bg-[#68eef5]/20" />

          <div className="relative z-10"><BrandLogo /></div>

          <div className="relative z-10 mt-auto max-w-[810px] pb-8 xl:pb-10">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#255df5]">Payment-risk infrastructure</p>
            <h1 className="mt-5 max-w-[780px] text-[40px] font-semibold leading-[1.05] tracking-[-.052em] text-[#10203a] xl:text-[48px]">Move from risk signal to accountable decision in milliseconds.</h1>
            <p className="mt-5 max-w-[650px] text-[14px] leading-7 text-[#50617b]">Monitor every payment, connect hidden relationships, accelerate investigations and keep deterministic policy in control.</p>

            <div className="mt-9 grid max-w-[760px] border-y border-[#c7d6ea] sm:grid-cols-3">
              {proof.map(([value, label], index) => (
                <div key={label} className={`py-4 ${index > 0 ? "border-t border-[#c7d6ea] sm:border-l sm:border-t-0 sm:pl-5" : ""}`}>
                  <p className="text-[13px] font-semibold text-[#17345f]">{value}</p>
                  <p className="mt-1 text-[9px] font-medium text-[#718097]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-[#cfdae9] pt-4 text-[9px] font-semibold text-[#6f7e94]"><span>RiskSentinel X secure workspace</span><span>Seeded evaluation environment</span></div>
        </section>

        <section className="flex min-h-[100dvh] min-w-0 flex-col bg-white px-6 py-6 sm:px-10 sm:py-8 xl:px-12 2xl:px-14">
          <div className="flex items-center justify-between">
            <div className="lg:hidden"><BrandLogo /></div>
            <Link href="/" className="ml-auto inline-flex items-center gap-2 px-1 py-2 text-[11px] font-semibold text-[#647188] transition hover:text-[#1747c9]"><ArrowLeft className="h-4 w-4" /> Back to product</Link>
          </div>

          <div className="my-auto mx-auto w-full max-w-[420px] py-5">
            <p className="text-[12px] font-medium text-[#5f6c80]">Welcome to <span className="font-semibold text-[#17233b]">RiskSentinel X</span></p>
            <h2 className="mt-4 text-[33px] font-semibold leading-[1.07] tracking-[-.047em] text-[#071936] sm:text-[37px]">Get started with your work email.</h2>
            <p className="mt-3 text-[12px] leading-5 text-[#6d788b]">Access the complete payment-risk operations workspace.</p>

            <form onSubmit={(event) => { event.preventDefault(); enterWorkspace(); }} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold text-[#344158]">Work email</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@company.com" className="h-12 w-full rounded-[7px] border border-[#cfd8e5] bg-white px-3.5 text-[13px] text-[#17233b] outline-none transition placeholder:text-[#a4adbc] focus:border-[#2f6bff] focus:ring-4 focus:ring-[#2f6bff]/10" />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-[#344158]"><span>Password</span><button type="button" onClick={() => setShowPassword((value) => !value)} className="font-semibold text-[#255df5] hover:text-[#1747c9]">{showPassword ? "Hide" : "Show"}</button></span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete="current-password" placeholder="Enter your password" className="h-12 w-full rounded-[7px] border border-[#cfd8e5] bg-white px-3.5 text-[13px] text-[#17233b] outline-none transition placeholder:text-[#a4adbc] focus:border-[#2f6bff] focus:ring-4 focus:ring-[#2f6bff]/10" />
              </label>

              <div className="flex items-center justify-between text-[10px]"><label className="flex items-center gap-2 font-medium text-[#69758a]"><input type="checkbox" className="h-3.5 w-3.5 rounded border-[#cbd4e0] accent-[#2f6bff]" />Remember me</label><button type="button" className="font-semibold text-[#255df5] hover:text-[#1747c9]">Forgot password?</button></div>

              <button type="submit" disabled={loading} className="group flex h-12 w-full items-center justify-center gap-2 rounded-[7px] bg-[#2f6bff] px-5 text-[13px] font-semibold text-white shadow-[0_10px_26px_rgba(47,107,255,.20)] transition hover:-translate-y-px hover:bg-[#2458df] disabled:cursor-wait disabled:opacity-70">
                {loading ? <><LoaderCircle className="h-4 w-4 animate-spin" />Signing in</> : <>Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-[#e1e6ee]" /><span className="text-[9px] font-medium text-[#929bad]">or continue with</span><span className="h-px flex-1 bg-[#e1e6ee]" /></div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={enterWorkspace} disabled={loading} className="flex h-11 items-center justify-center gap-2.5 rounded-[7px] border border-[#d6dee9] bg-white text-[11px] font-semibold text-[#273249] transition hover:border-[#b9c7da] hover:bg-[#fafbfd] disabled:opacity-60"><GoogleMark />Google</button>
              <button type="button" onClick={enterWorkspace} disabled={loading} className="flex h-11 items-center justify-center gap-2.5 rounded-[7px] border border-[#d6dee9] bg-white text-[11px] font-semibold text-[#273249] transition hover:border-[#b9c7da] hover:bg-[#fafbfd] disabled:opacity-60"><GitHubMark />GitHub</button>
            </div>

            <div className="mt-5 rounded-[10px] bg-[#f5f7fa] px-4 py-3.5"><p className="text-[10px] leading-5 text-[#66748a]">Evaluating the platform? <button type="button" onClick={enterWorkspace} className="font-semibold text-[#255df5] hover:text-[#1747c9]">Open the credential-free demo <span aria-hidden="true">→</span></button></p></div>
          </div>

          <p className="text-center text-[9px] leading-4 text-[#929cad]">By continuing, you agree to the secure evaluation workspace terms.<br />RiskSentinel X · Seeded demo data</p>
        </section>
      </div>
    </main>
  );
}
