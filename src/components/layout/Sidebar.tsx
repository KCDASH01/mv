/**
 * Digital MV Customer Service Management System
 * Sidebar Navigation (All 20 Modules Grouped)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React from 'react';
import { useAuth } from '../../services/auth';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Timer,
  ClipboardList,
  CheckSquare,
  Cpu,
  AlertOctagon,
  Package,
  Headphones,
  PowerOff,
  Gauge,
  CalendarClock,
  CheckCheck,
  GraduationCap,
  Image,
  MapPin,
  FileSpreadsheet,
  History,
  Users,
  BellRing,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { db } from '../../services/db';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, collapsed, onToggleCollapse }) => {
  const { activeRole, isFieldEngineer, isSupervisor, isQcaStore, isManager, isAdmin } = useAuth();

  // Badges calculation
  const complaints = db.getComplaints();
  const workOrders = db.getWorkOrders();
  const timeLogs = db.getTimeLogs();
  const ncrs = db.getNCRs();

  const unverifiedComplaints = complaints.filter(c => c.status === 'unverified').length;
  const pendingSupervisorTimers = timeLogs.filter(t => t.isCompleted && t.reviewStatus === 'pending').length;
  const openNcrs = ncrs.filter(n => n.status === 'under_qca_review').length;
  const myActiveJobs = isFieldEngineer
    ? workOrders.filter(w => (w.status === 'assigned' || w.status === 'accepted' || w.status === 'in_progress')).length
    : 0;

  const navGroups = [
    {
      groupName: 'Core Operations',
      items: [
        { id: 'dashboard', label: '01 Dashboard', icon: LayoutDashboard },
        { id: 'complaints', label: '02 Complaints / Intake', icon: Inbox, badge: unverifiedComplaints },
        { id: 'work_orders', label: '03 Work Orders', icon: Briefcase },
        { id: 'job_timer', label: 'Three-Stage Timer', icon: Timer, highlight: true },
        { id: 'supervisor_queue', label: 'Supervisor Review Queue', icon: CheckSquare, badge: pendingSupervisorTimers },
        { id: 'site_wizard', label: '04 Visit Report Wizard', icon: ClipboardList },
      ],
    },
    {
      groupName: 'Engineering & Quality',
      items: [
        { id: 'inspections', label: '05 Technical Checklists', icon: Gauge },
        { id: 'equipment', label: '06 Equipment Register', icon: Cpu },
        { id: 'ncr', label: '07 NCR Management', icon: AlertOctagon, badge: openNcrs },
        { id: 'materials', label: '08 Materials & Inventory', icon: Package },
      ],
    },
    {
      groupName: 'Specialist Workflows',
      items: [
        { id: 'remote_support', label: '09 Remote Support', icon: Headphones },
        { id: 'shutdown', label: '10 Shutdown Planning', icon: PowerOff },
        { id: 'commissioning', label: '11 Commissioning', icon: CheckCheck },
        { id: 'maintenance', label: '12 Preventive Maint.', icon: CalendarClock },
        { id: 'customer_closure', label: '13 Customer Closure', icon: ShieldCheck },
        { id: 'training', label: '14 Training Records', icon: GraduationCap },
      ],
    },
    {
      groupName: 'Governance & Platform',
      items: [
        { id: 'evidence', label: '15 Photo Evidence', icon: Image },
        { id: 'maps', label: '16 GPS & Site Map', icon: MapPin },
        { id: 'reports', label: '17 Reports & 25-Col', icon: FileSpreadsheet },
        { id: 'audit_trail', label: '18 Audit Trail', icon: History },
        { id: 'users', label: '19 Users & RBAC', icon: Users },
        { id: 'notifications', label: '20 Notifications & SLA', icon: BellRing },
        { id: 'user_manual', label: 'User Manual & SOP', icon: BookOpen, highlight: true },
      ],
    },
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-200 flex flex-col shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header toggle */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Operational Menu
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-800/60">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="py-2">
            {!collapsed && (
              <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.groupName}
              </div>
            )}
            <div className="mt-1 space-y-0.5 px-2">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left relative ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                        : item.highlight
                        ? 'text-amber-300 hover:bg-slate-800 hover:text-amber-200'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                    {!collapsed && (
                      <span className="truncate flex-1">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/90 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer info */}
      {!collapsed && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="font-medium text-slate-300">Live Database Connected</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Alfanar MV Portal v1.0 • Kanpri Tech
          </div>
        </div>
      )}
    </aside>
  );
};
