import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, HelpCircle, GraduationCap, ShieldAlert, Settings, PanelLeftClose, PanelLeft, Sparkles, Menu, X } from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  setSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, setSection }) => {
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'sports', name: 'Sports Predictors', icon: Trophy, desc: 'IPL & ELO WC Models' },
    { id: 'science', name: 'Science & Research', icon: GraduationCap, desc: 'Astro, Bio & Stats' },
    { id: 'rbac', name: 'Access Directory', icon: ShieldAlert, desc: 'Role Management & Auth' },
    { id: 'settings', name: 'Platform Settings', icon: Settings, desc: 'API Keys & Profiles' }
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'border-violet-500/30 text-violet-300 bg-violet-500/5';
      case 'Researcher': return 'border-sky-500/30 text-sky-300 bg-sky-500/5';
      default: return 'border-slate-500/30 text-slate-300 bg-slate-500/5';
    }
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR - Hidden on mobile, visible from md matches responsive layout */}
      <aside
        className={`hidden md:flex flex-col h-screen h-sticky top-0 left-0 transition-all duration-300 ease-in-out glass-panel border-r border-white/5 bg-slate-950/60 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header Title */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 text-white">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 shadow-lg glow-primary">
                <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide font-display bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  APEX ANALYTICS
                </span>
                <span className="text-[9px] font-mono text-violet-400 tracking-widest uppercase">
                  Prediction Node
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="p-1 px-1.5 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 mx-auto">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* User context card inside sidebar */}
        {!isCollapsed && currentUser && (
          <div className="m-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center space-x-3">
            <img
              src={currentUser.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-lg object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-white truncate">{currentUser.displayName}</h4>
              <p className="text-[10px] text-slate-400 truncate mb-1">{currentUser.email}</p>
              <span className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-md uppercase ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation items list */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/25 to-pink-600/10 text-white border-l-2 border-violet-500 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-violet-400 scale-110' : 'text-slate-400 group-hover:scale-105'}`} />
                
                {!isCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className="text-xs">{item.name}</span>
                    <span className="text-[9px] text-slate-500 leading-none mt-0.5 group-hover:text-slate-400">{item.desc}</span>
                  </div>
                )}

                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Project copyright footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/5 text-center">
            <p className="text-[9px] font-mono text-slate-500">
              © 2026 Apex Engine v1.4
            </p>
          </div>
        )}
      </aside>

      {/* 2. MOBILE BOTTOM NAVIGATION + HAMBURGER MENU BLOCK */}
      <div className="md:hidden">
        {/* Top bar with hamburger trigger on mobile view */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-40">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-violet-600">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-slate-100 font-display">APEX</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 px-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile slide-out side card navigation from top */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-40 pt-16 px-4 pb-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-mono text-slate-400">Section Directory</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-xs text-rose-400 uppercase font-mono">
                [Close]
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto py-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-l-2 transition ${
                      currentSection === item.id
                        ? 'bg-violet-700/25 border-violet-500 text-white'
                        : 'bg-slate-900/40 border-transparent text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-violet-400" />
                      <div className="text-left">
                        <p className="text-xs font-medium">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {currentUser && (
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 flex items-center space-x-3">
                <img src={currentUser.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">{currentUser.displayName}</p>
                  <p className="text-[9px] font-mono text-violet-400 uppercase">{currentUser.role} Account Activated</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sticky persistent responsive bottom tab bar */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-2 z-40">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all text-center rounded-lg ${
                  isActive ? 'text-violet-400 font-medium' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]' : ''}`} />
                <span className="text-[9px] tracking-tight">{item.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
