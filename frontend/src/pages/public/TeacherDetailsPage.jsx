import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { teacherService } from '../../services/contentService';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function TeacherDetailsPage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await teacherService.getById(id);
      setTeacher(data.data.teacher);
    } catch (err) {
      setError(err.message || 'Unable to load teacher.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <Loader message="Loading teacher..." />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (!teacher) return null;

  const name = teacher.userId?.name || 'Teacher';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-primary">{name}</h1>
          <p className="mt-2 text-text-muted">
            {(teacher.specialization || []).join(' · ')}
          </p>
        </div>
        <div className="flex items-center gap-1 text-secondary">
          <Star size={18} fill="currentColor" aria-hidden="true" />
          <span className="font-semibold">{Number(teacher.rating || 0).toFixed(1)}</span>
          <span className="text-sm text-text-muted">
            ({teacher.totalReviews} reviews)
          </span>
        </div>
      </div>

      <p className="mt-6 text-text">{teacher.bio}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-text-muted">Experience</dt>
          <dd className="font-medium">{teacher.experience} years</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-text-muted">Hourly rate</dt>
          <dd className="font-medium">${teacher.hourlyRate}/hr</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-text-muted">Country</dt>
          <dd className="font-medium">{teacher.country || 'N/A'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-text-muted">Languages</dt>
          <dd className="font-medium">{(teacher.languages || []).join(', ')}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-text-muted">Qualification</dt>
          <dd className="font-medium">{teacher.qualification || 'N/A'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-text-muted">Timezone</dt>
          <dd className="font-medium">{teacher.timezone}</dd>
        </div>
      </dl>

      <h2 className="mt-10 font-display text-2xl font-semibold text-primary">
        Weekly availability
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {(teacher.availability || []).map((slot) => (
          <li key={slot._id || slot.day} className="flex justify-between border-b border-border py-2">
            <span className="capitalize">{slot.day}</span>
            <span className="text-text-muted">
              {slot.isOff ? 'OFF' : `${slot.startTime} - ${slot.endTime}`}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/trial-class"
        className="mt-8 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Book Trial with {name.split(' ')[0]}
      </Link>
    </div>
  );
}
