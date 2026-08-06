import { useEffect, useRef, useCallback } from 'react';

export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const visibleRef = useRef(false);
  const hoveringRef = useRef(false);

  const lerp = useCallback((a: number, b: number, t: number) => a + (b - a) * t, []);

  useEffect(() => {
    // Only enable on fine-pointer (desktop) devices
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // Skip on small screens
    if (window.innerWidth < 1024) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const dotInner = dotInnerRef.current;
    const ringInner = ringInnerRef.current;
    if (!dot || !ring || !dotInner || !ringInner) return;

    let running = true;

    const tick = () => {
      if (!running) return;

      // Smooth trail with lerp — dot follows quickly, ring follows slowly
      const dx = posRef.current.x;
      const dy = posRef.current.y;
      trailRef.current.x = lerp(trailRef.current.x, dx, 0.12);
      trailRef.current.y = lerp(trailRef.current.y, dy, 0.12);

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      ring.style.transform = `translate3d(${trailRef.current.x}px, ${trailRef.current.y}px, 0)`;

      // Hover state changes
      const isHover = hoveringRef.current;
      dotInner.style.width = isHover ? '10px' : '6px';
      dotInner.style.height = isHover ? '10px' : '6px';
      ringInner.style.width = isHover ? '56px' : '36px';
      ringInner.style.height = isHover ? '56px' : '36px';
      ringInner.style.borderColor = isHover
        ? 'rgba(16,255,176,0.6)'
        : 'rgba(0,212,255,0.4)';
      ringInner.style.backgroundColor = isHover
        ? 'rgba(16,255,176,0.08)'
        : 'rgba(0,212,255,0.04)';
      ringInner.style.boxShadow = isHover
        ? '0 0 30px rgba(16,255,176,0.3)'
        : '0 0 20px rgba(0,212,255,0.2)';

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        trailRef.current.x = e.clientX;
        trailRef.current.y = e.clientY;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      const target = e.target as HTMLElement;
      hoveringRef.current = !!target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
    };

    const handleLeave = () => {
      visibleRef.current = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [lerp]);

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:block"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <div
          ref={ringInnerRef}
          className="rounded-full border"
          style={{
            width: 36,
            height: 36,
            borderColor: 'rgba(0,212,255,0.4)',
            backgroundColor: 'rgba(0,212,255,0.04)',
            boxShadow: '0 0 20px rgba(0,212,255,0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:block"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <div
          ref={dotInnerRef}
          className="rounded-full bg-neon-emerald"
          style={{
            width: 6,
            height: 6,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 12px rgba(16,255,176,0.8)',
            transition: 'width 0.15s, height 0.15s',
          }}
        />
      </div>
    </>
  );
}
