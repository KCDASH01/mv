/**
 * Digital MV Customer Service Management System
 * MODULE 13: Customer Closure & Sign-Off (Blocking NCR Check)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { Complaint, WorkOrder, CustomerClosureRecord } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  Lock, 
  Star,
  FileCheck,
  Check
} from 'lucide-react';

export const CustomerClosureView: React.FC = () => {
  const { currentUser, isSupervisor, isManager, isAdmin } = useAuth();
  const complaints = db.getComplaints();
  const workOrders = db.getWorkOrders();
  const ncrs = db.getNCRs();
  const closures = db.getCustomerClosures();

  // Active cases eligible for closure
  const eligibleCases = complaints.filter(c => c.status !== 'closed');

  const [selectedCaseId, setSelectedCaseId] = useState(eligibleCases[0]?.id || '');
  const [repName, setRepName] = useState('Eng. Mansour Al-Garni');
  const [outcome, setOutcome] = useState<CustomerClosureRecord['serviceOutcome']>('Permanent Fix Verified');
  const [limitations, setLimitations] = useState('No outstanding limitations. All interlocks and SF6 gas levels within nominal specification.');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [overrideException, setOverrideException] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedComplaint = complaints.find(c => c.id === selectedCaseId);
  const linkedWo = workOrders.find(w => w.complaintId === selectedCaseId);
  const openNcrs = ncrs.filter(n => n.caseId === selectedCaseId && n.status !== 'closed' && n.status !== 'rectified');

  const handleCloseCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !currentUser) return;
    setErrorMsg(null);

    try {
      db.closeServiceCase(
        {
          caseId: selectedComplaint.id,
          workOrderId: linkedWo?.id || selectedComplaint.assignedWorkOrderId || 'wo_manual',
          customerRepresentative: repName,
          serviceOutcome: outcome,
          unresolvedLimitations: limitations,
          customerFeedbackScore: feedbackRating,
          authorizedExceptionOverride: overrideException,
          exceptionJustification: overrideReason,
        },
        currentUser
      );

      setFeedbackMsg(`Case ${selectedComplaint.referenceNumber} has been permanently closed.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Closure failed');
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
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Customer Closure & Service Sign-Off</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Module 13
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Final customer sign-off, unresolved limitation declarations, and blocking NCR resolution enforcement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Closed Cases: <strong className="text-slate-900 font-mono">{closures.length}</strong>
            </span>
          </div>
        </div>

        {/* Blocking Rule Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Enforced Non-Negotiable Gate:</strong> Cases cannot be closed while blocking NCR defects or pending parts replacements remain unresolved, unless an authorized executive exception override is formally signed off.
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
            <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Case Closure Form */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleCloseCase} className="lg:col-span-2 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              Service Closure Form
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Case for Closure *</label>
              <select
                value={selectedCaseId}
                onChange={e => setSelectedCaseId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                {eligibleCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.referenceNumber} — {c.siteName} ({c.customerName})
                  </option>
                ))}
              </select>
            </div>

            {/* Blocking Open NCR Check Alert */}
            {openNcrs.length > 0 && (
              <div className="p-3 bg-red-100/70 border border-red-300 rounded-lg text-xs text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-red-800">
                  <Lock className="w-4 h-4 text-red-700" />
                  <span>Closure Blocked by {openNcrs.length} Unresolved NCR(s)</span>
                </div>
                <p>
                  Defect lines: {openNcrs.map(n => `${n.ncrNumber} (${n.defectCategory})`).join(', ')}.
                  Resolve through QCA Disposition first or tick executive override below.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="override"
                    checked={overrideException}
                    onChange={e => setOverrideException(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <label htmlFor="override" className="font-bold text-red-800 cursor-pointer">
                    Apply Documented Authorized Exception Override
                  </label>
                </div>
                {overrideException && (
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={e => setOverrideReason(e.target.value)}
                    placeholder="Enter formal justification for closing despite open NCR..."
                    className="w-full mt-1 p-1.5 bg-white border border-red-400 rounded text-slate-900"
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Sign-Off Representative *</label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={e => setRepName(e.target.value)}
                  placeholder="e.g. Eng. Mansour Al-Garni"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Service Outcome Classification *</label>
                <select
                  value={outcome}
                  onChange={e => setOutcome(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  <option value="Permanent Fix Verified">Permanent Fix Verified</option>
                  <option value="Temporary Bypass Installed">Temporary Bypass Installed</option>
                  <option value="Customer Equipment Issue (No MV Fault)">Customer Equipment Issue (No MV Fault)</option>
                  <option value="Awaiting Factory Components">Awaiting Factory Components</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unresolved Limitations or Advisories</label>
              <textarea
                rows={2}
                value={limitations}
                onChange={e => setLimitations(e.target.value)}
                placeholder="State any operational limits (e.g. Temporary bypass in place; avoid exceeding 400A peak until replacement breaker arrives)..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Feedback Score (1-5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 rounded hover:bg-amber-50"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-slate-500 font-mono ml-2">{feedbackRating} / 5 Stars</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={openNcrs.length > 0 && !overrideException}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs disabled:opacity-40 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Finalize Customer Case Closure</span>
              </button>
            </div>
          </form>

          {/* Historical Closure Register */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Recently Closed Cases ({closures.length})
            </h3>
            {closures.length === 0 ? (
              <div className="text-slate-400 py-6 text-center">
                No closed cases in current session.
              </div>
            ) : (
              closures.map(cls => (
                <div key={cls.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>{cls.closureNumber}</span>
                    <span className="text-emerald-700 font-sans text-[10px] uppercase">{cls.serviceOutcome}</span>
                  </div>
                  <div className="text-slate-700 font-medium">{cls.customerName}</div>
                  <div className="text-[10px] text-slate-400">Signed off by {cls.customerRepresentative}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
