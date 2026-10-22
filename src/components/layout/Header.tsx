/**
 * Digital MV Customer Service Management System
 * Top Navigation Bar (Strict Top Bar Contract)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { UserRole } from '../../types';
import { 
  Zap, 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  FileCheck,
  LogOut,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { db } from '../../services/db';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenMatrix: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onOpenMatrix }) => {
  const { currentUser, activeRole, switchRole, allUsers, loginAs } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const notifications = db.getNotifications(currentUser?.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'dispatcher_supervisor', label: 'Dispatcher / Supervisor', desc: 'Triage intake, create WOs, review timers & reports' },
    { role: 'field_engineer', label: 'Field Engineer', desc: 'Run 3-stage timer, multi-panel inspection, upload photos' },
    { role: 'qca_store', label: 'QCA / Store', desc: 'NCR disposition, parts issue/return, stock transactions' },
    { role: 'manager_auditor', label: 'Manager / Auditor', desc: 'Strategic analytics, operational SLA, read-only oversight' },
    { role: 'admin', label: 'Administrator', desc: 'System settings, user accounts, audit controls' },
    { role: 'public_reporter', label: 'Public Reporter', desc: 'Submit anonymous customer complaint without staff login' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark, single-line) */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap leading-tight">
              Digital MV
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Alfanar Electrical Systems
            </span>
          </div>
        </div>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-white ${
              currentTab === 'dashboard' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('complaints')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-white ${
              currentTab === 'complaints' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Complaints
          </button>
          <button
            onClick={() => onNavigate('work_orders')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-white ${
              currentTab === 'work_orders' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Work Orders
          </button>
          <button
            onClick={() => onNavigate('job_timer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-white ${
              currentTab === 'job_timer' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            3-Stage Job Timer
          </button>
          <button
            onClick={() => onNavigate('site_wizard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-white ${
              currentTab === 'site_wizard' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            Visit Wizard
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-white ${
              currentTab === 'reports' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''
            }`}
          >
            25-Col Reports
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Manual Button */}
          <button
            onClick={() => onNavigate('user_manual')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'user_manual'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-800'
            }`}
            title="Read Detailed Operations & User Manual"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>User Manual</span>
          </button>

          {/* Requirements Matrix Button */}
          <button
            onClick={onOpenMatrix}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-300 bg-blue-950/60 hover:bg-blue-900 border border-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="View 20-Module Requirements Traceability Matrix & Client Inputs Tracker"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Traceability</span>
          </button>

          {/* Public Portal Shortcut */}
          <button
            onClick={() => onNavigate('public_complaint')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Open Public Intake without Staff Login"
          >
            <span>Public Intake</span>
          </button>

          {/* In-App Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">Operational Notifications</span>
                  <span className="text-[10px] text-slate-400">{unreadCount} unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">No notifications</div>
                  ) : (
                    notifications.slice(0, 6).map(n => (
                      <div
                        key={n.id}
                        className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                        onClick={() => {
                          db.markNotificationRead(n.id);
                          setShowNotifMenu(false);
                          if (n.link) onNavigate(n.link);
                        }}
                      >
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Account */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {currentUser ? currentUser.name.charAt(0) : 'P'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium truncate max-w-[110px] text-white">
                  {currentUser ? currentUser.name : 'Public User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[110px] capitalize">
                  {activeRole.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Simulate Role (RBAC Testing)
                  </div>
                </div>
                <div className="py-1">
                  {rolesList.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition-colors ${
                        activeRole === r.role ? 'bg-blue-50/70 text-blue-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <UserCheck className={`w-4 h-4 shrink-0 mt-0.5 ${activeRole === r.role ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-medium">{r.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
