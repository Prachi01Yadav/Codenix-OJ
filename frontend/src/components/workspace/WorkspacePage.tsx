import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { ProblemPane } from '@/components/workspace/ProblemPane';
import { EditorPane } from '@/components/workspace/EditorPane';
import { ConsolePane } from '@/components/workspace/ConsolePane';
import { AiPanel } from '@/components/workspace/AiPanel';
import { problemService } from '@/api/problemService';
import { submissionService } from '@/api/submissionService';
import { cn } from '@/lib/utils';
import type {
  ProblemDetailDTO,
  Language,
  RunResultDTO,
  SubmissionResultDTO,
} from '@/api/types';

type ConsoleMode = 'idle' | 'running' | 'submitting' | 'run-result' | 'submit-result';

export function WorkspacePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<ProblemDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('CPP');
  const [codes, setCodes] = useState<Partial<Record<Language, string>>>({});
  const currentCode = codes[language] ?? '';
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [bottomTab, setBottomTab] = useState<'console' | 'ai'>('console');

  const [consoleMode, setConsoleMode] = useState<ConsoleMode>('idle');
  const [runResult, setRunResult] = useState<RunResultDTO | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmissionResultDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;
    setLoading(true);
    problemService
      .getProblemById(Number(problemId))
      .then((p) => {
        setProblem(p);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load problem');
        setLoading(false);
      });
  }, [problemId]);

  const handleRun = useCallback(async () => {
    setConsoleCollapsed(false);
    setConsoleMode('running');
    setError(null);
    setRunResult(null);
    try {
      const result = await submissionService.run({
        problemId: Number(problemId),
        language,
        code: currentCode,
      });
      setRunResult(result);
      setConsoleMode('run-result');
    } catch {
      setError('Failed to run code. Please try again.');
      setConsoleMode('idle');
    }
  }, [problemId, language, currentCode]);

  const handleSubmit = useCallback(async () => {
    setConsoleCollapsed(false);
    setConsoleMode('submitting');
    setError(null);
    setSubmitResult(null);
    try {
      const result = await submissionService.submit({
        problemId: Number(problemId),
        language,
        code: currentCode,
      });
      setSubmitResult(result);
      setConsoleMode('submit-result');
    } catch {
      setError('Failed to submit. Please try again.');
      setConsoleMode('idle');
    }
  }, [problemId, language, currentCode]);

  return (
    <div className="flex h-screen flex-col bg-[#050505]">
      {/* Minimal Workspace Header */}
      <div className="flex h-14 items-center justify-between border-b border-white/10 bg-[#050505] px-6">
        <div className="flex flex-1 items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Problems
          </button>
        </div>
        
        {problem && (
          <div className="flex flex-1 items-center justify-center gap-3">
            <span className="text-sm font-semibold text-white/90">{problem.title}</span>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/40">
              #{problem.id}
            </span>
          </div>
        )}

        <div className="flex flex-1 items-center justify-end">
          {/* Empty space for balance, keeps focus entirely on the code editor */}
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex-1 overflow-hidden px-4 pb-4 pt-2">
        <PanelGroup direction="horizontal">
          {/* Left: Problem description */}
          <Panel defaultSize={42} minSize={28} maxSize={60}>
            <div className="glass h-full overflow-hidden rounded-2xl">
              <ProblemPane problem={problem} loading={loading} />
            </div>
          </Panel>

          {/* Resize handle */}
          <PanelResizeHandle className="group relative w-1.5 shrink-0">
            <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 bg-white/5 transition-colors group-hover:bg-neon-emerald/30" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-0.5">
              <ChevronLeft className="h-3 w-3 text-white/0 transition-colors group-hover:text-neon-emerald/50" />
              <ChevronRight className="h-3 w-3 text-white/0 transition-colors group-hover:text-neon-emerald/50" />
            </div>
          </PanelResizeHandle>

          {/* Right: Editor + Console (vertical split) */}
          <Panel defaultSize={58} minSize={35}>
            <PanelGroup direction="vertical">
              {/* Editor */}
              <Panel defaultSize={65} minSize={30}>
                <div className="glass h-full overflow-hidden rounded-2xl">
                  <EditorPane
                    language={language}
                    onLanguageChange={setLanguage}
                    onCodeChange={(newCode) => setCodes((prev) => ({ ...prev, [language]: newCode }))}
                    code={currentCode}
                  />
                </div>
              </Panel>

              {/* Vertical resize handle */}
              <PanelResizeHandle className="group relative h-1.5 shrink-0">
                <div className="absolute left-1/2 top-1/2 h-px w-full -translate-y-1/2 bg-white/5 transition-colors group-hover:bg-neon-emerald/30" />
              </PanelResizeHandle>

              {/* Console / AI */}
              <Panel defaultSize={35} minSize={10} maxSize={70}>
                <div className="glass flex h-full flex-col overflow-hidden rounded-2xl">
                  {/* Bottom Pane Tabs */}
                  <div className="flex shrink-0 items-center gap-4 border-b border-white/5 bg-black/20 px-4 py-2">
                    <button
                      onClick={() => { setBottomTab('console'); setConsoleCollapsed(false); }}
                      className={cn(
                        'text-sm font-medium transition-colors',
                        bottomTab === 'console' && !consoleCollapsed ? 'text-white' : 'text-white/40 hover:text-white/70'
                      )}
                    >
                      Console
                    </button>
                    <button
                      onClick={() => { setBottomTab('ai'); setConsoleCollapsed(false); }}
                      className={cn(
                        'flex items-center gap-1.5 text-sm font-medium transition-colors',
                        bottomTab === 'ai' && !consoleCollapsed ? 'text-neon-purple' : 'text-white/40 hover:text-neon-purple/70'
                      )}
                    >
                      Codenix AI
                      <span className="rounded-full bg-neon-purple/20 px-1 py-0.5 text-[8px] uppercase text-neon-purple">Beta</span>
                    </button>
                  </div>
                  
                  {/* Bottom Pane Content */}
                  <div className="flex-1 overflow-hidden">
                    {bottomTab === 'console' || consoleCollapsed ? (
                      <ConsolePane
                        collapsed={consoleCollapsed}
                        onToggleCollapse={() => setConsoleCollapsed((v) => !v)}
                        onRun={handleRun}
                        onSubmit={handleSubmit}
                        mode={consoleMode}
                        runResult={runResult}
                        submitResult={submitResult}
                        error={error}
                      />
                    ) : (
                      <AiPanel
                        code={currentCode}
                        language={language}
                        problem={problem}
                      />
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
