# Tech Career Buddy

**Tech Career Buddy** is a multimodal IT career consultant chatbot powered by Google Gemini. It pairs a static browser chat interface (`public/`) with an Express.js backend (`server.js` and `src/`) that forwards text and file uploads to the `@google/genai` SDK using a configurable persona in `SYSTEM_PROMPT.md`.

## Features

- **IT-Focused Consultation & Guardrails**: Reads system instructions from `SYSTEM_PROMPT.md` (with a built-in fallback) to answer questions on IT career roadmaps, coding, technical interviews, portfolios, and tech CVs while politely declining off-topic requests.
- **Multimodal File Uploads**: Accepts `image/*`, `application/pdf`, and `audio/*` attachments up to **20 MB** in memory via `POST /api/chat` (`multipart/form-data` fields `file` or `image`), applying sensible default review prompts when no text message is provided.
- **Interactive Chat Interface**:
  - Live attachment preview for images, PDF badges, and audio labels with cancel support before sending.
  - Auto-resizing message input (`Enter` to send, `Shift+Enter` for a new line) and a `Reset Chat` button.
  - Markdown formatting via `marked.js` (with a regex fallback for bold, italic, inline code, and line breaks).
- **Local & Vercel-Ready Entrypoint**: Serves static assets from `public/`, handles `GET /` explicitly, and exports the Express `app` while only binding `app.listen(PORT)` when run directly.

## Tech Stack

| Category | Technology | Version | Role |
| :--- | :--- | :--- | :--- |
| Runtime | Node.js | — | Server runtime (CommonJS) |
| Web Framework | Express | `^5.3.0` | HTTP server, static hosting, and `/api/chat` routing |
| AI SDK | `@google/genai` | `^2.28.0` | Calls Gemini models (`generateContent`) |
| File Upload | `multer` | `^2.4.0` | In-memory `multipart/form-data` handling (`20 MB` limit) |
| Configuration & CORS | `dotenv`, `cors` | `^18.0.7`, `^2.8.6` | Environment loading and cross-origin middleware |
| Frontend | HTML5, CSS3, Vanilla JS (ESM) | — | Chat UI, file preview, and API client (`public/`) |
| Markdown Rendering | `marked` (CDN) | — | Parses Markdown responses in the browser |

## Getting Started

### Prerequisites

- Node.js installed locally
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation & Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example` and configure your environment variables:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port used when running `server.js` locally | `3000` |
| `GEMINI_API_KEY` | Google Gemini API key (required) | — |
| `GEMINI_MODEL` | Gemini model identifier passed to `@google/genai` | `gemini-2.5-flash` |

### Scripts

Run any of the scripts defined in `package.json`:

```bash
npm start
```

Starts the server with `nodemon server.js`.

```bash
npm run dev
```

Starts `nodemon --watch server.js` for development reloads on `server.js` changes.

Then open `http://localhost:3000` in your browser.

## Project Structure

```text
final-project-maju-bareng-AI/
├── public/
│   ├── js/
│   │   ├── components/
│   │   │   ├── chatMessages.js   # Message rendering, scrolling, and chat reset
│   │   │   └── filePreview.js    # Image/PDF/audio attachment preview controller
│   │   ├── constants/
│   │   │   └── chat.js           # UI copy, limits, and API endpoint constants
│   │   ├── services/
│   │   │   └── chatApi.js        # Multipart POST client for /api/chat
│   │   ├── utils/
│   │   │   └── markdown.js       # marked.js setup and regex fallback formatter
│   │   └── main.js               # Frontend entrypoint and DOM event wiring
│   ├── index.html                # Chat UI markup
│   └── style.css                 # Layout, animations, and chat bubble styles
├── src/
│   ├── constants/
│   │   └── chat.js               # Upload limits, default model, prompts, and errors
│   ├── middleware/
│   │   └── upload.js             # Multer memory storage and MIME type filter
│   ├── routes/
│   │   └── chat.js               # POST /api/chat Express router
│   └── services/
│       └── gemini.js             # System prompt loader and Gemini API integration
├── .env.example                  # Sample environment configuration
├── .gitignore                    # Git ignore rules
├── package.json                  # Project manifest and npm scripts
├── server.js                     # Express application entrypoint
├── SYSTEM_PROMPT.md              # AI persona, guardrails, and formatting rules
└── UI.pdf                        # Reference screenshots of the chat interface
```
