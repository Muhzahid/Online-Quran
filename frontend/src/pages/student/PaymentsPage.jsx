import { useEffect, useState } from 'react';
import { paymentApi } from '../../services/paymentApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function PaymentsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { paymentApi.list().then((response) => setData(response.data.data)).catch((requestError) => setError(requestError.message || 'Unable to load payments.')); }, []);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loader message="Loading payments..." />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Payments</h1>{!data.items.length ? <div className="mt-8"><EmptyState title="No payments yet." /></div> : <div className="mt-8 overflow-x-auto rounded-md border border-border bg-surface"><table className="min-w-full text-left text-sm"><thead className="border-b border-border text-text-muted"><tr><th className="px-4 py-3">Course</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{data.items.map((item) => <tr key={item._id} className="border-b border-border"><td className="px-4 py-3">{item.courseId?.title || item.type}</td><td className="px-4 py-3">{item.amount} {item.currency}</td><td className="px-4 py-3 capitalize">{item.status}</td></tr>)}</tbody></table></div>}</div>;
}
