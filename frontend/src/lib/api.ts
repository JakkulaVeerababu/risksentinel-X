import { TransactionSummary, RiskCase } from "../types/risk";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function fetchRecentTransactions(): Promise<TransactionSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/transactions`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    return data.transactions;
  } catch (error) {
    console.error("fetchRecentTransactions error:", error);
    return [];
  }
}

export async function fetchRiskCase(transactionId: string): Promise<RiskCase | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/transactions/${transactionId}/case`);
    if (!res.ok) throw new Error("Failed to fetch case");
    return await res.json();
  } catch (error) {
    console.error(`fetchRiskCase error for ${transactionId}:`, error);
    return null;
  }
}

export async function startSimulation(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/simulations/collusion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_count: 6, delay_ms: 1500 })
    });
    if (!res.ok) throw new Error("Failed to start simulation");
    const data = await res.json();
    return data.simulation_id;
  } catch (error) {
    console.error("Simulation start error:", error);
    return null;
  }
}
