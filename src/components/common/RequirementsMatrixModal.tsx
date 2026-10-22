/**
 * Digital MV Customer Service Management System
 * Requirements Traceability Matrix & Client Inputs Tracker
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, FileText, X, Shield, Cpu, Database, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RequirementsMatrixModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'client_inputs' | 'rules'>('matrix');

  if (!isOpen) return null;

  const modules = [
    { id: 'M01', name: 'Management Dashboard', status: 'Implemented', detail: 'Real-time KPIs, overdue queues, engineer workload, interactive category/priority charts, click-through filters' },
    { id: 'M02', name: 'Public Complaint / Intake', status: 'Implemented', detail: 'Public /report-complaint portal, no login needed, unique CMP-YYYY-XXXX ref, duplicate review, consent notice' },
    { id: 'M03', name: 'Work Orders & Assignments', status: 'Implemented', detail: 'WO-YYYY-XXXX, engineer accept/decline with reason, supervisor reassignment trail, priority and due dates' },
    { id: 'M04', name: 'Site Visit Reporting', status: 'Implemented', detail: 'Guided 8-step wizard, 3-stage timer link, repeatable multi-panel attendance, GPS capture, draft & submit' },
    { id: 'M05', name: 'Technical Inspections', status: 'Implemented', detail: 'Family + Voltage (13.8kV/33kV), Energized/De-energized/Not-Verified exception, Pass/Fail/Not-Checked reasons, no switching claim' },
    { id: 'M06', name: 'Equipment Register & History', status: 'Implemented', detail: 'Global serial search, chronological complaints, work orders, visits, defect history, preventive maintenance links' },
    { id: 'M07', name: 'NCR Management', status: 'Implemented', detail: 'Independent quality approval, defect categories, QCA disposition (Rework/Scrap/Vendor Return), photo links' },
    { id: 'M08', name: 'Materials & Spare Parts', status: 'Implemented', detail: 'Part master, double-issue prevention, transactional stock ledger, factory return & custody tracking' },
    { id: 'M09', name: 'Remote Technical Support', status: 'Implemented', detail: 'Structured remote tickets, telephony/SCADA channels, timestamped actions, escalation to field visit' },
    { id: 'M10', name: 'Shutdown Planning', status: 'Implemented', detail: 'Schedule tracking, external safety permit ref tracking (does NOT issue permits or authorize switching)' },
    { id: 'M11', name: 'Commissioning Records', status: 'Implemented', detail: 'Insulation resistance, contact resistance, breaker timing, SF6 pressure records, punch list tracking' },
    { id: 'M12', name: 'Preventive Maintenance', status: 'Implemented', detail: 'Periodic PM schedules, last service, next due date, status flags (Upcoming/Due Soon/Overdue)' },
    { id: 'M13', name: 'Customer Closure', status: 'Implemented', detail: 'Service outcome, feedback score, blocks closure if open NCR or unresolved material actions exist' },
    { id: 'M14', name: 'Training Records', status: 'Implemented', detail: 'Training events, attendee rosters, MV switchgear topics, trainer credentials, certification tracking' },
    { id: 'M15', name: 'Photo & Document Evidence', status: 'Implemented', detail: 'Categorized evidence uploads, secure preview, linked to cases, panels, inspections, and NCRs' },
    { id: 'M16', name: 'GPS & KML/KMZ Mapping', status: 'Implemented', detail: 'Browser permission tap-to-capture coordinates, interactive site marker map, basic KML/KMZ export' },
    { id: 'M17', name: 'Reports & Analytics', status: 'Implemented', detail: 'Filtered registers, exact legacy 25-col site visit export, exact 16-col NCR export, timesheet export, CSV/print' },
    { id: 'M18', name: 'Audit Trail', status: 'Implemented', detail: 'Immutable append-only log: actor, role, action, entity, before/after values, timestamps, tamper detection' },
    { id: 'M19', name: 'Users & Role Access', status: 'Implemented', detail: '6 authentic roles: Public, Engineer, Dispatcher, QCA, Manager, Admin; individual accounts, RBAC enforcement' },
    { id: 'M20', name: 'Notifications & SLA Rules', status: 'Implemented', detail: 'In-app notification center, SLA breach alerts, escalation status, delivery logs' },
  ];

  const clientInputs = [
    {
      category: 'Inspection Checklists',
      item: 'Equipment-Specific Checklists',
      description: 'Specific sub-items for 33kV Auto-Reclosers (e.g. SF6 density switches, vacuum bottle integrity) and LBS switch contacts.',
      status: 'Provisional Seed Loaded',
      action: 'Alfanar Engineering SME to confirm exact 22-form catalogue vs standard unified checklist'
    },
    {
      category: 'Legacy Excel Templates',
      item: '25-Column Visit & 16-Column NCR exact headers',
      description: 'Pre-configured matching Alfanar v4 proposal specifications. System exports both CSV/Excel formats.',
      status: 'Ready for Review',
      action: 'Provide exact legacy Excel templates to confirm column ordering before final UAT'
    },
    {
      category: 'Reference Dropdowns',
      item: 'Approved Component Catalog & Fault Codes',
      description: 'Seeded with 4 core MV spare parts (SF6 Valve, Trip Latch, Aux Switch, VT Fuse) and standard IEC/Alfanar fault tags.',
      status: 'Extensible In DB',
      action: 'Client to provide official Alfanar SAP/ERP spare parts SKU list if live catalog sync is required'
    },
    {
      category: 'Infrastructure & Mail',
      item: 'Production SMTP / Cloud Storage',
      description: 'Runs with browser private object URLs + simulated transactional email notifications in development.',
      status: 'Configurable via Env',
      action: 'Alfanar IT to supply private S3 bucket credentials & corporate SendGrid/Exchange SMTP endpoint'
    },
    {
      category: 'Identity & SSO',
      item: 'Active Directory / Azure AD (Optional)',
      description: 'v1 uses secure individual named accounts with RBAC. SSO is defined as an optional post-v1 enhancement.',
      status: 'v1 Standard RBAC Active',
      action: 'Alfanar IT to determine if Microsoft Entra ID SAML/OAuth is required for phase 2'
    }
  ];

  const mandatoryRules = [
    { rule: 'Mandatory 3-Stage Timer', status: 'Enforced', detail: 'Exactly 3 segments (Room-to-Site, On-Site Work, Site-to-Room). Exactly 6 ordered actions. Only next valid button displayed. No skips/overlaps. Server timestamped.' },
    { rule: 'No Engineer Self-Approval', status: 'Enforced', detail: 'Engineers cannot approve their own time logs or visit reports. Supervisor review queue required.' },
    { rule: 'Immutable Submitted Revisions', status: 'Enforced', detail: 'Returned visit reports generate Rev 2+ instead of overwriting historical records.' },
    { rule: 'Energy State Exception Rule', status: 'Enforced', detail: 'Energized/De-energized required. "Not Verified" strictly triggers a mandatory engineering reason and supervisor flag.' },
    { rule: 'Multi-Panel Single Attendance', status: 'Enforced', detail: 'One site visit and travel timer covers multiple panels inspected during the same attendance.' },
    { rule: 'Electrical Safety Disclaimer', status: 'Enforced', detail: 'System explicitly records observations only; does NOT authorize electrical switching or issue safety permits.' },
    { rule: 'Blocking Case Closure', status: 'Enforced', detail: 'Cases cannot be marked closed if open NCRs or unfulfilled material actions remain without executive override.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">System Traceability Matrix & Client Inputs</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">v1.0 Baseline</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alfanar Electrical Systems — MV Customer Service | Developed by Kanpri Technologies LLP
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'matrix' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            20 Modules Traceability
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'rules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Mandatory Business Rules
          </button>
          <button
            onClick={() => setActiveTab('client_inputs')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'client_inputs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Client Inputs Tracker
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'matrix' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>All 20 Functional Modules specified in the Digital MV Contract Proposal</span>
                <span className="font-semibold text-emerald-600">20 / 20 Operational in Code</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modules.map(m => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {m.id}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900">{m.name}</h4>
                      </div>
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
                <strong>Non-Negotiable v4 Core Directives:</strong> Every rule below is enforced by algorithmic validation in the database service layer, not just visual suppression.
              </div>
              <div className="space-y-2">
                {mandatoryRules.map((r, i) => (
                  <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-semibold text-slate-900">{r.rule}</h4>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 pl-6">{r.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'client_inputs' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                <strong>Discovery Deliverable:</strong> Kanpri Technologies has identified the following exact client inputs required from Alfanar Electrical Systems to finalize UAT sign-off.
              </div>
              <div className="space-y-3">
                {clientInputs.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900">{item.item}</h4>
                      </div>
                      <span className="text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{item.description}</p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700">
                      <strong>Client Action:</strong> {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Digital MV System Specification & Matrix</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
