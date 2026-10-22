/**
 * Digital MV Customer Service Management System
 * Interactive In-App User Manual & Operations Guide
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Timer, 
  ClipboardList, 
  AlertOctagon, 
  Package, 
  UserCheck, 
  ChevronRight,
  HelpCircle,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigateToTab?: (tab: string) => void;
}

export const UserManualView: React.FC<Props> = ({ onNavigateToTab }) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'intro', title: '1. Introduction & System Scope', icon: BookOpen },
    { id: 'roles', title: '2. User Roles & RBAC Credentials', icon: UserCheck },
    { id: 'intake', title: '3. Public Complaint & Triage', icon: FileText },
    { id: 'timer', title: '4. Exact 3-Stage Field-Work Timer', icon: Timer, highlight: true },
    { id: 'wizard', title: '5. 8-Step Site Visit Report Wizard', icon: ClipboardList },
    { id: 'ncr', title: '6. NCR Management & Quality Gate', icon: AlertOctagon },
    { id: 'materials', title: '7. Spare Parts & Stock Ledger', icon: Package },
    { id: 'closure', title: '8. Customer Sign-Off & Blocking Checks', icon: ShieldCheck },
    { id: 'reports', title: '9. Exact 25-Col & 16-Col Legacy Exports', icon: Download },
    { id: 'faq', title: '10. FAQ & Field Rules', icon: HelpCircle },
  ];

  const handleDownloadMarkdown = () => {
    const link = document.createElement('a');
    link.href = '/docs/USER_MANUAL.md';
    link.download = 'Digital_MV_User_Manual_v1.0.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Digital MV Comprehensive User & Operations Manual</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                SOP v1.0 Aligned
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official operating manual for Alfanar Electrical Systems — MV Customer Service (Developed by Kanpri Technologies LLP).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download Markdown Documentation File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD Manual</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Manual Layout</span>
            </button>
          </div>
        </div>

        {/* Search inside manual */}
        <div className="mt-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user manual instructions, SOP rules, timer guidelines..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>

        {/* Layout: Sidebar TOC + Reading Viewport */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Table of Contents Nav */}
          <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
              Table of Contents
            </span>
            {sections.map(sec => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : sec.highlight
                      ? 'text-amber-700 bg-amber-50/80 hover:bg-amber-100 font-semibold'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Content Viewport */}
          <div className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-4">
            {/* SECTION 1: INTRO */}
            {activeSection === 'intro' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">1. Introduction & System Scope</h3>
                  <p className="text-slate-500 mt-0.5">Medium-Voltage Switchgear Lifecycle Platform</p>
                </div>
                <p className="text-slate-700">
                  The <strong>Digital MV Customer Service Management System</strong> coordinates all emergency breakdown attendances, routine commissioning, preventive maintenance, and warranty quality actions for Alfanar MV switchgear across the Kingdom of Saudi Arabia.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">Supported Equipment Families</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                      <li>Ring Main Units (RMU, MRMU, SRMU)</li>
                      <li>Auto-Reclosers (GridGuard ACR-33)</li>
                      <li>Load Break Switches (LBS, SLBS)</li>
                      <li>Authorized Extensible MV Assemblies</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">Voltage Normalization</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                      <li><strong>13.8 kV</strong> Distribution Networks</li>
                      <li><strong>33 kV</strong> Sub-transmission & Solar Grids</li>
                      <li>Normalized separate database fields</li>
                      <li>Strict IEC 62271-200 safety standards</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: ROLES */}
            {activeSection === 'roles' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">2. User Roles & RBAC Credentials</h3>
                  <p className="text-slate-500 mt-0.5">Least-privilege operational permissions</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">1. Public Reporter (Customers & Contractors)</span>
                    <p className="text-slate-600 mt-1">Can submit new breakdown complaints anonymously via <code>/report-complaint</code> and receives an official reference (e.g. <code>CMP-2026-0042</code>). Cannot view internal records or browse other tickets.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">2. Field Engineer (e.g. Tariq Mansoor, ALF-FE-309)</span>
                    <p className="text-slate-600 mt-1">Accesses assigned jobs, accepts/declines work orders, operates the 3-stage site timer, records multi-panel inspections, captures GPS on-tap, and submits draft visit reports. Cannot approve own work.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">3. Dispatcher / Supervisor (e.g. Fahad Al-Otaibi, ALF-DS-104)</span>
                    <p className="text-slate-600 mt-1">Triages incoming intake, creates work orders, assigns and reassigns engineers, audits timesheets, reviews visit reports, and issues approvals or revision returns.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">4. QCA / Store (e.g. Dr. Reem Al-Ghamdi, ALF-QA-088)</span>
                    <p className="text-slate-600 mt-1">Conducts independent quality reviews on NCRs, issues dispositions (Rework, Scrap, Factory Return), executes stock ledger transactions, and prevents double-issue of parts.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">5. Manager / Auditor (e.g. Eng. Khalid Al-Sulaiman, ALF-MG-002)</span>
                    <p className="text-slate-600 mt-1">Full strategic analytics oversight, SLA breach monitoring, immutable audit logging, and authorized executive closure overrides.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: INTAKE */}
            {activeSection === 'intake' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">3. Public Complaint & Dispatcher Triage</h3>
                  <p className="text-slate-500 mt-0.5">From anonymous submission to authorized work order</p>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li><strong>Customer Submission</strong>: Client navigates to <code>/report-complaint</code>, fills contact info, substation site, issue category, symptoms description, and acknowledges consent.</li>
                  <li><strong>Reference Generation</strong>: System creates a unique tracking code (<code>CMP-YYYY-XXXX</code>) and confirms receipt without revealing private case data.</li>
                  <li><strong>Dispatcher Verification</strong>: Dispatcher opens <strong>02 Complaints</strong>, reviews reported symptoms, validates potential duplicates, and classifies severity (Critical, High, Medium, Low).</li>
                  <li><strong>Work Order Creation</strong>: Dispatcher clicks <strong>Create WO</strong>, designates the lead Field Engineer, sets planned visit date and SLA due date, and dispatches the job.</li>
                </ol>
              </div>
            )}

            {/* SECTION 4: TIMER */}
            {activeSection === 'timer' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">4. Exact 3-Stage Field-Work Timer (Critical Module)</h3>
                  <p className="text-slate-500 mt-0.5">Strict non-negotiable attendance logging</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                  <strong>Mandatory Rule:</strong> Each site job consists of EXACTLY THREE timed segments and SIX sequential actions.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900 block">STAGE 1: Base to Site</span>
                    <div className="text-slate-600">1. Start Travel to Site</div>
                    <div className="text-slate-600">2. End Travel at Site</div>
                    <span className="text-[10px] text-blue-600 font-mono block pt-1">Computes Outbound Minutes</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900 block">STAGE 2: On-Site Work</span>
                    <div className="text-slate-600">3. Start Work</div>
                    <div className="text-slate-600">4. End Work</div>
                    <span className="text-[10px] text-blue-600 font-mono block pt-1">Computes On-Site Minutes</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900 block">STAGE 3: Site to Base</span>
                    <div className="text-slate-600">5. Start Return Travel</div>
                    <div className="text-slate-600">6. End Travel at Room/Base</div>
                    <span className="text-[10px] text-blue-600 font-mono block pt-1">Computes Return & Total Time</span>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pt-2">
                  <li><strong>Only Next Valid Button</strong>: The UI renders only the single next legal action. Skipping or reversing steps is impossible.</li>
                  <li><strong>Trusted Server Timestamps</strong>: Time is recorded on the backend server, preventing local device manipulation.</li>
                  <li><strong>Conflict Prevention</strong>: An engineer cannot run two active timers concurrently.</li>
                  <li><strong>No Miscellaneous Segments</strong>: Lunch, break, and personal waiting categories are excluded from the job attendance timer.</li>
                </ul>
              </div>
            )}

            {/* SECTION 5: WIZARD */}
            {activeSection === 'wizard' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">5. 8-Step Guided Site Visit Wizard</h3>
                  <p className="text-slate-500 mt-0.5">Mobile-first engineering documentation</p>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 1: Job Header</strong> — Site name, customer representative, phone, access restrictions.</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 2: Time Log Link</strong> — Confirms connection to the active 3-stage timer for this job.</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 3: Multi-Panel Identity</strong> — Repeatable panel entries. One attendance covers multiple panels without duplicate travel billing.</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 4: Energy State</strong> — Energized / De-energized / Not Verified (strictly mandates written justification).</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 5: Checklists</strong> — Pass / Fail / Not Checked / N/A (Fail or Not Checked requires mandatory explanation and corrective action).</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 6: Findings & Root Cause</strong> — Distinguishes customer allegations from objective engineering proof. Triggers NCR flag if defective.</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 7: Parts & Evidence</strong> — Replaced parts with warranty flags, photos, and on-tap GPS coordinates.</div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><strong>Step 8: Review & Submit</strong> — Engineer signs declaration and submits report to supervisor queue.</div>
                </div>
              </div>
            )}

            {/* SECTION 6: NCR */}
            {activeSection === 'ncr' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">6. NCR Management & Independent Quality Gate</h3>
                  <p className="text-slate-500 mt-0.5">Non-conformance tracking and factory recalls</p>
                </div>
                <p className="text-slate-700">
                  When defective components, seal leaks, or assembly failures are detected, a Non-Conformance Report (NCR) is created. 
                </p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 space-y-1">
                  <strong>Independence Principle:</strong> Approving a site visit report does NOT automatically resolve or close an NCR. The QCA team must independently evaluate the root cause and authorize a disposition:
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-red-800">
                    <li><strong>Rework</strong> on site with approved replacement kit.</li>
                    <li><strong>Return to Factory / Vendor</strong> for lab teardown and warranty replacement.</li>
                    <li><strong>Scrap</strong> component and update custody log.</li>
                    <li><strong>Use-As-Is</strong> concession approved by Chief Engineer.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 7: MATERIALS */}
            {activeSection === 'materials' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">7. Spare Parts & Stock Movement Ledger</h3>
                  <p className="text-slate-500 mt-0.5">Auditable warehouse custody across KSA</p>
                </div>
                <p className="text-slate-700">
                  Stock balances are strictly transactional and cannot be manually edited. Every movement writes to the permanent stock ledger:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Issue to Work Order</strong>: Debits stock, binds transaction to active WO and serial number. Double issues and negative stock are blocked by transactional locks.</li>
                  <li><strong>Warehouse Receipt</strong>: Inward credits from factory shipments.</li>
                  <li><strong>Return from Site</strong>: Credits unused components back to inventory.</li>
                  <li><strong>Factory Return</strong>: Transfers custody of defective parts to Alfanar factory QA.</li>
                </ul>
              </div>
            )}

            {/* SECTION 8: CLOSURE */}
            {activeSection === 'closure' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">8. Customer Sign-Off & Blocking Checks</h3>
                  <p className="text-slate-500 mt-0.5">Final sign-off without loose ends</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900">
                  <strong>The Blocking NCR Gate:</strong> The system automatically blocks customer closure if any open, unrectified NCR exists for that case. This prevents premature case closure while customer equipment remains defective.
                </div>
                <p className="text-slate-700">
                  To close a case, the supervisor enters customer representative sign-off, confirms service outcome (Permanent Fix, Temporary Bypass, etc.), notes any operational limitations, and records customer satisfaction score (1–5 stars).
                </p>
              </div>
            )}

            {/* SECTION 9: REPORTS */}
            {activeSection === 'reports' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">9. Exact 25-Col & 16-Col Legacy Exports</h3>
                  <p className="text-slate-500 mt-0.5">Database-derived Excel & CSV downloads</p>
                </div>
                <p className="text-slate-700">
                  Navigate to <strong>17 Reports & 25-Col</strong> to export exact legacy spreadsheets:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">25-Column Field Visit Report</span>
                    <p className="text-slate-600 mt-1">Exports visit #, revision #, date, WO, customer, site, engineer, outbound/on-site/return times, total hours, panel ID, family, voltage, serial, RTU, energy state, findings, root cause, NCR flag, and approval status.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">16-Column NCR Register</span>
                    <p className="text-slate-600 mt-1">Exports NCR #, date, linked case, linked WO, equipment family, serial, defect category, description, reporting engineer, QCA reviewer, disposition, justification, action plan, and target closure date.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 10: FAQ */}
            {activeSection === 'faq' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">10. Frequently Asked Questions & Field Rules</h3>
                  <p className="text-slate-500 mt-0.5">Quick answers to common field situations</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">Q: Does the app track engineer location continuously?</span>
                    <p className="text-slate-600 mt-1">No. To preserve employee privacy, GPS is captured ONLY when the authorized engineer taps the <em>Capture GPS on Tap</em> button with browser permission.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">Q: Does this software issue electrical switching permits?</span>
                    <p className="text-slate-600 mt-1">No. The system explicitly records observations only. Electrical switching permits must be issued by the utility authority (e.g. National Grid SA Desk / SEC) under formal LOTO safety regulations.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">Q: How do I switch roles to test other features?</span>
                    <p className="text-slate-600 mt-1">Use the profile dropdown in the top bar. You can instantly switch between Field Engineer, Dispatcher, QCA, Manager, Admin, and Public Intake.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick jump to module button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Alfanar Digital MV Customer Service SOP v1.0 • Kanpri Tech
              </span>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('dashboard')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Go to Operational Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
