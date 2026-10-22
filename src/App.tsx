/**
 * Digital MV Customer Service Management System
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 * 
 * Main Application Shell & 20-Module Router
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/auth';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { RequirementsMatrixModal } from './components/common/RequirementsMatrixModal';
import { Complaint } from './types';

// Modules
import { DashboardView } from './modules/01_Dashboard/DashboardView';
import { PublicComplaintView } from './modules/02_Complaints/PublicComplaintView';
import { ComplaintListView } from './modules/02_Complaints/ComplaintListView';
import { WorkOrderListView } from './modules/03_WorkOrders/WorkOrderListView';
import { CreateWorkOrderModal } from './modules/03_WorkOrders/CreateWorkOrderModal';
import { JobTimerWidget } from './modules/05_Timer/JobTimerWidget';
import { SupervisorTimerReview } from './modules/05_Timer/SupervisorTimerReview';
import { SiteVisitWizard } from './modules/04_SiteVisits/SiteVisitWizard';
import { TechnicalInspectionsView } from './modules/05_Inspections/TechnicalInspectionsView';
import { EquipmentRegisterView } from './modules/06_Equipment/EquipmentRegisterView';
import { NcrListView } from './modules/07_NCR/NcrListView';
import { MaterialsView } from './modules/08_Materials/MaterialsView';
import { RemoteSupportView } from './modules/09_RemoteSupport/RemoteSupportView';
import { ShutdownPlanningView } from './modules/10_Shutdown/ShutdownPlanningView';
import { CommissioningView } from './modules/11_Commissioning/CommissioningView';
import { MaintenanceView } from './modules/12_Maintenance/MaintenanceView';
import { CustomerClosureView } from './modules/13_CustomerClosure/CustomerClosureView';
import { TrainingView } from './modules/14_Training/TrainingView';
import { EvidenceLibraryView } from './modules/15_Evidence/EvidenceLibraryView';
import { GpsMapView } from './modules/16_Maps/GpsMapView';
import { ReportsView } from './modules/17_Reports/ReportsView';
import { AuditTrailView } from './modules/18_AuditTrail/AuditTrailView';
import { UsersRolesView } from './modules/19_Users/UsersRolesView';
import { NotificationsView } from './modules/20_Notifications/NotificationsView';
import { UserManualView } from './modules/UserManual/UserManualView';

const MainShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  // Work order creation modal triggered from complaint
  const [activeComplaintForWo, setActiveComplaintForWo] = useState<Complaint | null>(null);
  const [showCreateWoModal, setShowCreateWoModal] = useState<boolean>(false);

  // Timer selected work order
  const [selectedWoForTimer, setSelectedWoForTimer] = useState<string | undefined>(undefined);
  const [selectedWoForWizard, setSelectedWoForWizard] = useState<string | undefined>(undefined);

  const handleLaunchTimer = (workOrderId: string) => {
    setSelectedWoForTimer(workOrderId);
    setCurrentTab('job_timer');
  };

  const handleLaunchWizard = (workOrderId: string) => {
    setSelectedWoForWizard(workOrderId);
    setCurrentTab('site_wizard');
  };

  const handleOpenCreateWo = (complaint: Complaint) => {
    setActiveComplaintForWo(complaint);
    setShowCreateWoModal(true);
  };

  // If user navigated to Public Complaint view, render full-screen public experience
  if (currentTab === 'public_complaint') {
    return <PublicComplaintView onBackToApp={() => setCurrentTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenMatrix={() => setShowMatrixModal(true)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* View Router */}
            {currentTab === 'dashboard' && (
              <DashboardView
                onNavigate={setCurrentTab}
                onOpenMatrix={() => setShowMatrixModal(true)}
              />
            )}

            {currentTab === 'complaints' && (
              <ComplaintListView onCreateWorkOrder={handleOpenCreateWo} />
            )}

            {currentTab === 'work_orders' && (
              <WorkOrderListView
                onLaunchTimer={handleLaunchTimer}
                onLaunchWizard={handleLaunchWizard}
              />
            )}

            {currentTab === 'job_timer' && (
              <JobTimerWidget
                selectedWorkOrderId={selectedWoForTimer}
                onNavigateToWizard={handleLaunchWizard}
              />
            )}

            {currentTab === 'supervisor_queue' && (
              <SupervisorTimerReview />
            )}

            {currentTab === 'site_wizard' && (
              <SiteVisitWizard
                initialWorkOrderId={selectedWoForWizard}
                onSubmitted={() => setCurrentTab('supervisor_queue')}
              />
            )}

            {currentTab === 'inspections' && (
              <TechnicalInspectionsView />
            )}

            {currentTab === 'equipment' && (
              <EquipmentRegisterView />
            )}

            {currentTab === 'ncr' && (
              <NcrListView />
            )}

            {currentTab === 'materials' && (
              <MaterialsView />
            )}

            {currentTab === 'remote_support' && (
              <RemoteSupportView />
            )}

            {currentTab === 'shutdown' && (
              <ShutdownPlanningView />
            )}

            {currentTab === 'commissioning' && (
              <CommissioningView />
            )}

            {currentTab === 'maintenance' && (
              <MaintenanceView />
            )}

            {currentTab === 'customer_closure' && (
              <CustomerClosureView />
            )}

            {currentTab === 'training' && (
              <TrainingView />
            )}

            {currentTab === 'evidence' && (
              <EvidenceLibraryView />
            )}

            {currentTab === 'maps' && (
              <GpsMapView />
            )}

            {currentTab === 'reports' && (
              <ReportsView />
            )}

            {currentTab === 'audit_trail' && (
              <AuditTrailView />
            )}

            {currentTab === 'users' && (
              <UsersRolesView />
            )}

            {currentTab === 'notifications' && (
              <NotificationsView />
            )}

            {currentTab === 'user_manual' && (
              <UserManualView onNavigateToTab={setCurrentTab} />
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer
        onOpenMatrix={() => setShowMatrixModal(true)}
        onNavigate={setCurrentTab}
      />

      {/* Requirements Matrix Modal */}
      <RequirementsMatrixModal
        isOpen={showMatrixModal}
        onClose={() => setShowMatrixModal(false)}
      />

      {/* Create Work Order Modal */}
      <CreateWorkOrderModal
        complaint={activeComplaintForWo}
        isOpen={showCreateWoModal}
        onClose={() => {
          setShowCreateWoModal(false);
          setActiveComplaintForWo(null);
        }}
        onCreated={(newWoId) => {
          setSelectedWoForTimer(newWoId);
          setCurrentTab('work_orders');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainShell />
    </AuthProvider>
  );
}
