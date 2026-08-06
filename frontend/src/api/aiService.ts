import axiosInstance from './axiosInstance';

export interface AiRequest {
  code: string;
  language: string;
  problemTitle?: string;
  problemDescription?: string;
  errorMessage?: string;
  hintLevel?: number;
}

export interface AiResponse {
  result: string;
}

// AI requests can take 15-30s since they call Gemini API
const aiAxios = (url: string, req: AiRequest) =>
  axiosInstance.post<AiResponse>(url, req, { timeout: 60000 }).then((r) => r.data);

export const aiService = {
  explain: (req: AiRequest) => aiAxios('/ai/explain', req),
  review: (req: AiRequest) => aiAxios('/ai/review', req),
  debug: (req: AiRequest) => aiAxios('/ai/debug', req),
  complexity: (req: AiRequest) => aiAxios('/ai/complexity', req),
  hint: (req: AiRequest) => aiAxios('/ai/hint', req),
};

