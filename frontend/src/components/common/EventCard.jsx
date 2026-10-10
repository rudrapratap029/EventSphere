import { Link } from 'react-router-dom';
import { 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiUserGroup, 
  HiTicket,
  HiTrash,
  HiPencilSquare
} from 'react-icons/hi2';

const EventCard = ({ event, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'ongoing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'music':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'business':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'workshop':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'arts':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  const seatsPercentage = event.totalSeats 
    ? Math.max(0, Math.min(100, Math.round(((event.totalSeats - (event.availableSeats ?? event.totalSeats)) / event.totalSeats) * 100)))
    : 0;

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Image Banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider backdrop-blur-md ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider backdrop-blur-md ${getStatusBadge(event.status)}`}>
            {event.status || 'upcoming'}
          </span>
        </div>

        {/* Price Tag overlay */}
        <div className="absolute bottom-3 right-3">
          <div className="px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-700 text-white font-bold text-sm backdrop-blur-md shadow-lg">
            {event.ticketPrice === 0 ? 'FREE' : `$${event.ticketPrice}`}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1" title={event.title}>
            {event.title}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300">
            <HiCalendarDays className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
            <span className="text-slate-600">•</span>
            <HiClock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <HiMapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <HiUserGroup className="w-4 h-4 text-emerald-400" />
              <span>
                <strong className="text-white font-medium">{event.availableSeats ?? event.totalSeats}</strong>
                <span className="text-slate-500"> / {event.totalSeats} seats left</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              By {event.organizer}
            </span>
          </div>

          {/* Seat Capacity Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${seatsPercentage}%` }}
              title={`${seatsPercentage}% booked`}
            />
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white font-medium text-xs transition-all duration-200 cursor-pointer"
          >
            View Details
          </Link>

          <Link
            to={`/events/${event._id}/edit`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Edit Event"
          >
            <HiPencilSquare className="w-4 h-4" />
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(event._id, event.title)}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
              title="Delete Event"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
