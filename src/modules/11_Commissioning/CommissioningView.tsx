/**
 * Digital MV Customer Service Management System
 * MODULE 11: Commissioning Records & High Voltage Proof Tests
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { CommissioningRecord } from '../../types';
import { CheckCheck, Plus, CheckCircle2, FileText, Activity } from 'lucide-react';

export const CommissioningView: React.FC = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<CommissioningRecord[]>(() => db.getCommissioning());
  const [showModal, setShowModal] = useState(false);

  const [serial, setSerial] = useState('ALF-MRMU-2024-3382');
  const [family, setFamily] = useState('MRMU');
  const [siteName, setSiteName] = useState('King Salman Park Development');
  const [witness, setWitness] = useState('Eng. Fahad Al-Bishi');
  const [irTest, setIrTest] = useState(24500);
  const [crTest, setCrTest] = useState(42.5);
  const [timing, setTiming] = useState(48);
  const [sf6, setSf6] = useState(1.4);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    db.createCommissioning(
      {
        equipmentSerialNumber: serial,
        equipmentFamily: family,
        siteName,
        commissioningDate: new Date().toISOString().split('T')[0],
        leadEngineer: currentUser.name,
        witnessedByCustomer: witness,
        insulationResistanceTestMegaOhms: irTest,
        contactResistanceMicroOhms: crTest,
        breakerTimingMilliseconds: timing,
        gasPressureBar: sf6,
        result: 'Accepted',
      },
      currentUser
    );
    setRecords(db.getCommissioning());
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Commissioning & Test Records</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Module 11
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field dielectric insulation tests, micro-ohm contact resistance, breaker timing, and punch lists.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Commissioning Record</span>
          </button>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Certificate Ref</th>
                <th className="py-2.5 px-3">Equipment Serial #</th>
                <th className="py-2.5 px-3">Site / Customer Witness</th>
                <th className="py-2.5 px-3">Insulation Resistance</th>
                <th className="py-2.5 px-3">Contact Resistance</th>
                <th className="py-2.5 px-3">Breaker Timing</th>
                <th className="py-2.5 px-3">SF6 Pressure</th>
                <th className="py-2.5 px-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{r.commissioningNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-900">{r.equipmentSerialNumber}</div>
                    <div className="text-[10px] text-slate-400">{r.equipmentFamily}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{r.siteName}</div>
                    <div className="text-[10px] text-slate-500">Witnessed: {r.witnessedByCustomer}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                    {r.insulationResistanceTestMegaOhms.toLocaleString()} MΩ
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">
                    {r.contactResistanceMicroOhms} µΩ
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">
                    {r.breakerTimingMilliseconds} ms
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">
                    {r.gasPressureBar} bar
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {r.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base">New Commissioning Certificate Record</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Equipment Serial Number *</label>
                    <input
                      type="text"
                      required
                      value={serial}
                      onChange={e => setSerial(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Site Facility *</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Insulation Resistance (MΩ) *</label>
                    <input
                      type="number"
                      required
                      value={irTest}
                      onChange={e => setIrTest(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Resistance (µΩ) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={crTest}
                      onChange={e => setCrTest(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Breaker Close/Open Timing (ms)</label>
                    <input
                      type="number"
                      value={timing}
                      onChange={e => setTiming(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Witness Representative</label>
                    <input
                      type="text"
                      value={witness}
                      onChange={e => setWitness(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                  >
                    Commit Commissioning Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
