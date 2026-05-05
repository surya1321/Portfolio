# API Contracts — Phase 2 Backend Integration

## Purpose
This document defines the contract between the Phase 1 frontend (mock-data) and the Phase 2 backend so the swap-in is seamless and bug-free.

---

## 1. Currently Mocked in Frontend (`/app/frontend/src/mock.js`)

| Mock | Used in | Replace with |
|------|---------|--------------|
| `mockRepos` (6 repo objects) | `components/GitHubRepos.jsx` | Live fetch from `GET /api/github/repos` |
| `localStorage.contact_messages` push | `components/Contact.jsx` | `POST /api/contact` |

Static data that **stays in frontend mock** (does not need a backend):
- `profile`, `availability`, `experience`, `projects`, `skills`, `education`, `navLinks`

---

## 2. Backend Endpoints to Implement

All routes live under `/api` (Kubernetes ingress requirement).

### 2.1 Health
```
GET /api/health
→ 200 { "status": "ok", "service": "portfolio-api" }
```

### 2.2 GitHub Repos (live, cached)
```
GET /api/github/repos?username=surya1321&limit=12
→ 200 { "username": "surya1321", "count": N, "cached": bool, "repos": [ Repo, ... ] }
→ 502 { "detail": "GitHub upstream error" }
→ 429 { "detail": "GitHub rate-limit hit" } (optional)
```

**Repo shape (matches what the frontend already renders):**
```json
{
  "id": 12345,
  "name": "repo-name",
  "description": "string|null",
  "language": "Python|null",
  "stargazers_count": 0,
  "forks_count": 0,
  "html_url": "https://github.com/...",
  "updated_at": "2025-04-12T10:00:00Z",
  "topics": ["nlp","python"]
}
```

**Behavior:**
- Calls `https://api.github.com/users/{username}/repos?sort=updated&per_page=100`
- Filters out forks and archived repos
- Sorts by `stargazers_count desc, updated_at desc`, returns top `limit` (default 12)
- **Caches results in MongoDB** for 10 minutes (collection `github_cache`, doc keyed by username) to avoid hitting GitHub's 60-req/hr unauthenticated limit.

### 2.3 Contact Form
```
POST /api/contact
Body: { "name": "string (1-120)", "email": "valid email", "message": "string (1-500)" }
→ 200 { "id": "uuid", "ok": true, "received_at": "ISO-8601" }
→ 422 { "detail": [...validation errors...] }
```

**Validation:**
- Pydantic v2 with `email-validator` (already in requirements).
- Trims whitespace, rejects empty after trim.
- Stores in MongoDB collection `contact_messages` with fields: `id (uuid)`, `name`, `email`, `message`, `created_at`.

---

## 3. Frontend Integration Plan

### 3.1 New file: `/app/frontend/src/lib/api.js`
Centralized API client — uses `process.env.REACT_APP_BACKEND_URL` and `/api` prefix.
Exports: `fetchRepos(username, limit)`, `submitContact(payload)`.

### 3.2 `components/GitHubRepos.jsx`
- Replace `setTimeout(() => setRepos(mockRepos), 900)` with `fetchRepos("surya1321", 12)`.
- Keep skeleton-loading state during fetch.
- On error, fall back to `mockRepos` so the section never appears empty.

### 3.3 `components/Contact.jsx`
- Replace `localStorage` save with `await submitContact(form)`.
- Keep the existing validation, char counter, success message, loading spinner.
- On network error, surface a friendly inline error (not just a toast).

---

## 4. Mongo Collections

| Collection | Document |
|------------|----------|
| `contact_messages` | `{ id, name, email, message, created_at }` |
| `github_cache` | `{ _id: "username", repos: [...], cached_at }` |

---

## 5. Out of scope for this phase
- Email-sending on contact submit (will surface inline success only).
- Auth / admin dashboard.
- Real screenshot uploads for project case studies.
- Replacing Three.js / design.

## 6. Phase 3 (final)
- Strong **MIT + custom personal-use** `LICENSE` file.
- Polished **`README.md`** with setup, architecture, and credits.
