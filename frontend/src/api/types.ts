// ============================================================
// TypeScript interfaces matching Spring Boot DTOs
// Java types -> TS: Long -> number, String -> string,
// LocalDateTime -> string (ISO-8601), Boolean -> boolean
// ============================================================

// ---- Auth ----
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  handle: string;
}

export interface AuthResponseDTO {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: UserDTO;
}

export interface UserDTO {
  id: number;
  email: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  rating: number;
  maxRating: number;
  rank: string;
  solvedCount: number;
  submissionCount: number;
  createdAt: string;
}

// ---- Problems ----
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ProblemStatus = 'SOLVED' | 'ATTEMPTED' | 'UNSOLVED';

export interface ProblemDTO {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  status: ProblemStatus;
}

export interface ProblemListResponseDTO {
  content: ProblemDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ProblemFilterDTO {
  difficulty?: Difficulty;
  status?: ProblemStatus;
  tags?: string[];
  search?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface ProblemDetailDTO {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  timeLimit: number;
  memoryLimit: number;
  sampleTestCases: TestCaseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseDTO {
  id: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  explanation: string | null;
}

// ---- Submissions ----
export type Verdict =
  | 'PENDING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'MEMORY_LIMIT_EXCEEDED';

export type Language = 'CPP' | 'JAVA' | 'PYTHON' | 'JAVASCRIPT' | 'GO' | 'RUST';

export interface SubmissionRequestDTO {
  problemId: number;
  language: Language;
  code: string;
}

export interface RunRequestDTO {
  problemId: number;
  language: Language;
  code: string;
  customInput?: string;
}

export interface SubmissionResultDTO {
  id: number;
  problemId: number;
  verdict: Verdict;
  language: Language;
  executionTime: number;
  memoryUsed: number;
  passedTestCases: number;
  totalTestCases: number;
  errorMessage: string | null;
  testCaseResults: TestCaseResultDTO[];
  submittedAt: string;
}

export interface TestCaseResultDTO {
  testCaseId: number;
  verdict: Verdict;
  executionTime: number;
  memoryUsed: number;
  output: string;
  expectedOutput: string;
  passed: boolean;
}

export interface RunResultDTO {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
  exitCode: number;
}

export interface SubmissionDTO {
  id: number;
  problemId: number;
  problemTitle: string;
  verdict: Verdict;
  language: Language;
  executionTime: number;
  memoryUsed: number;
  submittedAt: string;
}

// ---- Leaderboard ----
export interface LeaderboardEntryDTO {
  rank: number;
  userId: number;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  rating: number;
  solvedCount: number;
}
