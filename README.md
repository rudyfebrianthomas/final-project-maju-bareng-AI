# Tech Career Buddy

Tech Career Buddy is a multimodal IT career consultant chatbot powered by Google Gemini. It pairs a static browser chat interface (`public/`) with an Express.js backend (`server.js` and `src/`) that forwards text and file uploads to `@google/genai` using a configurable persona in `SYSTEM_PROMPT.md`.

## Features

- **IT-focused consultation & guardrails**: Reads system instructions from `SYSTEM_PROMPT.md` (with a built-in fallback) to answer questions on IT career roadmaps, coding, technical interviews, portfolios, and tech CVs while declining off-topic requests.
- **Multimodal file uploads**: Accepts `image/*`, `application/pdf`, and `audio/*` attachments up to `20 MB` in memory via `POST /api/chat` (`multipart/form-data` fields `file` or `image`), applying default review prompts when no text message is provided.
- **Interactive chat interface**:
  - Live attachment preview for images, PDF badges, and audio labels with cancel support before sending.
  - Auto-resizing message input (`Enter` to send, `Shift+Enter` for a new line) and a `Reset Chat` button.
  - Markdown formatting via `marked.js` (with a regex fallback for bold, italic, inline code, and line breaks).
- **Local & serverless entrypoint**: Serves static assets from `public/`, handles `GET /` explicitly, and exports the Express `app` while binding `app.listen(PORT)` only when run directly.

## Tech Stack

| Category | Technology | Role |
| --- | --- | --- |
| Runtime | Node.js (CommonJS) | Server runtime |
| Web Framework | Express (`^5.3.0`) | HTTP server, static file hosting, and `/api/chat` routing |
| AI SDK | `@google/genai` (`^2.28.0`) | Gemini `generateContent` requests (`gemini-2.5-flash` default) |
| File Upload | `multer` (`^2.4.0`) | In-memory `multipart/form-data` parsing (`20 MB` limit) |
| Configuration & CORS | `dotenv` (`^18.0.7`), `cors` (`^2.8.6`) | Environment variable loading and cross-origin middleware |
| Frontend | HTML5, CSS3, Vanilla JS (ESM) | Chat UI, file preview, and API client (`public/`) |
| Markdown Rendering | `marked` (CDN) | Client-side Markdown rendering for bot responses |

## Getting Started

Prerequisites: Node.js and a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the server
npm start
```

Open `http://localhost:3000` in your browser.

`.env.example` variables:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port used when running `server.js` locally | `3000` |
| `GEMINI_API_KEY` | Google Gemini API key (required) | (none) |
| `GEMINI_MODEL` | Gemini model identifier passed to `@google/genai` | `gemini-2.5-flash` |

## Scripts

```bash
npm start    # Start server with nodemon server.js
npm run dev  # Watch server.js with nodemon --watch server.js
```

## API

- `POST /api/chat`: Accepts `multipart/form-data` with optional `message` text and an optional `file` or `image` attachment (`image/*`, `audio/*`, or `application/pdf`, max `20 MB`). Returns `{ "reply": "..." }` on success or `{ "error": "..." }` with status `500` on failure.

## Project Structure

```text
├── .env.example
├── .gitignore
├── SYSTEM_PROMPT.md
├── UI.pdf
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── js/
│       ├── main.js
│       ├── components/
│       │   ├── chatMessages.js
│       │   └── filePreview.js
│       ├── constants/
│       │   └── chat.js
│       ├── services/
│       │   └── chatApi.js
│       └── utils/
│           └── markdown.js
└── src/
    ├── constants/
    │   └── chat.js
    ├── middleware/
    │   └── upload.js
    ├── routes/
    │   └── chat.js
    └── services/
        └── gemini.js
```
