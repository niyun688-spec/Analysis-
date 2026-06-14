import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserProfile } from '../types';
import { ShieldCheck, UserCheck, Search, Filter, Trash2, Key, Star, Sparkles, UserPlus, Info, Check, AlertTriangle, Database } from 'lucide-react';

export const RoleManagement: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    usersList,
    updateUserRole,
    deleteUser,
    registerUser,
    auditLogs,
    clearAuditLogs,
    addAuditLog
  } = useApp();

  // LOGIN / REGISTER VIEWS
  const [isRegister, setIsRegister] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [roleSelection, setRoleSelection] = useState<UserRole>('Viewer');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // USER LIST VIEW OPTIONS
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [logFilter, setLogFilter] = useState<'all' | 'SUCCESS' | 'WARNING' | 'FAILED'>('all');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailInput || !passwordInput) {
      setAuthError("Please provide all required fields!");
      return;
    }

    if (isRegister) {
      if (!displayNameInput) {
        setAuthError("Display name is required for registration.");
        return;
      }
      const success = registerUser(emailInput, displayNameInput, roleSelection);
      if (success) {
        const newlyCreated = usersList.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
        // Auto sign in as newly created user
        const finalUser = newlyCreated || {
          uid: `u-${Date.now()}`,
          email: emailInput.toLowerCase(),
          displayName: displayNameInput,
          role: roleSelection,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(finalUser);
        addAuditLog(`User registration & logging successfully: ${emailInput}`, 'SUCCESS');
      } else {
        setAuthError("Email already registered in database.");
      }
    } else {
      // Login flow
      const matched = usersList.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
      if (matched) {
        // Authenticate any generic testing password for frictionless experience
        setCurrentUser(matched);
        addAuditLog(`Successful sign-in: ${emailInput} (${matched.role})`, 'SUCCESS');
      } else {
        setAuthError("Account not found. Consider selecting 'Create Account' option.");
      }
    }
  };

  const handleRoleChange = (uid: string, nextRole: UserRole) => {
    if (currentUser?.role !== 'Admin') {
      alert("Permission denied. Only Administrator accounts can alter client security settings.");
      return;
    }
    updateUserRole(uid, nextRole);
  };

  const handleDeleteUser = (uid: string) => {
    if (currentUser?.role !== 'Admin') {
      alert("Permission denied. Only Admins can offboard clients.");
      return;
    }
    const success = deleteUser(uid);
    if (!success) {
      alert("Self de-authorization blocked. Create another Admin before purging current node.");
    }
  };

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredLogs = auditLogs.filter(log => {
    return logFilter === 'all' || log.status === logFilter;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      case 'Researcher': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  // --- RENDERING SPLIT SCREEN AUTH PAGE IF USER IS NOT LOGGED IN ---
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-sans">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
          
          {/* Left Panel: Aesthetic branding & quick demo shortcuts */}
          <div className="bg-gradient-to-br from-violet-950 via-purple-900 to-slate-950 p-8 text-left flex flex-col justify-between relative overflow-hidden hidden md:flex">
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-violet-300 uppercase tracking-widest leading-none">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apex Access Control</span>
              </div>
              <h3 className="text-3xl font-bold font-display leading-tight text-white bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                Secure Multi-Domain Analytics Gateway.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
                Unlock granular ELO predictive simulations, live sat-weather radars, and chemical compound toolkits with role-based dashboard states.
              </p>
            </div>

            {/* Quick swap account tags */}
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2.5 relative z-10">
              <span className="text-[9px] font-mono font-bold text-violet-400 uppercase tracking-widest">Active Test Accounts</span>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setEmailInput('admin@apex.io');
                    setPasswordInput('admin');
                    setIsRegister(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 text-slate-300 cursor-pointer text-left"
                >
                  <span>Admin Mode (All tools)</span>
                  <span className="text-[10px] font-mono text-violet-400">admin@apex.io</span>
                </button>
                <button
                  onClick={() => {
                    setEmailInput('researcher@apex.io');
                    setPasswordInput('research');
                    setIsRegister(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 text-slate-300 cursor-pointer text-left"
                >
                  <span>Researcher (Edit data)</span>
                  <span className="text-[10px] font-mono text-sky-400">researcher@apex.io</span>
                </button>
                <button
                  onClick={() => {
                    setEmailInput('viewer@apex.io');
                    setPasswordInput('viewer');
                    setIsRegister(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 text-slate-300 cursor-pointer text-left"
                >
                  <span>Viewer (Read-only)</span>
                  <span className="text-[10px] font-mono text-slate-400">viewer@apex.io</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Sign In / Register Form */}
          <div className="p-8 text-left bg-slate-950/60 flex flex-col justify-center">
            <h4 className="text-xl font-bold text-white font-display">
              {isRegister ? 'Provision Security Node' : 'Initialize Analytics Session'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              {isRegister ? 'Establish custom user credentials and assign access levels.' : 'Sign in to access secure forecasting channels.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Alexander Wright"
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none text-white focus:border-violet-500"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none text-white focus:border-violet-500"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Access Token / Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none text-white focus:border-violet-500"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Initial Role Matrix</label>
                  <select
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none text-slate-300 focus:border-violet-500"
                    value={roleSelection}
                    onChange={(e) => setRoleSelection(e.target.value as UserRole)}
                  >
                    <option value="Viewer">Viewer (Read-only access)</option>
                    <option value="Researcher">Researcher (Edit data + metrics)</option>
                    <option value="Admin">Admin (Full administrative privileges)</option>
                  </select>
                </div>
              )}

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-mono leading-tight">
                  ⚠️ {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isRegister ? 'Setup Subscription' : 'Verify Credentials'}</span>
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setAuthError(null);
                }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ACCESS CONTROL INTERFACE (LOGGED IN) ---
  return (
    <div className="space-y-6">
      
      {/* Active User Alert and Info Shield */}
      <div className="glass-panel text-left p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between border-l-4 border-violet-500">
        <div>
          <span className="text-[10px] font-mono text-violet-400 uppercase font-bold block mb-0.5">RBAC Access Active</span>
          <p className="text-xs text-slate-300">
            Currently logged in as <strong className="text-white">{currentUser.displayName}</strong>. You hold <span className="text-violet-400 font-semibold uppercase">{currentUser.role}</span> capabilities.
          </p>
        </div>
        <div className="flex space-x-2.5 mt-3 md:mt-0">
          <span className="text-[9px] bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-400">
            Viewer = Read Only
          </span>
          <span className="text-[9px] bg-sky-500/10 border border-sky-500/20 rounded px-2.5 py-1 text-sky-400">
            Researcher = Edit Data
          </span>
          <span className="text-[9px] bg-violet-500/10 border border-violet-500/20 rounded px-2.5 py-1 text-violet-400 font-bold">
            Admin = All Nodes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* User Management panel (Admin only) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between relative">
          
          {/* Permission shielding for non-admins */}
          {currentUser.role !== 'Admin' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
              <ShieldCheck className="w-12 h-12 text-violet-400 mb-3 animate-bounce" />
              <h4 className="text-sm font-bold text-white font-display">Administrative Rights Shielded</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                The User Subscriptions table is reserved exclusively for system Administrators. Please re-authenticate as an Admin to check directory controls.
              </p>
              <button
                onClick={() => setCurrentUser(null)}
                className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-xs text-white rounded-lg cursor-pointer"
              >
                Sign In as Administrator
              </button>
            </div>
          )}

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest">Active User Directory</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Control access credentials and modify role matrices.</p>
              </div>

              {/* Filters line */}
              <div className="flex gap-2.5">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="text-[10px] pl-8 pr-3 py-1 bg-slate-950/60 border border-slate-800 rounded-lg outline-none text-slate-200 w-32 focus:w-44 transition-all"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <select
                  className="text-[10px] px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-lg outline-none text-slate-400"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            {/* Users list grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                    <th className="pb-3 pl-2">Display User</th>
                    <th className="pb-3">Role Level</th>
                    <th className="pb-3 text-right pr-2">Action Matrices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 pl-2 flex items-center space-x-2.5">
                        <img
                          src={user.avatarUrl}
                          className="w-8 h-8 rounded-lg border border-slate-800"
                          alt="avatar"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <span className="font-semibold text-slate-200 block truncate max-w-[150px]">{user.displayName}</span>
                          <span className="text-[9px] text-slate-500 font-mono block truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <select
                          className="text-[10px] font-mono bg-slate-950 border border-slate-800 rounded-md px-1.5 py-0.5 text-violet-400 tracking-wide"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                        >
                          <option value="Viewer">Viewer</option>
                          <option value="Researcher">Researcher</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          className="p-1 px-2 border border-slate-800 hover:border-rose-500 hover:text-rose-400 rounded-lg transition text-slate-500 cursor-pointer text-[10px]"
                        >
                          De-authorize
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log table */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest">System Audit Logs</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time platform action tracking.</p>
              </div>
              
              {currentUser.role === 'Admin' && (
                <button
                  onClick={clearAuditLogs}
                  className="text-[9px] font-mono uppercase text-rose-500 hover:text-rose-400"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {/* Filter status buttons */}
            <div className="flex gap-1 mb-4">
              {(['all', 'SUCCESS', 'WARNING', 'FAILED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setLogFilter(st)}
                  className={`text-[8px] font-mono px-2 py-0.5 border rounded uppercase ${
                    logFilter === st
                      ? 'border-violet-500 text-violet-300 bg-violet-500/10'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-1.5 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-200 truncate pr-2">{log.action}</span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/15 text-emerald-400' :
                      log.status === 'WARNING' ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>{log.userEmail.split('@')[0]} ({log.role})</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
