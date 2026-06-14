import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, Sun, Moon, User, ShieldAlert, LogOut, Check, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentSection: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSection, onSearchChange }) => {
  const { theme, toggleTheme, currentUser, logout, auditLogs } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  // Build reactive breadcrumbs based on selected Section
  const getBreadcrumbs = () => {
    const list = ['Apex Node'];
    if (currentSection === 'sports') list.push('Sports Modeling');
    else if (currentSection === 'science') list.push('Science & Research');
    else if (currentSection === 'rbac') list.push('Access & Directory');
    else if (currentSection === 'settings') list.push('Platform Settings');
    else list.push('Dashboard');
    return list;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      case 'Researcher': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
      {/* Left side: Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          {getBreadcrumbs().map((b, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-600">/</span>}
              <span className={idx === getBreadcrumbs().length - 1 ? "text-violet-400 font-semibold" : ""}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* Search Input for query filtering */}
        <div className="relative hidden lg:block w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full text-xs bg-slate-950/40 dark:bg-slate-900/40 text-slate-200 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 hover:border-slate-500/30 outline-none transition"
            placeholder="Search telemetry or reports..."
            value={searchVal}
            onChange={handleSearch}
          />
        </div>

        {/* Global Key status */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono glass-panel bg-emerald-500/5 text-emerald-400 border border-emerald-500/25">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Core Live Feed</span>
        </div>

        {/* Theme state control */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
          title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification bell menu dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotificationMenu(!showNotificationMenu); setShowProfileMenu(false); }}
            className={`p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition relative cursor-pointer ${showNotificationMenu ? 'bg-white/5' : ''}`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-3 w-80 glass-panel shadow-2xl rounded-2xl border border-white/10 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5 bg-slate-950/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">System Feed Logs</span>
                <span className="text-[10px] font-mono text-slate-400">Total: {recentLogs.length}</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-3 text-left hover:bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-semibold text-violet-400 truncate max-w-[150px]">{log.action}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 truncate">Initiator: {log.userEmail}</p>
                    <p className="text-[8px] text-slate-500 text-right mt-1 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile actions dropdown */}
        <div className="relative">
          {currentUser ? (
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotificationMenu(false); }}
              className="flex items-center space-x-2 text-left p-1 pr-2 hover:bg-white/5 rounded-xl transition cursor-pointer"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-7 h-7 rounded-lg border border-white/15 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block">
                <p className="text-xs font-medium text-slate-200 max-w-[100px] truncate">{currentUser.displayName}</p>
                <div className="flex items-center space-x-1">
                  <span className={`text-[8px] px-1 py-0 border rounded tracking-wide uppercase font-mono ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="p-1 px-2.5 rounded-lg border border-slate-700 bg-slate-900/50">Anonymous</span>
            </div>
          )}

          {/* Collapsible Profile Settings */}
          {showProfileMenu && currentUser && (
            <div className="absolute right-0 mt-3 w-56 glass-panel shadow-2xl rounded-2xl border border-white/10 py-1 font-sans z-50">
              <div className="px-4 py-3 border-b border-white/5 bg-slate-950/10 text-left">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>

              <div className="px-2 py-1.5 space-y-0.5">
                <div className="flex items-center space-x-1 px-3 py-1 text-[10px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>Access Node Permissions:</span>
                </div>
                <div className="px-3 py-1.5 text-xs bg-slate-950/20 rounded-lg flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Role Assignment</span>
                  <span className={`text-[9px] px-1.5 py-0.5 border rounded-md font-mono ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 mt-1 pt-1">
                <button
                  onClick={() => { setShowProfileMenu(false); logout(); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
