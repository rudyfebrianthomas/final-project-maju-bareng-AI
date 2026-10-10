// Ambil elemen HTML yang dibutuhkan
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const fileInput = document.getElementById('fileInput');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

// Elemen Preview Lampiran File (Gambar, PDF, Audio)
const filePreview = document.getElementById('filePreview');
const previewImg = document.getElementById('previewImg');
const previewIcon = document.getElementById('previewIcon');
const fileName = document.getElementById('fileName');
const cancelFileBtn = document.getElementById('cancelFileBtn');

// 1. Tampilkan preview ketika user memilih file (Gambar, PDF, atau Audio)
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  fileName.textContent = file.name;

  if (file.type.startsWith('image/')) {
    // Preview Gambar
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      previewIcon.style.display = 'none';
      filePreview.style.display = 'flex';
    };
    fileReader.readAsDataURL(file);
  } else if (file.type === 'application/pdf') {
    // Preview Dokumen PDF
    previewImg.style.display = 'none';
    previewIcon.textContent = '📄 PDF';
    previewIcon.style.display = 'inline-block';
    filePreview.style.display = 'flex';
  } else if (file.type.startsWith('audio/')) {
    // Preview File Audio
    previewImg.style.display = 'none';
    previewIcon.textContent = '🎵 Audio';
    previewIcon.style.display = 'inline-block';
    filePreview.style.display = 'flex';
  } else {
    alert('Hanya diperbolehkan mengunggah file Gambar, PDF, atau Audio!');
    resetFileInput();
  }
});

// 2. Tombol untuk membatalkan file yang dipilih
cancelFileBtn.addEventListener('click', () => {
  resetFileInput();
});

function resetFileInput() {
  fileInput.value = '';
  previewImg.src = '';
  previewImg.style.display = 'none';
  previewIcon.style.display = 'none';
  fileName.textContent = '';
  filePreview.style.display = 'none';
}

// Konfigurasi Marked jika library tersedia
if (typeof marked !== 'undefined') {
  marked.setOptions({ breaks: true, gfm: true });
}

// Fungsi untuk memformat teks (mendukung **bold**, *italic*, `code`, list, dan baris baru)
function formatMessageText(text) {
  if (!text) return '';
  if (typeof marked !== 'undefined') {
    return marked.parse(text);
  }
  // Fallback sederhana menggunakan Regex jika library belum siap
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// Fungsi untuk scroll otomatis ke pesan terbawah agar chat panjang tidak terpotong
function scrollToBottom() {
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 30);
}

// 3. Auto-resize tinggi textarea saat user mengetik banyak baris
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 140)}px`;
});

// 4. Tombol Enter untuk kirim, Shift + Enter untuk membuat baris baru
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Shift + Enter -> Biarkan default (membuat baris baru)
      return;
    } else {
      // Enter saja -> Kirim formulir pesan
      e.preventDefault();
      chatForm.requestSubmit();
    }
  }
});

// 5. Fungsi untuk menambahkan pesan ke dalam chat box
function addMessage(sender, text, fileObj = null) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  // Jika ada file lampiran dari user
  if (fileObj) {
    if (fileObj.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(fileObj);
      messageDiv.appendChild(img);
    } else if (fileObj.type.startsWith('audio/')) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = URL.createObjectURL(fileObj);
      messageDiv.appendChild(audio);
    } else if (fileObj.type === 'application/pdf') {
      const badge = document.createElement('div');
      badge.classList.add('message-file-badge');
      badge.textContent = `📄 ${fileObj.name}`;
      messageDiv.appendChild(badge);
    }
  }

  // Isi teks pesan dengan format (Bold, Italic, Code, dll)
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

// 6. Tangani saat form chat disubmit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  const file = fileInput.files[0];

  // Jangan kirim jika input teks dan file sama-sama kosong
  if (!text && !file) {
    return;
  }

  // Tampilkan pesan pengguna di chat
  addMessage('user', text, file);

  // Kosongkan input form & reset tinggi textarea
  messageInput.value = '';
  messageInput.style.height = 'auto';
  const fileToSend = file;
  resetFileInput();

  // Matikan tombol kirim sementara & tampilkan status loading
  sendBtn.disabled = true;
  const loadingMessage = addMessage('bot', 'Career Buddy lagi menganalisis pesan kamu... 🤔');

  // Siapkan data untuk dikirim ke backend
  const formData = new FormData();
  if (text) formData.append('message', text);
  if (fileToSend) {
    formData.append('file', fileToSend);
    formData.append('image', fileToSend); // Kompatibilitas ganda
  }

  try {
    // Kirim request ke backend Express
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    const targetEl = loadingMessage.querySelector('.message-content') || loadingMessage;
    if (data.reply) {
      // Tampilkan jawaban asli dari Gemini dengan format tebal/bold & Markdown
      targetEl.innerHTML = formatMessageText(data.reply);
    } else {
      targetEl.innerHTML = `<p style="color: #ef4444;">${data.error || 'Terjadi kesalahan pada server.'}</p>`;
    }
    scrollToBottom();
  } catch (error) {
    console.error('Error saat fetch chat:', error);
    loadingMessage.querySelector('p').textContent = 'Gagal terhubung ke server. Pastikan server aktif!';
    scrollToBottom();
  } finally {
    // Hidupkan kembali tombol kirim
    sendBtn.disabled = false;
    messageInput.focus();
    scrollToBottom();
  }
});

// 5. Tombol Reset / Hapus Chat
clearBtn.addEventListener('click', () => {
  chatBox.innerHTML = `
    <div class="message bot">
      <p>Halo lagi! Ada rencana atau kebingungan seputar karir IT apalagi nih yang mau kita bahas bareng? Ceritain aja, santai!</p>
    </div>
  `;
});
