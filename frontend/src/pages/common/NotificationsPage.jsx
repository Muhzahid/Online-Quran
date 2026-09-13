import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { notificationApi } from '../../services/engagementApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await notificationApi.list();
      setItems(data.data.items || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);
  const read = async (id) => {
    try { await notificationApi.markRead(id); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to update notification.'); }
  };
  const readAll = async () => {
    try { await notificationApi.markAllRead(); toast.success('Notifications marked read'); await load(); } catch (requestError) { toast.error(requestError.message || 'Unable to update notifications.'); }
  };
  if (loading) return <Loader message="Loading notifications..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-primary">Notifications</h1>
        {!!items.some((item) => !item.readAt) && <button type="button" onClick={readAll} className="text-sm text-primary hover:underline">Mark all read</button>}
      </div>
      {!items.length ? <div className="mt-8"><EmptyState title="No notifications." /></div> : <div className="mt-8 space-y-3">{items.map((item) => <button type="button" key={item._id} onClick={() => !item.readAt && read(item._id)} className={`block w-full rounded-md border p-4 text-left ${item.readAt ? 'border-border bg-surface' : 'border-secondary/50 bg-secondary/10'}`}><p className="font-medium text-text">{item.title}</p><p className="mt-1 text-sm text-text-muted">{item.message}</p><p className="mt-2 text-xs text-text-muted">{new Date(item.createdAt).toLocaleString()}</p></button>)}</div>}
    </div>
  );
}