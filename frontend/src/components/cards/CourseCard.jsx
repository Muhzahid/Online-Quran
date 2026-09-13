import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(36,48,43,0.04)] hover:-translate-y-1 hover:border-secondary/70 hover:shadow-[0_18px_42px_rgba(36,48,43,0.09)]">
      <div className="mb-6 flex items-center justify-between">
        <span className="h-px w-10 bg-secondary" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
        {course.level}
        </p>
      </div>
      <h3 className="mt-2 font-display text-2xl font-semibold text-primary">
        <Link to={`/courses/${course.slug}`} className="group-hover:text-secondary">
          {course.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-text-muted">{course.shortDescription}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-text">${course.price}/mo</span>
        <span className="text-text-muted">{course.duration}</span>
      </div>
      <Link
        to={`/courses/${course.slug}`}
        className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:text-secondary"
      >
        View course <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}
