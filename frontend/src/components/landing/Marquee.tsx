import { motion } from 'framer-motion';

const techStack = [
  { name: 'C++', color: '#00599C' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Java', color: '#E76F00' },
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden">
      {/* Pure CSS animation — no JS interpolation */}
      <div
        className={`flex shrink-0 items-center gap-6 pr-6 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
        style={{ willChange: 'transform' }}
      >
        {Array(10).fill(techStack).flat().map((tech, i) => (
          <div
            key={i}
            className="group flex shrink-0 items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3 transition-colors hover:border-white/15 hover:bg-white/5"
          >
            <span
              className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
              style={{ backgroundColor: tech.color }}
            />
            <span className="text-sm font-medium text-white/70 transition-colors group-hover:text-white">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section id="languages" className="relative py-24">
      <div className="mx-auto mb-12 max-w-2xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium uppercase tracking-widest text-neon-blue"
        >
          Supported Languages
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          One platform. <span className="text-gradient-purple">Endless possibilities.</span>
        </motion.h2>
      </div>

      {/* Gradient masks */}
      <div className="relative flex flex-col gap-4 overflow-hidden py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent" />
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
