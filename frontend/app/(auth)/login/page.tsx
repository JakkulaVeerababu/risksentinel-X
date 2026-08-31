"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import BrandLogo from "../../../components/brand/BrandLogo";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createClient } from "../../../lib/supabase";
import "../../../styles/auth-access.css";

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
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<"email" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (step === "password") passwordInput.current?.focus(); }, [step]);

  const enterWorkspace = () => {
    if (loading) return;
    setLoading(true);
    setPassword("");
    timer.current = setTimeout(() => router.push("/dashboard", { scroll: true }), reduceMotion ? 0 : 300);
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setNotice("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setNotice(error.message);
    }
  };

  return (
    <main className="auth-access-page w-full bg-white text-[#15263c]">
      <div className="auth-access-layout grid min-h-[100dvh]">
        <section className="auth-brand-visual relative hidden min-h-[100dvh] overflow-hidden px-10 py-10 lg:flex lg:flex-col xl:px-14">
          <div className="auth-prism-field pointer-events-none absolute inset-0" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <span key={index} className="auth-light-band" style={{ left: (index * 26 - 18) + "%", animationDelay: (-index * 2.1) + "s" }} />)}
          </div>
          <div className="relative z-10 flex items-center justify-between gap-6">
            <BrandLogo />
            <span className="auth-brand-note">Risk intelligence, connected</span>
          </div>
          <div className="auth-brand-message relative z-10 mt-auto max-w-[720px] pb-8 pt-24">
            <p className="mb-5 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[#3868a1]"><span className="h-px w-7 shrink-0 bg-[#2f6bff]" />Built for the teams behind every decision</p>
            <motion.h2 initial={reduceMotion ? false : { y: 12 }} animate={{ y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }} className="auth-proof-title">
              A clearer view of risk.<span className="mt-1 block text-[#2f6bff]">A more confident<br />way forward.</span>
            </motion.h2>
            <p className="mt-6 max-w-[460px] text-[15px] leading-[1.8] text-[#627b93]">Monitor payments. Connect the evidence. Turn complex risk into a decision your team can stand behind.</p>
          </div>
          <div className="auth-brand-capabilities relative z-10 border-t border-[#b8cfe1]/60 pt-6">
            <div className="grid grid-cols-3 gap-5">
              {[["01", "Monitor", "Every payment, in view"], ["02", "Investigate", "Evidence, connected"], ["03", "Decide", "Policy in control"]].map(([number, title, copy]) => (
                <div key={number}>
                  <p className="mb-2 font-mono text-[9px] text-[#7095b8]">{number}</p>
                  <p className="text-[12px] font-semibold text-[#294763]">{title}</p>
                  <p className="mt-1 text-[11px] text-[#7990a5]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="auth-form-panel relative flex min-h-[100dvh] min-w-0 flex-col px-6 py-7 sm:px-10 sm:py-8 xl:px-12">
          <div className="auth-access-header flex items-center justify-between gap-4">
            <div className="lg:hidden"><BrandLogo compact /></div>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.13em] text-[#8b98aa] lg:inline">Workspace access</span>
            <Link href="/" className="inline-flex items-center gap-1.5 py-2 text-[11px] font-medium text-[#8290a2] transition-colors hover:text-[#2f6bff]"><ArrowLeft className="h-3.5 w-3.5" />Back to product</Link>
          </div>

          <div className="auth-form-content mx-auto my-auto w-full py-6">
            <p className="auth-welcome">Welcome to RiskSentinel X</p>
            <h1 className="auth-access-title">{step === "email" ? "Your workspace awaits." : "You’re one step away."}</h1>
            <p className="auth-access-description">{step === "email" ? "See every signal, connection and decision in one place." : "Continue to your risk workspace."}</p>
            <p className="auth-security-note">Email/password access does not currently verify credentials. Do not enter a real password.</p>
            <form className="mt-7" onSubmit={event => {
              event.preventDefault();
              setNotice("");
              if (step === "email") setStep("password");
              else enterWorkspace();
            }}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div key={step} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduceMotion ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onAnimationComplete={() => { if (step === "password") passwordInput.current?.focus(); }}>
                  {step === "email" ? (
                    <label className="block"><span className="auth-field-label">Work email</span><input name="email" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" placeholder="you@company.com" className="auth-input" /></label>
                  ) : (
                    <div>
                      <div className="mb-5 flex min-w-0 items-center justify-between gap-3 rounded-md border border-[#e3e9f0] bg-[#f9fbfd] px-3.5 py-3"><span className="truncate text-[12px] text-[#5f7087]">{email}</span><button type="button" onClick={() => { setStep("email"); setPassword(""); }} className="text-[11px] font-semibold text-[#2f6bff]">Change</button></div>
                      <div className="mb-2 flex items-center justify-between"><label htmlFor="workspace-password" className="text-[12px] font-medium text-[#5d6d84]">Temporary password</label><button type="button" onClick={() => setShowPassword(value => !value)} aria-controls="workspace-password" aria-pressed={showPassword} className="text-[11px] font-semibold text-[#2f6bff]">{showPassword ? "Hide" : "Show"}</button></div>
                      <input ref={passwordInput} id="workspace-password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} required minLength={6} autoComplete="off" placeholder="Use a temporary value" className="auth-input" />
                      <p className="mt-2 text-[11px] leading-4 text-[#66778e]">Credentials entered here are not verified or saved.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <button type="submit" disabled={loading} className="auth-submit group mt-4">{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" />Opening workspace</> : <>{step === "email" ? "Continue" : "Continue to workspace"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}</button>
            </form>

            <div className="auth-provider-divider my-6 flex items-center gap-3"><span className="h-px flex-1 bg-[#e4e8ee]" /><span>or continue with</span><span className="h-px flex-1 bg-[#e4e8ee]" /></div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => handleOAuthLogin("google")} className="auth-provider"><GoogleMark />Google</button>
              <button type="button" onClick={() => handleOAuthLogin("github")} className="auth-provider"><GitHubMark />GitHub</button>
            </div>
            {notice && <p role="status" className="mt-4 rounded-md border border-[#dce6f5] bg-[#f5f8fe] p-3 text-[11px] leading-5 text-[#687d99]">{notice}</p>}
          </div>

          <div className="auth-access-footer mx-auto w-full">
            <div className="auth-demo-invite">
              <div><p>Go directly to your workspace</p><span>Current access is unrestricted.</span></div>
              <button type="button" onClick={enterWorkspace} disabled={loading} className="auth-demo-button">Open workspace <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
            </div>
            <p className="auth-environment-note">Enable and enforce authentication before making this workspace publicly accessible.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
