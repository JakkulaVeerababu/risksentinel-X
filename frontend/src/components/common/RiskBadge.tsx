import React from "react";
import { DecisionType } from "../../types/risk";

interface RiskBadgeProps {
  decision: DecisionType | "PENDING";
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ decision, className = "" }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let dotColor = "bg-gray-500";

  if (decision === "BLOCK") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    dotColor = "bg-red-500";
  } else if (decision === "REVIEW") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    dotColor = "bg-yellow-500";
  } else if (decision === "ALLOW") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    dotColor = "bg-green-500";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}>
      <svg className={`mr-1.5 h-2 w-2 ${textColor}`} fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" className={dotColor} />
      </svg>
      {decision}
    </span>
  );
};
