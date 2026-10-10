import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiArrowLeft, 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiUserGroup, 
  HiTicket,
  HiPencilSquare,
  HiTrash,
  HiSparkles,
  HiCheckCircle,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { getEventById, deleteEvent, updateEvent } from '../services/eventService';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await getEventById(id);
        if (res.success) {
          setEvent(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Event not found');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteEvent(id);
      if (res.success) {
        toast.success('Event deleted successfully');
        navigate('/events');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBookTickets = async (e) => {
    e.preventDefault();
    if (!event) return;

    const available = event.availableSeats ?? event.totalSeats;
    if (available < bookingSeats) {
      toast.error(`Only ${available} seats left!`);
      return;
    }

    setBookingLoading(true);
    try {
      const updatedAvailable = available - bookingSeats;
      const res = await updateEvent(id, {
        availableSeats: updatedAvailable,
        status: updatedAvailable === 0 ? 'completed' : event.status
      });

      if (res.success) {
        toast.success(`Successfully booked ${bookingSeats} ticket(s)! Check your confirmation.`);
        setEvent(res.data);
        setBookingSeats(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-24 bg-slate-800 rounded" />
        <div className="aspect-[21/9] bg-slate-800 rounded-3xl" />
        <div className="h-10 w-2/3 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-slate-800 rounded-2xl md:col-span-2" />
          <div className="h-40 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <HiExclamationTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-slate-400 text-sm">The event you are looking for does not exist or may have been removed.</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const availableSeatsCount = event.availableSeats ?? event.totalSeats;
  const isSoldOut = availableSeatsCount <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button and Admin actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to all events
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/events/${event._id}/edit`}
            id="edit-event-details-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
          >
            <HiPencilSquare className="w-4 h-4 text-indigo-400" />
            Edit Event
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            id="delete-event-details-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-sm font-medium border border-rose-500/20 hover:border-rose-500 transition-colors cursor-pointer"
          >
            <HiTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="aspect-[21/9] sm:aspect-[2.5/1] w-full relative">
          <img
            src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Banner Overlays */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-900/90 text-slate-300 border border-slate-700 backdrop-blur-md">
              Status: {event.status}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base flex items-center gap-2">
              <span>Organized by <strong className="text-white">{event.organizer}</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <HiCalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Date & Time</p>
                <p className="text-sm font-semibold text-white mt-0.5">{formatDate(event.date)}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <HiClock className="w-3.5 h-3.5 text-slate-400" />
                  {event.time}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                <HiMapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Location & Venue</p>
                <p className="text-sm font-semibold text-white mt-0.5">{event.venue}</p>
                <p className="text-xs text-slate-300 mt-0.5">{event.city}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HiSparkles className="w-5 h-5 text-indigo-400" />
              About This Event
            </h2>
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Booking Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400">Ticket Price</span>
                <div className="text-3xl font-extrabold text-white mt-0.5">
                  {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
                  {event.ticketPrice > 0 && <span className="text-xs text-slate-400 font-normal"> / attendee</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Seat Availability</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {isSoldOut ? (
                    <span className="text-rose-400 font-semibold">Sold Out</span>
                  ) : (
                    <span>{availableSeatsCount} left</span>
                  )}
                </div>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Capacity</span>
                <span>{availableSeatsCount} / {event.totalSeats} seats open</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(((event.totalSeats - availableSeatsCount) / event.totalSeats) * 100))}%`
                  }}
                />
              </div>
            </div>

            {/* Booking Form Simulation */}
            {!isSoldOut ? (
              <form onSubmit={handleBookTickets} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="tickets-select" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Quantity
                  </label>
                  <select
                    id="tickets-select"
                    value={bookingSeats}
                    onChange={(e) => setBookingSeats(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    {[...Array(Math.min(10, availableSeatsCount))].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {idx + 1} Ticket{idx > 0 ? 's' : ''} — ${(idx + 1) * event.ticketPrice}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  id="book-tickets-btn"
                  disabled={bookingLoading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <HiTicket className="w-5 h-5" />
                  {bookingLoading ? 'Reserving...' : `Book ${bookingSeats} Ticket${bookingSeats > 1 ? 's' : ''}`}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center text-sm font-medium">
                This event is completely sold out.
              </div>
            )}

            <div className="pt-2 text-center text-xs text-slate-500">
              🔒 Instant confirmation • Guaranteed reservation
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
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
              Are you sure you want to permanently delete <strong className="text-white">"{event.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-details-btn"
                onClick={handleDelete}
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

export default EventDetailsPage;
