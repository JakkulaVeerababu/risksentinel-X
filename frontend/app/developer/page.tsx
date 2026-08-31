"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/ui";
import { fetchApiHealth } from "../../lib/api";
import { API_ENDPOINTS, requestExample } from "../../lib/developer-reference";
import "../../styles/developer.css";

const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = configuredUrl?.startsWith("http") ? configuredUrl.replace(/\/$/, "") : "http://localhost:8000/api/v1";
const docsUrl = new URL("/docs", baseUrl).toString();

export default function DeveloperPage() {
  const [endpointId, setEndpointId] = useState("process");
  const [view, setView] = useState<"request" | "response">("request");
  const [language, setLanguage] = useState<"curl" | "javascript">("curl");
  const [connection, setConnection] = useState<"unchecked" | "checking" | "connected" | "unavailable">("unchecked");
  const [checkedAt, setCheckedAt] = useState("");
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(true);
  const checking = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(copyTimer.current); }; }, []);
  const endpoint = API_ENDPOINTS.find(item => item.id === endpointId)!;
  const code = view === "request" ? requestExample(endpoint, baseUrl, language) : JSON.stringify(endpoint.response, null, 2);
  const copyKey = `${endpointId}-${view}-${language}`;

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      if (!mounted.current) return;
      clearTimeout(copyTimer.current);
      setCopied(key);
      setCopyError("");
      copyTimer.current = setTimeout(() => setCopied(""), 2000);
    } catch {
      if (mounted.current) setCopyError("Clipboard access is unavailable. Select the code and copy it manually.");
    }
  }

  async function checkConnection() {
    if (checking.current) return;
    checking.current = true;
    setConnection("checking");
    try {
      const health = await fetchApiHealth();
      if (mounted.current) setConnection(health.status === "healthy" && health.database === "healthy" ? "connected" : "unavailable");
    } catch {
      if (mounted.current) setConnection("unavailable");
    } finally {
      checking.current = false;
      if (mounted.current) setCheckedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    }
  }

  return (
    <div className="api-page min-w-0 space-y-5">
      <PageHeader eyebrow="Build with RiskSentinel X" title="Developer APIs" description="Integrate payment scoring, connected evidence and policy decisions with one API." actions={<a className="workspace-button workspace-button-primary" href={docsUrl} target="_blank" rel="noreferrer">Open API reference<ExternalLink className="h-3.5 w-3.5" /></a>} />

      <section className="api-connection-strip" aria-label="API environment">
        <div className="api-base-url">
          <span>{configuredUrl?.startsWith("http") ? "Base URL" : "Local API"}</span>
          <code>{baseUrl}</code>
          <button type="button" className="api-icon-button" aria-label="Copy base URL" onClick={() => void copy(baseUrl, "base-url")}>{copied === "base-url" ? <Check /> : <Copy />}</button>
        </div>
        <div className="api-connection-actions">
          <div className="api-health-state" data-state={connection} role="status" title={checkedAt ? `Last checked ${checkedAt}` : "Read-only backend and database health check"}>
            <span aria-hidden="true" />{connection === "connected" ? "Backend & database healthy" : connection === "unavailable" ? "Backend unavailable" : connection === "checking" ? "Checking connection…" : "Connection not checked"}
          </div>
          <button type="button" className="api-text-button" disabled={connection === "checking"} onClick={() => void checkConnection()}><RefreshCw className={connection === "checking" ? "animate-spin" : ""} />Check connection</button>
        </div>
      </section>

      <section className="api-document" aria-label="API documentation">
        <nav className="api-endpoint-nav" aria-label="API endpoints">
          {API_ENDPOINTS.map(item => <button key={item.id} type="button" aria-pressed={endpointId === item.id} onClick={() => { setEndpointId(item.id); setView("request"); setCopied(""); setCopyError(""); }}>
            <span>{item.method}</span>{item.label}
          </button>)}
        </nav>

        <div className="api-document-body">
          <header className="api-endpoint-heading">
            <div className="api-route"><span>{endpoint.method}</span><code>/api/v1{endpoint.path}</code><small>REST · JSON · v1</small></div>
            <h2>{endpoint.label}</h2>
            <p>{endpoint.description}</p>
          </header>

          <div className="api-reference-columns">
            <section className="api-parameters" aria-label="Endpoint parameters">
              <div className="api-section-label"><h3>{endpoint.method === "POST" ? "Request body" : "Parameters"}</h3><span>{endpoint.method === "POST" ? "application/json" : "Path parameters"}</span></div>
              {endpoint.fields.length ? <dl>{endpoint.fields.map(field => <div key={field.name} className="api-parameter-row">
                <dt><code>{field.name}</code><span>{field.type} · {field.required ? "required" : "optional"}</span></dt>
                <dd>{field.description}</dd>
              </div>)}</dl> : <p className="api-no-parameters">No parameters or request body required.</p>}
              <p className="api-endpoint-note">{endpoint.note}</p>
            </section>

            <section className="api-code-example" aria-label="Code example">
              <div className="api-section-label"><h3>Integration example</h3><span>{view === "request" ? "Request" : "Response"}</span></div>
              <div className="api-code-window">
                <div className="api-code-toolbar">
                  <div className="api-code-views" aria-label="Example view">{(["request", "response"] as const).map(item => <button key={item} type="button" aria-pressed={view === item} onClick={() => { setView(item); setCopyError(""); }}>{item === "request" ? "Request" : "Example response"}</button>)}</div>
                  <div className="api-code-actions">
                    {view === "request" ? <select aria-label="Code language" value={language} onChange={event => setLanguage(event.target.value as typeof language)}><option value="curl">cURL</option><option value="javascript">JavaScript</option></select> : <span>JSON</span>}
                    <button type="button" onClick={() => void copy(code, copyKey)} aria-label="Copy code">{copied === copyKey ? <Check /> : <Copy />}{copied === copyKey ? "Copied" : "Copy"}</button>
                  </div>
                </div>
                <pre tabIndex={0} aria-label={view === "request" ? "Request code" : "Example response code"}><code>{code.split("\n").map((line, index) => <span className="api-code-line" key={index}><span aria-hidden="true" className="api-line-number">{index + 1}</span>{line || " "}</span>)}</code></pre>
              </div>
              <p className="api-example-caption">{view === "response" ? "Response example. Values depend on the request and active configuration." : "Copy and run in your application. Requests are not sent from this page."}</p>
            </section>
          </div>
        </div>
      </section>
      <p role="status" className={copyError ? "api-copy-error" : "sr-only"}>{copyError || (copied ? "Copied to clipboard" : "")}</p>

      <div className="api-platform-notes">
        <div><h3>API access & security</h3><p>API authentication is not enabled in this environment. Do not expose the unauthenticated backend to the public internet.</p></div>
        <div><h3>Synchronous responses</h3><p>Read the outcome in the processing response. Webhook delivery is not supported in the current version.</p></div>
      </div>
    </div>
  );
}
