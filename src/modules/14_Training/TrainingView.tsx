/**
 * Digital MV Customer Service Management System
 * MODULE 14: Training Records & Operator Competency
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { TrainingRecord } from '../../types';
import { GraduationCap, Plus, Search, Users, Calendar, Award } from 'lucide-react';

export const TrainingView: React.FC = () => {
  const { currentUser } = useAuth();
  const [trainings, setTrainings] = useState<TrainingRecord[]>(() => db.getTrainings());
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [site, setSite] = useState('Alfanar Training Academy, Riyadh');
  const [trainer, setTrainer] = useState('Eng. Khalid Al-Sulaiman');
  const [duration, setDuration] = useState(6);
  const [topics, setTopics] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    db.createTraining(
      {
        title,
        date: new Date().toISOString().split('T')[0],
        siteOrLocation: site,
        trainerName: trainer,
        durationHours: duration,
        attendees: [
          { name: 'Eng. Tariq Mansoor', designation: 'Field Engineer', organization: 'Alfanar CS', attended: true },
          { name: 'Majed Al-Rashid', designation: 'Substation Technician', organization: 'SEC Central', attended: true }
        ],
        topicsCovered: topics,
      },
      currentUser
    );
    setTrainings(db.getTrainings());
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Training Records & Switchgear Safety</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 14
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field technician competency programs, interlock operation certifications, and client training rosters.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Training Event</span>
          </button>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Training Code</th>
                <th className="py-2.5 px-3">Session Title</th>
                <th className="py-2.5 px-3">Date & Location</th>
                <th className="py-2.5 px-3">Trainer</th>
                <th className="py-2.5 px-3">Attendees</th>
                <th className="py-2.5 px-3">Certificate Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainings.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{t.trainingCode}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{t.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{t.topicsCovered}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">{t.siteOrLocation}</div>
                    <div className="text-[10px] text-slate-400">{t.date} ({t.durationHours} hrs)</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">{t.trainerName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono font-semibold">
                      {t.attendees.length} Attendees
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{t.certificateRef || 'CERT-ALF-PENDING'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base">Record Technical Training Session</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course / Workshop Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Alfanar Auto-Recloser Vacuum Bottle Inspection"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={site}
                      onChange={e => setSite(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Trainer Name</label>
                    <input
                      type="text"
                      value={trainer}
                      onChange={e => setTrainer(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Curriculum & Topics Covered</label>
                  <textarea
                    rows={2}
                    value={topics}
                    onChange={e => setTopics(e.target.value)}
                    placeholder="Key switchgear maintenance procedures..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
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
                    Save Training
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
