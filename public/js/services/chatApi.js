import { CHAT_API_ENDPOINT } from '../constants/chat.js';

export async function sendChatMessage({ text, file }) {
  const formData = new FormData();
  if (text) formData.append('message', text);
  if (file) formData.append('file', file);

  const response = await fetch(CHAT_API_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
