import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  provider: { type: String, enum: ['manual', 'stripe', 'paypal'], default: 'manual' },
  providerPaymentId: { type: String, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  type: { type: String, enum: ['one_time', 'subscription'], default: 'one_time' },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending', index: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;