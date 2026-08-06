import { motion } from 'framer-motion';
import { Clock, MemoryStick, FileCode2, ListChecks, AlertCircle } from 'lucide-react';
import type { ProblemDetailDTO, Difficulty } from '@/api/types';
import { cn } from '@/lib/utils';

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  EASY: { label: 'Easy', color: 'text-neon-emerald', bg: 'bg-neon-emerald/10', border: 'border-neon-emerald/30' },
  MEDIUM: { label: 'Medium', color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
  HARD: { label: 'Hard', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30' },
};

function formatDescription(desc: string): string[] {
  return desc.split('\n').filter((l) => l.trim().length > 0);
}

interface ProblemPaneProps {
  problem: ProblemDetailDTO | null;
  loading: boolean;
}

export function ProblemPane({ problem, loading }: ProblemPaneProps) {
  if (loading || !problem) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-neon-emerald" />
      </div>
    );
  }

  const diffCfg = DIFFICULTY_CONFIG[problem.difficulty];
  const descLines = formatDescription(problem.description);

  return (
    <div className="h-full overflow-y-auto px-6 py-5">
      {/* Title + difficulty */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-3 flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">{problem.title}</h1>
          <span className={cn('rounded-md border px-2 py-0.5 text-xs font-medium', diffCfg.border, diffCfg.bg, diffCfg.color)}>
            {diffCfg.label}
          </span>
        </div>
        <div className="mb-5 flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <span key={tag} className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/40">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="mb-6"
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/30">
          <FileCode2 className="h-3.5 w-3.5" />
          Description
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-white/70">
          {descLines.map((line, i) => (
            <p key={i} className="whitespace-pre-wrap">{line}</p>
          ))}
        </div>
      </motion.div>

      {/* Constraints */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-6"
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/30">
          <AlertCircle className="h-3.5 w-3.5" />
          Constraints
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/60">{problem.constraints}</pre>
        </div>
      </motion.div>

      {/* Limits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mb-6 flex gap-3"
      >
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <Clock className="h-4 w-4 text-neon-blue" />
          <span className="text-xs text-white/40">Time Limit</span>
          <span className="text-xs font-medium text-white">{problem.timeLimit}ms</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <MemoryStick className="h-4 w-4 text-neon-purple" />
          <span className="text-xs text-white/40">Memory Limit</span>
          <span className="text-xs font-medium text-white">{problem.memoryLimit}MB</span>
        </div>
      </motion.div>

      {/* I/O Format */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/30">Input Format</div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-white/60">
            {problem.inputFormat}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/30">Output Format</div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-white/60">
            {problem.outputFormat}
          </div>
        </div>
      </motion.div>

      {/* Sample Test Cases */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/30">
          <ListChecks className="h-3.5 w-3.5" />
          Sample Test Cases
        </div>
        <div className="space-y-3">
          {problem.sampleTestCases.map((tc, idx) => (
            <div key={tc.id} className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="border-b border-white/5 px-4 py-2 text-xs font-medium text-white/40">
                Example {idx + 1}
              </div>
              <div className="grid grid-cols-1 divide-y divide-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-3">
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neon-emerald/50">Input</div>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-white/70">{tc.input}</pre>
                </div>
                <div className="p-3">
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neon-blue/50">Output</div>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-white/70">{tc.expectedOutput}</pre>
                </div>
              </div>
              {tc.explanation && (
                <div className="border-t border-white/5 bg-white/[0.01] px-4 py-2.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">Explanation: </span>
                  <span className="text-xs text-white/50">{tc.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
