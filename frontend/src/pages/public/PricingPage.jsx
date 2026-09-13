import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: 39,
    classes: '2 classes/week',
    features: ['30–45 min sessions', 'Progress tracking', 'Email support'],
  },
  {
    name: 'Standard',
    price: 59,
    classes: '3 classes/week',
    features: ['Priority teacher matching', 'Assignments', 'Attendance reports'],
    featured: true,
  },
  {
    name: 'Premium',
    price: 89,
    classes: '5 classes/week',
    features: ['Intensive schedule', 'Dedicated messaging', 'Monthly reviews'],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">Pricing</h1>
      <p className="mt-2 text-text-muted">
        Choose a plan that fits your learning pace. Start with a free trial.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`border p-6 ${
              plan.featured ? 'border-primary bg-primary text-white' : 'border-border bg-surface'
            }`}
          >
            <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
            <p className={`mt-1 text-sm ${plan.featured ? 'text-white/80' : 'text-text-muted'}`}>
              {plan.classes}
            </p>
            <p className="mt-6 font-display text-4xl font-semibold">
              ${plan.price}
              <span className="text-base font-body font-normal">/mo</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link
              to="/register"
              className={`mt-8 inline-block rounded-md px-4 py-2 text-sm font-semibold ${
                plan.featured
                  ? 'bg-white text-primary'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
