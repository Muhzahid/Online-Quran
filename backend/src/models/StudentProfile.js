import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    country: { type: String, default: '' },
    timezone: { type: String, default: 'UTC' },
    preferredLanguage: { type: String, default: 'English' },
    learningLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', ''],
      default: 'beginner',
    },
    parentGuardian: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
