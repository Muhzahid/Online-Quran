import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { progressApi } from '../../services/learningApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function ProgressPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await progressApi.list();
      setItems(data.data.items || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load progress.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (courseId, lessonId, completed) => {
    try {
      await progressApi.update(courseId, { lessonId, completed });
      toast.success('Progress updated');
      await load();
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to update progress.');
    }
  };

  if (loading) return <Loader message="Loading progress..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!items.length) return <EmptyState title="No progress yet." description="Your course progress will appear here after you start a lesson." />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">Quran Progress</h1>
      <div className="mt-8 space-y-6">
        {items.map((item) => {
          const completed = item.lessons.filter((lesson) => lesson.completed).length;
          const total = item.courseId?.lessons?.length || 0;
          return (
            <section key={item._id} className="rounded-md border border-border bg-surface p-5">
              <div className="flex justify-between gap-4">
                <h2 className="font-medium text-text">{item.courseId?.title}</h2>
                <span className="text-sm text-text-muted">{completed}/{total} lessons</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-primary" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
              </div>
              <div className="mt-5 space-y-2">
                {(item.courseId?.lessons || []).map((lesson) => {
                  const isCompleted = item.lessons.some((entry) => entry.lessonId === lesson._id && entry.completed);
                  return (
                    <label key={lesson._id} className="flex items-center gap-3 text-sm">
                      <input type="checkbox" checked={isCompleted} onChange={(event) => toggle(item.courseId._id, lesson._id, event.target.checked)} />
                      <span>{lesson.title}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}