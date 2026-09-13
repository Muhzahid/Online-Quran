import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';

export default function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await teacherApi.getMyProfile();
        setTeacher(data.data.teacher);
      } catch {
        setTeacher(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        Welcome, {user?.name || 'Teacher'}
      </h1>
      <p className="mt-2 text-text-muted">
        Application status:{' '}
        <span className="font-medium capitalize">
          {teacher?.applicationStatus || 'draft'}
        </span>
      </p>

      {!teacher?.isApproved && (
        <div className="mt-6 rounded-md border border-secondary/40 bg-secondary/10 p-4 text-sm">
          Complete your profile, upload qualifications, and submit your
          application. You cannot conduct classes until an admin approves you.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Complete Profile', '/teacher/profile'],
          ['Qualifications', '/teacher/qualifications'],
          ['Availability', '/teacher/availability'],
          ['Trial Classes', '/teacher/trial-classes'],
          ['Calendar', '/teacher/calendar'],
          ['Students', '/teacher/students'],
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
