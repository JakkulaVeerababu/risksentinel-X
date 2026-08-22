import React from "react";
import { RiskCase } from "../../types/risk";
import { RiskBadge } from "../common/RiskBadge";

interface Props {
  data: RiskCase;
}

export const InvestigationPanel: React.FC<Props> = ({ data }) => {
  const isOverride = data.agent.recommendation !== data.policy.decision;

  return (
    <div className="bg-white shadow sm:rounded-lg overflow-y-auto max-h-[calc(100vh-120px)] p-6 space-y-6">
      
      {/* 1. Transaction Details */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction Details</h3>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div><span className="text-xs text-gray-500 uppercase">ID</span><p className="font-semibold">{data.transaction.id}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">Amount</span><p className="font-semibold">₹{data.transaction.amount.toLocaleString()}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">Customer</span><p className="font-semibold">{data.transaction.customer_id}</p></div>
          <div><span className="text-xs text-gray-500 uppercase">Time</span><p className="font-semibold text-sm">{data.transaction.timestamp}</p></div>
        </div>
      </div>

      {/* 2 & 3. ML and Graph Risk */}
      <div className="grid grid-cols-2 gap-6 border-b border-gray-200 pb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">ML Risk Model</h4>
          <div className="text-3xl font-bold text-gray-900">{data.ml.risk_score.toFixed(4)}</div>
          <div className="text-xs text-gray-400 mt-1">Version: {data.ml.version}</div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Graph Intelligence</h4>
          <div className="text-3xl font-bold text-gray-900">{data.graph.risk_score.toFixed(4)}</div>
          <div className="text-xs mt-1">
            {data.graph.cluster_detected ? 
              <span className="text-red-600 font-medium">Cluster Detected</span> : 
              <span className="text-gray-400">Normal Neighborhood</span>}
          </div>
        </div>
      </div>

      {/* 4. Agent Tools & Evidence */}
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">AI Investigation Agent</h4>
        
        <div className="mb-4 bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-semibold text-gray-500 mb-2">TOOL CALLS</p>
          <ul className="space-y-1">
            {data.agent.tool_calls.map((tc, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-center">
                {tc.status === "success" ? "✓" : "✗"} <span className="ml-2 font-mono">{tc.tool}</span>
                <span className="ml-auto text-xs text-gray-400">{tc.duration_ms}ms</span>
              </li>
            ))}
          </ul>
        </div>

        {data.agent.evidence.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">VALIDATED EVIDENCE</p>
            <div className="space-y-2">
              {data.agent.evidence.map((ev, idx) => (
                <div key={idx} className="bg-blue-50 border-l-2 border-blue-500 p-2 rounded-r-md text-sm">
                  <span className="font-semibold">{ev.signal}:</span> {ev.observed}
                  <span className="ml-2 text-xs text-gray-400">[{ev.source}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.agent.reason_codes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">REASON CODES</p>
            <div className="flex flex-wrap gap-2">
              {data.agent.reason_codes.map(rc => (
                <span key={rc} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {rc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Agent Recommendation vs Policy Decision */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Agent Recommendation</h4>
          <RiskBadge decision={data.agent.recommendation} className="mb-1" />
          <p className="text-xs text-gray-400 italic">Confidence: {(data.agent.confidence * 100).toFixed(0)}% (Advisory)</p>
        </div>

        <div className="border-l-2 border-gray-200 pl-6">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Final Policy Decision</h4>
          <RiskBadge decision={data.policy.decision} className="text-lg px-3 py-1 mb-2" />
          
          {isOverride && (
            <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 text-xs text-yellow-700">
              <strong>OVERRIDE:</strong> Agent recommendation overridden by deterministic policy.
            </div>
          )}
          
          <p className="text-sm font-medium text-gray-700 mt-2">{data.policy.reason}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {data.policy.triggered_rules.map(rule => (
              <span key={rule} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-1 rounded font-mono">
                {rule}
              </span>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};
