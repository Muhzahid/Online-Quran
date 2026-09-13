import Assignment from '../models/Assignment.js';
import Teacher from '../models/Teacher.js';
import { AppError } from '../utils/ApiResponse.js';

const teacherForUser = async (userId) => {
  const teacher = await Teacher.findOne({ userId });
  if (!teacher) throw new AppError('Teacher profile not found', 404);
  return teacher;
};

const populate = (query) => query
  .populate('studentId', 'name email')
  .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name email' } })
  .populate('courseId', 'title slug');

export const listAssignments = async (user) => {
  const filter = user.role === 'student' ? { studentId: user.id } : { teacherId: (await teacherForUser(user.id))._id };
  return populate(Assignment.find(filter).sort({ dueDate: 1, createdAt: -1 }));
};

export const createAssignment = async (user, payload) => {
  const teacher = await teacherForUser(user.id);
  return populate(Assignment.create({ ...payload, teacherId: teacher._id }));
};

export const submitAssignment = async (user, id, answer) => {
  const assignment = await Assignment.findOne({ _id: id, studentId: user.id });
  if (!assignment) throw new AppError('Assignment not found', 404);
  if (assignment.status !== 'open') throw new AppError('Assignment is closed', 422);
  const current = assignment.submissions.find((item) => item.studentId.toString() === user.id);
  if (current) current.answer = answer;
  else assignment.submissions.push({ studentId: user.id, answer });
  await assignment.save();
  return populate(Assignment.findById(id));
};

export const gradeSubmission = async (user, id, submissionId, payload) => {
  const teacher = await teacherForUser(user.id);
  const assignment = await Assignment.findOne({ _id: id, teacherId: teacher._id });
  if (!assignment) throw new AppError('Assignment not found', 404);
  const submission = assignment.submissions.id(submissionId);
  if (!submission) throw new AppError('Submission not found', 404);
  submission.grade = payload.grade;
  submission.feedback = payload.feedback || '';
  submission.gradedAt = new Date();
  await assignment.save();
  return populate(Assignment.findById(id));
};