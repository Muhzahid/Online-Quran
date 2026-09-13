import { AppError, asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as teacherService from '../services/teacherService.js';
import { filePublicUrl, isCloudinaryEnabled, uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export const getTeachers = asyncHandler(async (req, res) => {
  const data = await teacherService.listPublicTeachers(req.query);
  sendSuccess(res, { message: 'Teachers fetched', data });
});

export const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getPublicTeacherById(req.params.id);
  sendSuccess(res, { message: 'Teacher fetched', data: { teacher } });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getOrCreateTeacherProfile(req.user.id);
  sendSuccess(res, { message: 'Teacher profile fetched', data: { teacher } });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateTeacherProfile(
    req.user.id,
    req.body
  );
  sendSuccess(res, { message: 'Profile updated', data: { teacher } });
});

export const updateMyAvailability = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateAvailability(
    req.user.id,
    req.body.availability || [],
    req.body.timezone
  );
  sendSuccess(res, { message: 'Availability updated', data: { teacher } });
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const uploaded = isCloudinaryEnabled()
    ? await uploadToCloudinary(req.file, 'quran-academy/documents')
    : { url: filePublicUrl(req, req.file.filename, 'documents'), publicId: req.file.filename };
  const document = { name: req.body.name || req.file.originalname, ...uploaded };

  const teacher = await teacherService.addQualificationDocument(
    req.user.id,
    document
  );

  sendSuccess(res, {
    statusCode: 201,
    message: 'Document uploaded',
    data: { teacher },
  });
});

export const submitApplication = asyncHandler(async (req, res) => {
  const teacher = await teacherService.submitApplication(req.user.id);
  sendSuccess(res, {
    message: 'Application submitted for admin review',
    data: { teacher },
  });
});

export const getApplications = asyncHandler(async (req, res) => {
  const data = await teacherService.listTeacherApplications(req.query);
  sendSuccess(res, { message: 'Applications fetched', data });
});

export const getAdminTeachers = asyncHandler(async (req, res) => {
  const data = await teacherService.listAllTeachersAdmin(req.query);
  sendSuccess(res, { message: 'Teachers fetched', data });
});

export const approveTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.approveTeacher(req.params.id);
  sendSuccess(res, { message: 'Teacher approved', data: { teacher } });
});

export const rejectTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.rejectTeacher(
    req.params.id,
    req.body.reason
  );
  sendSuccess(res, { message: 'Teacher rejected', data: { teacher } });
});

export const suspendTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.suspendTeacher(
    req.params.id,
    req.body.reason
  );
  sendSuccess(res, { message: 'Teacher suspended', data: { teacher } });
});
