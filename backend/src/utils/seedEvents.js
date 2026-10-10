import Event from '../models/eventModel.js';
import Organizer from '../models/organizerModel.js';
import User from '../models/userModel.js';

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
    availableSeats: 320,
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
    organizer: 'NextGen Tech Collective',
    totalSeats: 500,
    availableSeats: 450,
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
    organizer: 'NextGen Tech Collective',
    totalSeats: 120,
    availableSeats: 100,
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
    organizer: 'NextGen Tech Collective',
    totalSeats: 60,
    availableSeats: 50,
    ticketPrice: 120,
    status: 'upcoming'
  }
];

export const seedDatabaseIfEmpty = async () => {
  try {
    // Seed demo organizer if none exists
    let demoOrganizer = await Organizer.findOne({ email: 'demo@eventhub.com' });
    if (!demoOrganizer) {
      console.log('Seeding demo organizer (demo@eventhub.com)...');
      demoOrganizer = await Organizer.create({
        name: 'Alex Rivera',
        email: 'demo@eventhub.com',
        password: 'organizer123',
        phone: '+1 (555) 234-5678',
        companyName: 'NextGen Tech Collective',
        bio: 'Passionate event curator specializing in technology conferences, developer hackathons, and creative arts festivals.',
        website: 'https://nextgen-events.example.com',
        city: 'San Francisco',
        verified: true
      });
      console.log('Demo organizer created successfully!');
    }

    // Seed demo user if none exists
    let demoUser = await User.findOne({ email: 'demo.user@example.com' });
    if (!demoUser) {
      console.log('Seeding demo user (demo.user@example.com)...');
      demoUser = await User.create({
        name: 'Alex Attendee',
        email: 'demo.user@example.com',
        password: 'user123',
        phone: '+1 (555) 321-4567',
        role: 'user'
      });
      console.log('Demo user created successfully!');
    }

    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('No events found. Seeding initial events...');
      const eventsWithOrganizer = sampleEvents.map((ev) => ({
        ...ev,
        organizerId: demoOrganizer._id,
        organizer: demoOrganizer.companyName || demoOrganizer.name
      }));
      await Event.insertMany(eventsWithOrganizer);
      console.log('Sample events seeded successfully with organizer link!');
    } else {
      // If events exist without organizerId, bind them to demoOrganizer
      await Event.updateMany(
        { organizerId: { $exists: false } },
        { $set: { organizerId: demoOrganizer._id } }
      );
    }
  } catch (error) {
    console.error('Error auto-seeding sample organizer/events:', error.message);
  }
};
