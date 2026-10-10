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
  HiArrowRightOnRectangle,
  HiPencilSquare
} from 'react-icons/hi2';
import { useOrganizer } from '../context/OrganizerAuthContext';
import { updateOrganizerProfile, getOrganizerProfile } from '../services/organizerService';

const OrganizerProfilePage = () => {
  const { organizer, updateProfileState, logout } = useOrganizer();

  const [formData, setFormData] = useState({
    name: organizer?.name || '',
    phone: organizer?.phone || '',
    companyName: organizer?.companyName || '',
    city: organizer?.city || '',
    website: organizer?.website || '',
    bio: organizer?.bio || '',
    profileImage: organizer?.profileImage || '',
    password: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (organizer) {
      setFormData({
        name: organizer.name || '',
        phone: organizer.phone || '',
        companyName: organizer.companyName || '',
        city: organizer.city || '',
        website: organizer.website || '',
        bio: organizer.bio || '',
        profileImage: organizer.profileImage || '',
        password: ''
      });
    }
  }, [organizer]);

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

      const res = await updateOrganizerProfile(payload);
      if (res.success && res.data) {
        updateProfileState(res.data);
        toast.success('Organizer profile updated successfully!');
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
            src={organizer?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
            alt={organizer?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
            }}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{organizer?.name}</h1>
              {organizer?.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <HiCheckBadge className="w-4 h-4" />
                  Verified Organizer
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {organizer?.companyName || 'Independent Organizer'}
            </p>
            <div className="text-xs text-slate-400 space-y-0.5 pt-1">
              <p>Email: {organizer?.email}</p>
              {organizer?.city && <p>Base City: {organizer.city}</p>}
              {organizer?.phone && <p>Phone: {organizer.phone}</p>}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <HiArrowRightOnRectangle className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleUpdate} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HiPencilSquare className="w-5 h-5 text-indigo-400" />
            Update Profile Information
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Keep your organizer credentials and contact channels updated for attendees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="prof-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="prof-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-company" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company / Brand Name
            </label>
            <div className="relative">
              <HiBuildingOffice2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="prof-company"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. NextGen Studios"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="prof-phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Contact Phone
            </label>
            <div className="relative">
              <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="prof-phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-city" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Operating City
            </label>
            <div className="relative">
              <HiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="prof-city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-website" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Website URL
            </label>
            <div className="relative">
              <HiGlobeAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="prof-website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="prof-avatar" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Profile Avatar Image URL
          </label>
          <div className="relative">
            <HiPhoto className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="prof-avatar"
              name="profileImage"
              type="text"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prof-bio" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Bio & Organization Background
          </label>
          <textarea
            id="prof-bio"
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell attendees about your experience, past productions, and credentials..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="prof-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Change Password (leave blank to keep current)
          </label>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="prof-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            id="save-profile-btn"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizerProfilePage;
