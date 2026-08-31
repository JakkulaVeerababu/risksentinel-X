const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../lib/relationship-presentation.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { ENTITY_LABELS, entityKind, directNeighbors, connectionPosition } = context.exports;

test("graph metadata identifies instruments and keeps unknown entities honest", () => {
  assert.equal(ENTITY_LABELS[entityKind("payment_instrument")], "Payment instrument");
  assert.equal(ENTITY_LABELS[entityKind("merchant")], "Merchant");
  assert.equal(entityKind("DEVICE"), "device");
  assert.equal(entityKind("unrecognized"), "unknown");
  assert.equal(entityKind(), "unknown");
  assert.equal(entityKind("constructor"), "unknown");
});

test("only recorded direct links are shown, in either direction", () => {
  const graph = {
    nodes: [{ id: "C1" }, { id: "D1" }, { id: "P1" }, { id: "C2" }],
    links: [{ source: "C1", target: "D1" }, { source: "P1", target: "C1" }, { source: "D1", target: "C2" }, { source: "C1", target: "C1" }],
  };
  assert.deepEqual(Array.from(directNeighbors(graph, "C1"), node => node.id), ["D1", "P1"]);
  assert.equal(directNeighbors(null, "C1").length, 0);
  assert.equal(directNeighbors(graph, "missing").length, 0);
});

test("bounded connection layouts keep every node and its label inside the map", () => {
  for (let count = 1; count <= 6; count++) {
    const positions = Array.from({ length: count }, (_, index) => connectionPosition(index, count));
    assert.equal(new Set(positions.map(point => `${point.x},${point.y}`)).size, count);
    for (const point of positions) {
      assert.ok(point.x >= 17 && point.x <= 83);
      assert.ok(point.y >= 58 && point.y <= 274);
      assert.ok(point.y + 65 < 344);
    }
  }
});
