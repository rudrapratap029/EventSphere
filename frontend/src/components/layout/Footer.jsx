import { Link } from 'react-router-dom';
import { HiTicket, HiHeart } from 'react-icons/hi2';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HiTicket className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white">EventHub</span>
              <p className="text-xs text-slate-500">Discover and book unforgettable events</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-slate-200 transition-colors">Home</Link>
            <Link to="/events" className="hover:text-slate-200 transition-colors">Events</Link>
            <Link to="/events/new" className="hover:text-slate-200 transition-colors">Host Event</Link>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <span>Built with React, Express & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
