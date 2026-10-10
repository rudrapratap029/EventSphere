import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { HiShieldExclamation } from 'react-icons/hi2';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import EventFormPage from '../pages/EventFormPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import OrganizerDashboardPage from '../pages/OrganizerDashboardPage';
import OrganizerEventsPage from '../pages/OrganizerEventsPage';
import OrganizerProfilePage from '../pages/OrganizerProfilePage';
import { useAuth } from '../context/AuthContext';

// Protected Route Guard with Role-based Authorization
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <HiShieldExclamation className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            This area requires an account with role <strong className="text-white">{allowedRoles.join(', ')}</strong>. You are currently logged in as <strong className="text-indigo-400">{user?.role}</strong>.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Return Home
            </Link>
            <Link
              to="/login?role=organizer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/30"
            >
              Sign In as Organizer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Event Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />

        {/* Unified Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Legacy Organizer Auth Route redirects to unified pages */}
        <Route path="/organizer/login" element={<Navigate to="/login?role=organizer" replace />} />
        <Route path="/organizer/register" element={<Navigate to="/signup?role=organizer" replace />} />

        {/* Organizer Role-Protected Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/profile"
          element={
            <ProtectedRoute allowedRoles={['organizer', 'user']}>
              <OrganizerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="py-24 flex flex-col items-center justify-center text-slate-200 text-center px-4">
              <span className="text-6xl font-black text-indigo-500 mb-2">404</span>
              <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                The page you are looking for does not exist or has been moved.
              </p>
              <a
                href="/"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                Return to Home
              </a>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
