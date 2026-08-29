"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { aiChatStream } from "../../lib/api";

type Message = { role: "assistant" | "user"; content: string };

const suggestions = [
  "Why did fraud spike today?",
  "Explain transaction C9000",
  "Show coordinated attacks",
  "Which merchants need review?",
];

const initialMessage = `### Live assessment
Critical exposure is concentrated in cluster FRC-0184. Eleven accounts share a device fingerprint and payment instrument.

### Recommended action
BLOCK the cluster and open a single coordinated investigation. Confidence is 94%.`;

function MessageContent({ content }: { content: string }) {
  if (!content.includes("###")) return <p className="whitespace-pre-wrap text-[13px] leading-6 text-[#d5def0]">{content}</p>;

  return (
    <div className="space-y-3">
      {content.split("###").filter((section) => section.trim()).map((section) => {
        const [titleLine, ...bodyLines] = section.trim().split("\n");
        const body = bodyLines.join("\n").trim();
        const action = titleLine.toLowerCase().includes("action") || titleLine.toLowerCase().includes("recommendation");
        return (
          <div key={titleLine} className={`rounded-xl border p-4 ${action ? "border-[#764459] bg-[#321c2a]" : "border-white/10 bg-white/[.035]"}`}>
            <p className={`text-[10px] font-extrabold uppercase tracking-[.14em] ${action ? "text-[#ff98a0]" : "text-[#7fa2f8]"}`}>{titleLine}</p>
            <p className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-[#d6deee]">{body}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function AIHubPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: initialMessage }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagePane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pane = messagePane.current;
    if (pane && messages.length > 1) pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text = input) => {
    const clean = text.trim();
    if (!clean || loading) return;
    const userMessage: Message = { role: "user", content: clean };
    setMessages((current) => [...current, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      await aiChatStream([...messages, userMessage], (chunk) => {
        setLoading(false);
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = { ...next[next.length - 1], content: `${next[next.length - 1].content}${chunk}` };
          return next;
        });
      });
    } catch {
      setMessages((current) => {
        const next = [...current];
        next[next.length - 1] = { role: "assistant", content: "The live AI service is unavailable, but ML, graph and policy evidence remain operational in this demo." };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[650px] h-[calc(100dvh-132px)] max-h-[900px] overflow-hidden rounded-[22px] border border-[#1d2c4a] bg-[#081226] text-white shadow-[0_24px_70px_rgba(8,18,38,.2)]">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.032)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute -right-40 -top-52 h-[620px] w-[620px] rounded-full bg-[#245dff]/24 blur-[120px]" />
      <div className="absolute -bottom-52 left-[12%] h-[520px] w-[520px] rounded-full bg-[#6b35ff]/18 blur-[120px]" />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <div className="flex items-center gap-3"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#80a2f8]">Investigation intelligence</p><span className="rounded-full border border-[#3d5f9e] bg-[#17315f] px-2 py-0.5 text-[9px] font-bold text-[#a9c0f5]">LIVE</span></div>
            <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-.04em] text-white sm:text-[34px]">Investigation AI</h1>
            <p className="mt-1 text-[12px] leading-5 text-[#92a3c2]">Ask questions across transactions, graph evidence and active policies.</p>
          </div>
          <div className="flex items-center gap-5 text-[10px] font-semibold text-[#8394b3]"><span>Graph connected</span><span>Policy aware</span><span className="text-[#55d9aa]">Operational</span></div>
        </header>

        <div ref={messagePane} className="scrollbar-custom flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
          <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`max-w-[820px] ${message.role === "user" ? "ml-auto" : "mr-auto w-full"}`}>
                <div className="mb-2 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.14em] text-[#7386a8]"><span>{message.role === "user" ? "You" : "RiskSentinel analysis"}</span>{message.role === "assistant" && index === 0 && <span className="text-[#55d9aa]">Current evidence</span>}</div>
                <div className={message.role === "user" ? "rounded-2xl rounded-tr-sm bg-[#255df5] px-5 py-3.5 text-white shadow-[0_10px_26px_rgba(37,93,245,.28)]" : "rounded-2xl rounded-tl-sm border border-white/10 bg-[#0d1a33]/92 p-4 shadow-[0_14px_34px_rgba(0,0,0,.16)] sm:p-5"}>
                  {message.role === "assistant" ? <MessageContent content={message.content} /> : <p className="text-[13px] leading-6">{message.content}</p>}
                </div>
              </article>
            ))}
            {loading && <div className="mr-auto rounded-xl border border-white/10 bg-[#0d1a33] px-4 py-3 text-[11px] font-semibold text-[#9baccc]">Reviewing live evidence…</div>}
          </div>
        </div>

        <footer className="border-t border-white/10 bg-[#09152b]/96 px-4 py-4 backdrop-blur-xl sm:px-7 sm:py-5">
          <div className="mx-auto w-full max-w-[900px]">
            <div className="hide-scrollbar mb-3 flex gap-2 overflow-x-auto">
              {suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)} className="shrink-0 rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-[10px] font-semibold text-[#9bacca] transition hover:border-[#547bda] hover:bg-[#17315f] hover:text-white">{suggestion}</button>)}
            </div>
            <div className="flex items-center rounded-xl border border-[#2a3b5d] bg-[#071124] p-1.5 shadow-inner focus-within:border-[#5c82e5] focus-within:ring-4 focus-within:ring-[#255df5]/10">
              <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Ask about a transaction, cluster or risk signal…" className="h-10 min-w-0 flex-1 bg-transparent px-3 text-[12px] text-white outline-none placeholder:text-[#667896]" />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} aria-label="Send investigation question" className="flex h-10 items-center gap-2 rounded-lg bg-[#255df5] px-4 text-[11px] font-bold text-white transition hover:bg-[#3f72ff] disabled:cursor-not-allowed disabled:opacity-45">Send <Send className="h-3.5 w-3.5" /></button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-[9px] font-semibold text-[#657896]"><span>AI recommends. Policy decides.</span><span className="hidden items-center gap-1 text-[#7fa2f8] sm:flex">Evidence-backed responses <ArrowRight className="h-3 w-3" /></span></div>
          </div>
        </footer>
      </div>
    </section>
  );
}
