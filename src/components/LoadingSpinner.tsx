import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  message, 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div
      role="status"
      className={`min-h-[200px] flex flex-col items-center justify-center ${className}`}
      aria-label={message || 'Loading content'}
    >
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400`} 
        aria-hidden="true"
      />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}