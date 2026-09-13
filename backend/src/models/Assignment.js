import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, required: true, maxlength: 5000 },
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number, min: 0, max: 100 },
    feedback: { type: String, maxlength: 2000, default: '' },
    gradedAt: Date,
  },
  { _id: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    instructions: { type: String, required: true, maxlength: 5000 },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    dueDate: Date,
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;