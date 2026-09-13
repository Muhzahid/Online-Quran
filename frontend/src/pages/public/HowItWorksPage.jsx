import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Create your account',
    text: 'Register as a student and verify your email.',
  },
  {
    title: 'Choose course & teacher',
    text: 'Browse courses and filter teachers by language, specialization, and availability.',
  },
  {
    title: 'Book a free trial',
    text: 'Pick a date and available time slot that works for you.',
  },
  {
    title: 'Join your live class',
    text: 'Receive a Meet/Zoom link and start learning with your teacher.',
  },
  {
    title: 'Track progress',
    text: 'See attendance, assignments, and Quran progress in your dashboard.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">
        How it works
      </h1>
      <p className="mt-2 text-text-muted">
        From signup to your first class in five clear steps.
      </p>
      <ol className="mt-10 space-y-8">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="font-display text-3xl text-secondary">
              0{index + 1}
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold text-primary">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        to="/trial-class"
        className="mt-10 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Book Free Trial
      </Link>
    </div>
  );
}
