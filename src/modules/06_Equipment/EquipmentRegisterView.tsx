/**
 * Digital MV Customer Service Management System
 * MODULE 06: Equipment Register & Asset Chronological History
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { EquipmentMaster, Complaint, WorkOrder, SiteVisitReport, NonConformanceReport } from '../../types';
import { 
  Cpu, 
  Search, 
  Plus, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Calendar,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const EquipmentRegisterView: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentMaster[]>(() => db.getEquipment());
  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<EquipmentMaster | null>(null);

  // Associated historical records for the selected asset
  const allComplaints = db.getComplaints();
  const allWorkOrders = db.getWorkOrders();
  const allVisits = db.getVisitReports();
  const allNcrs = db.getNCRs();
  const allPm = db.getMaintenancePlans();

  const filtered = equipmentList.filter(eq => {
    const matchesSearch =
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.siteName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFamily = familyFilter === 'all' || eq.family === familyFilter;
    return matchesSearch && matchesFamily;
  });

  const getAssetComplaints = (serial: string) =>
    allComplaints.filter(c => c.panelSerialNumber?.toLowerCase() === serial.toLowerCase());

  const getAssetVisits = (serial: string) =>
    allVisits.filter(v => v.panels?.some(p => p.serialNumber.toLowerCase() === serial.toLowerCase()));

  const getAssetNcrs = (serial: string) =>
    allNcrs.filter(n => n.equipmentSerialNumber.toLowerCase() === serial.toLowerCase());

  const getAssetPm = (serial: string) =>
    allPm.filter(p => p.equipmentSerialNumber.toLowerCase() === serial.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Equipment Register & Asset History</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 06
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Global serial number lookup, voltage normalization (13.8kV/33kV), and chronological lifecycle audit trail.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Total Assets: <strong className="text-slate-900 font-mono">{equipmentList.length}</strong>
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Global Search Serial #, Customer, Site, or Model..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={familyFilter}
              onChange={e => setFamilyFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Equipment Families</option>
              <option value="RMU">RMU</option>
              <option value="MRMU">MRMU</option>
              <option value="SRMU">SRMU</option>
              <option value="Auto-Recloser">Auto-Recloser</option>
              <option value="LBS">LBS</option>
              <option value="SLBS">SLBS</option>
            </select>
          </div>
        </div>

        {/* Equipment Register Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Serial Number</th>
                <th className="py-2.5 px-3">Family & Voltage</th>
                <th className="py-2.5 px-3">Model / Specs</th>
                <th className="py-2.5 px-3">Customer & Site</th>
                <th className="py-2.5 px-3">RTU / Controller</th>
                <th className="py-2.5 px-3">Operating Status</th>
                <th className="py-2.5 px-3 text-right">Asset History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No equipment matched the serial number or filter.
                  </td>
                </tr>
              ) : (
                filtered.map(eq => (
                  <tr key={eq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      {eq.serialNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{eq.family}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{eq.voltage}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{eq.model}</div>
                      <div className="text-[10px] text-slate-400">{eq.manufacturer}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 truncate max-w-xs">{eq.siteName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{eq.customerName}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {eq.rtuControllerType || 'None'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          eq.status === 'In Service'
                            ? 'bg-emerald-100 text-emerald-800'
                            : eq.status === 'Under Maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedAsset(eq)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Chronological Asset History Modal */}
        {selectedAsset && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-blue-700">{selectedAsset.serialNumber}</span>
                  <span className="text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                    {selectedAsset.family} · {selectedAsset.voltage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Installed at: {selectedAsset.siteName} ({selectedAsset.customerName}) · Warranty Expiry: {selectedAsset.warrantyExpiryDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded"
              >
                Close Timeline
              </button>
            </div>

            {/* Asset Lifecycle Trail */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Complaints */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block uppercase text-[11px]">
                  Incidents & Complaints ({getAssetComplaints(selectedAsset.serialNumber).length})
                </span>
                {getAssetComplaints(selectedAsset.serialNumber).map(c => (
                  <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                    <div className="font-mono font-bold text-blue-700">{c.referenceNumber}</div>
                    <div className="text-slate-700 font-medium">{c.category}</div>
                    <div className="text-[10px] text-slate-400">{c.createdAt.split('T')[0]}</div>
                  </div>
                ))}
              </div>

              {/* Site Inspections */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block uppercase text-[11px]">
                  Field Inspections ({getAssetVisits(selectedAsset.serialNumber).length})
                </span>
                {getAssetVisits(selectedAsset.serialNumber).map(v => (
                  <div key={v.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                    <div className="font-mono font-bold text-slate-900">{v.visitReportNumber} (Rev {v.revisionNumber})</div>
                    <div className="text-slate-700">By Eng. {v.engineerName}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold uppercase">{v.status}</div>
                  </div>
                ))}
              </div>

              {/* NCRs */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block uppercase text-[11px]">
                  Quality NCRs ({getAssetNcrs(selectedAsset.serialNumber).length})
                </span>
                {getAssetNcrs(selectedAsset.serialNumber).map(n => (
                  <div key={n.id} className="p-2 bg-red-50/60 rounded border border-red-100 text-[11px]">
                    <div className="font-mono font-bold text-red-700">{n.ncrNumber}</div>
                    <div className="text-slate-700">{n.defectCategory}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Disposition: {n.disposition}</div>
                  </div>
                ))}
              </div>

              {/* Preventive Maintenance */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block uppercase text-[11px]">
                  Maintenance Schedule ({getAssetPm(selectedAsset.serialNumber).length})
                </span>
                {getAssetPm(selectedAsset.serialNumber).map(pm => (
                  <div key={pm.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                    <div className="font-mono font-bold text-slate-900">{pm.planCode}</div>
                    <div className="text-slate-700">Next Due: {pm.nextDueDate}</div>
                    <div className="text-[10px] text-amber-700 font-semibold">{pm.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
