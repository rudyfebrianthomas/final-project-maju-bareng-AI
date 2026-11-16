import { CHAT_COPY, MAX_TEXTAREA_HEIGHT } from './constants/chat.js';
import { sendChatMessage } from './services/chatApi.js';
import { createFilePreviewController } from './components/filePreview.js';
import { createChatMessagesController } from './components/chatMessages.js';

const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const fileInput = document.getElementById('fileInput');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

const filePreviewController = createFilePreviewController({
  fileInput,
  filePreview: document.getElementById('filePreview'),
  previewImg: document.getElementById('previewImg'),
  previewIcon: document.getElementById('previewIcon'),
  fileName: document.getElementById('fileName'),
  cancelFileBtn: document.getElementById('cancelFileBtn'),
});

const chatMessages = createChatMessagesController(chatBox);

messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = `${Math.min(
    messageInput.scrollHeight,
    MAX_TEXTAREA_HEIGHT
  )}px`;
});

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  const file = fileInput.files[0];

  if (!text && !file) {
    return;
  }

  chatMessages.addMessage('user', text, file);

  messageInput.value = '';
  messageInput.style.height = 'auto';
  filePreviewController.reset();

  sendBtn.disabled = true;
  const loadingMessage = chatMessages.addMessage('bot', CHAT_COPY.loadingMessage);

  try {
    const data = await sendChatMessage({ text, file });
    chatMessages.updateBotReply(loadingMessage, data);
  } catch (error) {
    console.error('Error saat fetch chat:', error);
    chatMessages.updateBotNetworkError(loadingMessage, CHAT_COPY.networkError);
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
    chatMessages.scrollToBottom();
  }
});

clearBtn.addEventListener('click', () => {
  chatMessages.reset();
});
