require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const chatRouter = require('./src/routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

// Pastikan halaman utama tetap ditemukan ketika working directory runtime
// berbeda, seperti pada Vercel Functions.
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use('/api/chat', chatRouter);

// Jalankan server hanya saat dipakai secara lokal. Di Vercel, Express diekspor
// sebagai serverless function dan Vercel yang menangani request serta port-nya.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
