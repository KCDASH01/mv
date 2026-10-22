/**
 * Digital MV Customer Service Management System
 * CRITICAL MODULE: EXACT THREE-STAGE FIELD-WORK TIMER
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth';
import { db } from '../../services/db';
import { TimerAction, WorkOrder, SiteJobTimeLog } from '../../types';
import { 
  Timer, 
  Play, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText,
  User,
  ArrowRight,
  RefreshCw,
  Navigation,
  Check
} from 'lucide-react';

interface Props {
  selectedWorkOrderId?: string;
  onNavigateToWizard?: (workOrderId: string) => void;
}

export const JobTimerWidget: React.FC<Props> = ({ selectedWorkOrderId, onNavigateToWizard }) => {
  const { currentUser, isFieldEngineer, isSupervisor, isAdmin } = useAuth();
  const workOrders = db.getWorkOrders();

  // If no work order specified, choose the first active one assigned to user or available
  const [activeWoId, setActiveWoId] = useState<string>(() => {
    if (selectedWorkOrderId) return selectedWorkOrderId;
    const myActive = workOrders.find(
      w => w.status === 'in_progress' || w.status === 'assigned' || w.status === 'accepted'
    );
    return myActive ? myActive.id : workOrders[0]?.id || '';
  });

  const [timeLog, setTimeLog] = useState<SiteJobTimeLog | null>(null);
  const [notes, setNotes] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [elapsedDisplay, setElapsedDisplay] = useState<string>('00:00:00');

  const selectedWo = workOrders.find(w => w.id === activeWoId);

  const refreshData = () => {
    if (!activeWoId) return;
    const log = db.getTimeLogByWorkOrder(activeWoId);
    setTimeLog(log || null);
  };

  useEffect(() => {
    refreshData();
  }, [activeWoId]);

  // Live timer tick for active segment
  useEffect(() => {
    if (!timeLog || timeLog.isCompleted || timeLog.currentStep === 0) {
      setElapsedDisplay('00:00:00');
      return;
    }

    const currentEvent = timeLog.events.find(e => e.stepNumber === timeLog.currentStep);
    if (!currentEvent) return;

    // Only tick live if step 1 (traveling to site), step 3 (working on site), or step 5 (returning)
    const isRunning = [1, 3, 5].includes(timeLog.currentStep);
    if (!isRunning) {
      setElapsedDisplay('--:--:--');
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(currentEvent.serverTimestamp).getTime();
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - start) / 1000));
      const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSec % 60).padStart(2, '0');
      setElapsedDisplay(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLog]);

  // Optional tap-to-capture GPS location (Rule: No continuous tracking)
  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setGpsLoading(false);
        setSuccessMsg('Current GPS coordinates captured with permission.');
        setTimeout(() => setSuccessMsg(null), 3000);
      },
      err => {
        setGpsLoading(false);
        setErrorMsg('Location permission denied or unavailable: ' + err.message);
        setTimeout(() => setErrorMsg(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  // Step definitions
  const stepsConfig: { step: number; action: TimerAction; stage: string; label: string; icon: string }[] = [
    { step: 1, action: 'start_travel_to_site', stage: 'Stage 1: Base to Site', label: 'Start Travel to Site', icon: 'car' },
    { step: 2, action: 'end_travel_at_site', stage: 'Stage 1: Base to Site', label: 'End Travel at Site', icon: 'map-pin' },
    { step: 3, action: 'start_work', stage: 'Stage 2: On-Site Work', label: 'Start Work', icon: 'play' },
    { step: 4, action: 'end_work', stage: 'Stage 2: On-Site Work', label: 'End Work', icon: 'pause' },
    { step: 5, action: 'start_return_travel', stage: 'Stage 3: Site to Base', label: 'Start Return Travel', icon: 'navigation' },
    { step: 6, action: 'end_travel_at_room_base', stage: 'Stage 3: Site to Base', label: 'End Travel at Room/Base', icon: 'check-circle' },
  ];

  const currentStep = timeLog ? timeLog.currentStep : 0;
  const nextStepConfig = stepsConfig.find(s => s.step === currentStep + 1);

  const handleExecuteNextAction = () => {
    if (!nextStepConfig) return;
    if (!currentUser) {
      setErrorMsg('You must be signed in with a valid staff account.');
      return;
    }
    setErrorMsg(null);

    try {
      const updated = db.recordTimerAction(
        activeWoId,
        nextStepConfig.action,
        currentUser,
        coords || undefined,
        notes || undefined
      );
      setTimeLog({ ...updated });
      setNotes('');
      setSuccessMsg(`Action recorded: "${nextStepConfig.label}" with official server timestamp.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record timer action.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Timer className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Mandatory 3-Stage Field-Work Timer</h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                Strict v4 Rules
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Exactly 3 segments (6 sequential actions). Single valid action button displayed. Immutable server timestamps.
            </p>
          </div>

          {/* Work order selection */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Select Job:</label>
            <select
              value={activeWoId}
              onChange={e => setActiveWoId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {workOrders.map(w => (
                <option key={w.id} value={w.id}>
                  {w.workOrderNumber} — {w.siteName} ({w.priority.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Job Context Card */}
        {selectedWo && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-lg border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Work Order ID</span>
              <span className="text-slate-900 font-bold font-mono text-sm">{selectedWo.workOrderNumber}</span>
              <span className="text-[11px] text-slate-500 block">Ref: {selectedWo.complaintRef}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Site & Customer</span>
              <span className="text-slate-900 font-semibold">{selectedWo.siteName}</span>
              <span className="text-[11px] text-slate-500 block truncate">{selectedWo.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Assigned Engineer</span>
              <span className="text-slate-900 font-semibold">{selectedWo.assignedEngineerName}</span>
              <span className="text-[11px] text-slate-500 block">Supervisor: {selectedWo.supervisorName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Equipment Target</span>
              <span className="text-slate-900 font-semibold">{selectedWo.equipmentFamily} · {selectedWo.voltageRating}</span>
              <span className="text-[11px] text-emerald-600 font-semibold uppercase">{selectedWo.status.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        {/* Feedback banners */}
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

        {/* Live Active Clock Display */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 text-white rounded-xl shadow-inner gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">
              {timeLog?.isCompleted
                ? 'Time Log Complete (All 6 Steps Saved)'
                : nextStepConfig
                ? `Current State: Waiting for Step ${nextStepConfig.step} (${nextStepConfig.stage})`
                : 'Job Not Started'}
            </div>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-amber-400 tabular-nums">
              {elapsedDisplay}
            </div>
            <div className="text-[11px] text-slate-400">
              Outbound: <strong className="text-white font-mono">{timeLog?.outboundTravelMinutes || 0}m</strong> · 
              On-Site: <strong className="text-white font-mono">{timeLog?.onSiteWorkMinutes || 0}m</strong> · 
              Return: <strong className="text-white font-mono">{timeLog?.returnTravelMinutes || 0}m</strong> · 
              Total: <strong className="text-amber-300 font-mono">{timeLog?.totalDurationMinutes || 0}m</strong>
            </div>
          </div>

          {/* Action Trigger Area */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Optional GPS capture button */}
            <button
              onClick={handleCaptureGps}
              disabled={gpsLoading}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-400 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{coords ? `GPS: ${coords.latitude}, ${coords.longitude}` : 'Capture GPS on Tap'}</span>
            </button>

            {/* ONLY NEXT VALID BUTTON */}
            {nextStepConfig ? (
              <button
                onClick={handleExecuteNextAction}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  Action {nextStepConfig.step}: {nextStepConfig.label}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-xs text-emerald-300 font-semibold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>All 6 Actions Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Optional notes for next action */}
        {nextStepConfig && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Optional notes for this step (e.g. Departed base / Gate pass signed)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
          </div>
        )}

        {/* Six-Action Timeline Visualizer */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
            Six-Action Event Trail (Immutable Server Records)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stage 1 */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-800">STAGE 1: Base to Site</span>
                <span className="text-[11px] font-mono text-slate-500">{timeLog?.outboundTravelMinutes || 0} min</span>
              </div>
              <div className="space-y-2 text-xs">
                {/* Step 1 */}
                <div className={`p-2 rounded border ${timeLog && timeLog.currentStep >= 1 ? 'bg-white border-blue-200' : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">1. Start Travel to Site</span>
                    {timeLog && timeLog.currentStep >= 1 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  {timeLog?.events.find(e => e.stepNumber === 1) && (
                    <div className="text-[11px] font-mono text-blue-700 mt-1">
                      {new Date(timeLog.events.find(e => e.stepNumber === 1)!.serverTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div className={`p-2 rounded border ${timeLog && timeLog.currentStep >= 2 ? 'bg-white border-blue-200' : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">2. End Travel at Site</span>
                    {timeLog && timeLog.currentStep >= 2 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  {timeLog?.events.find(e => e.stepNumber === 2) && (
                    <div className="text-[11px] font-mono text-blue-700 mt-1">
                      {new Date(timeLog.events.find(e => e.stepNumber === 2)!.serverTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-800">STAGE 2: On-Site Work</span>
                <span className="text-[11px] font-mono text-slate-500">{timeLog?.onSiteWorkMinutes || 0} min</span>
              </div>
              <div className="space-y-2 text-xs">
                {/* Step 3 */}
                <div className={`p-2 rounded border ${timeLog && timeLog.currentStep >= 3 ? 'bg-white border-blue-200' : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">3. Start Work</span>
                    {timeLog && timeLog.currentStep >= 3 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  {timeLog?.events.find(e => e.stepNumber === 3) && (
                    <div className="text-[11px] font-mono text-blue-700 mt-1">
                      {new Date(timeLog.events.find(e => e.stepNumber === 3)!.serverTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Step 4 */}
                <div className={`p-2 rounded border ${timeLog && timeLog.currentStep >= 4 ? 'bg-white border-blue-200' : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">4. End Work</span>
                    {timeLog && timeLog.currentStep >= 4 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  {timeLog?.events.find(e => e.stepNumber === 4) && (
                    <div className="text-[11px] font-mono text-blue-700 mt-1">
                      {new Date(timeLog.events.find(e => e.stepNumber === 4)!.serverTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-800">STAGE 3: Site to Base</span>
                <span className="text-[11px] font-mono text-slate-500">{timeLog?.returnTravelMinutes || 0} min</span>
              </div>
              <div className="space-y-2 text-xs">
                {/* Step 5 */}
                <div className={`p-2 rounded border ${timeLog && timeLog.currentStep >= 5 ? 'bg-white border-blue-200' : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">5. Start Return Travel</span>
                    {timeLog && timeLog.currentStep >= 5 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  {timeLog?.events.find(e => e.stepNumber === 5) && (
                    <div className="text-[11px] font-mono text-blue-700 mt-1">
                      {new Date(timeLog.events.find(e => e.stepNumber === 5)!.serverTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Step 6 */}
                <div className={`p-2 rounded border ${timeLog && timeLog.currentStep >= 6 ? 'bg-white border-blue-200' : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">6. End Travel at Room/Base</span>
                    {timeLog && timeLog.currentStep >= 6 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  {timeLog?.events.find(e => e.stepNumber === 6) && (
                    <div className="text-[11px] font-mono text-blue-700 mt-1">
                      {new Date(timeLog.events.find(e => e.stepNumber === 6)!.serverTimestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supervisor Review Status Banner */}
        {timeLog && (
          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Supervisor Review Status:</span>
                <span
                  className={`font-bold uppercase px-2 py-0.5 rounded text-[11px] ${
                    timeLog.reviewStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : timeLog.reviewStatus === 'returned_for_correction'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {timeLog.reviewStatus.replace(/_/g, ' ')}
                </span>
              </div>
              {timeLog.supervisorComments && (
                <p className="text-slate-600 mt-1 text-xs">
                  <strong>Supervisor Notes:</strong> {timeLog.supervisorComments}
                </p>
              )}
            </div>

            {onNavigateToWizard && (
              <button
                onClick={() => onNavigateToWizard(activeWoId)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5"
              >
                <span>Complete Visit Report Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
