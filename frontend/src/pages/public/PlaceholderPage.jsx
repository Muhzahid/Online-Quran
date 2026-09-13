export default function PlaceholderPage({ title }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-primary">{title}</h1>
      <p className="mt-3 text-text-muted">
        This area is not available for your account yet. Use the navigation to
        return to a section that is currently enabled.
      </p>
    </div>
  );
}
