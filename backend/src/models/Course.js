import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 30 },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 300,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: 'Flexible',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'beginner',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    lessons: [lessonSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

courseSchema.index({ isActive: 1, level: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
