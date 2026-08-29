import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-background">
      {children}
    </div>
  );
}
