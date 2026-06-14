import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuditLog } from '../types';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  usersList: UserProfile[];
  updateUserRole: (uid: string, nextRole: UserRole) => boolean;
  deleteUser: (uid: string) => boolean;
  registerUser: (email: string, displayName: string, role: UserRole) => boolean;
  logout: () => void;
  apiKeyWeather: string;
  setApiKeyWeather: (key: string) => void;
  apiKeyNasa: string;
  setApiKeyNasa: (key: string) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, status: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
  clearAuditLogs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Accounts
const SEEDED_USERS: UserProfile[] = [
  {
    uid: 'u-admin',
    email: 'admin@apex.io',
    displayName: 'Administrator (Apex Team)',
    role: 'Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-10T12:00:00Z'
  },
  {
    uid: 'u-researcher',
    email: 'researcher@apex.io',
    displayName: 'Dr. Sarah Jenkins',
    role: 'Researcher',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-03-14T09:15:00Z'
  },
  {
    uid: 'u-viewer',
    email: 'viewer@apex.io',
    displayName: 'Alex Rivera',
    role: 'Viewer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-05-20T14:45:00Z'
  }
];

const METADATA_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-06-13T10:05:12-07:00', action: 'Platform initialization bootstrapped', userEmail: 'system@apex.io', role: 'Admin', ipAddress: '127.0.0.1', status: 'SUCCESS' },
  { id: 'log-2', timestamp: '2026-06-13T12:30:45-07:00', action: 'NASA APOD API connected', userEmail: 'researcher@apex.io', role: 'Researcher', ipAddress: '192.168.1.42', status: 'SUCCESS' },
  { id: 'log-3', timestamp: '2026-06-13T15:10:24-07:00', action: 'Failed query: Incompatible ELO rating query', userEmail: 'viewer@apex.io', role: 'Viewer', ipAddress: '10.0.0.12', status: 'WARNING' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state - DEFAULT TO DARK
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('apex_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Auth simulation
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('apex_current_user');
    return saved ? JSON.parse(saved) : SEEDED_USERS[0]; // Logged in as Admin by default so they see full features instantly
  });

  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('apex_users_list');
    return saved ? JSON.parse(saved) : SEEDED_USERS;
  });

  // API keys - Default specified in spec
  const [apiKeyWeather, setApiKeyWeatherInner] = useState<string>(() => {
    return localStorage.getItem('apex_api_key_weather') || 'b2f11665007e2fb168b87b8ba0362d79';
  });

  const [apiKeyNasa, setApiKeyNasaInner] = useState<string>(() => {
    return localStorage.getItem('apex_api_key_nasa') || 'QhAq6dQ1cFTmRjCK0gEndXgWltcr9vienWh4Rbk3';
  });

  // Audit configuration
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('apex_audit_logs');
    return saved ? JSON.parse(saved) : METADATA_LOGS;
  });

  // Apply dark mode class to html
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

  // Sync auth and lists
  useEffect(() => {
    localStorage.setItem('apex_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('apex_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('apex_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('apex_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setApiKeyWeather = (key: string) => {
    setApiKeyWeatherInner(key);
    localStorage.setItem('apex_api_key_weather', key);
    addAuditLog(`OpenWeatherMap configuration key updated: ${key.substring(0, 4)}***`, 'SUCCESS');
  };

  const setApiKeyNasa = (key: string) => {
    setApiKeyNasaInner(key);
    localStorage.setItem('apex_api_key_nasa', key);
    addAuditLog(`NASA SDK configuration key updated: ${key.substring(0, 4)}***`, 'SUCCESS');
  };

  const addAuditLog = (action: string, status: 'SUCCESS' | 'WARNING' | 'FAILED') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      userEmail: currentUser ? currentUser.email : 'anonymous@apex.io',
      role: currentUser ? currentUser.role : 'Viewer',
      ipAddress: '157.45.18.99',
      status
    };
    setAuditLogs((prev) => [newLog, ...prev].slice(0, 50)); // limit logs to 50
  };

  const registerUser = (email: string, displayName: string, role: UserRole): boolean => {
    // Basic verification
    const exists = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newUser: UserProfile = {
      uid: `u-${Date.now()}`,
      email: email.toLowerCase(),
      displayName,
      role,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString()
    };

    setUsersList((prev) => [...prev, newUser]);
    addAuditLog(`Registered new user account: ${email} (${role})`, 'SUCCESS');
    return true;
  };

  const updateUserRole = (uid: string, nextRole: UserRole): boolean => {
    if (!currentUser || currentUser.role !== 'Admin') {
      addAuditLog(`Unauthorized attempt to modify user role by ${currentUser?.email}`, 'WARNING');
      return false;
    }

    setUsersList((prev) =>
      prev.map((user) => {
        if (user.uid === uid) {
          const updated = { ...user, role: nextRole };
          // If editing their own role, update current user context too
          if (currentUser.uid === uid) {
            setCurrentUser(updated);
          }
          addAuditLog(`Modified permission matrix for ${user.email} -> ${nextRole}`, 'SUCCESS');
          return updated;
        }
        return user;
      })
    );
    return true;
  };

  const deleteUser = (uid: string): boolean => {
    if (!currentUser || currentUser.role !== 'Admin') {
      addAuditLog(`Unauthorized attempt to delete user by ${currentUser?.email}`, 'WARNING');
      return false;
    }

    // Don't delete themselves
    if (currentUser.uid === uid) {
      addAuditLog(`Self-destruction blocked for ${currentUser.email}`, 'FAILED');
      return false;
    }

    const targetedUser = usersList.find((u) => u.uid === uid);
    if (!targetedUser) return false;

    setUsersList((prev) => prev.filter((user) => user.uid !== uid));
    addAuditLog(`De-provisioned client subscription account: ${targetedUser.email}`, 'SUCCESS');
    return true;
  };

  const logout = () => {
    addAuditLog(`User sign out initiated for ${currentUser?.email}`, 'SUCCESS');
    setCurrentUser(null);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    addAuditLog(`Audit history logs cleared`, 'SUCCESS');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        usersList,
        updateUserRole,
        deleteUser,
        registerUser,
        logout,
        apiKeyWeather,
        setApiKeyWeather,
        apiKeyNasa,
        setApiKeyNasa,
        auditLogs,
        addAuditLog,
        clearAuditLogs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
