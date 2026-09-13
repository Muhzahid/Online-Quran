import { APP_NAME } from '../../constants';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">
        Terms & Conditions
      </h1>
      <p className="mt-4 text-sm text-text-muted">
        By using {APP_NAME}, you agree to provide accurate account information,
        respect class schedules, and use meeting links only for authorized
        learning sessions. Teachers must maintain professional conduct and
        accurate availability. Subscriptions and refunds follow the plan terms
        shown at checkout. Misuse may result in account suspension.
      </p>
    </div>
  );
}
