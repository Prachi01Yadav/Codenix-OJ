import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Send,
  ChevronDown,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  Cpu,
  MemoryStick,
} from 'lucide-react';
import type {
  SubmissionResultDTO,
  RunResultDTO,
  Verdict,
  TestCaseResultDTO,
} from '@/api/types';
import { cn } from '@/lib/utils';

const VERDICT_CONFIG: Record<Verdict, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  PENDING: { label: 'Pending', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: Loader2 as any },
  ACCEPTED: { label: 'Accepted', color: 'text-neon-emerald', bg: 'bg-neon-emerald/10', border: 'border-neon-emerald/30', icon: CheckCircle2 },
  WRONG_ANSWER: { label: 'Wrong Answer', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: XCircle },
  TIME_LIMIT_EXCEEDED: { label: 'Time Limit Exceeded', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Clock },
  COMPILATION_ERROR: { label: 'Compilation Error', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle },
  RUNTIME_ERROR: { label: 'Runtime Error', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle },
  MEMORY_LIMIT_EXCEEDED: { label: 'Memory Limit Exceeded', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30', icon: MemoryStick },
};

type ConsoleMode = 'idle' | 'running' | 'submitting' | 'run-result' | 'submit-result';

interface ConsolePaneProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onRun: () => void;
  onSubmit: () => void;
  mode: ConsoleMode;
  runResult: RunResultDTO | null;
  submitResult: SubmissionResultDTO | null;
  error: string | null;
}

function TestCaseCard({ result, index }: { result: TestCaseResultDTO; index: number }) {
  const vCfg = VERDICT_CONFIG[result.verdict];
  const VIcon = vCfg.icon;
  return (
    <div className={cn('rounded-lg border p-3', vCfg.border, vCfg.bg)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VIcon className={cn('h-4 w-4', vCfg.color)} />
          <span className="text-xs font-medium text-white">Case {index + 1}</span>
          <span className={cn('text-xs font-medium', vCfg.color)}>{vCfg.label}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            {result.executionTime}ms
          </span>
          <span className="flex items-center gap-1">
            <MemoryStick className="h-3 w-3" />
            {result.memoryUsed.toFixed(1)}MB
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/30">Your Output</div>
          <pre className="overflow-x-auto rounded bg-black/30 p-2 font-mono text-xs text-white/60">{result.output || '(empty)'}</pre>
        </div>
        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/30">Expected</div>
          <pre className="overflow-x-auto rounded bg-black/30 p-2 font-mono text-xs text-white/60">{result.expectedOutput || '(empty)'}</pre>
        </div>
      </div>
    </div>
  );
}

export function ConsolePane({
  collapsed,
  onToggleCollapse,
  onRun,
  onSubmit,
  mode,
  runResult,
  submitResult,
  error,
}: ConsolePaneProps) {
  const [activeTab, setActiveTab] = useState<'testcases' | 'custom'>('testcases');

  const isBusy = mode === 'running' || mode === 'submitting';

  return (
    <div className="flex flex-col bg-[#0a0a0a]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Terminal className="h-4 w-4 text-neon-emerald" />
            <span className="font-medium">Console</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')} />
          </button>

          {/* Tabs */}
          {!collapsed && (
            <div className="ml-4 flex items-center gap-1">
              <button
                onClick={() => setActiveTab('testcases')}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                  activeTab === 'testcases'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70',
                )}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                  activeTab === 'custom'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70',
                )}
              >
                Custom Input
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-neon-blue/30 hover:bg-neon-blue/10 hover:text-neon-blue disabled:opacity-40"
          >
            {mode === 'running' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Run Code
          </button>
          <button
            onClick={onSubmit}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-emerald to-neon-blue px-3 py-1.5 text-xs font-semibold text-black transition-all hover:shadow-[0_0_20px_rgba(16,255,176,0.3)] disabled:opacity-40"
          >
            {mode === 'submitting' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Submit
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto px-4 py-3">
              {/* Error state */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Idle state */}
              {mode === 'idle' && !error && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Terminal className="mb-2 h-8 w-8 text-white/10" />
                  <p className="text-sm text-white/30">
                    Run your code to see output here, or submit to test against all cases.
                  </p>
                </div>
              )}

              {/* Running state */}
              {(mode === 'running' || mode === 'submitting') && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-neon-emerald" />
                  <p className="text-sm text-white/50">
                    {mode === 'running' ? 'Running your code...' : 'Submitting solution...'}
                  </p>
                  <div className="mt-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-neon-emerald"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Run result */}
              {mode === 'run-result' && runResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 rounded-lg border border-neon-blue/20 bg-neon-blue/5 px-3 py-2">
                    <Play className="h-4 w-4 text-neon-blue" />
                    <span className="text-sm font-medium text-white">Run Output</span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-white/40">
                      <Cpu className="h-3 w-3" />
                      {runResult.executionTime}ms
                    </span>
                  </div>
                  {runResult.success ? (
                    <pre className="overflow-x-auto rounded-lg border border-white/5 bg-black/40 p-3 font-mono text-sm text-neon-emerald/80">
                      {runResult.output || '(no output)'}
                    </pre>
                  ) : (
                    <pre className="overflow-x-auto rounded-lg border border-red-500/20 bg-red-500/5 p-3 font-mono text-sm text-red-400">
                      {runResult.error || 'Execution failed'}
                    </pre>
                  )}
                </motion.div>
              )}

              {/* Submit result */}
              {mode === 'submit-result' && submitResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Verdict banner */}
                  {(() => {
                    const vCfg = VERDICT_CONFIG[submitResult.verdict];
                    const VIcon = vCfg.icon;
                    return (
                      <div className={cn('flex items-center justify-between rounded-xl border p-4', vCfg.border, vCfg.bg)}>
                        <div className="flex items-center gap-3">
                          <VIcon className={cn('h-6 w-6', vCfg.color)} />
                          <div>
                            <div className={cn('text-lg font-bold', vCfg.color)}>{vCfg.label}</div>
                            <div className="text-xs text-white/40">
                              {submitResult.passedTestCases} / {submitResult.totalTestCases} test cases passed
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Cpu className="h-3.5 w-3.5 text-neon-blue" />
                            {submitResult.executionTime}ms
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50">
                            <MemoryStick className="h-3.5 w-3.5 text-neon-purple" />
                            {submitResult.memoryUsed.toFixed(1)}MB
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Progress bar */}
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        'h-full rounded-full',
                        submitResult.verdict === 'ACCEPTED'
                          ? 'bg-gradient-to-r from-neon-emerald to-neon-blue'
                          : 'bg-gradient-to-r from-yellow-500 to-red-500',
                      )}
                    />
                  </div>

                  {/* Error message */}
                  {submitResult.errorMessage && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-red-400">Error</div>
                      <pre className="overflow-x-auto font-mono text-xs text-white/60">{submitResult.errorMessage}</pre>
                    </div>
                  )}

                  {/* Test case results */}
                  {submitResult.testCaseResults.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wider text-white/30">
                        Test Case Results
                      </div>
                      {submitResult.testCaseResults.map((tc, idx) => (
                        <TestCaseCard key={tc.testCaseId} result={tc} index={idx} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Custom input tab */}
              {activeTab === 'custom' && mode === 'idle' && (
                <div className="space-y-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-white/30">
                    Custom Input
                  </div>
                  <textarea
                    className="h-32 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-sm text-white/70 outline-none transition-all focus:border-neon-emerald/30"
                    placeholder="Enter your custom input here..."
                  />
                  <p className="text-xs text-white/30">
                    Click "Run Code" to execute with this custom input.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
