import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { studentApi } from '../../services/bookingApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await studentApi.getMyProfile();
      const p = data.data.profile;
      reset({
        name: p.userId?.name || '',
        phone: p.userId?.phone || '',
        dateOfBirth: p.dateOfBirth
          ? new Date(p.dateOfBirth).toISOString().slice(0, 10)
          : '',
        gender: p.gender || '',
        country: p.country || '',
        timezone: p.timezone || 'UTC',
        preferredLanguage: p.preferredLanguage || 'English',
        learningLevel: p.learningLevel || 'beginner',
        parentName: p.parentGuardian?.name || '',
        parentEmail: p.parentGuardian?.email || '',
        parentPhone: p.parentGuardian?.phone || '',
        parentRelationship: p.parentGuardian?.relationship || '',
      });
    } catch (err) {
      setError(err.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      await studentApi.updateMyProfile({
        name: values.name,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender,
        country: values.country,
        timezone: values.timezone,
        preferredLanguage: values.preferredLanguage,
        learningLevel: values.learningLevel,
        parentGuardian: {
          name: values.parentName,
          email: values.parentEmail,
          phone: values.parentPhone,
          relationship: values.parentRelationship,
        },
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-primary">
        Student Profile
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {[
          ['name', 'Full name', 'text'],
          ['phone', 'Phone', 'tel'],
          ['dateOfBirth', 'Date of birth', 'date'],
          ['country', 'Country', 'text'],
          ['timezone', 'Timezone', 'text'],
          ['preferredLanguage', 'Preferred language', 'text'],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {label}
            </label>
            <input
              id={name}
              type={type}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              {...register(name)}
            />
          </div>
        ))}
        <div>
          <label htmlFor="gender" className="mb-1 block text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            {...register('gender')}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="learningLevel"
            className="mb-1 block text-sm font-medium"
          >
            Learning level
          </label>
          <select
            id="learningLevel"
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            {...register('learningLevel')}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <h2 className="pt-4 font-display text-xl font-semibold text-primary">
          Parent / Guardian (if applicable)
        </h2>
        {[
          ['parentName', 'Name'],
          ['parentEmail', 'Email'],
          ['parentPhone', 'Phone'],
          ['parentRelationship', 'Relationship'],
        ].map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {label}
            </label>
            <input
              id={name}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              {...register(name)}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
