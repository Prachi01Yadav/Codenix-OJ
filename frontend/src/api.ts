import { Client } from '@stomp/stompjs';

// ============================================================================
// 1. DATA TYPES (Matching our Java Entities & DTO Records in GeetCODE!)
// ============================================================================
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TestCase {
  id?: number;
  input: string;
  expectedOutput: string;
  sample: boolean;
}

export interface ProblemItem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  status: 'SOLVED' | 'ATTEMPTED' | 'UNSOLVED';
}

export interface Problem {
  id?: number;
  title: string;
  statement: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimitMs: number;
  tags: string[];
  samples?: TestCase[];
  testCases?: TestCase[];
}

export interface Submission {
  id: number;
  userId: number;
  problemId: number;
  language: string;
  code: string;
  verdict: string;
  passed: number;
  total: number;
  timeMs: number;
  errorMessage?: string;
  submittedAt: string;
}

// ============================================================================
// 2. HTTP HELPER (Automatically attaches the JWT Wristband to every request!)
// ============================================================================
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 1. Grab the saved JWT wristband from the browser's pocket (localStorage)
  const token = localStorage.getItem('token');

  // 2. Create a Map of HTTP Headers (just like HashMap<String, String> in Java!)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 3. If the user is logged in, add "Authorization: Bearer <token>" for JwtFilter.java!
  if (token != null) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'HTTP Error ' + res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ============================================================================
// 3. API METHODS (1-to-1 with UserController, ProblemController, SubmissionController, AiController)
// ============================================================================
export const api = {
  // -> UserController (/api/auth)
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (name: string, email: string) =>
    request<{ token: string; user: User }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: 'GOOGLE_OAUTH_USER' }),
    }),

  // -> ProblemController (/api/problems)
  getProblems: (params: { search?: string; difficulty?: string; tag?: string; userId?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.tag) query.set('tag', params.tag);
    if (params.userId) query.set('userId', String(params.userId));
    return request<ProblemItem[]>(`/api/problems?${query.toString()}`);
  },

  getProblem: (id: number) => request<Problem>(`/api/problems/${id}`),

  getProblemSubmissions: (problemId: number, userId: number) =>
    request<Submission[]>(`/api/problems/${problemId}/submissions?userId=${userId}`),

  createProblem: (problem: Problem) =>
    request<Problem>('/api/problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    }),

  deleteProblem: (id: number) =>
    request<void>(`/api/problems/${id}`, { method: 'DELETE' }),

  // -> SubmissionController (/api/submissions)
  runCode: (language: string, code: string, input: string) =>
    request<{ output: string; error: string; timeMs: number }>('/api/submissions/run', {
      method: 'POST',
      body: JSON.stringify({ language, code, input }),
    }),

  submitCode: (userId: number, problemId: number, language: string, code: string) =>
    request<Submission>('/api/submissions/submit', {
      method: 'POST',
      body: JSON.stringify({ userId, problemId, language, code }),
    }),

  // -> AiController (/api/ai)
  askAi: (mode: string, language: string, code: string, problem: string) =>
    request<{ reply: string }>('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ mode, language, code, problem }),
    }),
};

// ============================================================================
// 4. WEBSOCKET HELPER (Tunes the Walkie-Talkie to /topic/submissions/{id}!)
// ============================================================================
export function subscribeToSubmission(
  submissionId: number,
  onVerdict: (updated: Submission) => void
): () => void {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const brokerURL = `${protocol}//${window.location.host}/ws`;

  const client = new Client({
    brokerURL,
    onConnect: () => {
      // Tune into the exact STOMP channel that JudgeService broadcasts to!
      client.subscribe(`/topic/submissions/${submissionId}`, (message) => {
        const updated: Submission = JSON.parse(message.body);
        onVerdict(updated);
      });
    },
  });

  client.activate();
  return () => client.deactivate();
}

