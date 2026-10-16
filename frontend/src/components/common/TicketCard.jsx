import { Link } from 'react-router-dom';
import { 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiTicket,
  HiQrCode,
  HiArrowTopRightOnSquare,
  HiCheckCircle
} from 'react-icons/hi2';

const TicketCard = ({ ticket }) => {
  const event = ticket.event || {};

  const formatDate = (dateString) => {
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString || 'TBD';
    }
  };

  const formatBookingDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString || '';
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col hover:shadow-indigo-500/5">
      {/* Top Banner & Header */}
      <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden bg-slate-950">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'}
          alt={event.title || 'Event'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {event.category || 'Event'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <HiCheckCircle className="w-3.5 h-3.5" />
            {ticket.status || 'Booked'}
          </span>
        </div>

        {/* Ticket Number overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1.5">
            <HiTicket className="w-3.5 h-3.5 text-indigo-400" />
            <span>{ticket.ticketNumber}</span>
          </div>
          {ticket.seatNumber && (
            <div className="bg-indigo-600/90 border border-indigo-400/30 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
              Seat: {ticket.seatNumber}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1" title={event.title}>
            {event.title || 'Untitled Event'}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {event.description || 'No description provided.'}
          </p>
        </div>

        {/* Event Meta Details */}
        <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300">
            <HiCalendarDays className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
            <span className="text-slate-600">•</span>
            <HiClock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{event.time || 'Time TBD'}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <HiMapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{event.venue || 'Venue'}, {event.city || ''}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Qty: <strong className="text-white">{ticket.seats || 1} Ticket{(ticket.seats || 1) > 1 ? 's' : ''}</strong>
            </span>
            <span>
              Total: <strong className="text-emerald-400 font-bold">{ticket.amount === 0 ? 'Free' : `₹${ticket.amount || ticket.totalPrice}`}</strong>
            </span>
          </div>
        </div>

        {/* Card Footer with QR preview icon and CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <HiQrCode className="w-5 h-5 text-indigo-400" />
            <span className="text-[11px] text-slate-500">Booked {formatBookingDate(ticket.bookingDate || ticket.createdAt)}</span>
          </div>

          <Link
            to={`/tickets/${ticket._id}`}
            id={`view-ticket-${ticket._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <span>View Ticket</span>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
