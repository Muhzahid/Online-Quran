import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { courseService } from '../../services/contentService';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await courseService.getBySlug(slug);
      setCourse(data.data.course);
    } catch (err) {
      setError(err.message || 'Unable to load course.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [slug]);

  if (loading) return <Loader message="Loading course..." />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (!course) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
        {course.level} · {course.duration}
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-primary">
        {course.title}
      </h1>
      <p className="mt-4 text-lg text-text-muted">{course.shortDescription}</p>
      <p className="mt-6 text-text">{course.description}</p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <p className="font-display text-3xl font-semibold text-primary">
          ${course.price}
          <span className="text-base font-body font-normal text-text-muted">/mo</span>
        </p>
        <Link
          to="/trial-class"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Book Free Trial
        </Link>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-primary">
        Lessons
      </h2>
      <ol className="mt-4 space-y-3">
        {(course.lessons || []).map((lesson, index) => (
          <li key={lesson._id || index} className="border-b border-border pb-3 text-sm">
            <span className="font-medium">{lesson.title}</span>
            {lesson.description && (
              <p className="mt-1 text-text-muted">{lesson.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
