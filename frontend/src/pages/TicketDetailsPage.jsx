import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiArrowLeft, 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiTicket,
  HiPrinter,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiCreditCard,
  HiCheckBadge,
  HiSparkles,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { getTicketById } from '../services/ticketService';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const res = await getTicketById(id);
        if (res.success) {
          setTicket(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-800 rounded" />
        <div className="h-96 bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <HiExclamationTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Ticket Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested ticket does not exist, or you do not have permission to view it.
        </p>
        <Link
          to="/my-tickets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to My Tickets
        </Link>
      </div>
    );
  }

  const event = ticket.event || {};
  const attendee = ticket.user || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Top Navigation & Print Actions (hidden during print) */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          to="/my-tickets"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to My Tickets
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            id="print-ticket-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white text-sm font-semibold transition-all cursor-pointer"
          >
            <HiPrinter className="w-4 h-4 text-indigo-400" />
            <span>Print Pass / PDF</span>
          </button>
          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            View Event
          </Link>
        </div>
      </div>

      {/* Modern Digital Ticket Pass Boarding Voucher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:border-slate-300 print:text-black">
        {/* Banner Section */}
        <div className="relative aspect-[21/8] sm:aspect-[21/6] w-full overflow-hidden bg-slate-950">
          <img
            src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
            alt={event.title || 'Event'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Top Pass Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {event.category || 'Official Pass'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HiCheckBadge className="w-4 h-4" />
              Confirmed Reservation
            </span>
          </div>

          {/* Event Title on Banner */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Ticket Perforated Divider Simulation */}
        <div className="relative py-2 flex items-center justify-between px-6 bg-slate-900">
          <div className="w-5 h-5 -ml-8 rounded-full bg-slate-950 border-r border-slate-800" />
          <div className="flex-1 border-t-2 border-dashed border-slate-800 mx-4" />
          <div className="w-5 h-5 -mr-8 rounded-full bg-slate-950 border-l border-slate-800" />
        </div>

        {/* Main Pass Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Event & Attendee Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Time & Venue Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <HiCalendarDays className="w-4 h-4 text-indigo-400" />
                  Date & Time
                </span>
                <p className="text-sm font-bold text-white">{formatDate(event.date)}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <HiClock className="w-3.5 h-3.5 text-slate-400" />
                  {event.time}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <HiMapPin className="w-4 h-4 text-rose-400" />
                  Location
                </span>
                <p className="text-sm font-bold text-white">{event.venue}</p>
                <p className="text-xs text-slate-300">{event.city}</p>
              </div>
            </div>

            {/* Ticket & Seat Information */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Ticket Number
                </span>
                <p className="text-sm font-mono font-bold text-indigo-300 select-all">
                  {ticket.ticketNumber}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Seat Number
                </span>
                <p className="text-sm font-bold text-white">
                  {ticket.seatNumber || 'General Admission'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Quantity
                </span>
                <p className="text-sm font-bold text-white">
                  {ticket.seats || 1} Person{(ticket.seats || 1) > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <HiUser className="w-4 h-4 text-indigo-400" />
                Attendee Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <p className="font-semibold text-white">{attendee.name || 'Attendee'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="font-semibold text-white">{attendee.email || 'N/A'}</p>
                </div>
                {attendee.phone && (
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <p className="font-semibold text-white">{attendee.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Organized By:</span>
                  <p className="font-semibold text-white">{event.organizer || 'Event Organizer'}</p>
                </div>
              </div>
            </div>

            {/* Payment & Booking Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Total Amount</span>
                <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                  {ticket.amount === 0 ? 'FREE' : `₹${ticket.amount || ticket.totalPrice}`}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Status</span>
                <p className="font-bold text-emerald-400 uppercase mt-0.5">
                  {ticket.paymentStatus || 'PAID'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block">Payment ID</span>
                <p className="font-mono text-slate-300 truncate mt-0.5" title={ticket.paymentId}>
                  {ticket.paymentId || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block">Booked On</span>
                <p className="text-slate-300 mt-0.5">
                  {formatBookingDate(ticket.bookingDate || ticket.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): QR Code & Verification Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 flex items-center justify-center gap-1">
                <HiSparkles className="w-3.5 h-3.5" />
                Gate Check-In
              </span>
              <p className="text-[11px] text-slate-400">
                Present this QR code upon arrival at venue
              </p>
            </div>

            {/* QR Code Graphic Frame */}
            <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/50 border-2 border-indigo-500/20 max-w-[200px]">
              {ticket.qrCode ? (
                <img
                  src={ticket.qrCode}
                  alt={`QR Code for ${ticket.ticketNumber}`}
                  className="w-full h-auto aspect-square object-contain"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-slate-400 text-xs">
                  QR Not Available
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 block">
                {ticket.ticketNumber}
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Status: {ticket.status || 'Valid Pass'}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight pt-2 border-t border-slate-800 w-full">
              Non-transferable • Requires valid government ID matching attendee name
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
