# Digital MV Customer Service Management System
## Comprehensive User & Operations Manual (v1.0)
**Client**: Alfanar Electrical Systems — MV Customer Service  
**Developer**: Kanpri Technologies LLP  
**Publication Date**: October 2026  
**Document Classification**: Confidential / Operating Procedure (SOP)

---

## Table of Contents
1. [Introduction & System Scope](#1-introduction--system-scope)
2. [User Roles & Security Credentials](#2-user-roles--security-credentials)
3. [Step-by-Step Workflow Guide](#3-step-by-step-workflow-guide)
   - [Phase 1: Public Complaint Intake](#phase-1-public-complaint-intake)
   - [Phase 2: Dispatcher Triage & Work Order Generation](#phase-2-dispatcher-triage--work-order-generation)
   - [Phase 3: Engineer Job Acceptance & Travel](#phase-3-engineer-job-acceptance--travel)
   - [Phase 4: Operating the Mandatory 3-Stage Timer](#phase-4-operating-the-mandatory-3-stage-timer)
   - [Phase 5: Completing the 8-Step Site Visit Report Wizard](#phase-5-completing-the-8-step-site-visit-report-wizard)
   - [Phase 6: Multi-Panel Technical Inspections & Energy States](#phase-6-multi-panel-technical-inspections--energy-states)
   - [Phase 7: Supervisor Review Queue & Revisions](#phase-7-supervisor-review-queue--revisions)
   - [Phase 8: Non-Conformance Reports (NCR) & QCA Dispositions](#phase-8-non-conformance-reports-ncr--qca-dispositions)
   - [Phase 9: Materials Management & Stock Movements](#phase-9-materials-management--stock-movements)
   - [Phase 10: Specialist Modules](#phase-10-specialist-modules)
   - [Phase 11: Final Customer Closure Sign-Off](#phase-11-final-customer-closure-sign-off)
   - [Phase 12: Generating Exact Legacy 25-Col & 16-Col Reports](#phase-12-generating-exact-legacy-25-col--16-col-reports)
4. [Critical Business Rules & Safety Non-Negotiables](#4-critical-business-rules--safety-non-negotiables)
5. [Troubleshooting & Frequently Asked Questions](#5-troubleshooting--frequently-asked-questions)

---

## 1. Introduction & System Scope

The **Digital MV Customer Service Management System** is a purpose-built enterprise platform engineered specifically for **Alfanar Electrical Systems — MV Customer Service** by **Kanpri Technologies LLP**.

It unifies the full operational lifecycle of medium-voltage (MV) distribution equipment (13.8 kV and 33 kV):
- **Ring Main Units (RMU, MRMU, SRMU)**
- **Auto-Reclosers (ACR)**
- **Load Break Switches (LBS, SLBS)**
- **Authorized Other MV Switchgear**

The system bridges public customer complaints, rapid emergency dispatch, mobile field execution, immutable time attendance tracking, quality assurance, inventory controls, and auditable management oversight into a single traceable ledger.

---

## 2. User Roles & Security Credentials

The platform enforces strict server-side **Role-Based Access Control (RBAC)** across 6 distinct personas:

| Role Name | Typical Title | Primary Capabilities & Responsibilities |
|---|---|---|
| **1. Public Reporter** | Customer / Utility Contractor | Submits new breakdown complaints anonymously via `/report-complaint`. Receives an official tracking reference (`CMP-YYYY-XXXX`). Strictly prohibited from accessing internal records or other client tickets. |
| **2. Field Engineer** | MV Field Service Engineer | Accesses assigned work orders, accepts/declines jobs, operates the 3-stage field timer, records multi-panel inspection checklists, uploads photographic evidence, captures GPS on-tap, and submits draft visit reports. |
| **3. Dispatcher / Supervisor** | Operations Dispatcher / Lead Engineer | Triages incoming complaints, checks duplicate tickets, creates work orders, reassigns engineers with audit trails, audits timesheets, reviews visit reports, and issues approvals or revision returns. |
| **4. QCA / Store** | Quality Assurance / Storekeeper | Reviews Non-Conformance Reports (NCR), issues formal quality dispositions (Rework, Scrap, Factory Return), executes stock movements (receipts, job issues), and maintains parts custody. |
| **5. Manager / Auditor** | Division Head / External Auditor | Full read-only visibility into management KPI dashboards, equipment lifecycle histories, SLA performance, and immutable audit trails. Authorized to grant executive closure overrides. |
| **6. Administrator** | IT Ops / Kanpri Tech Admin | Manages user accounts, configures reference catalogues (equipment models, parts SKUs), configures system endpoints, and inspects security audit logs. |

> **Pro-Tip (Role Switching)**: In the application preview environment, click the **User Profile** dropdown in the top-right corner of the top navigation bar to instantaneously switch between any of these 6 roles to test permissions across all screens.

---

## 3. Step-by-Step Workflow Guide

### Phase 1: Public Complaint Intake
1. Access the public portal URL: `/report-complaint` (or click **Public Intake** in the top bar).
2. Enter your contact details: Full Name, Company/Utility (e.g., *Saudi Electricity Company*, *NEOM*, *Red Sea Global*), Email, and Mobile Number.
3. Select the Substation/Site Name, City, and Region (Central, Western, Eastern, Southern, Northern).
4. Select the Equipment Family (RMU, Auto-Recloser, LBS, etc.) and enter the panel serial number if visible on the nameplate.
5. Choose the fault category (e.g., *Trip during operation*, *SF6 gas pressure alarm*, *Mechanical interlock stuck*, *Relay trip*).
6. Provide a detailed description of the symptoms, trip alarms, or operating circumstances.
7. Tick the mandatory **Consent & Data Processing Acknowledgement**.
8. Click **Register Complaint & Get Reference**.
9. **Outcome**: The system immediately generates an official tracking reference (e.g., `CMP-2026-0045`) and displays a confirmation screen. To preserve client privacy, no internal service records or staff rosters are exposed to the public user.

---

### Phase 2: Dispatcher Triage & Work Order Generation
1. Log in with a **Dispatcher / Supervisor** account.
2. From the left sidebar, navigate to **02 Complaints / Intake**.
3. Unverified complaints will appear at the top of the table highlighted in amber.
4. Click **Triage** next to any ticket:
   - Review the customer's problem statement.
   - Set the triage action: *Accept Case for Action*, *Request Clarification*, or *Mark Duplicate*.
   - Classify the operational priority: **Critical** (2h response), **High** (24h resolution), **Medium**, or **Low**.
   - Save the triage decision.
5. Click **Create WO** to launch the Work Order creation modal:
   - Assign the lead Field Engineer from the dropdown roster.
   - Select the supervising engineer.
   - Confirm planned visit date and SLA resolution due date.
   - Review the normalized equipment family and voltage rating (13.8 kV vs 33 kV).
   - Enter detailed job instructions and safety cautions in the **Scope of Work**.
   - Click **Generate Work Order & Notify Engineer**.
6. **Outcome**: A unique work order ID is generated (`WO-2026-XXXX`), linked to the complaint, and routed to the engineer's queue.

---

### Phase 3: Engineer Job Acceptance & Travel
1. Log in as a **Field Engineer** (e.g., *Tariq Mansoor*).
2. Navigate to **03 Work Orders**.
3. Newly assigned jobs will display with status `assigned`.
4. Review the site location, priority, and instructions:
   - Click **Accept** to commit to the assignment. Status changes to `accepted`.
   - If unable to attend (e.g., schedule conflict or lacking special tooling), click **Decline**. The system mandates entering an explicit justification reason, which triggers an alert to the supervisor.

---

### Phase 4: Operating the Mandatory 3-Stage Timer
*The Digital MV system enforces a non-negotiable field work time tracking protocol.*

#### The 3 Stages and 6 Sequential Actions:
- **STAGE 1 — Base to Site**:
  - `Action 1: Start Travel to Site` (tap upon departing room/base).
  - `Action 2: End Travel at Site` (tap upon arrival at site gate).
- **STAGE 2 — On-Site Work**:
  - `Action 3: Start Work` (tap after signing site work permit with client).
  - `Action 4: End Work` (tap when technical work on equipment is completed).
- **STAGE 3 — Site to Base**:
  - `Action 5: Start Return Travel` (tap upon leaving the site).
  - `Action 6: End Travel at Room/Base` (tap upon arriving back at base/depot).

#### Rules Enforced by the System:
1. **Single Next Action Button**: Only the next valid action button is clickable. You cannot skip, duplicate, or reverse events (e.g., you cannot start work without ending travel).
2. **Server Timestamps**: Timestamps are recorded by the backend server; adjusting local device clock has no effect.
3. **No Overlapping Jobs**: An engineer cannot have two concurrent active timers across different work orders.
4. **GPS on Tap**: Tap the **Capture GPS on Tap** button at any stage to record exact coordinates with browser permission. Continuous tracking is strictly disabled to respect employee privacy.
5. **No Extra Categories**: The system does not support break, lunch, waiting, or sick leave buttons in the field timer. Those belong to standard HR systems.

---

### Phase 5: Completing the 8-Step Site Visit Report Wizard
From the sidebar, select **04 Visit Report Wizard** (or click **Complete Visit Report Wizard** from the timer screen):

1. **Step 1: Job Header**: Select active Work Order, enter customer contact person, phone number, and access restrictions.
2. **Step 2: Time Log Link**: Verifies connection to the active 3-stage time log for this attendance.
3. **Step 3: Multi-Panel Identity**:
   - One site attendance can cover multiple panels.
   - Enter panel name (e.g., *Panel 1 — Incoming Feeder*), select Family (*RMU, Auto-Recloser, LBS, etc.*), Voltage (*13.8 kV or 33 kV*), Serial Number, Model, and RTU type.
   - To inspect multiple panels during the same visit, click **+ Add Another Panel**.
4. **Step 4: Observed Energy State & Safety Mandate**:
   - Mark observed state: **Energized**, **De-energized**, or **Not Verified**.
   - *Mandatory Exception*: If marked **Not Verified**, you MUST enter a detailed engineering justification reason.
5. **Step 5: Technical Checklists**:
   - For each inspection item, select: **Pass**, **Fail**, **Not Checked**, or **Not Applicable**.
   - *Mandatory Validation*: Any item marked **Fail** or **Not Checked** requires an explicit explanation and corrective action plan.
6. **Step 6: Findings & Root Cause**:
   - Keep customer allegations strictly separate from verified engineering truth.
   - Document root cause classification and solution executed.
   - If a manufacturing defect or damaged component is found, tick **Flag Non-Conformance Report (NCR)**.
7. **Step 7: Spare Parts & Evidence**:
   - Add replacement component lines (part numbers, serials, warranty flag).
   - Review captured GPS coordinates.
8. **Step 8: Review & Submit**:
   - Review overall summary, acknowledge the engineer declaration, and click **Submit Technical Report to Supervisor**.

---

### Phase 6: Supervisor Review Queue & Revisions
1. Log in as a **Dispatcher / Supervisor** or **Manager**.
2. Navigate to **Supervisor Review Queue** from the left menu.
3. **Timesheets Tab**:
   - Audit completed 3-stage time logs (outbound travel, on-site work, return travel, total hours).
   - Click **Approve Timesheet** or **Return for Correction** (mandatory comments required).
   - *Rule*: Engineers are blocked from approving their own time logs.
4. **Technical Visit Reports Tab**:
   - Inspect multi-panel findings, energy states, and photos.
   - Click **Approve Technical Report** to lock the report.
   - If corrections are needed, click **Return for Revision**. This creates an immutable **Revision 2 (Rev 2)** rather than overwriting historical submissions.

---

### Phase 7: Non-Conformance Reports (NCR) & QCA Dispositions
1. Navigate to **07 NCR Management**.
2. NCRs flagged during visits or directly reported appear in status `under_qca_review`.
3. An authorized **QCA / Store** staff member audits the defect description, photos, and root cause.
4. Select the formal **Quality Disposition**:
   - **Rework**: Rectification on-site by Alfanar engineer.
   - **Return to Vendor / Factory**: Component uninstalled and transferred back to Alfanar factory for metallurgical/batch analysis.
   - **Scrap**: Decommission and safely scrap defective component.
   - **Use-As-Is**: Concession engineering approval.
5. Enter technical justification and sign off.
6. *Rule*: NCR approval is independent of supervisor visit report approval.

---

### Phase 8: Materials Management & Stock Movements
1. Navigate to **08 Materials & Inventory**.
2. **Spare Parts Catalog**: Displays real-time stock balances across Riyadh, Jeddah, and Dammam warehouses, with reserved quantities and unit costs in SAR.
3. Click **Movement** to record a transaction:
   - **Issue to Work Order**: Debits available stock against an active WO. *Validation prevents double issues or negative stock.*
   - **Warehouse Inward Receipt**: Credits new parts received from manufacturing.
   - **Return from Site**: Returns unused parts back into inventory.
   - **Factory Return (Custody)**: Logs parts sent back to the factory for warranty recall.
4. Switch to **Auditable Movement Ledger** to inspect every historical debit/credit with user timestamps.

---

### Phase 9: Specialist Modules
- **09 Remote Technical Support**: Log phone, video, or SCADA telemetry assistance sessions before dispatching vehicles.
- **10 Shutdown Planning**: Schedule outages and log external safety permit references (e.g., `SEC-PERMIT-CR-2026-9912`). *Note: Alfanar engineers record references only and do not perform unauthorized grid switching.*
- **11 Commissioning Records**: Enter high-voltage proof tests: Insulation Resistance (MΩ), Contact Resistance (µΩ), Breaker Timing (ms), and SF6 Gas Pressure (bar).
- **12 Preventive Maintenance**: Track periodic maintenance intervals (6 months, 12 months) and identify *Upcoming*, *Due Soon*, or *Overdue* switchgear bays.
- **14 Training Records**: Record client training workshops on Alfanar MV switchgear, log attendees, and issue course completion certificate references.
- **15 Photo Evidence**: View and upload private, categorized technical photographs (SF6 gauges, nameplates, thermal inspection, mechanism seals).
- **16 GPS & Site Map**: Review Kingdom-wide substation markers and export standard KML/KMZ files for GIS systems.

---

### Phase 10: Final Customer Closure Sign-Off
1. Navigate to **13 Customer Closure**.
2. Select the completed case from the dropdown.
3. **The Blocking NCR Gate**:
   - If any linked NCR remains open or unrectified, the system **blocks final closure**.
   - To proceed in urgent operational emergencies, an authorized supervisor must tick **Apply Documented Authorized Exception Override** and supply a written justification.
4. Enter customer representative sign-off name, outcome (*Permanent Fix Verified, Temporary Bypass, etc.*), and customer feedback score (1 to 5 stars).
5. Click **Approve & Finalize Customer Case Closure**.

---

### Phase 11: Generating Exact Legacy 25-Col & 16-Col Reports
1. Navigate to **17 Reports & 25-Col**.
2. Select desired report:
   - **25-Column Field Engineering Site Visit Report**: Download CSV/Excel with exact contract headers (Visit #, Rev #, Date, WO ID, Customer, Site, Engineer, Outbound, On-Site, Return, Total Hours, Panel ID, Family, Voltage, S/N, RTU, Energy State, Allegation, Findings, Root Cause, Action, NCR, Status).
   - **16-Column NCR Register**: Download CSV/Excel covering NCR #, Reported Date, Case Ref, WO, Family, Serial, Defect Category, Description, Reporting Engineer, QCA Reviewer, Review Date, Disposition, Justification, Plan, Target Date, Status.
   - **Field Timesheet Ledger**: Export 3-stage durations breakdown for payroll and audit.
3. Click **Print PDF Layout** to trigger clean, formatted browser print stylesheets with official Alfanar branding.

---

## 4. Critical Business Rules & Safety Non-Negotiables

| Rule | System Behavior | Rationale |
|---|---|---|
| **Exact 3-Stage Timer** | Strict 6-action sequence. Only next valid button shown. | Prevents inaccurate or fabricated field attendance times. |
| **No Engineer Self-Approval** | Engineers cannot approve their own timesheets, visits, or closures. | Preserves four-eyes quality control and audit separation. |
| **Immutable Revisions** | Returned reports generate Rev 2+, leaving Rev 1 intact. | Auditable compliance for legal and utility liability. |
| **Energy State "Not Verified"** | Mandates justification reason and triggers supervisor flag. | High-voltage safety: engineers must inspect busbars under known electrical states. |
| **No Switching Permits Claim** | Disclaimer displayed in UI and report footers. | Alfanar provides maintenance; utility switching authorities issue legal LOTO permits. |
| **Blocking NCR Closure** | Prevents case closure if open defect lines exist. | Eliminates silent defect abandonment before customer hand-off. |
| **No Continuous GPS Tracking** | Location captured only on tap with user consent. | Complies with privacy laws while providing proof of site attendance. |

---

## 5. Troubleshooting & Frequently Asked Questions

#### Q1: Why can't I see the "End Travel at Site" button?
> **Answer**: You must first tap **Action 1: Start Travel to Site**. The system displays only the single next valid action to prevent skipped steps.

#### Q2: Can one site visit cover multiple panels?
> **Answer**: Yes. When using the **Site Visit Wizard**, tap **+ Add Another Panel** on Step 3. All panels inspected during that attendance will share the same travel time log without duplicating billing hours.

#### Q3: Why is the "Approve & Finalize Customer Case Closure" button disabled?
> **Answer**: Check if there are open Non-Conformance Reports (NCR) linked to this equipment. Resolve the NCR via QCA Disposition, or have an authorized supervisor apply the documented executive exception override.

#### Q4: How do I test the application with different staff permissions?
> **Answer**: Click the role profile switcher in the top navigation bar and select *Field Engineer*, *Dispatcher*, *QCA / Store*, *Manager*, or *Public Reporter*. The entire UI and action buttons adapt dynamically according to RBAC rules.

---
*Digital MV Customer Service Management System — Document ref: ALF-DMV-MANUAL-v1.0*  
*Developed by Kanpri Technologies LLP for Alfanar Electrical Systems*
