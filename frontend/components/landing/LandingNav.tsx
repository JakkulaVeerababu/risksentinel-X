"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "../brand/BrandLogo";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Outcomes", href: "#outcomes" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const darkSections = Array.from(document.querySelectorAll('[data-navigation-tone="dark"]'));
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 28);
      const barMidpoint = (headerRef.current?.querySelector('.landing-masthead-row')?.getBoundingClientRect().height || 74) / 2;
      setOverDark(darkSections.some(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= barMidpoint && bounds.bottom > barMidpoint;
      }));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: Event) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="landing-masthead" data-scrolled={scrolled} data-menu-open={open} data-over-dark={overDark}>
      <div className="landing-container landing-masthead-row">
        <BrandLogo />
        <nav className="landing-desktop-navigation" aria-label="Product navigation">
          {links.map(link => <a key={link.href} href={link.href} className="landing-masthead-link">{link.label}</a>)}
        </nav>
        <div className="landing-masthead-actions">
          <Link href="/login" className="landing-nav-login">Log in</Link>
          <Link href="/login" className="landing-nav-demo group">Open workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
        </div>
        <button ref={menuRef} id="product-menu-toggle" type="button" aria-controls={open ? "mobile-product-navigation" : undefined} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(value => !value)} className="landing-menu-toggle">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div id="mobile-product-navigation" className="landing-mobile-navigation">
          <nav className="landing-container" aria-label="Mobile product navigation">
            {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="landing-mobile-link">{link.label}</a>)}
            <div className="landing-mobile-actions">
              <Link href="/login" onClick={() => setOpen(false)} className="landing-nav-login">Log in</Link>
              <Link href="/login" onClick={() => setOpen(false)} className="landing-nav-demo">Open workspace <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
