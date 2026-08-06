import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Code2,
  Activity,
  Gauge,
  GitBranch,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  glow: string;
  span?: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Lightning Execution',
    description:
      'Sub-millisecond verdicts powered by our custom sandbox. Every submission runs on bare-metal containers optimized for competitive I/O.',
    accent: 'text-neon-emerald',
    glow: 'rgba(16,255,176,0.15)',
    span: 'md:col-span-2',
  },
  {
    icon: ShieldCheck,
    title: 'Plagiarism Detection',
    description:
      'AST-level similarity analysis catches disguised copies across multiple languages.',
    accent: 'text-neon-blue',
    glow: 'rgba(0,212,255,0.15)',
  },
  {
    icon: Code2,
    title: '3 Languages',
    description: 'C++, Java, and Python. Full standard library support.',
    accent: 'text-neon-purple',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: Activity,
    title: 'Real-time Verdicts',
    description:
      'Seamless live updates via WebSockets. No polling required; get your execution results instantly as they are graded.',
    accent: 'text-neon-emerald',
    glow: 'rgba(16,255,176,0.15)',
    span: 'md:col-span-2',
  },
  {
    icon: Gauge,
    title: 'Performance Analytics',
    description:
      'Per-test-case timing, memory profiling, and complexity visualizations for every submission.',
    accent: 'text-neon-blue',
    glow: 'rgba(0,212,255,0.15)',
  },
  {
    icon: GitBranch,
    title: 'Version History',
    description:
      'Track your progress with full diff history and side-by-side solution comparison.',
    accent: 'text-neon-purple',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: Sparkles,
    title: 'Codenix AI Assistant',
    description:
      'Get instant code explanations, reviews, bug detection, complexity analysis, and progressive hints.',
    accent: 'text-neon-emerald',
    glow: 'rgba(16,255,176,0.15)',
  },
];

function SpotlightCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.current = e.clientX - rect.left;
    mouseY.current = e.clientY - rect.top;
    cardRef.current.style.setProperty('--spot-x', `${mouseX.current}px`);
    cardRef.current.style.setProperty('--spot-y', `${mouseY.current}px`);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:border-white/15 ${feature.span || ''}`}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${feature.glow}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${feature.accent}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-white/50">
          {feature.description}
        </p>
      </div>

      {/* Hover border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${feature.glow}, transparent 60%)`,
          maskImage: 'linear-gradient(black, transparent)',
          WebkitMaskImage: 'linear-gradient(black, transparent)',
        }}
      />
    </motion.div>
  );
}

export function BentoGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative px-6 py-32"
    >
      <motion.div style={{ y: headingY }} className="mx-auto mb-16 max-w-2xl text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium uppercase tracking-widest text-neon-emerald"
        >
          Platform Features
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          Built for speed.
          <br />
          <span className="text-gradient-emerald">Engineered for fairness.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-white/50"
        >
          Every component of the platform is designed to give competitors a
          frictionless, reliable, and lightning-fast experience.
        </motion.p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature, i) => (
          <SpotlightCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
