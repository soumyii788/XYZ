# XYZ Logistics Case Management

XYZ is a web application for tracking logistics cases created from carrier email
threads. It includes a React dashboard and a Django REST API, with optional
Gemini-powered email analysis and summaries.

## Project structure

- `frontend/` — React, Vite, and Tailwind CSS application
- `backend/` — Django REST API and SQLite database configuration

## Requirements

- Node.js and npm
- Python 3.12 or newer

## Run locally

Start the backend in one terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Start the frontend in another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Vite
proxies `/api` requests to the Django server at `http://localhost:8000`.

To enable email analysis and summaries, set `GEMINI_API_KEY` in the backend
process environment before starting Django. Without a valid key, those AI
features may not be available.

## Useful commands

Run the frontend linter:

```bash
cd frontend
npm run lint
```

Run backend tests:

```bash
cd backend
python manage.py test
```

Run the background-task worker in a separate backend terminal if scheduled
reminder processing is needed:

```bash
cd backend
source .venv/bin/activate
python manage.py process_tasks
```

## Main API routes

- `/health/` — check whether the Django server is responding
- `/api/v1/cases/` — list and manage cases
- `/api/v1/cases/{id}/summarize/` — generate a case summary
- `/api/v1/messages/` — list and manage messages
- `/api/v1/ingest/` — ingest an email into a case
- `/api/v1/auth/login/`, `/api/v1/auth/register/`, `/api/v1/auth/onboard/` — account routes

The unversioned `/api/` routes are retained as aliases for backwards
compatibility. New clients should use `/api/v1/`.
