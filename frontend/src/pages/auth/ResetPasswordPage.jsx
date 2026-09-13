import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { resetPasswordSchema } from '../../utils/validationSchemas';
import authService from '../../services/authService';
import { setCredentials } from '../../redux/slices/authSlice';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    if (!token) {
      toast.error('Reset token is missing');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.resetPassword({
        token,
        password: values.password,
      });
      dispatch(
        setCredentials({
          user: data.data.user,
          token: data.data.token,
        })
      );
      toast.success(data.message || 'Password reset successful');
      const role = data.data.user.role;
      navigate(
        role === 'admin'
          ? '/admin/dashboard'
          : role === 'teacher'
            ? '/teacher/dashboard'
            : '/student/dashboard',
        { replace: true }
      );
    } catch (error) {
      toast.error(error.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-primary">
          Invalid reset link
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          This password reset link is missing or invalid.
        </p>
        <Link
          to="/forgot-password"
          className="mt-6 inline-block text-primary hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-primary">
        Reset password
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Choose a new secure password for your account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
