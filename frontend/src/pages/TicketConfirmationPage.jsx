import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiCheckCircle, 
  HiPrinter, 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiTicket, 
  HiSparkles,
  HiUser,
  HiCreditCard,
  HiArrowRight,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { getTicketById } from '../services/ticketService';

const TicketConfirmationPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedTicket = async () => {
      setLoading(true);
      try {
        const res = await getTicketById(id);
        if (res.success) {
          setTicket(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load confirmed ticket');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConfirmedTicket();
    }
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
        <div className="h-10 w-64 bg-slate-800 rounded-xl mx-auto" />
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
          Could not find the confirmed ticket details. Please verify in your tickets list.
        </p>
        <Link
          to="/my-tickets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
        >
          View My Tickets
        </Link>
      </div>
    );
  }

  const event = ticket.event || {};
  const attendee = ticket.user || {};

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <HiCheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Your payment was successfully verified via Razorpay. Your official boarding pass is ready below.
        </p>
      </div>

      {/* Confirmed Ticket Boarding Voucher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:border-slate-300">
        {/* Banner with Top Badges */}
        <div className="relative aspect-[21/8] sm:aspect-[21/6] w-full overflow-hidden bg-slate-950">
          <img
            src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
            alt={event.title || 'Event'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Badges on Banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {event.category || 'Event Pass'}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <HiCheckCircle className="w-4 h-4" />
                {ticket.status === 'confirmed' ? 'CONFIRMED' : (ticket.status || 'CONFIRMED')}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {ticket.paymentStatus ? ticket.paymentStatus.toUpperCase() : 'PAID'}
              </span>
            </div>
          </div>

          {/* Event Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Perforated Ticket Notch Line */}
        <div className="relative py-2 flex items-center justify-between px-6 bg-slate-900">
          <div className="w-5 h-5 -ml-8 rounded-full bg-slate-950 border-r border-slate-800" />
          <div className="flex-1 border-t-2 border-dashed border-slate-800 mx-4" />
          <div className="w-5 h-5 -mr-8 rounded-full bg-slate-950 border-l border-slate-800" />
        </div>

        {/* Ticket Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Event Details Grid */}
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
                Venue Location
              </span>
              <p className="text-sm font-bold text-white">{event.venue}</p>
              <p className="text-xs text-slate-300">{event.city}</p>
            </div>
          </div>

          {/* Key Ticket Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-800">
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
                {ticket.seats || 1} Ticket{(ticket.seats || 1) > 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Payment Status
              </span>
              <p className="text-sm font-bold text-emerald-400 uppercase">
                {ticket.paymentStatus || 'PAID'}
              </p>
            </div>
          </div>

          {/* Attendee & Organizer Details */}
          <div className="space-y-3 pb-6 border-b border-slate-800 text-xs">
            <span className="uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <HiUser className="w-4 h-4 text-indigo-400" />
              Attendee Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400">Name:</span>
                <p className="font-semibold text-white mt-0.5">{attendee.name || 'Attendee'}</p>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>
                <p className="font-semibold text-white mt-0.5">{attendee.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400">Organized By:</span>
                <p className="font-semibold text-white mt-0.5">{event.organizer || 'Event Co'}</p>
              </div>
            </div>
          </div>

          {/* Payment & QR Code Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Payment Details */}
            <div className="space-y-3 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <HiCreditCard className="w-4 h-4 text-emerald-400" />
                Payment Summary
              </span>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {ticket.amount === 0 ? 'FREE' : `₹${ticket.amount || ticket.totalPrice}`}
                  </span>
                </div>
                {ticket.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Razorpay Payment ID:</span>
                    <span className="font-mono text-slate-300 truncate max-w-[150px]" title={ticket.paymentId}>
                      {ticket.paymentId}
                    </span>
                  </div>
                )}
                {ticket.orderId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Razorpay Order ID:</span>
                    <span className="font-mono text-slate-300 truncate max-w-[150px]" title={ticket.orderId}>
                      {ticket.orderId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Booking Date:</span>
                  <span className="text-slate-300">
                    {formatBookingDate(ticket.bookingDate || ticket.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <HiSparkles className="w-3.5 h-3.5" />
                Gate Check-In Pass
              </span>

              <div className="p-2.5 bg-white rounded-xl shadow-lg border border-indigo-500/20 max-w-[170px]">
                {ticket.qrCode ? (
                  <img
                    src={ticket.qrCode}
                    alt={`QR Code for ${ticket.ticketNumber}`}
                    className="w-full h-auto aspect-square object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                    QR Available
                  </div>
                )}
              </div>

              <span className="text-[11px] font-mono text-slate-400 block select-all">
                {ticket.ticketNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          id="print-confirmation-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md"
        >
          <HiPrinter className="w-4 h-4 text-indigo-400" />
          <span>Print / Download Ticket Pass</span>
        </button>

        <Link
          to="/my-tickets"
          id="go-my-tickets-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          <HiTicket className="w-4 h-4" />
          <span>Go to My Tickets</span>
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default TicketConfirmationPage;
