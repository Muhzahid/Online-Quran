import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function TeacherCard({ teacher }) {
  const name = teacher.userId?.name || 'Teacher';
  const specs = (teacher.specialization || []).slice(0, 3).join(' · ');

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(36,48,43,0.04)] hover:-translate-y-1 hover:border-secondary/70 hover:shadow-[0_18px_42px_rgba(36,48,43,0.09)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-semibold text-secondary-light">
            {name.charAt(0)}
          </div>
          <h3 className="font-display text-2xl font-semibold text-primary">
            <Link to={`/teachers/${teacher._id}`} className="group-hover:text-secondary">
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-text-muted">{specs || 'Quran Teacher'}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-secondary">
          <Star size={16} fill="currentColor" aria-hidden="true" />
          <span>{Number(teacher.rating || 0).toFixed(1)}</span>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm text-text-muted">
        {teacher.bio || 'Experienced Quran teacher.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
        <span>{teacher.experience}+ yrs</span>
        <span>{teacher.country}</span>
        <span>${teacher.hourlyRate}/hr</span>
      </div>
      <p className="mt-2 text-xs text-text-muted">
        Languages: {(teacher.languages || []).join(', ') || 'N/A'}
      </p>
      <Link
        to={`/teachers/${teacher._id}`}
        className="mt-5 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-primary-dark"
      >
        View Profile <span className="ml-2">→</span>
      </Link>
    </article>
  );
}
