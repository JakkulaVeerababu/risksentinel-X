"use client";

import React, { useState, useEffect } from "react";
import { fetchPolicies, createPolicy, togglePolicy, deletePolicy } from "../../lib/api";
import { Plus, Shield, Search, Trash2, SlidersHorizontal, Activity, X } from "lucide-react";
import { DecisionBadge } from "../../components/ui/DecisionBadge";

type Rule = { field: string; operator: string; value: string | number };
type ConditionRoot = { operator: "AND" | "OR"; rules: Rule[] };

type Policy = {
  policy_id: string;
  name: string;
  priority: number;
  conditions: ConditionRoot;
  action: string;
  reason_code: string;
  enabled: boolean;
  version: string;
  updated_at: string;
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Editor State
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<number>(100);
  const [action, setAction] = useState<"ALLOW" | "REVIEW" | "BLOCK">("BLOCK");
  const [reasonCode, setReasonCode] = useState("");
  const [rules, setRules] = useState<Rule[]>([{ field: "", operator: ">=", value: "" }]);
  const [rootOp, setRootOp] = useState<"AND" | "OR">("AND");

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await fetchPolicies();
      setPolicies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    try {
      const validRules = rules.filter(r => r.field && r.operator && r.value !== "");
      if (validRules.length === 0 || !name || !reasonCode) return alert("Please fill required fields.");

      const payload = {
        name,
        priority: Number(priority),
        action,
        reason_code: reasonCode,
        enabled: true,
        conditions: {
          operator: rootOp,
          rules: validRules.map(r => ({
            ...r,
            value: isNaN(Number(r.value)) ? r.value : Number(r.value)
          }))
        }
      };

      await createPolicy(payload);
      setIsEditorOpen(false);
      resetEditor();
      await loadPolicies();
    } catch (e) {
      alert("Failed to create policy.");
    }
  };

  const handleToggle = async (id: string) => {
    await togglePolicy(id);
    await loadPolicies();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      await deletePolicy(id);
      await loadPolicies();
    }
  };

  const resetEditor = () => {
    setName("");
    setPriority(100);
    setAction("BLOCK");
    setReasonCode("");
    setRules([{ field: "", operator: ">=", value: "" }]);
    setRootOp("AND");
  };

  return (
    <div className="flex flex-col gap-8 pb-12 h-full">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-heading-lg text-heading-lg text-text-primary ">
            Policy Engine
          </h1>
          <p className="text-label-sm text-text-secondary flex items-center gap-2">
            <span className="font-semibold text-primary flex items-center gap-1.5"><Activity className="w-4 h-4" /> AI recommends.</span> Policy decides.
          </p>
        </div>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-semibold transition-all premium-shadow hover:premium-shadow-hover flex items-center gap-2 text-label-sm"
        >
          <Plus className="w-4 h-4" /> Create Policy
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full min-h-[600px]">
        
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-secondary/50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-label-sm font-semibold text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg border border-border bg-surface shadow-sm transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
            <span className="text-label-sm font-medium text-text-muted">{policies.length} Policies Active</span>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 h-4 w-4 text-text-muted pointer-events-none top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search policies..." 
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-label-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-text-primary shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead className="bg-surface-secondary text-caption font-semibold uppercase text-text-muted border-b border-border">
              <tr>
                <th className="p-4 w-24">Priority</th>
                <th className="p-4 w-64">Policy Name</th>
                <th className="p-4">Conditions</th>
                <th className="p-4 w-40">Decision</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {loading && <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted text-label-sm font-medium">Loading policies...</td></tr>}
              {!loading && policies.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted text-label-sm font-medium bg-surface-secondary/20">No policies found. Create one to get started.</td></tr>
              )}
              {policies.map(p => (
                <tr key={p.policy_id} className="hover:bg-surface-secondary/50 transition-colors group">
                  <td className="p-4 whitespace-nowrap text-label-sm text-mono-sm text-mono-sm font-mono font-semibold text-text-secondary">{p.priority}</td>
                  <td className="p-4">
                    <div className="text-label-sm font-semibold text-text-primary mb-1">{p.name}</div>
                    <div className="text-caption text-text-muted text-mono-sm text-mono-sm font-mono">{p.policy_id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-caption font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded border border-primary/20 uppercase ">{p.conditions.operator}</span>
                      {p.conditions.rules.map((r, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-surface-secondary border border-border text-text-secondary text-caption px-2.5 py-1 rounded-md text-mono-sm text-mono-sm font-mono shadow-sm">
                            {r.field} <span className="text-primary font-semibold mx-1">{r.operator}</span> {r.value}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <DecisionBadge decision={p.action} />
                    <div className="text-caption text-mono-sm text-mono-sm font-mono font-semibold text-text-secondary mt-2">{p.reason_code}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggle(p.policy_id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-inner ${p.enabled ? 'bg-success' : 'bg-border-strong'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${p.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="p-4 whitespace-nowrap text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(p.policy_id)} className="text-text-muted hover:text-danger p-2 rounded-lg hover:bg-danger-soft transition-colors border border-transparent hover:border-danger/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-drawer flex flex-col max-h-full animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-surface-secondary/80">
              <h2 className="text-heading-md font-semibold text-text-primary flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" /> Create New Policy
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-text-muted hover:text-text-primary hover:bg-surface p-2 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 bg-surface">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-caption font-semibold text-text-secondary uppercase mb-2">Policy Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-secondary/50 border border-border rounded-lg px-4 py-2.5 text-label-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-sm transition-all font-medium" placeholder="e.g. High Risk ML & Graph"/>
                </div>
                <div>
                  <label className="block text-caption font-semibold text-text-secondary uppercase mb-2">Priority <span className="text-text-muted normal-case font-normal">(Higher runs first)</span></label>
                  <input type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} className="w-full bg-surface-secondary/50 border border-border rounded-lg px-4 py-2.5 text-label-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-sm transition-all text-mono-sm text-mono-sm font-mono font-semibold" />
                </div>
              </div>

              <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex justify-between items-center px-5 py-4 bg-surface-secondary border-b border-border">
                  <h3 className="text-label-sm font-semibold text-text-primary flex items-center gap-2 ">
                    <Activity className="w-4 h-4 text-primary" /> Rules Engine
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-caption font-semibold text-text-secondary uppercase ">Match Logic</span>
                    <select value={rootOp} onChange={(e: any) => setRootOp(e.target.value)} className="bg-surface border border-border text-primary text-caption font-semibold rounded-lg px-3 py-1.5 outline-none focus:border-primary shadow-sm cursor-pointer hover:bg-surface-secondary transition-colors">
                      <option value="AND">ALL (AND)</option>
                      <option value="OR">ANY (OR)</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-5 bg-surface space-y-4">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-surface-secondary/30 p-2 rounded-lg border border-transparent hover:border-border transition-colors">
                      <input type="text" value={rule.field} onChange={(e) => {
                        const newR = [...rules]; newR[idx].field = e.target.value; setRules(newR);
                      }} placeholder="Field (e.g. graph_score)" className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-label-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none shadow-sm text-mono-sm text-mono-sm font-mono"/>
                      
                      <select value={rule.operator} onChange={(e) => {
                        const newR = [...rules]; newR[idx].operator = e.target.value; setRules(newR);
                      }} className="w-24 bg-surface border border-border rounded-lg px-2 py-2 text-label-sm text-primary font-semibold focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none shadow-sm cursor-pointer text-center">
                        <option value="==">==</option>
                        <option value="!=">!=</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                      </select>

                      <input type="text" value={rule.value} onChange={(e) => {
                        const newR = [...rules]; newR[idx].value = e.target.value; setRules(newR);
                      }} placeholder="Value" className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-label-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none shadow-sm text-mono-sm text-mono-sm font-mono"/>
                      
                      <button onClick={() => setRules(rules.filter((_, i) => i !== idx))} className="text-text-muted hover:text-danger p-2 hover:bg-danger-soft rounded-lg transition-colors border border-transparent hover:border-danger/20"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  
                  <button onClick={() => setRules([...rules, {field:'', operator:'>=', value:''}])} className="text-caption text-primary hover:text-primary-hover font-semibold flex items-center gap-1.5 mt-4 ml-2">
                    <Plus className="w-4 h-4" /> Add Rule
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                <div>
                  <label className="block text-caption font-semibold uppercase mb-2 text-primary">THEN Action</label>
                  <select value={action} onChange={(e: any) => setAction(e.target.value)} className={`w-full bg-surface border rounded-lg px-4 py-2.5 text-label-sm font-semibold focus:outline-none focus:ring-1 shadow-sm transition-all cursor-pointer ${action === 'BLOCK' ? 'text-danger border-danger/30 focus:border-danger focus:ring-danger/50' : action === 'REVIEW' ? 'text-warning border-warning/30 focus:border-warning focus:ring-warning/50' : 'text-success border-success/30 focus:border-success focus:ring-success/50'}`}>
                    <option value="BLOCK">BLOCK</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="ALLOW">ALLOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption font-semibold uppercase mb-2 text-text-secondary">Reason Code</label>
                  <input type="text" value={reasonCode} onChange={e => setReasonCode(e.target.value)} className="w-full bg-surface-secondary/50 border border-border rounded-lg px-4 py-2.5 text-label-sm text-text-primary text-mono-sm text-mono-sm font-mono font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-sm transition-all" placeholder="e.g. COORDINATED_ATTACK"/>
                </div>
              </div>

            </div>
            
            <div className="px-6 py-5 border-t border-border bg-surface-secondary/80 flex justify-end gap-3">
              <button onClick={() => setIsEditorOpen(false)} className="px-5 py-2.5 text-label-sm font-semibold text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-secondary border border-border rounded-xl transition-colors shadow-sm">Cancel</button>
              <button onClick={handleCreatePolicy} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-semibold transition-all premium-shadow hover:premium-shadow-hover">Save Policy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}