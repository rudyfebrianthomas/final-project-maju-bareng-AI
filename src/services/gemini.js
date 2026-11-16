const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const {
  DEFAULT_GEMINI_MODEL,
  FALLBACK_SYSTEM_INSTRUCTION,
  DEFAULT_FILE_PROMPTS,
} = require('../constants/chat');

const SYSTEM_PROMPT_PATH = path.resolve(__dirname, '..', '..', 'SYSTEM_PROMPT.md');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function getSystemInstruction() {
  try {
    return fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8');
  } catch (err) {
    return FALLBACK_SYSTEM_INSTRUCTION;
  }
}

function getDefaultPromptForMimeType(mimetype) {
  if (mimetype === 'application/pdf') {
    return DEFAULT_FILE_PROMPTS.pdf;
  }

  if (mimetype.startsWith('audio/')) {
    return DEFAULT_FILE_PROMPTS.audio;
  }

  return DEFAULT_FILE_PROMPTS.image;
}

function buildChatParts({ message, file }) {
  const parts = [];

  if (file) {
    parts.push({
      inlineData: {
        mimeType: file.mimetype,
        data: file.buffer.toString('base64'),
      },
    });
  }

  if (message) {
    parts.push({ text: message });
  } else if (file) {
    parts.push({ text: getDefaultPromptForMimeType(file.mimetype) });
  }

  return parts;
}

async function generateChatReply({ message, file }) {
  const parts = buildChatParts({ message, file });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
    contents: parts,
    config: {
      systemInstruction: getSystemInstruction(),
    },
  });

  return response.text;
}

module.exports = {
  getSystemInstruction,
  getDefaultPromptForMimeType,
  buildChatParts,
  generateChatReply,
};
