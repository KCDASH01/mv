/**
 * Digital MV Customer Service Management System
 * MODULE 02: Staff Complaints List & Dispatcher Triage
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { Complaint, Priority } from '../../types';
import { 
  Inbox, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserPlus, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  onCreateWorkOrder: (complaint: Complaint) => void;
}

export const ComplaintListView: React.FC<Props> = ({ onCreateWorkOrder }) => {
  const { currentUser, isSupervisor, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(() => db.getComplaints());

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Triage form state
  const [triageAction, setTriageAction] = useState<'accept' | 'request_clarification' | 'mark_duplicate'>('accept');
  const [triagePriority, setTriagePriority] = useState<Priority>('high');
  const [triageNotes, setTriageNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const refreshList = () => {
    setComplaints(db.getComplaints());
  };

  const filtered = complaints.filter(c => {
    const matchesSearch =
      c.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExecuteTriage = () => {
    if (!selectedComplaint || !currentUser) return;
    try {
      db.triageComplaint(
        selectedComplaint.id,
        triageAction,
        {
          priority: triagePriority,
          notes: triageNotes,
        },
        currentUser
      );
      setSuccessMsg(`Complaint ${selectedComplaint.referenceNumber} has been updated.`);
      refreshList();
      setSelectedComplaint(null);
      setTriageNotes('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Triage failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Inbox className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Complaints Register & Dispatcher Triage</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 02
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify intake reports, classify severity, check duplicates, and authorize work orders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Total Intake: <strong className="text-slate-900 font-mono">{complaints.length}</strong>
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference #, customer, site, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="unverified">Unverified (New)</option>
              <option value="accepted">Accepted for Action</option>
              <option value="clarification_needed">Clarification Needed</option>
              <option value="work_order_created">Work Order Created</option>
              <option value="closed">Closed / Duplicate</option>
            </select>
          </div>
        </div>

        {/* Table of Complaints */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Complaint Ref</th>
                <th className="py-2.5 px-3">Customer / Company</th>
                <th className="py-2.5 px-3">Site & Region</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No complaints matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 font-mono">{comp.referenceNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(comp.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{comp.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{comp.company}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium truncate max-w-xs">{comp.siteName}</div>
                      <div className="text-[11px] text-slate-400">{comp.city} · {comp.region}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700 font-medium">{comp.category}</span>
                      {comp.panelSerialNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">S/N: {comp.panelSerialNumber}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          comp.priority === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : comp.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {comp.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          comp.status === 'unverified'
                            ? 'bg-amber-100 text-amber-800'
                            : comp.status === 'work_order_created'
                            ? 'bg-indigo-100 text-indigo-800'
                            : comp.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {comp.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedComplaint(comp)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors flex items-center gap-1"
                          title="Triage & Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Triage</span>
                        </button>
                        {comp.status !== 'work_order_created' && (
                          <button
                            onClick={() => onCreateWorkOrder(comp)}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center gap-1"
                            title="Generate Work Order"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Create WO</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Triage & Detail Modal */}
        {selectedComplaint && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Dispatcher Triage: {selectedComplaint.referenceNumber}
                </h3>
                <span className="text-xs text-slate-500">
                  Customer: {selectedComplaint.customerName} ({selectedComplaint.company}) · Site: {selectedComplaint.siteName}
                </span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Reported Problem Description:</span>
              <p className="leading-relaxed">{selectedComplaint.description}</p>
            </div>

            {/* Triage Controls */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Triage Decision</label>
                <select
                  value={triageAction}
                  onChange={e => setTriageAction(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="accept">Accept Case for Action</option>
                  <option value="request_clarification">Request Clarification</option>
                  <option value="mark_duplicate">Mark Duplicate</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assign Operational Priority</label>
                <select
                  value={triagePriority}
                  onChange={e => setTriagePriority(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="critical">Critical (Immediate Response)</option>
                  <option value="high">High (Within 24 Hours)</option>
                  <option value="medium">Medium (Standard)</option>
                  <option value="low">Low (Non-urgent)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Triage / Clarification Notes</label>
                <input
                  type="text"
                  value={triageNotes}
                  onChange={e => setTriageNotes(e.target.value)}
                  placeholder="Notes for field team..."
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleExecuteTriage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Save Triage Decision
              </button>

              <button
                onClick={() => {
                  const comp = selectedComplaint;
                  setSelectedComplaint(null);
                  onCreateWorkOrder(comp);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Proceed to Work Order Creation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
