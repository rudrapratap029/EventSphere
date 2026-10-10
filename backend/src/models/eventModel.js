import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    bannerImage: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1']
    },
    availableSeats: {
      type: Number
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status'
      },
      default: 'upcoming'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Ensure availableSeats defaults to totalSeats if not explicitly provided
eventSchema.pre('save', function () {
  if (this.isNew && (this.availableSeats === undefined || this.availableSeats === null)) {
    this.availableSeats = this.totalSeats;
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
