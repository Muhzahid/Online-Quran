import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function TeacherQualificationsPage() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await teacherApi.getMyProfile();
      setTeacher(data.data.teacher);
    } catch (err) {
      setError(err.message || 'Unable to load qualifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Select a file first');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('name', docName || file.name);
      const { data } = await teacherApi.uploadDocument(formData);
      setTeacher(data.data.teacher);
      setFile(null);
      setDocName('');
      toast.success('Document uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmitApplication = async () => {
    setSubmitting(true);
    try {
      const { data } = await teacherApi.submitApplication();
      setTeacher(data.data.teacher);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || 'Unable to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading qualifications..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const docs = teacher?.documents || [];

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-primary">
        Qualifications
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Upload certificates/Ijazah documents, then submit for admin approval.
      </p>

      <form onSubmit={onUpload} className="mt-8 space-y-4 rounded-md border border-border bg-surface p-4">
        <div>
          <label htmlFor="docName" className="mb-1 block text-sm font-medium">
            Document name
          </label>
          <input
            id="docName"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            placeholder="e.g. Ijazah Certificate"
          />
        </div>
        <div>
          <label htmlFor="document" className="mb-1 block text-sm font-medium">
            File (PDF or image)
          </label>
          <input
            id="document"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      <h2 className="mt-10 font-display text-xl font-semibold text-primary">
        Uploaded documents
      </h2>
      {docs.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No documents uploaded yet." />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {docs.map((doc) => (
            <li
              key={doc._id || doc.publicId}
              className="flex items-center justify-between border-b border-border py-3 text-sm"
            >
              <span>{doc.name}</span>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onSubmitApplication}
        disabled={submitting || teacher?.applicationStatus === 'approved'}
        className="mt-8 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-60"
      >
        {teacher?.applicationStatus === 'pending'
          ? 'Application Pending'
          : teacher?.applicationStatus === 'approved'
            ? 'Already Approved'
            : submitting
              ? 'Submitting...'
              : 'Submit Application'}
      </button>
    </div>
  );
}
