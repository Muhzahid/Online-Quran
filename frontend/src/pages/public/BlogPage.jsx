import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/contentService';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await blogService.list({ limit: 20 });
      setPosts(data.data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">Blog</h1>
      <p className="mt-2 text-text-muted">
        Guides and insights for your Quran learning journey.
      </p>

      {loading && <Loader message="Loading posts..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && posts.length === 0 && (
        <div className="mt-8">
          <EmptyState title="No posts yet." />
        </div>
      )}
      {!loading && !error && posts.length > 0 && (
        <div className="mt-10 space-y-8">
          {posts.map((post) => (
            <article key={post._id} className="border-b border-border pb-8">
              <p className="text-xs uppercase tracking-wide text-secondary">
                {post.category}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-primary">
                <Link to={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-text-muted">{post.excerpt}</p>
              <p className="mt-3 text-xs text-text-muted">
                By {post.author?.name || 'Admin'}
                {post.publishedAt
                  ? ` · ${new Date(post.publishedAt).toLocaleDateString()}`
                  : ''}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
