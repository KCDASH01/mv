/**
 * Digital MV Customer Service Management System
 * MODULE 09: Remote Technical Support & Telemetry Guidance
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { RemoteSupportCase } from '../../types';
import { Headphones, Plus, Search, CheckCircle2, Phone, Video, Mail, Radio, ArrowRight } from 'lucide-react';

export const RemoteSupportView: React.FC = () => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState<RemoteSupportCase[]>(() => db.getRemoteCases());
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New case fields
  const [customerName, setCustomerName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [issueSummary, setIssueSummary] = useState('');
  const [channel, setChannel] = useState<RemoteSupportCase['channel']>('Phone Call');
  const [actionsTaken, setActionsTaken] = useState('');
  const [duration, setDuration] = useState(30);

  const filtered = cases.filter(c =>
    c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.siteName.toLowerCase().includes(search.toLowerCase()) ||
    c.issueSummary.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const newCase = db.createRemoteCase(
      {
        customerName,
        siteName,
        issueSummary,
        assignedSupportEngineer: currentUser.name,
        channel,
        actionsTaken,
        resolutionStatus: 'Resolved',
        durationMinutes: duration,
      },
      currentUser
    );
    setCases(db.getRemoteCases());
    setShowModal(false);
    setCustomerName('');
    setSiteName('');
    setIssueSummary('');
    setActionsTaken('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Headphones className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Remote Technical Support</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 09
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Structured telephone, video conference, and SCADA telemetry assistance before field dispatch.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Remote Case</span>
          </button>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Customer & Site</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Issue Summary</th>
                <th className="py-2.5 px-3">Support Engineer</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{c.ticketNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{c.siteName}</div>
                    <div className="text-[10px] text-slate-400">{c.customerName}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{c.channel}</td>
                  <td className="py-3 px-3 text-slate-800 max-w-sm">
                    <div className="font-medium">{c.issueSummary}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.actionsTaken}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">{c.assignedSupportEngineer}</td>
                  <td className="py-3 px-3 font-mono">{c.durationMinutes} mins</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {c.resolutionStatus}
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
              <h3 className="font-bold text-slate-900 text-base">Log Remote Technical Support Session</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer / Organization *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Saudi Aramco"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Site / Facility *</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      placeholder="e.g. Tanajib Gas Plant"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assistance Channel</label>
                    <select
                      value={channel}
                      onChange={e => setChannel(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    >
                      <option value="Phone Call">Phone Call</option>
                      <option value="Video Conference">Video Conference</option>
                      <option value="SCADA Telemetry Review">SCADA Telemetry Review</option>
                      <option value="Email">Email Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={e => setDuration(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Reported by Customer *</label>
                  <input
                    type="text"
                    required
                    value={issueSummary}
                    onChange={e => setIssueSummary(e.target.value)}
                    placeholder="e.g. RTU DNP3 communication timeout on port 20000..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagnostic Guidance & Actions Taken *</label>
                  <textarea
                    rows={3}
                    required
                    value={actionsTaken}
                    onChange={e => setActionsTaken(e.target.value)}
                    placeholder="Guided technician to inspect fiber optic transceiver and reboot modem..."
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
                    Save Case
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
