import { useState, useEffect } from "react";
import { RealtimeEvent } from "../types/risk";

const STREAM_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1") + "/stream/events";

export function useRealtime() {
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [status, setStatus] = useState<"Connected" | "Reconnecting" | "Disconnected">("Disconnected");

  useEffect(() => {
    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      setStatus("Reconnecting");
      eventSource = new EventSource(STREAM_URL);

      eventSource.onopen = () => {
        setStatus("Connected");
      };

      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.event !== "ping") {
            setLastEvent(payload);
          }
        } catch (err) {
          console.error("SSE parse error", err);
        }
      };

      eventSource.onerror = () => {
        setStatus("Disconnected");
        eventSource.close();
        // Bounded backoff
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (eventSource) eventSource.close();
    };
  }, []);

  return { lastEvent, status };
}
