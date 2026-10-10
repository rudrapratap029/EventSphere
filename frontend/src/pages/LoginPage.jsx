import { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiLockClosed, 
  HiEnvelope, 
  HiSparkles,
  HiArrowRight,
  HiUser,
  HiBuildingOffice2
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'organizer' ? 'organizer' : 'user';
  const [role, setRole] = useState(initialRole);

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const useDemoCredentials = () => {
    if (role === 'organizer') {
      setFormData({
        email: 'demo@eventhub.com',
        password: 'organizer123'
      });
    } else {
      setFormData({
        email: 'demo.user@example.com',
        password: 'user123'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(formData, role);
      const destination = location.state?.from?.pathname || (role === 'organizer' ? '/organizer/dashboard' : '/events');
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to EventHub
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to access events, bookings, and host management.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            id="role-tab-user"
            onClick={() => {
              setRole('user');
              setFormData({ email: '', password: '' });
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'user'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HiUser className="w-4 h-4" />
            Attendee (User)
          </button>
          <button
            type="button"
            id="role-tab-organizer"
            onClick={() => {
              setRole('organizer');
              setFormData({ email: '', password: '' });
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'organizer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HiBuildingOffice2 className="w-4 h-4" />
            Event Organizer
          </button>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <HiSparkles className="w-3.5 h-3.5 text-indigo-400" />
              Demo {role === 'organizer' ? 'Organizer' : 'Attendee'} Account
            </span>
            <span className="text-slate-400 block text-[11px]">
              {role === 'organizer' ? 'demo@eventhub.com • organizer123' : 'demo.user@example.com • user123'}
            </span>
          </div>
          <button
            type="button"
            id="use-demo-login-btn"
            onClick={useDemoCredentials}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="login-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={role === 'organizer' ? 'organizer@company.com' : 'attendee@example.com'}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="login-password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-login-submit-btn"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : `Sign In as ${role === 'organizer' ? 'Organizer' : 'Attendee'}`}
            <HiArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Don't have an account yet?{' '}
          <Link
            to={`/signup?role=${role}`}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
