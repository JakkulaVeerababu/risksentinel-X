const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function load(name) {
  const source = fs.readFileSync(path.join(__dirname, `../lib/${name}.ts`), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  const context = { exports: {}, require: dependency => {
    assert.equal(dependency, "./transaction-presentation");
    return load("transaction-presentation");
  } };
  vm.runInNewContext(compiled, context);
  return context.exports;
}
const { auditCounts, eventPayload, eventSummary, eventLabel, ruleIds, filterAuditEvents, policyExplanation } = load("audit-presentation");
const event = (type, overrides = {}) => ({ event_id: type, event_type: type, timestamp: "2026-08-31T10:00:00Z", resource_id: "TX-1", service: "RiskOrchestrator", actor: "SYSTEM", status: "SUCCESS", input_summary: {}, output_summary: {}, ...overrides });

test("counters recognize policy and orchestration records, including skipped investigation events", () => {
  const counts = auditCounts([event("POLICY_DECISION"), event("FINAL_DECISION_CREATED"), event("AGENT_STARTED"), event("AGENT_SKIPPED"), event("ML_SCORED")]);
  assert.equal(counts.total, 5);
  assert.equal(counts.decisions, 2);
  assert.equal(counts.investigations, 2);
});

test("legacy policy results are read from input and explicit output wins", () => {
  const legacy = event("POLICY_DECISION", { input_summary: { final_decision: "REVIEW", reason_codes: ["GRAPH_HIGH"], graph_score: .85 } });
  assert.equal(eventSummary(legacy), "Review — High graph risk.");
  assert.equal(eventPayload(legacy).graph_score, .85);
  assert.equal(eventPayload({ ...legacy, output_summary: { final_decision: "BLOCK", graph_score: null } }).final_decision, "BLOCK");
  assert.equal(eventPayload({ ...legacy, output_summary: { graph_score: null } }).graph_score, null);
});

test("rule IDs support both current objects and legacy lists without inventing a match", () => {
  assert.equal(ruleIds({ matched_rule_ids: ["P-V1-003"], reason_codes: ["GRAPH_HIGH"] }).join(), "P-V1-003");
  assert.equal(ruleIds(["RS-204", null, 5]).join(), "RS-204");
  for (const missing of [null, undefined, {}, { reason_codes: ["ML_HIGH"] }]) assert.equal(ruleIds(missing).length, 0);
});

test("event summaries distinguish zero risk, missing graph data and recorded recommendations", () => {
  assert.equal(eventSummary(event("ML_SCORED", { output_summary: { ml_score: 0 } })), "Model risk 0.0 / 100.");
  assert.equal(eventSummary(event("GRAPH_CHECKED", { output_summary: { graph_score: null } })), "Graph evidence was unavailable.");
  assert.equal(eventSummary(event("GRAPH_CHECKED", { output_summary: { graph_score: 0 } })), "Graph risk 0.0 / 100.");
  assert.equal(eventSummary(event("AGENT_COMPLETED", { output_summary: { recommendation: "BLOCK", confidence: 0 } })), "Block recommendation · 0% confidence.");
  assert.equal(eventSummary(event("AGENT_COMPLETED", { output_summary: { recommendation: "RecommendationEnum.BLOCK", confidence: .99 } })), "Block recommendation · 99% confidence.");
  assert.equal(eventSummary(event("TRANSACTION_RECEIVED", { input_summary: { TransactionAmt: 100 } })), "₹100.00 received for risk evaluation.");
  assert.equal(eventLabel("POLICY_DECISION"), "Policy decision");
});

test("manual resolution events are rendered as plain-language summaries", () => {
  assert.equal(eventSummary(event("MANUAL_RESOLUTION", { input_summary: { old_decision: "BLOCK", new_decision: "ALLOW", resolved_by: "fraud_analyst" } })), "Payment decision changed from block to allow by Fraud analyst.");
});

test("filters search labels, reasons and resources and constrain time to loaded records", () => {
  const events = [event("POLICY_DECISION", { input_summary: { reason_codes: ["GRAPH_HIGH"], final_decision: "REVIEW" } }), event("AGENT_STARTED"), event("ML_SCORED", { timestamp: "2026-08-01T00:00:00Z" }), event("POLICY_DECISION", { event_id: "future", timestamp: "2027-01-01T00:00:00Z" })];
  const now = Date.parse("2026-08-31T12:00:00Z");
  assert.equal(filterAuditEvents(events, "all", "", 24, now).length, 2);
  assert.equal(filterAuditEvents(events, "decisions", "high graph", 24, now).length, 1);
  assert.equal(filterAuditEvents(events, "investigations", "tx-1", null, now).length, 1);
  assert.equal(filterAuditEvents(events, "all", "not-found", null, now).length, 0);
  assert.equal(filterAuditEvents([event("ML_SCORED", { timestamp: "invalid" })], "all", "", 24, now).length, 0);
});

test("advisory disagreements explain the boundary without fabricating a rule or changing the outcome", () => {
  const text = policyExplanation("REVIEW", "BLOCK", "ML_HIGH");
  assert.match(text, /agent recommended block; policy recorded review for high model risk/);
  assert.match(text, /advisory/);
  assert.doesNotMatch(text, /P-V1/);
});
