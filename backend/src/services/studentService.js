import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import { AppError } from '../utils/ApiResponse.js';

export const getOrCreateStudentProfile = async (userId) => {
  let profile = await StudentProfile.findOne({ userId }).populate(
    'userId',
    'name email phone avatar role isVerified'
  );
  if (!profile) {
    profile = await StudentProfile.create({ userId });
    profile = await StudentProfile.findById(profile._id).populate(
      'userId',
      'name email phone avatar role isVerified'
    );
  }
  return profile;
};

export const updateStudentProfile = async (userId, payload) => {
  const profile = await getOrCreateStudentProfile(userId);

  const fields = [
    'dateOfBirth',
    'gender',
    'country',
    'timezone',
    'preferredLanguage',
    'learningLevel',
    'parentGuardian',
  ];

  for (const key of fields) {
    if (payload[key] !== undefined) profile[key] = payload[key];
  }

  if (payload.name || payload.phone !== undefined) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (payload.name) user.name = payload.name;
    if (payload.phone !== undefined) user.phone = payload.phone;
    await user.save();
  }

  await profile.save();
  return getOrCreateStudentProfile(userId);
};
