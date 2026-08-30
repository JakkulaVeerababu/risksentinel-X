"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "../brand/BrandLogo";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Outcomes", href: "#outcomes" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/40 backdrop-blur-lg shadow-[0_8px_30px_rgba(23,42,79,.07)]" : "bg-transparent"}`}>
      {showBanner && (
        <div className="relative border-b border-white/20 bg-transparent">
          <div className="flex h-9 items-center justify-center gap-3 px-10 lg:px-14 w-full text-center text-[10px] font-semibold text-[#10203a] sm:text-[11px]">
            <span>See every payment risk decision, end to end.</span>
            <a href="#platform" className="hidden text-[#255df5] underline-offset-4 hover:underline sm:inline">Explore the platform</a>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#10203a] opacity-60 hover:opacity-100"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="border-b border-white/20 bg-transparent">
        <div className="flex h-[70px] items-center px-5 lg:px-10 w-full">
        <BrandLogo />

        <nav className="ml-12 hidden items-center gap-8 lg:flex" aria-label="Product navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-[14px] font-medium text-[#526079] transition-colors hover:text-[#0B1F3A]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-6 sm:flex">
          <Link href="/login" className="text-[14px] font-medium text-[#536078] transition-colors hover:text-[#0B1F3A]">
            Log in
          </Link>
          <Link href="/login" className="group flex h-[40px] items-center justify-center rounded-md bg-[#1364F1] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#0E54CD]">
            Open demo <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="ml-auto flex h-10 w-10 items-center justify-center rounded-md text-[#17233d] hover:bg-[#f1f5fb] sm:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#e6ebf2] bg-white px-5 pb-5 pt-3 sm:hidden">
          <nav className="flex flex-col" aria-label="Mobile product navigation">
            {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-[#edf0f5] py-3.5 text-[14px] font-semibold text-[#26334d]">{link.label}</a>)}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/login" className="landing-secondary-cta h-10 text-[13px]">Log in</Link>
            <Link href="/login" className="landing-primary-cta h-10 text-[13px]">Open demo <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
