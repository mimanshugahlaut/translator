# LinguaAI — Real-Time Translator

AI-powered real-time translation across 50+ languages. Built with React, FastAPI, and LibreTranslate.

## Features

**MVP**
- Text translation with auto language detection
- Source/target language selectors with search
- One-click language swap
- Real-time translation (600ms debounce)
- Copy translated text to clipboard

**Should Have**
- Voice input (Web Speech API)
- Translation history (localStorage, max 20)
- Character counter (500 limit)
- Clear button

**Nice to Have**
- Dark mode toggle
- Favorite/pinned languages
- Text-to-speech for results
- Share translation card

## Project Structure

```
translator/
├── backend/          # FastAPI API (Render)
│   ├── main.py
│   ├── routers/
│   ├── services/
│   └── models/
└── frontend/         # React + Vite (Vercel)
    └── src/
        ├── components/
        ├── hooks/
        └── services/
```

## Quick Start

### Prerequisites

- Python 3.11+ for the backend
- Node.js 18+ for the frontend

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend: http://localhost:8000
API docs: http://localhost:8000/docs

Run backend smoke tests:

```bash
cd backend
python -m unittest discover -s tests
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173

Set `VITE_API_URL` in `frontend/.env` to your backend URL when deploying. For local development, `http://localhost:8000` works with the included defaults.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/translate` | Translate text |
| POST | `/detect` | Detect source language |
| GET | `/languages` | List supported languages |
| GET | `/health` | Health check |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `CORS_ORIGINS` | Comma-separated frontend URLs |
| `LIBRETRANSLATE_URL` | LibreTranslate instance URL |
| `LIBRETRANSLATE_API_KEY` | Optional API key |
| `GOOGLE_TRANSLATE_API_KEY` | Fallback if LibreTranslate fails |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## Deployment

- **Frontend**: Deploy `frontend/` to [Vercel](https://vercel.com). Set `VITE_API_URL` to your Render backend URL.
- **Backend**: Deploy `backend/` to [Render](https://render.com) using `render.yaml`. Set `CORS_ORIGINS` to your Vercel URL.

Automated deployment (GitHub Actions)

This repository includes two optional GitHub Actions workflows that can deploy on push to `main`:

- `.github/workflows/deploy-backend-render.yml` — triggers a Render deploy via the Render API.
- `.github/workflows/deploy-frontend-vercel.yml` — deploys the `frontend/` to Vercel using the Vercel CLI.

Secrets required (add these in the GitHub repository settings -> Secrets):

- `RENDER_API_KEY` — a Render API key with deploy permissions.
- `RENDER_SERVICE_ID` — the Render service ID for the backend (find in Render dashboard).
- `VERCEL_TOKEN` — a Vercel token with deploy permissions.
- `VERCEL_ORG_ID` — (optional) your Vercel organization/team ID.
- `VERCEL_PROJECT_ID` — (optional) your Vercel project ID.

How to enable

1. Create a Render service using `backend/render.yaml` in your Render dashboard (or create manually) and copy its service id.
2. Create a Render API key (Account -> API Keys).
3. In GitHub, go to `Settings -> Secrets and variables -> Actions` and add `RENDER_API_KEY` and `RENDER_SERVICE_ID`.
4. Connect your frontend on Vercel (Import Project) and obtain `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from the project settings, then create a `VERCEL_TOKEN` (Account -> Tokens) and add them to GitHub Secrets.
5. Push to `main` — the deploy workflows will run automatically.

## Verified Local Setup

I verified the local flow on Windows with:

```bash
cd backend
& "C:/Program Files/Python314/python.exe" -m uvicorn main:app --reload --port 8000
```

```bash
cd frontend
npm run dev
```

The UI translated `Hello world` to Hindi successfully during the smoke test.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Python 3.11, FastAPI, httpx, langdetect |
| Translation | LibreTranslate → Google API → deep-translator (dev fallback) |

## License

No license file is included in this repository.
