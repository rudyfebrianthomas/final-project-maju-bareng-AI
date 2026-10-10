# 🚀 Tech Career Buddy - Konsultan Karir IT AI

Aplikasi chatbot asisten dan konsultan karir IT berbasis **Google Gemini AI**. Dirancang seperti teman diskusi yang santai, suportif, dan sopan untuk membantu merencanakan jenjang karir di dunia teknologi, menyusun roadmap belajar, serta me-review CV dan portofolio.

---

## ✨ Fitur Utama

- 🎯 **Konsultasi & Roadmap Karir IT**: Membantu menyusun langkah belajar terarah untuk berbagai bidang (Web Dev, Backend, Data Science, DevOps, Cyber Security, dll).
- 🛡️ **Fokus Khusus Dunia IT**: Hanya menjawab topik seputar teknologi, coding, dan karir IT. Pertanyaan di luar topik (seperti resep masakan, politik, atau percintaan) akan ditolak dengan ramah dan diarahkan kembali ke topik IT.
- 📁 **Dukungan Multimodal (Upload File)**:
  - 📄 **PDF**: Review CV / resume agar ramah ATS dan menarik bagi HR IT.
  - 🎵 **Audio**: Umpan balik simulasi latihan wawancara (*mock interview*) atau curhat karir.
  - 🖼️ **Gambar**: Review tangkapan layar portofolio, sertifikat, atau desain sistem.
- ✍️ **Format Teks Rapi**: Mendukung teks tebal (**bold**), miring (*italic*), poin-poin bertingkat (*list*), dan blok kode pemrograman (*code*).
- 📜 **System Prompt Dinamis**: Aturan persona AI tersimpan di file `SYSTEM_PROMPT.md` sehingga mudah diubah tanpa mengubah logika kode.

---

## 🛠️ Teknologi & Dependensi

- **Backend**: Node.js & Express
- **AI SDK**: `@google/genai` (Google Gen AI SDK terbaru)
- **File Upload**: `multer` (penanganan file Gambar, PDF, dan Audio ke memori buffer)
- **Konfigurasi & Keamanan**: `dotenv` & `cors`
- **Frontend**: HTML5, CSS3, JavaScript murni (Vanilla JS), dan library ringan `marked.js`

---

## 📁 Struktur Folder

```
final-project-maju-bareng-AI/
├── public/
│   ├── index.html        # Halaman antarmuka chat
│   ├── style.css         # Desain tampilan & balon percakapan
│   └── script.js         # Logika chat, upload file, & render markdown
├── .env                  # Konfigurasi API Key & Port
├── .env.example          # Contoh template file environment
├── .gitignore            # Daftar file yang diabaikan Git
├── package.json          # Daftar dependensi & script runner
├── server.js             # Server Express, Multer, & integrasi Gemini AI
├── SYSTEM_PROMPT.md      # Instruksi aturan & kepribadian AI
└── README.md             # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Dapatkan Gemini API Key
Dapatkan API Key gratis di [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Atur File `.env`
Buka file `.env` di direktori proyek dan masukkan API Key Anda:
```env
PORT=3000
GEMINI_API_KEY=masukkan_api_key_anda_di_sini
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Install Dependensi (jika baru pertama kali)
```bash
npm install
```

### 4. Jalankan Server
```bash
npm start
```
> Atau gunakan `npm run dev` untuk mode development (otomatis reload saat file diedit).

### 5. Buka di Browser
Buka browser dan kunjungi:
```
http://localhost:3000
```
