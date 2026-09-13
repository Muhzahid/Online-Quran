import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { bookingApi } from '../../services/bookingApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function StudentClassesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await bookingApi.list({ limit: 50 });
      setItems(data.data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCancel = async (id) => {
    try {
      await bookingApi.cancel(id);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.message || 'Cancel failed');
    }
  };

  if (loading) return <Loader message="Loading classes..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        My Classes
      </h1>
      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No classes yet."
            description="Book a free trial to get started."
          />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-text-muted">
              <tr>
                <th className="py-3 pr-4">Course</th>
                <th className="py-3 pr-4">Teacher</th>
                <th className="py-3 pr-4">When</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-border">
                  <td className="py-3 pr-4">{item.courseId?.title}</td>
                  <td className="py-3 pr-4">
                    {item.teacherId?.userId?.name}
                  </td>
                  <td className="py-3 pr-4">
                    {item.date} · {item.startTime}-{item.endTime}
                  </td>
                  <td className="py-3 pr-4 capitalize">{item.type}</td>
                  <td className="py-3 pr-4 capitalize">{item.status}</td>
                  <td className="py-3">
                    {item.meetingUrl && item.status === 'confirmed' && (
                      <a
                        href={item.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mr-2 text-primary hover:underline"
                      >
                        Join Class
                      </a>
                    )}
                    {['pending', 'confirmed'].includes(item.status) && (
                      <button
                        type="button"
                        onClick={() => onCancel(item._id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
