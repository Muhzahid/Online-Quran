import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { bookingApi } from '../../services/bookingApi';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loader from '../../components/loaders/Loader';

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
const typeOptions = ['all', 'trial', 'regular'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 20 };
      if (status !== 'all') params.status = status;
      if (type !== 'all') params.type = type;
      const { data } = await bookingApi.list(params);
      setBookings(data.data.items || []);
      setPagination(data.data.pagination);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status, type]);

  const changeStatus = async (booking, nextStatus) => {
    try {
      if (nextStatus === 'confirmed') await bookingApi.confirm(booking._id);
      else if (nextStatus === 'cancelled') await bookingApi.cancel(booking._id);
      else if (nextStatus === 'completed') await bookingApi.complete(booking._id);
      else await bookingApi.update(booking._id, { status: nextStatus });
      toast.success(`Booking ${nextStatus}`);
      await load();
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to update booking.');
    }
  };

  const resetPage = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">
            Bookings
          </h1>
          <p className="mt-2 text-text-muted">
            Review and manage every class request in the academy.
          </p>
        </div>
        <div className="flex gap-3">
          <label className="text-sm text-text-muted">
            Status
            <select
              value={status}
              onChange={resetPage(setStatus)}
              className="mt-1 block rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-text-muted">
            Type
            <select
              value={type}
              onChange={resetPage(setType)}
              className="mt-1 block rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading && <Loader message="Loading bookings..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && bookings.length === 0 && (
        <div className="mt-8">
          <EmptyState title="No bookings found." description="Try changing the filters." />
        </div>
      )}
      {!loading && !error && bookings.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-md border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-text-muted">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">{booking.studentId?.name || 'Unknown'}</p>
                    <p className="text-xs text-text-muted">{booking.studentId?.email}</p>
                  </td>
                  <td className="px-4 py-3">{booking.teacherId?.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{booking.courseId?.title || 'Unknown'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.date} · {booking.startTime}-{booking.endTime}
                  </td>
                  <td className="px-4 py-3 capitalize">{booking.status}</td>
                  <td className="px-4 py-3">
                    {booking.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => changeStatus(booking, 'confirmed')}
                        className="text-primary hover:underline"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => changeStatus(booking, 'completed')}
                        className="text-primary hover:underline"
                      >
                        Complete
                      </button>
                    )}
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        type="button"
                        onClick={() => changeStatus(booking, 'cancelled')}
                        className="ml-3 text-red-600 hover:underline"
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

      {!loading && pagination && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-md border border-border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-md border border-border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}