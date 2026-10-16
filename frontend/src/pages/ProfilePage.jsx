import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  HiUser, 
  HiEnvelope, 
  HiPhone, 
  HiBuildingOffice2, 
  HiMapPin, 
  HiGlobeAlt, 
  HiCheckBadge,
  HiLockClosed,
  HiPhoto,
  HiSparkles,
  HiArrowRightOnRectangle
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/authService';

const ProfilePage = () => {
  const { user, isOrganizer, updateUser, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    city: user?.city || '',
    website: user?.website || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    password: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        city: user.city || '',
        website: user.website || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res = await updateMe(payload);
      if (res.success && res.data) {
        updateUser(res.data);
        toast.success('Profile updated successfully!');
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400';
            }}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{user?.name}</h1>
              {isOrganizer ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <HiCheckBadge className="w-4 h-4" />
                  Organizer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                  <HiSparkles className="w-4 h-4" />
                  Attendee
                </span>
              )}
            </div>
            {isOrganizer && user?.companyName && (
              <p className="text-sm text-slate-300 font-medium">
                {user.companyName}
              </p>
            )}
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <HiEnvelope className="w-3.5 h-3.5 text-indigo-400" />
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          <HiArrowRightOnRectangle className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Edit Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
          Account Settings
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <HiEnvelope className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-slate-400 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <HiPhone className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Profile Image URL
              </label>
              <div className="relative">
                <HiPhoto className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  name="profileImage"
                  type="text"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                />
              </div>
            </div>

            {/* Organizer-only fields */}
            {isOrganizer && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <HiBuildingOffice2 className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Apex Events Inc."
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    City / Location
                  </label>
                  <div className="relative">
                    <HiMapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="San Francisco, CA"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <HiGlobeAlt className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      name="website"
                      type="text"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Bio / Organization Description
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell attendees about your organization and past events..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none resize-none"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                New Password (Optional)
              </label>
              <div className="relative">
                <HiLockClosed className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep your current password"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
