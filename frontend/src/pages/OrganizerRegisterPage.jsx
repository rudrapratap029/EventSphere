import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiUser, 
  HiEnvelope, 
  HiLockClosed, 
  HiBuildingOffice2, 
  HiPhone, 
  HiMapPin, 
  HiGlobeAlt,
  HiSparkles,
  HiArrowRight,
  HiShieldCheck
} from 'react-icons/hi2';
import { useOrganizer } from '../context/OrganizerAuthContext';

const OrganizerRegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useOrganizer();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    city: '',
    website: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillSampleRegistration = () => {
    const randomSuffix = Math.floor(Math.random() * 1000);
    setFormData({
      name: `Jordan Vance`,
      email: `jordan_${randomSuffix}@eventhub.com`,
      password: 'password123',
      companyName: 'Apex Event Horizons',
      phone: '+1 (555) 789-0123',
      city: 'Austin, TX',
      website: 'https://apexhorizons.example.com',
      bio: 'Premier producer of tech expos, networking summit mixers, and creative showcase festivals.'
    });
    toast.success('Filled sample organizer details!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Please enter name, email, and password');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      navigate('/organizer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <HiShieldCheck className="w-4 h-4" />
              Organizer Onboarding
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Register as Organizer
            </h1>
            <p className="text-slate-400 text-sm">
              Publish events, manage attendees, and track real-time ticket revenue.
            </p>
          </div>

          <button
            type="button"
            id="fill-sample-reg-btn"
            onClick={fillSampleRegistration}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <HiSparkles className="w-4 h-4 text-indigo-400" />
            Auto-Fill Sample
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g. Alex Rivera"
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
                  placeholder="organizer@company.com"
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
              <label htmlFor="reg-company" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Company / Organization
              </label>
              <div className="relative">
                <HiBuildingOffice2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-company"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. NextGen Events LLC"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555-0199"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-city" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                City / Base
              </label>
              <div className="relative">
                <HiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-website" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Website
              </label>
              <div className="relative">
                <HiGlobeAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="reg-website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="reg-bio" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Organizer Bio
            </label>
            <textarea
              id="reg-bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell attendees about your organization, event mission, and history..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            id="organizer-register-btn"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
            <HiArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered as an organizer?{' '}
          <Link
            to="/organizer/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegisterPage;
