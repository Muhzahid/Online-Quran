import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true, // YYYY-MM-DD
    },
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },
    timezone: { type: String, default: 'UTC' },
    type: {
      type: String,
      enum: ['trial', 'regular'],
      default: 'trial',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
      index: true,
    },
    meetingUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ teacherId: 1, date: 1, startTime: 1, status: 1 });
bookingSchema.index({ studentId: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
