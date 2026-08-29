"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={cn("flex gap-6 overflow-x-auto scrollbar-custom -mb-px", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "pb-3 text-label-sm font-medium transition-colors whitespace-nowrap border-b-2",
              isActive 
                ? "border-primary text-primary" 
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
