import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 mt-4 max-w-2xl mx-auto"
    >
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error Loading Courses
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error.message}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}