import { APP_NAME } from '../../constants';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-text-muted">
        {APP_NAME} respects your privacy. We collect account details, class
        activity, and payment records needed to operate the platform. We do not
        sell personal data. Access to private student and teacher information is
        restricted by role-based permissions. Contact us for data access or
        deletion requests.
      </p>
    </div>
  );
}
