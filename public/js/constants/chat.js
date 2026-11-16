export const MAX_TEXTAREA_HEIGHT = 140;
export const SCROLL_DELAY_MS = 30;
export const CHAT_API_ENDPOINT = '/api/chat';

export const FILE_PREVIEW_BADGES = {
  pdf: '📄 PDF',
  audio: '🎵 Audio',
};

export const CHAT_COPY = {
  loadingMessage: 'Career Buddy lagi menganalisis pesan kamu... 🤔',
  unsupportedFileAlert:
    'Hanya diperbolehkan mengunggah file Gambar, PDF, atau Audio!',
  serverErrorFallback: 'Terjadi kesalahan pada server.',
  networkError: 'Gagal terhubung ke server. Pastikan server aktif!',
  resetGreetingHtml: `
    <div class="message bot">
      <p>Halo lagi! Ada rencana atau kebingungan seputar karir IT apalagi nih yang mau kita bahas bareng? Ceritain aja, santai!</p>
    </div>
  `,
};
