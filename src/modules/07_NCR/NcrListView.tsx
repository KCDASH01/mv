/**
 * Digital MV Customer Service Management System
 * MODULE 07: Non-Conformance Report (NCR) & Quality Assurance
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { NonConformanceReport, NcrDisposition } from '../../types';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Plus, 
  Check, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { export16ColumnNcrs } from '../../services/export';

export const NcrListView: React.FC = () => {
  const { currentUser, isQcaStore, isAdmin } = useAuth();
  const [ncrs, setNcrs] = useState<NonConformanceReport[]>(() => db.getNCRs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNcr, setSelectedNcr] = useState<NonConformanceReport | null>(null);

  // QCA disposition modal state
  const [disposition, setDisposition] = useState<NcrDisposition>('Rework');
  const [justification, setJustification] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const refreshList = () => {
    setNcrs(db.getNCRs());
  };

  const filtered = ncrs.filter(n =>
    n.ncrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.equipmentSerialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.defectDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.reportedByEngineerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQcaSubmit = () => {
    if (!selectedNcr || !currentUser) return;
    if (!justification || justification.trim().length < 5) {
      setErrorMsg('Mandatory Rule: QCA disposition requires an explicit technical justification.');
      return;
    }

    try {
      db.qcaReviewNcr(selectedNcr.id, disposition, justification, correctiveAction, currentUser);
      setSuccessMsg(`NCR ${selectedNcr.ncrNumber} quality disposition saved.`);
      refreshList();
      setSelectedNcr(null);
      setJustification('');
      setCorrectiveAction('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-50 text-red-700">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Non-Conformance Reports (NCR)</h2>
              <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded">
                Module 07
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Independent Quality Assurance (QCA) disposition, root cause analysis, and factory return decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => export16ColumnNcrs(ncrs)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Export 16-Col Legacy CSV
            </button>
          </div>
        </div>

        {/* Independence Rule Notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Independent Quality Principle:</strong> Technical visit report approval does not automatically resolve an NCR. QCA disposition and factory returns are separate authorized quality milestones.
          </span>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Search */}
        <div className="mt-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search NCR number, serial #, defect description, engineer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>

        {/* NCR Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">NCR Number</th>
                <th className="py-2.5 px-3">Equipment Serial #</th>
                <th className="py-2.5 px-3">Defect Category</th>
                <th className="py-2.5 px-3">Reporting Engineer</th>
                <th className="py-2.5 px-3">QCA Disposition</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No NCR records found.
                  </td>
                </tr>
              ) : (
                filtered.map(ncr => (
                  <tr key={ncr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-red-700">{ncr.ncrNumber}</div>
                      <div className="text-[10px] text-slate-400">{ncr.reportedDate}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{ncr.equipmentSerialNumber}</div>
                      <div className="text-[10px] text-slate-500">{ncr.equipmentFamily}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{ncr.defectCategory}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{ncr.defectDescription}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {ncr.reportedByEngineerName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{ncr.disposition}</span>
                      {ncr.qcaReviewerName && (
                        <div className="text-[10px] text-slate-400">By {ncr.qcaReviewerName}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ncr.status === 'rectified' || ncr.status === 'closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ncr.status === 'under_qca_review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ncr.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedNcr(ncr)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Disposition</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* QCA Review & Disposition Drawer */}
        {selectedNcr && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  QCA Technical Disposition: {selectedNcr.ncrNumber}
                </h3>
                <span className="text-xs text-slate-500">
                  Target Serial: {selectedNcr.equipmentSerialNumber} ({selectedNcr.equipmentFamily}) · Reported: {selectedNcr.reportedDate}
                </span>
              </div>
              <button
                onClick={() => setSelectedNcr(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Defect Description:</span>
              <p className="text-slate-700">{selectedNcr.defectDescription}</p>
            </div>

            {/* QCA Controls */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Quality Disposition Decision *</label>
                <select
                  value={disposition}
                  onChange={e => setDisposition(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                >
                  <option value="Rework">Rework on Site / Substation</option>
                  <option value="Return to Vendor / Factory">Return to Factory / Vendor (Custody Transfer)</option>
                  <option value="Scrap">Scrap / Decommission Component</option>
                  <option value="Use-As-Is">Use-As-Is (Concession Approval)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Rectification Date</label>
                <input
                  type="date"
                  defaultValue={selectedNcr.targetClosureDate}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Disposition Technical Justification *</label>
                <textarea
                  rows={2}
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  placeholder="State engineering reason for chosen disposition (e.g. O-ring batch failure covered under factory warranty recall TB-2025-04)..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Corrective Action Plan</label>
                <input
                  type="text"
                  value={correctiveAction}
                  onChange={e => setCorrectiveAction(e.target.value)}
                  placeholder="e.g. Replace seal assembly on site, conduct SF6 vacuum leak check, log stock transaction."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Approver: <strong>{currentUser?.name}</strong> ({currentUser?.role})
              </span>
              <button
                onClick={handleQcaSubmit}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-xs"
              >
                Sign Off Quality Disposition
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
