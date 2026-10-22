/**
 * Digital MV Customer Service Management System
 * MODULE 16: GPS Mapping, Site Markers & KML/KMZ Export
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { MapPin, Navigation, Download, CheckCircle2, AlertTriangle, Layers, Compass } from 'lucide-react';

interface SiteLocation {
  id: string;
  name: string;
  customer: string;
  city: string;
  lat: number;
  lng: number;
  activeWorkOrder?: string;
  status: 'In Progress' | 'Scheduled' | 'Nominal';
}

export const GpsMapView: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const sites: SiteLocation[] = [
    {
      id: 'st_01',
      name: 'Riyadh Substation 8044 — Al-Malaz',
      customer: 'Saudi Electricity Company (SEC)',
      city: 'Riyadh',
      lat: 24.6612,
      lng: 46.7289,
      activeWorkOrder: 'WO-2026-0108',
      status: 'In Progress',
    },
    {
      id: 'st_02',
      name: 'Southern Dunes Solar Grid Station',
      customer: 'Red Sea Global Infrastructure',
      city: 'Umluj',
      lat: 25.0489,
      lng: 37.3194,
      activeWorkOrder: 'WO-2026-0109',
      status: 'Scheduled',
    },
    {
      id: 'st_03',
      name: 'Oxagon Light Industrial Park',
      customer: 'NEOM Energy Distribution',
      city: 'Tabuk',
      lat: 27.9158,
      lng: 35.3411,
      status: 'Nominal',
    },
    {
      id: 'st_04',
      name: 'King Salman Park Central Vault B',
      customer: 'King Salman Park Development',
      city: 'Riyadh',
      lat: 24.7214,
      lng: 46.7082,
      status: 'Nominal',
    },
  ];

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setMsg('Browser geolocation not supported.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurrentGps({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
        setGpsLoading(false);
        setMsg('GPS captured on tap with permission. Continuous tracking is strictly disabled.');
        setTimeout(() => setMsg(null), 4000);
      },
      err => {
        setGpsLoading(false);
        setMsg('Location permission denied or unavailable: ' + err.message);
      }
    );
  };

  // Generate KML XML file download
  const handleExportKml = () => {
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Alfanar Digital MV Substation Network</name>
    <description>Authorized Medium Voltage Substation Service Sites</description>
    ${sites
      .map(
        s => `
    <Placemark>
      <name>${s.name}</name>
      <description>Customer: ${s.customer} | Status: ${s.status}</description>
      <Point>
        <coordinates>${s.lng},${s.lat},0</coordinates>
      </Point>
    </Placemark>`
      )
      .join('\n')}
  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Alfanar_MV_Sites_${new Date().toISOString().split('T')[0]}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <MapPin className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">GPS Site Coordinates & GIS Export</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 16
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tap-to-capture location on mobile; authorized substation markers and KML GIS exports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCaptureLocation}
              disabled={gpsLoading}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Detecting...' : 'Capture GPS on Tap'}</span>
            </button>

            <button
              onClick={handleExportKml}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export KML / KMZ</span>
            </button>
          </div>
        </div>

        {msg && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Map Visualizer Display */}
        <div className="mt-6 rounded-xl border border-slate-300 overflow-hidden bg-slate-950 text-white relative h-96 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between z-10">
            <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-800 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Kingdom of Saudi Arabia (KSA) Grid Substation Coverage</span>
            </div>
            {currentGps && (
              <div className="bg-emerald-950/90 border border-emerald-700/80 px-3 py-1.5 rounded-lg text-xs text-emerald-300 font-mono">
                My GPS: {currentGps.lat}, {currentGps.lng}
              </div>
            )}
          </div>

          {/* Interactive Site Marker Overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 z-10">
            {sites.map(site => (
              <div
                key={site.id}
                className="p-3 bg-slate-900/90 backdrop-blur-xs border border-slate-800 rounded-xl space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{site.name}</span>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      site.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : site.status === 'Scheduled'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] truncate">{site.customer}</div>
                <div className="text-[10px] text-blue-400 font-mono pt-1">
                  GPS: {site.lat}° N, {site.lng}° E
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <Compass className="w-64 h-64 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
