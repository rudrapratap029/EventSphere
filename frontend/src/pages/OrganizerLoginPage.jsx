import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiLockClosed, 
  HiEnvelope, 
  HiSparkles,
  HiArrowRight,
  HiShieldCheck
} from 'react-icons/hi2';
import { useOrganizer } from '../context/OrganizerAuthContext';

const OrganizerLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useOrganizer();

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
    setFormData({
      email: 'demo@eventhub.com',
      password: 'organizer123'
    });
    toast.success('Filled demo credentials!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(formData);
      navigate('/organizer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HiShieldCheck className="w-4 h-4" />
            Organizer Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Organizer Sign In
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your events, track bookings, and monitor revenue.
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <HiSparkles className="w-3.5 h-3.5 text-indigo-400" />
              Demo Credentials Available
            </span>
            <span className="text-slate-400 block text-[11px]">demo@eventhub.com • organizer123</span>
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
        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="organizer@eventhub.com"
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
            id="organizer-login-btn"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            <HiArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Want to host events with us?{' '}
          <Link
            to="/organizer/register"
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Register as Organizer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLoginPage;
