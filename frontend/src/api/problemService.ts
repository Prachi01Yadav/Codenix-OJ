import axiosInstance from './axiosInstance';
import type {
  ProblemDTO,
  ProblemListResponseDTO,
  ProblemFilterDTO,
  ProblemDetailDTO,
  Difficulty,
  ProblemStatus,
} from './types';

export const problemService = {
  async getProblems(filter: ProblemFilterDTO): Promise<ProblemListResponseDTO> {
    try {
      const params: Record<string, string | number> = {
        page: filter.page,
        size: filter.size,
        sortBy: filter.sortBy || 'id',
        sortDir: filter.sortDir || 'asc',
      };
      if (filter.difficulty) params.difficulty = filter.difficulty;
      if (filter.search) params.search = filter.search;
      if (filter.tags && filter.tags.length > 0) params.tag = filter.tags[0];

      const response = await axiosInstance.get('/problems', { params });
      const data = response.data;

      // Map Spring Page response to our DTO format
      return {
        content: (data.content || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          difficulty: p.difficulty as Difficulty,
          tags: p.tags || [],
          acceptanceRate: p.acceptanceRate || 0,
          totalSubmissions: p.totalSubmissions || 0,
          acceptedSubmissions: p.acceptedSubmissions || 0,
          status: (p.status || 'UNSOLVED') as ProblemStatus,
        })),
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 1,
        size: data.size || filter.size,
        number: data.number || filter.page,
        first: data.first ?? true,
        last: data.last ?? true,
      };
    } catch (error) {
      console.error('Failed to fetch problems, using fallback:', error);
      return fallbackGetProblems(filter);
    }
  },

  async getProblemById(id: number): Promise<ProblemDetailDTO> {
    try {
      const response = await axiosInstance.get(`/problems/${id}`);
      return mapProblemDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch problem detail, using fallback:', error);
      return fallbackDetail(id);
    }
  },

  async getProblemBySlug(slug: string): Promise<ProblemDetailDTO> {
    try {
      const response = await axiosInstance.get(`/problems/slug/${slug}`);
      return mapProblemDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch problem by slug, using fallback:', error);
      return fallbackDetail(1);
    }
  },

  async getAllTags(): Promise<string[]> {
    return ALL_TAGS;
  },

  async getDifficultyStats(): Promise<Record<Difficulty, number>> {
    try {
      const response = await axiosInstance.get('/problems', { params: { page: 0, size: 1000 } });
      const problems = response.data.content || [];
      return {
        EASY: problems.filter((p: any) => p.difficulty === 'EASY').length,
        MEDIUM: problems.filter((p: any) => p.difficulty === 'MEDIUM').length,
        HARD: problems.filter((p: any) => p.difficulty === 'HARD').length,
      };
    } catch {
      return { EASY: 5, MEDIUM: 13, HARD: 7 };
    }
  },
};

function mapProblemDetail(data: any): ProblemDetailDTO {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    difficulty: data.difficulty,
    tags: data.tags || [],
    description: data.description || data.statement || '',
    inputFormat: data.inputFormat || '',
    outputFormat: data.outputFormat || '',
    constraints: data.constraints || '',
    timeLimit: data.timeLimit || data.timeLimitMs || 1000,
    memoryLimit: data.memoryLimit || data.memoryLimitMb || 256,
    sampleTestCases: (data.sampleTestCases || []).map((tc: any) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isSample: tc.isSample ?? tc.sample ?? true,
      explanation: tc.explanation || null,
    })),
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  };
}

// =====================================================
// Fallback mock data (used when backend is offline)
// =====================================================

const allProblems: ProblemDTO[] = [
  { id: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'EASY', tags: ['Arrays', 'Hashing'], acceptanceRate: 89.2, totalSubmissions: 482000, acceptedSubmissions: 429000, status: 'UNSOLVED' },
  { id: 2, title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'MEDIUM', tags: ['Linked Lists', 'Math'], acceptanceRate: 41.8, totalSubmissions: 312000, acceptedSubmissions: 130000, status: 'UNSOLVED' },
  { id: 3, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring', difficulty: 'MEDIUM', tags: ['Strings', 'Sliding Window'], acceptanceRate: 34.5, totalSubmissions: 298000, acceptedSubmissions: 102000, status: 'UNSOLVED' },
  { id: 4, title: 'Median of Two Sorted Arrays', slug: 'median-two-sorted-arrays', difficulty: 'HARD', tags: ['Arrays', 'Binary Search'], acceptanceRate: 36.1, totalSubmissions: 189000, acceptedSubmissions: 68000, status: 'UNSOLVED' },
  { id: 5, title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'MEDIUM', tags: ['Strings', 'DP'], acceptanceRate: 31.2, totalSubmissions: 256000, acceptedSubmissions: 79000, status: 'UNSOLVED' },
  { id: 6, title: 'Regular Expression Matching', slug: 'regex-matching', difficulty: 'HARD', tags: ['Strings', 'DP'], acceptanceRate: 27.4, totalSubmissions: 145000, acceptedSubmissions: 39000, status: 'UNSOLVED' },
  { id: 7, title: 'Container With Most Water', slug: 'container-water', difficulty: 'MEDIUM', tags: ['Arrays', 'Two Pointers'], acceptanceRate: 54.3, totalSubmissions: 201000, acceptedSubmissions: 109000, status: 'UNSOLVED' },
  { id: 8, title: 'Three Sum', slug: 'three-sum', difficulty: 'MEDIUM', tags: ['Arrays', 'Two Pointers'], acceptanceRate: 35.2, totalSubmissions: 278000, acceptedSubmissions: 97000, status: 'UNSOLVED' },
  { id: 9, title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'EASY', tags: ['Stacks', 'Strings'], acceptanceRate: 40.1, totalSubmissions: 389000, acceptedSubmissions: 156000, status: 'UNSOLVED' },
  { id: 10, title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'HARD', tags: ['Linked Lists', 'Heaps'], acceptanceRate: 52.1, totalSubmissions: 167000, acceptedSubmissions: 87000, status: 'UNSOLVED' },
  { id: 11, title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'HARD', tags: ['Arrays', 'Two Pointers', 'DP'], acceptanceRate: 58.7, totalSubmissions: 198000, acceptedSubmissions: 116000, status: 'UNSOLVED' },
  { id: 12, title: 'Word Break', slug: 'word-break', difficulty: 'MEDIUM', tags: ['DP', 'Strings'], acceptanceRate: 47.3, totalSubmissions: 178000, acceptedSubmissions: 84000, status: 'UNSOLVED' },
  { id: 13, title: 'Binary Tree Inorder Traversal', slug: 'binary-tree-inorder', difficulty: 'EASY', tags: ['Trees', 'DFS'], acceptanceRate: 74.2, totalSubmissions: 256000, acceptedSubmissions: 189000, status: 'UNSOLVED' },
  { id: 14, title: 'Course Schedule', slug: 'course-schedule', difficulty: 'MEDIUM', tags: ['Graphs', 'BFS', 'DFS'], acceptanceRate: 42.8, totalSubmissions: 234000, acceptedSubmissions: 100000, status: 'UNSOLVED' },
  { id: 15, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'MEDIUM', tags: ['Graphs', 'DFS', 'BFS'], acceptanceRate: 57.4, totalSubmissions: 312000, acceptedSubmissions: 179000, status: 'UNSOLVED' },
  { id: 16, title: 'Longest Increasing Path in Matrix', slug: 'longest-increasing-path', difficulty: 'HARD', tags: ['DP', 'Graphs', 'DFS'], acceptanceRate: 52.1, totalSubmissions: 98000, acceptedSubmissions: 51000, status: 'UNSOLVED' },
  { id: 17, title: 'Coin Change', slug: 'coin-change', difficulty: 'MEDIUM', tags: ['DP'], acceptanceRate: 38.7, totalSubmissions: 187000, acceptedSubmissions: 72000, status: 'UNSOLVED' },
  { id: 18, title: 'Edit Distance', slug: 'edit-distance', difficulty: 'HARD', tags: ['DP', 'Strings'], acceptanceRate: 48.2, totalSubmissions: 134000, acceptedSubmissions: 64000, status: 'UNSOLVED' },
  { id: 19, title: 'Kth Largest Element in Array', slug: 'kth-largest-element', difficulty: 'MEDIUM', tags: ['Heaps', 'Arrays'], acceptanceRate: 67.1, totalSubmissions: 201000, acceptedSubmissions: 134000, status: 'UNSOLVED' },
  { id: 20, title: 'Valid Sudoku', slug: 'valid-sudoku', difficulty: 'MEDIUM', tags: ['Arrays', 'Hashing'], acceptanceRate: 56.3, totalSubmissions: 167000, acceptedSubmissions: 94000, status: 'UNSOLVED' },
  { id: 21, title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'EASY', tags: ['Linked Lists'], acceptanceRate: 75.8, totalSubmissions: 298000, acceptedSubmissions: 226000, status: 'UNSOLVED' },
  { id: 22, title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'MEDIUM', tags: ['Arrays', 'DP'], acceptanceRate: 50.4, totalSubmissions: 245000, acceptedSubmissions: 123000, status: 'UNSOLVED' },
  { id: 23, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'EASY', tags: ['DP', 'Math'], acceptanceRate: 51.2, totalSubmissions: 312000, acceptedSubmissions: 159000, status: 'UNSOLVED' },
  { id: 24, title: 'Word Search II', slug: 'word-search-ii', difficulty: 'HARD', tags: ['Trie', 'DFS', 'Arrays'], acceptanceRate: 35.8, totalSubmissions: 89000, acceptedSubmissions: 31000, status: 'UNSOLVED' },
  { id: 25, title: 'LRU Cache', slug: 'lru-cache', difficulty: 'MEDIUM', tags: ['Design', 'Hashing', 'Linked Lists'], acceptanceRate: 43.1, totalSubmissions: 267000, acceptedSubmissions: 115000, status: 'UNSOLVED' },
];

function fallbackGetProblems(filter: ProblemFilterDTO): ProblemListResponseDTO {
  let filtered = [...allProblems];
  if (filter.difficulty) filtered = filtered.filter((p) => p.difficulty === filter.difficulty);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
  }
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / filter.size) || 1;
  const start = filter.page * filter.size;
  const content = filtered.slice(start, start + filter.size);
  return { content, totalElements, totalPages, size: filter.size, number: filter.page, first: filter.page === 0, last: filter.page >= totalPages - 1 };
}

function fallbackDetail(id: number): ProblemDetailDTO {
  const problem = allProblems.find((p) => p.id === id) || allProblems[0];
  return {
    id: problem.id, title: problem.title, slug: problem.slug, difficulty: problem.difficulty, tags: problem.tags,
    description: `Solve the "${problem.title}" problem. (Detailed description unavailable in offline mode.)`,
    inputFormat: 'See problem statement.',
    outputFormat: 'See problem statement.',
    constraints: 'See problem statement.',
    timeLimit: 1000, memoryLimit: 256,
    sampleTestCases: [
      { id: 1, input: 'Sample input', expectedOutput: 'Sample output', isSample: true, explanation: null },
    ],
    createdAt: '', updatedAt: '',
  };
}

export const ALL_TAGS: string[] = [
  'Arrays', 'Strings', 'Hashing', 'DP', 'Graphs', 'Trees',
  'Linked Lists', 'Two Pointers', 'Binary Search', 'Stacks',
  'Heaps', 'Trie', 'DFS', 'BFS', 'Sliding Window', 'Math', 'Design',
];

export const STATUS_OPTIONS: { value: ProblemStatus; label: string }[] = [
  { value: 'SOLVED', label: 'Solved' },
  { value: 'ATTEMPTED', label: 'Attempted' },
  { value: 'UNSOLVED', label: 'Unsolved' },
];
