/**
 * Digital MV Customer Service Management System
 * Supervisor Review Queue (Timesheets & Visit Reports)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { db } from '../../services/db';
import { SiteJobTimeLog, SiteVisitReport } from '../../types';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ShieldAlert, 
  Eye, 
  RotateCcw,
  Check
} from 'lucide-react';

export const SupervisorTimerReview: React.FC = () => {
  const { currentUser, isSupervisor, isAdmin, isManager } = useAuth();
  const [activeTab, setActiveTab] = useState<'time_logs' | 'visit_reports'>('time_logs');

  const timeLogs = db.getTimeLogs();
  const visitReports = db.getVisitReports();
  const workOrders = db.getWorkOrders();

  const [selectedTimeLog, setSelectedTimeLog] = useState<SiteJobTimeLog | null>(null);
  const [selectedVisitReport, setSelectedVisitReport] = useState<SiteVisitReport | null>(null);

  const [decisionNotes, setDecisionNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canReview = isSupervisor || isAdmin || isManager;

  const handleTimerDecision = (decision: 'approved' | 'returned_for_correction') => {
    if (!selectedTimeLog || !currentUser) return;
    if (decision === 'returned_for_correction' && (!decisionNotes || decisionNotes.trim().length < 5)) {
      setErrorMsg('Mandatory Rule: Returning a time log requires an explicit, detailed justification reason.');
      return;
    }

    try {
      db.supervisorReviewTimer(selectedTimeLog.id, decision, decisionNotes, currentUser);
      setSuccessMsg(`Time log has been marked as ${decision.toUpperCase()}.`);
      setSelectedTimeLog(null);
      setDecisionNotes('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed.');
    }
  };

  const handleVisitReportDecision = (decision: 'supervisor_approved' | 'returned_for_correction') => {
    if (!selectedVisitReport || !currentUser) return;
    if (decision === 'returned_for_correction' && (!decisionNotes || decisionNotes.trim().length < 5)) {
      setErrorMsg('Mandatory Rule: Returning a visit report requires detailed engineering correction comments.');
      return;
    }

    try {
      db.supervisorReviewVisitReport(selectedVisitReport.id, decision, decisionNotes, currentUser);
      setSuccessMsg(`Site Visit Report ${selectedVisitReport.visitReportNumber} has been ${decision.replace(/_/g, ' ').toUpperCase()}.`);
      setSelectedVisitReport(null);
      setDecisionNotes('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <CheckSquare className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Supervisor Review Queue</h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                Strict Quality Gate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field Engineer submissions require mandatory supervisor review. Engineer self-approval is blocked.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab('time_logs'); setSelectedTimeLog(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'time_logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Field Timesheets ({timeLogs.length})
            </button>
            <button
              onClick={() => { setActiveTab('visit_reports'); setSelectedVisitReport(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'visit_reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technical Visit Reports ({visitReports.length})
            </button>
          </div>
        </div>

        {/* Feedback banners */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {!canReview && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>RBAC Restriction:</strong> You are currently logged in as a <em>{currentUser?.role}</em>. Only Supervisors and Administrators can approve or return reports. Switch role in top bar to test approval actions.
            </span>
          </div>
        )}

        {/* TAB 1: FIELD TIMESHEETS REVIEW */}
        {activeTab === 'time_logs' && (
          <div className="mt-6">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Work Order / Site</th>
                    <th className="py-2.5 px-3">Field Engineer</th>
                    <th className="py-2.5 px-3">Segments Completed</th>
                    <th className="py-2.5 px-3">Travel (Out/Ret)</th>
                    <th className="py-2.5 px-3">On-Site Work</th>
                    <th className="py-2.5 px-3">Total Time</th>
                    <th className="py-2.5 px-3">Review Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timeLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400">
                        No time logs submitted yet.
                      </td>
                    </tr>
                  ) : (
                    timeLogs.map(log => {
                      const wo = workOrders.find(w => w.id === log.workOrderId);
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 font-mono">{wo?.workOrderNumber || log.workOrderId}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">{log.siteName}</div>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">
                            {log.engineerName}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-semibold text-slate-700">
                              {log.currentStep} / 6 Actions
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {log.isCompleted ? 'All 3 Segments Done' : 'In Progress'}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            {log.outboundTravelMinutes}m / {log.returnTravelMinutes}m
                          </td>
                          <td className="py-3 px-3 font-mono font-medium text-slate-900">
                            {log.onSiteWorkMinutes} min
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-blue-700">
                            {(log.totalDurationMinutes / 60).toFixed(2)} hrs
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                log.reviewStatus === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.reviewStatus === 'returned_for_correction'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {log.reviewStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedTimeLog(log)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Audit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal / Drawer for Time Log Audit & Approval */}
            {selectedTimeLog && (
              <div className="mt-6 p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Audit Timesheet: {selectedTimeLog.workOrderId} ({selectedTimeLog.siteName})
                    </h3>
                    <span className="text-xs text-slate-500">
                      Field Engineer: {selectedTimeLog.engineerName} · Total Recorded: {(selectedTimeLog.totalDurationMinutes / 60).toFixed(2)} hours
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTimeLog(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded"
                  >
                    Close
                  </button>
                </div>

                {/* Event Audit List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">Server Timestamped Events (6 Actions)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {selectedTimeLog.events.map(e => (
                      <div key={e.id} className="p-2.5 bg-white rounded border border-slate-200">
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>Action {e.stepNumber}: {e.action.replace(/_/g, ' ').toUpperCase()}</span>
                          <span className="font-mono text-blue-600">{new Date(e.serverTimestamp).toLocaleTimeString()}</span>
                        </div>
                        {e.notes && <p className="text-slate-500 text-[11px] mt-1">{e.notes}</p>}
                        {e.latitude && (
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            GPS Captured: {e.latitude}, {e.longitude}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supervisor Decision Area */}
                {canReview && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-800 block">
                      Supervisor Decision & Correction Notes (Required for Return):
                    </label>
                    <textarea
                      rows={2}
                      value={decisionNotes}
                      onChange={e => setDecisionNotes(e.target.value)}
                      placeholder="Enter verification comments or required correction rationale..."
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTimerDecision('approved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Timesheet</span>
                      </button>

                      <button
                        onClick={() => handleTimerDecision('returned_for_correction')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Return for Correction</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TECHNICAL VISIT REPORTS REVIEW */}
        {activeTab === 'visit_reports' && (
          <div className="mt-6">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Report ID / Rev</th>
                    <th className="py-2.5 px-3">Work Order & Site</th>
                    <th className="py-2.5 px-3">Field Engineer</th>
                    <th className="py-2.5 px-3">Panels Inspected</th>
                    <th className="py-2.5 px-3">Energy State</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No technical visit reports submitted yet. Use the Visit Report Wizard to generate a submission.
                      </td>
                    </tr>
                  ) : (
                    visitReports.map(rep => (
                      <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 font-mono">{rep.visitReportNumber}</div>
                          <div className="text-[10px] text-blue-600 font-semibold">Rev {rep.revisionNumber}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{rep.siteName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{rep.workOrderNumber}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {rep.engineerName}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {rep.panels?.length || 0} Panel(s)
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-700">
                            {rep.panels?.[0]?.energyState || 'Not Recorded'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              rep.status === 'supervisor_approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rep.status === 'returned_for_correction'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {rep.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedVisitReport(rep)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Visit Report Review Card */}
            {selectedVisitReport && (
              <div className="mt-6 p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Technical Review: {selectedVisitReport.visitReportNumber} (Rev {selectedVisitReport.revisionNumber})
                    </h3>
                    <span className="text-xs text-slate-500">
                      Site: {selectedVisitReport.siteName} · Engineer: {selectedVisitReport.engineerName}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedVisitReport(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded"
                  >
                    Close
                  </button>
                </div>

                {/* Panel Entries */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">Inspected Panels ({selectedVisitReport.panels?.length || 0})</h4>
                  {selectedVisitReport.panels?.map(p => (
                    <div key={p.id} className="p-3 bg-white rounded border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{p.panelIdentifier} — {p.equipmentFamily} ({p.voltageRating})</span>
                        <span className="font-mono text-slate-600">S/N: {p.serialNumber}</span>
                      </div>
                      <div className="text-slate-600">
                        <strong>Observed Energy State:</strong> {p.energyState}
                        {p.energyStateReason && (
                          <span className="text-red-700 ml-2 font-medium">(Reason: {p.energyStateReason})</span>
                        )}
                      </div>
                      <div className="text-slate-600">
                        <strong>Verified Engineering Findings:</strong> {p.verifiedEngineeringFindings}
                      </div>
                      <div className="text-slate-600">
                        <strong>Root Cause:</strong> {p.rootCause} · <strong>Solution:</strong> {p.solutionProvided}
                      </div>
                      {p.requiresNcr && (
                        <div className="text-amber-800 bg-amber-50 p-1.5 rounded font-medium">
                          ⚠️ Defect logged: Triggered Non-Conformance Report (NCR) for QCA review.
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Supervisor Approval / Return Controls */}
                {canReview && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-800 block">
                      Supervisor Approval Notes & Quality Endorsement:
                    </label>
                    <textarea
                      rows={2}
                      value={decisionNotes}
                      onChange={e => setDecisionNotes(e.target.value)}
                      placeholder="Add engineering review comments, verification notes, or return directives..."
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleVisitReportDecision('supervisor_approved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Technical Report</span>
                      </button>

                      <button
                        onClick={() => handleVisitReportDecision('returned_for_correction')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Return for Revision (Creates Rev 2)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
