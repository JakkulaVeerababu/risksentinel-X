"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "../../app/components/DashboardLayout";

const PUBLIC_ROUTES = new Set(["/", "/login"]);

export default function RootFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
