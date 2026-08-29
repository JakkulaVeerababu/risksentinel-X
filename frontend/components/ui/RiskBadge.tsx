import React from "react";
import { Badge } from "./Badge";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const variantMap: Record<RiskLevel, "success-soft" | "warning-soft" | "danger-soft" | "secondary"> = {
    LOW: "success-soft",
    MEDIUM: "warning-soft",
    HIGH: "warning-soft", // Amber for high
    CRITICAL: "danger-soft", // Red for critical
  };

  return (
    <Badge variant={variantMap[level]} className={className}>
      {level} RISK
    </Badge>
  );
}
