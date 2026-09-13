import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as contactService from '../services/contactService.js';

export const submitContact = asyncHandler(async (req, res) => {
  const message = await contactService.createContactMessage(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Message sent successfully. We will get back to you soon.',
    data: { id: message._id },
  });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const data = await contactService.listContactMessages(req.query);
  sendSuccess(res, { message: 'Contact messages fetched', data });
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await contactService.updateContactStatus(
    req.params.id,
    req.body.status,
    req.body.adminNotes
  );
  sendSuccess(res, { message: 'Contact message updated', data: { message } });
});
