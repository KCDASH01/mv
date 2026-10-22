/**
 * Digital MV Customer Service Management System
 * MODULE 03: Create Work Order Modal
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { Complaint, Priority } from '../../types';
import { X, Briefcase, Calendar, UserCheck, ShieldAlert } from 'lucide-react';

interface Props {
  complaint?: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (workOrderId: string) => void;
}

export const CreateWorkOrderModal: React.FC<Props> = ({ complaint, isOpen, onClose, onCreated }) => {
  const { currentUser } = useAuth();
  const allUsers = db.getUsers();
  const equipmentCatalog = db.getEquipment();

  const engineers = allUsers.filter(u => u.role === 'field_engineer');
  const supervisors = allUsers.filter(u => u.role === 'dispatcher_supervisor' || u.role === 'admin');

  const [assignedEngineerId, setAssignedEngineerId] = useState(engineers[0]?.id || '');
  const [supervisorId, setSupervisorId] = useState(supervisors[0]?.id || '');
  const [priority, setPriority] = useState<Priority>(complaint?.priority || 'high');
  const [plannedVisitDate, setPlannedVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 48 * 3600000).toISOString().split('T')[0]);
  const [scopeOfWork, setScopeOfWork] = useState(
    complaint ? `Investigate reported issue: ${complaint.description}. Carry out SF6/mechanical checks, verify interlocks, and submit 3-stage site report.` : 'Standard technical inspection and fault investigation.'
  );
  const [equipmentFamily, setEquipmentFamily] = useState(complaint?.equipmentFamily || 'RMU');
  const [voltageRating, setVoltageRating] = useState<'13.8 kV' | '33 kV' | 'Other'>('13.8 kV');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint || !currentUser) return;

    try {
      const newWo = db.createWorkOrder(
        {
          complaintId: complaint.id,
          assignedEngineerId,
          supervisorId,
          priority,
          plannedVisitDate,
          dueDate,
          scopeOfWork,
          equipmentIds: [],
          equipmentFamily,
          voltageRating,
        },
        currentUser
      );

      onCreated(newWo.id);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create work order');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-100 text-blue-800">
              <Briefcase className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">Generate Work Order & Assign Engineer</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Linked Complaint Summary */}
          {complaint && (
            <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-lg space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Linked Complaint: {complaint.referenceNumber}</span>
                <span className="text-blue-700 font-mono">{complaint.category}</span>
              </div>
              <div className="text-slate-600">
                Site: <strong>{complaint.siteName}</strong> · Customer: {complaint.customerName} ({complaint.company})
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assign Field Engineer *</label>
              <select
                value={assignedEngineerId}
                onChange={e => setAssignedEngineerId(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                {engineers.map(eng => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Direct Supervisor *</label>
              <select
                value={supervisorId}
                onChange={e => setSupervisorId(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                {supervisors.map(sup => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name} ({sup.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Planned Visit Date</label>
              <input
                type="date"
                required
                value={plannedVisitDate}
                onChange={e => setPlannedVisitDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">SLA Resolution Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Equipment Family</label>
              <select
                value={equipmentFamily}
                onChange={e => setEquipmentFamily(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="RMU">RMU (Ring Main Unit)</option>
                <option value="MRMU">MRMU (Modular RMU)</option>
                <option value="SRMU">SRMU (Smart RMU)</option>
                <option value="Auto-Recloser">Auto-Recloser (ACR)</option>
                <option value="LBS">LBS (Load Break Switch)</option>
                <option value="SLBS">SLBS (Sectionalizer)</option>
                <option value="Other">Other Family</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Voltage Rating</label>
              <select
                value={voltageRating}
                onChange={e => setVoltageRating(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="13.8 kV">13.8 kV</option>
                <option value="33 kV">33 kV</option>
                <option value="Other">Other Voltage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Scope of Work & Job Instructions *</label>
            <textarea
              rows={3}
              required
              value={scopeOfWork}
              onChange={e => setScopeOfWork(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
            >
              Generate Work Order & Notify Engineer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
