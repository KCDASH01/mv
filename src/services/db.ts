/**
 * Digital MV Customer Service Management System
 * Database & Persistence Engine
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import {
  User,
  Complaint,
  ComplaintStatus,
  WorkOrder,
  SiteJobTimeLog,
  TimerEvent,
  TimerAction,
  SiteVisitReport,
  PanelInspectionEntry,
  NonConformanceReport,
  SparePart,
  StockTransaction,
  MaterialRequest,
  EquipmentMaster,
  RemoteSupportCase,
  ShutdownRecord,
  CommissioningRecord,
  PreventiveMaintenancePlan,
  CustomerClosureRecord,
  TrainingRecord,
  AuditEvent,
  NotificationItem,
  UserRole,
} from '../types';

const STORAGE_KEY_PREFIX = 'digital_mv_alfanar_';

// Initial Seed Users representing genuine enterprise roles
const SEED_USERS: User[] = [
  {
    id: 'usr_disp_01',
    name: 'Fahad Al-Otaibi',
    email: 'fahad.otaibi@alfanar.com',
    role: 'dispatcher_supervisor',
    phone: '+966 50 123 4567',
    department: 'MV Customer Dispatch & Field Ops',
    employeeCode: 'ALF-DS-104',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr_eng_01',
    name: 'Tariq Mansoor',
    email: 'tariq.mansoor@alfanar.com',
    role: 'field_engineer',
    phone: '+966 54 987 6543',
    department: 'Central Region Field Engineering',
    employeeCode: 'ALF-FE-309',
    isActive: true,
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'usr_eng_02',
    name: 'Zaid Al-Harbi',
    email: 'zaid.harbi@alfanar.com',
    role: 'field_engineer',
    phone: '+966 55 222 3344',
    department: 'Eastern Region Field Engineering',
    employeeCode: 'ALF-FE-312',
    isActive: true,
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'usr_qca_01',
    name: 'Dr. Reem Al-Ghamdi',
    email: 'reem.ghamdi@alfanar.com',
    role: 'qca_store',
    phone: '+966 56 444 8899',
    department: 'Quality Assurance & Spares Logistics',
    employeeCode: 'ALF-QA-088',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr_mgr_01',
    name: 'Eng. Khalid Al-Sulaiman',
    email: 'khalid.sulaiman@alfanar.com',
    role: 'manager_auditor',
    phone: '+966 50 555 1212',
    department: 'Head of MV Customer Service Division',
    employeeCode: 'ALF-MG-002',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'usr_adm_01',
    name: 'System Administrator (Kanpri Tech)',
    email: 'admin@digitalmv.kanpritech.com',
    role: 'admin',
    phone: '+966 50 000 9999',
    department: 'Platform Architecture & IT Ops',
    employeeCode: 'KP-ADM-001',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
  },
];

const SEED_EQUIPMENT: EquipmentMaster[] = [
  {
    id: 'eq_01',
    serialNumber: 'ALF-RMU-2024-8841',
    family: 'RMU',
    voltage: '13.8 kV',
    model: 'Alfanar SafeRing CCV-13.8',
    manufacturer: 'Alfanar Electrical Systems',
    customerName: 'Saudi Electricity Company (SEC)',
    siteName: 'Riyadh Substation 8044 — Al-Malaz',
    feederPoleLocation: 'Feeder F-12 / Bay 4',
    salesOrderNumber: 'SO-ALF-99201',
    manufacturingDate: '2024-04-12',
    warrantyExpiryDate: '2027-04-12',
    rtuControllerType: 'Alfanar RTU-600',
    status: 'Under Maintenance',
    lastServiceDate: '2026-08-10',
    nextPmDueDate: '2026-11-10',
  },
  {
    id: 'eq_02',
    serialNumber: 'ALF-AR-2023-5519',
    family: 'Auto-Recloser',
    voltage: '33 kV',
    model: 'Alfanar GridGuard ACR-33',
    manufacturer: 'Alfanar Electrical Systems',
    customerName: 'Red Sea Global Infrastructure',
    siteName: 'Southern Dunes Solar Grid Station',
    feederPoleLocation: 'Pole Line P-19B',
    salesOrderNumber: 'SO-ALF-77402',
    manufacturingDate: '2023-11-05',
    warrantyExpiryDate: '2026-11-05',
    rtuControllerType: 'SEL-651R Controller',
    status: 'In Service',
    lastServiceDate: '2026-07-20',
    nextPmDueDate: '2026-10-20',
  },
  {
    id: 'eq_03',
    serialNumber: 'ALF-LBS-2025-1102',
    family: 'LBS',
    voltage: '13.8 kV',
    model: 'Alfanar LoadBreak-13.8 Manual',
    manufacturer: 'Alfanar Electrical Systems',
    customerName: 'NEOM Energy Distribution',
    siteName: 'Oxagon Light Industrial Park',
    feederPoleLocation: 'Ring Feeder R-03',
    salesOrderNumber: 'SO-ALF-10492',
    manufacturingDate: '2025-02-18',
    warrantyExpiryDate: '2028-02-18',
    status: 'In Service',
    lastServiceDate: '2026-05-14',
    nextPmDueDate: '2026-11-14',
  },
  {
    id: 'eq_04',
    serialNumber: 'ALF-MRMU-2024-3382',
    family: 'MRMU',
    voltage: '33 kV',
    model: 'Alfanar Modular RMU 33kV-Extensible',
    manufacturer: 'Alfanar Electrical Systems',
    customerName: 'King Salman Park Development',
    siteName: 'Central Utility Vault B',
    feederPoleLocation: 'Switchgear Room SW-01',
    salesOrderNumber: 'SO-ALF-88192',
    manufacturingDate: '2024-09-01',
    warrantyExpiryDate: '2027-09-01',
    rtuControllerType: 'ABB REC670',
    status: 'In Service',
    lastServiceDate: '2026-09-02',
    nextPmDueDate: '2026-12-02',
  },
];

const SEED_PARTS: SparePart[] = [
  {
    id: 'prt_01',
    partNumber: 'ALF-SP-SF6-VLV',
    description: 'SF6 Gas Valve & Manometer Gauge Kit (0-0.3 MPa)',
    equipmentFamily: 'RMU',
    voltageRating: '13.8 kV',
    unit: 'Kit',
    stockQuantity: 18,
    reservedQuantity: 2,
    location: 'Riyadh Central Stores — Rack B-04',
    unitCostSar: 1250,
  },
  {
    id: 'prt_02',
    partNumber: 'ALF-SP-MCH-LATCH',
    description: 'Spring Charge Mechanism Trip Latch Assembly',
    equipmentFamily: 'Auto-Recloser',
    voltageRating: '33 kV',
    unit: 'Set',
    stockQuantity: 9,
    reservedQuantity: 1,
    location: 'Riyadh Central Stores — Rack C-11',
    unitCostSar: 3400,
  },
  {
    id: 'prt_03',
    partNumber: 'ALF-SP-AUX-SW4',
    description: '4NO/4NC Heavy Duty Auxiliary Switch Block',
    equipmentFamily: 'LBS',
    voltageRating: '13.8 kV',
    unit: 'Piece',
    stockQuantity: 35,
    reservedQuantity: 4,
    location: 'Dammam Branch Store — Bin A-02',
    unitCostSar: 480,
  },
  {
    id: 'prt_04',
    partNumber: 'ALF-SP-VT-FUSE',
    description: 'Voltage Transformer MV Current-Limiting Fuse 3.15A',
    equipmentFamily: 'MRMU',
    voltageRating: '33 kV',
    unit: 'Piece',
    stockQuantity: 24,
    reservedQuantity: 0,
    location: 'Jeddah Branch Store — Bin F-09',
    unitCostSar: 620,
  },
];

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_01',
    referenceNumber: 'CMP-2026-0042',
    customerName: 'Eng. Mansour Al-Garni',
    company: 'Saudi Electricity Company (SEC)',
    contactEmail: 'm.garni@se.com.sa',
    contactMobile: '+966 50 912 3456',
    siteName: 'Riyadh Substation 8044 — Al-Malaz',
    siteAddress: 'Salah Al-Din Al-Ayyubi Road, Al-Malaz',
    city: 'Riyadh',
    region: 'Central',
    equipmentFamily: 'RMU',
    panelSerialNumber: 'ALF-RMU-2024-8841',
    category: 'Gas pressure alarm (SF6)',
    description: 'Low SF6 pressure alarm triggered during peak load at 14:15. Gauge indicates 0.038 MPa (below threshold 0.045 MPa). Breaker lockout impending.',
    consentAcknowledged: true,
    status: 'in_progress' as ComplaintStatus,
    priority: 'high',
    assignedWorkOrderId: 'wo_01',
    createdAt: '2026-10-21T06:30:00Z',
    updatedAt: '2026-10-21T07:15:00Z',
    evidenceAttachments: [],
  },
  {
    id: 'cmp_02',
    referenceNumber: 'CMP-2026-0043',
    customerName: 'Abdullah Al-Shehri',
    company: 'Red Sea Global Infrastructure',
    contactEmail: 'a.shehri@redseaglobal.com',
    contactMobile: '+966 55 432 1098',
    siteName: 'Southern Dunes Solar Grid Station',
    siteAddress: 'Plot SD-4, Red Sea Project Zone',
    city: 'Umluj',
    region: 'Western',
    equipmentFamily: 'Auto-Recloser',
    panelSerialNumber: 'ALF-AR-2023-5519',
    category: 'Trip during operation',
    description: 'Auto-Recloser tripped twice on overcurrent 50P; reclose sequence did not lock out cleanly, requiring manual reset at pole structure.',
    consentAcknowledged: true,
    status: 'work_order_created',
    priority: 'critical',
    assignedWorkOrderId: 'wo_02',
    createdAt: '2026-10-21T09:00:00Z',
    updatedAt: '2026-10-21T10:00:00Z',
    evidenceAttachments: [],
  },
  {
    id: 'cmp_03',
    referenceNumber: 'CMP-2026-0044',
    customerName: 'Hassan Bin Laden',
    company: 'NEOM Energy Distribution',
    contactEmail: 'h.binladen@neom.com',
    contactMobile: '+966 54 888 7766',
    siteName: 'Oxagon Light Industrial Park',
    siteAddress: 'Sector 3A, Oxagon Maritime Zone',
    city: 'Tabuk',
    region: 'Northern',
    equipmentFamily: 'LBS',
    panelSerialNumber: 'ALF-LBS-2025-1102',
    category: 'Mechanical interlock stuck',
    description: 'Earth switch interlock lever feels jammed when attempting standard de-energized isolation sequence for routine cable testing.',
    consentAcknowledged: true,
    status: 'unverified',
    priority: 'medium',
    createdAt: '2026-10-22T01:15:00Z',
    updatedAt: '2026-10-22T01:15:00Z',
    evidenceAttachments: [],
  },
];

const SEED_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo_01',
    workOrderNumber: 'WO-2026-0108',
    complaintId: 'cmp_01',
    complaintRef: 'CMP-2026-0042',
    customerName: 'Saudi Electricity Company (SEC)',
    siteName: 'Riyadh Substation 8044 — Al-Malaz',
    siteAddress: 'Salah Al-Din Al-Ayyubi Road, Al-Malaz, Riyadh',
    assignedEngineerId: 'usr_eng_01',
    assignedEngineerName: 'Tariq Mansoor',
    supervisorId: 'usr_disp_01',
    supervisorName: 'Fahad Al-Otaibi',
    priority: 'high',
    plannedVisitDate: '2026-10-22',
    dueDate: '2026-10-23',
    status: 'in_progress',
    scopeOfWork: 'Inspect SF6 gas compartment, test density monitor switch, perform sniffer leak test around valve seal, top-up SF6 if required, and complete 3-stage site timer and technical report.',
    equipmentIds: ['eq_01'],
    equipmentFamily: 'RMU',
    voltageRating: '13.8 kV',
    createdAt: '2026-10-21T07:15:00Z',
    updatedAt: '2026-10-21T08:00:00Z',
  },
  {
    id: 'wo_02',
    workOrderNumber: 'WO-2026-0109',
    complaintId: 'cmp_02',
    complaintRef: 'CMP-2026-0043',
    customerName: 'Red Sea Global Infrastructure',
    siteName: 'Southern Dunes Solar Grid Station',
    siteAddress: 'Plot SD-4, Red Sea Project Zone, Umluj',
    assignedEngineerId: 'usr_eng_02',
    assignedEngineerName: 'Zaid Al-Harbi',
    supervisorId: 'usr_disp_01',
    supervisorName: 'Fahad Al-Otaibi',
    priority: 'critical',
    plannedVisitDate: '2026-10-23',
    dueDate: '2026-10-24',
    status: 'assigned',
    scopeOfWork: 'Investigate ACR-33 mechanical spring discharge timing and SEL-651R event history records. Verify relay trip coil resistance.',
    equipmentIds: ['eq_02'],
    equipmentFamily: 'Auto-Recloser',
    voltageRating: '33 kV',
    createdAt: '2026-10-21T10:00:00Z',
    updatedAt: '2026-10-21T10:00:00Z',
  },
];

const SEED_TIME_LOGS: SiteJobTimeLog[] = [
  {
    id: 'tl_01',
    workOrderId: 'wo_01',
    engineerId: 'usr_eng_01',
    engineerName: 'Tariq Mansoor',
    siteName: 'Riyadh Substation 8044 — Al-Malaz',
    currentStep: 3, // Currently on step 3 (Started Work on site!)
    isCompleted: false,
    outboundTravelMinutes: 38,
    onSiteWorkMinutes: 0,
    returnTravelMinutes: 0,
    totalDurationMinutes: 38,
    reviewStatus: 'pending',
    correctionHistory: [],
    events: [
      {
        id: 'evt_01',
        jobId: 'tl_01',
        workOrderId: 'wo_01',
        engineerId: 'usr_eng_01',
        action: 'start_travel_to_site',
        stepNumber: 1,
        serverTimestamp: '2026-10-22T08:00:00Z',
        latitude: 24.7136,
        longitude: 46.6753,
        notes: 'Departed Alfanar Industrial City Base towards Al-Malaz',
      },
      {
        id: 'evt_02',
        jobId: 'tl_01',
        workOrderId: 'wo_01',
        engineerId: 'usr_eng_01',
        action: 'end_travel_at_site',
        stepNumber: 2,
        serverTimestamp: '2026-10-22T08:38:00Z',
        latitude: 24.6612,
        longitude: 46.7289,
        notes: 'Arrived at SEC Substation 8044 Security Gate',
      },
      {
        id: 'evt_03',
        jobId: 'tl_01',
        workOrderId: 'wo_01',
        engineerId: 'usr_eng_01',
        action: 'start_work',
        stepNumber: 3,
        serverTimestamp: '2026-10-22T08:45:00Z',
        latitude: 24.6612,
        longitude: 46.7289,
        notes: 'Work permit signed with SEC operator; opened RMU enclosure door',
      },
    ],
    createdAt: '2026-10-22T08:00:00Z',
    updatedAt: '2026-10-22T08:45:00Z',
  },
];

const SEED_NCRS: NonConformanceReport[] = [
  {
    id: 'ncr_01',
    ncrNumber: 'NCR-2026-0019',
    caseId: 'cmp_01',
    workOrderId: 'wo_01',
    visitReportId: 'svr_prev_01',
    equipmentFamily: 'RMU',
    equipmentSerialNumber: 'ALF-RMU-2024-8841',
    defectCategory: 'Component Malfunction',
    defectDescription: 'Schrader valve internal O-ring seal degraded prematurely, causing minor gas micro-seepage under thermal fluctuation.',
    reportedDate: '2026-10-22',
    reportedByEngineerId: 'usr_eng_01',
    reportedByEngineerName: 'Tariq Mansoor',
    qcaReviewerId: 'usr_qca_01',
    qcaReviewerName: 'Dr. Reem Al-Ghamdi',
    qcaReviewedAt: '2026-10-22T10:00:00Z',
    disposition: 'Rework',
    dispositionJustification: 'Replace valve assembly with upgraded EPDM fluoro-silicone gasket kit under factory batch recall notice TB-2025-04.',
    rootCauseAnalysis: 'Batch lot 24-Q1 valve seals showed reduced elasticity in high ambient desert heat (>52°C).',
    correctiveActionPlan: 'Perform on-site valve replacement, vacuum purge, and re-gas with calibrated SF6 charging trolley.',
    followUpOwner: 'Central Region Field Engineering',
    targetClosureDate: '2026-10-25',
    status: 'under_qca_review',
    photos: [],
  },
];

const SEED_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'st_01',
    transactionNumber: 'STX-2026-0311',
    partId: 'prt_01',
    partNumber: 'ALF-SP-SF6-VLV',
    partDescription: 'SF6 Gas Valve & Manometer Gauge Kit (0-0.3 MPa)',
    type: 'ISSUE_TO_JOB',
    quantity: 1,
    workOrderId: 'wo_01',
    ncrId: 'ncr_01',
    performedBy: 'Dr. Reem Al-Ghamdi',
    timestamp: '2026-10-22T08:15:00Z',
    sourceLocation: 'Riyadh Central Stores — Rack B-04',
    destinationLocation: 'Engineer Van Tariq Mansoor (ALF-VAN-12)',
    serialNumberNew: 'VLV-2026-9921',
    notes: 'Issued against approved work order WO-2026-0108 for emergency SF6 replenishment',
  },
];

const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud_01',
    timestamp: '2026-10-21T06:30:00Z',
    actorId: 'public_anon',
    actorName: 'Eng. Mansour Al-Garni',
    actorRole: 'public_reporter',
    action: 'SUBMIT_COMPLAINT',
    entityType: 'Complaint',
    entityId: 'cmp_01',
    details: 'New complaint registered anonymously via public intake portal',
  },
  {
    id: 'aud_02',
    timestamp: '2026-10-21T07:15:00Z',
    actorId: 'usr_disp_01',
    actorName: 'Fahad Al-Otaibi',
    actorRole: 'dispatcher_supervisor',
    action: 'TRIAGE_AND_CREATE_WO',
    entityType: 'WorkOrder',
    entityId: 'wo_01',
    details: 'Complaint CMP-2026-0042 classified as High Priority. Work Order WO-2026-0108 generated and assigned to Eng. Tariq Mansoor.',
  },
  {
    id: 'aud_03',
    timestamp: '2026-10-22T08:00:00Z',
    actorId: 'usr_eng_01',
    actorName: 'Tariq Mansoor',
    actorRole: 'field_engineer',
    action: 'START_TRAVEL_TO_SITE',
    entityType: 'SiteJobTimeLog',
    entityId: 'tl_01',
    details: 'Stage 1 Action 1 executed: Start Travel to Site from Base at 08:00:00',
  },
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    recipientId: 'usr_eng_01',
    title: 'New Work Order Assigned',
    message: 'You have been assigned to High Priority WO-2026-0108 at SEC Substation 8044.',
    type: 'warning',
    read: false,
    createdAt: '2026-10-21T07:15:00Z',
    link: 'work-orders',
  },
  {
    id: 'notif_02',
    recipientId: 'usr_disp_01',
    title: 'New Complaint Submitted',
    message: 'Public complaint CMP-2026-0044 received from NEOM Energy Distribution for LBS interlock.',
    type: 'info',
    read: false,
    createdAt: '2026-10-22T01:15:00Z',
    link: 'complaints',
  },
  {
    id: 'notif_03',
    recipientId: 'usr_qca_01',
    title: 'NCR Pending Review',
    message: 'NCR-2026-0019 regarding SF6 Valve O-ring seal requires QCA review and disposition sign-off.',
    type: 'alert',
    read: false,
    createdAt: '2026-10-22T10:00:00Z',
    link: 'ncr',
  },
];

// In-Memory & LocalStorage Cache
class DatabaseService {
  private users: User[] = [];
  private equipment: EquipmentMaster[] = [];
  private parts: SparePart[] = [];
  private complaints: Complaint[] = [];
  private workOrders: WorkOrder[] = [];
  private timeLogs: SiteJobTimeLog[] = [];
  private visitReports: SiteVisitReport[] = [];
  private ncrs: NonConformanceReport[] = [];
  private stockTransactions: StockTransaction[] = [];
  private materialRequests: MaterialRequest[] = [];
  private remoteCases: RemoteSupportCase[] = [];
  private shutdowns: ShutdownRecord[] = [];
  private commissioning: CommissioningRecord[] = [];
  private maintenancePlans: PreventiveMaintenancePlan[] = [];
  private customerClosures: CustomerClosureRecord[] = [];
  private trainings: TrainingRecord[] = [];
  private auditEvents: AuditEvent[] = [];
  private notifications: NotificationItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.users = this.loadOrSeed('users', SEED_USERS);
    this.equipment = this.loadOrSeed('equipment', SEED_EQUIPMENT);
    this.parts = this.loadOrSeed('parts', SEED_PARTS);
    this.complaints = this.loadOrSeed('complaints', SEED_COMPLAINTS);
    this.workOrders = this.loadOrSeed('workOrders', SEED_WORK_ORDERS);
    this.timeLogs = this.loadOrSeed('timeLogs', SEED_TIME_LOGS);
    this.ncrs = this.loadOrSeed('ncrs', SEED_NCRS);
    this.stockTransactions = this.loadOrSeed('stockTransactions', SEED_STOCK_TRANSACTIONS);
    this.auditEvents = this.loadOrSeed('auditEvents', SEED_AUDIT_EVENTS);
    this.notifications = this.loadOrSeed('notifications', SEED_NOTIFICATIONS);

    // Initial seed for specialist workflows if not saved
    this.visitReports = this.loadOrSeed('visitReports', []);
    this.materialRequests = this.loadOrSeed('materialRequests', []);
    this.remoteCases = this.loadOrSeed('remoteCases', [
      {
        id: 'rst_01',
        ticketNumber: 'RST-2026-0012',
        customerName: 'Saudi Aramco Power Systems',
        siteName: 'Tanajib Gas Plant Switchgear',
        issueSummary: 'RTU communication failure with SCADA master on DNP3 protocol over fiber.',
        assignedSupportEngineer: 'Tariq Mansoor',
        channel: 'Phone Call',
        actionsTaken: 'Reviewed router IP configuration and port 20000 gateway settings remotely. Guided site technician to reset optical transceiver.',
        resolutionStatus: 'Resolved',
        durationMinutes: 45,
        createdAt: '2026-10-20T14:30:00Z',
      },
    ]);
    this.shutdowns = this.loadOrSeed('shutdowns', [
      {
        id: 'sht_01',
        requestNumber: 'SHT-2026-0008',
        siteName: 'Riyadh Substation 8044 — Al-Malaz',
        customerName: 'Saudi Electricity Company (SEC)',
        proposedDate: '2026-10-25 02:00:00',
        proposedDurationHours: 4,
        customerApprovalStatus: 'Approved by Utility',
        externalPermitRef: 'SEC-PERMIT-CR-2026-8819',
        switchingAuthority: 'National Grid SA Operations Desk',
        plannedWorkSummary: 'Busbar isolation for SF6 compartment manifold replacement and high-potential proof test.',
        notes: 'Strict compliance: Alfanar engineers are NOT permitted to perform MV switching. Utility switching engineer must lock and tag out.',
      },
    ]);
    this.commissioning = this.loadOrSeed('commissioning', [
      {
        id: 'com_01',
        commissioningNumber: 'COM-2026-0014',
        equipmentSerialNumber: 'ALF-MRMU-2024-3382',
        equipmentFamily: 'MRMU',
        siteName: 'King Salman Park Development',
        commissioningDate: '2026-09-02',
        leadEngineer: 'Zaid Al-Harbi',
        witnessedByCustomer: 'Eng. Fahad Al-Bishi (KSPD Project Mgmt)',
        insulationResistanceTestMegaOhms: 24500,
        contactResistanceMicroOhms: 42.5,
        breakerTimingMilliseconds: 48,
        gasPressureBar: 1.4,
        result: 'Accepted',
      },
    ]);
    this.maintenancePlans = this.loadOrSeed('maintenancePlans', [
      {
        id: 'pm_01',
        planCode: 'PM-2026-Q4-01',
        equipmentSerialNumber: 'ALF-RMU-2024-8841',
        siteName: 'Riyadh Substation 8044 — Al-Malaz',
        intervalMonths: 6,
        lastServiceDate: '2026-08-10',
        nextDueDate: '2026-11-10',
        assignedEngineer: 'Tariq Mansoor',
        checklistName: 'Alfanar 13.8kV RMU Semi-Annual Diagnostic Checklist',
        status: 'Upcoming',
      },
      {
        id: 'pm_02',
        planCode: 'PM-2026-Q4-02',
        equipmentSerialNumber: 'ALF-AR-2023-5519',
        siteName: 'Southern Dunes Solar Grid Station',
        intervalMonths: 12,
        lastServiceDate: '2025-10-20',
        nextDueDate: '2026-10-20',
        assignedEngineer: 'Zaid Al-Harbi',
        checklistName: 'Alfanar 33kV Auto-Recloser Annual Inspection',
        status: 'Overdue',
      },
    ]);
    this.customerClosures = this.loadOrSeed('customerClosures', []);
    this.trainings = this.loadOrSeed('trainings', [
      {
        id: 'trn_01',
        trainingCode: 'TRN-2026-005',
        title: 'Safe Operation and Interlocking of Alfanar CCV-13.8 RMU',
        date: '2026-09-15',
        siteOrLocation: 'Alfanar Training Academy, Riyadh',
        trainerName: 'Eng. Khalid Al-Sulaiman',
        durationHours: 6,
        attendees: [
          { name: 'Majed Al-Rashid', designation: 'Substation Technician', organization: 'SEC Central', attended: true },
          { name: 'Saud Al-Dossary', designation: 'Maintenance Supervisor', organization: 'SEC Central', attended: true },
          { name: 'Faisal Al-Otaibi', designation: 'Electrical Engineer', organization: 'Red Sea Global', attended: true },
        ],
        topicsCovered: 'Mechanical interlocks, earthing switch sequencing, SF6 pressure gauge interpretation, emergency trip protocol.',
        certificateRef: 'CERT-ALF-TRN-882',
      },
    ]);
  }

  private loadOrSeed<T>(key: string, seed: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    this.save(key, seed);
    return seed;
  }

  private save<T>(key: string, data: T) {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    } catch {
      // localStorage may fail in restricted context
    }
  }

  // --- Audit Trail Logging ---
  public logAudit(actor: { id: string; name: string; role: UserRole }, action: string, entityType: string, entityId: string, details: string, before?: string, after?: string) {
    const event: AuditEvent = {
      id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      details,
      beforeState: before,
      afterState: after,
    };
    this.auditEvents.unshift(event);
    this.save('auditEvents', this.auditEvents);
    return event;
  }

  // --- Users & Roles ---
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>, actor: User): User {
    const newUser: User = {
      ...user,
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.save('users', this.users);
    this.logAudit(actor, 'CREATE_USER', 'User', newUser.id, `Created user ${newUser.name} with role ${newUser.role}`);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>, actor: User): User {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    this.users[idx] = { ...this.users[idx], ...updates };
    this.save('users', this.users);
    this.logAudit(actor, 'UPDATE_USER', 'User', id, `Updated user attributes`);
    return this.users[idx];
  }

  // --- Complaints ---
  public getComplaints(): Complaint[] {
    return [...this.complaints];
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find(c => c.id === id);
  }

  public submitPublicComplaint(data: Omit<Complaint, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>): Complaint {
    const year = new Date().getFullYear();
    const count = this.complaints.length + 42;
    const ref = `CMP-${year}-${String(count).padStart(4, '0')}`;
    const newComplaint: Complaint = {
      ...data,
      id: 'cmp_' + Date.now(),
      referenceNumber: ref,
      status: 'unverified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.complaints.unshift(newComplaint);
    this.save('complaints', this.complaints);

    // Create system notification for dispatchers
    this.addNotification({
      recipientId: 'usr_disp_01',
      title: 'New Public Complaint Received',
      message: `${newComplaint.company || newComplaint.customerName} submitted ${ref} regarding ${newComplaint.category}`,
      type: 'info',
      link: 'complaints',
    });

    this.logAudit(
      { id: 'public_anon', name: data.customerName, role: 'public_reporter' },
      'SUBMIT_PUBLIC_COMPLAINT',
      'Complaint',
      newComplaint.id,
      `Public complaint ${ref} filed for ${data.siteName}`
    );

    return newComplaint;
  }

  public triageComplaint(
    id: string,
    action: 'accept' | 'request_clarification' | 'mark_duplicate',
    details: { priority?: 'low' | 'medium' | 'high' | 'critical'; notes?: string; duplicateOfId?: string },
    actor: User
  ): Complaint {
    const comp = this.complaints.find(c => c.id === id);
    if (!comp) throw new Error('Complaint not found');

    const before = comp.status;
    if (action === 'accept') {
      comp.status = 'accepted';
      if (details.priority) comp.priority = details.priority;
    } else if (action === 'request_clarification') {
      comp.status = 'clarification_needed';
      comp.clarificationNotes = details.notes;
    } else if (action === 'mark_duplicate') {
      comp.status = 'closed';
      comp.duplicateOfId = details.duplicateOfId;
    }
    comp.updatedAt = new Date().toISOString();
    this.save('complaints', this.complaints);

    this.logAudit(actor, 'TRIAGE_COMPLAINT', 'Complaint', id, `Complaint ${comp.referenceNumber} triaged to ${comp.status}`, before, comp.status);
    return comp;
  }

  // --- Work Orders ---
  public getWorkOrders(): WorkOrder[] {
    return [...this.workOrders];
  }

  public getWorkOrderById(id: string): WorkOrder | undefined {
    return this.workOrders.find(w => w.id === id);
  }

  public createWorkOrder(data: {
    complaintId: string;
    assignedEngineerId: string;
    supervisorId: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    plannedVisitDate: string;
    dueDate: string;
    scopeOfWork: string;
    equipmentIds: string[];
    equipmentFamily: string;
    voltageRating: '13.8 kV' | '33 kV' | 'Other';
  }, actor: User): WorkOrder {
    const complaint = this.complaints.find(c => c.id === data.complaintId);
    if (!complaint) throw new Error('Complaint not found');

    const engineer = this.users.find(u => u.id === data.assignedEngineerId);
    const supervisor = this.users.find(u => u.id === data.supervisorId);

    const year = new Date().getFullYear();
    const count = this.workOrders.length + 108;
    const woNum = `WO-${year}-${String(count).padStart(4, '0')}`;

    const newWO: WorkOrder = {
      id: 'wo_' + Date.now(),
      workOrderNumber: woNum,
      complaintId: complaint.id,
      complaintRef: complaint.referenceNumber,
      customerName: complaint.customerName,
      siteName: complaint.siteName,
      siteAddress: complaint.siteAddress,
      assignedEngineerId: data.assignedEngineerId,
      assignedEngineerName: engineer?.name || 'Assigned Engineer',
      supervisorId: data.supervisorId,
      supervisorName: supervisor?.name || 'Supervisor',
      priority: data.priority,
      plannedVisitDate: data.plannedVisitDate,
      dueDate: data.dueDate,
      status: 'assigned',
      scopeOfWork: data.scopeOfWork,
      equipmentIds: data.equipmentIds,
      equipmentFamily: data.equipmentFamily,
      voltageRating: data.voltageRating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workOrders.unshift(newWO);
    this.save('workOrders', this.workOrders);

    // Update complaint status
    complaint.status = 'work_order_created';
    complaint.assignedWorkOrderId = newWO.id;
    complaint.updatedAt = new Date().toISOString();
    this.save('complaints', this.complaints);

    // Notify Engineer
    this.addNotification({
      recipientId: data.assignedEngineerId,
      title: 'New Service Job Assigned',
      message: `Work Order ${woNum} assigned to you at ${newWO.siteName}. Due date: ${data.dueDate}`,
      type: 'warning',
      link: 'work-orders',
    });

    this.logAudit(actor, 'CREATE_WORK_ORDER', 'WorkOrder', newWO.id, `Created ${woNum} linked to ${complaint.referenceNumber}`);
    return newWO;
  }

  public engineerRespondToWorkOrder(workOrderId: string, action: 'accept' | 'decline', reason?: string, actor?: User): WorkOrder {
    const wo = this.workOrders.find(w => w.id === workOrderId);
    if (!wo) throw new Error('Work order not found');

    const before = wo.status;
    if (action === 'accept') {
      wo.status = 'accepted';
    } else {
      wo.status = 'declined';
      wo.declineReason = reason || 'No reason specified';
      // Notify supervisor
      this.addNotification({
        recipientId: wo.supervisorId,
        title: 'Work Order Declined by Engineer',
        message: `${wo.assignedEngineerName} declined ${wo.workOrderNumber}: ${wo.declineReason}`,
        type: 'alert',
        link: 'work-orders',
      });
    }
    wo.updatedAt = new Date().toISOString();
    this.save('workOrders', this.workOrders);

    if (actor) {
      this.logAudit(actor, action === 'accept' ? 'ACCEPT_WORK_ORDER' : 'DECLINE_WORK_ORDER', 'WorkOrder', wo.id, `Engineer responded with ${action}`, before, wo.status);
    }
    return wo;
  }

  public reassignWorkOrder(workOrderId: string, newEngineerId: string, reason: string, actor: User): WorkOrder {
    const wo = this.workOrders.find(w => w.id === workOrderId);
    if (!wo) throw new Error('Work order not found');

    const newEng = this.users.find(u => u.id === newEngineerId);
    if (!newEng) throw new Error('New engineer not found');

    const previousEng = wo.assignedEngineerName;
    wo.assignedEngineerId = newEngineerId;
    wo.assignedEngineerName = newEng.name;
    wo.reassignmentReason = reason;
    wo.status = 'assigned';
    wo.updatedAt = new Date().toISOString();
    this.save('workOrders', this.workOrders);

    this.addNotification({
      recipientId: newEngineerId,
      title: 'Reassigned Service Job',
      message: `Work Order ${wo.workOrderNumber} at ${wo.siteName} has been assigned to you.`,
      type: 'warning',
      link: 'work-orders',
    });

    this.logAudit(actor, 'REASSIGN_WORK_ORDER', 'WorkOrder', wo.id, `Reassigned from ${previousEng} to ${newEng.name}. Reason: ${reason}`);
    return wo;
  }

  // --- MANDATORY THREE-STAGE TIMER STATE MACHINE ---
  /**
   * Stage 1: Room/base to site (1. Start Travel, 2. End Travel)
   * Stage 2: On-site work (3. Start Work, 4. End Work)
   * Stage 3: Site to Room/base (5. Start Return Travel, 6. End Travel at Room/base)
   * Enforces exact sequential actions:
   * Action 1 -> Action 2 -> Action 3 -> Action 4 -> Action 5 -> Action 6.
   * Disallows skipping, duplicate, reversed, or overlapping events.
   * Engineer cannot self-approve.
   */
  public getTimeLogs(): SiteJobTimeLog[] {
    return [...this.timeLogs];
  }

  public getTimeLogByWorkOrder(workOrderId: string): SiteJobTimeLog | undefined {
    return this.timeLogs.find(t => t.workOrderId === workOrderId);
  }

  public getTimeLogById(id: string): SiteJobTimeLog | undefined {
    return this.timeLogs.find(t => t.id === id);
  }

  public recordTimerAction(
    workOrderId: string,
    action: TimerAction,
    actor: User,
    coords?: { latitude: number; longitude: number },
    notes?: string
  ): SiteJobTimeLog {
    const wo = this.workOrders.find(w => w.id === workOrderId);
    if (!wo) throw new Error('Work order not found');

    // Rule: Check for any conflicting active time logs for this engineer on OTHER work orders
    const activeOtherLog = this.timeLogs.find(
      t => t.engineerId === actor.id && t.workOrderId !== workOrderId && !t.isCompleted && t.currentStep > 0
    );
    if (activeOtherLog) {
      throw new Error(`Conflict: You already have an active timer in progress on another work order (${activeOtherLog.workOrderId}). You must complete or suspend it first.`);
    }

    let timeLog = this.timeLogs.find(t => t.workOrderId === workOrderId);
    if (!timeLog) {
      // Create new time log
      timeLog = {
        id: 'tl_' + Date.now(),
        workOrderId: wo.id,
        engineerId: actor.id,
        engineerName: actor.name,
        siteName: wo.siteName,
        currentStep: 0,
        isCompleted: false,
        events: [],
        outboundTravelMinutes: 0,
        onSiteWorkMinutes: 0,
        returnTravelMinutes: 0,
        totalDurationMinutes: 0,
        reviewStatus: 'pending',
        correctionHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.timeLogs.unshift(timeLog);
    }

    // Expected next step validation
    const expectedStepMap: Record<TimerAction, number> = {
      start_travel_to_site: 1,
      end_travel_at_site: 2,
      start_work: 3,
      end_work: 4,
      start_return_travel: 5,
      end_travel_at_room_base: 6,
    };

    const targetStep = expectedStepMap[action];
    if (targetStep !== timeLog.currentStep + 1) {
      throw new Error(
        `Invalid Action Sequence: Expected step ${timeLog.currentStep + 1}, but received ${action} (step ${targetStep}). Skipped or reversed events are strictly prohibited.`
      );
    }

    const now = new Date().toISOString();
    const newEvent: TimerEvent = {
      id: 'evt_' + Date.now(),
      jobId: timeLog.id,
      workOrderId: wo.id,
      engineerId: actor.id,
      action,
      stepNumber: targetStep as 1 | 2 | 3 | 4 | 5 | 6,
      serverTimestamp: now,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      notes,
    };

    timeLog.events.push(newEvent);
    timeLog.currentStep = targetStep;

    // Calculate durations
    if (targetStep === 2) {
      const e1 = timeLog.events.find(e => e.stepNumber === 1);
      if (e1) {
        const diff = Math.max(1, Math.round((new Date(now).getTime() - new Date(e1.serverTimestamp).getTime()) / 60000));
        timeLog.outboundTravelMinutes = diff;
      }
    } else if (targetStep === 4) {
      const e3 = timeLog.events.find(e => e.stepNumber === 3);
      if (e3) {
        const diff = Math.max(1, Math.round((new Date(now).getTime() - new Date(e3.serverTimestamp).getTime()) / 60000));
        timeLog.onSiteWorkMinutes = diff;
      }
    } else if (targetStep === 6) {
      const e5 = timeLog.events.find(e => e.stepNumber === 5);
      if (e5) {
        const diff = Math.max(1, Math.round((new Date(now).getTime() - new Date(e5.serverTimestamp).getTime()) / 60000));
        timeLog.returnTravelMinutes = diff;
      }
      timeLog.isCompleted = true;
      timeLog.totalDurationMinutes =
        timeLog.outboundTravelMinutes + timeLog.onSiteWorkMinutes + timeLog.returnTravelMinutes;
      
      // Notify supervisor that time log is complete and ready for review
      this.addNotification({
        recipientId: wo.supervisorId,
        title: 'Site Job Timer Completed',
        message: `${actor.name} completed all 3 segments for ${wo.workOrderNumber} (Total: ${timeLog.totalDurationMinutes} mins). Ready for review.`,
        type: 'info',
        link: 'supervisor-queue',
      });
    }

    // Update Work order status
    if (targetStep >= 1 && wo.status !== 'in_progress') {
      wo.status = 'in_progress';
      wo.updatedAt = now;
      this.save('workOrders', this.workOrders);
    }

    timeLog.updatedAt = now;
    this.save('timeLogs', this.timeLogs);

    this.logAudit(
      actor,
      'RECORD_TIMER_EVENT',
      'SiteJobTimeLog',
      timeLog.id,
      `Step ${targetStep} [${action}] recorded at ${now}`
    );

    return timeLog;
  }

  public supervisorReviewTimer(
    timeLogId: string,
    decision: 'approved' | 'returned_for_correction',
    comments: string,
    actor: User
  ): SiteJobTimeLog {
    const timeLog = this.timeLogs.find(t => t.id === timeLogId);
    if (!timeLog) throw new Error('Time log not found');

    // Rule: Engineers cannot self-approve their own logs
    if (timeLog.engineerId === actor.id) {
      throw new Error('Self-approval violation: Engineers are strictly prohibited from approving their own time logs.');
    }

    // Role check: Only supervisors/dispatchers or admins can review
    if (actor.role !== 'dispatcher_supervisor' && actor.role !== 'admin' && actor.role !== 'manager_auditor') {
      throw new Error('Permission denied: Only supervisors or managers can review time logs.');
    }

    const before = timeLog.reviewStatus;
    timeLog.reviewStatus = decision;
    timeLog.reviewedBy = actor.name;
    timeLog.reviewedAt = new Date().toISOString();
    timeLog.supervisorComments = comments;

    timeLog.correctionHistory.push({
      timestamp: new Date().toISOString(),
      action: decision,
      reason: comments,
      actor: actor.name,
    });

    timeLog.updatedAt = new Date().toISOString();
    this.save('timeLogs', this.timeLogs);

    // Notify engineer
    this.addNotification({
      recipientId: timeLog.engineerId,
      title: decision === 'approved' ? 'Time Log Approved' : 'Time Log Returned for Correction',
      message: `Supervisor ${actor.name} ${decision} your time log for ${timeLog.siteName}. Note: ${comments}`,
      type: decision === 'approved' ? 'success' : 'alert',
      link: 'my-jobs',
    });

    this.logAudit(actor, 'SUPERVISOR_REVIEW_TIMER', 'SiteJobTimeLog', timeLog.id, `Timer ${decision} with comments: ${comments}`, before, decision);
    return timeLog;
  }

  // --- SITE VISITS & MULTI-PANEL TECHNICAL INSPECTIONS ---
  public getVisitReports(): SiteVisitReport[] {
    return [...this.visitReports];
  }

  public getVisitReportById(id: string): SiteVisitReport | undefined {
    return this.visitReports.find(v => v.id === id);
  }

  public submitSiteVisitReport(
    reportData: Omit<SiteVisitReport, 'id' | 'visitReportNumber' | 'revisionNumber' | 'status' | 'createdAt' | 'updatedAt'>,
    actor: User
  ): SiteVisitReport {
    const wo = this.workOrders.find(w => w.id === reportData.workOrderId);
    if (!wo) throw new Error('Work order not found');

    // Rule: Energy state verification. If "Not Verified", must have justification!
    for (const panel of reportData.panels) {
      if (panel.energyState === 'Not Verified' && (!panel.energyStateReason || panel.energyStateReason.trim().length < 5)) {
        throw new Error(`Validation Error: Panel "${panel.panelIdentifier}" has energy state "Not Verified". An explicit engineering reason is required.`);
      }
      // Rule: Any Fail or Not Checked checklist item must have reason and corrective action
      for (const item of panel.checklistAnswers) {
        if ((item.outcome === 'Fail' || item.outcome === 'Not Checked') && (!item.reason || item.reason.trim().length < 3)) {
          throw new Error(`Validation Error: Checklist item "${item.itemText}" in panel "${panel.panelIdentifier}" marked as ${item.outcome} requires a mandatory explanation.`);
        }
      }
    }

    const year = new Date().getFullYear();
    const count = this.visitReports.length + 89;
    const reportNum = `SVR-${year}-${String(count).padStart(4, '0')}`;

    const newReport: SiteVisitReport = {
      ...reportData,
      id: 'svr_' + Date.now(),
      visitReportNumber: reportNum,
      revisionNumber: 1,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.visitReports.unshift(newReport);
    this.save('visitReports', this.visitReports);

    wo.status = 'visit_submitted';
    wo.updatedAt = new Date().toISOString();
    this.save('workOrders', this.workOrders);

    // If any panel has requiresNcr = true, auto-generate draft NCR for QCA
    for (const panel of reportData.panels) {
      if (panel.requiresNcr) {
        this.createNcrFromVisit(newReport, panel, actor);
      }
    }

    // Notify supervisor
    this.addNotification({
      recipientId: wo.supervisorId,
      title: 'Site Visit Report Submitted',
      message: `${actor.name} submitted inspection report ${reportNum} with ${reportData.panels.length} panel(s).`,
      type: 'info',
      link: 'supervisor-queue',
    });

    this.logAudit(actor, 'SUBMIT_VISIT_REPORT', 'SiteVisitReport', newReport.id, `Submitted report ${reportNum} (Rev 1) with ${reportData.panels.length} panels`);
    return newReport;
  }

  public supervisorReviewVisitReport(
    reportId: string,
    decision: 'supervisor_approved' | 'returned_for_correction',
    reviewNotes: string,
    actor: User
  ): SiteVisitReport {
    const report = this.visitReports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');

    if (report.engineerId === actor.id) {
      throw new Error('Self-approval violation: Engineers cannot approve their own visit reports.');
    }

    if (decision === 'supervisor_approved') {
      report.status = 'supervisor_approved';
      report.supervisorId = actor.id;
      report.supervisorReviewNotes = reviewNotes;
      report.supervisorReviewedAt = new Date().toISOString();
      report.updatedAt = new Date().toISOString();

      const wo = this.workOrders.find(w => w.id === report.workOrderId);
      if (wo) {
        wo.status = 'approved';
        wo.updatedAt = new Date().toISOString();
        this.save('workOrders', this.workOrders);
      }

      this.addNotification({
        recipientId: report.engineerId,
        title: 'Visit Report Approved',
        message: `Your visit report ${report.visitReportNumber} has been approved by ${actor.name}.`,
        type: 'success',
        link: 'my-jobs',
      });
    } else {
      // Returned for correction: Creates a new immutable revision concept
      report.status = 'returned_for_correction';
      report.supervisorReviewNotes = reviewNotes;
      report.updatedAt = new Date().toISOString();

      const wo = this.workOrders.find(w => w.id === report.workOrderId);
      if (wo) {
        wo.status = 'returned_for_correction';
        wo.updatedAt = new Date().toISOString();
        this.save('workOrders', this.workOrders);
      }

      this.addNotification({
        recipientId: report.engineerId,
        title: 'Visit Report Returned for Correction',
        message: `Supervisor ${actor.name} returned ${report.visitReportNumber} for revision: ${reviewNotes}`,
        type: 'alert',
        link: 'my-jobs',
      });
    }

    this.save('visitReports', this.visitReports);
    this.logAudit(actor, 'SUPERVISOR_REVIEW_VISIT', 'SiteVisitReport', report.id, `Report ${decision}: ${reviewNotes}`);
    return report;
  }

  // --- NCR MANAGEMENT ---
  public getNCRs(): NonConformanceReport[] {
    return [...this.ncrs];
  }

  public getNcrById(id: string): NonConformanceReport | undefined {
    return this.ncrs.find(n => n.id === id);
  }

  public createNcr(data: Omit<NonConformanceReport, 'id' | 'ncrNumber' | 'status'>, actor: User): NonConformanceReport {
    const year = new Date().getFullYear();
    const count = this.ncrs.length + 20;
    const ncrNum = `NCR-${year}-${String(count).padStart(4, '0')}`;

    const newNcr: NonConformanceReport = {
      ...data,
      id: 'ncr_' + Date.now(),
      ncrNumber: ncrNum,
      status: 'under_qca_review',
    };

    this.ncrs.unshift(newNcr);
    this.save('ncrs', this.ncrs);

    // Notify QCA team
    this.addNotification({
      recipientId: 'usr_qca_01',
      title: 'New NCR Filed for QCA Disposition',
      message: `${newNcr.ncrNumber} logged for ${newNcr.equipmentSerialNumber} (${newNcr.defectCategory})`,
      type: 'alert',
      link: 'ncr',
    });

    this.logAudit(actor, 'CREATE_NCR', 'NonConformanceReport', newNcr.id, `Created ${ncrNum} for serial ${newNcr.equipmentSerialNumber}`);
    return newNcr;
  }

  private createNcrFromVisit(report: SiteVisitReport, panel: PanelInspectionEntry, actor: User) {
    const year = new Date().getFullYear();
    const count = this.ncrs.length + 20;
    const ncrNum = `NCR-${year}-${String(count).padStart(4, '0')}`;

    const ncr: NonConformanceReport = {
      id: 'ncr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      ncrNumber: ncrNum,
      caseId: report.complaintId,
      workOrderId: report.workOrderId,
      visitReportId: report.id,
      equipmentFamily: panel.equipmentFamily,
      equipmentSerialNumber: panel.serialNumber,
      defectCategory: 'Component Malfunction',
      defectDescription: panel.ncrReason || panel.verifiedEngineeringFindings,
      reportedDate: new Date().toISOString().split('T')[0],
      reportedByEngineerId: actor.id,
      reportedByEngineerName: actor.name,
      disposition: 'Pending Decision',
      dispositionJustification: 'Awaiting QCA review of inspection findings and photos',
      rootCauseAnalysis: panel.rootCause || 'Investigating on-site findings',
      correctiveActionPlan: panel.solutionProvided || 'Pending QCA review',
      followUpOwner: 'QCA / Store',
      targetClosureDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'under_qca_review',
      photos: panel.photos || [],
    };

    this.ncrs.unshift(ncr);
    this.save('ncrs', this.ncrs);

    this.addNotification({
      recipientId: 'usr_qca_01',
      title: 'Automatic NCR Generated from Inspection',
      message: `${ncrNum} triggered for panel ${panel.serialNumber} during visit ${report.visitReportNumber}.`,
      type: 'alert',
      link: 'ncr',
    });
  }

  public qcaReviewNcr(
    ncrId: string,
    disposition: NonConformanceReport['disposition'],
    justification: string,
    actionPlan: string,
    actor: User
  ): NonConformanceReport {
    const ncr = this.ncrs.find(n => n.id === ncrId);
    if (!ncr) throw new Error('NCR not found');

    ncr.disposition = disposition;
    ncr.dispositionJustification = justification;
    ncr.correctiveActionPlan = actionPlan;
    ncr.qcaReviewerId = actor.id;
    ncr.qcaReviewerName = actor.name;
    ncr.qcaReviewedAt = new Date().toISOString();
    ncr.status = disposition === 'Scrap' || disposition === 'Return to Vendor / Factory' ? 'disposition_approved' : 'rectified';

    this.save('ncrs', this.ncrs);
    this.logAudit(actor, 'QCA_REVIEW_NCR', 'NonConformanceReport', ncr.id, `QCA Disposition: ${disposition}. Justification: ${justification}`);
    return ncr;
  }

  // --- SPARE PARTS & STOCK TRANSACTIONS ---
  public getParts(): SparePart[] {
    return [...this.parts];
  }

  public getStockTransactions(): StockTransaction[] {
    return [...this.stockTransactions];
  }

  public executeStockTransaction(
    trans: Omit<StockTransaction, 'id' | 'transactionNumber' | 'timestamp' | 'performedBy'>,
    actor: User
  ): StockTransaction {
    const part = this.parts.find(p => p.id === trans.partId);
    if (!part) throw new Error('Part not found');

    // Rule: Database transactions to prevent double issues and negative stock
    if (trans.type === 'ISSUE_TO_JOB') {
      if (part.stockQuantity < trans.quantity) {
        throw new Error(`Insufficient Stock: Cannot issue ${trans.quantity} units of ${part.partNumber}. Current available: ${part.stockQuantity}`);
      }
      part.stockQuantity -= trans.quantity;
    } else if (trans.type === 'RECEIPT' || trans.type === 'RETURN_FROM_JOB') {
      part.stockQuantity += trans.quantity;
    } else if (trans.type === 'FACTORY_RETURN' || trans.type === 'SCRAP_DISPOSAL') {
      if (part.stockQuantity < trans.quantity) {
        throw new Error(`Insufficient stock to perform ${trans.type}. Available: ${part.stockQuantity}`);
      }
      part.stockQuantity -= trans.quantity;
    }

    const year = new Date().getFullYear();
    const count = this.stockTransactions.length + 312;
    const stxNum = `STX-${year}-${String(count).padStart(4, '0')}`;

    const newTrans: StockTransaction = {
      ...trans,
      id: 'stx_' + Date.now(),
      transactionNumber: stxNum,
      timestamp: new Date().toISOString(),
      performedBy: actor.name,
    };

    this.stockTransactions.unshift(newTrans);
    this.save('parts', this.parts);
    this.save('stockTransactions', this.stockTransactions);

    this.logAudit(actor, 'EXECUTE_STOCK_TX', 'StockTransaction', newTrans.id, `${trans.type} ${trans.quantity} x ${part.partNumber}`);
    return newTrans;
  }

  // --- CUSTOMER CLOSURE ---
  /**
   * Rule: Prevent closure while blocking NCR, material or follow-up actions remain unresolved!
   */
  public getCustomerClosures(): CustomerClosureRecord[] {
    return [...this.customerClosures];
  }

  public closeServiceCase(
    data: {
      caseId: string;
      workOrderId: string;
      customerRepresentative: string;
      serviceOutcome: CustomerClosureRecord['serviceOutcome'];
      unresolvedLimitations: string;
      customerFeedbackScore?: number;
      authorizedExceptionOverride?: boolean;
      exceptionJustification?: string;
    },
    actor: User
  ): CustomerClosureRecord {
    const complaint = this.complaints.find(c => c.id === data.caseId);
    if (!complaint) throw new Error('Case not found');

    const wo = this.workOrders.find(w => w.id === data.workOrderId);
    if (!wo) throw new Error('Work order not found');

    // Check for open blocking NCRs
    const openNcrs = this.ncrs.filter(n => n.caseId === data.caseId && n.status !== 'closed' && n.status !== 'rectified');
    if (openNcrs.length > 0 && !data.authorizedExceptionOverride) {
      throw new Error(`Closure Blocked: There is 1 or more unresolved NCR (${openNcrs.map(n => n.ncrNumber).join(', ')}) linked to this case. Resolve the NCR or supply an authorized executive exception override.`);
    }

    const year = new Date().getFullYear();
    const count = this.customerClosures.length + 51;
    const closureNum = `CLS-${year}-${String(count).padStart(4, '0')}`;

    const closure: CustomerClosureRecord = {
      id: 'cls_' + Date.now(),
      caseId: data.caseId,
      workOrderId: data.workOrderId,
      closureNumber: closureNum,
      customerName: complaint.customerName,
      customerRepresentative: data.customerRepresentative,
      signedOffDate: new Date().toISOString(),
      serviceOutcome: data.serviceOutcome,
      unresolvedLimitations: data.unresolvedLimitations,
      supervisorApprover: actor.name,
      supervisorSignOffDate: new Date().toISOString(),
      customerFeedbackScore: data.customerFeedbackScore,
      closureStatus: 'Fully Closed',
    };

    this.customerClosures.unshift(closure);
    this.save('customerClosures', this.customerClosures);

    // Update complaint & work order
    complaint.status = 'closed';
    complaint.updatedAt = new Date().toISOString();
    this.save('complaints', this.complaints);

    wo.status = 'closed';
    wo.updatedAt = new Date().toISOString();
    this.save('workOrders', this.workOrders);

    this.logAudit(actor, 'CLOSE_SERVICE_CASE', 'CustomerClosureRecord', closure.id, `Case ${complaint.referenceNumber} permanently closed (${data.serviceOutcome})`);
    return closure;
  }

  // --- SPECIALIST MODULE ACCESSORS ---
  public getEquipment(): EquipmentMaster[] {
    return [...this.equipment];
  }

  public getEquipmentById(id: string): EquipmentMaster | undefined {
    return this.equipment.find(e => e.id === id);
  }

  public getEquipmentBySerial(serial: string): EquipmentMaster | undefined {
    return this.equipment.find(e => e.serialNumber.toLowerCase() === serial.toLowerCase());
  }

  public getRemoteCases(): RemoteSupportCase[] {
    return [...this.remoteCases];
  }

  public createRemoteCase(data: Omit<RemoteSupportCase, 'id' | 'ticketNumber' | 'createdAt'>, actor: User): RemoteSupportCase {
    const year = new Date().getFullYear();
    const num = `RST-${year}-${String(this.remoteCases.length + 13).padStart(4, '0')}`;
    const newCase: RemoteSupportCase = {
      ...data,
      id: 'rst_' + Date.now(),
      ticketNumber: num,
      createdAt: new Date().toISOString(),
    };
    this.remoteCases.unshift(newCase);
    this.save('remoteCases', this.remoteCases);
    this.logAudit(actor, 'CREATE_REMOTE_CASE', 'RemoteSupportCase', newCase.id, `Logged remote support case ${num}`);
    return newCase;
  }

  public getShutdowns(): ShutdownRecord[] {
    return [...this.shutdowns];
  }

  public createShutdown(data: Omit<ShutdownRecord, 'id' | 'requestNumber'>, actor: User): ShutdownRecord {
    const year = new Date().getFullYear();
    const num = `SHT-${year}-${String(this.shutdowns.length + 9).padStart(4, '0')}`;
    const newRec: ShutdownRecord = {
      ...data,
      id: 'sht_' + Date.now(),
      requestNumber: num,
    };
    this.shutdowns.unshift(newRec);
    this.save('shutdowns', this.shutdowns);
    this.logAudit(actor, 'CREATE_SHUTDOWN', 'ShutdownRecord', newRec.id, `Created shutdown request ${num}`);
    return newRec;
  }

  public getCommissioning(): CommissioningRecord[] {
    return [...this.commissioning];
  }

  public createCommissioning(data: Omit<CommissioningRecord, 'id' | 'commissioningNumber'>, actor: User): CommissioningRecord {
    const year = new Date().getFullYear();
    const num = `COM-${year}-${String(this.commissioning.length + 15).padStart(4, '0')}`;
    const newRec: CommissioningRecord = {
      ...data,
      id: 'com_' + Date.now(),
      commissioningNumber: num,
    };
    this.commissioning.unshift(newRec);
    this.save('commissioning', this.commissioning);
    this.logAudit(actor, 'CREATE_COMMISSIONING', 'CommissioningRecord', newRec.id, `Created commissioning record ${num}`);
    return newRec;
  }

  public getMaintenancePlans(): PreventiveMaintenancePlan[] {
    return [...this.maintenancePlans];
  }

  public getTrainings(): TrainingRecord[] {
    return [...this.trainings];
  }

  public createTraining(data: Omit<TrainingRecord, 'id' | 'trainingCode'>, actor: User): TrainingRecord {
    const year = new Date().getFullYear();
    const num = `TRN-${year}-${String(this.trainings.length + 6).padStart(4, '0')}`;
    const newRec: TrainingRecord = {
      ...data,
      id: 'trn_' + Date.now(),
      trainingCode: num,
    };
    this.trainings.unshift(newRec);
    this.save('trainings', this.trainings);
    this.logAudit(actor, 'CREATE_TRAINING', 'TrainingRecord', newRec.id, `Recorded training event ${num}`);
    return newRec;
  }

  public getAuditEvents(): AuditEvent[] {
    return [...this.auditEvents];
  }

  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.notifications.filter(n => n.recipientId === userId);
    }
    return [...this.notifications];
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.save('notifications', this.notifications);
    }
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      read: false,
    };
    this.notifications.unshift(newNotif);
    this.save('notifications', this.notifications);
  }

  // Reset database back to seed (for evaluation / testing)
  public resetToSeed() {
    localStorage.clear();
    this.init();
  }
}

export const db = new DatabaseService();
