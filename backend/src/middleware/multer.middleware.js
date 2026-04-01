import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('uploads/', { recursive: true }, (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, 'uploads/');
      }
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.includes(ext) && allowedMimes.includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5MB limit

export default upload;
