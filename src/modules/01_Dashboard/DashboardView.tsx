/**
 * Digital MV Customer Service Management System
 * MODULE 01: Real-Time Operational Management Dashboard
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import {
  Inbox,
  Briefcase,
  Timer,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Users,
  Clock,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

interface Props {
  onNavigate: (tab: string, filter?: any) => void;
  onOpenMatrix: () => void;
}

export const DashboardView: React.FC<Props> = ({ onNavigate, onOpenMatrix }) => {
  const { currentUser, activeRole } = useAuth();

  // Load live data from db service
  const complaints = db.getComplaints();
  const workOrders = db.getWorkOrders();
  const timeLogs = db.getTimeLogs();
  const ncrs = db.getNCRs();
  const parts = db.getParts();
  const equipment = db.getEquipment();

  // Filters state
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');

  // Compute live KPI metrics
  const totalComplaints = complaints.length;
  const newComplaints = complaints.filter(c => c.status === 'unverified').length;
  const activeWorkOrders = workOrders.filter(w => w.status === 'assigned' || w.status === 'accepted' || w.status === 'in_progress').length;
  const inProgressVisits = timeLogs.filter(t => !t.isCompleted && t.currentStep > 0).length;
  const pendingApprovals = timeLogs.filter(t => t.isCompleted && t.reviewStatus === 'pending').length;
  const openNcrsCount = ncrs.filter(n => n.status !== 'closed' && n.status !== 'rectified').length;
  const closedCases = complaints.filter(c => c.status === 'closed').length;

  // Category Distribution
  const categoryCountMap: Record<string, number> = {};
  complaints.forEach(c => {
    const cat = c.category || 'Other';
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryCountMap).map(([name, count]) => ({
    name: name.length > 20 ? name.substring(0, 18) + '...' : name,
    fullCategory: name,
    count,
  }));

  // Equipment Distribution
  const eqCountMap: Record<string, number> = {};
  equipment.forEach(e => {
    eqCountMap[e.family] = (eqCountMap[e.family] || 0) + 1;
  });
  const eqChartData = Object.entries(eqCountMap).map(([name, count]) => ({
    name,
    count,
  }));

  // Priority Distribution Data
  const priorityData = [
    { name: 'Critical', value: complaints.filter(c => c.priority === 'critical').length, color: '#dc2626' },
    { name: 'High', value: complaints.filter(c => c.priority === 'high').length, color: '#ea580c' },
    { name: 'Medium', value: complaints.filter(c => c.priority === 'medium').length, color: '#2563eb' },
    { name: 'Low', value: complaints.filter(c => c.priority === 'low').length, color: '#16a34a' },
  ];

  // Active Engineer Workload
  const engineers = db.getUsers().filter(u => u.role === 'field_engineer');
  const engineerWorkload = engineers.map(eng => {
    const assignedCount = workOrders.filter(w => w.assignedEngineerId === eng.id && w.status !== 'closed').length;
    const completedTimers = timeLogs.filter(t => t.engineerId === eng.id && t.isCompleted).length;
    const totalHoursLogged = timeLogs
      .filter(t => t.engineerId === eng.id)
      .reduce((acc, t) => acc + t.totalDurationMinutes, 0) / 60;
    return {
      ...eng,
      assignedCount,
      completedTimers,
      totalHoursLogged: totalHoursLogged.toFixed(1),
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Filters */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Alfanar MV Operations Dashboard
              </h1>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded">
                Live Enterprise Ops
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time medium-voltage customer service pipeline, engineer dispatch, and quality control.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-600">Region:</span>
              <select
                value={regionFilter}
                onChange={e => setRegionFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden"
              >
                <option value="all">All Regions (KSA)</option>
                <option value="Central">Central (Riyadh)</option>
                <option value="Western">Western (Jeddah/Makkah)</option>
                <option value="Eastern">Eastern (Dammam/Khobar)</option>
                <option value="Northern">Northern (Tabuk/NEOM)</option>
              </select>
            </div>

            <button
              onClick={onOpenMatrix}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Requirements Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 Primary KPI Metric Cards with Click-Through */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {/* Card 1: New Intake */}
          <div
            onClick={() => onNavigate('complaints')}
            className="p-4 bg-slate-50/70 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-blue-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Unverified Intake</span>
              <Inbox className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{newComplaints}</span>
              <span className="text-[11px] text-blue-600 font-semibold">Triage Pending</span>
            </div>
          </div>

          {/* Card 2: Active Work Orders */}
          <div
            onClick={() => onNavigate('work_orders')}
            className="p-4 bg-slate-50/70 hover:bg-indigo-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-indigo-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Work Orders</span>
              <Briefcase className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{activeWorkOrders}</span>
              <span className="text-[11px] text-indigo-600 font-semibold">In Field</span>
            </div>
          </div>

          {/* Card 3: In-Progress 3-Stage Visits */}
          <div
            onClick={() => onNavigate('job_timer')}
            className="p-4 bg-slate-50/70 hover:bg-amber-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-amber-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Timers</span>
              <Timer className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{inProgressVisits}</span>
              <span className="text-[11px] text-amber-600 font-semibold">Live Clock</span>
            </div>
          </div>

          {/* Card 4: Supervisor Approvals */}
          <div
            onClick={() => onNavigate('supervisor_queue')}
            className="p-4 bg-slate-50/70 hover:bg-purple-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-purple-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Approvals</span>
              <Clock className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{pendingApprovals}</span>
              <span className="text-[11px] text-purple-600 font-semibold">Supervisor Gate</span>
            </div>
          </div>

          {/* Card 5: Open NCRs */}
          <div
            onClick={() => onNavigate('ncr')}
            className="p-4 bg-slate-50/70 hover:bg-red-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-red-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Open Quality NCRs</span>
              <AlertOctagon className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{openNcrsCount}</span>
              <span className="text-[11px] text-red-600 font-semibold">QCA Review</span>
            </div>
          </div>

          {/* Card 6: Total Equipment Assets */}
          <div
            onClick={() => onNavigate('equipment')}
            className="p-4 bg-slate-50/70 hover:bg-slate-100 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-slate-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Registered MV Assets</span>
              <Cpu className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{equipment.length}</span>
              <span className="text-[11px] text-slate-500 font-semibold">13.8 / 33 kV</span>
            </div>
          </div>

          {/* Card 7: Spare Parts SKUs */}
          <div
            onClick={() => onNavigate('materials')}
            className="p-4 bg-slate-50/70 hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-emerald-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Inventory SKUs</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{parts.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Ledger Tracked</span>
            </div>
          </div>

          {/* Card 8: Resolved / Closed */}
          <div
            onClick={() => onNavigate('customer_closure')}
            className="p-4 bg-slate-50/70 hover:bg-emerald-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-emerald-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Closed Cases</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{closedCases}</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Signed Off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Complaint Breakdown by Category */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Complaint Categories & Fault Distribution</h3>
              <p className="text-xs text-slate-500">Volume by medium-voltage issue classification</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">{complaints.length} Total Cases</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} incidents`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority & SLA Status */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Priority & SLA Distribution</h3>
              <p className="text-xs text-slate-500">Operational triage severity</p>
            </div>
          </div>

          <div className="h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {priorityData.map(p => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }}></div>
                <span className="text-slate-600">{p.name}:</span>
                <span className="font-bold font-mono text-slate-900">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engineer Workload & Recent Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Engineer Workload Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Field Engineer Deployment & Hours</h3>
              <p className="text-xs text-slate-500">Live attendance logs and active assignment queue</p>
            </div>
            <button
              onClick={() => onNavigate('job_timer')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Open Timers →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2 px-3">Engineer</th>
                  <th className="py-2 px-3">Active WOs</th>
                  <th className="py-2 px-3">Completed Timers</th>
                  <th className="py-2 px-3 text-right">Logged Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {engineerWorkload.map(eng => (
                  <tr key={eng.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{eng.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{eng.employeeCode}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-800">{eng.assignedCount}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-emerald-700 font-semibold">{eng.completedTimers} logs</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      {eng.totalHoursLogged} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Operational Cases & Next Actions */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Priority Operations Queue</h3>
              <p className="text-xs text-slate-500">High severity tickets requiring dispatcher or field response</p>
            </div>
            <button
              onClick={() => onNavigate('work_orders')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              All Work Orders →
            </button>
          </div>

          <div className="space-y-2.5">
            {workOrders.slice(0, 4).map(wo => (
              <div
                key={wo.id}
                onClick={() => onNavigate('work_orders')}
                className="p-3 rounded-lg border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/80 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{wo.workOrderNumber}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        wo.priority === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : wo.priority === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 uppercase">
                    {wo.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="mt-1.5 font-medium text-slate-800 truncate">
                  {wo.siteName} — {wo.customerName}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Assigned: <strong>{wo.assignedEngineerName}</strong></span>
                  <span>Due: {wo.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
