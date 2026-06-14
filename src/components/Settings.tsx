import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Eye, EyeOff, Save, RefreshCw, Key, ShieldCheck, Star } from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    apiKeyWeather,
    setApiKeyWeather,
    apiKeyNasa,
    setApiKeyNasa,
    addAuditLog
  } = useApp();

  const [displayNameInput, setDisplayNameInput] = useState(currentUser?.displayName || 'Dr. Alice Rivera');
  const [weatherInput, setWeatherInput] = useState(apiKeyWeather);
  const [nasaInput, setNasaInput] = useState(apiKeyNasa);
  const [showWeatherKey, setShowWeatherKey] = useState(false);
  const [showNasaKey, setShowNasaKey] = useState(false);

  const [toggles, setToggles] = useState({
    saasAlerts: true,
    weeklyForecasts: false,
    auditLogging: true
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = { ...currentUser, displayName: displayNameInput };
    setCurrentUser(updated);
    addAuditLog(`User profile updated display name to: "${displayNameInput}"`, 'SUCCESS');
    alert("Profile settings synchronized!");
  };

  const handleKeysSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKeyWeather(weatherInput);
    setApiKeyNasa(nasaInput);
    alert("API Configuration keys stored in localStorage successfully.");
  };

  const restoreDefaultKeys = () => {
    setWeatherInput('b2f11665007e2fb168b87b8ba0362d79');
    setNasaInput('QhAq6dQ1cFTmRjCK0gEndXgWltcr9vienWh4Rbk3');
    setApiKeyWeather('b2f11665007e2fb168b87b8ba0362d79');
    setApiKeyNasa('QhAq6dQ1cFTmRjCK0gEndXgWltcr9vienWh4Rbk3');
    addAuditLog(`Restored standard default API keys`, 'SUCCESS');
    alert("Factory standard verification keys restored.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left font-sans">
      
      {/* Profile detail controls */}
      <div className="glass-panel rounded-2xl p-6">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
          Client Profile Customization
        </h4>
        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
          Update the profile details of the current logged-in node. Changes are tracked inside system audit records.
        </p>

        {currentUser ? (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={currentUser.avatarUrl}
                alt="user avatar"
                className="w-14 h-14 rounded-xl border border-slate-700 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Registration Token: {currentUser.uid}</span>
                <span className="text-xs text-slate-200 block font-semibold">{currentUser.email}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded border bg-violet-500/10 text-violet-300 font-mono uppercase mt-1 inline-block">
                  {currentUser.role} PRIVILEGES
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">User Identifier Name</label>
              <input
                type="text"
                className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none text-white focus:border-violet-500"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-violet-600 text-xs font-semibold text-white rounded-lg hover:bg-violet-700 cursor-pointer"
            >
              Update Identifier Name
            </button>
          </form>
        ) : (
          <div className="p-4 bg-slate-900/40 rounded-xl text-xs text-slate-500 text-center">
            No active profiles registered. Establish an auth matrix identity.
          </div>
        )}
      </div>

      {/* API Key management */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
              Analytical API Key manager (LocalStorage)
            </h4>
            <button
              onClick={restoreDefaultKeys}
              className="text-[9px] font-mono uppercase text-violet-400 hover:text-violet-300 cursor-pointer"
            >
              [Restore Defaults]
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-6 font-sans">
            Input custom API credentials for OpenWeatherMap and NASA Open Gateway here. Verified configurations will override default credentials immediately inside LocalStorage.
          </p>

          <form onSubmit={handleKeysSave} className="space-y-5">
            {/* Weather key input */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center justify-between">
                <span>OpenWeatherMap Key (Default: b2f1166... )</span>
                <span className="text-violet-400 text-[8px]">Active: {apiKeyWeather.substring(0, 4)}***</span>
              </label>
              <div className="relative">
                <input
                  type={showWeatherKey ? 'text' : 'password'}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-12 py-2.5 outline-none text-white focus:border-blue-500"
                  value={weatherInput}
                  onChange={(e) => setWeatherInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowWeatherKey(!showWeatherKey)}
                  className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showWeatherKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[8px] text-slate-500 font-mono mt-1">Used for 7-day meteorology forecast and line data trends.</p>
            </div>

            {/* NASA APOD Key Input */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center justify-between">
                <span>NASA Open Portal Key (Default: QhAq6dQ... )</span>
                <span className="text-violet-400 text-[8px]">Active: {apiKeyNasa.substring(0, 4)}***</span>
              </label>
              <div className="relative">
                <input
                  type={showNasaKey ? 'text' : 'password'}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-12 py-2.5 outline-none text-white focus:border-blue-500"
                  value={nasaInput}
                  onChange={(e) => setNasaInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNasaKey(!showNasaKey)}
                  className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showNasaKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[8px] text-slate-500 font-mono mt-1 font-sans">Used to retrieve Astronomy Deep Space pictures of the day.</p>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white hover:bg-violet-750 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Commit Keys to LocalStorage</span>
            </button>
          </form>
        </div>

        {/* Toggles settings options */}
        <div className="mt-8 border-t border-white/5 pt-4 space-y-4">
          <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Preferences Hub</h5>
          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-white/5 cursor-pointer">
              <div>
                <span className="text-slate-200 block font-semibold">Enable Storm warnings alert banners</span>
                <span className="text-[9px] text-slate-500 mt-0.5 block font-sans">Displays top real-time OWM alert headers when temperature scales go over 35°C</span>
              </div>
              <input
                type="checkbox"
                className="accent-violet-500 w-4 h-4 cursor-pointer"
                checked={toggles.saasAlerts}
                onChange={() => setToggles({ ...toggles, saasAlerts: !toggles.saasAlerts })}
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-white/5 cursor-pointer">
              <div>
                <span className="text-slate-200 block font-semibold">Continuous audit tracking logs</span>
                <span className="text-[9px] text-slate-500 mt-0.5 block font-sans">Streams user navigation metrics immediately into security audit records</span>
              </div>
              <input
                type="checkbox"
                className="accent-violet-500 w-4 h-4 cursor-pointer"
                checked={toggles.auditLogging}
                onChange={() => setToggles({ ...toggles, auditLogging: !toggles.auditLogging })}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
