# Contributing Guidelines

## Branching

Use prefixes to clarify the purpose:

| Prefix      | When to use                 | Example                  |
| ----------- | --------------------------- | ------------------------ |
| `feat/`     | New feature                 | `feat/user-auth`         |
| `fix/`      | Bug fix                     | `fix/login-error`        |
| `refactor/` | Code refactoring or cleanup | `refactor/api-endpoints` |
| `docs/`     | Documentation changes       | `docs/setup-guide`       |
| `test/`     | Adding or updating tests    | `test/auth-module`       |

## Commits

- Conventional Commits (https://www.conventionalcommits.org/)
  - `feat: add user authentication`
  - `fix: correct product price calculation`
  - `chore: update dependencies`

## Flows

### Démarrer une feature

```bash
git checkout develop
git pull
git checkout -b feature/nom-de-la-feature
# coding...
git commit -m "feat: description"
git push -u origin feature/nom-de-la-feature
# Open a PR to develop, assign reviewers, wait for approval and merge
```

### Hotfix urgent en production

```bash
git checkout main
git pull
git checkout -b hotfix/description-du-fix
# coding...
git commit -m "fix: correctif urgent"
git push -u origin hotfix/description-du-fix
# Open a PR to main, assign reviewers, wait for approval and merge
# Merge to develop to keep it up to date with prod
```

### Release production

```bash
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
# The CI/CD pipeline will handle the rest (build, test, deploy)
```

## Code Style

- TypeScript strict mode enabled
- ESLint + Prettier configured, mandatory execution before commit
- Variables and functions in **camelCase**
- Classes and types in **PascalCase**
- DB columns in **snake_case**

## Frontend (Nuxt)

- Pages in `/pages`, reusable components in `/components`
- Use `script setup` + composition API
- API calls via a dedicated service never directly in components
- No inline CSS, prefer Tailwind (config already present)
- Atomic design for components (small, reusable, single responsibility): `components/atoms`, `components/molecules`, `components/organisms`

## Backend (Express + TS)

- Routes in `/routes`
- Thin controllers: retrieve the request and call the service
- Services for business logic
- Middleware for cross-cutting concerns (logs, auth, validation)
- Logger via `log.service.ts`, never `console.log` (or at least remove before PR)

## Testing

- Unit tests via Jest
- At least one test for each critical service

## Pull Requests

- Clearly describe the feature or fix
- Link issues if present

## Lastly

All of these rules seem strict, but they are here to ensure code quality and maintainability.

<img src="https://media1.tenor.com/m/aeV80XD4CSgAAAAd/guidlines-pirates-of-the-caribbean.gif" width="400"/>