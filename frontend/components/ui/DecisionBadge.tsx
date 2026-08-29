import React from "react";
import { Badge } from "./Badge";

export type DecisionType = "ALLOW" | "REVIEW" | "BLOCK" | "UNKNOWN";

interface DecisionBadgeProps {
  decision: DecisionType | string;
  className?: string;
}

export function DecisionBadge({ decision, className }: DecisionBadgeProps) {
  const normalizedDecision = decision?.toUpperCase() || "UNKNOWN";
  
  let variant: "success-soft" | "warning-soft" | "danger-soft" | "secondary" = "secondary";
  
  if (normalizedDecision === "ALLOW") variant = "success-soft";
  else if (normalizedDecision === "REVIEW") variant = "warning-soft";
  else if (normalizedDecision === "BLOCK") variant = "danger-soft";

  return (
    <Badge variant={variant} className={className}>
      {normalizedDecision}
    </Badge>
  );
}
