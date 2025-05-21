import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EmailSignIn } from './EmailSignIn';
import { GoogleSignIn } from './GoogleSignIn';
import { PhoneSignIn } from './PhoneSignIn';
import { useAuth } from './AuthContext';

type AuthMethod = 'email' | 'google' | 'phone';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod?: AuthMethod;
}

export function AuthModal({ isOpen, onClose, defaultMethod = 'email' }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>(defaultMethod);
  const { loading } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 id="auth-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'email', label: 'Email' },
            { id: 'google', label: 'Google' },
            { id: 'phone', label: 'Phone' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setAuthMethod(id as AuthMethod)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                authMethod === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              disabled={loading}
              aria-selected={authMethod === id}
              role="tab"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Auth Method Content */}
        <div role="tabpanel" className="mt-6">
          {authMethod === 'email' && <EmailSignIn onSuccess={onClose} />}
          {authMethod === 'google' && <GoogleSignIn onSuccess={onClose} />}
          {authMethod === 'phone' && <PhoneSignIn onSuccess={onClose} />}
        </div>
      </div>
    </div>
  );
}