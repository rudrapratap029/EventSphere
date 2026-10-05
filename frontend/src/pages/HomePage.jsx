import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiServer, HiSparkles, HiGlobeAlt } from 'react-icons/hi2';
import api from '../services/api';

const HomePage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testToast = () => {
    toast.success('React Hot Toast is configured and working perfectly!');
  };

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setHealthStatus(response.data);
      toast.success(response.data.message || 'Backend is reachable!');
    } catch (error) {
      setHealthStatus({
        success: false,
        message: 'Could not connect to backend server. Make sure backend is running on port 5000.'
      });
      toast.error('Backend connection failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HiSparkles className="w-4 h-4" />
            Phase 1 • Project Setup Complete
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            EventHub Platform
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            MERN stack architecture initialized with clean, interview-ready structure and modern tooling.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <HiServer className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-white">Backend Environment</h2>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Express.js with ES Modules</li>
              <li>MongoDB connection configured</li>
              <li>Helmet, Compression, Morgan, Cookie-Parser</li>
              <li>Global 404 & Centralized Error Handlers</li>
            </ul>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <HiGlobeAlt className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-white">Frontend Environment</h2>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Vite React with Tailwind CSS v4</li>
              <li>React Router DOM 7 configured</li>
              <li>Axios instance with base URL</li>
              <li>React Hot Toast & Lucide/React Icons</li>
            </ul>
          </div>
        </div>

        {/* Interactive Verification Actions */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="test-toast-btn"
              onClick={testToast}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium text-sm shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Test Toast Notification
            </button>
            <button
              id="check-backend-btn"
              onClick={checkBackendHealth}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-white font-medium text-sm border border-slate-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Checking...' : 'Check Backend Health API'}
            </button>
          </div>

          {/* Health Status Display */}
          {healthStatus && (
            <div
              className={`p-4 rounded-xl border text-sm text-center ${
                healthStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 font-medium">
                <HiCheckCircle className="w-5 h-5" />
                <span>{healthStatus.message}</span>
              </div>
              {healthStatus.timestamp && (
                <p className="text-xs text-slate-400 mt-1">Timestamp: {healthStatus.timestamp}</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
