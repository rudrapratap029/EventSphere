import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiCheckCircle, 
  HiServer, 
  HiSparkles, 
  HiGlobeAlt, 
  HiCalendarDays, 
  HiPlusCircle,
  HiArrowRight,
  HiTicket
} from 'react-icons/hi2';
import api from '../services/api';
import { getEvents } from '../services/eventService';
import EventCard from '../components/common/EventCard';

const HomePage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const testToast = () => {
    toast.success('React Hot Toast is configured and working perfectly!');
  };

  const checkBackendHealth = async () => {
    setLoadingHealth(true);
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
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getEvents();
        if (res.success && res.data) {
          setFeaturedEvents(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HiSparkles className="w-4 h-4" />
            Events Module Live & Interactive
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent leading-tight">
            Book Experiences That Matter
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover premier tech summits, live concerts, masterclasses, and executive mixers. Create your own events and manage bookings with ease.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/events"
              id="hero-explore-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-600/30 cursor-pointer"
            >
              <HiCalendarDays className="w-5 h-5" />
              Browse All Events
              <HiArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/events/new"
              id="hero-create-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 hover:text-white font-semibold text-sm transition-all border border-slate-800 cursor-pointer"
            >
              <HiPlusCircle className="w-5 h-5 text-indigo-400" />
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Top Picks
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Events
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            View all ({featuredEvents.length}+)
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No events found yet. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Organizer Call-to-Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <HiSparkles className="w-3.5 h-3.5" />
              For Event Creators
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Host Your Events on EventHub
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Create and manage listings, track live seat allocations, monitor ticket sales revenue, and view attendee analytics from a unified organizer portal.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/organizer/dashboard"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              Organizer Portal
            </Link>
            <Link
              to="/organizer/register"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
            >
              Register as Organizer
            </Link>
          </div>
        </div>
      </section>

      {/* System Status & Diagnostics Box (Phase 1 Retained) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <HiServer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">System Health & Diagnostic Controls</h3>
                <p className="text-xs text-slate-400">Verify client-server connectivity and real-time toast alerts</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold text-slate-200 block mb-1">Backend Stack:</span>
              <p>• Express.js with ES Modules & MVC structure</p>
              <p>• MongoDB Mongoose Event model with validation</p>
              <p>• Full CRUD APIs at <code className="text-indigo-400">/api/events</code></p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold text-slate-200 block mb-1">Frontend Stack:</span>
              <p>• Vite React with Tailwind CSS v4</p>
              <p>• React Router DOM 7 with active route states</p>
              <p>• Dedicated Event Service with Axios integration</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="test-toast-btn"
              onClick={testToast}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Test Toast Notification
            </button>
            <button
              id="check-backend-btn"
              onClick={checkBackendHealth}
              disabled={loadingHealth}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-white font-medium text-xs border border-slate-700 disabled:opacity-50 cursor-pointer"
            >
              {loadingHealth ? 'Checking...' : 'Check Backend Health API'}
            </button>
          </div>

          {healthStatus && (
            <div
              className={`p-3.5 rounded-xl border text-xs text-center ${
                healthStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 font-medium">
                <HiCheckCircle className="w-4 h-4" />
                <span>{healthStatus.message}</span>
              </div>
              {healthStatus.timestamp && (
                <p className="text-[11px] text-slate-400 mt-1">Timestamp: {healthStatus.timestamp}</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
