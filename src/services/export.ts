/**
 * Digital MV Customer Service Management System
 * Export Engine (CSV/Excel & Printable PDF)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import { SiteVisitReport, NonConformanceReport, SiteJobTimeLog, Complaint, WorkOrder } from '../types';

export const exportToCsv = (filename: string, rows: (string | number)[][]) => {
  const processRow = (row: (string | number)[]) => {
    return row
      .map(val => {
        let str = String(val ?? '');
        str = str.replace(/"/g, '""');
        if (str.search(/("|,|\n)/g) >= 0) {
          str = `"${str}"`;
        }
        return str;
      })
      .join(',');
  };

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(processRow).join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 25-Column Legacy Site Visit Export
 */
export const export25ColumnSiteVisits = (visits: SiteVisitReport[], timeLogs: SiteJobTimeLog[]) => {
  const headers = [
    '1. Visit Report Number',
    '2. Revision Number',
    '3. Date of Attendance',
    '4. Work Order ID',
    '5. Complaint Reference',
    '6. Customer Name',
    '7. Site Name',
    '8. Contact Person',
    '9. Field Engineer',
    '10. Outbound Travel (min)',
    '11. On-Site Work (min)',
    '12. Return Travel (min)',
    '13. Total Duration (hrs)',
    '14. Panel Identifier',
    '15. Equipment Family',
    '16. Voltage Rating',
    '17. Equipment Serial No',
    '18. RTU/Controller Model',
    '19. Energy State',
    '20. Customer Allegation',
    '21. Verified Engineering Findings',
    '22. Root Cause Analysis',
    '23. Corrective Action Taken',
    '24. NCR Required',
    '25. Supervisor Approval Status',
  ];

  const rows: (string | number)[][] = [headers];

  visits.forEach(v => {
    const timeLog = timeLogs.find(t => t.workOrderId === v.workOrderId);
    const outbound = timeLog ? timeLog.outboundTravelMinutes : 0;
    const work = timeLog ? timeLog.onSiteWorkMinutes : 0;
    const returnTime = timeLog ? timeLog.returnTravelMinutes : 0;
    const totalHours = timeLog ? (timeLog.totalDurationMinutes / 60).toFixed(2) : '0.00';

    if (v.panels && v.panels.length > 0) {
      v.panels.forEach(p => {
        rows.push([
          v.visitReportNumber,
          `Rev ${v.revisionNumber}`,
          v.siteArrivalTime ? v.siteArrivalTime.split('T')[0] : v.createdAt.split('T')[0],
          v.workOrderNumber,
          v.complaintRef,
          v.siteName,
          v.siteName,
          v.customerContactPerson || 'N/A',
          v.engineerName,
          outbound,
          work,
          returnTime,
          totalHours,
          p.panelIdentifier,
          p.equipmentFamily,
          p.voltageRating,
          p.serialNumber,
          p.rtuControllerType || 'None',
          p.energyState,
          p.customerAllegation || 'N/A',
          p.verifiedEngineeringFindings,
          p.rootCause,
          p.solutionProvided,
          p.requiresNcr ? 'YES' : 'NO',
          v.status.toUpperCase(),
        ]);
      });
    } else {
      rows.push([
        v.visitReportNumber,
        `Rev ${v.revisionNumber}`,
        v.createdAt.split('T')[0],
        v.workOrderNumber,
        v.complaintRef,
        v.siteName,
        v.siteName,
        v.customerContactPerson || 'N/A',
        v.engineerName,
        outbound,
        work,
        returnTime,
        totalHours,
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'NO',
        v.status.toUpperCase(),
      ]);
    }
  });

  exportToCsv(`Alfanar_Digital_MV_Site_Visits_25Col_${new Date().toISOString().split('T')[0]}`, rows);
};

/**
 * 16-Column Legacy NCR Export
 */
export const export16ColumnNcrs = (ncrs: NonConformanceReport[]) => {
  const headers = [
    '1. NCR Number',
    '2. Date Reported',
    '3. Linked Case Reference',
    '4. Linked Work Order',
    '5. Equipment Family',
    '6. Equipment Serial Number',
    '7. Defect Category',
    '8. Defect Description',
    '9. Reporting Engineer',
    '10. QCA Reviewer',
    '11. QCA Review Date',
    '12. Quality Disposition',
    '13. Disposition Justification',
    '14. Corrective Action Plan',
    '15. Target Closure Date',
    '16. Current Status',
  ];

  const rows: (string | number)[][] = [headers];

  ncrs.forEach(n => {
    rows.push([
      n.ncrNumber,
      n.reportedDate,
      n.caseId,
      n.workOrderId,
      n.equipmentFamily,
      n.equipmentSerialNumber,
      n.defectCategory,
      n.defectDescription,
      n.reportedByEngineerName,
      n.qcaReviewerName || 'Pending Assignment',
      n.qcaReviewedAt ? n.qcaReviewedAt.split('T')[0] : 'Pending',
      n.disposition,
      n.dispositionJustification,
      n.correctiveActionPlan,
      n.targetClosureDate,
      n.status.toUpperCase(),
    ]);
  });

  exportToCsv(`Alfanar_Digital_MV_NCR_Register_16Col_${new Date().toISOString().split('T')[0]}`, rows);
};

/**
 * Timesheet 3-Stage Segment Export
 */
export const exportTimesheetCsv = (timeLogs: SiteJobTimeLog[]) => {
  const headers = [
    'Time Log ID',
    'Work Order ID',
    'Field Engineer',
    'Site Name',
    'Outbound Travel (min)',
    'On-Site Work (min)',
    'Return Travel (min)',
    'Total Duration (min)',
    'Total Duration (hrs)',
    'Completion Status',
    'Supervisor Review Status',
    'Reviewed By',
    'Date Logged',
  ];

  const rows: (string | number)[][] = [headers];
  timeLogs.forEach(t => {
    rows.push([
      t.id,
      t.workOrderId,
      t.engineerName,
      t.siteName,
      t.outboundTravelMinutes,
      t.onSiteWorkMinutes,
      t.returnTravelMinutes,
      t.totalDurationMinutes,
      (t.totalDurationMinutes / 60).toFixed(2),
      t.isCompleted ? 'COMPLETED (All 6 Steps)' : `IN PROGRESS (Step ${t.currentStep}/6)`,
      t.reviewStatus.toUpperCase(),
      t.reviewedBy || 'Pending',
      t.createdAt.split('T')[0],
    ]);
  });

  exportToCsv(`Alfanar_Digital_MV_Field_Timesheets_${new Date().toISOString().split('T')[0]}`, rows);
};
