import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  HiCheckCircle, 
  HiTicket, 
  HiArrowRight, 
  HiSparkles,
  HiCalendarDays
} from 'react-icons/hi2';
import { getTicketById } from '../services/ticketService';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticketId = searchParams.get('ticketId');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(Boolean(ticketId));

  useEffect(() => {
    if (ticketId) {
      getTicketById(ticketId)
        .then((res) => {
          if (res.success) {
            setTicket(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [ticketId]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
      {/* Animated Glowing Success Icon */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-in fade-in zoom-in-75 duration-300">
        <HiCheckCircle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <HiSparkles className="w-4 h-4" />
          Razorpay Payment Successful
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Payment Confirmed!
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Your transaction has been securely processed and your ticket booking is officially confirmed.
        </p>
      </div>

      {/* Ticket Details Summary Card */}
      {ticket && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-3 max-w-lg mx-auto shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-slate-400">Event</span>
              <p className="font-bold text-white text-base">{ticket.event?.title}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Status</span>
              <p className="font-bold text-emerald-400 text-sm uppercase">Confirmed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400">Ticket Number:</span>
              <p className="font-mono font-bold text-indigo-300">{ticket.ticketNumber}</p>
            </div>
            <div>
              <span className="text-slate-400">Seat Number:</span>
              <p className="font-bold text-white">{ticket.seatNumber || 'Assigned'}</p>
            </div>
            <div>
              <span className="text-slate-400">Total Paid:</span>
              <p className="font-bold text-emerald-400">
                {ticket.amount === 0 ? 'FREE' : `₹${ticket.amount || ticket.totalPrice}`}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Payment ID:</span>
              <p className="font-mono text-slate-300 truncate" title={ticket.paymentId}>{ticket.paymentId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {ticketId ? (
          <Link
            to={`/tickets/${ticketId}/confirmation`}
            id="view-pass-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            <HiTicket className="w-4 h-4" />
            <span>View Boarding Pass & QR</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/my-tickets"
            id="go-tickets-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            <HiTicket className="w-4 h-4" />
            <span>Go to My Tickets</span>
          </Link>
        )}

        <Link
          to="/events"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
        >
          <HiCalendarDays className="w-4 h-4" />
          <span>Discover More Events</span>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
