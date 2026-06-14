/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { SportsPredictions } from './components/SportsPredictions';
import { ScienceDashboard } from './components/ScienceDashboard';
import { RoleManagement } from './components/RoleManagement';
import { Settings } from './components/Settings';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Cpu, RefreshCw, BarChart2 } from 'lucide-react';

function DashboardContainer() {
  const { theme, currentUser, addAuditLog } = useApp();
  
  // Use a hash-based routing strategy so reload is fully persistent in iframe
  const [section, setSection] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '');
    return ['sports', 'science', 'rbac', 'settings'].includes(hash) ? hash : 'sports';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (['sports', 'science', 'rbac', 'settings'].includes(hash)) {
        setSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetSection = (nextSection: string) => {
    setIsLoading(true);
    window.location.hash = `#/${nextSection}`;
    setSection(nextSection);
    addAuditLog(`Navigated to section: ${nextSection.toUpperCase()}`, 'SUCCESS');
    
    // Simulate skeleton loader trigger
    setTimeout(() => {
      setIsLoading(false);
    }, 380);
  };

  const renderActiveSection = () => {
    switch (section) {
      case 'sports':
        return <SportsPredictions />;
      case 'science':
        return <ScienceDashboard />;
      case 'rbac':
        return <RoleManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <SportsPredictions />;
    }
  };

  const getSectionTitle = () => {
    switch (section) {
      case 'sports': return 'Sports Predictions & Meteorology';
      case 'science': return 'Science, Biology & Statistics';
      case 'rbac': return 'Access Directory Control (RBAC)';
      case 'settings': return 'Apex Node Settings';
      default: return 'Dashboards';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Dynamic atmospheric ambient gradients */}
      <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />

      {/* Persistent Left Sidebar - Handles collapsible states and responsive tab layouts */}
      <Sidebar currentSection={section} setSection={handleSetSection} />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0 pt-14 md:pt-0">
        
        {/* Persistent Top Navbar with active section indicators */}
        <Navbar currentSection={section} />

        {/* Viewport page container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-grid-mesh relative z-10">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Display header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between text-left gap-4 pb-2 border-b border-white/5">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center space-x-2">
                  <span>{getSectionTitle()}</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Apex analytical telemetry processor — online node.
                </p>
              </div>

              {/* Status capsule */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 font-mono text-[10px]">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Role active:</span>
                <span className="font-bold text-violet-400 uppercase">{currentUser ? currentUser.role : 'Viewer'}</span>
              </div>
            </div>

            {/* Skeleton visual loader while data/coordinates switch */}
            {isLoading ? (
              <div className="space-y-6 animate-pulse text-left py-6">
                <div className="h-6 w-1/3 bg-slate-800 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-44 bg-slate-900/60 border border-slate-800 rounded-2xl p-6" />
                  <div className="h-44 bg-slate-900/60 border border-slate-800 rounded-2xl p-6" />
                  <div className="h-44 bg-slate-900/60 border border-slate-800 rounded-2xl p-6" />
                </div>
                <div className="h-64 bg-slate-900/60 border border-slate-800 rounded-2xl" />
              </div>
            ) : (
              /* High-fidelity view transition element */
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {renderActiveSection()}
                </motion.div>
              </AnimatePresence>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContainer />
    </AppProvider>
  );
}
