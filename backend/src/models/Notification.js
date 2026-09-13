import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['booking', 'class', 'assignment', 'system'], default: 'system' },
    title: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 1000 },
    link: { type: String, default: '' },
    readAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;