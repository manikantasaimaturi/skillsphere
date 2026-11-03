# SkillSphere — Complete AI-Powered Student Learning, Coding & Placement Platform

> **Learn Concepts. Practice Skills. Build Projects. Get Placed.**  
> A comprehensive, full-stack educational and career-launch platform designed for Computer Science and Engineering students.

---

## 🌟 Key Modules Included

1. **Structured Course LMS**: 32 Computer Science courses across Programming Languages, Core CS, Web Development, AI/ML, Cloud, and System Design, with structured concept lessons and practice checks.
2. **Interactive Coding Compiler**: Monaco-based IDE supporting C, C++, Python, Java, JavaScript, TypeScript, Go, Rust, and SQL with real code execution, syntax highlighting, test cases, and custom input.
3. **Knowledge Assessment Center**: 550+ categorized MCQs with timer countdown, real-time scoring, explanations, and instant analytics.
4. **Placement Preparation Suite**: Company-specific hiring guides (Google, Microsoft, Amazon, TCS), interview questions, quantitative aptitude, and behavioral frameworks (STAR method).
5. **AI Technical Mentor**: Real-time contextual chat powered by Google Gemini 3.8 Flash SDK (`@google/genai`) with pre-built prompts for DSA, debugging, mock interviews, and system design.
6. **Student Dashboard & Analytics**: Dynamic metrics calculated from actual student activities: daily learning streaks, completion percentages, quiz histories, and weak-area identification.
7. **ATS Resume Builder**: 8 professional resume templates with live previews, Gemini AI bullet enhancer, and direct PDF download via jsPDF.
8. **Career Roadmaps & Project Hub**: Visual role trajectories and capstone project blueprints with architecture diagrams, API specs, and schemas.
9. **Admin CMS Console**: Manage courses, add MCQ questions, view registered students, and manage platform resources.

---

## 🚀 Quick Start / Local Execution Steps

### 1. Prerequisites
- **Node.js**: v22.12.0 or higher (required by the Vite 8 toolchain). Check with `node -v`
- **npm**: v9.0.0 or higher. Check with `npm -v`

### 2. Extract Archive
Extract the downloaded ZIP using Windows File Explorer (right-click the ZIP → Extract All), then open the extracted `skillsphere` folder in VS Code.

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the project root (you can copy `.env.example`):
```powershell
Copy-Item .env.example .env
```
Fill in the following variables:
```env
# Port for the full-stack server
PORT=3000

# Secret for signing JWT authentication tokens
JWT_SECRET=skillsphere-super-secret-jwt-key-2026

# Google Gemini API key (optional: enables live AI Mentor & Resume AI Enhancer)
# Obtain a free key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```
If the key is missing, the AI Mentor displays setup guidance instead of making a failing API request. The key must be a real Google AI Studio key; the example value is only a placeholder.

### 5. Start the Application
Run the unified full-stack development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Demo Seed Accounts

The platform comes pre-seeded with ready-to-use accounts and sample progress:

| Role | Email | Password |
|---|---|---|
| **Student** | `student@skillsphere.edu` | `StudentPassword123!` |
| **Admin** | `admin@skillsphere.edu` | `AdminPassword123!` |

You can also click **"Get Started"** on the landing page to register a new student account at any time.

---

## 🛠️ Project Architecture

```
├── server.ts                 # Express full-stack API server & Vite middleware
├── server/
│   ├── ai.ts                 # Gemini API integration & contextual prompts
│   ├── compiler.ts           # Multi-language code runner (Piston API + VM sandbox)
│   ├── db.ts                 # Atomic file-backed relational data layer
│   ├── types.ts              # Shared TypeScript definitions
│   └── data/
│       ├── database.json     # Initial database state
│       ├── coursesSeed.ts    # 32 complete Computer Science courses
│       ├── mcqsSeed.ts       # 550+ categorized MCQ questions
│       ├── companiesSeed.ts  # Placement recruitment patterns
│       └── roadmapsSeed.ts   # Career path guides
├── src/
│   ├── App.tsx               # Client routes & application layout
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind CSS & global styling
│   ├── context/
│   │   └── AuthContext.tsx   # JWT auth, user state & localStorage sync
│   ├── components/           # Navbar, Footer, Route guards, UI elements
│   └── pages/                # All 16 complete responsive application pages
├── package.json              # Dependencies and scripts
└── vite.config.ts            # Vite + Tailwind configuration
```

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```
The server will serve the pre-compiled production bundle from the `dist/` directory on port 3000.


## Run SkillSphere on Windows

1. Install Node.js 22 LTS (or a Vite 8 compatible Node.js release).
2. Extract the ZIP and open the `skillsphere` folder in VS Code.
3. In the project-root terminal, run `npm install`. If npm reports blocked install scripts, approve the required build scripts with `npm install-scripts approve esbuild protobufjs core-js`, then run `npm install` again.
4. Copy `.env.example` to `.env`. In PowerShell use `Copy-Item .env.example .env`.
5. Create a Gemini API key at https://aistudio.google.com/apikey and put it in `.env` as `GEMINI_API_KEY=your_actual_key`. Do not use the placeholder from `.env.example`.
6. Keep `GEMINI_MODEL=gemini-3.8-flash` in `.env` unless you intentionally select another model available to your key.
7. Run `npm run dev` and open http://localhost:3000.

The real `.env` file is intentionally excluded from this ZIP. Never upload it to GitHub or share your API key. You can check whether the server sees a non-placeholder key by opening http://localhost:3000/api/ai/status; this endpoint never returns the key itself. A `configured: true` result only confirms that a key is present, not that Google has accepted it.
