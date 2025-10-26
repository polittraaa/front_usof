import multer from 'multer';
import path from 'path';

// Destination folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const numName = `${req.session.userId}-${Date.now()}${ext}`;
    cb(null, numName);
  },
});

// File typ filtration
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) { 
        cb(null, true); 
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;