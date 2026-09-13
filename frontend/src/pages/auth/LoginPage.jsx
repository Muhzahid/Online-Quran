import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      const result = await login(values);
      toast.success(result.message || 'Login successful');
      const role = result.data.user.role;
      const destination =
        from ||
        (role === 'admin'
          ? '/admin/dashboard'
          : role === 'teacher'
            ? '/teacher/dashboard'
            : '/student/dashboard');
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Unable to login');
    }
  };

  return (
    <div className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="hidden overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-[0_24px_70px_rgba(23,79,59,0.2)] lg:block">
        <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(rgba(23,79,59,0.1),rgba(13,52,40,0.7)),url('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center p-8"><p className="mt-auto pt-72 font-display text-4xl">Return to a steadier rhythm.</p><p className="mt-3 text-sm text-white/70">Your learning space is waiting.</p></div>
      </div>
      <div className="mx-auto w-full max-w-md">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Quran Academy</span>
      <h1 className="mt-3 font-display text-4xl font-semibold text-primary">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Sign in to continue your Quran learning journey.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-[0_18px_50px_rgba(36,48,43,0.06)] sm:p-8"
        noValidate
      >
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,79,59,0.18)] hover:-translate-y-0.5 hover:bg-primary-dark disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
      </div>
    </div>
  );
}
