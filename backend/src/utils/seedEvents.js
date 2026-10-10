import Event from '../models/eventModel.js';

export const sampleEvents = [
  {
    title: 'Global Tech Summit 2026',
    description: 'Join top developers, founders, and engineers to explore the latest in Artificial Intelligence, Cloud Infrastructure, and Distributed Systems. Featuring 30+ keynote speakers and workshops.',
    category: 'Technology',
    date: new Date('2026-11-15T09:00:00.000Z'),
    time: '09:00 AM - 05:00 PM',
    venue: 'Silicon Innovation Arena',
    city: 'San Francisco',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    organizer: 'NextGen Tech Collective',
    totalSeats: 350,
    availableSeats: 350,
    ticketPrice: 99,
    status: 'upcoming'
  },
  {
    title: 'Acoustic Indie Music Festival',
    description: 'An open-air evening under the stars featuring indie acoustic songwriters, local artisanal food stalls, and immersive soundscapes.',
    category: 'Music',
    date: new Date('2026-12-05T17:00:00.000Z'),
    time: '05:00 PM - 11:00 PM',
    venue: 'Sunset Meadows Amphitheater',
    city: 'Austin',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    organizer: 'Sonic Vibe Productions',
    totalSeats: 500,
    availableSeats: 500,
    ticketPrice: 45,
    status: 'upcoming'
  },
  {
    title: 'Venture & Founder Networking Mixer',
    description: 'High-impact networking evening connecting pre-seed and Series A founders with prominent angel investors and venture capital partners.',
    category: 'Business',
    date: new Date('2026-10-28T18:30:00.000Z'),
    time: '06:30 PM - 09:30 PM',
    venue: 'The Skyline Club Lounge',
    city: 'New York',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    organizer: 'Alpha Capital Syndicate',
    totalSeats: 120,
    availableSeats: 120,
    ticketPrice: 75,
    status: 'upcoming'
  },
  {
    title: 'Full-Stack React & Node Masterclass',
    description: 'Hands-on intensive workshop building production scalable web applications using React 19, Express, MongoDB, and modern DevOps tools.',
    category: 'Workshop',
    date: new Date('2026-11-20T10:00:00.000Z'),
    time: '10:00 AM - 04:00 PM',
    venue: 'CodeCraft Learning Hub',
    city: 'Seattle',
    bannerImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
    organizer: 'DevElevate Labs',
    totalSeats: 60,
    availableSeats: 60,
    ticketPrice: 120,
    status: 'upcoming'
  }
];

export const seedDatabaseIfEmpty = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('No events found. Seeding initial events...');
      await Event.insertMany(sampleEvents);
      console.log('Sample events seeded successfully!');
    }
  } catch (error) {
    console.error('Error auto-seeding sample events:', error.message);
  }
};
