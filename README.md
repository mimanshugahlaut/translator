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

MIT
