import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import EventFormPage from '../pages/EventFormPage';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />
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
