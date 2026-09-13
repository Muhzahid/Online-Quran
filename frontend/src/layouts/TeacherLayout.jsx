import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Calendar, Home, Settings, Users } from 'lucide-react';

const links = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: Home },
  { to: '/teacher/students', label: 'Students', icon: Users },
  { to: '/teacher/classes', label: 'Classes', icon: BookOpen },
  { to: '/teacher/calendar', label: 'Calendar', icon: Calendar },
  { to: '/teacher/settings', label: 'Settings', icon: Settings },
];

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 border-r border-border/80 bg-primary md:block">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="font-display text-2xl font-semibold tracking-wide text-secondary-light">
            Teacher
          </p>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Teacher navigation">
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
      </aside>
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
