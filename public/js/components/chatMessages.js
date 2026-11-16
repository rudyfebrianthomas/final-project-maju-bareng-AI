import { CHAT_COPY, SCROLL_DELAY_MS } from '../constants/chat.js';
import { formatMessageText } from '../utils/markdown.js';

function createAttachmentElement(file) {
  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    return img;
  }

  if (file.type.startsWith('audio/')) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = URL.createObjectURL(file);
    return audio;
  }

  if (file.type === 'application/pdf') {
    const badge = document.createElement('div');
    badge.classList.add('message-file-badge');
    badge.textContent = `📄 ${file.name}`;
    return badge;
  }

  return null;
}

export function createChatMessagesController(chatBox) {
  function scrollToBottom() {
    setTimeout(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    }, SCROLL_DELAY_MS);
  }

  function addMessage(sender, text, file = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    if (file) {
      const attachmentEl = createAttachmentElement(file);
      if (attachmentEl) {
        messageDiv.appendChild(attachmentEl);
      }
    }

    if (text) {
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('message-content');
      contentDiv.innerHTML = formatMessageText(text);
      messageDiv.appendChild(contentDiv);
    }

    chatBox.appendChild(messageDiv);
    scrollToBottom();
    return messageDiv;
  }

  function updateBotReply(messageDiv, data) {
    const targetEl = messageDiv.querySelector('.message-content') || messageDiv;
    if (data.reply) {
      targetEl.innerHTML = formatMessageText(data.reply);
    } else {
      const errorParagraph = document.createElement('p');
      errorParagraph.style.color = '#ef4444';
      errorParagraph.textContent = data.error || CHAT_COPY.serverErrorFallback;
      targetEl.replaceChildren(errorParagraph);
    }
    scrollToBottom();
  }

  function updateBotNetworkError(messageDiv, errorText) {
    const targetEl = messageDiv.querySelector('.message-content') || messageDiv;
    const paragraph = targetEl.querySelector('p');
    if (paragraph) {
      paragraph.textContent = errorText;
    } else {
      targetEl.textContent = errorText;
    }
    scrollToBottom();
  }

  function reset() {
    chatBox.innerHTML = CHAT_COPY.resetGreetingHtml;
  }

  return {
    addMessage,
    updateBotReply,
    updateBotNetworkError,
    scrollToBottom,
    reset,
  };
}
