const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

const FALLBACK_SYSTEM_INSTRUCTION =
  'Anda adalah Tech Career Buddy, konsultan karir IT yang ramah dan hanya menjawab seputar dunia IT dan coding.';

const DEFAULT_FILE_PROMPTS = {
  pdf: 'Tolong baca dan review dokumen PDF ini (misal CV / resume / portofolio), lalu berikan feedback dan saran perbaikan agar dilirik HR IT.',
  audio:
    'Tolong dengarkan rekaman audio ini (misal simulasi interview / pertanyaan karir), lalu berikan tanggapan dan saran yang solutif.',
  image: 'Tolong jelaskan dan analisis gambar ini seputar dunia IT dan teknologi.',
};

const ERROR_MESSAGES = {
  unsupportedFile:
    'Format file tidak didukung! Hanya Gambar, PDF, dan Audio yang diperbolehkan.',
  serverOrApiKey:
    'Terjadi kesalahan pada server atau API Key belum disetel di .env.',
};

module.exports = {
  MAX_FILE_SIZE_BYTES,
  DEFAULT_GEMINI_MODEL,
  FALLBACK_SYSTEM_INSTRUCTION,
  DEFAULT_FILE_PROMPTS,
  ERROR_MESSAGES,
};
