import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">About Us</h1>
      <p className="mt-4 text-text">
        {APP_NAME} is an online Quran teaching platform connecting students with
        verified teachers for personalized live classes. We combine structured
        courses, progress tracking, and flexible scheduling so families and adult
        learners can grow with the Quran — anywhere in the world.
      </p>
      <p className="mt-4 text-text-muted">
        Our teachers complete a profile and qualification review before they can
        conduct classes. Students can book a free trial, subscribe to a plan, and
        learn with clear goals for reading, Tajweed, and memorization.
      </p>
      <Link
        to="/trial-class"
        className="mt-8 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Book a Free Trial
      </Link>
    </div>
  );
}
