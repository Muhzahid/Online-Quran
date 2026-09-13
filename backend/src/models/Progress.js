import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    lessons: [
      {
        lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
    notes: { type: String, maxlength: 2000, default: '' },
  },
  { timestamps: true }
);

progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
const Progress = mongoose.model('Progress', progressSchema);
export default Progress;