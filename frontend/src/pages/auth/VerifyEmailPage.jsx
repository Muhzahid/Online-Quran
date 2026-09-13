import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import Loader from '../../components/loaders/Loader';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState(token ? 'loading' : 'missing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const { data } = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully');
        toast.success(data.message || 'Email verified');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Unable to verify email');
        toast.error(error.message || 'Unable to verify email');
      }
    };

    verify();
  }, [token]);

  if (status === 'loading') {
    return <Loader message="Verifying your email..." />;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold text-primary">
        {status === 'success'
          ? 'Email verified'
          : status === 'missing'
            ? 'Missing token'
            : 'Verification failed'}
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        {message ||
          (status === 'missing'
            ? 'No verification token was provided.'
            : 'Something went wrong.')}
      </p>
      <Link
        to="/login"
        className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Go to Login
      </Link>
    </div>
  );
}
