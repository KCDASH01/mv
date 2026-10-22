/**
 * Digital MV Customer Service Management System
 * MODULE 05: Versioned Technical Inspection Checklists
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { Gauge, CheckSquare, ShieldCheck, AlertTriangle, Cpu, Layers } from 'lucide-react';

export const TechnicalInspectionsView: React.FC = () => {
  const [selectedFamily, setSelectedFamily] = useState<'RMU' | 'Auto-Recloser' | 'LBS' | 'MRMU'>('RMU');
  const [voltage, setVoltage] = useState<'13.8 kV' | '33 kV'>('13.8 kV');

  const checklists = {
    RMU: [
      { category: 'Mechanical & Gas Integrity', items: ['SF6 gas pressure manometer in green zone (0.045–0.055 MPa)', 'Enclosure IP54 door gasket and corrosion condition', 'Earthing switch interlock mechanical slide freely engages'] },
      { category: 'Electrical & HV Bushings', items: ['Bushings free of partial discharge tracking and flashover residue', 'Cable termination elbow connectors seated and torqued to 35 N·m', 'Voltage presence indicator neon lamps illuminated on live phase'] },
      { category: 'Control, Relay & RTU', items: ['Alfanar RTU-600 auxiliary 24V DC battery supply voltage nominal', 'Tripping coil continuity and resistance measurement', 'SCADA remote open/close dry contact handshake tested'] },
    ],
    'Auto-Recloser': [
      { category: 'Breaker & Mechanism', items: ['Vacuum interrupter bottle integrity and contact wear indicator', 'Spring charging motor runtime (< 12 seconds to fully charged)', 'Manual trip ring handle and mechanical lockout operation'] },
      { category: 'Controller & Protection', items: ['SEL-651R / RTU relay healthy LED and event fault history record', 'Current transformer secondary loop burden and polarity check', 'Trip pulse duration verified on oscilloscope / secondary tester'] },
    ],
    LBS: [
      { category: 'Switch Mechanism', items: ['Load break switch main contacts alignment and wipe measurement', 'Spring toggle mechanism snap-action over-center travel', 'Earthing switch interlocking bolt prevents improper sequence'] },
      { category: 'Fuses & Disconnectors', items: ['Current limiting MV fuse striker pin indicator intact', 'Silicone insulator sheds undamaged by environmental dust'] },
    ],
    MRMU: [
      { category: 'Busbar & Coupling', items: ['Extensible busbar plug-in connector silicone grease & clamping torque', 'Inter-panel gas manifold communication if centralized'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Gauge className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Technical Inspection Checklist Specifications</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 05
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Versioned checklists categorized by equipment family (RMU, Auto-Recloser, LBS) and normalized voltage (13.8kV/33kV).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-1 rounded-lg">
              Checklist Standard: IEC 62271-200 / Alfanar MV v4
            </span>
          </div>
        </div>

        {/* Family Selector */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['RMU', 'Auto-Recloser', 'LBS', 'MRMU'] as const).map(fam => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedFamily === fam ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fam}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['13.8 kV', '33 kV'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVoltage(v)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  voltage === v ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Mandate Notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Safety Principle:</strong> Any item marked <em>Fail</em> or <em>Not Checked</em> during an on-site visit strictly requires an engineering explanation and proposed action plan before submission to the supervisor.
          </span>
        </div>

        {/* Checklists Display */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Standard Verification Items for {selectedFamily} ({voltage})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(checklists[selectedFamily] || checklists.RMU).map((cat, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px] pb-1 border-b border-slate-200">
                  {cat.category}
                </span>
                <ul className="space-y-2">
                  {cat.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
