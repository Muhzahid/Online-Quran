import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { bookingApi } from '../../services/bookingApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function TeacherTrialClassesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await bookingApi.list({ type: 'trial', limit: 50 });
      setItems(data.data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load trial classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onConfirm = async (id) => {
    try {
      await bookingApi.confirm(id);
      toast.success('Booking confirmed');
      load();
    } catch (err) {
      toast.error(err.message || 'Confirm failed');
    }
  };

  if (loading) return <Loader message="Loading trial classes..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        Trial Classes
      </h1>
      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No trial bookings yet." />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 text-sm"
            >
              <div>
                <p className="font-medium">
                  {item.studentId?.name} · {item.courseId?.title}
                </p>
                <p className="text-text-muted">
                  {item.date} · {item.startTime}-{item.endTime} · {item.status}
                </p>
              </div>
              {item.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onConfirm(item._id)}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Confirm
                </button>
              )}
              {item.status === 'confirmed' && item.meetingUrl && (
                <a
                  href={item.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Start Class
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
