import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type Mode = 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
  onSwitchMode: (mode: Mode) => void;
  onSuccess: () => void;
}

function OAuthButtons({ onProvider }: { onProvider: (p: 'github' | 'google') => void }) {
  return (
    <div className="space-y-3">
      <button
        onClick={() => onProvider('github')}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/[0.06]"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.065 1.785 2.76 1.285 3.435.975.105-.765.42-1.285.765-1.585-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Continue with GitHub
      </button>
      <button
        onClick={() => onProvider('google')}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/[0.06]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

export function AuthModal({ open, mode, onClose, onSwitchMode, onSuccess }: AuthModalProps) {
  const { login, register, oauthLogin, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) clearError();
  }, [open, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name: handle, email, password, handle });
      }
      onSuccess();
    } catch {
      /* error handled in store */
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      await oauthLogin(provider);
      onSuccess();
    } catch {
      /* error handled in store */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-strong relative z-10 w-full max-w-md overflow-hidden rounded-2xl"
          >
            {/* Glow accents */}
            <div className="absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-neon-emerald/15 blur-[80px]" />
            <div className="absolute -bottom-20 right-0 h-40 w-72 rounded-full bg-neon-purple/10 blur-[80px]" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-emerald to-neon-blue">
                  <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3l-2 10h3l-1 8 8-12h-4l2-6z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  {mode === 'login'
                    ? 'Sign in to continue to Codenix'
                    : 'Join 500,000+ competitive developers'}
                </p>
              </div>

              {/* OAuth */}
              <OAuthButtons onProvider={handleOAuth} />

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">or continue with email</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">
                      Developer Handle
                    </label>
                    <div className="group relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-neon-emerald" />
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="code_ninja"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-neon-emerald/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(16,255,176,0.1)]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">
                    Email
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-neon-emerald" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dev@codenix.io"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-neon-emerald/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(16,255,176,0.1)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">
                    Password
                  </label>
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-neon-emerald" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-neon-emerald/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(16,255,176,0.1)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-neon-blue/70 hover:text-neon-blue">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-emerald to-neon-blue py-3 text-sm font-semibold text-black transition-all hover:shadow-[0_0_30px_rgba(16,255,176,0.3)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <p className="mt-6 text-center text-sm text-white/40">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                  className="font-medium text-neon-emerald hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
