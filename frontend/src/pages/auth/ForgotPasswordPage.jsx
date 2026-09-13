import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { forgotPasswordSchema } from '../../utils/validationSchemas';
import authService from '../../services/authService';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(values.email);
      toast.success(data.message);
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || 'Unable to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-primary">
        Forgot password
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Enter your email and we&apos;ll send a reset link if an account exists.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm">
          Check your email for password reset instructions.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
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
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
