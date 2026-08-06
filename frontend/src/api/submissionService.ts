import axiosInstance from './axiosInstance';
import { wsService } from './wsService';
import type {
  SubmissionRequestDTO,
  SubmissionResultDTO,
  RunRequestDTO,
  RunResultDTO,
  SubmissionDTO,
} from './types';

export const submissionService = {
  async submit(data: SubmissionRequestDTO): Promise<SubmissionResultDTO> {
    try {
      const response = await axiosInstance.post('/submissions/submit', data);
      const result: SubmissionResultDTO = response.data;
      if (result.verdict === 'PENDING' && result.id) {
        return await wsService.waitForSubmission(result.id);
      }
      return result;
    } catch (error: any) {
      console.error('Submit failed:', error);
      // Return error result
      return {
        id: 0,
        problemId: data.problemId,
        verdict: 'COMPILATION_ERROR',
        language: data.language,
        executionTime: 0,
        memoryUsed: 0,
        passedTestCases: 0,
        totalTestCases: 0,
        errorMessage: error.response?.data?.error || error.message || 'Submission failed',
        testCaseResults: [],
        submittedAt: new Date().toISOString(),
      };
    }
  },

  async run(data: RunRequestDTO): Promise<RunResultDTO> {
    try {
      const response = await axiosInstance.post('/submissions/run', data);
      return response.data;
    } catch (error: any) {
      console.error('Run failed:', error);
      return {
        success: false,
        output: '',
        error: error.response?.data?.error || error.message || 'Execution failed. Is the backend running?',
        executionTime: 0,
        exitCode: 1,
      };
    }
  },

  async getSubmissions(problemId: number): Promise<SubmissionDTO[]> {
    try {
      const response = await axiosInstance.get(`/submissions/problem/${problemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      return [];
    }
  },

  async getUserSubmissions(): Promise<SubmissionDTO[]> {
    try {
      const response = await axiosInstance.get('/submissions/me', {
        params: { page: 0, size: 50 },
      });
      return response.data.content || [];
    } catch (error) {
      console.error('Failed to fetch user submissions:', error);
      return [];
    }
  },
};
