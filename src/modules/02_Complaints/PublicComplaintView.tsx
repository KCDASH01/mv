/**
 * Digital MV Customer Service Management System
 * MODULE 02: Public Complaint / Intake Portal (/report-complaint)
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { 
  Zap, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeft,
  FileText,
  Lock
} from 'lucide-react';

interface Props {
  onBackToApp?: () => void;
}

export const PublicComplaintView: React.FC<Props> = ({ onBackToApp }) => {
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [company, setCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [city, setCity] = useState('Riyadh');
  const [region, setRegion] = useState('Central');
  const [equipmentFamily, setEquipmentFamily] = useState('RMU');
  const [panelSerialNumber, setPanelSerialNumber] = useState('');
  const [category, setCategory] = useState<any>('Trip during operation');
  const [description, setDescription] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName || !company || !contactEmail || !contactMobile || !siteName || !description) {
      setErrorMsg('Please complete all mandatory contact and issue details.');
      return;
    }

    if (!consentAcknowledged) {
      setErrorMsg('Please acknowledge the consent and data processing terms to proceed.');
      return;
    }

    setSubmitting(true);

    try {
      const newComp = db.submitPublicComplaint({
        customerName,
        company,
        contactEmail,
        contactMobile,
        siteName,
        siteAddress: siteAddress || `${siteName}, ${city}`,
        city,
        region,
        equipmentFamily,
        panelSerialNumber: panelSerialNumber || undefined,
        category,
        description,
        consentAcknowledged: true,
        priority: 'high',
        evidenceAttachments: [],
      });

      setSubmittedRef(newComp.referenceNumber);
      setSubmitting(false);
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg(err.message || 'An error occurred while submitting your ticket.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Alfanar Electrical Systems</h1>
            <p className="text-xs text-slate-400">Digital MV Customer Service & Rapid Response Portal</p>
          </div>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Staff Portal</span>
          </button>
        )}
      </div>

      {/* Main Submission Container */}
      <div className="max-w-3xl mx-auto w-full my-8">
        {submittedRef ? (
          /* Confirmation View (Without exposing private records) */
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Complaint Registered Successfully</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your medium-voltage equipment service request has been received and routed to our Alfanar Central Dispatch desk.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl max-w-sm mx-auto">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                Official Reference Number
              </span>
              <span className="text-2xl font-mono font-extrabold text-blue-400 block mt-1">
                {submittedRef}
              </span>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-xl text-xs text-slate-400 max-w-lg mx-auto text-left space-y-2 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Security & Privacy Notice</span>
              </div>
              <p>
                To protect client operational confidentiality, live internal service histories, engineer location coordinates, and equipment technical records are accessible only by authorized staff. Please retain your reference number for telephone updates.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setDescription('');
                  setCustomerName('');
                  setCompany('');
                  setConsentAcknowledged(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Submit Another Complaint
              </button>
              {onBackToApp && (
                <button
                  onClick={onBackToApp}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Return to Main Application
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Public Submission Form */
          <form onSubmit={handleSubmit} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Report MV Equipment Issue</h2>
              <p className="text-xs text-slate-400 mt-1">
                Submit an urgent breakdown, trip alarm, or service request directly to the Alfanar Engineering support center.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-900/40 border border-red-700 rounded-xl text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer & Company Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Customer & Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Eng. Mansour Al-Garni"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Saudi Electricity Company / NEOM"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactMobile}
                    onChange={e => setContactMobile(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Site & Equipment Details */}
            <div className="space-y-4 pt-2 border-t border-slate-700/60">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Site Location & Equipment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Site / Substation Name *</label>
                  <input
                    type="text"
                    required
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    placeholder="e.g. Substation 8044 / Red Sea Solar Bay 4"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Region / Province *</label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Central">Central (Riyadh)</option>
                    <option value="Western">Western (Jeddah/Makkah)</option>
                    <option value="Eastern">Eastern (Dammam)</option>
                    <option value="Southern">Southern (Asir/Jazan)</option>
                    <option value="Northern">Northern (Tabuk/NEOM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Equipment Family</label>
                  <select
                    value={equipmentFamily}
                    onChange={e => setEquipmentFamily(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RMU">RMU (Ring Main Unit)</option>
                    <option value="MRMU">MRMU (Modular RMU)</option>
                    <option value="SRMU">SRMU (Smart RMU)</option>
                    <option value="Auto-Recloser">Auto-Recloser (ACR)</option>
                    <option value="LBS">LBS (Load Break Switch)</option>
                    <option value="SLBS">SLBS (Sectionalizer)</option>
                    <option value="Other">Other / Unknown</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">
                    Panel Serial Number (if known from nameplate)
                  </label>
                  <input
                    type="text"
                    value={panelSerialNumber}
                    onChange={e => setPanelSerialNumber(e.target.value)}
                    placeholder="e.g. ALF-RMU-2024-XXXX"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Fault Category & Description */}
            <div className="space-y-4 pt-2 border-t border-slate-700/60">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. Issue Category & Description
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Complaint Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Trip during operation">Trip during operation</option>
                    <option value="Failure to close/open">Failure to close/open</option>
                    <option value="Gas pressure alarm (SF6)">Gas pressure alarm (SF6)</option>
                    <option value="Partial discharge / Arc flash">Partial discharge / Arc flash</option>
                    <option value="Mechanical interlock stuck">Mechanical interlock stuck</option>
                    <option value="Relay trip / Malfunction">Relay trip / Malfunction</option>
                    <option value="Commissioning support">Commissioning support</option>
                    <option value="Routine maintenance">Routine maintenance</option>
                    <option value="Other">Other issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Detailed Symptoms & Operating Circumstances *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe what occurred, any relay trip flags (e.g. 50/51/50N), gas pressure readings, and any urgent site constraints..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="p-3 bg-slate-900/60 border border-slate-700/80 rounded-xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={consentAcknowledged}
                    onChange={e => setConsentAcknowledged(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-800"
                  />
                  <label htmlFor="consent" className="text-[11px] text-slate-400 leading-relaxed cursor-pointer">
                    I confirm that the information provided is accurate and authorize Alfanar Electrical Systems to process these service details for technical dispatch and engineering follow-up.
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Register Complaint & Get Reference'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] text-slate-500 pt-6 border-t border-slate-800">
        Digital MV Customer Service System • Alfanar Electrical Systems • Developed by Kanpri Technologies LLP
      </div>
    </div>
  );
};
