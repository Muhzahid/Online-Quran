import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 2000, default: '' },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;