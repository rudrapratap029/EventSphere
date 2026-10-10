import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiPlusCircle, 
  HiCalendarDays, 
  HiSparkles,
  HiArrowPath,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { getEvents, deleteEvent } from '../services/eventService';
import EventCard from '../components/common/EventCard';
import EventFilter from '../components/common/EventFilter';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  // Fetch events based on current filters
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;

      const res = await getEvents(params);
      if (res.success) {
        setEvents(res.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Debounced effect for search and filters
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('all');
  };

  const promptDelete = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      const res = await deleteEvent(deleteModal.id);
      if (res.success) {
        toast.success(`Event "${deleteModal.title}" deleted successfully`);
        setEvents((prev) => prev.filter((e) => e._id !== deleteModal.id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HiSparkles className="w-3.5 h-3.5" />
            Discover & Book
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Upcoming Events
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Browse through conferences, indie festivals, masterclasses, and networking meetups happening near you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEvents}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Events"
          >
            <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <Link
            to="/events/new"
            id="create-event-header-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <HiPlusCircle className="w-5 h-5" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <EventFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/9] bg-slate-800 rounded-xl" />
              <div className="h-5 bg-slate-800 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-5/6" />
              </div>
              <div className="h-8 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <HiCalendarDays className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No Events Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              We couldn't find any events matching your current filters. Try adjusting your search query or clear the filters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
            <Link
              to="/events/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
            >
              Create New Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{events.length}</strong> {events.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} onDelete={promptDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
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
              Are you sure you want to permanently delete <strong className="text-white">"{deleteModal.title}"</strong>?
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
                id="confirm-delete-btn"
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
};

export default EventsPage;
