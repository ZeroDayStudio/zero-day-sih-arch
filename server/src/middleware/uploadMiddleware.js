const fs = require('fs');
const path = require('path');
const multer = require('multer');

const evidenceDirectory = path.join(__dirname, '../../uploads/evidence');
fs.mkdirSync(evidenceDirectory, { recursive: true });

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

const storage = multer.diskStorage({
  destination: evidenceDirectory,
  filename: (req, file, callback) => callback(null, `${Date.now()}-${sanitizeFilename(file.originalname)}`),
});

const uploadEvidence = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    callback(allowed.includes(file.mimetype) ? null : new Error('Only PDF, PNG, and JPEG evidence files are allowed'), allowed.includes(file.mimetype));
  },
});

module.exports = { uploadEvidence };
