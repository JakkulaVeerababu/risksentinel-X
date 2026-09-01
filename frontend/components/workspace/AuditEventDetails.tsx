import type { AuditEvent } from "../../lib/api";
import { eventPayload, eventSummary, reasonText, ruleIds, money, recommendationLabel } from "../../lib/audit-presentation";
import { readableCode, scorePercent } from "../../lib/transaction-presentation";
import { DecisionBadge } from "../ui/DecisionBadge";

export default function AuditEventDetails({ event }: { event: AuditEvent }) {
  const data = eventPayload(event);
  const decision = data.final_decision ?? data.decision ?? data.new_decision;
  const summary = eventSummary(event);
  const reason = reasonText(data.reason_codes ?? data.reason);
  const rules = ruleIds(data.matched_rule_ids ?? data.triggered_rules ?? data.matched_rules);
  const model = data.ml_score ?? data.ml_risk ?? data.risk_score;
  const graph = data.graph_score ?? data.graph_risk;
  const fields: [string, string][] = [];
  const add = (label: string, value: unknown) => { if (typeof value === "string" || typeof value === "number") fields.push([label, String(value)]); };
  if (reason) add("Recorded reason", reason);
  if ("ml_score" in data || "ml_risk" in data || "risk_score" in data) add("Model risk", model == null ? "Not available" : `${scorePercent(model, 1)} / 100`);
  if ("graph_score" in data || "graph_risk" in data) add("Graph risk", graph == null ? "Not available" : `${scorePercent(graph, 1)} / 100`);
  if (rules.length) add("Matched rules", rules.join(" · "));
  add("Policy version", data.policy_version ?? event.policy_version);
  add("Model version", data.ml_model_version ?? data.model_version ?? event.model_version);
  if (typeof data.agent_state === "string") add("Investigation", readableCode(data.agent_state));
  if (typeof (data.agent_recommendation ?? data.recommendation) === "string") add("Agent recommendation", recommendationLabel(String(data.agent_recommendation ?? data.recommendation)));
  const confidence = data.agent_confidence ?? data.confidence;
  if (typeof confidence === "number") add("Confidence", `${scorePercent(confidence, 1)}%`);
  if (typeof (data.TransactionAmt ?? data.amount) === "number") add("Payment amount", money(data.TransactionAmt ?? data.amount));
  add("Customer", data.customer_id);
  if (typeof data.old_decision === "string") add("Previous decision", readableCode(data.old_decision));
  if (typeof data.resolved_by === "string") add("Resolved by", readableCode(data.resolved_by));
  if (typeof event.latency === "number") add("Latency", `${event.latency} ms`);

  return <div className="event-detail-content">
    <section className="event-summary-card" aria-label="Event summary"><span>Event summary</span><p>{summary}</p></section>
    <section aria-label={typeof decision === "string" ? "Decision details" : "Event details"}>
      {typeof decision === "string" && <div className="event-outcome"><span>Recorded outcome</span><DecisionBadge decision={decision} /></div>}
      {!!fields.length && <dl className="record-fields">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      {typeof decision === "string" && <p className="record-note">The policy outcome is authoritative. An agent recommendation does not enforce a decision.</p>}
    </section>
    <dl className="record-fields record-provenance">
      <div><dt>Event ID</dt><dd className="record-code">{event.event_id}</dd></div>
      <div><dt>Resource</dt><dd className="record-code">{event.resource_id || "Not recorded"}</dd></div>
      <div><dt>Service</dt><dd>{event.service || "Not recorded"}</dd></div>
      <div><dt>Actor / status</dt><dd>{event.actor || "Not recorded"} · {readableCode(event.status)}</dd></div>
    </dl>
  </div>;
}
