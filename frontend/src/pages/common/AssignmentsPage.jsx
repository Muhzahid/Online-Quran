import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { assignmentApi } from '../../services/learningApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function AssignmentsPage() {
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await assignmentApi.list();
      setItems(data.data.items || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load assignments.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (item) => {
    try {
      await assignmentApi.submit(item._id, answers[item._id] || '');
      toast.success('Assignment submitted');
      await load();
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to submit assignment.');
    }
  };

  const grade = async (item, submission) => {
    const value = window.prompt('Grade from 0 to 100:', submission.grade ?? '');
    if (value === null) return;
    const gradeValue = Number(value);
    if (!Number.isFinite(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast.error('Enter a grade from 0 to 100.');
      return;
    }
    try {
      await assignmentApi.grade(item._id, submission._id, { grade: gradeValue, feedback: window.prompt('Feedback:', submission.feedback || '') || '' });
      toast.success('Submission graded');
      await load();
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to grade submission.');
    }
  };

  if (loading) return <Loader message="Loading assignments..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!items.length) return <EmptyState title="No assignments yet." description={isTeacher ? 'Assignments you create will appear here.' : 'Your teacher has not assigned work yet.'} />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">Assignments</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <article key={item._id} className="rounded-md border border-border bg-surface p-5">
            <h2 className="font-medium text-text">{item.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{item.instructions}</p>
            <p className="mt-2 text-xs text-text-muted">Course: {item.courseId?.title || 'Unassigned'} · Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}</p>
            {isTeacher ? (
              <div className="mt-4 space-y-2">
                {item.submissions?.length ? item.submissions.map((submission) => (
                  <div key={submission._id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-sm">
                    <span>{submission.studentId?.name}: {submission.grade ?? 'Not graded'}</span>
                    <button type="button" onClick={() => grade(item, submission)} className="text-primary hover:underline">Grade</button>
                  </div>
                )) : <p className="mt-4 text-sm text-text-muted">No submissions yet.</p>}
              </div>
            ) : (
              <div className="mt-4">
                <textarea value={answers[item._id] || ''} onChange={(event) => setAnswers((current) => ({ ...current, [item._id]: event.target.value }))} placeholder="Write your answer" className="min-h-28 w-full rounded-md border border-border p-3 text-sm" />
                <button type="button" onClick={() => submit(item)} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Submit assignment</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}