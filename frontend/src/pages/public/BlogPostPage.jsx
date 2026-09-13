import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blogService } from '../../services/contentService';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await blogService.getBySlug(slug);
      setPost(data.data.post);
    } catch (err) {
      setError(err.message || 'Unable to load post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [slug]);

  if (loading) return <Loader message="Loading post..." />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (!post) return null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-wide text-secondary">{post.category}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-primary">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        By {post.author?.name || 'Admin'}
        {post.publishedAt
          ? ` · ${new Date(post.publishedAt).toLocaleDateString()}`
          : ''}
      </p>
      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-text">
        {post.content}
      </div>
    </article>
  );
}
