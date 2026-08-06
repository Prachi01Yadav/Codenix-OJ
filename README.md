# 🧠 AlgoU Online Judge (Codenix-OJ)

**AlgoU Online Judge** is a full-stack, web-based code compilation and judging platform that lets users write, execute, and review **C++ code in real time**. It combines a clean, modern code-editor UI with a sandboxed execution backend and **AI-powered code review** using Google's Gemini AI.

Built as a mini competitive-programming judge (à la Codeforces / LeetCode), it demonstrates a production-style microservice architecture: a React frontend, a Spring Boot API gateway, a Dockerized sandboxed execution service, PostgreSQL for persistence, Redis for caching/rate-limiting, and Gemini AI for intelligent feedback — all containerized with Docker Compose and deployed on AWS EC2.

---

## 🚀 Live Demo

| Service | URL | Notes |
|---|---|---|
| 🌐 **Frontend (App)** | [http://13.210.108.80](http://13.210.108.80) | Main app — editor, run, and AI review UI |
| ⚙️ **Backend API** | `http://13.210.108.80:8080` | Spring Boot REST API (`/api/**` routes) |
| ▶️ **Execution Service** | `http://13.210.108.80:5000` | Sandboxed code-execution microservice |

> ⚠️ **Note:** This is a live personal AWS EC2 deployment using a static-for-now public IP, running over **HTTP** (no domain/SSL yet). If the instance is stopped/restarted without an Elastic IP, the address may change — check this section for the latest link. A custom domain + HTTPS (via Nginx + Let's Encrypt) is on the roadmap.

---

## 📸 What It Does

1. Write C++ code in an in-browser editor with full syntax highlighting.
2. Provide custom input (stdin) for your program.
3. Hit **Run** → code is sent to a sandboxed Docker-based compiler service, compiled, executed, and the output/errors are streamed back.
4. Hit **AI Review** → your code is sent to **Google's Gemini API**, which returns suggestions, complexity analysis, and improvement tips.
5. (Roadmap) Solve structured problems with test cases and get an automatic verdict — **AC / WA / TLE / RE** — just like a real online judge.

---

## ✨ Features

- **🖊️ Code Editor** — Monaco Editor (the engine behind VS Code) with C++ syntax highlighting, auto-indentation, and a familiar IDE feel.
- **⚡ Real-Time Execution** — Code is compiled and run on-demand through a backend judge service; results are returned directly to the browser.
- **⌨️ Custom Input Support** — Pass your own stdin to test edge cases, exactly like a real judge.
- **🤖 AI Code Review** — Integrated with **Google Gemini AI** to give instant, contextual feedback on code quality, logic, and possible optimizations.
- **📱 Responsive Design** — Built with Tailwind CSS; works cleanly across desktop, tablet, and mobile.
- **🔐 Auth-Ready Architecture** — JWT-based authentication scaffolding (`JwtAuthFilter`, `JwtService`, `AuthController`) already wired into the backend for user accounts.
- **🗄️ Persistent Storage** — PostgreSQL schema for `users`, `problems`, `submissions`, and `test_cases`.
- **🚦 Rate Limiting** — Redis-backed `RateLimitInterceptor` to protect the execution service from abuse.
- **🔌 Real-Time Feedback (WebSockets)** — `WebSocketConfig` + `wsService.ts` for live submission status updates (e.g., "Running" → "Compiling" → "Verdict").
- **📦 Fully Containerized** — Every service (frontend, backend, execution engine, DB, cache) runs in its own Docker container, orchestrated via `docker-compose.yml`.

---

## 🏗️ Architecture

```
                        ┌─────────────────────────┐
                        │        Browser          │
                        │  (React + Monaco Editor) │
                        └────────────┬────────────┘
                                     │ HTTP / WebSocket
                                     ▼
                        ┌─────────────────────────┐
                        │   Frontend (Nginx)       │
                        │   React + Vite + TS      │  Port 80
                        └────────────┬────────────┘
                                     │ REST API calls
                                     ▼
                        ┌─────────────────────────┐
                        │  Backend API Gateway     │
                        │  Java Spring Boot        │  Port 8080
                        │  Auth · Problems ·       │
                        │  Submissions · AI Proxy  │
                        └──────┬───────────┬───────┘
                               │           │
                 ┌─────────────┘           └─────────────┐
                 ▼                                        ▼
     ┌───────────────────────┐               ┌─────────────────────────┐
     │  Execution Service     │              │   Google Gemini API     │
     │  Node.js + Docker      │              │   (AI Code Review)      │
     │  Sandboxed C++ Compile │              │                          │
     │  Port 5000             │              └─────────────────────────┘
     └───────────────────────┘
                 │
     ┌───────────┴───────────┐
     ▼                       ▼
┌──────────┐          ┌──────────┐
│PostgreSQL│          │  Redis   │
│ (data)   │          │ (cache/  │
│Port 5432 │          │rate-lim.)│
│          │          │Port 6379 │
└──────────┘          └──────────┘
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite) + TypeScript, Monaco Editor, Tailwind CSS, shadcn/ui |
| **Backend** | Java 17+, Spring Boot (REST, WebSocket, Security/JWT) |
| **Code Execution** | Node.js microservice + Dockerized, sandboxed C++ compiler |
| **AI Review** | Google Gemini API |
| **Database** | PostgreSQL (`users`, `problems`, `submissions`, `test_cases`) |
| **Cache / Rate Limiting** | Redis |
| **Containerization** | Docker & Docker Compose |
| **Deployment** | AWS EC2 (Ubuntu), Docker Compose orchestration |

---

## 📁 Project Structure

```
Codenix-OJ/
├── backend/
│   ├── api-service/                  # Spring Boot REST API
│   │   ├── src/main/java/com/algou/api/
│   │   │   ├── controller/           # AuthController, ProblemController,
│   │   │   │                         # SubmissionController, CompileController,
│   │   │   │                         # AiController, ReviewController
│   │   │   ├── service/              # AuthService, ProblemService,
│   │   │   │                         # SubmissionService, AiService,
│   │   │   │                         # CodeExecutionService, AiReviewService
│   │   │   ├── entity/               # User, Problem, Submission, TestCase,
│   │   │   │                         # Role, Difficulty, Verdict, Language
│   │   │   ├── repository/           # Spring Data JPA repositories
│   │   │   ├── security/             # JwtAuthFilter, JwtService
│   │   │   ├── config/               # CORS, WebSocket, Redis, Rate Limiting
│   │   │   ├── dto/                  # Request/response DTOs
│   │   │   └── exception/            # Global exception handling
│   │   ├── src/test/                 # Unit tests (AuthServiceTest, etc.)
│   │   ├── Dockerfile
│   │   └── pom.xml
│   │
│   └── execution-service/            # Sandboxed code execution microservice
│       ├── index.js
│       ├── package.json
│       └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── workspace/            # EditorPane, ConsolePane, ProblemPane,
│   │   │   │                         # AiPanel, WorkspacePage
│   │   │   ├── dashboard/            # DashboardNavbar, ProblemsetDashboard
│   │   │   ├── landing/              # Hero, Navbar, Footer, BentoGrid, Marquee
│   │   │   ├── auth/                 # AuthModal
│   │   │   ├── effects/              # AuroraBackground, CursorTrail, MagneticButton
│   │   │   └── ui/                   # shadcn/ui component library
│   │   ├── api/                      # axiosInstance, authService, problemService,
│   │   │                             # submissionService, aiService, wsService
│   │   ├── store/                    # authStore, cursorStore (Zustand)
│   │   └── hooks/
│   ├── nginx.conf                    # Nginx config for serving the built SPA
│   └── Dockerfile
│
├── docker-compose.yml                # Orchestrates all services
└── README.md
```

---

## 🔌 Core API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/problems` | List all problems |
| `GET` | `/api/problems/{id}` | Get a single problem's details |
| `POST` | `/api/compile` | Compile & run code with custom input |
| `POST` | `/api/submissions` | Submit a solution for judging |
| `GET` | `/api/submissions/{id}` | Get submission result / verdict |
| `POST` | `/api/review` | Send code to Gemini AI for review |

> Exact paths may evolve as the roadmap progresses — check the controller classes under `backend/api-service/.../controller/` for the source of truth.

---

## 🗺️ Project Roadmap

- [x] **Step 1 — Frontend Scaffold:** Static UI — editor, input/output panels, Run & AI Review buttons, mocked responses
- [x] **Step 2 — Backend Skeleton:** Java Spring Boot REST API with `/compile` and `/review` stub endpoints
- [x] **Step 3 — Code Execution Engine:** Dockerized, sandboxed C++ compiler service invoked by the backend
- [x] **Step 4 — Gemini AI Integration:** Real AI code review wired into `/review`
- [x] **Step 5 — Frontend ↔ Backend Integration:** Replaced mocks with real API calls
- [ ] **Step 6 — Online-Judge Features:** Structured problems, test cases, verdicts (AC/WA/TLE/RE), submission history, full auth flow
- [ ] **Step 7 — Production Hardening:** Rate limiting refinements, sandbox hardening, monitoring, CI/CD, custom domain + HTTPS

---

## ☁️ Deployment

The project is deployed on an **AWS EC2** instance (Ubuntu, `ap-southeast-2` / Sydney region) using **Docker Compose** to run all services together:

- `frontend` — Nginx serving the built React app → **port 80**
- `api-service` — Spring Boot backend → **port 8080**
- `execution-service` — Node.js sandboxed execution engine → **port 5000**
- `postgres` — Database → **port 5432**
- `redis` — Cache / rate limiting → **port 6379**

EC2 Security Group inbound rules are configured to allow public HTTP/HTTPS/SSH traffic and the application's custom ports.

### Run it locally

```bash
# 1. Clone the repo
git clone https://github.com/Prachi01Yadav/Codenix-OJ.git
cd Codenix-OJ

# 2. Add environment variables
#    Create a .env file (NOT committed — see .gitignore) with:
#    GEMINI_API_KEY=your_key_here
#    DB_URL=jdbc:postgresql://postgres:5432/algou
#    DB_USER=your_db_user
#    DB_PASSWORD=your_db_password
#    JWT_SECRET=your_jwt_secret

# 3. Build and run everything with Docker Compose
docker-compose up --build

# Frontend → http://localhost:80
# Backend  → http://localhost:8080
# Execution service → http://localhost:5000
```

---

## 🔒 Security Notes

- Secrets (API keys, DB credentials, JWT secret) are managed via a local `.env` file, which is **git-ignored** and never committed.
- Code execution happens inside an **isolated Docker sandbox**, separate from the main API container, to contain untrusted user code.
- `RateLimitInterceptor` (Redis-backed) protects the compile/execution endpoints from abuse.
- Database (`5432`) and Redis (`6379`) ports are exposed for development convenience on the current deployment — **production hardening** (restricting these to internal-only access) is tracked in the roadmap.

---

## 🤝 Contributing

This is currently a personal/academic project, but suggestions, issues, and PRs are welcome:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project currently has no formal license attached. All rights reserved by the author unless stated otherwise.

---

## 👩‍💻 Author

**Prachi Yadav**
GitHub: [@Prachi01Yadav](https://github.com/Prachi01Yadav)
