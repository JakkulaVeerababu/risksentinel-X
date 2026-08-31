export function scorePercent(value: unknown, digits = 0): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return (Math.max(0, Math.min(1, value)) * 100).toFixed(digits);
}

export function riskLevel(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Not scored";
  return value >= .8 ? "Critical" : value >= .6 ? "High" : value >= .3 ? "Medium" : "Low";
}

export function readableCode(value?: string | null): string {
  if (!value) return "Not available";
  return value.toLowerCase().replaceAll("_", " ").replace(/^./, letter => letter.toUpperCase());
}

export function decisionLabel(value?: string | null): string {
  return readableCode(value || "PENDING");
}

export function auditSummary(output: unknown): string {
  if (typeof output === "string") return output;
  if (!output || typeof output !== "object" || Array.isArray(output)) return "Event recorded in the decision trail.";
  const data = output as Record<string, unknown>;
  const decision = data.final_decision ?? data.decision;
  const reasons = data.reason_codes;
  const reason = Array.isArray(reasons) ? reasons.filter(item => typeof item === "string").map(item => readableCode(item)).join(" · ") : typeof data.reason === "string" ? readableCode(data.reason) : "";
  if (typeof decision === "string") return `${decisionLabel(decision)}${reason ? ` — ${reason}` : " decision recorded"}.`;
  if (typeof data.message === "string") return data.message;
  if (typeof data.agent_state === "string") return `Investigation ${readableCode(data.agent_state).toLowerCase()}.`;
  if (typeof data.risk_score === "number") return `Risk score ${scorePercent(data.risk_score, 1)} / 100.`;
  return "Event recorded in the decision trail.";
}
