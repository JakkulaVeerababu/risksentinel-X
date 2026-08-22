"use client";

import React, { useState, useEffect } from "react";
import { TransactionStream } from "../components/dashboard/TransactionStream";
import { InvestigationPanel } from "../components/dashboard/InvestigationPanel";
import { fetchRecentTransactions, fetchRiskCase, startSimulation } from "../lib/api";
import { useRealtime } from "../hooks/useRealtime";
import { TransactionSummary, RiskCase } from "../types/risk";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<RiskCase | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { lastEvent, status } = useRealtime();

  // Initial Load
  useEffect(() => {
    fetchRecentTransactions().then((data) => {
      setTransactions(data);
      if (data.length > 0) {
        handleSelect(data[0].transaction_id);
      }
    });
  }, []);

  // Handle SSE Events
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.event === "transaction_received") {
      const newTx: TransactionSummary = {
        transaction_id: lastEvent.id,
        amount: lastEvent.data.amount,
        ml_risk: 0,
        graph_risk: 0,
        decision: "PENDING",
        timestamp: lastEvent.data.timestamp,
        is_synthetic: lastEvent.data.is_synthetic
      };
      setTransactions(prev => [newTx, ...prev].slice(0, 50));
      
      // Auto-select the first incoming simulation transaction for demo purposes
      if (newTx.is_synthetic && !isSimulating) {
          handleSelect(newTx.transaction_id);
      }
    } else if (lastEvent.event === "ml_scored") {
      setTransactions(prev => prev.map(tx => tx.transaction_id === lastEvent.id ? { ...tx, ml_risk: lastEvent.data.risk_score } : tx));
    } else if (lastEvent.event === "graph_completed") {
      setTransactions(prev => prev.map(tx => tx.transaction_id === lastEvent.id ? { ...tx, graph_risk: lastEvent.data.graph_risk } : tx));
    } else if (lastEvent.event === "policy_decision") {
      setTransactions(prev => prev.map(tx => tx.transaction_id === lastEvent.id ? { ...tx, decision: lastEvent.data.decision } : tx));
      
      // If the currently selected transaction just finished, refresh its case
      if (selectedTxId === lastEvent.id) {
        fetchRiskCase(lastEvent.id).then(setSelectedCase);
      }
      setIsSimulating(false); // Quick hack to re-enable button after a stream finishes
    }
  }, [lastEvent]);

  const handleSelect = async (id: string) => {
    setSelectedTxId(id);
    const caseData = await fetchRiskCase(id);
    setSelectedCase(caseData);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    await startSimulation();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight">RiskSentinel X</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Models detect. Graphs connect. Agents investigate. Policies decide.
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleSimulate}
            disabled={isSimulating || status !== 'Connected'}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors shadow flex items-center"
          >
            {isSimulating ? (
              <><span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>Running Scenario...</>
            ) : "Simulate Suspicious Collusion Pattern"}
          </button>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-slate-300">System Status:</div>
            <div className="flex items-center space-x-1">
              <span className={`h-2.5 w-2.5 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
              <span className="text-sm font-medium">{status}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Stream */}
        <div className="lg:col-span-1 h-[calc(100vh-100px)] flex flex-col">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Live Transaction Stream</h2>
          <div className="flex-1 overflow-auto rounded-lg shadow border border-gray-200 bg-white">
            <TransactionStream 
              transactions={transactions} 
              selectedId={selectedTxId} 
              onSelect={handleSelect} 
            />
          </div>
        </div>

        {/* Right Panel: Investigation Details */}
        <div className="lg:col-span-2 h-[calc(100vh-100px)] flex flex-col">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Investigation Detail {selectedTxId ? `- ${selectedTxId}` : ''}
          </h2>
          <div className="flex-1">
            {selectedCase ? (
              <InvestigationPanel data={selectedCase} />
            ) : (
              <div className="h-full bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 shadow">
                {selectedTxId ? "Loading investigation data..." : "Select a transaction to view details."}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
