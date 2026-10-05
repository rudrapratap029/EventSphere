import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-slate-400">Page not found</p>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
