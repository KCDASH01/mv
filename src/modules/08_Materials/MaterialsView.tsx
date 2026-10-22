/**
 * Digital MV Customer Service Management System
 * MODULE 08: Materials, Spare Parts & Transactional Stock Ledger
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { SparePart, StockTransaction } from '../../types';
import { 
  Package, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Truck
} from 'lucide-react';

export const MaterialsView: React.FC = () => {
  const { currentUser, isQcaStore, isAdmin } = useAuth();
  const [parts, setParts] = useState<SparePart[]>(() => db.getParts());
  const [transactions, setTransactions] = useState<StockTransaction[]>(() => db.getStockTransactions());

  const [activeTab, setActiveTab] = useState<'catalog' | 'ledger'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);

  // Issue modal fields
  const [issueType, setIssueType] = useState<StockTransaction['type']>('ISSUE_TO_JOB');
  const [issueQty, setIssueQty] = useState(1);
  const [destination, setDestination] = useState('Engineer Field Van ALF-VAN-12');
  const [woRef, setWoRef] = useState('WO-2026-0108');
  const [issueNotes, setIssueNotes] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const refreshData = () => {
    setParts(db.getParts());
    setTransactions(db.getStockTransactions());
  };

  const filteredParts = parts.filter(p =>
    p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.equipmentFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExecuteTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart || !currentUser) return;
    setErrorMsg(null);

    try {
      db.executeStockTransaction(
        {
          partId: selectedPart.id,
          partNumber: selectedPart.partNumber,
          partDescription: selectedPart.description,
          type: issueType,
          quantity: Number(issueQty),
          workOrderId: woRef || undefined,
          sourceLocation: selectedPart.location,
          destinationLocation: destination,
          notes: issueNotes || `Logged by ${currentUser.name}`,
        },
        currentUser
      );

      setFeedbackMsg(`Stock transaction recorded successfully. Inventory balance updated.`);
      setShowIssueModal(false);
      setSelectedPart(null);
      setIssueNotes('');
      refreshData();
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Package className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Materials & Spare Parts Ledger</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Module 08
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Transactional stock control, double-issue protection, factory return tracking, and inventory balances.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spare Parts Catalog ({parts.length})
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auditable Movement Ledger ({transactions.length})
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: CATALOG & BALANCES */}
        {activeTab === 'catalog' && (
          <div className="mt-4 space-y-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search part #, description, family, warehouse bin..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Part Number</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Equipment Target</th>
                    <th className="py-2.5 px-3">Storage Location</th>
                    <th className="py-2.5 px-3 text-right">Available Stock</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParts.map(part => (
                    <tr key={part.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {part.partNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{part.description}</div>
                        <div className="text-[10px] text-slate-400">Unit: {part.unit}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{part.equipmentFamily}</span>
                        <div className="text-[10px] text-slate-400">{part.voltageRating}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {part.location}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className="font-extrabold text-sm text-slate-900">{part.stockQuantity}</span>
                        <span className="text-[10px] text-slate-500 block">
                          ({part.reservedQuantity} reserved)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        SAR {part.unitCostSar.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedPart(part);
                            setShowIssueModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Movement</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: AUDITABLE TRANSACTION LEDGER */}
        {activeTab === 'ledger' && (
          <div className="mt-4">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Tx Number</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Part Details</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">From → To</th>
                    <th className="py-2.5 px-3">Performed By</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-700">
                        {tx.transactionNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.type === 'ISSUE_TO_JOB'
                              ? 'bg-amber-100 text-amber-800'
                              : tx.type === 'RECEIPT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.type === 'FACTORY_RETURN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {tx.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{tx.partDescription}</div>
                        <div className="text-[10px] font-mono text-slate-500">{tx.partNumber}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {tx.quantity}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{tx.sourceLocation}</div>
                        <div className="text-[10px] text-blue-600">→ {tx.destinationLocation}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {tx.performedBy}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stock Transaction Modal */}
        {showIssueModal && selectedPart && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base">
                Record Stock Movement: {selectedPart.partNumber}
              </h3>
              <p className="text-slate-500">
                {selectedPart.description} · Current Available: <strong>{selectedPart.stockQuantity}</strong>
              </p>

              <form onSubmit={handleExecuteTransaction} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Transaction Type *</label>
                    <select
                      value={issueType}
                      onChange={e => setIssueType(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                    >
                      <option value="ISSUE_TO_JOB">Issue to Work Order</option>
                      <option value="RECEIPT">Warehouse Inward Receipt</option>
                      <option value="RETURN_FROM_JOB">Return from Site</option>
                      <option value="FACTORY_RETURN">Factory Return (Custody)</option>
                      <option value="SCRAP_DISPOSAL">Scrap Disposal</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Quantity *</label>
                    <input
                      type="number"
                      min={1}
                      max={issueType === 'ISSUE_TO_JOB' ? selectedPart.stockQuantity : 999}
                      value={issueQty}
                      onChange={e => setIssueQty(Number(e.target.value))}
                      required
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Linked Work Order # (if applicable)</label>
                  <input
                    type="text"
                    value={woRef}
                    onChange={e => setWoRef(e.target.value)}
                    placeholder="e.g. WO-2026-0108"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Destination Location / Custody</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Engineer Van Tariq Mansoor / Central Factory QCA"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transaction Justification / Notes</label>
                  <input
                    type="text"
                    value={issueNotes}
                    onChange={e => setIssueNotes(e.target.value)}
                    placeholder="e.g. Replacement parts issued for SF6 replenishment at Substation 8044..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-3 py-2 border border-slate-300 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                  >
                    Commit Stock Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
