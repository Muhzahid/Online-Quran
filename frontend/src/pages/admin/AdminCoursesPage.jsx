import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { courseService } from '../../services/contentService';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const emptyForm = { title: '', shortDescription: '', description: '', level: 'beginner', price: 0, duration: 'Flexible' };

export default function AdminCoursesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { const { data } = await courseService.adminList({ limit: 100 }); setItems(data.data.items || []); } catch (requestError) { setError(requestError.message || 'Unable to load courses.'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault();
    try { await courseService.create({ ...form, price: Number(form.price) }); toast.success('Course created'); setForm(emptyForm); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to create course.'); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await courseService.remove(id); toast.success('Course deleted'); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to delete course.'); }
  };
  if (loading) return <Loader message="Loading courses..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Course Management</h1><form onSubmit={submit} className="mt-8 grid gap-3 rounded-md border border-border bg-surface p-5 sm:grid-cols-2"><input required placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border border-border p-2 text-sm" /><input required placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="rounded-md border border-border p-2 text-sm" /><textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 rounded-md border border-border p-2 text-sm sm:col-span-2" /><select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="rounded-md border border-border p-2 text-sm"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="all">All levels</option></select><input type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-md border border-border p-2 text-sm" /><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Create course</button></form>{!items.length ? <div className="mt-8"><EmptyState title="No courses found." /></div> : <div className="mt-8 space-y-3">{items.map((item) => <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-4"><div><p className="font-medium">{item.title}</p><p className="text-sm text-text-muted">{item.level} · {item.price} · {item.isActive ? 'Active' : 'Inactive'}</p></div><button type="button" onClick={() => remove(item._id)} className="text-sm text-red-600 hover:underline">Delete</button></div>)}</div>}</div>;
}