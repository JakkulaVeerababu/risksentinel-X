"use client";

import { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Loader2 } from "lucide-react";

export default function CheckoutDemo() {
  const [ipAddress, setIpAddress] = useState("Gathering...");
  const [userAgent, setUserAgent] = useState("Gathering...");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Capture Telemetry on Mount
  useEffect(() => {
    // Basic fingerprinting
    setUserAgent(navigator.userAgent);

    // Fetch real IP address securely from a free API
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch((err) => setIpAddress("127.0.0.1 (Fallback)"));
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${baseUrl}/checkout/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 499.99,
          currency: "usd",
          ip_address: ipAddress,
          device_fingerprint: `${window.screen.width}x${window.screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
          user_agent: userAgent,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Live Demo Checkout
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Clicking pay will send your real IP address to RiskSentinel for evaluation.
          </p>
        </div>

        {/* Telemetry Display box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Live Telemetry Captured
          </h3>
          <div className="mt-2 text-xs font-mono text-gray-700 dark:text-gray-300 space-y-1">
            <p><strong>IP Address:</strong> {ipAddress}</p>
            <p className="truncate"><strong>Device:</strong> {userAgent}</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlePayment}>
          <div className="rounded-md shadow-sm -space-y-px bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount to Pay
              </label>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">$499.99</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Information
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value="•••• •••• •••• 4242"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-t-md focus:outline-none sm:text-sm"
                />
                <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || ipAddress === "Gathering..."}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Processing...
                </span>
              ) : (
                "Pay $499.99"
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${
            result.decision === "ALLOW" ? "bg-green-50 border-green-200 dark:bg-green-900/20" :
            result.decision === "BLOCK" ? "bg-red-50 border-red-200 dark:bg-red-900/20" :
            "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20"
          }`}>
            <h3 className="font-bold text-lg mb-2">Decision: {result.decision}</h3>
            <p className="text-sm">ML Score: {result.ml_score}</p>
            <p className="text-sm">Graph Risk: {result.graph_score}</p>
            <p className="text-xs text-gray-500 mt-2">Check your dashboard for the full investigation report.</p>
          </div>
        )}
      </div>
    </div>
  );
}
