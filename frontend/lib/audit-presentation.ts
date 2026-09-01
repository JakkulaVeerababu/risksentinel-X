import type { AuditEvent } from "./api";
import { readableCode, scorePercent } from "./transaction-presentation";

type Payload = Record<string, unknown>;
export type AuditCategory = "all" | "decisions" | "investigations";

function record(value: unknown): Payload {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Payload : {};
}

export function ruleIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  const data = record(value);
  return Array.isArray(data.matched_rule_ids) ? ruleIds(data.matched_rule_ids) : [];
}

export function eventPayload(event: AuditEvent): Payload {
  // Legacy policy events store their entire result in input_summary.
  // New records separate inputs and outputs; explicit outputs take precedence.
  return { ...record(event.input_summary), ...record(event.output_summary) };
}

export function eventCategory(event: AuditEvent): AuditCategory {
  const type = event.event_type.toUpperCase();
  if (["POLICY_DECISION", "FINAL_DECISION_CREATED", "DECISION_PERSISTED"].includes(type)) return "decisions";
  if (type.startsWith("AGENT_") || type.startsWith("INVESTIGATION_")) return "investigations";
  return "all";
}

export function auditCounts(events: AuditEvent[]) {
  return {
    total: events.length,
    decisions: events.filter(event => eventCategory(event) === "decisions").length,
    investigations: events.filter(event => eventCategory(event) === "investigations").length,
  };
}

const names: Record<string, string> = {
  ML_SCORED: "Model scored", GRAPH_CHECKED: "Graph evidence checked",
  POLICY_DECISION: "Policy decision", POLICY_EVALUATED: "Policy evaluated",
  AGENT_STARTED: "Investigation started", AGENT_COMPLETED: "Investigation completed",
  AGENT_SKIPPED: "Investigation skipped", AGENT_DEGRADED: "Investigation degraded",
  AGENT_RECOMMENDATION_CREATED: "Recommendation recorded",
  FINAL_DECISION_CREATED: "Final decision recorded", DECISION_PERSISTED: "Decision saved",
};
export function eventLabel(type: string) { return names[type] || readableCode(type); }

export function recommendationLabel(value: string) {
  return readableCode(value.replace(/^(?:RecommendationEnum|Recommendation)\./i, ""));
}

const reasons: Record<string, string> = {
  ML_HIGH: "High model risk", HIGH_ML_RISK: "High model risk", GRAPH_HIGH: "High graph risk",
  MULTI_SIGNAL_HIGH_RISK: "High model and graph risk", LOW_MACHINE_RISK: "Low model and graph risk",
  GRAPH_EVIDENCE_UNAVAILABLE: "Graph evidence unavailable",
  AGENT_BLOCK_UNCORROBORATED: "Block recommendation without supporting high-risk machine signals",
};
export function reasonLabel(reason: string) { return reasons[reason] || readableCode(reason); }
export function reasonText(value: unknown): string {
  const codes = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return codes.filter((item): item is string => typeof item === "string" && !!item.trim()).map(item => reasonLabel(item.trim())).join(" · ");
}

export function recordedAt(value?: string, compact = false) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleString("en-IN", {
    day: "numeric", month: "short", ...(compact ? {} : { year: "numeric" as const }),
    hour: "2-digit", minute: "2-digit", ...(compact ? {} : { second: "2-digit" as const }),
  });
}

export function money(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Not recorded";
}

export function eventSummary(event: AuditEvent): string {
  const data = eventPayload(event);
  if (event.event_type === "MANUAL_RESOLUTION") {
    const previous = typeof data.old_decision === "string" ? readableCode(data.old_decision).toLowerCase() : null;
    const current = typeof data.new_decision === "string" ? readableCode(data.new_decision).toLowerCase() : null;
    const owner = typeof data.resolved_by === "string" ? readableCode(data.resolved_by) : null;
    if (previous && current) return `Payment decision changed from ${previous} to ${current}${owner ? ` by ${owner}` : ""}.`;
    return `Manual resolution recorded${owner ? ` by ${owner}` : ""}.`;
  }
  const decision = data.final_decision ?? data.decision;
  if (typeof decision === "string") {
    const reason = reasonText(data.reason_codes ?? data.reason);
    return `${readableCode(decision)}${reason ? ` — ${reason}` : " decision recorded"}.`;
  }
  if (typeof data.message === "string") return data.message;
  if (event.event_type === "TRANSACTION_RECEIVED") {
    const amount = data.TransactionAmt ?? data.amount;
    return typeof amount === "number" ? `${money(amount)} received for risk evaluation.` : "Payment received for risk evaluation.";
  }
  if (event.event_type === "AGENT_STARTED") return "Evidence submitted for assisted investigation.";
  if (typeof data.ml_score === "number") return `Model risk ${scorePercent(data.ml_score, 1)} / 100.`;
  if (Object.prototype.hasOwnProperty.call(data, "graph_score")) return data.graph_score == null ? "Graph evidence was unavailable." : `Graph risk ${scorePercent(data.graph_score, 1)} / 100.`;
  if (typeof data.recommendation === "string") return `${recommendationLabel(data.recommendation)} recommendation${typeof data.confidence === "number" ? ` · ${scorePercent(data.confidence)}% confidence` : ""}.`;
  if (typeof data.agent_state === "string") return `Investigation ${readableCode(data.agent_state).toLowerCase()}.`;
  if (typeof data.risk_score === "number") return `Risk score ${scorePercent(data.risk_score, 1)} / 100.`;
  const summaries: Record<string, string> = {
    TRANSACTION_PERSISTED: "Payment record saved.", AGENT_STARTED: "Evidence submitted for assisted investigation.",
    AGENT_SKIPPED: "No assisted investigation was run.", AGENT_COMPLETED: "Investigation result recorded.",
    AGENT_DEGRADED: "Investigation did not complete normally. Inspect the recorded details.",
    POLICY_EVALUATED: "Policy evaluation completed.",
  };
  return summaries[event.event_type] || `${eventLabel(event.event_type)} · ${readableCode(event.status).toLowerCase()}.`;
}

export function filterAuditEvents(events: AuditEvent[], category: AuditCategory, search: string, hours: number | null, now = Date.now()) {
  const query = search.trim().toLowerCase();
  return events.filter(event => {
    if (category !== "all" && eventCategory(event) !== category) return false;
    const time = Date.parse(event.timestamp);
    if (hours !== null && (!Number.isFinite(time) || time < now - hours * 3600000 || time > now)) return false;
    return !query || [event.event_id, event.resource_id, event.service, event.event_type, eventLabel(event.event_type), eventSummary(event)].some(value => value?.toLowerCase().includes(query));
  });
}

export function policyExplanation(decision?: string, recommendation?: string | null, reason?: string | null) {
  const differs = recommendation && decision && recommendation.toUpperCase() !== decision.toUpperCase();
  const recorded = reasonText(reason);
  if (differs) return `The agent recommended ${readableCode(recommendation).toLowerCase()}; policy recorded ${readableCode(decision).toLowerCase()}${recorded ? ` for ${recorded.toLowerCase()}` : ""}. Recommendations are advisory; policy owns the final outcome.`;
  return `Policy determines the final outcome from the recorded evidence. Agent recommendations are advisory.`;
}
