"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "left" | "right";
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, position = "right", width = "w-[500px]" }: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-text-primary/20 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 z-50 bg-surface shadow-drawer transition-transform duration-normal ease-in-out flex flex-col",
          width,
          position === "right" ? "right-0" : "left-0",
          isOpen 
            ? "translate-x-0" 
            : position === "right" ? "translate-x-full" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0 bg-surface">
          <h2 className="text-body-lg font-semibold text-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-custom bg-background">
          {children}
        </div>
      </div>
    </>
  );
}
