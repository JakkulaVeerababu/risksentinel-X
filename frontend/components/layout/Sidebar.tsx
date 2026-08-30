"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ListOrdered, 
  ShieldAlert, 
  ShieldCheck,
  BrainCircuit,
  Network,
  Users,
  Settings2,
  Bot,
  Lightbulb,
  FileCheck,
  BellRing,
  History,
  LineChart,
  Activity,
  PlayCircle,
  Code,
  Settings,
  Plus
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const NAV_SECTIONS = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Overview", href: "/", icon: LayoutDashboard },
        { label: "Risk Metrics", href: "/impact", icon: Activity },
      ]
    },
    {
      title: "TRANSACTIONS",
      items: [
        { label: "Transactions", href: "/transactions", icon: ListOrdered },
        { label: "Flagged", href: "/transactions?filter=flagged", icon: ShieldAlert },
        { label: "Reviews", href: "/transactions?filter=review", icon: ShieldCheck },
      ]
    },
    {
      title: "INTELLIGENCE",
      items: [
        { label: "Risk Scoring", href: "/evaluation", icon: BrainCircuit },
        { label: "Graph Explorer", href: "/graph", icon: Network },
        { label: "Fraud Clusters", href: "/clusters", icon: Users },
        { label: "Policies", href: "/policies", icon: Settings2 },
      ]
    },
    {
      title: "INTELLIGENCE TOOLS",
      items: [
        { label: "Investigation", href: "/investigation", icon: Bot },
        { label: "Recommendations", href: "/recommendations", icon: Lightbulb },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { label: "Cases", href: "/cases", icon: FileCheck },
        { label: "Alerts", href: "/alerts", icon: BellRing },
        { label: "Audit", href: "/audit", icon: History },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Analytics", href: "/analytics", icon: LineChart },
        { label: "Models", href: "/models", icon: Activity },
        { label: "Simulator", href: "/simulator", icon: PlayCircle },
        { label: "APIs", href: "/developer", icon: Code },
      ]
    }
  ];

  return (
    <nav className="w-[260px] h-screen fixed left-0 top-0 border-r border-border bg-surface flex flex-col py-6 z-40 hidden md:flex shadow-sm">
      <div className="px-6 mb-8 flex items-center justify-center">
        <Link href="/">
          <Image src="/logo.png" alt="RiskSentinel X" width={180} height={40} className="object-contain" priority />
        </Link>
      </div>
      
      <div className="px-6 mb-6">
        <button className="w-full bg-primary text-white py-2.5 px-4 rounded-lg shadow-sm font-body-medium text-label-sm flex items-center justify-center gap-2 hover:bg-primary-hover hover:premium-shadow-hover transition-all duration-200">
          <Plus className="w-4 h-4" /> New Investigation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 scrollbar-custom pb-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-3 mb-2 text-caption font-semibold text-text-muted uppercase ">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
                
                return (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-out group ${
                      isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"}`} strokeWidth={2.5} />
                    <span className="text-label-sm">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 mt-auto pt-4 border-t border-border-subtle bg-surface">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 mb-1 text-text-secondary hover:bg-surface-secondary hover:text-text-primary rounded-lg transition-colors duration-200"
        >
          <Settings className="w-4 h-4 text-text-muted" />
          <span className="text-label-sm font-medium">Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface-secondary hover:text-text-primary rounded-lg transition-colors duration-200">
          <span className="material-symbols-outlined text-heading-md text-text-muted">help</span>
          <span className="text-label-sm font-medium">Support</span>
        </button>
      </div>
    </nav>
  );
}
