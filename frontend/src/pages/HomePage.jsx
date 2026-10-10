import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiCalendarDays, 
  HiPlusCircle, 
  HiArrowRight, 
  HiChartBar, 
  HiTicket, 
  HiCurrencyDollar, 
  HiUserGroup, 
  HiCheckBadge,
  HiPencilSquare,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { getEvents } from '../services/eventService';
import { getOrganizerDashboard, getOrganizerEvents, deleteOrganizerEvent } from '../services/organizerService';
import EventCard from '../components/common/EventCard';

const HomePage = () => {
  const { user, isAuthenticated, isOrganizer } = useAuth();

  // Visitor & Attendee state
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Organizer Home state
  const [organizerDashboard, setOrganizerDashboard] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loadingOrganizer, setLoadingOrganizer] = useState(isOrganizer);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  // Load public events for visitors and attendees
  useEffect(() => {
    if (!isOrganizer) {
      const fetchFeatured = async () => {
        try {
          const res = await getEvents();
          if (res.success && res.data) {
            setFeaturedEvents(res.data.slice(0, 6));
          }
        } catch (err) {
          console.error('Error fetching featured events:', err.message);
        } finally {
          setLoadingEvents(false);
        }
      };

      fetchFeatured();
    }
  }, [isOrganizer]);

  // Load organizer profile data, my events, and analytics when logged in as organizer
  useEffect(() => {
    if (isOrganizer) {
      const loadOrganizerData = async () => {
        setLoadingOrganizer(true);
        try {
          const [dashRes, eventsRes] = await Promise.all([
            getOrganizerDashboard().catch(() => null),
            getOrganizerEvents().catch(() => null)
          ]);

          if (dashRes?.success && dashRes.data) {
            setOrganizerDashboard(dashRes.data);
          }
          if (eventsRes?.success && eventsRes.data) {
            setMyEvents(eventsRes.data);
          }
        } catch (err) {
          console.error('Error loading organizer home data:', err.message);
        } finally {
          setLoadingOrganizer(false);
        }
      };

      loadOrganizerData();
    }
  }, [isOrganizer]);

  const promptDelete = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      const res = await deleteOrganizerEvent(deleteModal.id);
      if (res.success) {
        toast.success(`Event "${deleteModal.title}" deleted successfully`);
        setMyEvents((prev) => prev.filter((e) => e._id !== deleteModal.id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  // ========================================================
  // VIEW 1: ORGANIZER LOGGED-IN HOME EXPERIENCE
  // ========================================================
  if (isOrganizer) {
    const stats = organizerDashboard?.stats || {
      totalEvents: myEvents.length,
      upcomingEvents: myEvents.filter((e) => e.status === 'upcoming').length,
      totalBookings: 0,
      totalRevenue: 0,
      totalAvailableSeats: 0
    };

    const analytics = organizerDashboard?.analytics || [];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Organizer Profile & Management Control Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
              }}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user?.name}
                </h1>
                {user?.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <HiCheckBadge className="w-3.5 h-3.5" />
                    Verified Organizer
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">
                {user?.companyName ? `${user.companyName} • ` : ''}
                {user?.city ? `${user.city} • ` : ''}
                {user?.email}
              </p>
            </div>
          </div>

          {/* Quick Management Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/events/new"
              id="org-home-create-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <HiPlusCircle className="w-5 h-5" />
              Create Event
            </Link>
            <Link
              to="/organizer/dashboard"
              id="org-home-dash-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              <HiChartBar className="w-4 h-4 text-emerald-400" />
              Dashboard
            </Link>
            <Link
              to="/organizer/events"
              id="org-home-events-btn"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              My Events
            </Link>
            <Link
              to="/organizer/profile"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Organizer Quick KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>My Published Events</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <HiCalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats.totalEvents}</div>
            <div className="text-xs text-emerald-400 font-medium">
              {stats.upcomingEvents} Upcoming Scheduled
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Total Bookings</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <HiTicket className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats.totalBookings}</div>
            <div className="text-xs text-slate-400">
              Confirmed attendee reservations
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Gross Revenue</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <HiCurrencyDollar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-cyan-400">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-400">
              Ticket sales proceeds
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Seats Available</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <HiUserGroup className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats.totalAvailableSeats}</div>
            <div className="text-xs text-slate-400">
              Remaining capacity across events
            </div>
          </div>
        </div>

        {/* My Events Section */}
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                My Events Management
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage schedules, edit details, or review seat allocations for your active events.
              </p>
            </div>
            <Link
              to="/organizer/events"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
            >
              View All ({myEvents.length})
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingOrganizer ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-900/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : myEvents.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <HiCalendarDays className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Events Published Yet</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  You haven't created any events under this organizer account yet. Get started by hosting your first event.
                </p>
              </div>
              <Link
                to="/events/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
              >
                <HiPlusCircle className="w-4 h-4" />
                Publish First Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.slice(0, 3).map((event) => (
                <EventCard key={event._id} event={event} onDelete={promptDelete} />
              ))}
            </div>
          )}
        </div>

        {/* Live Event Analytics Section */}
        {analytics.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HiChartBar className="w-5 h-5 text-emerald-400" />
                  Live Event Performance & Ticket Sales
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time occupancy rate and revenue generated per event.
                </p>
              </div>
              <Link
                to="/organizer/dashboard"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                Detailed Analytics
                <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Bookings</th>
                    <th className="py-3 px-4">Occupancy</th>
                    <th className="py-3 px-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {analytics.slice(0, 5).map((item) => (
                    <tr key={item.eventId} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <Link to={`/events/${item.eventId}`} className="hover:text-indigo-400 transition-colors">
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        {item.ticketPrice === 0 ? 'FREE' : `$${item.ticketPrice}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.soldSeats} / {item.totalSeats}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full"
                              style={{ width: `${item.occupancyRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-medium">{item.occupancyRate}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-cyan-400">
                        ${item.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <HiExclamationTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Event</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-sm text-slate-300">
                Are you sure you want to permanently delete your event <strong className="text-white">"{deleteModal.title}"</strong>?
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null, title: '' })}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  {deleting ? 'Deleting...' : 'Delete Event'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // VIEW 2: VISITOR OR LOGGED-IN ATTENDEE EXPERIENCE
  // ========================================================
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Welcome back, {user?.name}!
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Discover & Experience
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent leading-tight">
            Book Experiences That Matter
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover premier tech summits, live concerts, masterclasses, and executive mixers happening in your city.
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

            {!isAuthenticated && (
              <Link
                to="/signup?role=organizer"
                id="hero-host-btn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 hover:text-white font-semibold text-sm transition-all border border-slate-800 cursor-pointer"
              >
                <HiPlusCircle className="w-5 h-5 text-indigo-400" />
                Host an Event
              </Link>
            )}
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
            No events found yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Organizer Invitation Section (Shown ONLY to unauthenticated visitors) */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
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
                to="/signup?role=organizer"
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
              >
                Register as Organizer
              </Link>
              <Link
                to="/login?role=organizer"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
