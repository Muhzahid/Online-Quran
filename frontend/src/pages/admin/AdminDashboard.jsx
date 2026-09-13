import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi
      .adminApplications({ status: 'pending', limit: 50 })
      .then(({ data }) => setApplications(data.data.items || []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-text-muted">
        Signed in as {user?.name}. Review academy activity from one place.
      </p>
      <div className="mt-8 rounded-md border border-secondary/40 bg-secondary/10 p-4">
        <p className="text-sm text-text-muted">Pending teacher applications</p>
        <p className="mt-1 text-3xl font-semibold text-primary">
          {applications.length}
        </p>
        <Link
          to="/admin/teacher-applications"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          Review applications
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Students', '/admin/students'],
          ['Teachers', '/admin/teachers'],
          ['Courses', '/admin/courses'],
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
