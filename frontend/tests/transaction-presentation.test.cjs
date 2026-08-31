const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../lib/transaction-presentation.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { scorePercent, riskLevel, readableCode, decisionLabel, auditSummary } = context.exports;

test("missing scores stay unknown instead of appearing low-risk", () => {
  for (const value of [null, undefined, NaN, Infinity, "0.2"]) {
    assert.equal(scorePercent(value), "—");
    assert.equal(riskLevel(value), "Not scored");
  }
});

test("scores preserve zero and use a consistent scale", () => {
  assert.equal(scorePercent(0), "0");
  assert.equal(scorePercent(.05, 1), "5.0");
  assert.equal(scorePercent(.94), "94");
  assert.equal(scorePercent(-1), "0");
  assert.equal(scorePercent(2), "100");
  assert.equal(riskLevel(0), "Low");
  assert.equal(riskLevel(.3), "Medium");
  assert.equal(riskLevel(.6), "High");
  assert.equal(riskLevel(.8), "Critical");
});

test("machine codes become readable labels", () => {
  assert.equal(readableCode("LOW_MACHINE_RISK"), "Low machine risk");
  assert.equal(decisionLabel("ALLOW"), "Allow");
  assert.equal(decisionLabel(null), "Pending");
});

test("audit summaries retain decisions and recorded reasons", () => {
  assert.equal(auditSummary({ final_decision: "ALLOW", reason_codes: ["LOW_MACHINE_RISK"] }), "Allow — Low machine risk.");
  assert.equal(auditSummary({ decision: "BLOCK", reason: "RULE_MATCHED" }), "Block — Rule matched.");
  assert.equal(auditSummary({ risk_score: 0 }), "Risk score 0.0 / 100.");
  assert.equal(auditSummary({ agent_state: "SKIPPED" }), "Investigation skipped.");
  assert.equal(auditSummary({ message: "Evidence received" }), "Evidence received");
  assert.equal(auditSummary(null), "Event recorded in the decision trail.");
});
