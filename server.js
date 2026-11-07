require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir)); // Menyajikan folder public (HTML, CSS, JS)

// Pastikan halaman utama tetap ditemukan ketika working directory runtime
// berbeda, seperti pada Vercel Functions.
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Konfigurasi Multer untuk menangani upload Gambar, PDF, dan Audio (disimpan di RAM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // Maksimal 20MB
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isAudio = file.mimetype.startsWith('audio/');
    const isPdf = file.mimetype === 'application/pdf';

    if (isImage || isAudio || isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung! Hanya Gambar, PDF, dan Audio yang diperbolehkan.'));
    }
  },
});

// Inisialisasi Gemini AI dengan API Key dari file .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Fungsi untuk membaca aturan instruksi sistem dari file SYSTEM_PROMPT.md
function getSystemInstruction() {
  try {
    return fs.readFileSync(path.join(__dirname, 'SYSTEM_PROMPT.md'), 'utf-8');
  } catch (err) {
    return 'Anda adalah Tech Career Buddy, konsultan karir IT yang ramah dan hanya menjawab seputar dunia IT dan coding.';
  }
}

// Endpoint untuk menerima pesan chat dan lampiran (Gambar, PDF, Audio)
app.post('/api/chat', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  try {
    const userMessage = req.body.message || '';
    const uploadedFile = req.file || (req.files && (req.files.file?.[0] || req.files.image?.[0]));
    const parts = [];

    // 1. Jika ada lampiran (Gambar, PDF, Audio), ubah Buffer ke Base64
    if (uploadedFile) {
      parts.push({
        inlineData: {
          mimeType: uploadedFile.mimetype,
          data: uploadedFile.buffer.toString('base64'),
        },
      });
    }

    // 2. Tambahkan pesan teks dari pengguna atau prompt default sesuai tipe file
    if (userMessage) {
      parts.push({ text: userMessage });
    } else if (uploadedFile) {
      if (uploadedFile.mimetype === 'application/pdf') {
        parts.push({ text: 'Tolong baca dan review dokumen PDF ini (misal CV / resume / portofolio), lalu berikan feedback dan saran perbaikan agar dilirik HR IT.' });
      } else if (uploadedFile.mimetype.startsWith('audio/')) {
        parts.push({ text: 'Tolong dengarkan rekaman audio ini (misal simulasi interview / pertanyaan karir), lalu berikan tanggapan dan saran yang solutif.' });
      } else {
        parts.push({ text: 'Tolong jelaskan dan analisis gambar ini seputar dunia IT dan teknologi.' });
      }
    }

    // 3. Panggil Gemini AI dengan menyertakan aturan instruksi sistem
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: parts,
      config: {
        systemInstruction: getSystemInstruction(),
      },
    });

    // 4. Kirim balasan kembali ke frontend
    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      error: 'Terjadi kesalahan pada server atau API Key belum disetel di .env.' 
    });
  }
});

// Jalankan server hanya saat dipakai secara lokal. Di Vercel, Express diekspor
// sebagai serverless function dan Vercel yang menangani request serta port-nya.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
