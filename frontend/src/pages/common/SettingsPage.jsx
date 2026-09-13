import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth); const { logoutUser } = useAuth();
  return <div className="max-w-2xl"><h1 className="font-display text-3xl font-semibold text-primary">Settings</h1><div className="mt-8 rounded-md border border-border bg-surface p-5"><h2 className="font-medium">Account</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-text-muted">Name</dt><dd>{user?.name}</dd></div><div><dt className="text-text-muted">Email</dt><dd>{user?.email}</dd></div><div><dt className="text-text-muted">Role</dt><dd className="capitalize">{user?.role}</dd></div></dl><button type="button" onClick={logoutUser} className="mt-6 rounded-md border border-red-200 px-4 py-2 text-sm text-red-700">Log out</button></div></div>;
}
