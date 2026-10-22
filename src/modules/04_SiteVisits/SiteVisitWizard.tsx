/**
 * Digital MV Customer Service Management System
 * MODULE 04 & 05: Guided Site Visit & Multi-Panel Inspection Wizard
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { db } from '../../services/db';
import { 
  WorkOrder, 
  PanelInspectionEntry, 
  ChecklistItemAnswer, 
  EnergyState,
  InspectionOutcome,
  SiteVisitReport
} from '../../types';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Camera, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Timer,
  Check,
  Send
} from 'lucide-react';

interface Props {
  initialWorkOrderId?: string;
  onSubmitted?: (reportId: string) => void;
}

export const SiteVisitWizard: React.FC<Props> = ({ initialWorkOrderId, onSubmitted }) => {
  const { currentUser } = useAuth();
  const workOrders = db.getWorkOrders();
  const equipmentCatalog = db.getEquipment();
  const timeLogs = db.getTimeLogs();

  const [step, setStep] = useState<number>(1);
  const [selectedWoId, setSelectedWoId] = useState<string>(() => {
    if (initialWorkOrderId) return initialWorkOrderId;
    const active = workOrders.find(w => w.status === 'in_progress' || w.status === 'accepted' || w.status === 'assigned');
    return active ? active.id : workOrders[0]?.id || '';
  });

  const selectedWo = workOrders.find(w => w.id === selectedWoId);
  const linkedTimeLog = timeLogs.find(t => t.workOrderId === selectedWoId);

  // Form states
  const [customerContact, setCustomerContact] = useState(selectedWo?.customerName || '');
  const [contactPhone, setContactPhone] = useState('+966 50 111 2233');
  const [accessNotes, setAccessNotes] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Multi-panel repeatable list
  const [panels, setPanels] = useState<PanelInspectionEntry[]>([
    {
      id: 'pnl_' + Date.now(),
      panelIdentifier: 'Panel 1 — Incoming Feeder Bay',
      equipmentFamily: (selectedWo?.equipmentFamily as any) || 'RMU',
      voltageRating: (selectedWo?.voltageRating as any) || '13.8 kV',
      serialNumber: selectedWo?.equipmentIds?.[0] ? (equipmentCatalog.find(e => e.id === selectedWo.equipmentIds[0])?.serialNumber || 'ALF-RMU-2024-8841') : 'ALF-RMU-2024-8841',
      model: 'Alfanar SafeRing CCV-13.8',
      manufacturer: 'Alfanar Electrical Systems',
      rtuControllerType: 'Alfanar RTU-600',
      locationDetails: selectedWo?.siteName || 'Substation Switchgear Room',
      energyState: 'De-energized',
      energyStateReason: '',
      customerAllegation: 'SF6 gas alarm triggered during heavy network feeder load',
      verifiedEngineeringFindings: 'Confirmed micro-leak on valve seal. Ambient gauge reads 0.038 MPa. No internal flashover or arc signs.',
      rootCause: 'Elastomer O-ring compression set degraded under high ambient thermal cycles.',
      solutionProvided: 'Replaced valve stem assembly, evacuated to 50 Pa, recharged SF6 to nominal 0.052 MPa at 20°C.',
      checklistAnswers: [
        { id: 'chk_1', category: 'Mechanical & Enclosure', itemText: 'Enclosure integrity, door interlocks and seals', outcome: 'Pass' },
        { id: 'chk_2', category: 'Insulation & Gas', itemText: 'SF6 gas pressure gauge reading and density switch', outcome: 'Fail', reason: 'Gauge below nominal threshold (0.038 MPa)', correctiveAction: 'Purged, replaced valve, and refilled to 0.052 MPa' },
        { id: 'chk_3', category: 'Earthing & Protection', itemText: 'Earthing switch manual locking & mechanical interlock', outcome: 'Pass' },
        { id: 'chk_4', category: 'Control & RTU', itemText: 'RTU auxiliary supply, battery backup, and trip signals', outcome: 'Pass' },
      ],
      photos: [],
      replacementPartsNeeded: [
        {
          partNumber: 'ALF-SP-SF6-VLV',
          partDescription: 'SF6 Gas Valve & Manometer Gauge Kit (0-0.3 MPa)',
          quantity: 1,
          isWarranty: true,
        },
      ],
      requiresNcr: true,
      ncrReason: 'Valve seal degradation before warranty expiration (Recall Batch TB-2025-04)',
    },
  ]);

  const [activePanelIdx, setActivePanelIdx] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activePanel = panels[activePanelIdx] || panels[0];

  const updateActivePanel = (updates: Partial<PanelInspectionEntry>) => {
    setPanels(prev => {
      const copy = [...prev];
      copy[activePanelIdx] = { ...copy[activePanelIdx], ...updates };
      return copy;
    });
  };

  const handleAddPanel = () => {
    const newIdx = panels.length + 1;
    const newPanel: PanelInspectionEntry = {
      id: 'pnl_' + Date.now(),
      panelIdentifier: `Panel ${newIdx} — Outgoing Feeder`,
      equipmentFamily: 'RMU',
      voltageRating: '13.8 kV',
      serialNumber: `ALF-PANEL-${Date.now().toString().slice(-4)}`,
      model: 'Alfanar CCV',
      manufacturer: 'Alfanar Electrical Systems',
      locationDetails: selectedWo?.siteName || 'Substation',
      energyState: 'Energized',
      customerAllegation: 'Check operating condition',
      verifiedEngineeringFindings: 'Normal operating readings; contact resistance nominal.',
      rootCause: 'Normal operation',
      solutionProvided: 'Verified operational parameters',
      checklistAnswers: [
        { id: 'chk_1', category: 'Mechanical', itemText: 'Enclosure integrity & seals', outcome: 'Pass' },
        { id: 'chk_2', category: 'Insulation', itemText: 'Gas pressure / Insulation check', outcome: 'Pass' },
      ],
      photos: [],
      replacementPartsNeeded: [],
      requiresNcr: false,
    };
    setPanels([...panels, newPanel]);
    setActivePanelIdx(panels.length);
  };

  const handleRemovePanel = (index: number) => {
    if (panels.length <= 1) {
      setErrorMsg('A site visit report must document at least 1 equipment panel.');
      return;
    }
    const filtered = panels.filter((_, i) => i !== index);
    setPanels(filtered);
    setActivePanelIdx(Math.max(0, index - 1));
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation not supported in browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsCoords({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setSuccessMsg('GPS Location captured.');
        setTimeout(() => setSuccessMsg(null), 2500);
      },
      err => {
        setErrorMsg('Location access error: ' + err.message);
      }
    );
  };

  const handleSubmitReport = () => {
    if (!selectedWo || !currentUser) {
      setErrorMsg('Invalid session or work order.');
      return;
    }
    setErrorMsg(null);

    // Validate Energy State and Checklists for all panels
    for (const p of panels) {
      if (p.energyState === 'Not Verified' && (!p.energyStateReason || p.energyStateReason.trim().length < 5)) {
        setErrorMsg(`Mandatory Rule: Panel "${p.panelIdentifier}" is marked "Not Verified". An explicit engineering reason is required.`);
        return;
      }
      for (const item of p.checklistAnswers) {
        if ((item.outcome === 'Fail' || item.outcome === 'Not Checked') && (!item.reason || item.reason.trim().length < 3)) {
          setErrorMsg(`Mandatory Rule: Checklist item "${item.itemText}" in "${p.panelIdentifier}" is marked ${item.outcome} and requires an explanation.`);
          return;
        }
      }
    }

    try {
      const report = db.submitSiteVisitReport(
        {
          workOrderId: selectedWo.id,
          workOrderNumber: selectedWo.workOrderNumber,
          complaintId: selectedWo.complaintId,
          complaintRef: selectedWo.complaintRef,
          engineerId: currentUser.id,
          engineerName: currentUser.name,
          siteName: selectedWo.siteName,
          customerContactPerson: customerContact,
          customerContactPhone: contactPhone,
          siteArrivalTime: new Date().toISOString(),
          siteDepartureTime: new Date().toISOString(),
          gpsCoordinates: gpsCoords ? { ...gpsCoords, capturedAt: new Date().toISOString() } : undefined,
          timeLogId: linkedTimeLog ? linkedTimeLog.id : 'tl_manual',
          panels,
          accessRestrictionsNote: accessNotes,
        },
        currentUser
      );

      setSuccessMsg(`Site Visit Report ${report.visitReportNumber} submitted successfully to supervisor review queue!`);
      if (onSubmitted) {
        setTimeout(() => onSubmitted(report.id), 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed.');
    }
  };

  const wizardSteps = [
    '1. Job Header',
    '2. Time Log Link',
    '3. Panel Identity',
    '4. Energy State & Safety',
    '5. Technical Checklists',
    '6. Findings & Root Cause',
    '7. Parts & Evidence',
    '8. Review & Submit',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <ClipboardList className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Site Visit Reporting Wizard</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Modules 04 & 05
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Structured mobile-friendly visit documentation with multi-panel checklists, energy verification, and supervisor review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Select Active WO:</label>
            <select
              value={selectedWoId}
              onChange={e => setSelectedWoId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800"
            >
              {workOrders.map(w => (
                <option key={w.id} value={w.id}>
                  {w.workOrderNumber} — {w.siteName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
          {wizardSteps.map((stLabel, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <button
                key={stepNum}
                onClick={() => setStep(stepNum)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{stLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: JOB & VISIT HEADER */}
        {step === 1 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Job Details & Site Attendance Header
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Work Order Reference</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedWo?.workOrderNumber} (Complaint Ref: ${selectedWo?.complaintRef})`}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Site & Location</label>
                <input
                  type="text"
                  disabled
                  value={selectedWo?.siteName}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Contact Person</label>
                <input
                  type="text"
                  value={customerContact}
                  onChange={e => setCustomerContact(e.target.value)}
                  placeholder="e.g. Eng. Mansour Al-Garni"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Mobile / Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Access or Safety Limitations on Site</label>
                <input
                  type="text"
                  value={accessNotes}
                  onChange={e => setAccessNotes(e.target.value)}
                  placeholder="e.g. Escorted entry required; SEC clearance badge verified; no restrictions observed."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: THREE-STAGE TIME LOG LINK */}
        {step === 2 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Mandatory 3-Stage Field-Work Time Log Connection
            </h3>
            {linkedTimeLog ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-blue-900">Linked Time Log Found ({linkedTimeLog.id})</span>
                  </div>
                  <span className="font-mono font-bold text-blue-800 text-sm">
                    Total: {(linkedTimeLog.totalDurationMinutes / 60).toFixed(2)} hrs
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2 bg-white rounded border border-blue-100">
                    <span className="text-slate-400 block text-[10px] uppercase">Outbound Travel</span>
                    <span className="font-bold text-slate-800 font-mono">{linkedTimeLog.outboundTravelMinutes} mins</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-100">
                    <span className="text-slate-400 block text-[10px] uppercase">On-Site Work</span>
                    <span className="font-bold text-slate-800 font-mono">{linkedTimeLog.onSiteWorkMinutes} mins</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-100">
                    <span className="text-slate-400 block text-[10px] uppercase">Return Travel</span>
                    <span className="font-bold text-slate-800 font-mono">{linkedTimeLog.returnTravelMinutes} mins</span>
                  </div>
                </div>
                <p className="text-[11px] text-blue-700 pt-1">
                  Rule verified: Exactly three timed segments recorded with individual engineer account and server timestamps.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>No Completed Time Log Yet for This Work Order</span>
                </div>
                <p>
                  You can proceed to draft panel details, but before final submission, run the 3-Stage Field-Work Timer to log required departure and arrival events.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: MULTI-PANEL IDENTITY (REPEATABLE) */}
        {step === 3 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  3. Multi-Panel Identification ({panels.length} Panel{panels.length > 1 ? 's' : ''})
                </h3>
                <span className="text-xs text-slate-500">
                  Rule: One attendance can cover multiple panels. Select panel to edit or add new panel.
                </span>
              </div>
              <button
                onClick={handleAddPanel}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Panel</span>
              </button>
            </div>

            {/* Panel Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {panels.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePanelIdx(idx)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 ${
                    activePanelIdx === idx
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{p.panelIdentifier}</span>
                  {panels.length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleRemovePanel(idx); }}
                      className="text-slate-400 hover:text-red-400 p-0.5"
                      title="Remove panel"
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Panel Details Form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Panel Identifier / Bay</label>
                <input
                  type="text"
                  value={activePanel.panelIdentifier}
                  onChange={e => updateActivePanel({ panelIdentifier: e.target.value })}
                  placeholder="e.g. Panel 1 — Incoming Feeder"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Equipment Family</label>
                <select
                  value={activePanel.equipmentFamily}
                  onChange={e => updateActivePanel({ equipmentFamily: e.target.value as any })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="RMU">RMU (Ring Main Unit)</option>
                  <option value="MRMU">MRMU (Modular RMU)</option>
                  <option value="SRMU">SRMU (Smart RMU)</option>
                  <option value="Auto-Recloser">Auto-Recloser (ACR)</option>
                  <option value="LBS">LBS (Load Break Switch)</option>
                  <option value="SLBS">SLBS (Sectionalizer LBS)</option>
                  <option value="Other">Other Authorized Family</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Voltage Rating (kV)</label>
                <select
                  value={activePanel.voltageRating}
                  onChange={e => updateActivePanel({ voltageRating: e.target.value as any })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="13.8 kV">13.8 kV (Distribution)</option>
                  <option value="33 kV">33 kV (Sub-transmission)</option>
                  <option value="Other">Other Authorized Voltage</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Serial Number</label>
                <input
                  type="text"
                  value={activePanel.serialNumber}
                  onChange={e => updateActivePanel({ serialNumber: e.target.value })}
                  placeholder="e.g. ALF-RMU-2024-8841"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Model & Configuration</label>
                <input
                  type="text"
                  value={activePanel.model}
                  onChange={e => updateActivePanel({ model: e.target.value })}
                  placeholder="e.g. SafeRing CCV-13.8"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">RTU / Controller Model</label>
                <input
                  type="text"
                  value={activePanel.rtuControllerType || ''}
                  onChange={e => updateActivePanel({ rtuControllerType: e.target.value })}
                  placeholder="e.g. Alfanar RTU-600 or SEL-651R"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ENERGY STATE & SAFETY MANDATE */}
        {step === 4 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              4. Observed Electrical Energy State & Safety Compliance
            </h3>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Safety Disclaimer:</strong> This application records field engineering observations only. It does NOT authorize electrical switching or issue safety permits. Switching must follow utility protocol.
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-2">
                  Observed Energy State for {activePanel.panelIdentifier}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Energized', 'De-energized', 'Not Verified'] as EnergyState[]).map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => updateActivePanel({ energyState: state })}
                      className={`p-3 rounded-lg border text-left font-semibold transition-all ${
                        activePanel.energyState === state
                          ? state === 'Energized'
                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                            : state === 'De-energized'
                            ? 'bg-blue-100 border-blue-400 text-blue-900'
                            : 'bg-red-100 border-red-400 text-red-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{state}</span>
                        {activePanel.energyState === state && <Check className="w-4 h-4" />}
                      </div>
                      <span className="text-[10px] block font-normal mt-1 text-slate-500">
                        {state === 'Energized'
                          ? 'Equipment live under operating voltage'
                          : state === 'De-energized'
                          ? 'Isolated, grounded and earthed per safety permit'
                          : 'Exception state: requires supervisor review'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exception Rule: If Not Verified, mandatory justification! */}
              {activePanel.energyState === 'Not Verified' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
                  <label className="font-bold text-red-800 block">
                    Mandatory Justification for "Not Verified" (Supervisor Review Trigger):
                  </label>
                  <textarea
                    rows={2}
                    value={activePanel.energyStateReason || ''}
                    onChange={e => updateActivePanel({ energyStateReason: e.target.value })}
                    placeholder="State reason why energy state could not be verified (e.g. Utility padlock locked, control voltage down, access denied by station operator)..."
                    className="w-full text-xs p-2 bg-white border border-red-300 rounded text-slate-900 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: TECHNICAL CHECKLISTS */}
        {step === 5 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  5. Technical Inspection Checklist for {activePanel.panelIdentifier}
                </h3>
                <span className="text-xs text-slate-500">
                  Rule: Any item marked 'Fail' or 'Not Checked' requires an explicit reason and action.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {activePanel.checklistAnswers.map((item, idx) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 font-bold uppercase">{item.category}</span>
                      <h4 className="font-semibold text-slate-900">{item.itemText}</h4>
                    </div>

                    {/* Outcome Radios */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                      {(['Pass', 'Fail', 'Not Checked', 'Not Applicable'] as InspectionOutcome[]).map(out => (
                        <button
                          key={out}
                          type="button"
                          onClick={() => {
                            const newAnswers = [...activePanel.checklistAnswers];
                            newAnswers[idx] = { ...newAnswers[idx], outcome: out };
                            updateActivePanel({ checklistAnswers: newAnswers });
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            item.outcome === out
                              ? out === 'Pass'
                                ? 'bg-emerald-600 text-white'
                                : out === 'Fail'
                                ? 'bg-red-600 text-white'
                                : out === 'Not Checked'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {out}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Required explanations for Fail / Not Checked */}
                  {(item.outcome === 'Fail' || item.outcome === 'Not Checked') && (
                    <div className="p-2.5 bg-red-50/80 border border-red-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-red-900 block mb-0.5">
                          Reason for {item.outcome} (Mandatory):
                        </label>
                        <input
                          type="text"
                          value={item.reason || ''}
                          onChange={e => {
                            const newAnswers = [...activePanel.checklistAnswers];
                            newAnswers[idx] = { ...newAnswers[idx], reason: e.target.value };
                            updateActivePanel({ checklistAnswers: newAnswers });
                          }}
                          placeholder="e.g. SF6 density gauge reading 0.038 MPa below nominal..."
                          className="w-full text-xs p-1.5 bg-white border border-red-300 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-red-900 block mb-0.5">
                          Corrective Action / Exception Plan:
                        </label>
                        <input
                          type="text"
                          value={item.correctiveAction || ''}
                          onChange={e => {
                            const newAnswers = [...activePanel.checklistAnswers];
                            newAnswers[idx] = { ...newAnswers[idx], correctiveAction: e.target.value };
                            updateActivePanel({ checklistAnswers: newAnswers });
                          }}
                          placeholder="e.g. Leak fixed with new valve kit; re-tested to 0.052 MPa."
                          className="w-full text-xs p-1.5 bg-white border border-red-300 rounded text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: FINDINGS & ROOT CAUSE */}
        {step === 6 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              6. Engineering Findings vs Customer Allegations for {activePanel.panelIdentifier}
            </h3>
            <p className="text-xs text-slate-500">
              Rule: Keep the customer allegation strictly separate from verified engineering findings and root cause.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Original Customer Allegation</label>
                <input
                  type="text"
                  value={activePanel.customerAllegation}
                  onChange={e => updateActivePanel({ customerAllegation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-blue-900 block mb-1">Verified Technical Findings (Engineering Truth)</label>
                <textarea
                  rows={2}
                  value={activePanel.verifiedEngineeringFindings}
                  onChange={e => updateActivePanel({ verifiedEngineeringFindings: e.target.value })}
                  placeholder="Record objective electrical/mechanical findings..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Root Cause Classification</label>
                  <textarea
                    rows={2}
                    value={activePanel.rootCause}
                    onChange={e => updateActivePanel({ rootCause: e.target.value })}
                    placeholder="Identify verified root cause..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Solution & Corrective Work Done</label>
                  <textarea
                    rows={2}
                    value={activePanel.solutionProvided}
                    onChange={e => updateActivePanel({ solutionProvided: e.target.value })}
                    placeholder="Document exact rectification actions..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Quality Disposition trigger */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">Flag Non-Conformance Report (NCR)?</span>
                  <span className="text-[11px] text-amber-700">Triggers independent QCA review and defect tracking.</span>
                </div>
                <input
                  type="checkbox"
                  checked={activePanel.requiresNcr}
                  onChange={e => updateActivePanel({ requiresNcr: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PARTS & EVIDENCE */}
        {step === 7 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              7. Spare Parts Used & Photo/GPS Evidence
            </h3>

            {/* GPS Capture */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Site GPS Coordinates</span>
                <span className="text-slate-500">
                  {gpsCoords ? `${gpsCoords.latitude}, ${gpsCoords.longitude}` : 'No GPS captured yet'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCaptureGps}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Capture GPS</span>
              </button>
            </div>

            {/* Repeatable Defective Parts List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Defective / Replaced Component Lines</span>
              {activePanel.replacementPartsNeeded.map((pt, pIdx) => (
                <div key={pIdx} className="p-2.5 bg-white rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{pt.partDescription}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Part #{pt.partNumber} · Qty: {pt.quantity} · {pt.isWarranty ? 'Under Warranty' : 'Billable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: REVIEW & SUBMIT */}
        {step === 8 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              8. Final Review & Supervisor Submission
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Work Order</span>
                  <span className="font-mono font-bold text-slate-900">{selectedWo?.workOrderNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Site Name</span>
                  <span className="font-semibold text-slate-900">{selectedWo?.siteName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Panels</span>
                  <span className="font-bold text-blue-700">{panels.length} Panel(s)</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Reporting Engineer</span>
                  <span className="font-semibold text-slate-900">{currentUser?.name}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 leading-relaxed">
                <strong>Engineer Submission Declaration:</strong> I hereby certify that the inspections, measurements, and equipment observations recorded above are accurate and conducted in accordance with Alfanar MV technical procedures.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitReport}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Technical Report to Supervisor</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {step < 8 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(8, prev + 1))}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
