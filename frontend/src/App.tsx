import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/effects/AuroraBackground';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { Marquee } from '@/components/landing/Marquee';
import { Footer } from '@/components/landing/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { ProblemsetDashboard } from '@/components/dashboard/ProblemsetDashboard';
import { WorkspacePage } from '@/components/workspace/WorkspacePage';
import { useAuthStore } from '@/store/authStore';

type AuthMode = 'login' | 'register';

function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    navigate('/dashboard');
  };

  return (
    <div>
      <AuroraBackground />
      <Navbar onOpenAuth={openAuth} />
      <main>
        <Hero onOpenAuth={openAuth} />
        <BentoGrid />
        <Marquee />
      </main>
      <Footer onOpenAuth={openAuth} />
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function DashboardPage() {
  const { isAuthenticated, hydrate } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    hydrate();
    if (!isAuthenticated && !localStorage.getItem('codenix_token')) {
      navigate('/');
    }
  }, [isAuthenticated, hydrate, navigate]);

  return (
    <>
      <DashboardNavbar />
      <ProblemsetDashboard />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workspace/:problemId" element={<WorkspacePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
