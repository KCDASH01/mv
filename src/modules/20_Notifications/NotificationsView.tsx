/**
 * Digital MV Customer Service Management System
 * MODULE 20: Notifications Center & SLA Escalation Rules
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { NotificationItem } from '../../types';
import { BellRing, Check, Clock, AlertTriangle, ShieldCheck, Mail, Send } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => db.getNotifications());
  const [smtpConfigured, setSmtpConfigured] = useState(false);

  const slaPolicies = [
    { priority: 'Critical', responseTarget: '2 Hours', resolutionTarget: '24 Hours', escalation: 'Immediate SMS & Supervisor Push' },
    { priority: 'High', responseTarget: '4 Hours', resolutionTarget: '48 Hours', escalation: 'Notification to Lead Engineer & Dispatcher' },
    { priority: 'Medium', responseTarget: '8 Hours', resolutionTarget: '5 Business Days', escalation: 'Operational Queue Flag' },
    { priority: 'Low', responseTarget: '24 Hours', resolutionTarget: '10 Business Days', escalation: 'Standard Weekly Review' },
  ];

  const handleMarkAllRead = () => {
    notifications.forEach(n => db.markNotificationRead(n.id));
    setNotifications(db.getNotifications());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <BellRing className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Notifications & SLA Management</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 20
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time operational alerts, SLA response benchmarks, and verified email dispatch status.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Email Gateway Delivery Status Banner */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>
              <strong>Email Provider Status:</strong> {smtpConfigured ? 'Connected to Alfanar SMTP Relay' : 'Development Simulation Mode (No external SMTP endpoint configured)'}
            </span>
          </div>
          <button
            onClick={() => setSmtpConfigured(!smtpConfigured)}
            className="text-[11px] font-semibold text-blue-600 hover:underline"
          >
            {smtpConfigured ? 'Disconnect Mock Relay' : 'Configure SMTP Endpoint'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Feed */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Operational Event Alerts ({notifications.length})
            </h3>
            <div className="space-y-2">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    !n.read ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Policies */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Contractual SLA Targets
            </h3>
            <div className="space-y-3 text-xs">
              {slaPolicies.map((p, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{p.priority} Severity</span>
                    <span className="text-blue-700 font-mono">Resp: {p.responseTarget}</span>
                  </div>
                  <div className="text-slate-600">
                    Target Resolution: <strong className="text-slate-800">{p.resolutionTarget}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                    Escalation: {p.escalation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
