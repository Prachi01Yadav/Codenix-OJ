# 🧠 Codenix OJ (AlgoU Online Judge)

**Codenix OJ** is a full-stack, web-based code compilation and competitive programming platform. It allows users to write, execute, and review code in real-time across multiple languages (C++, Java, Python, JavaScript, Go, Rust). The platform features a sleek, modern code-editor UI, a robust execution backend, and **AI-powered code review** using Google's Gemini AI.

Built as a competitive-programming judge, it demonstrates a production-style microservice architecture: a React frontend, a Spring Boot API gateway, a Node.js execution service, PostgreSQL for persistence, Redis for caching, and Gemini AI for intelligent feedback.

---

## 🚀 Live Demo

| Service | URL | Notes |
|---|---|---|
| 🌐 **Frontend (App)** | [http://13.210.108.80](http://13.210.108.80) | Main app — editor, run, and AI review UI |
| ⚙️ **Backend API** | `http://13.210.108.80/api/**` | Spring Boot REST API |
| ▶️ **Execution Service** | Internal (Port 5000) | Sandboxed code-execution microservice |

---

## 🏗️ High Level Design (HLD)

The architecture follows a standard microservices pattern, orchestrated via Docker Compose and deployed on AWS EC2.

```mermaid
graph TD
    Client[Browser (React + Monaco Editor)]
    Nginx[Nginx Reverse Proxy\nPort 80]
    
    Backend[Spring Boot API Gateway\n(Auth, Submissions, AI Proxy)]
    Execution[Node.js Execution Engine\n(Multi-lang Compiler & Runner)]
    
    DB[(PostgreSQL\nUsers, Problems, TestCases)]
    Redis[(Redis\nRate Limiting & Caching)]
    Gemini[Google Gemini API]

    Client -- HTTP / WebSockets --> Nginx
    Nginx -- /api/ --> Backend
    Nginx -- Static Assets --> Frontend[React SPA]
    
    Backend -- REST --> Execution
    Backend -- REST --> Gemini
    Backend -- JDBC --> DB
    Backend -- TCP --> Redis
```

👉 **[View the full High-Level Design (HLD) Document here](./HLD.md)** 👈

---

## 📅 Project Phases & Features

### ✅ Phase 1: Core Foundation & UI (Implemented)
- **🖊️ Code Editor:** Integrated Monaco Editor (VS Code engine) with syntax highlighting, auto-indentation, and multi-language support.
- **⚡ Basic Code Execution:** Established the execution engine to compile and run C++, Java, Python, JavaScript, Go, and Rust.
- **⌨️ Custom Input:** Added support for users to pass their own `stdin` to test edge cases.
- **📱 Responsive Design:** Built a polished UI with Tailwind CSS that works seamlessly across devices.

### ✅ Phase 2: AI Integration & Backend Hardening (Implemented)
- **🤖 AI Code Review:** Integrated with **Google Gemini AI** to provide instant, contextual feedback on code quality, time/space complexity, and optimizations.
- **🔌 Real-Time Feedback (WebSockets):** Implemented STOMP/WebSockets for live streaming of submission statuses (e.g., "Compiling" → "Running" → "Accepted/Wrong Answer").
- **🔐 Authentication:** Full JWT-based authentication flow with user accounts and securely hashed passwords.
- **🗄️ Database & Problems:** Created a persistent PostgreSQL schema for problems and test cases. The platform automatically evaluates code against hidden test cases.
- **🚀 Production Deployment:** Deployed on AWS EC2 using Docker Compose, with Nginx reverse proxying to fix CORS and routing issues.

### 🚧 Phase 3: Future Roadmap (Expected Features)
- **🔒 True Ephemeral Sandboxing:** Transition the execution engine from running processes on the host container to spawning isolated, ephemeral Docker containers (`--network none`) per submission for robust security.
- **🛡️ Resource Quotas:** Enforce strict CPU and memory limits (cgroups) on user code to prevent Fork Bombs and memory leaks.
- **👑 Admin Portal:** A dedicated management dashboard for administrators to add/edit problems, test cases, and manage users.
- **🏆 Leaderboards & Arenas:** Add a competitive aspect with real-time contest rankings and user Elo ratings.
- **🌐 Custom Domain & SSL:** Configure Let's Encrypt for HTTPS and attach a formal custom domain.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), TypeScript, Monaco Editor, Tailwind CSS, shadcn/ui |
| **Backend** | Java 21, Spring Boot (REST, WebSockets, Security/JWT) |
| **Code Execution** | Node.js microservice |
| **AI Review** | Google Gemini API |
| **Database** | PostgreSQL |
| **Cache / Security** | Redis (Rate Limiting) |
| **Deployment** | AWS EC2 (Ubuntu), Docker Compose, Nginx |

---

## ☁️ Deployment Instructions

### Run it locally

```bash
# 1. Clone the repo
git clone https://github.com/Prachi01Yadav/Codenix-OJ.git
cd Codenix-OJ

# 2. Add environment variables
#    Create a .env file (NOT committed) in the root directory with:
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret

# 3. Build and run everything with Docker Compose
docker compose up --build -d
```
The application will be available at `http://localhost`.

---

## 🤝 Contributing

Suggestions, issues, and PRs are welcome:
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👩‍💻 Author

**Prachi Yadav**  
GitHub: [@Prachi01Yadav](https://github.com/Prachi01Yadav)
