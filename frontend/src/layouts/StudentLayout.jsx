import { NavLink, Outlet } from 'react-router-dom';
import { Bell, BookOpen, Calendar, CreditCard, Home, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', icon: Home },
  { to: '/student/classes', label: 'Classes', icon: BookOpen },
  { to: '/student/calendar', label: 'Calendar', icon: Calendar },
  { to: '/student/profile', label: 'Profile', icon: User },
  { to: '/student/payments', label: 'Payments', icon: CreditCard },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

export default function StudentLayout() {
  const { logoutUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 border-r border-border/80 bg-primary md:flex md:flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="font-display text-2xl font-semibold tracking-wide text-secondary-light">
            Student
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Student navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logoutUser}
          className="m-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
