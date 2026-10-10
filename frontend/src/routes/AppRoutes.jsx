import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import EventFormPage from '../pages/EventFormPage';
import OrganizerLoginPage from '../pages/OrganizerLoginPage';
import OrganizerRegisterPage from '../pages/OrganizerRegisterPage';
import OrganizerDashboardPage from '../pages/OrganizerDashboardPage';
import OrganizerEventsPage from '../pages/OrganizerEventsPage';
import OrganizerProfilePage from '../pages/OrganizerProfilePage';
import { useOrganizer } from '../context/OrganizerAuthContext';

// Simple Protected Route guard for Organizer private pages
const ProtectedOrganizerRoute = ({ children }) => {
  const { isAuthenticated, loading } = useOrganizer();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/organizer/login" replace />;
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

        {/* Organizer Auth Routes */}
        <Route path="/organizer/login" element={<OrganizerLoginPage />} />
        <Route path="/organizer/register" element={<OrganizerRegisterPage />} />

        {/* Organizer Protected Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedOrganizerRoute>
              <OrganizerDashboardPage />
            </ProtectedOrganizerRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedOrganizerRoute>
              <OrganizerEventsPage />
            </ProtectedOrganizerRoute>
          }
        />
        <Route
          path="/organizer/profile"
          element={
            <ProtectedOrganizerRoute>
              <OrganizerProfilePage />
            </ProtectedOrganizerRoute>
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
