import { CHAT_COPY, FILE_PREVIEW_BADGES } from '../constants/chat.js';

export function createFilePreviewController({
  fileInput,
  filePreview,
  previewImg,
  previewIcon,
  fileName,
  cancelFileBtn,
}) {
  function reset() {
    fileInput.value = '';
    previewImg.src = '';
    previewImg.style.display = 'none';
    previewIcon.style.display = 'none';
    fileName.textContent = '';
    filePreview.style.display = 'none';
  }

  function showIconPreview(label) {
    previewImg.style.display = 'none';
    previewIcon.textContent = label;
    previewIcon.style.display = 'inline-block';
    filePreview.style.display = 'flex';
  }

  function showImagePreview(file) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      previewImg.src = event.target.result;
      previewImg.style.display = 'block';
      previewIcon.style.display = 'none';
      filePreview.style.display = 'flex';
    };
    fileReader.readAsDataURL(file);
  }

  function handleFileChange() {
    const file = fileInput.files[0];
    if (!file) return;

    fileName.textContent = file.name;

    if (file.type.startsWith('image/')) {
      showImagePreview(file);
    } else if (file.type === 'application/pdf') {
      showIconPreview(FILE_PREVIEW_BADGES.pdf);
    } else if (file.type.startsWith('audio/')) {
      showIconPreview(FILE_PREVIEW_BADGES.audio);
    } else {
      alert(CHAT_COPY.unsupportedFileAlert);
      reset();
    }
  }

  fileInput.addEventListener('change', handleFileChange);
  cancelFileBtn.addEventListener('click', reset);

  return { reset };
}
