import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const load = async () => { try { const { data } = await adminApi.report(); setReport(data.data); } catch (requestError) { setError(requestError.message || 'Unable to load report.'); } };
  useEffect(() => { load(); }, []);
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!report) return <Loader message="Loading reports..." />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Reports</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[['Students', report.students], ['Teachers', report.teachers], ['Active courses', report.courses], ['Bookings', report.bookings], ['Paid payments', report.payments]].map(([label, value]) => <div key={label} className="rounded-md border border-border bg-surface p-5"><p className="text-sm text-text-muted">{label}</p><p className="mt-2 text-3xl font-semibold text-primary">{value}</p></div>)}</div><h2 className="mt-8 font-display text-xl font-semibold text-primary">Revenue by currency</h2><pre className="mt-3 overflow-auto rounded-md bg-surface p-4 text-sm">{JSON.stringify(report.revenue, null, 2)}</pre></div>;
}
