"use client";

import React from 'react';
import { Search, ChevronDown, Bell, History, User } from 'lucide-react';

export default function TopNavbar() {
  return (
    <header className="h-[72px] bg-surface/80 glass-effect border-b border-border-subtle flex items-center justify-between px-8 shrink-0 z-30 sticky top-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-secondary p-2 -ml-2 rounded-lg transition-colors">
          <span className="font-medium text-label-sm text-text-primary">Acme Payments</span>
          <ChevronDown className="text-text-secondary w-4 h-4" />
        </div>
        
        <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>
        
        <div className="relative hidden sm:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            className="pl-[36px] pr-[56px] py-[8px] bg-surface-secondary border border-transparent rounded-lg font-body-sm text-label-sm text-text-primary focus:outline-none focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-muted w-[400px]" 
            placeholder="Search transactions, cases, rules..." 
            type="text" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-surface border border-border rounded text-caption font-semibold text-text-secondary pointer-events-none shadow-sm">
            ⌘ K
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-surface-secondary rounded-lg p-1 hidden sm:flex border border-border-subtle">
          <button className="px-3 py-1 rounded-md font-medium text-body-sm text-text-secondary hover:text-text-primary transition-colors">
            Test
          </button>
          <button className="px-3 py-1 rounded-md bg-surface shadow-sm font-semibold text-body-sm text-primary border border-border-subtle">
            Live
          </button>
        </div>
        
        <div className="w-px h-6 bg-border mx-2"></div>
        
        <div className="flex items-center gap-1 text-text-secondary">
          <button className="p-2 hover:text-text-primary transition-colors rounded-lg hover:bg-surface-secondary relative">
            <Bell className="w-5 h-5" strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2 hover:text-text-primary transition-colors rounded-lg hover:bg-surface-secondary">
            <History className="w-5 h-5" strokeWidth={2} />
          </button>
          <button className="p-2 hover:text-text-primary transition-colors rounded-lg hover:bg-surface-secondary ml-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-info flex items-center justify-center text-white shadow-sm border-2 border-surface">
              <span className="text-caption font-semibold">JD</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
