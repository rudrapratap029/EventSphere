import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HiArrowLeft, 
  HiPhoto, 
  HiSparkles,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi2';
import { createEvent, getEventById, updateEvent } from '../services/eventService';
import { createOrganizerEvent, updateOrganizerEvent } from '../services/organizerService';
import { useOrganizer } from '../context/OrganizerAuthContext';

const CATEGORIES = [
  'Technology',
  'Music',
  'Business',
  'Workshop',
  'Arts',
  'Sports',
  'Food',
  'Other'
];

const PRESET_BANNERS = [
  { label: 'Technology', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Indie Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Business Mixer', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Code Masterclass', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80' }
];

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizer, isAuthenticated } = useOrganizer();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    date: '',
    time: '',
    venue: '',
    city: '',
    bannerImage: '',
    organizer: organizer?.companyName || organizer?.name || '',
    totalSeats: 100,
    availableSeats: '',
    ticketPrice: 0,
    status: 'upcoming'
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditMode && organizer && !formData.organizer) {
      setFormData((prev) => ({
        ...prev,
        organizer: organizer.companyName || organizer.name || ''
      }));
    }
  }, [organizer, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      const fetchCurrentEvent = async () => {
        try {
          const res = await getEventById(id);
          if (res.success && res.data) {
            const ev = res.data;
            const formattedDate = ev.date ? new Date(ev.date).toISOString().split('T')[0] : '';
            setFormData({
              title: ev.title || '',
              description: ev.description || '',
              category: ev.category || 'Technology',
              date: formattedDate,
              time: ev.time || '',
              venue: ev.venue || '',
              city: ev.city || '',
              bannerImage: ev.bannerImage || '',
              organizer: ev.organizer || '',
              totalSeats: ev.totalSeats || 100,
              availableSeats: ev.availableSeats ?? ev.totalSeats,
              ticketPrice: ev.ticketPrice ?? 0,
              status: ev.status || 'upcoming'
            });
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to fetch event data');
          navigate('/events');
        } finally {
          setLoading(false);
        }
      };

      fetchCurrentEvent();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const fillSampleData = () => {
    setFormData({
      title: 'AI & NextGen Cloud Developer Conference',
      description: 'A full-day flagship conference focusing on large-scale AI applications, cloud infrastructure, container orchestration, and next-generation frameworks. Featuring keynote sessions from renowned industry pioneers.',
      category: 'Technology',
      date: '2026-11-25',
      time: '09:30 AM - 05:30 PM',
      venue: 'Metropolitan Convention Hall',
      city: 'San Francisco',
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      organizer: 'CloudScale Ecosystems',
      totalSeats: 250,
      availableSeats: 250,
      ticketPrice: 65,
      status: 'upcoming'
    });
    setErrors({});
    toast.success('Sample data populated!');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';
    if (!formData.totalSeats || Number(formData.totalSeats) < 1) {
      newErrors.totalSeats = 'Total seats must be at least 1';
    }
    if (formData.ticketPrice === '' || Number(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Price cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        ticketPrice: Number(formData.ticketPrice),
        availableSeats: formData.availableSeats !== '' ? Number(formData.availableSeats) : Number(formData.totalSeats)
      };

      if (isEditMode) {
        const res = isAuthenticated ? await updateOrganizerEvent(id, payload) : await updateEvent(id, payload);
        if (res.success) {
          toast.success('Event updated successfully!');
          navigate(`/events/${id}`);
        }
      } else {
        const res = isAuthenticated ? await createOrganizerEvent(payload) : await createEvent(payload);
        if (res.success) {
          toast.success('Event created successfully!');
          if (isAuthenticated) {
            navigate('/organizer/events');
          } else {
            navigate(`/events/${res.data?._id || ''}`);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-800 rounded" />
        <div className="h-10 w-2/3 bg-slate-800 rounded" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={isEditMode ? `/events/${id}` : '/events'}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2"
          >
            <HiArrowLeft className="w-4 h-4" />
            {isEditMode ? 'Back to event details' : 'Back to all events'}
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEditMode
              ? 'Update event details, scheduling, tickets, or status.'
              : 'Fill in the information below to publish and list your event on EventHub.'}
          </p>
        </div>

        {!isEditMode && (
          <button
            type="button"
            id="fill-sample-btn"
            onClick={fillSampleData}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 hover:text-indigo-200 text-xs font-semibold uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
          >
            <HiSparkles className="w-4 h-4 text-indigo-400" />
            Auto-Fill Demo
          </button>
        )}
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Basic Information */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            General Information
          </h2>

          <div>
            <label htmlFor="event-title-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Event Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="event-title-input"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. NextGen Web Summit 2026"
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
              } text-white text-sm outline-none transition-all`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="event-category-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                id="event-category-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="event-status-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                id="event-status-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none cursor-pointer"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="event-description-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="event-description-input"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive breakdown of the schedule, keynotes, topics covered, and who should attend..."
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
              } text-white text-sm outline-none transition-all`}
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Date, Time & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="event-date-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-date-input"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.date ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-white text-sm outline-none`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="event-time-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Time <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-time-input"
                name="time"
                type="text"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 05:00 PM"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.time ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-white text-sm outline-none`}
              />
              {errors.time && <p className="text-xs text-rose-400 mt-1">{errors.time}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="event-venue-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Venue <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-venue-input"
                name="venue"
                type="text"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Tech Arena Hall 4"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.venue ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-white text-sm outline-none`}
              />
              {errors.venue && <p className="text-xs text-rose-400 mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label htmlFor="event-city-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                City <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-city-input"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. San Francisco"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.city ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-white text-sm outline-none`}
              />
              {errors.city && <p className="text-xs text-rose-400 mt-1">{errors.city}</p>}
            </div>
          </div>
        </div>

        {/* Tickets, Capacity & Organizer */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Tickets, Seats & Organizer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="event-price-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Ticket Price ($) <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-price-input"
                name="ticketPrice"
                type="number"
                min="0"
                step="1"
                value={formData.ticketPrice}
                onChange={handleChange}
                placeholder="0 for free"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.ticketPrice ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-white text-sm outline-none`}
              />
              {errors.ticketPrice && <p className="text-xs text-rose-400 mt-1">{errors.ticketPrice}</p>}
            </div>

            <div>
              <label htmlFor="event-total-seats-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Total Capacity <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-total-seats-input"
                name="totalSeats"
                type="number"
                min="1"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="e.g. 200"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.totalSeats ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-white text-sm outline-none`}
              />
              {errors.totalSeats && <p className="text-xs text-rose-400 mt-1">{errors.totalSeats}</p>}
            </div>

            <div>
              <label htmlFor="event-available-seats-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Available Seats {isEditMode && '(Editable)'}
              </label>
              <input
                id="event-available-seats-input"
                name="availableSeats"
                type="number"
                min="0"
                value={formData.availableSeats !== '' ? formData.availableSeats : formData.totalSeats}
                onChange={handleChange}
                placeholder="Defaults to Total Seats"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="event-organizer-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Organizer Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="event-organizer-input"
              name="organizer"
              type="text"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="e.g. Global Tech Council"
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                errors.organizer ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
              } text-white text-sm outline-none`}
            />
            {errors.organizer && <p className="text-xs text-rose-400 mt-1">{errors.organizer}</p>}
          </div>
        </div>

        {/* Banner Image */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Banner Image
          </h2>

          <div>
            <label htmlFor="event-banner-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Image URL (Optional)
            </label>
            <input
              id="event-banner-input"
              name="bannerImage"
              type="text"
              value={formData.bannerImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
            />
          </div>

          {/* Preset Suggestions */}
          <div>
            <span className="text-xs text-slate-400 block mb-2">Or choose a high-resolution preset:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_BANNERS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData((prev) => ({ ...prev, bannerImage: preset.url }))}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          {formData.bannerImage && (
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400">Live Preview:</span>
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={formData.bannerImage}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-4">
          <Link
            to={isEditMode ? `/events/${id}` : '/events'}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            id="save-event-btn"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventFormPage;
