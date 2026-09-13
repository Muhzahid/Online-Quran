import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { classApi } from '../../services/classApi';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loader from '../../components/loaders/Loader';

const attendanceOptions = ['unmarked', 'present', 'absent', 'late'];

export default function ClassesPage() {
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await classApi.list({ limit: 50 });
      setItems(data.data.items || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveAttendance = async (item, value) => {
    try {
      const payload = isTeacher ? { teacherStatus: value } : { studentStatus: value };
      await classApi.saveAttendance(item._id, payload);
      toast.success('Attendance saved');
      await load();
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to save attendance.');
    }
  };

  if (loading) return <Loader message="Loading classes..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        My Classes
      </h1>
      <p className="mt-2 text-text-muted">
        Review scheduled sessions and keep attendance up to date.
      </p>
      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No classes yet." description="Confirmed bookings will appear here." />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <article key={item._id} className="rounded-md border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium text-text">{item.courseId?.title}</h2>
                  <p className="mt-1 text-sm text-text-muted">
                    {isTeacher ? item.studentId?.name : item.teacherId?.userId?.name}
                    {' · '}{item.date} · {item.startTime}-{item.endTime}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs capitalize text-primary">
                  {item.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {item.meetingUrl && item.status === 'scheduled' && (
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-primary px-3 py-2 font-medium text-white"
                  >
                    Join class
                  </a>
                )}
                <label className="text-text-muted">
                  {isTeacher ? 'Teacher attendance' : 'My attendance'}
                  <select
                    value={item.attendance?.[isTeacher ? 'teacherStatus' : 'studentStatus'] || 'unmarked'}
                    onChange={(event) => saveAttendance(item, event.target.value)}
                    className="ml-2 rounded-md border border-border bg-background px-2 py-2 text-text"
                  >
                    {attendanceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}