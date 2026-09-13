import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
import Loader from '../../components/loaders/Loader';

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi
      .list({ limit: 50 })
      .then(({ data }) => setBookings(data.data.items || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  const upcomingClasses = bookings.filter(
    ({ status }) => status === 'pending' || status === 'confirmed'
  ).length;
  const completedClasses = bookings.filter(
    ({ status }) => status === 'completed'
  ).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        Welcome, {user?.name || 'Student'}
      </h1>
      <p className="mt-2 text-text-muted">
        Keep track of your classes and continue your Quran learning journey.
      </p>
      {!user?.isVerified && (
        <div className="mt-6 rounded-md border border-secondary/40 bg-secondary/10 p-4 text-sm">
          Please verify your email to unlock all features. Check your inbox for
          the verification link.
        </div>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="text-sm text-text-muted">Upcoming classes</p>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {upcomingClasses}
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="text-sm text-text-muted">Completed classes</p>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {completedClasses}
          </p>
        </div>
        {[
          ['My Classes', '/student/classes'],
          ['Progress', '/student/progress'],
          ['Assignments', '/student/assignments'],
        ].map(([label, to]) => (
          <Link
            key={to}
            to={to}
            className="rounded-md border border-border bg-surface p-5 text-sm font-medium hover:border-primary/40"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
