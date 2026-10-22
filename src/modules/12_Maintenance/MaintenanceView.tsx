/**
 * Digital MV Customer Service Management System
 * MODULE 12: Preventive Maintenance (PM) Schedules & Due Cycles
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { PreventiveMaintenancePlan } from '../../types';
import { CalendarClock, Search, CheckCircle2, AlertTriangle, Clock, Calendar } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const [plans, setPlans] = useState<PreventiveMaintenancePlan[]>(() => db.getMaintenancePlans());
  const [search, setSearch] = useState('');

  const filtered = plans.filter(p =>
    p.planCode.toLowerCase().includes(search.toLowerCase()) ||
    p.equipmentSerialNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.siteName.toLowerCase().includes(search.toLowerCase()) ||
    p.assignedEngineer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <CalendarClock className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Preventive Maintenance (PM) Plans</h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                Module 12
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Periodic service intervals, last serviced dates, due status, and linked technical checklists.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search plan code, serial number, site name, engineer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Plan Code</th>
                <th className="py-2.5 px-3">Equipment Serial #</th>
                <th className="py-2.5 px-3">Substation / Site</th>
                <th className="py-2.5 px-3">Service Interval</th>
                <th className="py-2.5 px-3">Last Service</th>
                <th className="py-2.5 px-3">Next Due Date</th>
                <th className="py-2.5 px-3">Assigned Engineer</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{p.planCode}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.equipmentSerialNumber}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{p.siteName}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">Every {p.intervalMonths} Months</td>
                  <td className="py-3 px-3 text-slate-500">{p.lastServiceDate}</td>
                  <td className="py-3 px-3 font-bold font-mono text-slate-900">{p.nextDueDate}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{p.assignedEngineer}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
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
