export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Aurora blobs — pure CSS animations, GPU composited */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[60vh] w-[60vh] rounded-full blur-[120px] animate-aurora-drift"
        style={{
          background:
            'radial-gradient(circle, rgba(16,255,176,0.18) 0%, rgba(16,255,176,0) 70%)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full blur-[130px] animate-aurora-drift-reverse"
        style={{
          background:
            'radial-gradient(circle, rgba(0,212,255,0.16) 0%, rgba(0,212,255,0) 70%)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[55vh] w-[55vh] rounded-full blur-[110px] animate-aurora-drift"
        style={{
          background:
            'radial-gradient(circle, rgba(168,85,247,0.14) 0%, rgba(168,85,247,0) 70%)',
          willChange: 'transform',
          animationDelay: '-8s',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_85%)]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20256%20256%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27n%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%274%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
    </div>
  );
}
