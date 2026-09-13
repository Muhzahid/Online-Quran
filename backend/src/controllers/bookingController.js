import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as bookingService from '../services/bookingService.js';

export const getSlots = asyncHandler(async (req, res) => {
  const slots = await bookingService.getAvailableSlots({
    teacherId: req.query.teacherId,
    date: req.query.date,
    duration: Number(req.query.duration) || 60,
  });
  sendSuccess(res, { message: 'Available slots fetched', data: { slots } });
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user.id);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Booking created successfully',
    data: { booking },
  });
});

export const getBookings = asyncHandler(async (req, res) => {
  const data = await bookingService.listBookings(req.user, req.query);
  sendSuccess(res, { message: 'Bookings fetched', data });
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id, req.user);
  sendSuccess(res, { message: 'Booking fetched', data: { booking } });
});

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBooking(
    req.params.id,
    req.user,
    req.body
  );
  sendSuccess(res, { message: 'Booking updated', data: { booking } });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  await bookingService.deleteBooking(req.params.id, req.user);
  sendSuccess(res, { message: 'Booking deleted', data: null });
});

export const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBooking(req.params.id, req.user);
  sendSuccess(res, { message: 'Booking confirmed', data: { booking } });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user);
  sendSuccess(res, { message: 'Booking cancelled', data: { booking } });
});

export const completeBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.completeBooking(req.params.id, req.user);
  sendSuccess(res, { message: 'Booking completed', data: { booking } });
});
