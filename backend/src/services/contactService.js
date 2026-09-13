import ContactMessage from '../models/ContactMessage.js';
import { AppError } from '../utils/ApiResponse.js';
import { sendEmail } from './emailService.js';
import config from '../config/index.js';

export const createContactMessage = async (payload) => {
  const message = await ContactMessage.create(payload);

  await sendEmail({
    to: config.smtp.user || 'admin@localhost',
    subject: `Contact form: ${payload.subject}`,
    html: `<p><strong>From:</strong> ${payload.name} (${payload.email})</p>
           <p><strong>Phone:</strong> ${payload.phone || 'N/A'}</p>
           <p><strong>Message:</strong></p><p>${payload.message}</p>`,
    text: `From: ${payload.name} <${payload.email}>\n${payload.message}`,
  });

  return message;
};

export const listContactMessages = async ({ page = 1, limit = 20, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactMessage.countDocuments(filter),
  ]);
  return {
    items,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) || 1 },
  };
};

export const updateContactStatus = async (id, status, adminNotes) => {
  const message = await ContactMessage.findById(id);
  if (!message) throw new AppError('Contact message not found', 404);
  if (status) message.status = status;
  if (adminNotes !== undefined) message.adminNotes = adminNotes;
  await message.save();
  return message;
};
