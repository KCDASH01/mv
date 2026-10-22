/**
 * Digital MV Customer Service Management System
 * Authentication & Authorization Context
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { db } from './db';

interface AuthContextType {
  currentUser: User | null;
  activeRole: UserRole;
  allUsers: User[];
  loginAs: (userId: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  isFieldEngineer: boolean;
  isSupervisor: boolean;
  isQcaStore: boolean;
  isManager: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'digital_mv_current_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const allUsers = db.getUsers();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (savedId) {
      const found = allUsers.find(u => u.id === savedId);
      if (found) return found;
    }
    // Default to Dispatcher / Supervisor for broad administrative and workflow demonstration
    return allUsers.find(u => u.role === 'dispatcher_supervisor') || allUsers[0];
  });

  const activeRole: UserRole = currentUser ? currentUser.role : 'public_reporter';

  const loginAs = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, user.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const switchRole = (role: UserRole) => {
    const candidate = allUsers.find(u => u.role === role);
    if (candidate) {
      loginAs(candidate.id);
    }
  };

  const isFieldEngineer = activeRole === 'field_engineer';
  const isSupervisor = activeRole === 'dispatcher_supervisor';
  const isQcaStore = activeRole === 'qca_store';
  const isManager = activeRole === 'manager_auditor';
  const isAdmin = activeRole === 'admin';

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return permission === 'public_submit';
    if (isAdmin) return true;

    switch (permission) {
      case 'triage_complaint':
      case 'create_work_order':
      case 'reassign_work_order':
      case 'approve_visit_report':
      case 'review_timer':
        return isSupervisor;

      case 'record_timer':
      case 'submit_visit_report':
      case 'accept_decline_work_order':
        return isFieldEngineer;

      case 'review_ncr':
      case 'issue_stock':
      case 'receive_stock':
      case 'manage_inventory':
        return isQcaStore;

      case 'close_case':
        return isSupervisor || isManager;

      case 'view_reports':
      case 'view_audit_trail':
      case 'export_data':
        return isSupervisor || isManager || isAdmin;

      case 'manage_users':
      case 'system_settings':
        return isAdmin;

      default:
        return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        allUsers,
        loginAs,
        logout,
        switchRole,
        hasPermission,
        isFieldEngineer,
        isSupervisor,
        isQcaStore,
        isManager,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
