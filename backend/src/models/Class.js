import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: { type: String, default: 'UTC' },
    type: { type: String, enum: ['trial', 'regular'], required: true },
    meetingUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
  },
  { timestamps: true }
);

const Class = mongoose.model('Class', classSchema);
export default Class;