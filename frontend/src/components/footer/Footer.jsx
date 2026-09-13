import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary/30 bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold tracking-wide text-secondary-light">{APP_NAME}</p>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Learn Quran online with certified teachers — anytime, anywhere.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/about" className="hover:text-secondary-light">
              About
            </Link>
            <Link to="/courses" className="hover:text-secondary-light">
              Courses
            </Link>
            <Link to="/contact" className="hover:text-secondary-light">
              Contact
            </Link>
            <Link to="/privacy-policy" className="hover:text-secondary-light">
              Privacy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-secondary-light"
            >
              Terms
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-white/15 pt-6 text-sm text-white/60">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
