import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await teacherApi.getMyProfile();
      const profile = data.data.teacher;
      setTeacher(profile);
      reset({
        name: profile.userId?.name || '',
        phone: profile.userId?.phone || '',
        bio: profile.bio || '',
        qualification: profile.qualification || '',
        experience: profile.experience || 0,
        languages: (profile.languages || []).join(', '),
        specialization: (profile.specialization || []).join(', '),
        hourlyRate: profile.hourlyRate || 0,
        country: profile.country || '',
        gender: profile.gender || '',
        timezone: profile.timezone || 'UTC',
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
      const payload = {
        ...values,
        experience: Number(values.experience) || 0,
        hourlyRate: Number(values.hourlyRate) || 0,
        languages: values.languages
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        specialization: values.specialization
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { data } = await teacherApi.updateMyProfile(payload);
      setTeacher(data.data.teacher);
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
        Teacher Profile
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Status:{' '}
        <span className="font-medium capitalize">
          {teacher?.applicationStatus || 'draft'}
        </span>
        {teacher?.isApproved ? ' · Approved to teach' : ' · Not yet approved'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {[
          ['name', 'Full name'],
          ['phone', 'Phone'],
          ['qualification', 'Qualification'],
          ['experience', 'Years of experience'],
          ['languages', 'Languages (comma separated)'],
          ['specialization', 'Specialization (comma separated)'],
          ['hourlyRate', 'Hourly rate (USD)'],
          ['country', 'Country'],
          ['timezone', 'Timezone'],
        ].map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {label}
            </label>
            <input
              id={name}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
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
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            {...register('gender')}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            {...register('bio')}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
