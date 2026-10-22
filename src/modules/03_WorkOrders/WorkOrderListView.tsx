/**
 * Digital MV Customer Service Management System
 * MODULE 03: Work Orders Register & Engineer Assignment Management
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { WorkOrder, User } from '../../types';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Timer, 
  UserCheck, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Props {
  onLaunchTimer: (workOrderId: string) => void;
  onLaunchWizard: (workOrderId: string) => void;
}

export const WorkOrderListView: React.FC<Props> = ({ onLaunchTimer, onLaunchWizard }) => {
  const { currentUser, isFieldEngineer, isSupervisor, isAdmin } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => db.getWorkOrders());
  const allUsers = db.getUsers();
  const engineers = allUsers.filter(u => u.role === 'field_engineer');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);

  // Reassignment & decline modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignEngineerId, setReassignEngineerId] = useState(engineers[0]?.id || '');
  const [reassignReason, setReassignReason] = useState('');

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const refreshList = () => {
    setWorkOrders(db.getWorkOrders());
  };

  const filtered = workOrders.filter(w => {
    const matchesSearch =
      w.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.assignedEngineerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAcceptWo = (wo: WorkOrder) => {
    if (!currentUser) return;
    try {
      db.engineerRespondToWorkOrder(wo.id, 'accept', undefined, currentUser);
      setFeedbackMsg(`Work Order ${wo.workOrderNumber} accepted. Ready for site travel timer.`);
      refreshList();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleDeclineWo = () => {
    if (!selectedWo || !currentUser) return;
    if (!declineReason || declineReason.trim().length < 5) {
      alert('Mandatory Rule: Declining a work order requires an explicit justification reason.');
      return;
    }
    try {
      db.engineerRespondToWorkOrder(selectedWo.id, 'decline', declineReason, currentUser);
      setFeedbackMsg(`Work Order ${selectedWo.workOrderNumber} declined.`);
      setShowDeclineModal(false);
      setSelectedWo(null);
      setDeclineReason('');
      refreshList();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleReassignWo = () => {
    if (!selectedWo || !currentUser) return;
    if (!reassignReason || reassignReason.trim().length < 5) {
      alert('Mandatory Rule: Reassigning an engineer requires an audit trail reason.');
      return;
    }
    try {
      db.reassignWorkOrder(selectedWo.id, reassignEngineerId, reassignReason, currentUser);
      setFeedbackMsg(`Work Order ${selectedWo.workOrderNumber} reassigned.`);
      setShowReassignModal(false);
      setSelectedWo(null);
      setReassignReason('');
      refreshList();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Action failed');
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
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Work Orders & Assignments</h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                Module 03
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field engineering job dispatches, acceptance tracking, reassignment audit trail, and direct timer trigger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Active WOs: <strong className="text-slate-900 font-mono">{workOrders.length}</strong>
            </span>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search WO number, site, customer, engineer..."
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
              <option value="assigned">Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="visit_submitted">Visit Submitted</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">WO ID / Priority</th>
                <th className="py-2.5 px-3">Site & Customer</th>
                <th className="py-2.5 px-3">Assigned Engineer</th>
                <th className="py-2.5 px-3">Target Dates</th>
                <th className="py-2.5 px-3">Equipment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Job Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No work orders found.
                  </td>
                </tr>
              ) : (
                filtered.map(wo => {
                  const isAssignedToMe = currentUser?.id === wo.assignedEngineerId;
                  return (
                    <tr key={wo.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 font-mono">{wo.workOrderNumber}</div>
                        <span
                          className={`inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            wo.priority === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : wo.priority === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {wo.priority}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 truncate max-w-xs">{wo.siteName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{wo.customerName}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">{wo.assignedEngineerName}</div>
                        <div className="text-[10px] text-slate-400">Supv: {wo.supervisorName}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-700">Planned: {wo.plannedVisitDate}</div>
                        <div className="text-[10px] text-slate-400">Due: {wo.dueDate}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{wo.equipmentFamily}</span>
                        <div className="text-[10px] text-slate-400">{wo.voltageRating}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            wo.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : wo.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : wo.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : wo.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {wo.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Timer trigger */}
                          <button
                            onClick={() => onLaunchTimer(wo.id)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded font-semibold transition-colors flex items-center gap-1"
                            title="Open 3-Stage Timer"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            <span>Timer</span>
                          </button>

                          {/* Engineer Accept/Decline */}
                          {wo.status === 'assigned' && (
                            <>
                              <button
                                onClick={() => handleAcceptWo(wo)}
                                className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
                                title="Accept Job"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedWo(wo);
                                  setShowDeclineModal(true);
                                }}
                                className="px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium transition-colors"
                                title="Decline with Reason"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {/* Supervisor Reassign */}
                          {(isSupervisor || isAdmin) && (
                            <button
                              onClick={() => {
                                setSelectedWo(wo);
                                setShowReassignModal(true);
                              }}
                              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                              title="Reassign Engineer"
                            >
                              Reassign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Decline Modal */}
        {showDeclineModal && selectedWo && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-5 max-w-md w-full space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">
                Decline Work Order: {selectedWo.workOrderNumber}
              </h3>
              <p className="text-slate-500">
                Rule: Declining a work order triggers an alert to the supervisor and requires a mandatory reason.
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mandatory Decline Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  placeholder="e.g. Schedule clash with emergency shutdown at Dammam; lack of specialized SF6 refilling gauge..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclineWo}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reassign Modal */}
        {showReassignModal && selectedWo && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-5 max-w-md w-full space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">
                Reassign Work Order: {selectedWo.workOrderNumber}
              </h3>
              <p className="text-slate-500">
                Current Engineer: <strong>{selectedWo.assignedEngineerName}</strong>
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Field Engineer *</label>
                <select
                  value={reassignEngineerId}
                  onChange={e => setReassignEngineerId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  {engineers.map(eng => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} ({eng.department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Audit Trail Reassignment Reason *</label>
                <textarea
                  rows={2}
                  required
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  placeholder="e.g. Engineer reassigned due to closer proximity to Riyadh Al-Malaz site..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReassignModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassignWo}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Reassign & Log Audit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
