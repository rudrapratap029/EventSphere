import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiCalendarDays, 
  HiTicket, 
  HiCurrencyDollar, 
  HiUserGroup, 
  HiPlusCircle, 
  HiArrowPath, 
  HiSparkles,
  HiCheckBadge,
  HiArrowRight,
  HiPencilSquare,
  HiEye
} from 'react-icons/hi2';
import { getOrganizerDashboard } from '../services/organizerService';
import { useOrganizer } from '../context/OrganizerAuthContext';

const OrganizerDashboardPage = () => {
  const { organizer } = useOrganizer();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getOrganizerDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    totalEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    completedEvents: 0,
    cancelledEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalCapacity: 0,
    totalAvailableSeats: 0
  };

  const analytics = data?.analytics || [];
  const recentEvents = data?.recentEvents || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={organizer?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
            alt={organizer?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
            }}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {organizer?.name}
              </h1>
              {organizer?.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <HiCheckBadge className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              {organizer?.companyName ? `${organizer.companyName} • ` : ''}
              {organizer?.city ? `${organizer.city} • ` : ''}
              {organizer?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh Metrics"
          >
            <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <Link
            to="/events/new"
            id="dash-create-event-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            <HiPlusCircle className="w-5 h-5" />
            Create Event
          </Link>
          <Link
            to="/organizer/profile"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Events</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <HiCalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.totalEvents}</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">{stats.upcomingEvents} Upcoming</span>
              <span>•</span>
              <span className="text-slate-400">{stats.completedEvents} Completed</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <HiTicket className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.totalBookings}</div>
            <div className="text-xs text-slate-400 mt-1">
              <span>{stats.totalCapacity} Total Capacity across events</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <HiCurrencyDollar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-cyan-400">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">
              <span>Calculated from ticket sales</span>
            </div>
          </div>
        </div>

        {/* Card 4: Available Seats */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Seats Remaining</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <HiUserGroup className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{stats.totalAvailableSeats}</div>
            <div className="text-xs text-slate-400 mt-1">
              <span>Open for prospective attendees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Analytics Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HiSparkles className="w-5 h-5 text-indigo-400" />
              Event Performance & Seat Analytics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live breakdown of ticket bookings, available capacity, and revenue by individual event.
            </p>
          </div>
          <Link
            to="/organizer/events"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Manage All Events ({stats.totalEvents})
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-950 rounded-xl" />
            ))}
          </div>
        ) : analytics.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <p>No events found for this organizer account yet.</p>
            <Link
              to="/events/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              <HiPlusCircle className="w-4 h-4" />
              Publish First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Sold / Left</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {analytics.map((item) => (
                  <tr key={item.eventId} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <Link to={`/events/${item.eventId}`} className="hover:text-indigo-400 transition-colors">
                        {item.title}
                      </Link>
                      <span className="block text-[11px] font-normal text-slate-500">
                        {item.category} • {new Date(item.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        item.status === 'upcoming'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'ongoing'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : item.status === 'completed'
                          ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {item.ticketPrice === 0 ? 'FREE' : `$${item.ticketPrice}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.totalSeats} seats
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-semibold">{item.soldSeats}</span>
                      <span className="text-slate-500"> / {item.availableSeats}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-950 rounded-full h-1.5 overflow-hidden">
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
        )}
      </div>

      {/* Recent Events & Quick Operations */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HiCalendarDays className="w-5 h-5 text-indigo-400" />
            Recent Events by {organizer?.name}
          </h2>
          <Link
            to="/organizer/events"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            View all ({stats.totalEvents})
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <p className="text-sm text-slate-400">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentEvents.map((event) => (
              <div
                key={event._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {event.category}
                  </span>
                  <h3 className="font-bold text-white text-base line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-slate-400">
                    {new Date(event.date).toLocaleDateString()} • {event.city}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="font-bold text-sm text-white">
                    {event.ticketPrice === 0 ? 'FREE' : `$${event.ticketPrice}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/events/${event._id}`}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="View Details"
                    >
                      <HiEye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/events/${event._id}/edit`}
                      className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors"
                      title="Edit Event"
                    >
                      <HiPencilSquare className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
