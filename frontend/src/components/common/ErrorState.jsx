export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-md border border-red-200 bg-red-50 px-6 py-10 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
