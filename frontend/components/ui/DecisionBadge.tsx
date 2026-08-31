import React from "react";
import { decisionLabel } from "../../lib/transaction-presentation";

export type DecisionType = "ALLOW" | "REVIEW" | "BLOCK" | "UNKNOWN";

interface DecisionBadgeProps {
  decision: DecisionType | string;
  className?: string;
}

export function DecisionBadge({ decision, className }: DecisionBadgeProps) {
  const normalizedDecision = decision?.toUpperCase() || "UNKNOWN";
  
  return (
    <span className={`decision-label ${className || ""}`} data-decision={normalizedDecision}>
      <span aria-hidden="true" className="decision-dot" />{decisionLabel(normalizedDecision)}
    </span>
  );
}
