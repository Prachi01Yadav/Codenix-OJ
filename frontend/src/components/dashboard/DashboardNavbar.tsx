import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, LogOut, Trophy, Code2, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Problems', href: '/dashboard', icon: Code2 },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

export function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass-strong py-3' : 'py-4',
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-emerald to-neon-blue">
                <Zap className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-neon-emerald opacity-40 blur-lg transition-opacity group-hover:opacity-60" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Codenix</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 transition-colors hover:border-white/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-emerald to-neon-blue text-xs font-bold text-black">
                    {user.handle.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white">{user.handle}</div>
                    <div className="text-[10px] text-neon-emerald">{user.rating} ELO</div>
                  </div>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-strong absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl p-2"
                    >
                      <div className="border-b border-white/5 px-3 py-2.5">
                        <div className="text-sm font-semibold text-white">{user.displayName}</div>
                        <div className="text-xs text-white/40">{user.email}</div>
                        <div className="mt-1.5 flex gap-2">
                          <span className="rounded bg-neon-emerald/10 px-1.5 py-0.5 text-[10px] text-neon-emerald">
                            {user.rank}
                          </span>
                          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">
                            {user.solvedCount} solved
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                <UserIcon className="h-4 w-4" />
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen((v) => !v)} className="text-white md:hidden">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-strong fixed top-16 left-0 right-0 z-40 p-6 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-base text-white/80 hover:text-white"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-2 text-base text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
