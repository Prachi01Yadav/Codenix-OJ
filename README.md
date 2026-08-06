# AlgoU Online Judge

AlgoU Online Judge is a web-based code compilation and judging platform that lets users write, execute, and review C++ code in real time. It combines a clean code-editor UI with a sandboxed execution backend and AI-powered code review using Google's Gemini AI.


## Features

- **Code Editor** — Write and edit C++ code with syntax highlighting (Monaco Editor)
- **Real-time Execution** — Compile and run code directly from the browser via a backend judge service
- **Custom Input** — Provide custom stdin for your code
- **AI Code Review** — Get instant feedback/suggestions using Google's Gemini AI
- **Responsive Design** — Works across desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + TypeScript, Monaco Editor, Tailwind CSS |
| Backend | Java (Spring Boot) |
| Code Execution | Dockerized sandbox ` |
| AI Review | Google Gemini API |
| Database | PostgreSQL (submissions, users, problems ) |
| Deployment | Docker Compose → cloud (AWS/GCP/Render) |

## Project Roadmap (High Level)

1. **Frontend (Step 1)** — Static UI: editor, input/output panels, Run & AI Review buttons, mocked responses. *(current step)*
2. **Backend skeleton** — Java Spring Boot REST API with `/compile` and `/review` stub endpoints.
3. **Code execution engine** — Dockerized, sandboxed C++ compiler service invoked by backend.
4. **Gemini AI integration** — Real AI code review wired into `/review`.
5. **Frontend ↔ backend integration** — Replace mocks with real API calls.
6. **features** — Problems, test cases, verdicts (AC/WA/TLE/RE), submission history, auth.
7. **Deployment ** — Rate limiting, sandboxing hardening, monitoring, CI/CD.

