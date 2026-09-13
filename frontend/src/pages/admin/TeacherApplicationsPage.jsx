import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function TeacherApplicationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('pending');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await teacherApi.adminApplications({ status, limit: 50 });
      setItems(data.data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const onApprove = async (id) => {
    try {
      await teacherApi.approve(id);
      toast.success('Teacher approved');
      load();
    } catch (err) {
      toast.error(err.message || 'Approve failed');
    }
  };

  const onReject = async (id) => {
    const reason = window.prompt('Rejection reason (optional):') || '';
    try {
      await teacherApi.reject(id, reason);
      toast.success('Teacher rejected');
      load();
    } catch (err) {
      toast.error(err.message || 'Reject failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">
        Teacher Applications
      </h1>
      <div className="mt-4">
        <label htmlFor="status" className="mr-2 text-sm">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="draft">Draft</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading && <Loader message="Loading applications..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && (
        <div className="mt-8">
          <EmptyState title="No applications found." />
        </div>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-text-muted">
              <tr>
                <th className="py-3 pr-4">Teacher</th>
                <th className="py-3 pr-4">Experience</th>
                <th className="py-3 pr-4">Docs</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{item.userId?.name}</p>
                    <p className="text-xs text-text-muted">{item.userId?.email}</p>
                  </td>
                  <td className="py-3 pr-4">{item.experience} yrs</td>
                  <td className="py-3 pr-4">{item.documents?.length || 0}</td>
                  <td className="py-3 pr-4 capitalize">{item.applicationStatus}</td>
                  <td className="py-3">
                    {item.applicationStatus === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onApprove(item._id)}
                          className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(item._id)}
                          className="rounded-md border border-border px-3 py-1 text-xs"
                        >
                          Reject
                        </button>
                      </div>
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
