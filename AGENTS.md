# AGENTS.md — Borrèze Commune Website

> Reference document for any AI agent working on this repository.  
> Read in full before generating any code.

---

## 1. Project Context

Full **from-scratch** rebuild of the institutional website for the commune of Borrèze (Dordogne, 24590, France).  
Team: **1 solo developer** — project manager, designer, architect, developer.

The site replaces an obsolete static site with no CMS and no database.  
Core objective: **total autonomy for town hall staff** to manage content, with zero technical intervention required post-delivery.

The whole project should be written in English only.
Only **English** content is allowed in the codebase, including comments, variable names, and documentation.

Public visible content must be in French.
Nuxt routes, pages wording must be in **French**.

---

## 2. Tech Stack

| Layer                          | Technology            | Version              |
| ------------------------------ | --------------------- | -------------------- |
| Public frontend (front-office) | Nuxt.js SSR           | 3.x                  |
| Back-office                    | Nuxt.js Client first  | 3.x                  |
| Front-office UI                | Tailwind CSS          | latest               |
| Back-office UI                 | Tailwind CSS          | latest               |
| Backend API                    | Node.js LTS + Express | latest LTS           |
| Backend language               | TypeScript            | 5.x                  |
| ORM                            | Sequelize             | latest               |
| Database                       | PostgreSQL            | 16                   |
| Containerization               | Docker Compose        | latest               |
| Reverse proxy                  | Apache 2.4            | —                    |
| Hosting                        | OVH VPS (Debian)      | VPS SSD 2 — 4 GB RAM |
| CI/CD                          | GitHub Actions        | —                    |
| Mapping                        | Leaflet.js            | latest               |
| PDF generation                 | PDFKit                | latest               |
| Email                          | SMTP OVH Mail         | —                    |
| State management               | Pinia                 | latest               |

**Primary design system color** (defined in `frontend/assets/main.css`):
- primary: #DB1D12;
- light: #F5F5F5;
- dark: #2C2C2C;

---

## 3. Architecture

The project is structured as a **monorepo** containing 2 distinct applications and 1 shared package:

```
/
├── shared/             # @brz/shared — shared TypeScript types and utilities
├── frontend/           # Nuxt 4 — back-office (SPA-like, PrimeVue)
├── backend/            # Express + TypeScript — REST API
├── package.json        # npm workspaces root
├── docker-compose.yml
└── AGENTS.md
```

### 3.0 npm Workspaces

The monorepo uses **npm workspaces** declared in the root `package.json`:

```json
{
  "private": true,
  "workspaces": ["shared", "frontend", "backend"]
}
```

`npm install` must always be run from the **monorepo root**, never from a sub-package directly.

### 3.1 Shared Package (`@brz/shared`)

```
shared/
├── package.json        # name: "@brz/shared", exports ./src/index.ts directly
├── tsconfig.json
└── src/
    ├── index.ts        # barrel export
    └── types/          # shared TypeScript types consumed by both frontend and backend
```

- The package exposes TypeScript source directly (no pre-build step).
- Both `frontend/package.json` and `backend/package.json` declare `"@brz/shared": "*"` as a dependency.
- Import in code: `import type { MyType } from '@brz/shared'`
- **Never duplicate a type** that is consumed by both layers — define it once in `shared/src/types/`.

### 3.2 REST API (backend)

```
backend/src/
├── models/             # Sequelize models derived from constraints
├── controllers/        # Business logic per resource
├── routes/             # Route declarations per module
├── middlewares/        # auth, rbac, upload, validation, error
├── services/           # PDF, email, search
└── utils/              # Generic TypeScript helpers
```

`backend/tsconfig.json` must declare `typeRoots` pointing to both the local and root `node_modules/@types` to account for npm workspaces hoisting:

```json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "../node_modules/@types"
    ]
  }
}
```

### 3.3 Core Architectural Principle — Single Source of Truth

**Constraints** (max length, required fields, enum values, etc.) are defined **once** in `constraints/` and simultaneously drive:
- Sequelize schema definitions

Never duplicate a validation rule between the model and the controller. When a constraint changes, it changes in exactly one place.

### 3.4 Front-office & Back-office (frontend)

Nuxt 3 SSR application. Every page is crawlable (SEO) with dynamic OpenGraph meta tags.

```
frontend/
├── components/         # Reusable Vue 3 components (Headless UI + custom)
|   ├── atomes/ 
|   ├── molecules/
|   └── organisms/
├── composables/        # Reusable logic (useFetch wrappers, useSearch…)
├── pages/              # File-based routing (Nuxt)
|   ├── back-office/    # Back-office pages (PrimeVue components, no SSR) 
|   ├── ...             # Front-office pages (SSR, dynamic meta tags) 
|   └── index.vue       
├── stores/             # Pinia stores
├── assets/             # Global CSS, fonts
└── public/             # Static files
```

If Nuxt fails to transpile `@brz/shared` during SSR build, add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  build: {
    transpile: ['@brz/shared']
  }
})
```

---

## 4. Data Models

Sequelize models located in `backend/src/models/`

**JSONB convention**: use JSONB for complex structures that are never queried field-by-field (opening hours per day, canteen menu grid, homepage quick links). Do not normalize if the data is always read as a whole block.

---

## 5. Roles & Permissions (RBAC)

3 roles, enforced via middleware at `backend/src/middlewares/rbac.ts`:

| Role            | Scope                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `admin`         | Full access — user management, settings, all resources                                                                                                                                           |
| `editor`        | Homepage, history/heritage, practical info, news, events, editorial pages, projects, associations, council minutes, councillors, businesses, school, town hall room, reservations, media library |
| `school_editor` | Canteen menus only, childcare hours, bus info                                                                                                                                                    |

The RBAC middleware is applied at the **route level**, never inside controllers. Controllers never check the role themselves.

---

## 6. Code Conventions

### TypeScript

- Strict mode enabled everywhere (`"strict": true` in all `tsconfig.json`)
- No `any` — use `unknown` when the type is uncertain
- `interface` for data shapes, `type` for unions/intersections
- **Shared front/back types live in `shared/src/types/` and are imported via `@brz/shared`**
- Types used exclusively by the frontend stay in `frontend/types/`
- Types used exclusively by the backend stay in `backend/src/types/`

### Naming

- Files: `PascalCase` for Vue components, `camelCase` for composables/utils
- Vue components: `PascalCase`
- Variables/functions: `camelCase`
- Global constants: `SCREAMING_SNAKE_CASE`
- API routes: `kebab-case` (`/api/council-minutes`, `/api/canteen-menus`)

### REST API

- Semantic HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- Uniform JSON responses using a common structure:
  ```typescript
    export interface Return {
        message?: string | null
        timestamp?: string | null
        error?: ValidationError[] | null
        data?: Array<object> | object | boolean | null
        pagination?: Pagination | null
    }
  ```
- Systematic pagination on list endpoints: `?page=1&limit=20`

### Vue Components

- Composition API only (`<script setup lang="ts">`)
- Props typed via `defineProps<{}>()` with defaults via `withDefaults`
- Typed emits via `defineEmits<{}>()`
- No Options API

### Sequelize

- Migrations for every schema change — never modify a model without a migration
- `timestamps: true` on all models (`createdAt`, `updatedAt`)
- Soft delete via `paranoid: true` on critical models (User, Post, Event)
- Indexes on frequently filtered columns (status, date, slug)

### Security

- All user inputs validated before processing (express-validator or zod)
- No raw SQL — always go through Sequelize
- File uploads: validate MIME type + extension + size (images < 5 MB, PDFs < 10 MB)
- Secure sessions (httpOnly, secure, sameSite)
- CORS restricted to known front-office origins

---

## 7. Key Features — Hard Constraints

### Global Search

- Implemented via **PostgreSQL Full-Text Search** (`tsvector`, `tsquery`, language `french`)
- `pg_trgm` extension for fuzzy search
- Scope: news, events, editorial pages, projects, associations, businesses
- Results < 1 second — no Elasticsearch, no Algolia

### Mapping

- Leaflet.js only — OpenStreetMap tiles (no Google Maps, no cost)
- Used on: Contact page, History & Heritage, Businesses, Hiking trails

---

## 8. SEO

- SSR enabled on **all** front-office pages
- `useAppHead()` / `useMeta()` on every page with dynamic title and description
- OpenGraph + Twitter Cards on detail pages (news, events)
- Auto-generated XML sitemap (`@nuxtjs/sitemap`)
- `robots.txt`: front-office indexable, back-office (`/back-office/*`) blocked

---

## 9. Infrastructure

### Docker

- **Docker Compose** orchestrates all 2 apps + PostgreSQL + PgAdmin in development.
- **All Dockerfiles use `.` (monorepo root) as build context** to access `shared/`.
- The `file:` path is specified explicitly: `dockerfile: frontend/Dockerfile.prod` / `dockerfile: backend/Dockerfile.prod`.
- Dev Dockerfiles mount the full monorepo root into `/app`; the sub-project sets `WORKDIR /app/frontend` or `WORKDIR /app/backend` after install.
- Prod Dockerfiles copy `shared/`, the sub-project folder, and the root `package*.json` before running `npm ci`.

### CI/CD (GitHub Actions)

- `paths` trigger includes `shared/**` — any change to the shared package triggers both frontend and backend builds.
- Docker build steps use `context: .` and `file: ./frontend/Dockerfile.prod` / `file: ./backend/Dockerfile.prod`.
- GHA layer cache is scoped per image: `cache-from: type=gha,scope=frontend` / `scope=backend` to prevent cross-contamination.

### Environment

- Environment variables via `.env` — never commit `.env`

---

## 10. Testing

- **Unit**: Vitest for API utils/services and front-office composables
- **E2E**: Playwright on critical flows
- No strict TDD — prioritize coverage on: auth, RBAC, PDF generation, full-text search, reservation workflow

---

## 11. What the Agent Must NOT Do

- Introduce a new framework or major dependency not in the stack without explicit discussion
- Use `any` in TypeScript
- Write raw SQL outside of migrations or justified full-text search queries
- Duplicate validation rules across layers
- **Duplicate types that belong in `shared/src/types/` — define once, import from `@brz/shared`**
- **Run `npm install` from a sub-package directory — always run from the monorepo root**
- Use the Vue Options API
- Use Leaflet/OSM only
- Modify the database schema without a corresponding migration
- Store sensitive data (passwords, tokens) without hashing (bcrypt)
- Expose API endpoints without auth + RBAC middleware
- Use `localStorage` for sensitive client-side data

---

## 12. Commit Conventions

Commits follow **Conventional Commits**:
```
feat(api): add canteen menu PDF generation
fix(front): correct event date display on mobile
refactor(api): extract RBAC middleware to shared module
chore(docker): update PostgreSQL image to 16.3
chore(shared): add NewsPost shared type
```

ESLint + Prettier configured at apps root — no commit passes with lint errors.

---

## 13. Permanent Watchpoints

- **Non-technical end users**: the back-office must be usable without prior training. Every destructive action requires confirmation. Statuses are visually distinct at a glance.
- **GDPR**: minimal personal data storage. The contact form sends by email and does not persist to the database. Cookie consent banner required.
- **Performance**: homepage < 2s load, search results < 1s. Lighthouse performance score > 80, accessibility > 90.
- **Mobile-first**: systematic Tailwind responsive classes. Test at 375px viewport minimum.
- **Media weight**: automatic optimization on upload (@nuxt/image for rendering, sharp on the API side). Canteen PDF < 500 KB.