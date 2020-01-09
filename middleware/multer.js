const multer = require('multer');
// specify storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// file validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // prevent the upload
    cb({ message: 'Unsupported File Format' }, false);
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1.024mb
  fileFilter
});
module.exports = upload;
