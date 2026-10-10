import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiUser, 
  HiEnvelope, 
  HiLockClosed, 
  HiBuildingOffice2, 
  HiPhone, 
  HiMapPin, 
  HiSparkles,
  HiArrowRight
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'organizer' ? 'organizer' : 'user';
  const [role, setRole] = useState(initialRole);

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    city: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillSampleSignup = () => {
    const random = Math.floor(Math.random() * 10000);
    if (role === 'organizer') {
      setFormData({
        name: 'Jordan Vance',
        email: `jordan_${random}@eventhub.com`,
        password: 'password123',
        phone: '+1 (555) 345-6789',
        companyName: 'Apex Production Collective',
        city: 'Austin, TX'
      });
    } else {
      setFormData({
        name: 'Taylor Reed',
        email: `taylor_${random}@example.com`,
        password: 'password123',
        phone: '+1 (555) 789-0123',
        companyName: '',
        city: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Please enter name, email, and password');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData, role);
      if (role === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/events');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Create an Account
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Join EventHub to explore experiences or publish your own.
            </p>
          </div>

          <button
            type="button"
            id="auth-signup-autofill-btn"
            onClick={fillSampleSignup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <HiSparkles className="w-4 h-4 text-indigo-400" />
            Auto-Fill Demo
          </button>
        </div>

        {/* Role Toggle Switch */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            id="signup-role-user"
            onClick={() => {
              setRole('user');
              setFormData((prev) => ({ ...prev, companyName: '', city: '' }));
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
            id="signup-role-organizer"
            onClick={() => setRole('organizer')}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Taylor Reed"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password (min 6 chars) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-password"
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

            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number (optional)
              </label>
              <div className="relative">
                <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Organizer specific fields */}
          {role === 'organizer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label htmlFor="reg-company" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <HiBuildingOffice2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="reg-company"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Productions"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-city" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Operating City
                </label>
                <div className="relative">
                  <HiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="reg-city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            id="auth-signup-submit-btn"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {submitting ? 'Creating Account...' : `Register as ${role === 'organizer' ? 'Organizer' : 'Attendee'}`}
            <HiArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already have an account?{' '}
          <Link
            to={`/login?role=${role}`}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
