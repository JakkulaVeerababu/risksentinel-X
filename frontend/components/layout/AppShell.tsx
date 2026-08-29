"use client";

import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex font-body-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-[260px] h-screen bg-background relative">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto scrollbar-custom bg-background pt-6 px-4 sm:px-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
