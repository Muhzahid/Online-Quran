import { useEffect, useState } from 'react';
import { courseService } from '../../services/contentService';
import CourseCard from '../../components/cards/CourseCard';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [level, setLevel] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await courseService.list({
        limit: 50,
        ...(level ? { level } : {}),
      });
      setCourses(data.data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [level]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">Courses</h1>
      <p className="mt-2 text-text-muted">
        Explore Quran programs for beginners, kids, and advanced learners.
      </p>

      <div className="mt-6">
        <label htmlFor="level" className="sr-only">
          Filter by level
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="all">All ages</option>
        </select>
      </div>

      {loading && <Loader message="Loading courses..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && courses.length === 0 && (
        <EmptyState title="No courses found." description="Try another filter." />
      )}
      {!loading && !error && courses.length > 0 && (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
