import { useEffect, useState } from 'react';
import { teacherService } from '../../services/contentService';
import TeacherCard from '../../components/cards/TeacherCard';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const initialFilters = {
  name: '',
  country: '',
  gender: '',
  language: '',
  specialization: '',
  experience: '',
  rating: '',
  minRate: '',
  maxRate: '',
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(
        Object.entries(applied).filter(([, v]) => v !== '' && v != null)
      );
      const { data } = await teacherService.list({ limit: 24, ...params });
      setTeachers(data.data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load teachers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [applied]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">Teachers</h1>
      <p className="mt-2 text-text-muted">
        Browse approved Quran teachers and find the right match.
      </p>

      <form
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(filters);
        }}
      >
        {[
          ['name', 'Name'],
          ['country', 'Country'],
          ['language', 'Language'],
          ['specialization', 'Specialization'],
          ['experience', 'Min experience'],
          ['rating', 'Min rating'],
          ['minRate', 'Min rate'],
          ['maxRate', 'Max rate'],
        ].map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-xs font-medium">
              {label}
            </label>
            <input
              id={name}
              name={name}
              value={filters[name]}
              onChange={onChange}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
        ))}
        <div>
          <label htmlFor="gender" className="mb-1 block text-xs font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={filters.gender}
            onChange={onChange}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters(initialFilters);
              setApplied(initialFilters);
            }}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            Reset
          </button>
        </div>
      </form>

      {loading && <Loader message="Loading teachers..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && teachers.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No teachers found."
            description="Adjust your filters and try again."
          />
        </div>
      )}
      {!loading && !error && teachers.length > 0 && (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher._id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
}
