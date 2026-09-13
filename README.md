# Quran Academy

# Online-Quran

Online Quran teaching platform with a React frontend and Node.js API.

## Structure

```
quran-academy/
├── frontend/   # React + Vite + Tailwind
└── backend/    # Node.js + Express + MongoDB
```

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

## Quick Start

From the repository root, install dependencies in each package:

```bash
npm --prefix backend install
npm --prefix frontend install
```

Create local environment files from the checked-in templates before starting
the applications:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update the values in both files for your local MongoDB and any optional
services. `.env` files are ignored by Git; only the example templates belong
in the repository.

The root scripts provide the common commands:

```bash
npm run build
npm run dev:frontend
npm run dev:backend
```

### Backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`. Never commit `.env` files.

## Root Commands

Run these from the repository root:

```bash
npm run dev:backend   # start the API with nodemon
npm run dev:frontend  # start the Vite development server
npm run build         # create the frontend production build
npm run lint          # lint the frontend
npm test              # run backend tests
npm run seed          # seed the database
```

## Deployment

- **Frontend:** `vercel.json` builds `frontend/` and serves the single-page
	application through Vercel. Set the `VITE_*` variables in Vercel settings.
- **Backend:** `render.yaml` deploys `backend/` as a Render web service. Set
	the variables marked `sync: false` in Render.

## Project Health

GitHub Actions runs backend tests and frontend lint/build checks on pushes and
pull requests. The backend smoke test is currently the automated API coverage
baseline.

## Current Scope

Implemented modules include authentication, public courses and teachers,
teacher applications, teacher availability, student profiles, trial bookings,
contact, blog, role-based routes, protected APIs, class scheduling, attendance,
admin booking management, and centralized error handling. The remaining
dashboard routes are intentionally unavailable until their corresponding
backend APIs and data models are added.
