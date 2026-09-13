import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/adminApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function AdminStudentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { setLoading(true); setError(''); try { const { data } = await adminApi.students({ limit: 100 }); setItems(data.data.items || []); } catch (requestError) { setError(requestError.message || 'Unable to load students.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const toggle = async (item) => { try { await adminApi.updateStudent(item._id, { isActive: !item.isActive }); toast.success('Student updated'); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to update student.'); } };
  if (loading) return <Loader message="Loading students..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Student Management</h1>{!items.length ? <div className="mt-8"><EmptyState title="No students found." /></div> : <div className="mt-8 overflow-x-auto rounded-md border border-border bg-surface"><table className="min-w-full text-left text-sm"><thead className="border-b border-border text-text-muted"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-b border-border"><td className="px-4 py-3">{item.name}<br /><span className="text-xs text-text-muted">{item.email}</span></td><td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td><td className="px-4 py-3">{item.isActive ? 'Active' : 'Disabled'}</td><td className="px-4 py-3"><button type="button" onClick={() => toggle(item)} className="text-primary hover:underline">{item.isActive ? 'Disable' : 'Enable'}</button></td></tr>)}</tbody></table></div>}</div>;
}
