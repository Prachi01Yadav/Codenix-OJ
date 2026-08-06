import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

interface NavbarProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Languages', href: '#languages' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Docs', href: '#docs' },
];

export function Navbar({ onOpenAuth }: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass-strong py-3' : 'py-5',
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-emerald to-neon-blue">
                <Zap className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-neon-emerald opacity-40 blur-lg transition-opacity group-hover:opacity-60" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Codenix</span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon-emerald transition-all duration-300 hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Sign in
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="group relative overflow-hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              <span className="relative z-10">Get Started</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-white md:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-white/80 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { onOpenAuth('register'); setMobileOpen(false); }}
                className="mt-2 rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-black"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
