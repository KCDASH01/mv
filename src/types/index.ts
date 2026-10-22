/**
 * Digital MV Customer Service Management System
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 * 
 * Core Data Models & Type Definitions
 */

export type UserRole = 
  | 'public_reporter'
  | 'field_engineer'
  | 'dispatcher_supervisor'
  | 'qca_store'
  | 'manager_auditor'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  department: string;
  employeeCode: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type ComplaintStatus = 
  | 'unverified'
  | 'under_review'
  | 'accepted'
  | 'clarification_needed'
  | 'work_order_created'
  | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Complaint {
  id: string;
  referenceNumber: string; // e.g. CMP-2026-0042
  customerName: string;
  company: string;
  contactEmail: string;
  contactMobile: string;
  siteName: string;
  siteAddress: string;
  city: string;
  region: string;
  equipmentFamily?: string;
  panelSerialNumber?: string;
  category: 'Trip during operation' | 'Failure to close/open' | 'Gas pressure alarm (SF6)' | 'Partial discharge / Arc flash' | 'Mechanical interlock stuck' | 'Relay trip / Malfunction' | 'Commissioning support' | 'Routine maintenance' | 'Other';
  description: string;
  consentAcknowledged: boolean;
  status: ComplaintStatus;
  priority: Priority;
  assignedWorkOrderId?: string;
  clarificationNotes?: string;
  duplicateOfId?: string;
  createdAt: string;
  updatedAt: string;
  evidenceAttachments: string[]; // URLs or file IDs
}

export type WorkOrderStatus = 
  | 'draft'
  | 'assigned'
  | 'accepted'
  | 'declined'
  | 'in_progress'
  | 'visit_submitted'
  | 'supervisor_review'
  | 'approved'
  | 'returned_for_correction'
  | 'closed';

export interface WorkOrder {
  id: string;
  workOrderNumber: string; // e.g. WO-2026-0108
  complaintId: string;
  complaintRef: string;
  customerName: string;
  siteName: string;
  siteAddress: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  supervisorId: string;
  supervisorName: string;
  priority: Priority;
  plannedVisitDate: string;
  dueDate: string;
  status: WorkOrderStatus;
  scopeOfWork: string;
  equipmentIds: string[];
  equipmentFamily: string;
  voltageRating: '13.8 kV' | '33 kV' | 'Other';
  declineReason?: string;
  reassignmentReason?: string;
  slaBreachHours?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * MANDATORY THREE-STAGE TIMER
 * Exactly 3 timed segments and 6 sequential actions:
 * Stage 1: Room/base to site (1. Start Travel to Site, 2. End Travel at Site)
 * Stage 2: On-site work (3. Start Work, 4. End Work)
 * Stage 3: Site to Room/base (5. Start Return Travel, 6. End Travel at Room/base)
 */
export type TimerAction = 
  | 'start_travel_to_site'
  | 'end_travel_at_site'
  | 'start_work'
  | 'end_work'
  | 'start_return_travel'
  | 'end_travel_at_room_base';

export interface TimerEvent {
  id: string;
  jobId: string;
  workOrderId: string;
  engineerId: string;
  action: TimerAction;
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  serverTimestamp: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export type TimerReviewStatus = 'pending' | 'approved' | 'returned_for_correction';

export interface SiteJobTimeLog {
  id: string;
  workOrderId: string;
  engineerId: string;
  engineerName: string;
  siteName: string;
  currentStep: number; // 0 (not started), 1-6 (completed step)
  isCompleted: boolean;
  events: TimerEvent[];
  
  // Durations in minutes
  outboundTravelMinutes: number;
  onSiteWorkMinutes: number;
  returnTravelMinutes: number;
  totalDurationMinutes: number;
  
  // Supervisor Review
  reviewStatus: TimerReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  supervisorComments?: string;
  correctionHistory: {
    timestamp: string;
    action: string;
    reason: string;
    actor: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type EnergyState = 'Energized' | 'De-energized' | 'Not Verified';

export type InspectionOutcome = 'Pass' | 'Fail' | 'Not Checked' | 'Not Applicable';

export interface ChecklistItemAnswer {
  id: string;
  category: string;
  itemText: string;
  outcome: InspectionOutcome;
  measurementValue?: string;
  measurementUnit?: string;
  reason?: string; // Required if Fail or Not Checked
  correctiveAction?: string; // Required if Fail or Not Checked
  photos?: string[];
}

export interface PanelInspectionEntry {
  id: string;
  panelIdentifier: string; // e.g. "Panel 1 - Incoming Feeder"
  equipmentFamily: 'LBS' | 'SLBS' | 'Auto-Recloser' | 'RMU' | 'MRMU' | 'SRMU' | 'Other';
  voltageRating: '13.8 kV' | '33 kV' | 'Other';
  serialNumber: string;
  model: string;
  manufacturer: string;
  rtuControllerType?: string;
  locationDetails: string;
  energyState: EnergyState;
  energyStateReason?: string; // Required if Not Verified
  customerAllegation: string;
  verifiedEngineeringFindings: string;
  rootCause: string;
  solutionProvided: string;
  checklistAnswers: ChecklistItemAnswer[];
  photos: string[];
  replacementPartsNeeded: {
    partNumber: string;
    partDescription: string;
    quantity: number;
    serialNumberOld?: string;
    isWarranty: boolean;
  }[];
  requiresNcr: boolean;
  ncrReason?: string;
}

export interface SiteVisitReport {
  id: string;
  visitReportNumber: string; // e.g. SVR-2026-0089
  revisionNumber: number; // Revision history (immutable submissions)
  workOrderId: string;
  workOrderNumber: string;
  complaintId: string;
  complaintRef: string;
  engineerId: string;
  engineerName: string;
  siteName: string;
  customerContactPerson: string;
  customerContactPhone: string;
  siteArrivalTime: string;
  siteDepartureTime: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    capturedAt: string;
  };
  timeLogId: string;
  panels: PanelInspectionEntry[];
  accessRestrictionsNote?: string;
  status: 'draft' | 'submitted' | 'supervisor_approved' | 'returned_for_correction';
  supervisorReviewNotes?: string;
  supervisorId?: string;
  supervisorReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type NcrStatus = 'open' | 'under_qca_review' | 'disposition_approved' | 'rectified' | 'closed';
export type NcrDisposition = 'Rework' | 'Scrap' | 'Use-As-Is' | 'Return to Vendor / Factory' | 'Pending Decision';

export interface NonConformanceReport {
  id: string;
  ncrNumber: string; // e.g. NCR-2026-0019
  caseId: string;
  workOrderId: string;
  visitReportId: string;
  equipmentFamily: string;
  equipmentSerialNumber: string;
  defectCategory: 'Manufacturing Defect' | 'Assembly Error' | 'Component Malfunction' | 'Site Damage' | 'Environmental Corrosion' | 'Design Tolerance';
  defectDescription: string;
  reportedDate: string;
  reportedByEngineerId: string;
  reportedByEngineerName: string;
  qcaReviewerId?: string;
  qcaReviewerName?: string;
  qcaReviewedAt?: string;
  disposition: NcrDisposition;
  dispositionJustification: string;
  rootCauseAnalysis: string;
  correctiveActionPlan: string;
  followUpOwner: string;
  targetClosureDate: string;
  status: NcrStatus;
  photos: string[];
}

export interface SparePart {
  id: string;
  partNumber: string;
  description: string;
  equipmentFamily: string;
  voltageRating: string;
  unit: string;
  stockQuantity: number;
  reservedQuantity: number;
  location: string;
  unitCostSar: number;
}

export interface StockTransaction {
  id: string;
  transactionNumber: string;
  partId: string;
  partNumber: string;
  partDescription: string;
  type: 'RECEIPT' | 'ISSUE_TO_JOB' | 'RETURN_FROM_JOB' | 'FACTORY_RETURN' | 'SCRAP_DISPOSAL';
  quantity: number;
  workOrderId?: string;
  ncrId?: string;
  performedBy: string;
  timestamp: string;
  sourceLocation: string;
  destinationLocation: string;
  serialNumberOld?: string;
  serialNumberNew?: string;
  notes: string;
}

export interface MaterialRequest {
  id: string;
  requestNumber: string;
  workOrderId: string;
  engineerId: string;
  engineerName: string;
  requestedDate: string;
  items: {
    partId: string;
    partNumber: string;
    description: string;
    quantityRequested: number;
    quantityApproved: number;
    status: 'pending' | 'approved' | 'issued' | 'rejected';
  }[];
  status: 'pending_approval' | 'approved' | 'partially_issued' | 'issued' | 'rejected';
  approvedBy?: string;
  approvalNotes?: string;
}

export interface EquipmentMaster {
  id: string;
  serialNumber: string;
  family: 'LBS' | 'SLBS' | 'Auto-Recloser' | 'RMU' | 'MRMU' | 'SRMU' | 'Other';
  voltage: '13.8 kV' | '33 kV' | 'Other';
  model: string;
  manufacturer: string;
  customerName: string;
  siteName: string;
  feederPoleLocation: string;
  salesOrderNumber: string;
  manufacturingDate: string;
  warrantyExpiryDate: string;
  rtuControllerType?: string;
  status: 'In Service' | 'Under Maintenance' | 'Decommissioned' | 'Quarantined';
  lastServiceDate?: string;
  nextPmDueDate?: string;
}

export interface RemoteSupportCase {
  id: string;
  ticketNumber: string;
  customerName: string;
  siteName: string;
  issueSummary: string;
  assignedSupportEngineer: string;
  channel: 'Phone Call' | 'Video Conference' | 'Email' | 'SCADA Telemetry Review';
  actionsTaken: string;
  resolutionStatus: 'Resolved' | 'Escalated to Site Visit' | 'Waiting Customer Feedback';
  durationMinutes: number;
  linkedComplaintId?: string;
  createdAt: string;
}

export interface ShutdownRecord {
  id: string;
  requestNumber: string;
  siteName: string;
  customerName: string;
  proposedDate: string;
  proposedDurationHours: number;
  customerApprovalStatus: 'Requested' | 'Approved by Utility' | 'Rejected' | 'Rescheduled';
  externalPermitRef: string; // Safety permit reference tracking
  switchingAuthority: string;
  plannedWorkSummary: string;
  executedDate?: string;
  notes: string;
}

export interface CommissioningRecord {
  id: string;
  commissioningNumber: string;
  equipmentSerialNumber: string;
  equipmentFamily: string;
  siteName: string;
  commissioningDate: string;
  leadEngineer: string;
  witnessedByCustomer: string;
  insulationResistanceTestMegaOhms: number;
  contactResistanceMicroOhms: number;
  breakerTimingMilliseconds: number;
  gasPressureBar: number;
  result: 'Accepted' | 'Punch List Pending' | 'Rejected';
  punchListItems?: string;
}

export interface PreventiveMaintenancePlan {
  id: string;
  planCode: string;
  equipmentSerialNumber: string;
  siteName: string;
  intervalMonths: number;
  lastServiceDate: string;
  nextDueDate: string;
  assignedEngineer: string;
  checklistName: string;
  status: 'Upcoming' | 'Due Soon' | 'Overdue' | 'Completed';
}

export interface CustomerClosureRecord {
  id: string;
  caseId: string;
  workOrderId: string;
  closureNumber: string;
  customerName: string;
  customerRepresentative: string;
  signedOffDate: string;
  serviceOutcome: 'Permanent Fix Verified' | 'Temporary Bypass Installed' | 'Customer Equipment Issue (No MV Fault)' | 'Awaiting Factory Components';
  unresolvedLimitations: string;
  supervisorApprover: string;
  supervisorSignOffDate: string;
  customerFeedbackScore?: number; // 1 to 5 stars
  closureStatus: 'Pending Review' | 'Supervisor Approved' | 'Fully Closed';
}

export interface TrainingRecord {
  id: string;
  trainingCode: string;
  title: string;
  date: string;
  siteOrLocation: string;
  trainerName: string;
  durationHours: number;
  attendees: {
    name: string;
    designation: string;
    organization: string;
    attended: boolean;
  }[];
  topicsCovered: string;
  certificateRef?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  beforeState?: string;
  afterState?: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}
