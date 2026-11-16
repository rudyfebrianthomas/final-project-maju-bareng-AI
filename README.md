# Tech Career Buddy

Multimodal IT career consultant chatbot powered by Google Gemini. Pairs a static browser chat interface (`public/`) with a Node.js and Express backend (`server.js` and `src/`) that handles text prompts and file uploads via `@google/genai` using the persona configured in `SYSTEM_PROMPT.md`.

## Features

- **IT career consultation**: Loads system instructions from `SYSTEM_PROMPT.md` (with a built-in fallback) to guide users on IT career roadmaps, coding, technical interviews, portfolios, and CVs while declining off-topic requests.
- **Multimodal attachments**: Accepts `image/*`, `application/pdf`, and `audio/*` uploads up to `20 MB` in memory via `POST /api/chat` (`multipart/form-data` fields `file` or `image`), supplying default review prompts when an attachment is sent without text.
- **Browser chat UI**:
  - Live attachment preview for images, PDFs, and audio files with removal before sending.
  - Auto-resizing textarea (`Enter` to send, `Shift+Enter` for newline) and `Reset Chat` action.
  - Response formatting via `marked.js` with a regex fallback for bold, italic, inline code, and line breaks.
- **Local & serverless entrypoint**: Serves static files from `public/`, maps `GET /` to `public/index.html`, and exports the Express `app` while starting `app.listen(PORT)` only when invoked directly.

## Tech Stack

| Category | Technology | Role |
| --- | --- | --- |
| Runtime | Node.js (CommonJS) | Server runtime |
| Backend Framework | Express (`^5.3.0`) | Static hosting and `/api/chat` routing |
| AI SDK | `@google/genai` (`^2.28.0`) | Gemini `generateContent` integration (`gemini-2.5-flash` default) |
| File Uploads | `multer` (`^2.4.0`) | In-memory `multipart/form-data` parsing and `20 MB` size guard |
| Configuration & CORS | `dotenv` (`^18.0.7`), `cors` (`^2.8.6`) | Environment variable loading and cross-origin headers |
| Frontend | HTML5, CSS3, Vanilla JS (ESM) | Chat interface, file preview, and fetch API client |
| Markdown | `marked` (CDN) | Browser Markdown rendering for assistant replies |

## Getting Started

Requires Node.js and a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the server
npm start
```

Open `http://localhost:3000` in your browser.

Environment variables defined in `.env.example`:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port bound when running `server.js` directly | `3000` |
| `GEMINI_API_KEY` | Google Gemini API key (required) | (none) |
| `GEMINI_MODEL` | Gemini model ID passed to `@google/genai` | `gemini-2.5-flash` |

## Scripts

```bash
npm start    # Run nodemon server.js
npm run dev  # Run nodemon --watch server.js
```

## API

- `POST /api/chat`: Accepts `multipart/form-data` with optional `message` and an optional `file` or `image` field (`image/*`, `audio/*`, or `application/pdf`, max `20 MB`). Returns `{ "reply": "..." }` on success or `{ "error": "..." }` with status `500` on error.

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
