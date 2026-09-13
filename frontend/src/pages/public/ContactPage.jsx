import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { contactService } from '../../services/contentService';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await contactService.submit(values);
      toast.success(data.message);
      reset();
    } catch (error) {
      toast.error(error.message || 'Unable to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">Contact</h1>
      <p className="mt-2 text-text-muted">
        Have a question? Send us a message and our team will respond soon.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        {[
          ['name', 'Name', 'text'],
          ['email', 'Email', 'email'],
          ['phone', 'Phone (optional)', 'tel'],
          ['subject', 'Subject', 'text'],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {label}
            </label>
            <input
              id={name}
              type={type}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register(name)}
            />
            {errors[name] && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors[name].message}
              </p>
            )}
          </div>
        ))}
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
