/**
 * Digital MV Customer Service Management System
 * MODULE 18: Immutable Append-Only Audit Trail
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { AuditEvent } from '../../types';
import { History, Search, ShieldCheck, Filter, Lock } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const auditLogs = db.getAuditEvents();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = auditLogs.filter(a => {
    const matchesSearch =
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.actorName.toLowerCase().includes(search.toLowerCase()) ||
      a.entityType.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase());

    const matchesAction = filterAction === 'all' || a.action.includes(filterAction.toUpperCase());
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                <History className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Immutable System Audit Trail</h2>
              <span className="text-xs bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                Module 18
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Append-only audit ledger recording every triage, timer action, supervisor review, stock movement, and closure.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Append-Only Non-Repudiation</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit actor, action type, entity ID, or details..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700"
          >
            <option value="all">All Action Families</option>
            <option value="COMPLAINT">Complaint Intake</option>
            <option value="WORK_ORDER">Work Orders</option>
            <option value="TIMER">3-Stage Timer</option>
            <option value="SUPERVISOR">Supervisor Reviews</option>
            <option value="NCR">NCR & Quality</option>
            <option value="STOCK">Stock Ledger</option>
            <option value="CLOSE">Case Closures</option>
          </select>
        </div>

        {/* Audit Log Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Operational Details</th>
                <th className="py-2.5 px-3">State Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{item.actorName}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{item.actorRole.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{item.entityType}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.entityId}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 max-w-sm">
                    {item.details}
                  </td>
                  <td className="py-3 px-3 text-[11px] font-mono">
                    {item.beforeState || item.afterState ? (
                      <span className="text-slate-600">
                        {item.beforeState || 'initial'} → <strong className="text-slate-900">{item.afterState}</strong>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
