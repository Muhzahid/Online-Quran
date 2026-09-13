import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'student',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values;
      const result = await registerUser(payload);
      toast.success(result.message || 'Registration successful');
      const role = result.data.user.role;
      navigate(
        role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard',
        { replace: true }
      );
    } catch (error) {
      const fieldErrors = error.errors;
      if (fieldErrors?.length) {
        fieldErrors.forEach((err) => toast.error(err.message));
      } else {
        toast.error(error.message || 'Unable to register');
      }
    }
  };

  return (
    <div className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="hidden overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-[0_24px_70px_rgba(23,79,59,0.2)] lg:block"><div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(rgba(23,79,59,0.15),rgba(13,52,40,0.75)),url('https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center p-8"><p className="mt-auto pt-72 font-display text-4xl">Begin with intention.</p><p className="mt-3 text-sm text-white/70">A considered path for every learner.</p></div></div>
      <div className="mx-auto w-full max-w-lg">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Begin your journey</span>
      <h1 className="mt-3 font-display text-4xl font-semibold text-primary">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Join Quran Academy as a student or teacher.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-[0_18px_50px_rgba(36,48,43,0.06)] sm:p-8"
        noValidate
      >
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

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
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            {...register('phone')}
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">I am registering as</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="student" {...register('role')} />
              Student
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="teacher" {...register('role')} />
              Teacher
            </label>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.role.message}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,79,59,0.18)] hover:-translate-y-0.5 hover:bg-primary-dark disabled:opacity-60"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
      </div>
    </div>
  );
}
