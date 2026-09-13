import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { contactService } from '../../services/contentService';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { setLoading(true); try { const { data } = await contactService.adminList(); setItems(data.data.items || []); } catch (requestError) { setError(requestError.message || 'Unable to load messages.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const update = async (item, status) => { try { await contactService.adminUpdate(item._id, { status }); toast.success('Message updated'); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to update message.'); } };
  if (loading) return <Loader message="Loading messages..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Contact Messages</h1>{!items.length ? <div className="mt-8"><EmptyState title="No contact messages." /></div> : <div className="mt-8 space-y-3">{items.map((item) => <article key={item._id} className="rounded-md border border-border bg-surface p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-medium">{item.subject}</h2><p className="text-sm text-text-muted">{item.name} · {item.email}</p></div><select value={item.status} onChange={(event) => update(item, event.target.value)} className="rounded-md border border-border px-2 py-1 text-sm"><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="closed">Closed</option></select></div><p className="mt-4 whitespace-pre-wrap text-sm text-text-muted">{item.message}</p></article>)}</div>}</div>;
}
