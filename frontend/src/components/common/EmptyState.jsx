export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface px-6 py-10 text-center">
      <h2 className="font-display text-xl font-semibold text-primary">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
