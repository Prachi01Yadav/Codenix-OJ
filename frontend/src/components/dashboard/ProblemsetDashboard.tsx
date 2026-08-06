import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import { problemService, ALL_TAGS } from '@/api/problemService';
import type {
  ProblemDTO,
  ProblemListResponseDTO,
  Difficulty,
  ProblemStatus,
} from '@/api/types';
import { cn } from '@/lib/utils';

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  EASY: { label: 'Easy', color: 'text-neon-emerald', bg: 'bg-neon-emerald/10', border: 'border-neon-emerald/30' },
  MEDIUM: { label: 'Medium', color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
  HARD: { label: 'Hard', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30' },
};

const STATUS_CONFIG: Record<ProblemStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  SOLVED: { label: 'Solved', icon: CheckCircle2, color: 'text-neon-emerald' },
  ATTEMPTED: { label: 'Attempted', icon: Clock, color: 'text-yellow-400' },
  UNSOLVED: { label: 'Unsolved', icon: Circle, color: 'text-white/20' },
};

type FilterDropdownProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
          open
            ? 'border-neon-emerald/40 bg-white/5 shadow-[0_0_15px_rgba(16,255,176,0.1)]'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20',
        )}
      >
        <span className="text-white/40">{label}:</span>
        <span className={cn('font-medium', selected ? 'text-white' : 'text-white/30')}>
          {selected?.label || 'All'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="glass-strong absolute left-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl p-1.5"
            >
              <button
                onClick={() => { onChange(''); setOpen(false); }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/5',
                  !value && 'text-neon-emerald',
                )}
              >
                All {label}
              </button>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/5',
                    value === opt.value ? 'text-neon-emerald' : 'text-white/70',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function TagFilter({
  selectedTags,
  onToggle,
}: {
  selectedTags: string[];
  onToggle: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
          open || selectedTags.length > 0
            ? 'border-neon-blue/40 bg-white/5 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20',
        )}
      >
        <Filter className="h-3.5 w-3.5 text-white/40" />
        <span className="text-white/40">Tags:</span>
        {selectedTags.length > 0 ? (
          <span className="font-medium text-neon-blue">{selectedTags.length} selected</span>
        ) : (
          <span className="font-medium text-white/30">All</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="glass-strong absolute left-0 top-full z-50 mt-2 max-h-64 min-w-[220px] overflow-auto rounded-xl p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">Filter by tag</span>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => selectedTags.forEach(onToggle)}
                    className="text-xs text-neon-emerald hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => onToggle(tag)}
                      className={cn(
                        'rounded-lg border px-2.5 py-1 text-xs transition-all',
                        selected
                          ? 'border-neon-blue/40 bg-neon-blue/10 text-neon-blue'
                          : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white',
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProblemsetDashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const PAGE_SIZE = 10;

  useEffect(() => {
    setLoading(true);
    problemService
      .getProblems({
        difficulty: (difficulty || undefined) as Difficulty | undefined,
        status: (status || undefined) as ProblemStatus | undefined,
        tags: tags.length > 0 ? tags : undefined,
        search: search || undefined,
        page,
        size: PAGE_SIZE,
        sortBy: 'id',
        sortDir: 'asc',
      })
      .then((res: ProblemListResponseDTO) => {
        setProblems(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
        setLoading(false);
      });
  }, [search, difficulty, status, tags, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, difficulty, status, tags]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const stats = useMemo(() => {
    const solved = problems.filter((p) => p.status === 'SOLVED').length;
    return { solved, total: totalElements };
  }, [problems, totalElements]);

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Subtle aurora glow at top */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-64 w-96 rounded-full bg-neon-emerald/5 blur-[120px]" />
        <div className="absolute right-1/4 top-10 h-64 w-96 rounded-full bg-neon-blue/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Problemset
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {totalElements} problems available · {stats.solved} solved by you
          </p>
        </motion.div>

        {/* Filters bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center"
        >
          {/* Search */}
          <div className="group relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-neon-emerald" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-neon-emerald/40 focus:bg-white/[0.04] focus:shadow-[0_0_25px_rgba(16,255,176,0.12)]"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Difficulty"
              value={difficulty}
              options={[
                { value: 'EASY', label: 'Easy' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HARD', label: 'Hard' },
              ]}
              onChange={setDifficulty}
            />
            <FilterDropdown
              label="Status"
              value={status}
              options={[
                { value: 'SOLVED', label: 'Solved' },
                { value: 'ATTEMPTED', label: 'Attempted' },
                { value: 'UNSOLVED', label: 'Unsolved' },
              ]}
              onChange={setStatus}
            />
            <TagFilter selectedTags={tags} onToggle={toggleTag} />
          </div>
        </motion.div>

        {/* Active filter chips */}
        {(difficulty || status || tags.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 flex flex-wrap items-center gap-2"
          >
            {difficulty && (
              <span className={cn(
                'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs',
                DIFFICULTY_CONFIG[difficulty as Difficulty].border,
                DIFFICULTY_CONFIG[difficulty as Difficulty].bg,
                DIFFICULTY_CONFIG[difficulty as Difficulty].color,
              )}>
                {DIFFICULTY_CONFIG[difficulty as Difficulty].label}
                <button onClick={() => setDifficulty('')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {status && (
              <span className="flex items-center gap-1.5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 px-2.5 py-1 text-xs text-neon-blue">
                {STATUS_CONFIG[status as ProblemStatus].label}
                <button onClick={() => setStatus('')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                {tag}
                <button onClick={() => toggleTag(tag)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass overflow-hidden rounded-2xl"
        >
          {/* Table header */}
          <div className="hidden grid-cols-12 gap-4 border-b border-white/5 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white/30 md:grid">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-2 text-right">Acceptance</div>
            <div className="col-span-2 text-right">Difficulty</div>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-neon-emerald" />
              </div>
            ) : problems.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-white/40">No problems match your filters</p>
              </div>
            ) : (
              <motion.div
                key={page + search + difficulty + status + tags.join(',')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {problems.map((problem, idx) => {
                  const statusCfg = STATUS_CONFIG[problem.status];
                  const diffCfg = DIFFICULTY_CONFIG[problem.difficulty];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.3 }}
                      onClick={() => navigate(`/workspace/${problem.id}`)}
                      className="grid cursor-pointer grid-cols-12 items-center gap-4 border-b border-white/5 px-6 py-4 transition-colors last:border-0 hover:bg-white/[0.03]"
                    >
                      {/* Status */}
                      <div className="col-span-1">
                        <StatusIcon className={cn('h-5 w-5', statusCfg.color)} />
                      </div>
                      {/* Title */}
                      <div className="col-span-12 md:col-span-5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/20">{String(problem.id).padStart(4, '0')}</span>
                          <span className="text-sm font-medium text-white transition-colors group-hover:text-neon-emerald">
                            {problem.title}
                          </span>
                        </div>
                      </div>
                      {/* Tags */}
                      <div className="col-span-12 md:col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-white/40">
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 2 && (
                            <span className="text-[10px] text-white/30">+{problem.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {/* Acceptance */}
                      <div className="col-span-6 md:col-span-2 md:text-right">
                        <div className="flex items-center gap-2 md:justify-end">
                          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/10 md:block">
                            <div
                              className={cn('h-full rounded-full', diffCfg.color.replace('text-', 'bg-'))}
                              style={{ width: `${problem.acceptanceRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/50">{problem.acceptanceRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      {/* Difficulty */}
                      <div className="col-span-6 md:col-span-2 md:text-right">
                        <span className={cn('rounded-md border px-2 py-0.5 text-xs font-medium', diffCfg.border, diffCfg.bg, diffCfg.color)}>
                          {diffCfg.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Page {page + 1} of {totalPages} · {totalElements} problems
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/60 transition-all hover:border-white/20 hover:text-white disabled:opacity-30 disabled:hover:border-white/10"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    'h-8 w-8 rounded-lg text-xs font-medium transition-all',
                    page === i
                      ? 'bg-gradient-to-r from-neon-emerald to-neon-blue text-black'
                      : 'border border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white',
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/60 transition-all hover:border-white/20 hover:text-white disabled:opacity-30 disabled:hover:border-white/10"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
