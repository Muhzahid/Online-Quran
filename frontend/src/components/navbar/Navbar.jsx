import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { APP_NAME } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/teachers', label: 'Teachers' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { logoutUser } = useAuth();

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'teacher'
        ? '/teacher/dashboard'
        : '/student/dashboard';

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link to="/" className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/60 bg-primary text-secondary-light shadow-[0_8px_24px_rgba(23,79,59,0.16)]">
            <BookOpen size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-wide text-primary">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-text hover:text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="text-sm font-medium text-text hover:text-primary"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logoutUser}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-text hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/trial-class"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(23,79,59,0.18)] hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Book Trial
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-text hover:bg-background lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-2 py-2 text-sm font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logoutUser();
                  }}
                  className="rounded-md border border-border px-2 py-2 text-left text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/trial-class"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-2 py-2 text-center text-sm font-medium text-white"
                >
                  Book Trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
