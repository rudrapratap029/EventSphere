import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiTicket, 
  HiMagnifyingGlass, 
  HiCalendarDays, 
  HiArrowRight,
  HiArrowPath,
  HiSparkles
} from 'react-icons/hi2';
import { getMyTickets } from '../services/ticketService';
import TicketCard from '../components/common/TicketCard';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'upcoming' | 'past'

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getMyTickets();
      if (res.success) {
        setTickets(res.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter logic
  const now = new Date();
  const filteredTickets = tickets.filter((ticket) => {
    const event = ticket.event || {};
    const matchesSearch = 
      (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.ticketNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.venue || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.city || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'upcoming') {
      const eventDate = event.date ? new Date(event.date) : null;
      return !eventDate || eventDate >= now;
    }
    if (filterTab === 'past') {
      const eventDate = event.date ? new Date(event.date) : null;
      return eventDate && eventDate < now;
    }

    return true;
  });

  const upcomingCount = tickets.filter((t) => {
    const d = t.event?.date ? new Date(t.event.date) : null;
    return !d || d >= now;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <HiTicket className="w-3.5 h-3.5" />
            Booking History
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Tickets
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Access, view, and print all your confirmed event reservations and boarding passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh tickets"
          >
            <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
          >
            <HiSparkles className="w-4 h-4" />
            <span>Discover Events</span>
          </Link>
        </div>
      </div>

      {/* Summary Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-slate-400 font-medium">Total Tickets</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {tickets.length}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-slate-400 font-medium">Upcoming Events</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
            {upcomingCount}
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-slate-400 font-medium">Past Events</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
            {tickets.length - upcomingCount}
          </div>
        </div>
      </div>

      {/* Search and Tabs Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by event, ticket # or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilterTab('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'past'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Past ({tickets.length - upcomingCount})
          </button>
        </div>
      </div>

      {/* Ticket Grid / States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl h-80" />
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <HiTicket className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white">
              {searchQuery ? 'No matching tickets found' : 'No tickets booked yet'}
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? 'Try tweaking your search keywords or clear the filter.'
                : 'You have not reserved any event tickets yet. Explore trending events and secure your spot today!'}
            </p>
          </div>
          <div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30"
            >
              <span>Explore Events</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
