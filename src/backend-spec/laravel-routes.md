# Digital MV Customer Service Management System
## Laravel REST API & PostgreSQL Architecture Specification
**Client**: Alfanar Electrical Systems — MV Customer Service  
**Developed by**: Kanpri Technologies LLP  
**Document Version**: 1.0 (Aligned with Client Digital MV v4 Directives)

---

### 1. Architectural Boundary Overview
The application in this environment provides a complete, working TypeScript service & relational storage layer (`src/services/db.ts` & `src/types/index.ts`) matching the exact database schemas, transactional integrity checks, state machines, and RBAC policies defined for Alfanar MV Customer Service.

For the production Linux containerized deployment, the Laravel 11.x modular monolith REST API layer executes the endpoints below against a PostgreSQL 16+ relational database.

---

### 2. Core Laravel REST Endpoints

#### Module 02: Complaints Intake
- `POST /api/v1/public/complaints`
  - **Middleware**: `throttle:10,1` (Rate limit: 10 requests per minute to prevent intake spam)
  - **FormRequest**: `StorePublicComplaintRequest`
  - **Payload**: `customer_name`, `company`, `contact_email`, `contact_mobile`, `site_name`, `site_address`, `city`, `region`, `equipment_family`, `panel_serial_number`, `category`, `description`, `consent_acknowledged`
  - **Response**: `201 Created` with `{ "reference_number": "CMP-2026-XXXX", "status": "unverified" }`
  - **Security Rule**: Does NOT return or expose existing private case records or internal staff details.

- `POST /api/v1/complaints/{id}/triage`
  - **Middleware**: `auth:sanctum`, `role:dispatcher_supervisor|admin`
  - **Action**: Accept, request clarification, or mark duplicate. Auto-logs to `audit_events`.

#### Module 03: Work Orders & Assignments
- `POST /api/v1/work-orders`
  - **Middleware**: `auth:sanctum`, `role:dispatcher_supervisor|admin`
  - **Payload**: `complaint_id`, `assigned_engineer_id`, `supervisor_id`, `priority`, `planned_visit_date`, `due_date`, `scope_of_work`, `equipment_family`, `voltage_rating`
  - **Validation**: Enforces valid foreign keys to users and complaints. Dispatches notification event to Redis queue.

- `POST /api/v1/work-orders/{id}/respond`
  - **Middleware**: `auth:sanctum`, `role:field_engineer`
  - **Payload**: `action: "accept"|"decline"`, `reason` (mandatory if declined)

- `POST /api/v1/work-orders/{id}/reassign`
  - **Middleware**: `auth:sanctum`, `role:dispatcher_supervisor|admin`
  - **Payload**: `new_engineer_id`, `reassignment_reason` (mandatory for audit)

#### CRITICAL MODULE: Field Work 3-Stage Timer
- `POST /api/v1/timer/actions`
  - **Middleware**: `auth:sanctum`, `role:field_engineer`
  - **Payload**: `work_order_id`, `action: TimerAction`, `latitude`, `longitude`, `notes`
  - **Server-Side Validation Rules**:
    1. Rejects skipped, duplicated, or reversed actions.
    2. Enforces sequential steps 1 → 2 → 3 → 4 → 5 → 6.
    3. Prevents two overlapping or conflicting active timers for the same authenticated engineer ID.
    4. Records trusted server timestamp (`now()`), ignoring untrusted client time clock adjustments.
    5. Calculates `outbound_travel_minutes`, `on_site_work_minutes`, `return_travel_minutes`.

- `POST /api/v1/timer/{id}/supervisor-review`
  - **Middleware**: `auth:sanctum`, `role:dispatcher_supervisor|admin|manager_auditor`
  - **Rule**: Self-approval strictly forbidden (`engineer_id != auth()->id()`).
  - **Payload**: `decision: "approved"|"returned_for_correction"`, `supervisor_comments` (mandatory if returned).

#### Module 04 & 05: Multi-Panel Site Visits & Checklists
- `POST /api/v1/site-visits`
  - **Payload**: `work_order_id`, `panels[]`, `gps_coordinates`, `time_log_id`
  - **Validation**:
    - Energy state: "Energized" | "De-energized" | "Not Verified" (requires `energy_state_reason`).
    - Checklist items: "Pass" | "Fail" | "Not Checked" | "Not Applicable" (`reason` and `corrective_action` mandatory if Fail or Not Checked).
    - Immutable revision: If a previously submitted report is returned, saving creates `revision_number = current + 1`, preserving historical revisions.

#### Module 07: NCR Management
- `POST /api/v1/ncrs/{id}/qca-disposition`
  - **Middleware**: `auth:sanctum`, `role:qca_store|admin`
  - **Rule**: Independent quality sign-off; not auto-approved by supervisor visit approval.
  - **Payload**: `disposition: "Rework"|"Scrap"|"Use-As-Is"|"Return to Vendor / Factory"`, `disposition_justification`, `corrective_action_plan`

#### Module 08: Stock Transactions & Materials
- `POST /api/v1/materials/transactions`
  - **Middleware**: `auth:sanctum`, `role:qca_store|admin`
  - **Database Transaction (`DB::transaction`)**:
    - Checks `stock_quantity >= requested_quantity` for `ISSUE_TO_JOB`.
    - Updates stock ledger balance.
    - Prevents negative inventory or race conditions with `SELECT ... FOR UPDATE`.

#### Module 13: Customer Closure
- `POST /api/v1/cases/{id}/close`
  - **Middleware**: `auth:sanctum`, `role:dispatcher_supervisor|manager_auditor|admin`
  - **Validation**: Queries `SELECT count(*) FROM ncrs WHERE case_id = ? AND status NOT IN ('closed', 'rectified')`.
    - If count > 0 and `authorized_exception_override == false`, rejects closure with `422 Unprocessable Entity`.

---

### 3. PostgreSQL Database Schema (Summary)
Tables defined with primary UUID/BigInt keys, foreign key constraints, and performance indexes:
- `users`, `roles`, `permissions`, `role_user`
- `complaints`, `work_orders`, `site_job_time_logs`, `timer_events`
- `site_visit_reports`, `visit_panels`, `inspection_checklist_answers`
- `equipment_masters`, `equipment_history`
- `non_conformance_reports`, `spare_parts`, `stock_transactions`
- `remote_support_cases`, `shutdown_records`, `commissioning_records`
- `preventive_maintenance_plans`, `customer_closures`, `training_records`
- `audit_events`, `notifications`
