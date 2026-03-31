# Working Notes — Health & Habits Survey

> **Internal document. Not public-facing. Update at the end of every working session.**

---

## HOW TO USE THIS FILE (FOR AI ASSISTANTS)

1. Read this entire file before taking any action.
2. Read `README.md` for public-facing project context and setup instructions.
3. Do not change folder structure, naming conventions, or architectural patterns without explicit discussion with the developer.
4. Follow all conventions listed in the CONVENTIONS section exactly — do not introduce alternatives.
5. Do not suggest anything listed in "What Was Tried and Rejected." Those decisions are final.
6. Ask before making large structural changes (adding a new library, splitting a package, changing the build pipeline).
7. This project was AI-assisted. Refactor conservatively. Prefer targeted edits over rewrites.

---

## CURRENT STATE

**Last Updated:** 2026-03-31

The frontend survey is complete and functional. It submits directly to Supabase from the browser. The results page renders tailored feedback based on the submitted answers and persists data via `sessionStorage` to survive page refresh. The project is configured for deployment to Azure Static Web Apps.

### What Is Working

- [x] 7-question survey form with validation (radio, select, checkbox, text inputs)
- [x] Zod schema validation via `react-hook-form` + `@hookform/resolvers`
- [x] Direct Supabase insert from the frontend (`supabase.from("survey_responses").insert(data)`)
- [x] Results page with three tailored feedback cards (consistency, goal, drive)
- [x] `sessionStorage` fallback on `/results` so page refresh preserves data
- [x] Enum constants shared from `@workspace/api-zod` (generated, single source of truth)
- [x] `staticwebapp.config.json` present for SPA routing on Azure
- [x] Environment variable bridge in `vite.config.ts` (Replit secrets → Vite `define`)
- [x] TypeScript strict mode passing with no errors across all packages

### What Is Partially Built

- [ ] `@workspace/api-client-react` is still listed as a `devDependency` in `gym-survey/package.json` but is no longer imported — cleanup is deferred
- [ ] `artifacts/api-server` runs as a workflow but is not called by the frontend in production

### What Is Not Started

- [ ] Supabase Row Level Security policy (developer must apply manually — see DATA section)
- [ ] Any admin/analytics view of collected responses
- [ ] CI/CD pipeline (GitHub Actions workflow for Azure Static Web Apps)

---

## CURRENT TASK

The last session focused on migrating the frontend from calling the Express API to calling Supabase directly (Option C for Azure Static Web App deployment). That work is complete and passing typecheck. The immediate next step is to apply the Supabase RLS policy so anonymous inserts are permitted in production without exposing read access.

**Next step:** In the Supabase dashboard, run the SQL in the DATA section to enable the RLS policy.

---

## ARCHITECTURE AND TECH STACK

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19.1.0 | Monorepo catalog default; hooks model suits form-heavy UI |
| Vite | 7.3.0 | Fast HMR, first-class TypeScript, small bundle output |
| Tailwind CSS | 4.x | Utility-first; avoids style drift; catalog default |
| shadcn/ui | component-level | Accessible, unstyled primitives; only 11 components kept |
| TanStack Query | 5.x | `useMutation` for Supabase insert; consistent async state |
| wouter | 3.3.5 | Lightweight SPA router; no need for React Router's full API |
| react-hook-form | 7.x | Performant form state; integrates cleanly with Zod |
| Zod | 3.25.76 | Schema validation shared between frontend and (former) backend |
| @supabase/supabase-js | 2.100.1 | Official Supabase client; direct browser-to-database inserts |
| orval | 8.5.3 | Generates TypeScript enums and Zod schemas from OpenAPI spec |
| pnpm workspaces | 10.x | Monorepo dependency management; shared `catalog:` versions |
| Node.js | 24.13.0 | Environment default |

---

## PROJECT STRUCTURE NOTES

```
.
├── artifacts/
│   ├── api-server/               # Express API server — no longer called by frontend
│   │   └── src/
│   │       ├── app.ts
│   │       ├── lib/supabase.ts   # Server-side Supabase client (server env vars)
│   │       └── routes/survey.ts
│   ├── gym-survey/               # Primary artifact — React/Vite SPA
│   │   ├── src/
│   │   │   ├── lib/supabase.ts   # Browser-side Supabase client (VITE_ env vars)
│   │   │   ├── pages/
│   │   │   │   ├── survey.tsx    # 7-question form; submits to Supabase directly
│   │   │   │   └── results.tsx   # Feedback page; reads from history.state or sessionStorage
│   │   │   ├── components/ui/    # 11 shadcn components kept (see list below)
│   │   │   ├── hooks/use-toast.ts
│   │   │   └── App.tsx           # Router setup with wouter base path
│   │   ├── staticwebapp.config.json  # Azure SPA routing + security headers
│   │   └── vite.config.ts        # Port, basePath, VITE_ define bridge
│   └── mockup-sandbox/           # Replit canvas component preview server (ignore)
├── lib/
│   ├── api-spec/openapi.yaml     # Source of truth: schema, enums, endpoints
│   ├── api-zod/                  # Generated by orval — do not hand-edit
│   │   └── src/generated/api.ts  # Exports SurveySubmission* enums and Zod schemas
│   ├── api-client-react/         # Generated React Query hooks — unused in production
│   └── db/                       # Drizzle ORM setup — unused (using Supabase SDK)
├── README.md
└── WORKING_NOTES.md
```

**Non-obvious decisions:**

- `lib/api-spec/openapi.yaml` is the single source of truth for all enum values. If an enum value changes, update the YAML then regenerate with orval, then rebuild `api-zod` with `pnpm tsc --build lib/api-zod/tsconfig.json`.
- `artifacts/gym-survey/src/lib/supabase.ts` uses `import.meta.env.VITE_SUPABASE_URL` — these are injected at build time by `vite.config.ts`'s `define` block, not read at runtime.
- `results.tsx` reads survey data from `history.state` first (set by wouter on navigate), then falls back to `sessionStorage`, then shows an empty state message. Do not remove either fallback.

**shadcn components kept:** `button`, `card`, `checkbox`, `form`, `input`, `label`, `radio-group`, `select`, `toast`, `toaster`, `tooltip`

**Files that must not be changed without discussion:**

- `lib/api-spec/openapi.yaml` — changing enum strings breaks existing Supabase data
- `lib/api-zod/src/generated/api.ts` — generated file, do not hand-edit
- `artifacts/gym-survey/staticwebapp.config.json` — required for Azure routing
- `pnpm-workspace.yaml` — catalog versions affect all packages

---

## DATA / DATABASE

**Provider:** Supabase (PostgreSQL). Credentials stored as Replit secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `uuid` | auto | Primary key, `gen_random_uuid()` default |
| `created_at` | `timestamptz` | auto | `now()` default |
| `gym_frequency` | `text` | yes | One of 5 enum values |
| `fitness_goal` | `text` | yes | One of 5 enum values |
| `workout_types` | `text[]` | yes | Array, min 1 item |
| `diet_rating` | `text` | yes | One of 5 enum values |
| `motivations` | `text[]` | yes | Array, min 1 item |
| `biggest_challenge` | `text` | yes | Free text, min 1 char |
| `current_goal` | `text` | yes | Free text, min 1 char |

**Required RLS policy (must be applied manually in Supabase SQL Editor):**

```sql
alter table survey_responses enable row level security;

create policy "allow anon insert"
on survey_responses for insert
to anon
with check (true);
```

No select, update, or delete policies should be granted to `anon`. All read access should be through the Supabase dashboard or a service-role key held server-side.

---

## CONVENTIONS

### Naming Conventions

- Files: `kebab-case` for all files and folders
- React components: `PascalCase` named exports, one per file
- Hooks: `use` prefix, `camelCase`
- Zod schemas: `PascalCase` matching the OpenAPI `operationId` or `$ref` name
- Environment variables: `SCREAMING_SNAKE_CASE`; frontend-visible vars prefixed `VITE_`

### Code Style

- TypeScript strict mode throughout; no `any` without a comment explaining why
- Prefer `z.nativeEnum()` over `z.enum()` when consuming generated enum objects from `@workspace/api-zod`
- No inline enum string literals in `survey.tsx` or `results.tsx` — always import from `@workspace/api-zod`
- No API calls in `results.tsx` — it is a pure display component reading from state/sessionStorage

### Framework Patterns

- Form state managed entirely by `react-hook-form`; do not use `useState` for field values
- All async operations go through TanStack Query (`useMutation` / `useQuery`)
- Route navigation uses `wouter`'s `useLocation` hook; never use `window.location.href`
- The wouter `Router` base is set from `import.meta.env.BASE_URL` — do not hardcode paths

### Git Commit Style

Conventional commits: `type(scope): description` (e.g., `feat(survey): add diet rating question`, `fix(results): handle empty sessionStorage`)

---

## DECISIONS AND TRADEOFFS

- **Direct Supabase from frontend (Option C):** Chosen over Express API proxy and Azure Functions because the app is anonymous, insert-only, and has no server-side business logic that requires protection. Eliminates infrastructure complexity for Azure deployment. Do not suggest re-introducing a backend layer without a concrete security or logic requirement.
- **Enum values live in `openapi.yaml`, generated into `api-zod`:** Eliminates drift between frontend validation and the schema. The cost is running orval after any enum change. Do not suggest defining enums inline in component files.
- **`sessionStorage` for results persistence:** Results are not fetched from Supabase after submission. The survey answers are passed via `history.state` on navigate and backed up to `sessionStorage`. This keeps the results page fast and avoids a read query. Data is not persisted across browser sessions — this is intentional.
- **shadcn components pruned to 11:** The scaffold includes 40+ components. Unused ones were removed to reduce bundle size and maintenance surface. Do not add new shadcn components without confirming the feature requires them.
- **Tailwind CSS v4:** Used via `@tailwindcss/vite` plugin, not the PostCSS plugin. Configuration is in `artifacts/gym-survey/src/index.css`. Do not add a `tailwind.config.js` file — it is not used in v4.

---

## WHAT WAS TRIED AND REJECTED

- **Express API server as the production backend (Option A-style):** Originally the frontend called `/api/survey` on the Express server (`artifacts/api-server`). Replaced with direct Supabase inserts. Do not route survey submissions through the Express server.
- **Azure Functions as the backend (Option A):** Evaluated for Azure Static Web Apps. Rejected because it requires converting Express routes to function handlers and adds cold-start latency with no benefit for this use case.
- **Azure App Service for the backend (Option B):** Evaluated. Rejected because it requires managing two separate Azure resources (Static Web App + App Service) and adds CORS configuration complexity.
- **Inline enum definitions in `survey.tsx` and `results.tsx`:** Were defined inline before `@workspace/api-zod` was connected. Removed because they could drift from the OpenAPI spec.
- **Reading results from Supabase on the results page:** The results page was designed to use the submitted form data directly, not re-fetch from the database. Fetching would require either exposing a read policy to `anon` or using a service key — both undesirable.

---

## KNOWN ISSUES AND WORKAROUNDS

**`@workspace/api-client-react` still listed as devDependency in `gym-survey/package.json`**
- Problem: The package is referenced in `package.json` and `tsconfig.json` but `useSubmitSurvey` is no longer imported anywhere in the frontend.
- Workaround: The unused dependency causes no build errors or bundle bloat (it is a `devDependency`). It has not been removed to avoid touching `tsconfig.json` project references unnecessarily.
- Do not remove it without also removing the corresponding `tsconfig.json` reference and verifying typecheck still passes.

**`artifacts/api-server` workflow runs but serves no requests**
- Problem: The Express API server starts as a Replit workflow but the frontend no longer calls it.
- Workaround: It does not affect the frontend. It can be stopped or its workflow disabled if it causes confusion, but the code is left intact in case the architecture is revisited.
- Do not remove `artifacts/api-server` without discussion.

**`/results` direct navigation without survey data shows empty state, not a redirect**
- Problem: If a user navigates directly to `/results` without completing the survey and has no `sessionStorage` data, they see a "No Survey Data Found" screen with a button back to the survey.
- Workaround: This is intentional — a redirect would be invisible and confusing. The empty state message is the correct behavior.
- Do not change this to a silent redirect to `/`.

---

## BROWSER / ENVIRONMENT COMPATIBILITY

**Front-end:**
- Tested in: Chrome (latest), via Replit preview pane
- Expected support: All evergreen browsers (Chrome, Firefox, Safari, Edge)
- Uses `sessionStorage` — requires first-party storage access; not compatible with private browsing modes that block storage (Safari ITP in strict mode)
- Uses `history.state` for route-to-route data passing via wouter
- No IE11 support; Vite output targets modern ES modules

**Back-end / Build environment:**
- OS: Linux (NixOS via Replit)
- Node.js: 24.13.0
- pnpm: 10.x (managed by Replit)
- All secrets injected as environment variables at build time via Vite `define`; no `.env` files are used or committed

---

## OPEN QUESTIONS

- Should the Supabase `survey_responses` table have a `UNIQUE` constraint or rate-limiting to prevent duplicate/spam submissions?
- Should `biggest_challenge` and `current_goal` have a maximum character length enforced at the DB level?
- Is there a future requirement to display aggregated results from all submissions? If so, a read policy and admin route would be needed.
- Should the `api-server` and `api-client-react` packages be removed from the repo since they are no longer used in production?

---

## SESSION LOG

### 2026-03-31

**Accomplished:**
- Replaced Express API proxy with direct Supabase JS client call from the frontend (`useMutation` + `supabase.from("survey_responses").insert(data)`)
- Installed `@supabase/supabase-js` in `gym-survey`
- Created `artifacts/gym-survey/src/lib/supabase.ts` browser client
- Added `define` block to `vite.config.ts` bridging `SUPABASE_URL`/`SUPABASE_ANON_KEY` Replit secrets to `VITE_` prefixed names for Azure compatibility
- Added `artifacts/gym-survey/staticwebapp.config.json` with SPA routing fallback and security headers
- Added `sessionStorage` write-on-submit and read-on-load to `results.tsx` so page refresh preserves feedback
- Connected `@workspace/api-zod` enum imports in both `survey.tsx` and `results.tsx` (replacing inline strings)
- All TypeScript checks pass

**Left incomplete:**
- Supabase RLS policy not yet applied (requires developer action in Supabase dashboard)
- `@workspace/api-client-react` devDependency not cleaned up from `gym-survey/package.json`

**Decisions made:**
- Option C (direct Supabase, no backend) chosen for Azure Static Web Apps deployment

**Next step:** Apply the RLS policy in Supabase (see DATA section), then test a production submission end-to-end.

---

## USEFUL REFERENCES

- [Supabase JS client docs](https://supabase.com/docs/reference/javascript)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Azure Static Web Apps — build configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- [Azure Static Web Apps — `staticwebapp.config.json`](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [orval docs (OpenAPI → TypeScript codegen)](https://orval.dev/)
- [Vite `define` option](https://vite.dev/config/shared-options.html#define)
- [wouter — history state on navigation](https://github.com/molefrog/wouter#using-navigate-with-state)
- AI tools used: Replit Agent (build mode) — used for all code generation, architecture decisions, and file edits throughout this project
