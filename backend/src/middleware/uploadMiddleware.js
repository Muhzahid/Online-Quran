import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/ApiResponse.js';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(uploadRoot, req.uploadFolder || 'misc');
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safe);
  },
});

const allowedMime = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

export const createUploader = ({ folder = 'misc', type = 'image', maxSizeMb = 5 } = {}) => {
  return multer({
    storage: cloudinaryEnabled ? multer.memoryStorage() : diskStorage,
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      req.uploadFolder = folder;
      const list = allowedMime[type] || allowedMime.image;
      if (!list.includes(file.mimetype)) {
        return cb(new AppError(`Invalid file type: ${file.mimetype}`, 400));
      }
      cb(null, true);
    },
  });
};

export const filePublicUrl = (req, filename, folder = 'misc') => {
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${folder}/${filename}`;
};

export const uploadToCloudinary = (file, folder = 'misc') => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
    if (error) reject(error);
    else resolve({ url: result.secure_url, publicId: result.public_id });
  });
  stream.end(file.buffer);
});

export const isCloudinaryEnabled = () => cloudinaryEnabled;
