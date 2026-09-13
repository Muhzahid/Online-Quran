import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, unique: true },
    studentStatus: {
      type: String,
      enum: ['unmarked', 'present', 'absent', 'late'],
      default: 'unmarked',
    },
    teacherStatus: {
      type: String,
      enum: ['unmarked', 'present', 'absent', 'late'],
      default: 'unmarked',
    },
    notes: { type: String, maxlength: 1000, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;