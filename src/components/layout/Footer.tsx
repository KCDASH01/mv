/**
 * Digital MV Customer Service Management System
 * Application Footer
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React from 'react';
import { ShieldAlert, ExternalLink, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenMatrix: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMatrix, onNavigate }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Client / Developer Credit */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-semibold text-slate-200">
            Digital MV Customer Service Management System
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400">
            Client: <strong className="text-slate-300 font-medium">Alfanar Electrical Systems</strong> — MV Customer Service
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400">
            Developed by: <strong className="text-blue-400 font-medium">Kanpri Technologies LLP</strong>
          </span>
        </div>

        {/* Quick Links & Actions */}
        <div className="flex items-center gap-4 text-slate-400 text-xs">
          <button
            onClick={() => onNavigate('user_manual')}
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors underline-offset-4 hover:underline"
          >
            User Manual
          </button>
          <span>·</span>
          <button
            onClick={onOpenMatrix}
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Traceability Matrix
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('public_complaint')}
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Public Intake
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('audit_trail')}
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Audit Trail
          </button>
          <span>·</span>
          <span className="text-[11px] text-slate-400">v1.0 (2026)</span>
        </div>
      </div>
      
      {/* Electrical Safety Permit Disclaimer Banner */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-400/90">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>Safety Mandate:</strong> This system records engineering observations only. It does not authorize MV electrical switching or issue safety permits.
          </span>
        </div>
        <div className="hidden sm:block text-slate-400">
          Confidential & Proprietary to Alfanar Electrical Systems
        </div>
      </div>
    </footer>
  );
};
