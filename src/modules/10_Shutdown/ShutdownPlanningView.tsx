/**
 * Digital MV Customer Service Management System
 * MODULE 10: Planned Outages & Shutdown Reference Tracking
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { ShutdownRecord } from '../../types';
import { PowerOff, Plus, ShieldAlert, CheckCircle2, Calendar, FileText } from 'lucide-react';

export const ShutdownPlanningView: React.FC = () => {
  const { currentUser } = useAuth();
  const [shutdowns, setShutdowns] = useState<ShutdownRecord[]>(() => db.getShutdowns());
  const [showModal, setShowModal] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [proposedDate, setProposedDate] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState(4);
  const [permitRef, setPermitRef] = useState('SEC-PERMIT-2026-');
  const [switchingAuth, setSwitchingAuth] = useState('National Grid SA Operations Desk');
  const [summary, setSummary] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    db.createShutdown(
      {
        siteName,
        customerName,
        proposedDate,
        proposedDurationHours: duration,
        customerApprovalStatus: 'Requested',
        externalPermitRef: permitRef,
        switchingAuthority: switchingAuth,
        plannedWorkSummary: summary,
        notes: 'Compliance Notice: Alfanar engineers are NOT permitted to perform MV switching. Utility switching authority required.',
      },
      currentUser
    );
    setShutdowns(db.getShutdowns());
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-50 text-red-700">
                <PowerOff className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Shutdown & Planned Outage Tracking</h2>
              <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded">
                Module 10
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tracks shutdown requests and external safety permit numbers.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Outage</span>
          </button>
        </div>

        {/* Safety Permit Disclaimer */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Safety Mandate:</strong> This module tracks external permit references and schedules only. It does not issue electrical safety permits, authorize MV switching, or bypass utility lock-out tag-out (LOTO) protocols.
          </span>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Request Ref</th>
                <th className="py-2.5 px-3">Site & Customer</th>
                <th className="py-2.5 px-3">Scheduled Window</th>
                <th className="py-2.5 px-3">External Permit Reference</th>
                <th className="py-2.5 px-3">Switching Authority</th>
                <th className="py-2.5 px-3">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shutdowns.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.requestNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{s.siteName}</div>
                    <div className="text-[10px] text-slate-400">{s.customerName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{s.proposedDate}</div>
                    <div className="text-[10px] text-slate-400">Duration: {s.proposedDurationHours} Hours</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-700 font-semibold">{s.externalPermitRef}</td>
                  <td className="py-3 px-3 text-slate-700">{s.switchingAuthority}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                      {s.customerApprovalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base">Register Planned Shutdown Outage</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Site / Substation *</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      placeholder="e.g. Substation 8044"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Saudi Electricity Company"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Proposed Outage Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={proposedDate}
                      onChange={e => setProposedDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration (Hours) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={duration}
                      onChange={e => setDuration(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">External Safety Permit Reference *</label>
                  <input
                    type="text"
                    required
                    value={permitRef}
                    onChange={e => setPermitRef(e.target.value)}
                    placeholder="e.g. SEC-PERMIT-CR-2026-9912"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Utility Switching Authority Desk *</label>
                  <input
                    type="text"
                    required
                    value={switchingAuth}
                    onChange={e => setSwitchingAuth(e.target.value)}
                    placeholder="e.g. National Grid SA Operations Desk"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planned Work Scope</label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    placeholder="Scope of work requiring dead busbar..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                  >
                    Save Outage Record
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
