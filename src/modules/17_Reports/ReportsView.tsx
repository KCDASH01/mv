/**
 * Digital MV Customer Service Management System
 * MODULE 17: Reports & Analytics (25-Col Visit & 16-Col NCR Legacy Exports)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { 
  export25ColumnSiteVisits, 
  export16ColumnNcrs, 
  exportTimesheetCsv 
} from '../../services/export';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  Table, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const visits = db.getVisitReports();
  const timeLogs = db.getTimeLogs();
  const ncrs = db.getNCRs();
  const complaints = db.getComplaints();
  const workOrders = db.getWorkOrders();

  const [reportType, setReportType] = useState<'visits_25col' | 'ncrs_16col' | 'timesheet' | 'complaints'>('visits_25col');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Reports & Exact Legacy Format Exports</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 17
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Export database-derived registers directly to Excel/CSV with exact 25-column and 16-column layouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF Layout</span>
            </button>
          </div>
        </div>

        {/* Report Selector Strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setReportType('visits_25col')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              reportType === 'visits_25col'
                ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs">25-Column Site Visit Report</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Multi-panel technical inspections & timers</div>
          </button>

          <button
            onClick={() => setReportType('ncrs_16col')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              reportType === 'ncrs_16col'
                ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs">16-Column NCR Register</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Quality dispositions & defect lines</div>
          </button>

          <button
            onClick={() => setReportType('timesheet')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              reportType === 'timesheet'
                ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs">Field Timesheet Ledger</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Three-stage segments (Outbound/Work/Return)</div>
          </button>

          <button
            onClick={() => setReportType('complaints')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              reportType === 'complaints'
                ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs">Complaints & Work Orders</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Intake to dispatch operational logs</div>
          </button>
        </div>

        {/* Selected Report Action & Preview */}
        <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {reportType === 'visits_25col' && '25-Column Field Engineering Site Visit Specification'}
                {reportType === 'ncrs_16col' && '16-Column Non-Conformance (NCR) Specification'}
                {reportType === 'timesheet' && 'Field Engineer Three-Stage Attendance Timesheets'}
                {reportType === 'complaints' && 'End-to-End Complaints & Work Order Lifecycle Register'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact headers mapped to Alfanar MV v4 contract specifications.
              </p>
            </div>

            <div>
              {reportType === 'visits_25col' && (
                <button
                  onClick={() => export25ColumnSiteVisits(visits, timeLogs)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 25-Col Excel (CSV)</span>
                </button>
              )}
              {reportType === 'ncrs_16col' && (
                <button
                  onClick={() => export16ColumnNcrs(ncrs)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 16-Col Excel (CSV)</span>
                </button>
              )}
              {reportType === 'timesheet' && (
                <button
                  onClick={() => exportTimesheetCsv(timeLogs)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Timesheets (CSV)</span>
                </button>
              )}
            </div>
          </div>

          {/* Column schema inspection preview */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              Export Column Mappings:
            </span>
            {reportType === 'visits_25col' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-700 text-[11px]">
                <div className="p-1.5 bg-slate-50 rounded">1. Visit Report Number</div>
                <div className="p-1.5 bg-slate-50 rounded">2. Revision Number (Immutable)</div>
                <div className="p-1.5 bg-slate-50 rounded">3. Date of Attendance</div>
                <div className="p-1.5 bg-slate-50 rounded">4. Work Order ID</div>
                <div className="p-1.5 bg-slate-50 rounded">5. Complaint Reference</div>
                <div className="p-1.5 bg-slate-50 rounded">6. Customer Name</div>
                <div className="p-1.5 bg-slate-50 rounded">7. Site Name</div>
                <div className="p-1.5 bg-slate-50 rounded">8. Contact Person</div>
                <div className="p-1.5 bg-slate-50 rounded">9. Lead Field Engineer</div>
                <div className="p-1.5 bg-slate-50 rounded">10. Outbound Travel Time (Mins)</div>
                <div className="p-1.5 bg-slate-50 rounded">11. On-Site Work Time (Mins)</div>
                <div className="p-1.5 bg-slate-50 rounded">12. Return Travel Time (Mins)</div>
                <div className="p-1.5 bg-slate-50 rounded">13. Total Attendance Hours</div>
                <div className="p-1.5 bg-slate-50 rounded">14. Panel Identifier</div>
                <div className="p-1.5 bg-slate-50 rounded">15. Equipment Family</div>
                <div className="p-1.5 bg-slate-50 rounded">16. Voltage Rating (kV)</div>
                <div className="p-1.5 bg-slate-50 rounded">17. Equipment Serial No</div>
                <div className="p-1.5 bg-slate-50 rounded">18. RTU / Controller Model</div>
                <div className="p-1.5 bg-slate-50 rounded">19. Energy State (Energized/De-energized)</div>
                <div className="p-1.5 bg-slate-50 rounded">20. Customer Allegation</div>
                <div className="p-1.5 bg-slate-50 rounded">21. Verified Technical Findings</div>
                <div className="p-1.5 bg-slate-50 rounded">22. Root Cause Analysis</div>
                <div className="p-1.5 bg-slate-50 rounded">23. Corrective Action Taken</div>
                <div className="p-1.5 bg-slate-50 rounded">24. NCR Required (Y/N)</div>
                <div className="p-1.5 bg-slate-50 rounded">25. Supervisor Approval Status</div>
              </div>
            )}

            {reportType === 'ncrs_16col' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-slate-700 text-[11px]">
                <div className="p-1.5 bg-slate-50 rounded">1. NCR Number</div>
                <div className="p-1.5 bg-slate-50 rounded">2. Date Reported</div>
                <div className="p-1.5 bg-slate-50 rounded">3. Linked Case Reference</div>
                <div className="p-1.5 bg-slate-50 rounded">4. Linked Work Order</div>
                <div className="p-1.5 bg-slate-50 rounded">5. Equipment Family</div>
                <div className="p-1.5 bg-slate-50 rounded">6. Equipment Serial Number</div>
                <div className="p-1.5 bg-slate-50 rounded">7. Defect Category</div>
                <div className="p-1.5 bg-slate-50 rounded">8. Defect Description</div>
                <div className="p-1.5 bg-slate-50 rounded">9. Reporting Engineer</div>
                <div className="p-1.5 bg-slate-50 rounded">10. QCA Reviewer</div>
                <div className="p-1.5 bg-slate-50 rounded">11. QCA Review Date</div>
                <div className="p-1.5 bg-slate-50 rounded">12. Quality Disposition</div>
                <div className="p-1.5 bg-slate-50 rounded">13. Justification & Root Cause</div>
                <div className="p-1.5 bg-slate-50 rounded">14. Corrective Action Plan</div>
                <div className="p-1.5 bg-slate-50 rounded">15. Target Closure Date</div>
                <div className="p-1.5 bg-slate-50 rounded">16. Current Status</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
