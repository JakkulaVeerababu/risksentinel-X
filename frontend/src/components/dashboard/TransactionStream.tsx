import React from "react";
import { TransactionSummary } from "../../types/risk";
import { RiskBadge } from "../common/RiskBadge";

interface Props {
  transactions: TransactionSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const TransactionStream: React.FC<Props> = ({ transactions, selectedId, onSelect }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ML Risk</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Graph Risk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr 
              key={tx.transaction_id} 
              onClick={() => onSelect(tx.transaction_id)}
              className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === tx.transaction_id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {tx.transaction_id}
                {tx.is_synthetic && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">SYNTHETIC</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{tx.amount.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{tx.ml_risk.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{tx.graph_risk.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <RiskBadge decision={tx.decision} />
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                No transactions available yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
