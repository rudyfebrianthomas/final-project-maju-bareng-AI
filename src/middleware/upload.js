const multer = require('multer');
const { MAX_FILE_SIZE_BYTES, ERROR_MESSAGES } = require('../constants/chat');

function isSupportedMimeType(mimetype) {
  return (
    mimetype.startsWith('image/') ||
    mimetype.startsWith('audio/') ||
    mimetype === 'application/pdf'
  );
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (isSupportedMimeType(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error(ERROR_MESSAGES.unsupportedFile));
  },
});

const uploadChatAttachment = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

module.exports = {
  upload,
  uploadChatAttachment,
  isSupportedMimeType,
};
