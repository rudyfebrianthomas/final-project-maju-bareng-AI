const express = require('express');
const { uploadChatAttachment } = require('../middleware/upload');
const { generateChatReply } = require('../services/gemini');
const { ERROR_MESSAGES } = require('../constants/chat');

const chatRouter = express.Router();

function extractUploadedFile(req) {
  return req.file || (req.files && (req.files.file?.[0] || req.files.image?.[0]));
}

chatRouter.post('/', uploadChatAttachment, async (req, res) => {
  try {
    const message = req.body.message || '';
    const file = extractUploadedFile(req);
    const reply = await generateChatReply({ message, file });

    res.json({ reply });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: ERROR_MESSAGES.serverOrApiKey });
  }
});

module.exports = chatRouter;
