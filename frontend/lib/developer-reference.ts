export type ApiField = { name: string; type: string; required: boolean; description: string };
export type ApiEndpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  examplePath?: string;
  label: string;
  description: string;
  note: string;
  fields: ApiField[];
  body?: Record<string, string | number>;
  response: object;
};

const paymentFields: ApiField[] = [
  { name: "TransactionID", type: "string", required: true, description: "A unique payment reference (up to 255 characters)." },
  { name: "TransactionDT", type: "number", required: true, description: "Transaction time feature expected by the IEEE-CIS model." },
  { name: "TransactionAmt", type: "number", required: true, description: "The transaction amount." },
  { name: "ProductCD", type: "string", required: true, description: "The payment product code, for example W or C." },
];
const payment = { TransactionID: "tx_example_001", TransactionDT: 1000000, TransactionAmt: 15000.5, ProductCD: "W" };

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "process", method: "POST", path: "/transactions/process", label: "Process a payment",
    description: "Run the complete decision pipeline: model scoring, graph evidence, assisted investigation, and policy enforcement.",
    note: "Creates a transaction and its decision record. Use a unique TransactionID; duplicate IDs can return 409. Samples are not executed from this page.",
    body: { ...payment, customer_id: "customer_example", entity_id: "entity_example" },
    fields: [...paymentFields,
      { name: "customer_id", type: "string", required: false, description: "Your customer reference." },
      { name: "entity_id", type: "string", required: false, description: "An existing graph entity ID. Replace the sample ID with one from the graph explorer." },
    ],
    response: { transaction_id: "tx_example_001", status: "DECIDED", ml: { score: 0.5255, model_version: "xgb-ieeecis-v1" }, graph: { score: null, community_id: null, signals: {} }, agent: { state: "SKIPPED", recommendation: "ALLOW", confidence: 1.0 }, policy: { decision: "REVIEW", policy_version: "policy-v1", matched_rules: ["GRAPH_EVIDENCE_UNAVAILABLE"] } },
  },
  {
    id: "score", method: "POST", path: "/score", label: "Score a transaction",
    description: "Evaluate a payment with the baseline risk model without running the full decision pipeline.",
    note: "A model score is evidence, not a final policy decision. Additional model features are documented in the OpenAPI schema.",
    body: payment, fields: paymentFields,
    response: { transaction_id: "tx_example_001", risk_score: 0.5459, model_version: "xgb-ieeecis-v1" },
  },
  {
    id: "graph", method: "GET", path: "/graph/context/{entity_id}", examplePath: "/graph/context/entity_example", label: "Read graph context",
    description: "Inspect an entity’s direct connections, graph score, community, and supporting risk signals.",
    note: "Use an entity ID from the graph explorer. An unknown ID returns 404; unavailable graph data returns 503.",
    fields: [{ name: "entity_id", type: "path · string", required: true, description: "An entity that exists in the loaded graph." }],
    response: { entity_id: "entity_example", graph_score: 0.72, community_id: 184, signals: {}, related_entities: {}, nodes: [{ id: "entity_example", group: "customer" }, { id: "device_example", group: "device" }], links: [{ source: "entity_example", target: "device_example" }] },
  },
  {
    id: "audit", method: "GET", path: "/audit/{transaction_id}", examplePath: "/audit/tx_example_001", label: "Read the audit trail",
    description: "Retrieve the recorded sequence of events for a processed payment, from intake to the final decision.",
    note: "Use a processed transaction ID. A transaction without a recorded audit timeline returns 404.",
    fields: [{ name: "transaction_id", type: "path · string", required: true, description: "The reference returned by the processing endpoint." }],
    response: { transaction_id: "tx_example_001", events: [{ event_id: "event_example", timestamp: "2026-08-30T10:30:00Z", actor: "SYSTEM", service: "RiskOrchestrator", event_type: "TRANSACTION_RECEIVED", resource_id: "tx_example_001", input_summary: {}, output_summary: {}, status: "SUCCESS" }] },
  },
  {
    id: "health", method: "GET", path: "/health", label: "Check API health",
    description: "Verify backend availability and the database connection before integrating your payment flow.",
    note: "This read-only request checks the backend and database. It does not verify model or graph availability.",
    fields: [],
    response: { status: "healthy", service: "RiskSentinel X", version: "0.1.0", database: "healthy" },
  },
];

export function requestExample(endpoint: ApiEndpoint, baseUrl: string, language: "curl" | "javascript") {
  const url = `${baseUrl.replace(/\/$/, "")}${endpoint.examplePath || endpoint.path}`;
  if (language === "javascript") {
    if (!endpoint.body) return `const response = await fetch("${url}");\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst result = await response.json();`;
    return `const response = await fetch("${url}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${JSON.stringify(endpoint.body, null, 2).replaceAll("\n", "\n  ")})\n});\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst result = await response.json();`;
  }
  return `curl --request ${endpoint.method} \\\n  "${url}"${endpoint.body ? ` \\\n  --header "Content-Type: application/json" \\\n  --data '${JSON.stringify(endpoint.body, null, 2)}'` : ""}`;
}
