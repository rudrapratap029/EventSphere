import { Link, useSearchParams } from 'react-router-dom';
import { 
  HiXCircle, 
  HiArrowPath, 
  HiCalendarDays, 
  HiTicket,
  HiShieldExclamation
} from 'react-icons/hi2';

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'The transaction could not be completed or was cancelled.';
  const eventId = searchParams.get('eventId');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
      {/* Error Badge Icon */}
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/10">
        <HiXCircle className="w-12 h-12" />
      </div>

      {/* Heading & Explanation */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <HiShieldExclamation className="w-4 h-4" />
          Payment Not Completed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Payment Incomplete
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
          {reason}
        </p>
      </div>

      {/* Assurance Notice Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left text-xs sm:text-sm text-slate-300 space-y-2 max-w-lg mx-auto">
        <p className="font-semibold text-white flex items-center gap-2">
          🔒 Your Booking & Payment Guarantee:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>No ticket was generated for this attempt.</li>
          <li>No seats were reserved or deducted from the event.</li>
          <li>If any amount was debited from your bank, Razorpay will automatically reverse it within 3-5 business days.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {eventId ? (
          <Link
            to={`/events/${eventId}`}
            id="retry-payment-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            <HiArrowPath className="w-4 h-4" />
            <span>Try Again</span>
          </Link>
        ) : (
          <Link
            to="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            <HiCalendarDays className="w-4 h-4" />
            <span>Browse Events</span>
          </Link>
        )}

        <Link
          to="/my-tickets"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
        >
          <HiTicket className="w-4 h-4" />
          <span>My Tickets</span>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
