import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiCalendarDays, 
  HiPlusCircle, 
  HiBars3, 
  HiXMark, 
  HiTicket, 
  HiChartBar, 
  HiArrowRightOnRectangle,
  HiUser
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isOrganizer, logout } = useAuth();

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

            {/* VISITOR & USER: Events */}
            {(!isAuthenticated || !isOrganizer) && (
              <Link
                to="/events"
                id="nav-events-link"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/events')
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <HiCalendarDays className="w-4 h-4 text-indigo-400" />
                Events
              </Link>
            )}

            {/* USER ONLY: My Tickets & Profile */}
            {isAuthenticated && !isOrganizer && (
              <>
                <Link
                  to="/my-tickets"
                  id="nav-my-tickets-link"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/my-tickets')
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <HiTicket className="w-4 h-4 text-indigo-400" />
                  My Tickets
                </Link>
                <Link
                  to="/profile"
                  id="nav-user-profile-link"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/profile')
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <HiUser className="w-4 h-4 text-indigo-400" />
                  Profile
                </Link>
              </>
            )}

            {/* ORGANIZER ONLY: My Events, Create Event, Dashboard, Profile */}
            {isAuthenticated && isOrganizer && (
              <>
                <Link
                  to="/organizer/events"
                  id="nav-my-events-link"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/organizer/events')
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  My Events
                </Link>
                <Link
                  to="/events/new"
                  id="nav-create-event-link"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/events/new') || isActive('/create-event')
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <HiPlusCircle className="w-4 h-4 text-indigo-400" />
                  Create Event
                </Link>
                <Link
                  to="/organizer/dashboard"
                  id="nav-dash-link"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/organizer/dashboard') || isActive('/dashboard')
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <HiChartBar className="w-4 h-4 text-emerald-400" />
                  Dashboard
                </Link>
                <Link
                  to="/organizer/profile"
                  id="nav-org-profile-link"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/organizer/profile') || isActive('/profile')
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <HiUser className="w-4 h-4 text-indigo-400" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isOrganizer ? "/organizer/profile" : "/profile"}
                  id="nav-profile-pill"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  title={`${user?.name} (${user?.role})`}
                >
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400';
                    }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 capitalize font-medium leading-none">
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  id="nav-logout-btn"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-800 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  id="nav-signup-btn"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/25"
                >
                  Signup
                </Link>
              </div>
            )}
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
          {/* VISITOR MENU */}
          {!isAuthenticated && (
            <>
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
                  isActive('/events') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                Events
              </Link>
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:bg-slate-800/60"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-white bg-indigo-600 text-center"
                >
                  Signup
                </Link>
              </div>
            </>
          )}

          {/* USER MENU */}
          {isAuthenticated && !isOrganizer && (
            <>
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
                  isActive('/events') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                Events
              </Link>
              <Link
                to="/my-tickets"
                id="mobile-nav-my-tickets-link"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/my-tickets') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                My Tickets
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/profile') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                Profile
              </Link>
              <div className="px-3 py-2 text-xs text-slate-400 border-t border-slate-800 mt-2">
                Signed in as <strong className="text-white">{user?.name}</strong> ({user?.role})
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-slate-800/60"
              >
                Logout
              </button>
            </>
          )}

          {/* ORGANIZER MENU */}
          {isAuthenticated && isOrganizer && (
            <>
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
                to="/organizer/events"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/organizer/events') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                My Events
              </Link>
              <Link
                to="/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 ${
                  isActive('/events/new') || isActive('/create-event') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'
                }`}
              >
                Create Event
              </Link>
              <Link
                to="/organizer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/organizer/dashboard') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/organizer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/organizer/profile') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                Profile
              </Link>
              <div className="px-3 py-2 text-xs text-slate-400 border-t border-slate-800 mt-2">
                Signed in as <strong className="text-white">{user?.name}</strong> (Organizer)
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-slate-800/60"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
