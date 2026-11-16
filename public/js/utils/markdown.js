if (typeof marked !== 'undefined') {
  marked.setOptions({ breaks: true, gfm: true });
}

export function formatMessageText(text) {
  if (!text) return '';

  if (typeof marked !== 'undefined') {
    return marked.parse(text);
  }

  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
