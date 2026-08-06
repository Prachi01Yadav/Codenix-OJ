import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion';
import { ArrowRight, Play, Terminal } from 'lucide-react';
import { MagneticButton } from '@/components/effects/MagneticButton';

type AuthMode = 'login' | 'register';

interface HeroProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const codeLines: string[] = [
  '#include <bits/stdc++.h>',
  'using namespace std;',
  '',
  'int main() {',
  '    int n;',
  '    cin >> n;',
  '    vector<int> a(n);',
  '    for (int i = 0; i < n; i++)',
  '        cin >> a[i];',
  '    sort(a.begin(), a.end());',
  '    for (int x : a)',
  '        cout << x << " ";',
  '    return 0;',
  '}',
];

const outputLines: string[] = [
  '$ g++ -O2 solution.cpp -o sol',
  '$ ./sol < input.txt',
  '1 2 3 4 5 6 7 8 9 10',
  '$ echo "Exit code: 0"',
  'Exit code: 0',
  '',
  '✓ Accepted — 12ms / 1.2MB',
];

export function Hero({ onOpenAuth }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const compilingRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const [phase, setPhase] = useState<'typing' | 'compiling' | 'output'>('typing');

  // Mouse tilt for code editor
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { damping: 30, stiffness: 150 });
  const springRotY = useSpring(rotY, { damping: 30, stiffness: 150 });
  const editorScale = useSpring(1, { damping: 30, stiffness: 200 });

  // Parallax on scroll
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // IntersectionObserver to pause animation when not visible
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Typing animation — uses direct DOM writes, no React re-renders per character
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const codeContainer = codeContainerRef.current;
    const outputContainer = outputContainerRef.current;
    const compilingEl = compilingRef.current;
    if (!codeContainer || !outputContainer || !compilingEl) return;

    // Pre-create line elements for code
    const codeEls: HTMLSpanElement[] = [];
    const lineEls = codeContainer.querySelectorAll('[data-line]');
    lineEls.forEach((el) => {
      const span = el.querySelector('.code-text') as HTMLSpanElement;
      if (span) codeEls.push(span);
    });

    const outputEls: HTMLSpanElement[] = [];
    const outputLineEls = outputContainer.querySelectorAll('[data-output-line]');
    outputLineEls.forEach((el) => {
      const span = el.querySelector('.output-text') as HTMLSpanElement;
      if (span) outputEls.push(span);
    });

    const resetAll = () => {
      codeEls.forEach((el) => (el.textContent = ''));
      outputEls.forEach((el) => (el.textContent = ''));
      compilingEl.style.display = 'none';
      outputContainer.style.display = 'none';
    };

    const typeCode = (lineIdx: number, charIdx: number) => {
      if (cancelled) return;
      if (!isVisibleRef.current) {
        timer = setTimeout(() => typeCode(lineIdx, charIdx), 500);
        return;
      }

      if (lineIdx >= codeLines.length) {
        setPhase('compiling');
        compilingEl.style.display = 'flex';
        timer = setTimeout(() => {
          compilingEl.style.display = 'none';
          setPhase('output');
          outputContainer.style.display = 'block';
          typeOutput(0, 0);
        }, 1200);
        return;
      }

      const line = codeLines[lineIdx];
      if (charIdx <= line.length) {
        if (codeEls[lineIdx]) {
          codeEls[lineIdx].textContent = line.slice(0, charIdx);
        }
        const delay = line.length === 0 ? 30 : 25 + Math.random() * 20;
        timer = setTimeout(() => typeCode(lineIdx, charIdx + 1), delay);
      } else {
        timer = setTimeout(() => typeCode(lineIdx + 1, 0), 60);
      }
    };

    const typeOutput = (lineIdx: number, charIdx: number) => {
      if (cancelled) return;
      if (!isVisibleRef.current) {
        timer = setTimeout(() => typeOutput(lineIdx, charIdx), 500);
        return;
      }

      if (lineIdx >= outputLines.length) {
        timer = setTimeout(() => {
          resetAll();
          setPhase('typing');
          typeCode(0, 0);
        }, 3000);
        return;
      }

      const line = outputLines[lineIdx];
      if (charIdx <= line.length) {
        if (outputEls[lineIdx]) {
          outputEls[lineIdx].textContent = line.slice(0, charIdx);
        }
        timer = setTimeout(() => typeOutput(lineIdx, charIdx + 1), 15 + Math.random() * 15);
      } else {
        timer = setTimeout(() => typeOutput(lineIdx + 1, 0), 200);
      }
    };

    resetAll();
    typeCode(0, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      rotY.set(dx * 18);
      rotX.set(-dy * 14);
      editorScale.set(1.02);
    },
    [rotX, rotY, editorScale]
  );

  const handleMouseLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    editorScale.set(1);
  }, [rotX, rotY, editorScale]);

  // Staggered text reveal
  const headlineWords = ['Code', 'Execute'];
  const headlineWords2 = ['Dominate.'];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24"
    >
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 flex flex-col items-center"
      >

        {/* Headline */}
        <h1 className="text-center text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <div className="flex flex-wrap items-center justify-center gap-x-4">
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.3 + i * 0.15,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4">
            {headlineWords2.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.6 + i * 0.15,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-gradient-cinematic inline-block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6 max-w-xl text-center text-base text-white/50 md:text-lg"
        >
          The next-generation online judge. Write, compile, and compete in 3
          languages with millisecond-grade execution and real-time verdicts.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            onClick={() => onOpenAuth('register')}
            className="group bg-gradient-to-r from-neon-emerald to-neon-blue text-black hover:shadow-[0_0_40px_rgba(16,255,176,0.4)]"
          >
            <span className="flex items-center gap-2">
              Start Solving
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </MagneticButton>
          <MagneticButton
            className="glass text-white hover:bg-white/10"
            strength={0.2}
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Watch Demo
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* 3D Code Editor */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="perspective-2000 relative z-10 mt-16 w-full max-w-3xl"
      >
        <motion.div
          style={{
            rotateX: springRotX,
            rotateY: springRotY,
            scale: editorScale,
            transformStyle: 'preserve-3d',
          }}
          className="glass-strong relative overflow-hidden rounded-2xl"
        >
          {/* Glow behind editor */}
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-neon-emerald/20 via-neon-blue/10 to-neon-purple/20 blur-2xl" />

          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <div className="ml-3 flex items-center gap-2 text-xs text-white/40">
              <Terminal className="h-3.5 w-3.5" />
              solution.cpp
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="rounded-md bg-neon-emerald/10 px-2 py-0.5 text-[10px] font-medium text-neon-emerald">
                C++17
              </span>
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                64-bit
              </span>
            </div>
          </div>

          {/* Code body */}
          <div className="flex min-h-[340px] font-mono text-sm">
            {/* Line numbers */}
            <div className="select-none border-r border-white/5 px-3 py-4 text-right text-xs text-white/20">
              {codeLines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Code content — DOM-driven, no React state per character */}
            <div ref={codeContainerRef} className="flex-1 px-4 py-4">
              {codeLines.map((_, i) => (
                <div key={i} className="leading-6" data-line={i}>
                  <span className="code-text text-white/80" />
                </div>
              ))}

              {/* Compiling state */}
              <div
                ref={compilingRef}
                className="mt-4 items-center gap-2 text-xs text-neon-blue"
                style={{ display: 'none' }}
              >
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-neon-blue border-t-transparent" />
                Compiling...
              </div>

              {/* Output panel */}
              <div
                ref={outputContainerRef}
                className="mt-4 border-t border-white/5 pt-3"
                style={{ display: 'none' }}
              >
                <div className="mb-1 text-[10px] uppercase tracking-wider text-white/30">
                  Output
                </div>
                {outputLines.map((line, i) => (
                  <div
                    key={i}
                    data-output-line={i}
                    className={`leading-6 font-mono text-xs ${
                      line.includes('Accepted')
                        ? 'text-neon-emerald'
                        : line.startsWith('$')
                          ? 'text-white/40'
                          : 'text-white/70'
                    }`}
                  >
                    <span className="output-text" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] text-white/30">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-emerald" />
                Ready
              </span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Ln 15, Col 1</span>
              <span>Spaces: 4</span>
            </div>
          </div>
        </motion.div>

        {/* Floating accent badges */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute -left-8 top-1/4 hidden lg:block"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="glass rounded-xl px-3 py-2 text-xs">
            <div className="text-neon-emerald font-semibold">12ms</div>
            <div className="text-white/40">Execution</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute -right-8 top-2/3 hidden lg:block"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="glass rounded-xl px-3 py-2 text-xs">
            <div className="text-neon-blue font-semibold">99.99%</div>
            <div className="text-white/40">Uptime</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
