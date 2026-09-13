import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  provider: { type: String, enum: ['manual', 'stripe', 'paypal'], default: 'manual' },
  providerSubscriptionId: String,
  plan: { type: String, required: true },
  status: { type: String, enum: ['active', 'past_due', 'cancelled', 'expired'], default: 'active' },
  currentPeriodEnd: Date,
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;