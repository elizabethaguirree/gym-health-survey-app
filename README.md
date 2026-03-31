# Health & Habits Survey

## Description

Health & Habits is a full-stack anonymous survey web application that collects gym attendance patterns, fitness goals, dietary habits, workout preferences, and personal motivations from users. After completing the 7-question survey, respondents receive a personalized feedback page with tailored insights based on their answers. The app is built for health and fitness courses, research projects, or anyone who wants to gather anonymous self-reported wellbeing data without requiring user accounts.

## Badges

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## Features

- **Fully anonymous** — no login, no email, no personally identifiable information collected
- **7-question adaptive survey** — mix of radio buttons, a dropdown selector, checkboxes, and free-text inputs
- **Personalised results page** — tailored feedback cards generated from the user's answers on gym frequency, fitness goal, and motivations
- **Supabase-backed persistence** — every submission is stored in a cloud PostgreSQL database via Supabase
- **Real-time form validation** — client-side Zod schema validation with inline error messages before any network request is made
- **Clean, minimal design** — modern card-based layout built with shadcn/ui components and Tailwind CSS
- **Type-safe API layer** — OpenAPI spec drives auto-generated React Query hooks and Zod schemas used by both the frontend and backend
- **Retake-friendly** — users can navigate back to the survey and submit again at any time

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend UI library |
| Vite 7 | Frontend dev server and bundler |
| TypeScript 5.9 | Type safety across the full stack |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui (Radix UI) | Accessible, unstyled UI primitives |
| react-hook-form | Performant form state management |
| Zod | Schema validation on client and server |
| wouter | Lightweight client-side routing |
| TanStack React Query | Async data fetching and mutations |
| Express 5 | Backend HTTP API server |
| Supabase | Hosted PostgreSQL database and client |
| Orval | OpenAPI → React Query hooks + Zod schema codegen |
| pnpm workspaces | Monorepo package management |
| esbuild | API server production bundler |

## Getting Started

### Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/installation)
- A [Supabase](https://supabase.com/) project with the `survey_responses` table created (SQL below)

### Supabase Table Setup

Run this in your Supabase SQL Editor before starting the app:

```sql
create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  gym_frequency text not null,
  fitness_goal text not null,
  workout_types text[] not null,
  diet_rating text not null,
  motivations text[] not null,
  biggest_challenge text not null,
  current_goal text not null,
  created_at timestamptz not null default now()
);
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/health-habits-survey.git
   cd health-habits-survey
   ```

2. Install all workspace dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the project root and add your Supabase credentials:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Start the API server:
   ```bash
   pnpm --filter @workspace/api-server run dev
   ```

5. In a separate terminal, start the frontend:
   ```bash
   pnpm --filter @workspace/gym-survey run dev
   ```

## Usage

1. Open the app in your browser (default: `http://localhost:PORT` — check the terminal output for the exact port).
2. Complete all 7 survey questions:
   - How often you go to the gym (radio buttons)
   - Your primary fitness goal (dropdown)
   - Types of workouts you do (checkboxes)
   - How you would rate your diet (radio buttons)
   - What motivates you to stay active (checkboxes)
   - Your biggest consistency challenge (text input)
   - One current health or fitness goal (text input)
3. Click **Submit Reflections**. Your response is saved to Supabase.
4. Read your personalised feedback on the Results page.
5. Click **Retake Survey** to submit another response.

**Environment variables used by the API server:**

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Full URL of your Supabase project |
| `SUPABASE_ANON_KEY` | Supabase anonymous public API key |
| `PORT` | Port the API server binds to (set automatically by Replit) |

## Project Structure

```text
health-habits-survey/
├── artifacts/
│   ├── api-server/                  # Express 5 REST API
│   │   ├── src/
│   │   │   ├── index.ts             # Server entry point, reads PORT and starts Express
│   │   │   ├── app.ts               # Mounts CORS, body parsing, and routes at /api
│   │   │   ├── lib/
│   │   │   │   └── supabase.ts      # Supabase client initialised from env vars
│   │   │   └── routes/
│   │   │       ├── index.ts         # Root router — mounts sub-routers
│   │   │       ├── health.ts        # GET /api/health — liveness check
│   │   │       └── survey.ts        # POST /api/survey — validates and persists responses
│   │   └── build.mjs                # esbuild config for production bundle
│   └── gym-survey/                  # React + Vite frontend
│       ├── src/
│       │   ├── App.tsx              # Root component — sets up QueryClient and routes
│       │   ├── main.tsx             # Vite entry point
│       │   ├── index.css            # Tailwind base styles and CSS variables
│       │   ├── pages/
│       │   │   ├── survey.tsx       # 7-question survey form with Zod validation
│       │   │   └── results.tsx      # Personalised feedback page using submitted state
│       │   ├── components/ui/       # shadcn/ui component library (Button, Card, etc.)
│       │   └── hooks/
│       │       └── use-toast.ts     # Toast notification hook
│       └── vite.config.ts           # Vite config — path aliases, Tailwind plugin
├── lib/
│   ├── api-spec/
│   │   ├── openapi.yaml             # OpenAPI 3.1 spec — single source of truth for the API
│   │   └── orval.config.ts          # Orval codegen config — outputs to api-client-react and api-zod
│   ├── api-client-react/
│   │   └── src/generated/           # Auto-generated React Query hooks (e.g. useSubmitSurvey)
│   ├── api-zod/
│   │   └── src/generated/           # Auto-generated Zod schemas and enum types
│   └── db/
│       └── src/                     # Drizzle ORM schema and PostgreSQL connection pool
├── pnpm-workspace.yaml              # Declares workspace package globs
├── tsconfig.base.json               # Shared TypeScript compiler options (composite, bundler)
├── tsconfig.json                    # Root TypeScript project references
└── package.json                     # Root devDependencies (typescript, prettier)
```

## Changelog

### v1.0.0 — 2026-03-31

- Initial release of the Health & Habits anonymous survey application
- 7-question survey form with radio buttons, dropdown, checkboxes, and free-text inputs
- Full-stack type safety driven by a single OpenAPI spec via Orval codegen
- Supabase PostgreSQL integration for persistent, anonymous response storage
- Personalised results page with feedback branching on gym frequency, fitness goal, and motivations
- Express 5 API server with Zod request validation
- Clean, minimal UI built with shadcn/ui, Tailwind CSS 4, and wouter routing

## Known Issues / To-Do

- [ ] Supabase Row Level Security (RLS) is not yet configured — the `survey_responses` table should have policies applied before production use
- [ ] The results page reads state from `history.state`; directly visiting `/results` without completing the survey shows an empty state screen rather than a helpful redirect
- [ ] No admin dashboard or data export — submitted responses can only be viewed directly in the Supabase table editor
- [ ] Form does not preserve state on page refresh — all selections are lost if the user accidentally navigates away mid-survey
- [ ] No rate limiting on the `POST /api/survey` endpoint — the API is vulnerable to submission spam

## Roadmap

- **Admin results dashboard** — aggregate visualisations (bar charts, pie charts) of all collected responses using Recharts
- **Row Level Security** — configure Supabase RLS policies to restrict reads to authenticated admins only
- **Multi-page survey flow** — split the 7 questions across multiple steps with a progress indicator for a smoother UX
- **CSV / JSON export** — allow admins to download all responses for offline analysis
- **Shareable result cards** — let respondents copy or screenshot a branded summary card of their personalised feedback

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change so we can coordinate before you invest time writing code.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with a clear message: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main` and describe what your changes do and why

## License

This project is licensed under the [MIT License](LICENSE).

## Author

- **Name:** Your Name
- **Institution:** Your University / College
- **Course:** Your Course Name and Code

## Contact

GitHub: [https://github.com/your-username](https://github.com/your-username)

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) — for the accessible, composable component primitives that form the survey UI
- [Orval](https://orval.dev/) — for generating type-safe React Query hooks and Zod schemas directly from the OpenAPI spec
- [Supabase Docs](https://supabase.com/docs) — for clear guidance on client setup and table configuration
- [TanStack React Query Docs](https://tanstack.com/query/latest) — for mutation and async state management patterns
- [Zod Documentation](https://zod.dev/) — for schema validation patterns used on both client and server
- [Radix UI Docs](https://www.radix-ui.com/) — for accessible primitives underlying all form controls
- [Claude (Anthropic)](https://www.anthropic.com/) — AI assistant used during development for code generation, debugging, and architecture decisions
