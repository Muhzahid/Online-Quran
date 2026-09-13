import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function AdminTeachersPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = async () => { setLoading(true); setError(''); try { const { data } = await teacherApi.adminList({ limit: 100 }); setItems(data.data.items || []); } catch (requestError) { setError(requestError.message || 'Unable to load teachers.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const suspend = async (item) => { try { await teacherApi.suspend(item._id, 'Suspended by administrator'); toast.success('Teacher suspended'); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to suspend teacher.'); } };
  if (loading) return <Loader message="Loading teachers..." />; if (error) return <ErrorState message={error} onRetry={load} />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Teacher Management</h1>{!items.length ? <div className="mt-8"><EmptyState title="No teachers found." /></div> : <div className="mt-8 overflow-x-auto rounded-md border border-border bg-surface"><table className="min-w-full text-left text-sm"><thead className="border-b border-border text-text-muted"><tr><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b border-border"><td className="px-4 py-3">{item.userId?.name}<br /><span className="text-xs text-text-muted">{item.userId?.email}</span></td><td className="px-4 py-3 capitalize">{item.applicationStatus}</td><td className="px-4 py-3">{item.rating || 0} ({item.totalReviews || 0})</td><td className="px-4 py-3">{!item.isSuspended && <button type="button" onClick={() => suspend(item)} className="text-red-600 hover:underline">Suspend</button>}</td></tr>)}</tbody></table></div>}</div>;
}