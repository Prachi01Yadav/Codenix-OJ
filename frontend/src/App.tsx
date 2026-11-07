import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { api, Problem, ProblemItem, Submission, subscribeToSubmission, TestCase, User } from './api';

const STARTER_CODE: Record<string, string> = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    int a, b;\n    if (cin >> a >> b) {\n        cout << (a + b) << endl;\n    }\n    return 0;\n}\n`,
  python: `import sys\n\n# Write your Python solution here\ndata = sys.stdin.read().split()\nif len(data) >= 2:\n    print(int(data[0]) + int(data[1]))\n`,
};

const GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  '939671198432-u9ss1hkaesbbsalkocmq0var27crhqlm.apps.googleusercontent.com';

const ALL_TAGS = [
  'Arrays',
  'Strings',
  'Hashing',
  'DP',
  'Graphs',
  'Trees',
  'Linked Lists',
  'Two Pointers',
  'Binary Search',
  'Stacks',
  'Heaps',
  'Trie',
  'DFS',
  'BFS',
  'Sliding Window',
  'Math',
  'Design',
];

export default function App() {
  // 1. Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authErr, setAuthErr] = useState('');

  // 2. Dashboard & Filter State
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tag, setTag] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'ATTEMPTED' | 'UNSOLVED'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProb, setNewProb] = useState<Problem>({
    title: '',
    statement: '',
    difficulty: 'EASY',
    timeLimitMs: 2000,
    tags: ['Arrays'],
    testCases: [
      { input: '2 3', expectedOutput: '5', sample: true },
      { input: '100 200', expectedOutput: '300', sample: false },
    ],
  });

  // 3. Coding Workspace State
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<'cpp' | 'python'>('cpp');
  const [code, setCode] = useState(STARTER_CODE.cpp);
  const [customInput, setCustomInput] = useState('');
  const [runResult, setRunResult] = useState<{ output: string; error: string; timeMs: number } | null>(null);
  const [liveSubmission, setLiveSubmission] = useState<Submission | null>(null);
  const [pastSubmissions, setPastSubmissions] = useState<Submission[]>([]);
  const [bottomTab, setBottomTab] = useState<'console' | 'ai' | 'submissions'>('console');
  const [busy, setBusy] = useState(false);

  // 4. AI Mentor State
  const [aiMode, setAiMode] = useState('hint');
  const [aiReply, setAiReply] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Load problem list whenever filters or user change
  const loadProblems = async () => {
    try {
      const list = await api.getProblems({
        search: search || undefined,
        difficulty: difficulty || undefined,
        tag: tag || undefined,
        userId: user?.id,
      });
      setProblems(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProblems();
  }, [search, difficulty, tag, user]);

  // Open a problem in the Coding Workspace
  const openWorkspace = async (id: number) => {
    const p = await api.getProblem(id);
    setActiveProblem(p);
    setCustomInput(p.samples?.[0]?.input || '');
    setRunResult(null);
    setLiveSubmission(null);
    setAiReply('');
    if (user) {
      const subs = await api.getProblemSubmissions(id, user.id);
      setPastSubmissions(subs);
    }
  };

  // Handle Login / Register
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr('');
    try {
      const res = isRegister
        ? await api.register(authForm.name, authForm.email, authForm.password)
        : await api.login(authForm.email, authForm.password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      setShowAuth(false);
    } catch (err: any) {
      setAuthErr(err.message || 'Authentication failed');
    }
  };

  // Handle Real Google Popup Sign-In -> calls POST /api/auth/google
  const handleGooglePopup = () => {
    setAuthErr('');
    const g = (window as any).google;
    if (!g?.accounts?.oauth2) {
      setAuthErr('Google Sign-In script is still loading. Please check your internet connection.');
      return;
    }
    const tokenClient = g.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse?.error) {
          setAuthErr('Google Sign-In cancelled or failed: ' + tokenResponse.error);
          return;
        }
        try {
          // 1. Fetch the user's verified Google profile (name & email) from Google
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          const profile = await userInfoRes.json();

          // 2. Send verified Google name & email to our backend POST /api/auth/google
          const res = await api.googleLogin(profile.name || profile.email.split('@')[0], profile.email);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          setUser(res.user);
          setShowAuth(false);
        } catch (err: any) {
          setAuthErr(err.message || 'Google Sign-In failed');
        }
      },
    });
    tokenClient.requestAccessToken();
  };

  // Quick 1-Click Demo / Admin Login
  const handleQuickLogin = async (email: string, pass: string) => {
    setAuthErr('');
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      setShowAuth(false);
    } catch (err: any) {
      setAuthErr(err.message || 'Quick login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Button 1: Run Code (Stateless Scratchpad)
  const handleRun = async () => {
    if (!user) return setShowAuth(true);
    setBusy(true);
    setBottomTab('console');
    setLiveSubmission(null);
    try {
      const res = await api.runCode(language, code, customInput);
      setRunResult(res);
    } catch (err: any) {
      setRunResult({ output: '', error: err.message, timeMs: 0 });
    } finally {
      setBusy(false);
    }
  };

  // Button 2: Submit Code (Saves PENDING receipt + subscribes to STOMP WebSocket!)
  const handleSubmit = async () => {
    if (!user) return setShowAuth(true);
    if (!activeProblem?.id) return;
    setBusy(true);
    setBottomTab('console');
    setRunResult(null);
    try {
      const pending = await api.submitCode(user.id, activeProblem.id, language, code);
      setLiveSubmission(pending);

      const unsubscribe = subscribeToSubmission(pending.id, (updated) => {
        setLiveSubmission(updated);
        setBusy(false);
        unsubscribe();
        loadProblems();
        api.getProblemSubmissions(activeProblem.id!, user.id).then(setPastSubmissions);
      });
    } catch (err: any) {
      setBusy(false);
      alert('Submission failed: ' + err.message);
    }
  };

  // Ask the 5-Mode Google Gemini AI Mentor
  const handleAskAi = async (mode: string) => {
    if (!user) return setShowAuth(true);
    if (!activeProblem) return;
    setAiMode(mode);
    setBottomTab('ai');
    setAiLoading(true);
    try {
      const res = await api.askAi(mode, language, code, `${activeProblem.title}\n${activeProblem.statement}`);
      setAiReply(res.reply);
    } catch (err: any) {
      setAiReply('AI Error: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Create a new problem
  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProblem(newProb);
      setShowCreateModal(false);
      loadProblems();
    } catch (err: any) {
      alert('Failed to create problem: ' + err.message);
    }
  };

  const addTestCaseRow = () => {
    setNewProb({
      ...newProb,
      testCases: [...(newProb.testCases || []), { input: '', expectedOutput: '', sample: false }],
    });
  };

  const updateTestCaseRow = (index: number, field: keyof TestCase, value: any) => {
    const updated = [...(newProb.testCases || [])];
    updated[index] = { ...updated[index], [field]: value };
    setNewProb({ ...newProb, testCases: updated });
  };

  const removeTestCaseRow = (index: number) => {
    const updated = (newProb.testCases || []).filter((_, i) => i !== index);
    setNewProb({ ...newProb, testCases: updated });
  };

  const filteredProblems = problems.filter((p) => {
    if (statusFilter === 'SOLVED') return p.status === 'SOLVED';
    if (statusFilter === 'ATTEMPTED') return p.status === 'ATTEMPTED';
    if (statusFilter === 'UNSOLVED') return p.status === 'UNSOLVED';
    return true;
  });

  // Stats calculation for the Dashboard header cards
  const easyCount = problems.filter((p) => p.difficulty === 'EASY').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'MEDIUM').length;
  const hardCount = problems.filter((p) => p.difficulty === 'HARD').length;
  const solvedCount = problems.filter((p) => p.status === 'SOLVED').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* TOP NAVBAR */}
      <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveProblem(null)}
            className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent"
          >
            ⚡ Codenix OJ
          </button>
          {activeProblem && (
            <span className="text-sm text-slate-400">
              / <span className="text-slate-200 font-semibold">{activeProblem.title}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-300">
                👤 <strong>{user.name}</strong>{' '}
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 ml-1">{user.role}</span>
              </span>
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="text-sm px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:opacity-90"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* MAIN VIEW: EITHER PROBLEM DASHBOARD OR SPLIT-PANE CODING WORKSPACE */}
      {!activeProblem ? (
        <main className="max-w-6xl w-full mx-auto py-8 px-4 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Problemset Dashboard</h1>
              <p className="text-slate-400 text-sm">
                Master algorithms in C++ &amp; Python with isolated sandbox execution, live WebSocket verdicts &amp; Gemini AI mentorship.
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold"
              >
                + New Problem
              </button>
            )}
          </div>

          {/* STATS SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <div className="text-xs text-slate-400">Total Problems</div>
              <div className="text-2xl font-extrabold text-white mt-1">{problems.length}</div>
            </div>
            <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl p-3.5">
              <div className="text-xs text-emerald-400">Easy</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{easyCount}</div>
            </div>
            <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-3.5">
              <div className="text-xs text-amber-400">Medium</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{mediumCount}</div>
            </div>
            <div className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-3.5">
              <div className="text-xs text-rose-400">Hard</div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">{hardCount}</div>
            </div>
            <div className="bg-slate-900/90 border border-cyan-500/20 rounded-xl p-3.5">
              <div className="text-xs text-cyan-400">Solved</div>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">
                {solvedCount} <span className="text-xs font-normal text-slate-500">/ {problems.length}</span>
              </div>
            </div>
          </div>

          {/* TOPIC TAG PILLS */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <button
              onClick={() => setTag('')}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                tag === ''
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              All Topics
            </button>
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? '' : t)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  tag === t
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* FILTERS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search problems by title..."
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm md:col-span-2"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="SOLVED">✅ Solved</option>
              <option value="ATTEMPTED">🟡 Attempted</option>
              <option value="UNSOLVED">⚪ Unsolved</option>
            </select>
          </div>

          {/* PROBLEMS TABLE */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase text-slate-400">
                  <th className="py-3 px-4 w-20">Status</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-32">Difficulty</th>
                  <th className="py-3 px-4">Topic Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => openWorkspace(p.id)}
                    className="border-b border-slate-800/60 hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      {p.status === 'SOLVED' ? '✅' : p.status === 'ATTEMPTED' ? '🟡' : '⚪'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-400 hover:underline">
                      #{p.id}. {p.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.difficulty === 'EASY'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : p.difficulty === 'MEDIUM'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 flex gap-1.5 flex-wrap">
                      {p.tags?.map((t) => (
                        <span key={t} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
                {filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                      No problems match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      ) : (
        /* SPLIT-PANE CODING WORKSPACE */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-3.5rem)]">
          {/* LEFT PANE: Problem Statement & Sample Cases */}
          <div className="lg:col-span-5 border-r border-slate-800 p-5 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveProblem(null)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ← Back to Problems
              </button>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {activeProblem.difficulty} • ⏱️ {activeProblem.timeLimitMs}ms
              </span>
            </div>

            <h2 className="text-xl font-bold">
              #{activeProblem.id}. {activeProblem.title}
            </h2>

            <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {activeProblem.statement}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Test Cases</h3>
              {activeProblem.samples?.map((s, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono space-y-1.5">
                  <div>
                    <span className="text-slate-400">Input:</span>
                    <pre className="bg-slate-950 p-2 rounded mt-1">{s.input}</pre>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected Output:</span>
                    <pre className="bg-slate-950 p-2 rounded mt-1 text-emerald-400">{s.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>

            {/* AI MENTOR BAR */}
            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                🤖 Ask Gemini AI Coding Mentor
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['hint', 'explain', 'debug', 'complexity', 'review'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleAskAi(m)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 hover:bg-indigo-900 capitalize font-medium"
                  >
                    ✨ {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Monaco Editor (Top) + Console / Live Verdict / AI Reply (Bottom) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            {/* Editor Toolbar */}
            <div className="h-11 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900">
              <select
                value={language}
                onChange={(e) => {
                  const lang = e.target.value as 'cpp' | 'python';
                  setLanguage(lang);
                  setCode(STARTER_CODE[lang]);
                }}
                className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs font-semibold"
              >
                <option value="cpp">C++ (GCC g++)</option>
                <option value="python">Python 3</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  disabled={busy}
                  onClick={handleRun}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-50"
                >
                  ▶️ Run
                </button>
                <button
                  disabled={busy}
                  onClick={handleSubmit}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold disabled:opacity-50"
                >
                  🚀 Submit
                </button>
              </div>
            </div>

            {/* Monaco Code Editor */}
            <div className="flex-1 min-h-[260px]">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language === 'cpp' ? 'cpp' : 'python'}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
              />
            </div>

            {/* Bottom Console / AI / Submissions Drawer */}
            <div className="h-64 border-t border-slate-800 bg-slate-900 flex flex-col">
              <div className="flex border-b border-slate-800 px-4 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setBottomTab('console')}
                  className={`py-2.5 border-b-2 ${
                    bottomTab === 'console' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  🖥️ Console &amp; Live Verdict
                </button>
                <button
                  onClick={() => setBottomTab('ai')}
                  className={`py-2.5 border-b-2 ${
                    bottomTab === 'ai' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  🤖 AI Mentor ({aiMode})
                </button>
                <button
                  onClick={() => setBottomTab('submissions')}
                  className={`py-2.5 border-b-2 ${
                    bottomTab === 'submissions' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  📜 My Submissions ({pastSubmissions.length})
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto text-xs font-mono">
                {bottomTab === 'console' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    <div>
                      <div className="text-slate-400 mb-1">Custom Input (stdin):</div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        rows={5}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      {liveSubmission && (
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="font-bold text-sm mb-1">
                            Verdict:{' '}
                            <span
                              className={
                                liveSubmission.verdict === 'ACCEPTED'
                                  ? 'text-emerald-400'
                                  : liveSubmission.verdict === 'PENDING'
                                  ? 'text-amber-400 animate-pulse'
                                  : 'text-rose-400'
                              }
                            >
                              {liveSubmission.verdict}
                            </span>
                          </div>
                          {liveSubmission.verdict !== 'PENDING' && (
                            <div className="text-slate-400">
                              Passed: {liveSubmission.passed}/{liveSubmission.total} • Max Time: {liveSubmission.timeMs}ms
                            </div>
                          )}
                          {liveSubmission.errorMessage && (
                            <pre className="text-rose-400 mt-2 whitespace-pre-wrap">{liveSubmission.errorMessage}</pre>
                          )}
                        </div>
                      )}

                      {runResult && (
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="text-slate-400 mb-1">Output ({runResult.timeMs}ms):</div>
                          <pre className="text-emerald-400 whitespace-pre-wrap">{runResult.output || '(empty)'}</pre>
                          {runResult.error && (
                            <pre className="text-rose-400 mt-1 whitespace-pre-wrap">{runResult.error}</pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {bottomTab === 'ai' && (
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans text-sm">
                    {aiLoading ? '🤖 Gemini 3.8 Flash is analyzing your code...' : aiReply || 'Click any AI Mentor button on the left pane!'}
                  </div>
                )}

                {bottomTab === 'submissions' && (
                  <div className="space-y-2">
                    {pastSubmissions.map((s) => (
                      <div key={s.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800">
                        <span className={s.verdict === 'ACCEPTED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {s.verdict}
                        </span>
                        <span>
                          {s.passed}/{s.total} cases • {s.timeMs}ms • {s.language.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL (Login / Register / Google Sign-In / Quick Demo) */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{isRegister ? 'Create Codenix Account' : 'Sign In to Codenix'}</h2>
              <button onClick={() => setShowAuth(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            {authErr && <div className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded">{authErr}</div>}

            {/* REAL GOOGLE OAUTH POPUP BUTTON */}
            <button
              type="button"
              onClick={handleGooglePopup}
              className="w-full flex items-center justify-center gap-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs py-2.5 px-4 rounded-lg transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              Continue with Google
            </button>

            {/* 1-CLICK DEMO / ADMIN LOGIN */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('demo@geetcode.com', 'demo123')}
                className="text-xs py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold border border-emerald-500/20"
              >
                ⚡ Demo User
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@geetcode.com', 'admin123')}
                className="text-xs py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold border border-amber-500/20"
              >
                🔑 Admin Login
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex-1 h-px bg-slate-800" />
              <span>or with email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {isRegister && (
                <input
                  required
                  placeholder="Full Name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                />
              )}
              <input
                required
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              />
              <button type="submit" className="w-full py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold">
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-cyan-400 hover:underline">
                {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROBLEM MODAL (WITH SAMPLE & HIDDEN TEST CASE BUILDER) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateProblem}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-xl space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold">Create New Problem</h2>
            <input
              required
              placeholder="Problem Title (e.g. Two Sum)"
              value={newProb.title}
              onChange={(e) => setNewProb({ ...newProb, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            />
            <textarea
              required
              rows={4}
              placeholder="Problem Statement..."
              value={newProb.statement}
              onChange={(e) => setNewProb({ ...newProb, statement: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newProb.difficulty}
                onChange={(e) => setNewProb({ ...newProb, difficulty: e.target.value as any })}
                className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
              <input
                placeholder="Tags (comma-separated)"
                value={newProb.tags.join(',')}
                onChange={(e) => setNewProb({ ...newProb, tags: e.target.value.split(',').map((s) => s.trim()) })}
                className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* TEST CASES BUILDER */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Test Cases (Sample &amp; Hidden)</span>
                <button
                  type="button"
                  onClick={addTestCaseRow}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold"
                >
                  + Add Test Case
                </button>
              </div>
              {newProb.testCases?.map((tc, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2 rounded border border-slate-800">
                  <textarea
                    required
                    rows={2}
                    placeholder="Input (stdin)"
                    value={tc.input}
                    onChange={(e) => updateTestCaseRow(i, 'input', e.target.value)}
                    className="col-span-5 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs font-mono"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Expected Output"
                    value={tc.expectedOutput}
                    onChange={(e) => updateTestCaseRow(i, 'expectedOutput', e.target.value)}
                    className="col-span-5 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs font-mono"
                  />
                  <div className="col-span-2 flex flex-col items-center gap-1 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={tc.sample}
                        onChange={(e) => updateTestCaseRow(i, 'sample', e.target.checked)}
                      />
                      Sample
                    </label>
                    {(newProb.testCases?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCaseRow(i)}
                        className="text-rose-400 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-xs text-slate-400">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded bg-indigo-600 text-xs font-bold">
                Save Problem
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
