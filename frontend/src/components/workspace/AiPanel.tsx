import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareText,
  ClipboardCheck,
  Bug,
  BarChart3,
  Lightbulb,
  Loader2,
  X,
  Copy,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiService } from '@/api/aiService';
import { cn } from '@/lib/utils';
import type { Language, ProblemDetailDTO } from '@/api/types';

type AiFeature = 'explain' | 'review' | 'debug' | 'complexity' | 'hint';

interface AiPanelProps {
  code: string;
  language: Language;
  problem: ProblemDetailDTO | null;
  className?: string;
}

const AI_FEATURES: { key: AiFeature; label: string; icon: typeof MessageSquareText; description: string }[] = [
  { key: 'explain', label: 'Explain Code', icon: MessageSquareText, description: 'Get a line-by-line explanation of your code' },
  { key: 'review', label: 'Code Review', icon: ClipboardCheck, description: 'Get feedback on quality, performance, and best practices' },
  { key: 'debug', label: 'Debug Code', icon: Bug, description: 'Find bugs, edge cases, and potential issues' },
  { key: 'complexity', label: 'Complexity', icon: BarChart3, description: 'Analyze time and space complexity' },
  { key: 'hint', label: 'Get Hint', icon: Lightbulb, description: 'Get progressive hints without spoiling the solution' },
];

export function AiPanel({ code, language, problem, className }: AiPanelProps) {
  const [activeFeature, setActiveFeature] = useState<AiFeature | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleFeatureClick = useCallback(
    async (feature: AiFeature) => {
      if (loading) return;
      setActiveFeature(feature);
      setLoading(true);
      setResult(null);

      try {
        const req = {
          code,
          language,
          problemTitle: problem?.title || '',
          problemDescription: problem?.description || '',
          hintLevel: feature === 'hint' ? hintLevel : undefined,
        };

        let response;
        switch (feature) {
          case 'explain':
            response = await aiService.explain(req);
            break;
          case 'review':
            response = await aiService.review(req);
            break;
          case 'debug':
            response = await aiService.debug(req);
            break;
          case 'complexity':
            response = await aiService.complexity(req);
            break;
          case 'hint':
            response = await aiService.hint(req);
            if (hintLevel < 3) setHintLevel((prev) => prev + 1);
            break;
        }

        setResult(response.result);
      } catch {
        setResult('⚠️ Failed to get AI response. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [code, language, problem, hintLevel, loading],
  );

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className={cn('flex h-full flex-col bg-[#0a0a0a]', className)}>
      {/* Action bar - only visible when there's a result */}
      {result && (
        <div className="flex items-center justify-end gap-1 border-b border-white/5 px-4 py-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
          >
            {copied ? <Check className="h-3 w-3 text-neon-emerald" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => {
              setResult(null);
              setActiveFeature(null);
            }}
            className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
            title="Clear result"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
              {/* Feature buttons */}
              {!result && !loading && (
                <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-5">
                  {AI_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <button
                        key={feature.key}
                        onClick={() => handleFeatureClick(feature.key)}
                        className={cn(
                          'group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center transition-all hover:border-neon-purple/30 hover:bg-neon-purple/5',
                          activeFeature === feature.key && 'border-neon-purple/40 bg-neon-purple/10',
                        )}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-purple/10 transition-colors group-hover:bg-neon-purple/20">
                          <Icon className="h-4 w-4 text-neon-purple" />
                        </div>
                        <span className="text-xs font-medium text-white/70 group-hover:text-white">
                          {feature.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Hint level selector */}
              {activeFeature === 'hint' && !result && !loading && (
                <div className="flex items-center justify-center gap-2 px-3 pb-3">
                  <span className="text-xs text-white/40">Hint Level:</span>
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setHintLevel(level)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-all',
                        hintLevel === level
                          ? 'bg-neon-purple text-black'
                          : 'border border-white/10 text-white/40 hover:border-neon-purple/30 hover:text-white/70',
                      )}
                    >
                      {level === 1 ? 'Orient' : level === 2 ? 'Approach' : 'Pseudocode'}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
                    <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-neon-purple/20" />
                  </div>
                  <p className="mt-4 text-sm text-white/50">
                    {activeFeature === 'explain' && 'Analyzing your code...'}
                    {activeFeature === 'review' && 'Reviewing your code...'}
                    {activeFeature === 'debug' && 'Searching for bugs...'}
                    {activeFeature === 'complexity' && 'Calculating complexity...'}
                    {activeFeature === 'hint' && 'Generating hint...'}
                  </p>
                  <div className="mt-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-neon-purple"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4"
                >
                  {/* Feature badge */}
                  <div className="mb-3 flex items-center gap-2">
                    {activeFeature && (() => {
                      const feat = AI_FEATURES.find((f) => f.key === activeFeature);
                      if (!feat) return null;
                      const Icon = feat.icon;
                      return (
                        <>
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neon-purple/20">
                            <Icon className="h-3.5 w-3.5 text-neon-purple" />
                          </div>
                          <span className="text-xs font-semibold text-neon-purple">{feat.label}</span>
                        </>
                      );
                    })()}
                  </div>

                  {/* Markdown content */}
                  <div className="ai-markdown prose prose-invert prose-sm max-w-none text-white/80">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="mb-3 mt-4 text-lg font-bold text-white">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="mb-2 mt-4 text-base font-bold text-white">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="mb-2 mt-3 text-sm font-bold text-white">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 text-sm leading-relaxed text-white/70">{children}</p>
                        ),
                        code: ({ className, children, ...props }) => {
                          const isBlock = className?.includes('language-');
                          if (isBlock) {
                            return (
                              <pre className="my-2 overflow-x-auto rounded-lg border border-white/5 bg-black/40 p-3">
                                <code className="font-mono text-xs text-neon-emerald/80" {...props}>
                                  {children}
                                </code>
                              </pre>
                            );
                          }
                          return (
                            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neon-blue" {...props}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => <>{children}</>,
                        ul: ({ children }) => (
                          <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-white/70">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-white/70">{children}</ol>
                        ),
                        li: ({ children }) => <li className="text-sm text-white/70">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                        table: ({ children }) => (
                          <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full text-xs">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border-b border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-white/80">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border-b border-white/5 px-3 py-2 text-white/60">{children}</td>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="my-2 border-l-2 border-neon-purple/40 pl-3 text-sm italic text-white/50">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>

                  {/* Action buttons after result */}
                  <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={() => {
                        setResult(null);
                        setActiveFeature(null);
                        setHintLevel(1);
                      }}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
                    >
                      ← Back to Features
                    </button>
                    {activeFeature === 'hint' && hintLevel <= 3 && (
                      <button
                        onClick={() => handleFeatureClick('hint')}
                        className="rounded-lg bg-neon-purple/20 px-3 py-1.5 text-xs font-medium text-neon-purple transition-colors hover:bg-neon-purple/30"
                      >
                        Next Hint (Level {hintLevel})
                      </button>
                    )}
                    {activeFeature && activeFeature !== 'hint' && (
                      <button
                        onClick={() => handleFeatureClick(activeFeature)}
                        className="rounded-lg bg-neon-purple/20 px-3 py-1.5 text-xs font-medium text-neon-purple transition-colors hover:bg-neon-purple/30"
                      >
                        Regenerate
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
        </div>
      </div>
    </div>
  );
}
