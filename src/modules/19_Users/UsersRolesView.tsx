/**
 * Digital MV Customer Service Management System
 * MODULE 19: Users Management & RBAC Permissions Matrix
 * Client: Alfanar Electrical Systems — MV Customer Service
 * Developed by: Kanpri Technologies LLP
 */

import React, { useState } from 'react';
import { db } from '../../services/db';
import { useAuth } from '../../services/auth';
import { User, UserRole } from '../../types';
import { Users, Plus, Shield, Check, X, Key, UserCheck } from 'lucide-react';

export const UsersRolesView: React.FC = () => {
  const { currentUser, loginAs } = useAuth();
  const [users, setUsers] = useState<User[]>(() => db.getUsers());
  const [showAddModal, setShowAddModal] = useState(false);

  // New user fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('field_engineer');
  const [phone, setPhone] = useState('+966 50 ');
  const [dept, setDept] = useState('Field Engineering');
  const [empCode, setEmpCode] = useState('ALF-FE-');

  const permissionsMatrix = [
    { name: 'Submit Public Intake', public: true, eng: true, disp: true, qca: true, mgr: true, adm: true },
    { name: 'Triage Complaints & Classify', public: false, eng: false, disp: true, qca: false, mgr: true, adm: true },
    { name: 'Create & Assign Work Orders', public: false, eng: false, disp: true, qca: false, mgr: true, adm: true },
    { name: 'Operate 3-Stage Site Timer', public: false, eng: true, disp: false, qca: false, mgr: false, adm: true },
    { name: 'Complete Multi-Panel Inspection', public: false, eng: true, disp: false, qca: false, mgr: false, adm: true },
    { name: 'Supervisor Approve/Return Timer', public: false, eng: false, disp: true, qca: false, mgr: true, adm: true },
    { name: 'QCA Quality Disposition on NCRs', public: false, eng: false, disp: false, qca: true, mgr: true, adm: true },
    { name: 'Commit Spare Part Stock Tx', public: false, eng: false, disp: false, qca: true, mgr: false, adm: true },
    { name: 'Execute Case Customer Closure', public: false, eng: false, disp: true, qca: false, mgr: true, adm: true },
    { name: 'View Audit Trail & 25-Col Exports', public: false, eng: false, disp: true, qca: true, mgr: true, adm: true },
    { name: 'Manage System Users & Security', public: false, eng: false, disp: false, qca: false, mgr: false, adm: true },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const newUser = db.createUser(
      {
        name,
        email,
        role,
        phone,
        department: dept,
        employeeCode: empCode,
        isActive: true,
      },
      currentUser
    );
    setUsers(db.getUsers());
    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Users & Role-Based Access Control (RBAC)</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Module 19
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Named user accounts, least-privilege security policies, and department roles.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Staff Account</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Employee Name</th>
                <th className="py-2.5 px-3">Emp Code / Email</th>
                <th className="py-2.5 px-3">Role & Permissions</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Switch Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.phone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-blue-700 font-semibold">{u.employeeCode}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 capitalize">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{u.department}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => loginAs(u.id)}
                      className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                        currentUser?.id === u.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {currentUser?.id === u.id ? 'Current User' : 'Log In As'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RBAC Security Matrix */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Server-Side Authorization Matrix (RBAC Rules)</h3>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-2 px-3">Capability / Operation</th>
                  <th className="py-2 px-2 text-center">Public</th>
                  <th className="py-2 px-2 text-center">Engineer</th>
                  <th className="py-2 px-2 text-center">Dispatcher</th>
                  <th className="py-2 px-2 text-center">QCA / Store</th>
                  <th className="py-2 px-2 text-center">Manager</th>
                  <th className="py-2 px-2 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsMatrix.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">{p.name}</td>
                    <td className="py-2.5 px-2 text-center">{p.public ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                    <td className="py-2.5 px-2 text-center">{p.eng ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                    <td className="py-2.5 px-2 text-center">{p.disp ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                    <td className="py-2.5 px-2 text-center">{p.qca ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                    <td className="py-2.5 px-2 text-center">{p.mgr ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                    <td className="py-2.5 px-2 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base">Create Individual Staff Account</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Eng. Sami Al-Ghamdi"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sami.ghamdi@alfanar.com"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assigned Role *</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-semibold"
                    >
                      <option value="field_engineer">Field Engineer</option>
                      <option value="dispatcher_supervisor">Dispatcher / Supervisor</option>
                      <option value="qca_store">QCA / Store</option>
                      <option value="manager_auditor">Manager / Auditor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Employee Code</label>
                    <input
                      type="text"
                      value={empCode}
                      onChange={e => setEmpCode(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                  >
                    Create Account
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
