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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled && !open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${scrolled || open ? "border-[#dfe5ef] bg-white/95 shadow-[0_1px_0_rgba(7,20,38,.03)] backdrop-blur-md" : "border-white/10 bg-[#071226]"}`}>
      <div className="landing-container flex h-[72px] items-center">
        <BrandLogo inverse={dark} />

        <nav className="ml-12 hidden items-center gap-9 lg:flex" aria-label="Product navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={`landing-nav-link ${dark ? "text-white/[.68] hover:text-white" : "text-[#526079] hover:text-[#071426]"}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-5 sm:flex">
          <Link href="/login" className={`text-[13px] font-semibold transition-colors ${dark ? "text-white/[.72] hover:text-white" : "text-[#536078] hover:text-[#071426]"}`}>
            Log in
          </Link>
          <Link href="/login" className="landing-primary-cta group h-10 px-4 text-[13px]">
            Open demo <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className={`ml-auto flex h-10 w-10 items-center justify-center rounded-md sm:hidden ${dark ? "text-white hover:bg-white/10" : "text-[#17233d] hover:bg-[#f1f5fb]"}`}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
