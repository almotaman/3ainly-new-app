import { useState, type FormEvent } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { supabase } from './supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRole('buyer');
    setFullName('');
    setError(null);
    setIsSubmitting(false);
    setShowRolePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleClick = () => {
    setShowRolePicker(true);
  };

  const handleGoogle = async (selectedRole: 'buyer' | 'seller') => {
    setError(null);
    setShowRolePicker(false);
    
    // Save role so we can use it after Google redirects back
    localStorage.setItem('pendingRole', selectedRole);
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin
      },
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsSubmitting(false);
        return;
      }

      handleClose();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    if (data.session?.user) {
      await supabase
        .from('profiles')
        .update({ role })
        .eq('id', data.session.user.id);
      handleClose();
    } else {
      localStorage.setItem('pendingRole', role);
      setError('Check your email to confirm your account, then sign in.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500">Choose your role and sign in.</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {showRolePicker ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">What brings you here?</p>
              <button
                onClick={() => handleGoogle('buyer')}
                className="w-full px-4 py-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-gray-900 font-medium hover:border-blue-400 transition-all"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">🏠</span>
                  <span className="font-bold">I'm Looking to Buy or Rent</span>
                  <span className="text-xs text-gray-500">Browse and explore properties</span>
                </div>
              </button>
              <button
                onClick={() => handleGoogle('seller')}
                className="w-full px-4 py-4 rounded-xl border-2 border-purple-200 bg-purple-50 text-gray-900 font-medium hover:border-purple-400 transition-all"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">💼</span>
                  <span className="font-bold">I'm Selling Properties</span>
                  <span className="text-xs text-gray-500">List and manage your properties</span>
                </div>
              </button>
              <button
                onClick={() => setShowRolePicker(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleGoogleClick}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="h-px flex-1 bg-gray-200" />
                OR
                <div className="h-px flex-1 bg-gray-200" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                  <User size={16} className="text-gray-400" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                <Lock size={16} className="text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'buyer' | 'seller')}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full text-sm text-gray-500"
          >
            {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
