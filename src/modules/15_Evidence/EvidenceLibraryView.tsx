/**
 * Digital MV Customer Service Management System
 * MODULE 15: Photo & Document Evidence Library
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { Image, Upload, Search, Lock, Eye, FileText, Camera, ShieldCheck, Check } from 'lucide-react';

interface EvidenceItem {
  id: string;
  filename: string;
  caption: string;
  category: 'Nameplate' | 'SF6 Gauge' | 'Mechanism' | 'Arc/Thermal' | 'Test Graph' | 'General';
  workOrderRef: string;
  uploadedBy: string;
  timestamp: string;
  filesize: string;
  thumbnailColor: string;
}

export const EvidenceLibraryView: React.FC = () => {
  const { currentUser } = useAuth();
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([
    {
      id: 'ev_01',
      filename: 'RMU_8044_Nameplate_Macro.jpg',
      caption: 'Rating plate showing SafeRing CCV 13.8kV, S/N ALF-RMU-2024-8841',
      category: 'Nameplate',
      workOrderRef: 'WO-2026-0108',
      uploadedBy: 'Tariq Mansoor',
      timestamp: '2026-10-22 08:48:12',
      filesize: '2.4 MB',
      thumbnailColor: 'bg-blue-900',
    },
    {
      id: 'ev_02',
      filename: 'SF6_Manometer_LowPressure_Reading.jpg',
      caption: 'Wika density gauge showing pointer in red alarm zone at 0.038 MPa',
      category: 'SF6 Gauge',
      workOrderRef: 'WO-2026-0108',
      uploadedBy: 'Tariq Mansoor',
      timestamp: '2026-10-22 08:52:40',
      filesize: '3.1 MB',
      thumbnailColor: 'bg-amber-900',
    },
    {
      id: 'ev_03',
      filename: 'Valve_Stem_EPDM_Seal_MicroCrack.jpg',
      caption: 'Macro view of degraded O-ring seal linked to NCR-2026-0019',
      category: 'Mechanism',
      workOrderRef: 'WO-2026-0108',
      uploadedBy: 'Tariq Mansoor',
      timestamp: '2026-10-22 09:15:02',
      filesize: '4.2 MB',
      thumbnailColor: 'bg-red-950',
    },
    {
      id: 'ev_04',
      filename: 'ACR33_Spring_Latch_Clearance.jpg',
      caption: 'Mechanical interlock gap clearance measurement (5.2 mm)',
      category: 'Mechanism',
      workOrderRef: 'WO-2026-0109',
      uploadedBy: 'Zaid Al-Harbi',
      timestamp: '2026-10-21 11:20:18',
      filesize: '1.8 MB',
      thumbnailColor: 'bg-slate-900',
    },
  ]);

  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<EvidenceItem['category']>('General');
  const [newWo, setNewWo] = useState('WO-2026-0108');

  const filtered = evidenceList.filter(e =>
    e.filename.toLowerCase().includes(search.toLowerCase()) ||
    e.caption.toLowerCase().includes(search.toLowerCase()) ||
    e.workOrderRef.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const newItem: EvidenceItem = {
      id: 'ev_' + Date.now(),
      filename: `SitePhoto_${Date.now().toString().slice(-4)}.jpg`,
      caption: newCaption || 'On-site technical inspection photograph',
      category: newCategory,
      workOrderRef: newWo,
      uploadedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      filesize: '2.8 MB',
      thumbnailColor: 'bg-blue-950',
    };
    setEvidenceList([newItem, ...evidenceList]);
    setShowUploadModal(false);
    setNewCaption('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Image className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Photo & Document Evidence Library</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 15
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Private object storage, high-resolution equipment evidence, and verified time-stamped photos.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Private Evidence</span>
          </button>
        </div>

        {/* Security Warning */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Confidentiality Protection:</strong> Photographic assets are stored with private signed URIs and are never exposed on public intake links.
          </span>
        </div>

        {/* Evidence Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer rounded-xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all flex flex-col bg-white"
            >
              {/* Media Preview Box */}
              <div className={`h-40 ${item.thumbnailColor} relative flex items-center justify-center text-slate-300 p-4 overflow-hidden`}>
                <Camera className="w-10 h-10 opacity-30 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                  {item.category}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
                  {item.filesize}
                </span>
              </div>

              {/* Caption & Meta */}
              <div className="p-3 text-xs space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 truncate" title={item.filename}>
                    {item.filename}
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-[11px] mt-0.5">
                    {item.caption}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.workOrderRef}</span>
                  <span>{item.uploadedBy.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base">Upload Field Photographic Evidence</h3>
              <form onSubmit={handleUpload} className="space-y-3">
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 space-y-2">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-slate-700 font-semibold">Select inspection JPEG/PNG or drag files here</div>
                  <div className="text-[10px] text-slate-400">Max file size 25MB. Signed S3 upload.</div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Evidence Category *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium"
                  >
                    <option value="SF6 Gauge">SF6 Pressure / Density Gauge</option>
                    <option value="Nameplate">Panel Nameplate & Serial</option>
                    <option value="Mechanism">Switch Mechanism / Interlock</option>
                    <option value="Arc/Thermal">Thermal / Flashover Inspection</option>
                    <option value="Test Graph">Test Graph & Timing Curve</option>
                    <option value="General">General Site Condition</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed Caption & Technical Context *</label>
                  <textarea
                    rows={2}
                    required
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    placeholder="Describe specific gauge reading, serial nameplate, or defective component..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                  >
                    Save Photo to Object Store
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
