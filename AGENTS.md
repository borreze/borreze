# AGENTS.md — Borrèze Commune Website

> Reference document for any AI agent working on this repository.  
> Read in full before generating any code.

---

## 1. Project Context


Full **from-scratch** rebuild of the institutional website for the commune of Borrèze (Dordogne, 24590, France).  
Team: **1 solo developer** (Anthony Lalba) — project manager, designer, architect, developer.

The site replaces an obsolete static site with no CMS and no database.  
Core objective: **total autonomy for town hall staff** to manage content, with zero technical intervention required post-delivery.

---

## 2. Tech Stack


| Layer                          | Technology                 | Version              |
| ------------------------------ | -------------------------- | -------------------- |
| Public frontend (front-office) | Nuxt.js SSR                | 3.x                  |
| Back-office                    | Nuxt.js SSR                | 3.x                  |
| Front-office UI                | Tailwind CSS + Headless UI | latest               |
| Back-office UI                 | Tailwind CSS + PrimeVue    | latest               |
| Backend API                    | Node.js LTS + Express      | latest LTS           |
| Backend language               | TypeScript                 | 5.x                  |
| ORM                            | Sequelize                  | latest               |
| Database                       | PostgreSQL                 | 16                   |
| Containerization               | Docker Compose             | latest               |
| Reverse proxy                  | Apache 2.4                 | —                    |
| Hosting                        | OVH VPS (Debian)           | VPS SSD 2 — 4 GB RAM |
| CI/CD                          | GitHub Actions             | —                    |
| Mapping                        | Leaflet.js                 | latest               |
| PDF generation                 | PDFKit                     | latest               |
| Email                          | SMTP OVH Mail              | —                    |
| State management               | Pinia                      | latest               |

**Primary design system color** (defined in `tailwind.config.js`)

---

## 3. Architecture


The project is structured as **3 distinct applications** inside a monorepo:

```
/
├── frontend/           # Nuxt 4 — back-office (SPA-like, PrimeVue)
├── backend/            # Express + TypeScript — REST API
├── docker-compose.yml
└── AGENTS.md
```

### 3.1 REST API (backend)


```
backend/src/
├── models/             # Sequelize models derived from constraints
├── controllers/        # Business logic per resource
├── routes/             # Route declarations per module
├── middlewares/        # auth, rbac, upload, validation, error
├── services/           # PDF, email, search
└── utils/              # Generic TypeScript helpers
```

### 3.2 Core Architectural Principle — Single Source of Truth


**Constraints** (max length, required fields, enum values, etc.) are defined **once** in `constraints/` and simultaneously drive:
- Sequelize schema definitions
- Route-level validation rules (express-validator or zod)
- Shared TypeScript types

Never duplicate a validation rule between the model and the controller. When a constraint changes, it changes in exactly one place.

### 3.3 Front-office & Back-office (frontend)


Nuxt 4 SSR application. Every page is crawlable (SEO) with dynamic OpenGraph meta tags.

```
frontend/
├── components/         # Reusable Vue 3 components (Headless UI + custom)
|   ├── atomes/ 
|   ├── modlecules/ 
|   └── organisms/ 
├── composables/        # Reusable logic (useFetch wrappers, useSearch…)
├── pages/              # File-based routing (Nuxt)
├── stores/             # Pinia stores
├── assets/             # Global CSS, fonts
└── public/             # Static files
```

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
- Shared front/back types live in `packages/shared/types/`

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
- Rate limiting on `/api/auth/` and the contact form endpoint
- CORS restricted to known front-office origins

---

## 7. Key Features — Hard Constraints


### Canteen Menus

- Input covers a **2-week period** (10 days × 3 columns)
- "No school" option per day (public holidays)
- **Automatic PDF generation** via PDFKit at save time
- PDF publicly downloadable from the front-office without authentication
- Previous menus archived and accessible

### Global Search

- Implemented via **PostgreSQL Full-Text Search** (`tsvector`, `tsquery`, language `french`)
- `pg_trgm` extension for fuzzy search
- Scope: news, events, editorial pages, projects, associations, businesses
- Results < 1 second — no Elasticsearch, no Algolia

### Town Hall Room Reservations

- Status workflow: `pending` → `accepted` | `rejected`
- Calendar view in back-office (PrimeVue Calendar)
- Front-office calendar reflects accepted reservations in real time
- CSV export of reservation records

### Mapping

- Leaflet.js only — OpenStreetMap tiles (no Google Maps, no cost)
- Used on: Contact page, History & Heritage, Businesses, Hiking trails

### Scheduled Publishing

- Posts and Events have a `scheduled_at` field
- A cron job or read-time middleware auto-publishes when the date is reached

---

## 8. SEO


- SSR enabled on **all** front-office pages
- `useHead()` / `useSeoMeta()` on every page with dynamic title and description
- OpenGraph + Twitter Cards on detail pages (news, events)
- Auto-generated XML sitemap (`@nuxtjs/sitemap`)
- `robots.txt`: front-office indexable, back-office (`/admin/*`) blocked

---

## 9. Infrastructure

```
Internet
    └─► Apache 2.4 (reverse proxy, SSL/TLS Let's Encrypt)
            ├─► :3000  apps/front  (Nuxt SSR)
            ├─► :3001  apps/back   (Nuxt SSR — /admin access)
            └─► :4000  backend    (Express API)

PostgreSQL 16  ←── backend
PgAdmin        ←── SSH tunnel (production admin)
```

- **Docker Compose** orchestrates all 3 apps + PostgreSQL + PgAdmin in development
- Environment variables via `.env` — never commit `.env`
- Daily automated backups: PostgreSQL dump + uploads directory

---

## 10. Testing


- **Unit**: Vitest for API utils/services and front-office composables
- **E2E**: Playwright on critical flows (BO login, news publishing, room reservation)
- No strict TDD — prioritize coverage on: auth, RBAC, PDF generation, full-text search, reservation workflow

---

## 11. What the Agent Must NOT Do


- Introduce a new framework or major dependency not in the stack without explicit discussion
- Use `any` in TypeScript
- Write raw SQL outside of migrations or justified full-text search queries
- Duplicate validation rules across layers
- Use the Vue Options API
- Use Google Maps (paid) — Leaflet/OSM only
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
```

ESLint + Prettier configured at monorepo root — no commit passes with lint errors.

---

## 13. Permanent Watchpoints


- **Non-technical end users**: the back-office must be usable without prior training. Every destructive action requires confirmation. Statuses are visually distinct at a glance.
- **GDPR**: minimal personal data storage. The contact form sends by email and does not persist to the database. Cookie consent banner required.
- **Performance**: homepage < 2s load, search results < 1s. Lighthouse performance score > 80, accessibility > 90.
- **Mobile-first**: systematic Tailwind responsive classes. Test at 375px viewport minimum.
- **Media weight**: automatic optimization on upload (@nuxt/image for rendering, sharp on the API side). Canteen PDF < 500 KB.