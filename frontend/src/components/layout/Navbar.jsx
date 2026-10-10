import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiSparkles, 
  HiCalendarDays, 
  HiPlusCircle, 
  HiBars3, 
  HiXMark,
  HiTicket
} from 'react-icons/hi2';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <HiTicket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                EventHub
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 -mt-1">
                Booking Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/events') && location.pathname !== '/events/new'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HiCalendarDays className="w-4 h-4 text-indigo-400" />
              Explore Events
            </Link>
          </div>

          {/* Action button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/events/new"
              id="create-event-nav-btn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <HiPlusCircle className="w-4 h-4" />
              Host Event
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') && location.pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/events') && location.pathname !== '/events/new' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Explore Events
          </Link>
          <Link
            to="/events/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm text-center"
          >
            <HiPlusCircle className="w-5 h-5" />
            Host Event
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
