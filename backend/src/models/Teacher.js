import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
      required: true,
    },
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },
    isOff: { type: Boolean, default: false },
  },
  { _id: true }
);

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: { type: String, default: '', maxlength: 2000 },
    qualification: { type: String, default: '' },
    experience: { type: Number, default: 0, min: 0 },
    languages: [{ type: String, trim: true }],
    specialization: [{ type: String, trim: true }],
    hourlyRate: { type: Number, default: 0, min: 0 },
    country: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    timezone: { type: String, default: 'UTC' },
    availability: [availabilitySlotSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    isApproved: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    applicationStatus: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'suspended'],
      default: 'draft',
    },
    rejectionReason: { type: String, default: '' },
    documents: [
      {
        name: String,
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

teacherSchema.index({ isApproved: 1, applicationStatus: 1 });
teacherSchema.index({ country: 1 });
teacherSchema.index({ specialization: 1 });
teacherSchema.index({ rating: -1 });
teacherSchema.index({ hourlyRate: 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
